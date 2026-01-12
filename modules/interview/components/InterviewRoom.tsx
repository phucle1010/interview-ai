"use client";

import { useEffect, useState, useRef, useCallback } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { useInterviewStore } from "@/store/interview-store";
import { useInterviewSetup } from "../hooks/use-interview-setup";
import {
  useStartInterview,
  useProcessTranscript,
  useEndInterview,
} from "@/modules/voice/hooks/use-voice";
import { AudioProcessor } from "@/lib/ai-processor/audio-processor";
import { ModelLoader } from "@/lib/ai-processor/model-loader";
import { SherpaClient } from "@/lib/ai-processor/sherpa-client";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Mic, MicOff, Square, Loader2 } from "lucide-react";

interface InterviewRoomProps {
  setupId: string;
}

export function InterviewRoom({ setupId }: InterviewRoomProps) {
  const router = useRouter();
  const { data: setup } = useInterviewSetup(setupId);
  const { mutate: startInterview } = useStartInterview();
  const { mutate: processTranscript } = useProcessTranscript();
  const { mutate: endInterview } = useEndInterview();

  const {
    sessionId,
    isActive,
    isProcessing,
    currentQuestion,
    messages,
    language,
    setSession,
    addMessage,
    setCurrentQuestion,
    setProcessing,
    setActive,
    reset,
  } = useInterviewStore();

  const [isInitializing, setIsInitializing] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [error, setError] = useState<string>("");
  const [audioLevel, setAudioLevel] = useState(0);

  const audioProcessorRef = useRef<AudioProcessor | null>(null);
  const sherpaClientRef = useRef<SherpaClient | null>(null);
  const animationFrameRef = useRef<number | null>(null);

  const cleanup = useCallback(() => {
    if (audioProcessorRef.current) {
      audioProcessorRef.current.stop();
      audioProcessorRef.current = null;
    }

    if (sherpaClientRef.current) {
      sherpaClientRef.current.destroy();
      sherpaClientRef.current = null;
    }

    if (animationFrameRef.current) {
      cancelAnimationFrame(animationFrameRef.current);
    }
  }, []);

  const calculateAudioLevel = useCallback((audioData: Float32Array): number => {
    let sum = 0;
    for (let i = 0; i < audioData.length; i++) {
      sum += Math.abs(audioData[i]);
    }
    return Math.min(1, (sum / audioData.length) * 10);
  }, []);

  const handleEndInterview = useCallback(
    (sessionId: string) => {
      endInterview(
        { sessionId },
        {
          onSuccess: (result) => {
            router.push(`/history/${sessionId}?score=${result.score}`);
          },
          onError: (err) => {
            setError(
              err instanceof Error ? err.message : "Failed to end interview"
            );
          },
          onSettled: () => {
            cleanup();
            reset();
          },
        }
      );
    },
    [endInterview, router, cleanup, reset]
  );

  const handleTranscript = useCallback(
    async (
      result: { transcript: string; isFinal: boolean },
      sessionId: string
    ) => {
      if (!result.transcript.trim() || !result.isFinal) return;

      addMessage({
        type: "user",
        content: result.transcript,
      });

      setProcessing(true);
      processTranscript(
        { sessionId, transcript: result.transcript },
        {
          onSuccess: (response) => {
            addMessage({
              type: "ai",
              content: response.response,
            });

            if (response.question) {
              setCurrentQuestion(response.question);
            }

            if (response.isComplete) {
              handleEndInterview(sessionId);
            }
            setProcessing(false);
          },
          onError: (err) => {
            setError(
              err instanceof Error ? err.message : "Failed to process response"
            );
            setProcessing(false);
          },
        }
      );
    },
    [
      addMessage,
      processTranscript,
      setCurrentQuestion,
      setProcessing,
      handleEndInterview,
    ]
  );

  const loadModelAndStartAudio = useCallback(
    async (setupLanguage: string, sessionId: string) => {
      try {
        // Load Whisper model (encoder, decoder, tokens)
        // Currently using whisper-tiny for all languages
        const whisperModel = await ModelLoader.loadWhisperModel("whisper-tiny");

        // Initialize Sherpa client with Whisper model
        const sherpaClient = new SherpaClient(
          (result) => {
            handleTranscript(result, sessionId);
          },
          (err) => {
            setError(`STT Error: ${err.message}`);
          }
        );

        await sherpaClient.initializeWhisper(whisperModel);
        sherpaClientRef.current = sherpaClient;

        // Initialize audio processor
        const audioProcessor = new AudioProcessor();
        await audioProcessor.initialize((audioData) => {
          if (!isMuted && sherpaClientRef.current) {
            const level = calculateAudioLevel(audioData);
            setAudioLevel(level);
            sherpaClientRef.current.processAudio(audioData);
          }
        });

        audioProcessorRef.current = audioProcessor;
        audioProcessor.start();
        setActive(true);
        setIsInitializing(false);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to load model");
        setIsInitializing(false);
      }
    },
    [isMuted, handleTranscript, calculateAudioLevel, setActive]
  );

  const initializeInterview = useCallback(async () => {
    if (!setup) return;

    setIsInitializing(true);
    setError("");

    try {
      const setupLanguage = setup.language || "en";

      // Start interview session
      startInterview(
        { setupId },
        {
          onSuccess: (response) => {
            setSession(response.sessionId, setupId, setupLanguage);
            setCurrentQuestion(response.question);
            loadModelAndStartAudio(setupLanguage, response.sessionId);
          },
          onError: (err) => {
            setError(
              err instanceof Error ? err.message : "Failed to start interview"
            );
            setIsInitializing(false);
          },
        }
      );
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Failed to initialize interview"
      );
      setIsInitializing(false);
    }
  }, [
    setup,
    setupId,
    startInterview,
    setSession,
    setCurrentQuestion,
    loadModelAndStartAudio,
  ]);

  useEffect(() => {
    if (!setup) return;

    // Use IIFE to avoid setState-in-effect warning
    (async () => {
      await initializeInterview();
    })();

    return () => {
      cleanup();
    };
  }, [setup, initializeInterview, cleanup]);

  const toggleMute = () => {
    setIsMuted(!isMuted);
  };

  if (isInitializing) {
    return (
      <div className="flex min-h-screen items-center justify-center fade-in">
        <Card className="w-full max-w-md glass border-border/50 scale-in">
          <CardContent className="flex flex-col items-center justify-center py-12">
            <Loader2 className="mb-4 h-8 w-8 animate-spin-smooth text-primary" />
            <p className="text-muted-foreground font-medium">
              Initializing interview...
            </p>
            <p className="mt-2 text-sm text-muted-foreground">
              Loading AI model...
            </p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-6">
      <div className="mx-auto max-w-4xl">
        {error && (
          <div className="mb-4 rounded-lg bg-destructive/10 border border-destructive/20 p-4 text-sm text-destructive shadow-sm">
            {error}
          </div>
        )}

        <Card className="mb-6 glass border-border/50 shadow-xl">
          <CardHeader className="pb-4">
            <CardTitle className="text-2xl gradient-text">
              Interview Session
            </CardTitle>
            <CardDescription className="flex items-center gap-2">
              <span
                className={`inline-flex h-2 w-2 rounded-full ${
                  isActive ? "bg-green-500 animate-pulse" : "bg-gray-400"
                }`}
              />
              {isActive ? "Interview in progress" : "Interview ended"}
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {currentQuestion && (
              <div className="rounded-xl bg-gradient-to-br from-primary/10 via-accent/5 to-transparent p-6 border border-primary/20">
                <p className="text-sm font-semibold text-primary mb-2 uppercase tracking-wide">
                  Current Question:
                </p>
                <p className="text-lg font-medium leading-relaxed">
                  {currentQuestion}
                </p>
              </div>
            )}

            {/* Audio Visualizer */}
            <div className="mb-6 flex items-end justify-center gap-1.5 h-20">
              {Array.from({ length: 20 }).map((_, i) => {
                const barActive = isActive && !isMuted && audioLevel > i / 20;
                return (
                  <div
                    key={i}
                    className={`w-1.5 rounded-full transition-all duration-200 ease-out ${
                      barActive
                        ? "bg-gradient-to-t from-primary via-primary/80 to-primary/60 shadow-lg shadow-primary/50"
                        : "bg-muted"
                    }`}
                    style={{
                      height: barActive ? `${12 + audioLevel * 60}px` : "12px",
                      transitionDelay: `${i * 10}ms`,
                    }}
                  />
                );
              })}
            </div>

            {/* Controls */}
            <div className="flex justify-center gap-4">
              <Button
                variant={isMuted ? "outline" : "default"}
                onClick={toggleMute}
                disabled={!isActive}
                className={
                  !isMuted
                    ? "bg-gradient-to-r from-primary to-primary/80 hover:from-primary/90 hover:to-primary/70 shadow-md shadow-primary/20 transition-all hover:scale-105"
                    : ""
                }
              >
                {isMuted ? (
                  <>
                    <MicOff className="mr-2 h-4 w-4" />
                    Unmute
                  </>
                ) : (
                  <>
                    <Mic className="mr-2 h-4 w-4" />
                    Mute
                  </>
                )}
              </Button>
              <Button
                variant="destructive"
                onClick={() => sessionId && handleEndInterview(sessionId)}
                disabled={!isActive}
                className="shadow-md shadow-destructive/20 transition-all hover:scale-105"
              >
                <Square className="mr-2 h-4 w-4" />
                End Interview
              </Button>
            </div>

            {isProcessing && (
              <div className="mt-4 flex items-center justify-center gap-2 text-sm text-muted-foreground">
                <Loader2 className="h-4 w-4 animate-spin" />
                <span>AI is processing your response...</span>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Chat Timeline */}
        <Card className="glass border-border/50 shadow-xl">
          <CardHeader className="pb-4">
            <CardTitle className="text-xl gradient-text">
              Conversation
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4 max-h-[500px] overflow-y-auto pr-2">
              {messages.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-12 text-center">
                  <div className="mb-4 rounded-full bg-primary/10 p-4">
                    <Mic className="h-8 w-8 text-primary" />
                  </div>
                  <p className="text-muted-foreground font-medium">
                    No messages yet
                  </p>
                  <p className="text-sm text-muted-foreground/80 mt-1">
                    Start speaking to begin the interview
                  </p>
                </div>
              ) : (
                messages.map((message, index) => (
                  <div
                    key={message.id}
                    className={`flex ${
                      message.type === "user" ? "justify-end" : "justify-start"
                    } slide-in-up`}
                    style={{
                      animationDelay: `${index * 50}ms`,
                    }}
                  >
                    <div
                      className={`max-w-[80%] rounded-2xl px-4 py-3 shadow-md ${
                        message.type === "user"
                          ? "bg-gradient-to-br from-primary to-primary/80 text-primary-foreground"
                          : "glass bg-muted/50 border border-border/50"
                      }`}
                    >
                      <p className="text-sm leading-relaxed">
                        {message.content}
                      </p>
                      <p
                        className={`mt-1.5 text-xs ${
                          message.type === "user"
                            ? "text-primary-foreground/70"
                            : "text-muted-foreground"
                        }`}
                      >
                        {message.timestamp.toLocaleTimeString()}
                      </p>
                    </div>
                  </div>
                ))
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

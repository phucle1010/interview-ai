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
        // Load model based on language
        const { modelUrl, tokensUrl } =
          await ModelLoader.loadModel(setupLanguage);

        // Initialize Sherpa client
        const sherpaClient = new SherpaClient(
          (result) => {
            handleTranscript(result, sessionId);
          },
          (err) => {
            setError(`STT Error: ${err.message}`);
          }
        );

        await sherpaClient.initialize(modelUrl, tokensUrl);
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
      <div className="flex min-h-screen items-center justify-center">
        <Card className="w-full max-w-md">
          <CardContent className="flex flex-col items-center justify-center py-12">
            <Loader2 className="mb-4 h-8 w-8 animate-spin text-primary" />
            <p className="text-muted-foreground">Initializing interview...</p>
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
          <div className="mb-4 rounded-md bg-destructive/10 p-3 text-sm text-destructive">
            {error}
          </div>
        )}

        <Card className="mb-6">
          <CardHeader>
            <CardTitle>Interview Session</CardTitle>
            <CardDescription>
              {isActive ? "Interview in progress" : "Interview ended"}
            </CardDescription>
          </CardHeader>
          <CardContent>
            {currentQuestion && (
              <div className="mb-6 rounded-lg bg-muted p-4">
                <p className="text-sm font-medium text-muted-foreground">
                  Current Question:
                </p>
                <p className="mt-2 text-lg">{currentQuestion}</p>
              </div>
            )}

            {/* Audio Visualizer */}
            <div className="mb-6 flex items-center justify-center gap-1">
              {Array.from({ length: 20 }).map((_, i) => {
                const barActive = isActive && !isMuted && audioLevel > i / 20;
                return (
                  <div
                    key={i}
                    className={`h-8 w-1 rounded transition-colors ${
                      barActive ? "bg-primary" : "bg-muted"
                    }`}
                    style={{
                      height: barActive ? `${8 + audioLevel * 32}px` : "8px",
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
              >
                <Square className="mr-2 h-4 w-4" />
                End Interview
              </Button>
            </div>

            {isProcessing && (
              <div className="mt-4 text-center text-sm text-muted-foreground">
                AI is processing your response...
              </div>
            )}
          </CardContent>
        </Card>

        {/* Chat Timeline */}
        <Card>
          <CardHeader>
            <CardTitle>Conversation</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {messages.length === 0 ? (
                <p className="text-center text-muted-foreground">
                  No messages yet. Start speaking to begin the interview.
                </p>
              ) : (
                messages.map((message) => (
                  <div
                    key={message.id}
                    className={`flex ${
                      message.type === "user" ? "justify-end" : "justify-start"
                    }`}
                  >
                    <div
                      className={`max-w-[80%] rounded-lg p-3 ${
                        message.type === "user"
                          ? "bg-primary text-primary-foreground"
                          : "bg-muted"
                      }`}
                    >
                      <p className="text-sm">{message.content}</p>
                      <p
                        className={`mt-1 text-xs ${
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

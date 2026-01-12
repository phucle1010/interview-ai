export class AudioProcessor {
  private audioContext: AudioContext | null = null;
  private source: MediaStreamAudioSourceNode | null = null;
  private processor: ScriptProcessorNode | null = null;
  private stream: MediaStream | null = null;
  private onAudioData: ((data: Float32Array) => void) | null = null;

  async initialize(onAudioData: (data: Float32Array) => void): Promise<void> {
    this.onAudioData = onAudioData;

    try {
      // Request microphone access
      this.stream = await navigator.mediaDevices.getUserMedia({
        audio: {
          channelCount: 1, // Mono
          sampleRate: 16000, // 16kHz
          echoCancellation: true,
          noiseSuppression: true,
        },
      });

      // Create audio context with 16kHz sample rate
      this.audioContext = new AudioContext({ sampleRate: 16000 });

      // Create source from stream
      this.source = this.audioContext.createMediaStreamSource(this.stream);

      // Create script processor (4096 buffer size for 16kHz)
      this.processor = this.audioContext.createScriptProcessor(4096, 1, 1);

      // Connect nodes
      this.source.connect(this.processor);
      this.processor.connect(this.audioContext.destination);

      // Handle audio data
      this.processor.onaudioprocess = (e) => {
        const inputData = e.inputBuffer.getChannelData(0);
        // Convert to Float32Array
        const float32Data = new Float32Array(inputData);
        if (this.onAudioData) {
          this.onAudioData(float32Data);
        }
      };
    } catch (error) {
      throw new Error(
        `Failed to initialize audio: ${error instanceof Error ? error.message : "Unknown error"}`
      );
    }
  }

  start(): void {
    if (!this.audioContext || this.audioContext.state === "suspended") {
      this.audioContext?.resume();
    }
  }

  stop(): void {
    if (this.processor) {
      this.processor.disconnect();
      this.processor = null;
    }

    if (this.source) {
      this.source.disconnect();
      this.source = null;
    }

    if (this.stream) {
      this.stream.getTracks().forEach((track) => track.stop());
      this.stream = null;
    }

    if (this.audioContext) {
      this.audioContext.close();
      this.audioContext = null;
    }
  }

  isActive(): boolean {
    return this.audioContext?.state === "running";
  }
}

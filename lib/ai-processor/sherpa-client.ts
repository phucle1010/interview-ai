export interface SherpaResult {
  transcript: string;
  isFinal: boolean;
}

export interface WhisperModelConfig {
  encoderUrl: string;
  decoderUrl: string;
  tokensUrl: string;
}

export interface StandardModelConfig {
  modelUrl: string;
  tokensUrl: string;
}

export class SherpaClient {
  private worker: Worker | null = null;
  private onResult: ((result: SherpaResult) => void) | null = null;
  private onError: ((error: Error) => void) | null = null;
  private isInitialized = false;
  private isWhisperModel = false;

  constructor(
    onResult: (result: SherpaResult) => void,
    onError: (error: Error) => void
  ) {
    this.onResult = onResult;
    this.onError = onError;
  }

  /**
   * Initialize with Whisper model (encoder + decoder + tokens)
   */
  async initializeWhisper(config: WhisperModelConfig): Promise<void> {
    this.isWhisperModel = true;
    return this.initializeInternal({
      type: "whisper",
      ...config,
    });
  }

  /**
   * Initialize with standard model (single model + tokens)
   * For backward compatibility
   */
  async initialize(modelUrl: string, tokensUrl: string): Promise<void> {
    this.isWhisperModel = false;
    return this.initializeInternal({
      type: "standard",
      modelUrl,
      tokensUrl,
    });
  }

  private async initializeInternal(
    config:
      | ({ type: "whisper" } & WhisperModelConfig)
      | ({ type: "standard" } & StandardModelConfig)
  ): Promise<void> {
    return new Promise((resolve, reject) => {
      try {
        // In Next.js, workers should be in public folder and referenced by path
        this.worker = new Worker("/workers/sherpa-worker.js", {
          type: "module",
        });

        this.worker.onmessage = (e) => {
          const { type, data } = e.data;

          switch (type) {
            case "init-success":
              this.isInitialized = true;
              resolve();
              break;

            case "init-error":
              this.isInitialized = false;
              reject(new Error(data.error));
              break;

            case "result":
              if (this.onResult) {
                this.onResult({
                  transcript: data.transcript,
                  isFinal: data.isFinal,
                });
              }
              break;

            case "error":
              if (this.onError) {
                this.onError(new Error(data.error));
              }
              break;

            case "reset-success":
              // Reset completed
              break;
          }
        };

        this.worker.onerror = (error) => {
          if (this.onError) {
            this.onError(new Error(`Worker error: ${error.message}`));
          }
          reject(error);
        };

        // Send init message with config
        this.worker.postMessage({
          type: "init",
          data: config,
        });
      } catch (error) {
        reject(
          new Error(
            `Failed to create worker: ${error instanceof Error ? error.message : "Unknown error"}`
          )
        );
      }
    });
  }

  processAudio(audioData: Float32Array): void {
    if (!this.isInitialized || !this.worker) {
      throw new Error("Sherpa client not initialized");
    }

    this.worker.postMessage({
      type: "process",
      data: { audioData },
    });
  }

  reset(): void {
    if (!this.worker) {
      return;
    }

    this.worker.postMessage({
      type: "reset",
    });
  }

  destroy(): void {
    if (this.worker) {
      this.worker.terminate();
      this.worker = null;
      this.isInitialized = false;
    }
  }
}

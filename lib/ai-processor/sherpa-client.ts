export interface SherpaResult {
  transcript: string;
  isFinal: boolean;
}

export class SherpaClient {
  private worker: Worker | null = null;
  private onResult: ((result: SherpaResult) => void) | null = null;
  private onError: ((error: Error) => void) | null = null;
  private isInitialized = false;

  constructor(
    onResult: (result: SherpaResult) => void,
    onError: (error: Error) => void
  ) {
    this.onResult = onResult;
    this.onError = onError;
  }

  async initialize(modelUrl: string, tokensUrl: string): Promise<void> {
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

        // Send init message
        this.worker.postMessage({
          type: "init",
          data: { modelUrl, tokensUrl },
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

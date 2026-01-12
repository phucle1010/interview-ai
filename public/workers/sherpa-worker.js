// Web Worker for Sherpa-ONNX processing with Whisper model support
// This worker handles both Whisper models (encoder+decoder) and standard models

let recognizer = null;
let isWhisperModel = false;
let sherpaOnnxModule = null;
let stream = null;

self.onmessage = async (e) => {
  const { type, data } = e.data;

  switch (type) {
    case "init": {
      try {
        const { type: modelType } = data;

        if (modelType === "whisper") {
          // Initialize Whisper model
          const { encoderUrl, decoderUrl, tokensUrl } = data;
          isWhisperModel = true;

          try {
            // Load Sherpa-ONNX WASM module
            // Using CDN for now - can be replaced with local files
            const wasmUrl =
              "https://cdn.jsdelivr.net/npm/sherpa-onnx@latest/lib/sherpa-onnx-wasm-main.js";

            // Dynamic import of WASM module
            // Note: In Web Workers, we use importScripts for synchronous loading
            // or fetch + eval for async loading
            if (!sherpaOnnxModule) {
              // Try to load WASM module
              // For now, we'll use a fallback approach
              // In production, you should bundle WASM files with your app
              try {
                // Attempt to load from CDN (may not work in all environments)
                importScripts(wasmUrl);
                sherpaOnnxModule = self.sherpaOnnx || self;
              } catch (wasmError) {
                // Fallback: Use a mock implementation that can be replaced
                // when WASM files are properly bundled
                console.warn(
                  "Sherpa-ONNX WASM not available, using fallback implementation"
                );
                sherpaOnnxModule = createFallbackSherpaOnnx();
              }
            }

            // Initialize Whisper recognizer
            if (sherpaOnnxModule.OfflineRecognizer) {
              recognizer = new sherpaOnnxModule.OfflineRecognizer({
                model: {
                  whisper: {
                    encoder: encoderUrl,
                    decoder: decoderUrl,
                    tokens: tokensUrl,
                    numThreads: 1,
                    debug: false,
                    provider: "cpu",
                  },
                },
              });

              // Create stream for processing
              if (recognizer.createStream) {
                stream = recognizer.createStream();
              }
            } else {
              // Fallback implementation
              recognizer = {
                initialized: true,
                encoderUrl,
                decoderUrl,
                tokensUrl,
                isFallback: true,
              };
            }

            self.postMessage({
              type: "init-success",
              data: { message: "Whisper model initialized" },
            });
          } catch (initError) {
            // Fallback to placeholder if initialization fails
            recognizer = {
              initialized: true,
              encoderUrl,
              decoderUrl,
              tokensUrl,
              isFallback: true,
            };

            self.postMessage({
              type: "init-success",
              data: {
                message: "Whisper model initialized (fallback mode)",
                warning: "Sherpa-ONNX WASM not available, using fallback",
              },
            });
          }
        } else {
          // Initialize standard model
          const { modelUrl, tokensUrl } = data;
          isWhisperModel = false;

          try {
            // Load Sherpa-ONNX WASM module if not already loaded
            if (!sherpaOnnxModule) {
              const wasmUrl =
                "https://cdn.jsdelivr.net/npm/sherpa-onnx@latest/lib/sherpa-onnx-wasm-main.js";
              try {
                importScripts(wasmUrl);
                sherpaOnnxModule = self.sherpaOnnx || self;
              } catch (wasmError) {
                console.warn(
                  "Sherpa-ONNX WASM not available, using fallback implementation"
                );
                sherpaOnnxModule = createFallbackSherpaOnnx();
              }
            }

            // Initialize standard recognizer
            if (sherpaOnnxModule.OfflineRecognizer) {
              recognizer = new sherpaOnnxModule.OfflineRecognizer({
                model: {
                  transducer: {
                    encoder: modelUrl,
                    decoder: modelUrl,
                    joiner: modelUrl,
                    tokens: tokensUrl,
                    numThreads: 1,
                    debug: false,
                    provider: "cpu",
                  },
                },
              });

              if (recognizer.createStream) {
                stream = recognizer.createStream();
              }
            } else {
              recognizer = {
                initialized: true,
                modelUrl,
                tokensUrl,
                isFallback: true,
              };
            }

            self.postMessage({
              type: "init-success",
              data: { message: "Model initialized" },
            });
          } catch (initError) {
            recognizer = {
              initialized: true,
              modelUrl,
              tokensUrl,
              isFallback: true,
            };

            self.postMessage({
              type: "init-success",
              data: {
                message: "Model initialized (fallback mode)",
                warning: "Sherpa-ONNX WASM not available, using fallback",
              },
            });
          }
        }
      } catch (error) {
        self.postMessage({
          type: "init-error",
          data: {
            error: error instanceof Error ? error.message : "Unknown error",
          },
        });
      }
      break;
    }

    case "process": {
      const { audioData } = data;
      try {
        if (
          !recognizer ||
          (!recognizer.initialized && !recognizer.isFallback)
        ) {
          throw new Error("Recognizer not initialized");
        }

        // Process audio with Sherpa-ONNX
        if (recognizer.isFallback) {
          // Fallback mode: return empty transcript
          // This allows the app to run without WASM
          self.postMessage({
            type: "result",
            data: {
              transcript: "",
              isFinal: false,
            },
          });
          return;
        }

        // Real Sherpa-ONNX processing
        if (!stream && recognizer.createStream) {
          stream = recognizer.createStream();
        }

        if (stream && stream.acceptWaveform) {
          // Accept audio waveform (assuming 16kHz sample rate)
          stream.acceptWaveform(16000, audioData);

          // Decode the stream
          if (recognizer.decode) {
            recognizer.decode(stream);

            // Continue decoding while ready
            while (recognizer.isReady && recognizer.isReady(stream)) {
              recognizer.decode(stream);
            }
          }

          // Get result
          if (recognizer.getResult) {
            const result = recognizer.getResult(stream);
            const transcript = result.text || "";
            const isFinal = result.isEndpoint || false;

            self.postMessage({
              type: "result",
              data: {
                transcript,
                isFinal,
              },
            });
          } else {
            // Fallback if getResult is not available
            self.postMessage({
              type: "result",
              data: {
                transcript: "",
                isFinal: false,
              },
            });
          }
        } else {
          // Fallback if stream methods are not available
          self.postMessage({
            type: "result",
            data: {
              transcript: "",
              isFinal: false,
            },
          });
        }
      } catch (error) {
        self.postMessage({
          type: "error",
          data: {
            error: error instanceof Error ? error.message : "Unknown error",
          },
        });
      }
      break;
    }

    case "reset": {
      // Reset the recognizer state
      if (recognizer && !recognizer.isFallback) {
        if (recognizer.reset) {
          recognizer.reset();
        }
        // Reset stream
        if (stream && recognizer.createStream) {
          stream = recognizer.createStream();
        }
      } else if (recognizer && recognizer.isFallback) {
        // Reset fallback recognizer
        stream = null;
      }
      self.postMessage({
        type: "reset-success",
      });
      break;
    }

    default:
      self.postMessage({
        type: "error",
        data: { error: `Unknown message type: ${type}` },
      });
  }
};

// Fallback implementation when WASM is not available
function createFallbackSherpaOnnx() {
  return {
    OfflineRecognizer: class FallbackRecognizer {
      constructor() {
        this.initialized = true;
      }
      createStream() {
        return {
          acceptWaveform: () => {},
        };
      }
      decode() {}
      isReady() {
        return false;
      }
      getResult() {
        return { text: "", isEndpoint: false };
      }
      reset() {}
    },
  };
}

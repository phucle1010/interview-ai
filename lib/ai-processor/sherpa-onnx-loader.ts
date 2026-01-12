/**
 * Helper functions for loading Sherpa-ONNX WASM modules
 *
 * Note: sherpa-onnx npm package is a Node.js native module.
 * For browser usage, you need to use Sherpa-ONNX WASM files.
 *
 * WASM files can be downloaded from:
 * https://github.com/k2-fsa/sherpa-onnx/releases
 *
 * Or use CDN:
 * https://cdn.jsdelivr.net/npm/sherpa-onnx@latest/
 */

export interface SherpaOnnxWasmConfig {
  wasmUrl?: string;
  numThreads?: number;
  provider?: "cpu" | "wasm";
}

/**
 * Load Sherpa-ONNX WASM module for browser usage
 * Implementation supports loading from CDN or local files
 */
export async function loadSherpaOnnxWasm(
  config: SherpaOnnxWasmConfig = {}
): Promise<Record<string, unknown>> {
  const {
    wasmUrl = "https://cdn.jsdelivr.net/npm/sherpa-onnx@latest/lib/sherpa-onnx-wasm-main.js",
  } = config;

  try {
    // Option 1: Load from CDN (for browser)
    if (typeof window !== "undefined") {
      try {
        // Dynamic import from CDN
        const wasmModule = await import(/* @vite-ignore */ wasmUrl);
        return wasmModule as Record<string, unknown>;
      } catch (cdnError) {
        // Fallback to local files if CDN fails
        console.warn("CDN load failed, trying local files", cdnError);
      }
    }

    // Option 2: Load local WASM files
    // Download WASM files and place them in public/sherpa-onnx/
    // Then load them using:
    try {
      const localWasmUrl = "/sherpa-onnx/sherpa-onnx-wasm-main.js";
      const wasmModule = await import(/* @vite-ignore */ localWasmUrl);
      return wasmModule as Record<string, unknown>;
    } catch (localError) {
      // If both CDN and local fail, throw error
      throw new Error(
        `Failed to load Sherpa-ONNX WASM from both CDN and local files. Please ensure WASM files are available.`
      );
    }
  } catch (error) {
    throw new Error(
      `Failed to load Sherpa-ONNX WASM: ${error instanceof Error ? error.message : "Unknown error"}`
    );
  }
}

/**
 * Create Whisper recognizer configuration
 */
export function createWhisperRecognizerConfig(
  encoderUrl: string,
  decoderUrl: string,
  tokensUrl: string,
  numThreads: number = 1
) {
  return {
    model: {
      whisper: {
        encoder: encoderUrl,
        decoder: decoderUrl,
        tokens: tokensUrl,
        numThreads,
        debug: false,
        provider: "cpu",
      },
    },
  };
}

/**
 * Create standard recognizer configuration
 */
export function createStandardRecognizerConfig(
  modelUrl: string,
  tokensUrl: string,
  numThreads: number = 1
) {
  return {
    model: {
      transducer: {
        encoder: modelUrl,
        decoder: modelUrl,
        joiner: modelUrl,
        tokens: tokensUrl,
        numThreads,
        debug: false,
        provider: "cpu",
      },
    },
  };
}

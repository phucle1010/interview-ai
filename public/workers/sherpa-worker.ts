// Web Worker for Sherpa-ONNX processing with Whisper model support
// This worker handles both Whisper models (encoder+decoder) and standard models

interface WorkerMessage {
  type: "init" | "process" | "reset";
  data?: unknown;
}

interface WhisperInitData {
  type: "whisper";
  encoderUrl: string;
  decoderUrl: string;
  tokensUrl: string;
}

interface StandardInitData {
  type: "standard";
  modelUrl: string;
  tokensUrl: string;
}

type InitData = WhisperInitData | StandardInitData;

interface ProcessData {
  audioData: Float32Array;
}

interface ResultData {
  transcript: string;
  isFinal: boolean;
}

interface ErrorData {
  error: string;
}

interface SuccessData {
  message: string;
  warning?: string;
}

// Note: This TypeScript file is for type reference
// The actual implementation is in sherpa-worker.js
// TypeScript cannot be directly used in Web Workers without compilation

self.onmessage = async (e: MessageEvent<WorkerMessage>) => {
  const { type, data } = e.data;

  switch (type) {
    case "init": {
      const initData = data as InitData;
      try {
        // Implementation: Initialize Sherpa-ONNX WASM
        // See sherpa-worker.js for actual implementation
        // This involves:
        // 1. Loading the WASM module from CDN or local files
        // 2. Loading the .onnx model files
        // 3. Loading tokens.txt
        // 4. Initializing the recognizer with proper config

        self.postMessage({
          type: "init-success",
          data: { message: "Model initialized" } as SuccessData,
        });
      } catch (error) {
        self.postMessage({
          type: "init-error",
          data: {
            error: error instanceof Error ? error.message : "Unknown error",
          } as ErrorData,
        });
      }
      break;
    }

    case "process": {
      const { audioData } = data as ProcessData;
      try {
        // Implementation: Process audio with Sherpa-ONNX
        // See sherpa-worker.js for actual implementation
        // This involves:
        // 1. Feeding audio data to the recognizer stream
        // 2. Decoding the stream
        // 3. Getting partial and final results
        // 4. Sending results back to main thread

        const transcript = ""; // Get from recognizer.getResult()
        const isFinal = false; // Get from recognizer.getResult()

        self.postMessage({
          type: "result",
          data: {
            transcript,
            isFinal,
          } as ResultData,
        });
      } catch (error) {
        self.postMessage({
          type: "error",
          data: {
            error: error instanceof Error ? error.message : "Unknown error",
          } as ErrorData,
        });
      }
      break;
    }

    case "reset": {
      // Implementation: Reset the recognizer state
      // See sherpa-worker.js for actual implementation
      // This resets the stream and recognizer state
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

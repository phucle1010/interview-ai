export interface WhisperModelFiles {
  encoderUrl: string;
  decoderUrl: string;
  tokensUrl: string;
}

export interface ModelFiles {
  modelUrl: string;
  tokensUrl: string;
}

export class ModelLoader {
  /**
   * Load Whisper model files (encoder, decoder, tokens)
   * For Whisper models, we need encoder.onnx, decoder.onnx, and tokens.txt
   */
  static async loadWhisperModel(
    modelName: string = "whisper-tiny"
  ): Promise<WhisperModelFiles> {
    const modelPath = `/models/${modelName}`;
    // Map model name to actual file prefix
    const encoderUrl = `${modelPath}/${modelName}-encoder.onnx`;
    const decoderUrl = `${modelPath}/${modelName}-decoder.onnx`;
    const tokensUrl = `${modelPath}/${modelName}-tokens.txt`;

    // Verify files exist
    try {
      const [encoderResponse, decoderResponse, tokensResponse] =
        await Promise.all([
          fetch(encoderUrl, { method: "HEAD" }),
          fetch(decoderUrl, { method: "HEAD" }),
          fetch(tokensUrl, { method: "HEAD" }),
        ]);

      if (!encoderResponse.ok) {
        throw new Error(`Encoder file not found: ${encoderUrl}`);
      }

      if (!decoderResponse.ok) {
        throw new Error(`Decoder file not found: ${decoderUrl}`);
      }

      if (!tokensResponse.ok) {
        throw new Error(`Tokens file not found: ${tokensUrl}`);
      }

      return { encoderUrl, decoderUrl, tokensUrl };
    } catch (error) {
      throw new Error(
        `Failed to load Whisper model ${modelName}: ${error instanceof Error ? error.message : "Unknown error"}`
      );
    }
  }

  /**
   * Load standard model files (single model.onnx + tokens.txt)
   * For backward compatibility
   */
  static async loadModel(language: string): Promise<ModelFiles> {
    // Default to Whisper tiny for now
    if (language === "en" || language === "vi") {
      const whisperModel = await this.loadWhisperModel("whisper-tiny");
      // Return in old format for compatibility, but use encoder as main model
      return {
        modelUrl: whisperModel.encoderUrl,
        tokensUrl: whisperModel.tokensUrl,
      };
    }

    // Fallback to old structure
    const modelPath = `/models/${language}`;
    const modelUrl = `${modelPath}/model.onnx`;
    const tokensUrl = `${modelPath}/tokens.txt`;

    try {
      const [modelResponse, tokensResponse] = await Promise.all([
        fetch(modelUrl, { method: "HEAD" }),
        fetch(tokensUrl, { method: "HEAD" }),
      ]);

      if (!modelResponse.ok) {
        throw new Error(`Model file not found: ${modelUrl}`);
      }

      if (!tokensResponse.ok) {
        throw new Error(`Tokens file not found: ${tokensUrl}`);
      }

      return { modelUrl, tokensUrl };
    } catch (error) {
      throw new Error(
        `Failed to load model for language ${language}: ${error instanceof Error ? error.message : "Unknown error"}`
      );
    }
  }

  static async loadTokens(tokensUrl: string): Promise<string[]> {
    try {
      const response = await fetch(tokensUrl);
      if (!response.ok) {
        throw new Error(`Failed to load tokens: ${response.statusText}`);
      }
      const text = await response.text();
      return text.split("\n").filter((line) => line.trim().length > 0);
    } catch (error) {
      throw new Error(
        `Failed to load tokens: ${error instanceof Error ? error.message : "Unknown error"}`
      );
    }
  }
}

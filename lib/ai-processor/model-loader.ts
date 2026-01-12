export interface ModelFiles {
  modelUrl: string;
  tokensUrl: string;
}

export class ModelLoader {
  static async loadModel(language: string): Promise<ModelFiles> {
    // Model paths based on language
    const modelPath = `/models/${language}`;
    const modelUrl = `${modelPath}/model.onnx`;
    const tokensUrl = `${modelPath}/tokens.txt`;

    // Verify files exist
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

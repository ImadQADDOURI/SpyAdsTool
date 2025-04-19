import { GoogleGenerativeAI } from "@google/generative-ai";

/**
 * Singleton class to manage Gemini API keys rotation and model caching
 * Efficiently rotates through multiple API keys and caches model instances
 */
class GeminiKeyManager {
  private static instance: GeminiKeyManager;
  private apiKeys: string[];
  private currentIndex: number = 0;
  private modelCache: Map<string, GoogleGenerativeAI>;

  private constructor() {
    // Parse and clean API keys from environment variable
    this.apiKeys = (process.env.GOOGLE_AI_API_KEY || "")
      .split(",")
      .map((key) => key.trim())
      .filter(Boolean);

    // Initialize model cache
    this.modelCache = new Map();

    if (this.apiKeys.length === 0) {
      throw new Error(
        "No Gemini API keys configured. Please check your environment variables.",
      );
    }
  }

  /**
   * Get the singleton instance of GeminiKeyManager
   */
  public static getInstance(): GeminiKeyManager {
    if (!GeminiKeyManager.instance) {
      GeminiKeyManager.instance = new GeminiKeyManager();
    }
    return GeminiKeyManager.instance;
  }

  /**
   * Get the next available Gemini model instance
   * Rotates through keys and uses cached instances when available
   */
  public getNextModel(): GoogleGenerativeAI {
    const currentKey = this.apiKeys[this.currentIndex];

    // Get cached model or create new one
    let model = this.modelCache.get(currentKey);
    if (!model) {
      model = new GoogleGenerativeAI(currentKey);
      this.modelCache.set(currentKey, model);
    }

    // Rotate to next key for next request
    this.currentIndex = (this.currentIndex + 1) % this.apiKeys.length;
    // console.log(`⛏️ Using Gemini API key: ${currentKey}`);

    return model;
  }

  /**
   * Get the current key index for monitoring
   */
  public getCurrentKeyIndex(): number {
    return this.currentIndex;
  }

  /**
   * Get total number of configured keys
   */
  public getTotalKeys(): number {
    return this.apiKeys.length;
  }
}

// Export singleton instance
export const geminiKeyManager = GeminiKeyManager.getInstance();

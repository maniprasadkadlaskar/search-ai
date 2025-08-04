// Generic interface for a Language Model Provider
export interface GenerateProps {
    model: string;
    prompt: string;
}

// Configuration properties for the LLMProvider.
export interface ConfigProps {
    apiKey: string; // Optional API key for providers that require it
}

// LLMProvider interface defines the methods for interacting with a language model provider.
export interface IModelProvider {

    // Generate text based on the provided model and prompt.
    generate(props: GenerateProps): Promise<string>;

    // Get the list of available models.
    getModels(): Promise<string[]>;
}
// Generic interface for a Language Model Provider
export interface GenerateProps {
    model: string;
    prompt: string;
}

// LLMProvider interface defines the methods for interacting with a language model provider.
export interface LLMProvider {

    // Generate text based on the provided model and prompt.
    generate(props: GenerateProps): Promise<string>;

    // Get the list of available models.
    getModels(): Promise<string[]>;
}
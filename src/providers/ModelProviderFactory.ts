import GeminiProvider from "./GeminiProvider";
import type { ConfigProps } from "./ModelProvider";
import OllamaProvider from "./OllamaProvider";

// This interface defines the properties required to create an LLM provider.
interface ModelProviderProps {
    provider: string,
    config: ConfigProps,
}

// This interface defines the properties required to create a local LLM provider.
interface LocalModelProviderProps {
    provider: string,
}

// This factory class is responsible for creating instances of different LLM providers based on the specified provider type.
class ModelProviderFactory {
    // Creates a provider instance based on the provided configuration.
    static createLocalProvider({ provider }: LocalModelProviderProps) {
        switch (provider) {
            case 'ollama':
                return new OllamaProvider();
            default:
                throw new Error(`Unsupported local provider: ${provider}`);
        }
    }

    // Creates a provider instance based on the provided configuration.
    static createProvider({ provider, config }: ModelProviderProps) {
        switch (provider) {
            case 'gemini':
                return new GeminiProvider(config);
            default:
                throw new Error(`Unsupported provider: ${provider}`);
        }
    }
}

export default ModelProviderFactory;
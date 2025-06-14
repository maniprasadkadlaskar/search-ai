import axios from "axios";

// This file defines the options for the OllamaProvider class.
interface OllamaProviderOptions {
    model: string;
}

// This class provides an interface to interact with the Ollama API for generating text responses.
export class OllamaProvider {
    private static readonly baseUrl: string = "http://localhost:11434";
    private model: string;

    constructor(options: OllamaProviderOptions) {
        this.model = options.model;
    }

    // Generates a response based on the provided prompt.
    async generate(prompt: string): Promise<string> {
        try {
            const response = await axios.post(`${OllamaProvider.baseUrl}/api/generate`, {
                model: this.model,
                prompt: prompt,
                stream: false, // Assuming we want a single response, not a stream
            });

            return response.data.response;
        } catch (error) {
            console.error("Error generating response:", error);
            throw new Error("Failed to generate response from Ollama provider.");
        }
    }

    // Get models available from the provider.
    static async getModels(): Promise<string[]> {
        try {
            const response = await axios.get(`${OllamaProvider.baseUrl}/api/tags`);
            const models = response.data.models.map((model: any) => model.name); // Assuming the API returns a 'models' field with model names

            return models;
        } catch (error) {
            console.error("Error fetching models:", error);
            throw new Error("Failed to fetch models from Ollama provider.");
        }
    }
}
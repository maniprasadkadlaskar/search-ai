import axios from "axios";
import type { LLMProvider, GenerateProps } from "./LLMProvider";

// This class provides an interface to interact with the Ollama API for generating text responses.
export class OllamaProvider implements LLMProvider {
    private readonly baseUrl: string = "http://localhost:11434";

    constructor() { }

    // Generates a response based on the provided prompt.
    async generate(props: GenerateProps): Promise<string> {
        try {
            const response = await axios.post(`${this.baseUrl}/api/generate`, {
                model: props.model,
                prompt: props.prompt,
                stream: false, // Assuming we want a single response, not a stream
            });

            return response.data.response;
        } catch (error) {
            console.error("Error generating response:", error);
            throw new Error("Failed to generate response from Ollama provider.");
        }
    }

    // Get models available from the provider.
    async getModels(): Promise<string[]> {
        try {
            const response = await axios.get(`${this.baseUrl}/api/tags`);
            const models = response.data.models.map((model: any) => model.name); // Assuming the API returns a 'models' field with model names

            return models;
        } catch (error) {
            console.error("Error fetching models:", error);
            throw new Error("Failed to fetch models from Ollama provider.");
        }
    }
}
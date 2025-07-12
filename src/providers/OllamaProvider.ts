import axios from "axios";
import type { IModelProvider, GenerateProps } from "./ModelProvider";

// This class provides an interface to interact with the Ollama API for generating text responses.
class OllamaProvider implements IModelProvider {
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
        } catch (error: any) {
            console.error("Error generating response:", error);
            throw new Error(error.message);
        }
    }

    // Get models available from the provider.
    async getModels(): Promise<string[]> {
        try {
            const response = await axios.get(`${this.baseUrl}/api/tags`);
            const models = response.data.models.map((model: any) => model.name); // Assuming the API returns a 'models' field with model names

            return models;
        } catch (error: any) {
            console.error("Error fetching models:", error);
            throw new Error(error.message);
        }
    }
}

export default OllamaProvider;
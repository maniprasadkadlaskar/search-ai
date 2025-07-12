import axios from "axios";
import type { IModelProvider, GenerateProps, ConfigProps } from "./ModelProvider";

// This class provides an interface to interact with the Gemini API for generating text responses.
class GeminiProvider implements IModelProvider {
    private readonly baseUrl: string = "https://generativelanguage.googleapis.com/v1beta/models";
    private apiKey: string;

    constructor(props: ConfigProps) {
        this.apiKey = props.apiKey;
    }

    // Generates a response based on the provided prompt.
    async generate(props: GenerateProps): Promise<string> {
        try {
            const data = {
                contents: [
                    {
                        parts: [
                            {
                                text: props.prompt
                            }
                        ]
                    }
                ]
            };

            const response = await axios.post(`${this.baseUrl}/${props.model}:generateContent?key=${this.apiKey}`, data, {
                headers: {
                    'Content-Type': 'application/json'
                }
            });

            return response.data.candidates[0].content.parts[0].text;
        } catch (error: any) {
            console.error("Error generating response:", error);
            throw new Error(error.message);
        }
    }

    // Get models available from the provider.
    async getModels(): Promise<string[]> {
        try {
            const response = await axios.get(`${this.baseUrl}?key=${this.apiKey}`);
            const models = response.data.models
                .filter((model: any) => model?.supportedGenerationMethods?.includes('generateContent'))
                .map((model: any) => model.name.replace(/^models\//, ''));

            return models;
        } catch (error: any) {
            console.error("Error fetching models:", error);
            throw new Error(error.message);
        }
    }
}

export default GeminiProvider;
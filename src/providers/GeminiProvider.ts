import axios from "axios";
import type { LLMProvider, GenerateProps } from "./LLMProvider";

// This file defines the options for the GeminiProvider class.
interface GeminiProviderOptions {
    apiKey: string;
}

// This class provides an interface to interact with the Gemini API for generating text responses.
export class GeminiProvider implements LLMProvider {
    private readonly baseUrl: string = "https://generativelanguage.googleapis.com/v1beta/models";
    private apiKey: string;

    constructor(options: GeminiProviderOptions) {
        this.apiKey = options.apiKey;
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
        } catch (error) {
            console.error("Error generating response:", error);
            throw new Error("Failed to generate response from Gemini provider.");
        }
    }

    // Get models available from the provider.
    async getModels(): Promise<string[]> {
        try {
            const response = await axios.get(`${this.baseUrl}?key=${this.apiKey}`);
            const models = response.data.models.map((model: any) => model.name); // Assuming the API returns a 'models' field with model names

            return models;
        } catch (error) {
            console.error("Error fetching models:", error);
            throw new Error("Failed to fetch models from Gemini provider.");
        }
    }
}
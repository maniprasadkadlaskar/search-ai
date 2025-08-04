import axios from "axios";
import type { IModelProvider, ConfigProps, GenerateProps } from "./ModelProvider";
import { providerURL } from "../utils/constants";

// This class provides an interface to interact with the Groq API for generating text responses.
class GroqProvider implements IModelProvider {
    private readonly baseUrl: string = providerURL.groq;
    private apiKey: string;

    // Configuration properties for the GroqProvider.
    constructor(props: ConfigProps) {
        this.apiKey = props.apiKey;
    }

    // Generates a response based on the provided prompt.
    async generate(props: GenerateProps): Promise<string> {
        try {
            const data = {
                model: props.model,
                messages: [
                    {
                        role: "user",
                        content: props.prompt
                    }
                ]
            }

            const response = await axios.post(`${this.baseUrl}/chat/completions`, data, {
                headers: {
                    Authorization: `Bearer ${this.apiKey}`
                }
            });

            return response.data.choices[0].message.content;
        } catch (error: any) {
            console.error("Error generating response:", error);
            throw new Error(error.message);
        }
    }

    // Get models available from the provider.
    async getModels(): Promise<string[]> {
        try {
            const response = await axios.get(`${this.baseUrl}/models`, {
                headers: {
                    Authorization: `Bearer ${this.apiKey}`
                }
            });

            const models = response.data.data
                .filter((model: any) => model?.id && model?.object === 'model')
                .map((model: any) => model.id);

            return models;
        } catch (error: any) {
            console.error("Error fetching models:", error);
            throw new Error(error.message);
        }
    }
}

export default GroqProvider;
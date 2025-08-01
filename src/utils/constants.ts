// providers
export const providers = [
    {
        name: "Gemini",
        value: "gemini",
        type: "remote",
    },
    {
        name: "Groq",
        value: "groq",
        type: "remote",
    },
    {
        name: "Ollama",
        value: "ollama",
        type: "local",
    },
];

// provider types
export const providerType = {
    gemini: "remote",
    groq: "remote",
    ollama: "local",
};

// provider URLs
export const providerURL = {
    gemini: "https://generativelanguage.googleapis.com/v1beta/models",
    groq: "https://api.groq.com/openai/v1",
    ollama: "http://localhost:11434",
};

// default configuration
export const config = {
    SYSTEM_PROMPT: 'You are a helpful AI assisstant. User input selected text from the web page. You need to provide a relevant information / answer with maximum of 200 characters. If you do not know the answer, just say "I do not know". Do not provide any other information.',
    SYSTEM_OUTPUT: 'Output should be in markdown format. Do not provide any other information.',
}
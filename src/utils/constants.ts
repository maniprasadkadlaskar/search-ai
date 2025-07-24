// providers
export const providers = [
    {
        name: "Gemini",
        value: "gemini",
        type: "remote",
    },
    {
        name: "Grok",
        value: "grok",
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
    grok: "remote",
    ollama: "local",
};

// provider URLs
export const providerURL = {
    gemini: "https://generativelanguage.googleapis.com/v1beta/models",
    grok: "https://api.groq.com/openai/v1",
    ollama: "http://localhost:11434",
};
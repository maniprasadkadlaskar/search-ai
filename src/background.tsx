import { OllamaProvider } from "./providers/OllamaProvider";

const provider = new OllamaProvider();

chrome.runtime.onMessage.addListener((request: any, sender: any, sendResponse: any) => {
    if (request.client === 'select-ai') {
        const { prompt, model } = request.query;

        (async () => {
            const response = await provider.generate({
                prompt: prompt,
                model: model
            });

            sendResponse({ text: response });

        })();

        return true;
    }

    return false;
})
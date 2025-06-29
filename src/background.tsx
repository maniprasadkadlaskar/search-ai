import ModelProviderFactory from "./providers/ModelProviderFactory";

var config: any = undefined;

chrome.storage.local.get([
    'select-ai-model-provider',
    'select-ai-model-type',
    'select-ai-model-api-key',
    'select-ai-model',
    'select-ai-system-prompt',
], (response) => {
    config = {
        provider: response['select-ai-model-provider'],
        type: response['select-ai-model-type'],
        apiKey: response['select-ai-model-api-key'],
        model: response['select-ai-model'],
        systemPrompt: response['select-ai-system-prompt'],
    };
});

chrome.runtime.onMessage.addListener((request: any, sender: any, sendResponse: any) => {
    if (request.client === 'select-ai') {
        const { prompt } = request.query;

        if (config.model === undefined) {
            console.error('No model is configured');
            sendResponse({
                success: false,
                error: 'No model is configured',
            });
        }

        const inputPrompt = config.systemPrompt + 'input: ' + prompt;

        const provider = config.provider === 'local' ? ModelProviderFactory.createLocalProvider({ provider: config.provider })
            : ModelProviderFactory.createProvider({
                provider: config.provider,
                config: {
                    apiKey: config.apiKey,
                },
            });

        (async () => {
            const response = await provider.generate({
                model: config.model,
                prompt: inputPrompt,
            });

            sendResponse({
                success: true,
                text: response
            });

        })();

        return true;
    }

    return false;
})
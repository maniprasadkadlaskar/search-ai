import ModelProviderFactory from "./providers/ModelProviderFactory";

var config: any = undefined;

chrome.storage.local.get([
    'search-ai-model-provider',
    'search-ai-model-type',
    'search-ai-model-api-key',
    'search-ai-model',
    'search-ai-system-prompt',
], (response) => {
    config = {
        provider: response['search-ai-model-provider'],
        type: response['search-ai-model-type'],
        apiKey: response['search-ai-model-api-key'],
        model: response['search-ai-model'],
        systemPrompt: response['search-ai-system-prompt'],
    };
});

chrome.runtime.onMessage.addListener((request, _sender, sendResponse) => {
    if (request.client === 'search-ai') {
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
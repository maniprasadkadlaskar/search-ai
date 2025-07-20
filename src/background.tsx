import ModelProviderFactory from "./providers/ModelProviderFactory";

var config: any = undefined;
var models: any = undefined;

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

// This function fetches models based on the provider and type.
const getModels = async (provider: string, type: string, apiKey?: string) => {
    try {
        switch (type) {
            case 'local': {
                const localProvider = ModelProviderFactory.createLocalProvider({ provider: provider });
                models = await localProvider.getModels();
                return models;
            }
            case 'remote': {
                const remoteProvider = ModelProviderFactory.createProvider({
                    provider: provider,
                    config: {
                        apiKey: apiKey || "",
                    },
                });
                models = await remoteProvider.getModels();
                return models;
            }
            default:
                throw new Error('Invalid model type');
        }
    } catch (error) {
        console.error('Error fetching models:', error);
        throw error;
    }
}

// This function validates the model by attempting to generate a response with it.
const validateModel = async (provider: string, type: string, model: string, apiKey?: string) => {
    try {
        if (type === 'local') {
            const localProvider = ModelProviderFactory.createLocalProvider({ provider: provider });
            await localProvider.generate({
                model: model,
                prompt: 'whoami',
            })
        } else if (type === 'remote') {
            const remoteProvider = ModelProviderFactory.createProvider({
                provider: provider,
                config: {
                    apiKey: apiKey || "",
                },
            });
            await remoteProvider.generate({
                model: model,
                prompt: 'whoami',
            });
        } else {
            throw new Error('Invalid model type');
        }
    } catch (error) {
        console.error('Error validating model:', error);
        throw error;
    }
}

// This function processes the prompt using the configured model and provider.
const processPrompt = async (prompt: string) => {
    if (config.model === undefined) {
        console.error('No model is configured');
        throw new Error('No model is configured');
    }

    const inputPrompt = config.systemPrompt + 'input: ' + prompt;

    const provider = config.type === 'local' ? ModelProviderFactory.createLocalProvider({ provider: config.provider })
        : ModelProviderFactory.createProvider({
            provider: config.provider,
            config: {
                apiKey: config.apiKey,
            },
        });

    return await provider.generate({
        model: config.model,
        prompt: inputPrompt,
    });
}

chrome.runtime.onMessage.addListener((request, _sender, sendResponse) => {

    if (request.client !== 'search-ai') {
        sendResponse({
            success: false,
            error: 'Invalid client',
        });
    }

    const action = request.action;

    switch (action) {
        case 'getModels': {
            const { provider, type, apiKey } = request.query;

            if (provider === config.provider && models !== undefined && request.refresh === false) {
                sendResponse({
                    success: true,
                    models: models,
                });

                return;
            }

            getModels(provider, type, apiKey)
                .then(models => {
                    sendResponse({
                        success: true,
                        models: models,
                    });
                })
                .catch(error => {
                    sendResponse({
                        success: false,
                        error: error.message || 'An error occurred while fetching models.',
                    });
                });

            return true; // Keep the message channel open for async response
        };

        case 'validateModel': {
            const { provider, type, model, apiKey } = request.query;

            validateModel(provider, type, model, apiKey)
                .then(() => {
                    sendResponse({
                        success: true,
                    });
                })
                .catch(error => {
                    sendResponse({
                        success: false,
                        error: error.message || 'An error occurred while validating the model.',
                    });
                });

            return true; // Keep the message channel open for async response

        };

        case 'processPrompt': {
            const { prompt } = request.query;

            processPrompt(prompt)
                .then(responseText => {
                    sendResponse({
                        success: true,
                        text: responseText,
                    });
                })
                .catch(error => {
                    sendResponse({
                        success: false,
                        error: error.message || 'An error occurred while processing the prompt.',
                    });
                });

            return true; // Keep the message channel open for async response
        };

        default: {
            sendResponse({
                success: false,
                error: 'Invalid action',
            });

            return false; // Do not keep the message channel open
        }
    }
});
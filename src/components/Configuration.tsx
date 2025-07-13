import { useEffect, useState, type ChangeEvent, type FC, type FormEvent } from "react";
import { providers, providerType } from "../utils/constants";
import ModelProviderFactory from "../providers/ModelProviderFactory";
import "./index.css";

const Configuration: FC = () => {
    const [modelProvider, setModelProvider] = useState<string>("");
    const [apiKey, setApiKey] = useState<string>("");
    const [model, setModel] = useState<string>("");
    const [modelType, setModelType] = useState<string>("local");
    const [models, setModels] = useState<string[]>([]);
    const [systemPrompt, setSystemPrompt] = useState<string>("");
    const [apiKeyError, setApiKeyError] = useState<boolean>(false);
    const [modelError, setModelError] = useState<boolean>(false);
    const [validateApiKeyLoading, setValidateApiKeyLoading] = useState<boolean>(false);
    const [loading, setLoading] = useState<boolean>(false);
    const [isApiKeyValidated, setIsApiKeyValidated] = useState<boolean>(false);
    const [isconfigured, setIsConfigured] = useState<boolean>(false);

    const handleProvider = (event: ChangeEvent<HTMLSelectElement>) => {
        const provider: keyof typeof providerType = event.target.value as keyof typeof providerType;
        setModelProvider(provider);
        setIsApiKeyValidated(false);
        setIsConfigured(false);

        const type: string = providerType[provider];

        if (type === 'local') {
            const localProvider = ModelProviderFactory.createLocalProvider({
                provider: provider,
            });

            (async () => {
                const models: string[] = await localProvider.getModels();
                setModels(models);
            })();
        }
    }

    const validateApiKey = async (event: FormEvent<HTMLButtonElement>) => {
        event.preventDefault();
        setValidateApiKeyLoading(true);

        const provider = ModelProviderFactory.createProvider({
            provider: modelProvider,
            config: {
                apiKey: apiKey,
            },
        });

        try {
            const models = await provider.getModels();
            setModels(models);
            setApiKeyError(false);
            setIsApiKeyValidated(true);
        } catch (error) {
            setApiKeyError(true);
            console.log("Error validating API key: ", error);
        }

        setValidateApiKeyLoading(false);
    }

    const handleModelChange = (event: ChangeEvent<HTMLSelectElement>) => {
        setModel(event.target.value);
        setModelError(false);
        setIsApiKeyValidated(false);
        setIsConfigured(false);
    }

    const validateModel = async () => {
        const provider = modelType === "local"
            ? ModelProviderFactory.createLocalProvider({ provider: modelProvider }) :
            ModelProviderFactory.createProvider({
                provider: modelProvider,
                config: {
                    apiKey: apiKey,
                },
            });

        try {
            await provider.generate({
                model: model,
                prompt: "Test prompt",
            });
            setModelError(false);

            return true;
        } catch (error) {
            setModelError(true);
            console.log("Error validating model: ", error);
            return false;
        }
    }

    const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        setLoading(true);

        if (!await validateModel()) {
            setLoading(false);
            return;
        }

        chrome.storage.local.set({
            'search-ai-model-provider': modelProvider,
            'search-ai-model-type': modelType,
            'search-ai-model-api-key': apiKey,
            'search-ai-model': model,
            'search-ai-system-prompt': systemPrompt,
        });

        setIsConfigured(true);
        setLoading(false);
        chrome.runtime.reload();
    }

    const handleReset = () => {
        setModelProvider("");
        setApiKey("");
        setModel("");
        setModelType("local");
        setModels([]);
        setModelError(false);
        setIsApiKeyValidated(false);
        setIsConfigured(false);

        chrome.storage.local.remove([
            'search-ai-model-provider',
            'search-ai-model-type',
            'search-ai-model-api-key',
            'search-ai-model',
            'search-ai-system-prompt',
        ]);
    }

    useEffect(() => {
        const type: string = providerType[modelProvider as keyof typeof providerType];
        setModelType(type);

    }, [modelProvider]);

    useEffect(() => {
        chrome.storage.local.get([
            'search-ai-model-provider',
            'search-ai-model-type',
            'search-ai-model-api-key',
            'search-ai-model',
            'search-ai-system-prompt',
        ], (response) => {
            setModelProvider(response['search-ai-model-provider']);
            setModelType(response['search-ai-model-type']);
            setApiKey(response['search-ai-model-api-key']);
            setModel(response['search-ai-model']);
            setModels([response['search-ai-model']]);

            if (response['search-ai-model-api-key']) {
                setIsApiKeyValidated(true);
            }

            if (response['search-ai-model']) {
                setIsConfigured(true);
            }

            if (response['search-ai-system-prompt']) {
                setSystemPrompt(response['search-ai-system-prompt']);
            } else {
                setSystemPrompt('You are a helpful AI assisstant. User input selected text from the web page. You need to provide a relevant information / answer with maximum of 200 characters. If you do not know the answer, just say "I do not know". Do not provide any other information.');
            }
        });
    }, []);

    return (
        <form onSubmit={handleSubmit} onReset={handleReset}>
            <div
                className="p-2 w-72 space-y-4"
            >
                <div>
                    <select
                        className="p-2 w-full bg-gray-700 border border-gray-400 rounded cursor-pointer"
                        name="search-ai-llm-provider"
                        value={modelProvider}
                        onChange={handleProvider}
                        required
                    >
                        <option value="">Choose model provider</option>
                        {providers.map((provider) => <option value={provider.value}>{provider.name}</option>)}
                    </select>
                </div>

                {modelType === "remote" &&
                    <div
                        className="space-y-2"
                    >
                        <input
                            className="p-2 w-full bg-gray-700 border border-gray-400 rounded"
                            name="search-ai-llm-api-key"
                            type="text"
                            placeholder="Enter API key"
                            value={apiKey}
                            onChange={(e) => setApiKey(e.target.value)}
                            required
                        />

                        <div
                            className="text-gray-400 text-xs"
                        >
                            <span>Validate API key to choose provider model.</span>
                        </div>

                        {apiKeyError && <div
                            className="px-1 text-red-500 text-xs"
                        >
                            <span>Invalid API key</span>
                        </div>}

                        <button
                            className={`p-1 bg-blue-400 hover:bg-blue-500 rounded ${validateApiKeyLoading || isApiKeyValidated ? 'cursor-not-allowed' : 'cursor-pointer'}`}
                            onClick={validateApiKey}
                            disabled={validateApiKeyLoading || isApiKeyValidated}
                        >
                            {validateApiKeyLoading ? 'Validating...' : 'Validate'}
                        </button>
                    </div>}

                <div
                    className="space-y-2"
                >
                    <div>
                        <select
                            className="p-2 w-full bg-gray-700 border border-gray-400 rounded cursor-pointer"
                            name="search-ai-llm-model"
                            value={model}
                            onChange={handleModelChange}
                            required
                        >
                            <option value="">Choose model</option>
                            {models.map((model) => <option value={model}>{model}</option>)}
                        </select>
                    </div>

                    {modelError && <div
                        className="px-1 text-red-500 text-xs"
                    >
                        <span>Invalid text model</span>
                    </div>}
                </div>

                <div>
                    <div
                        className="px-1 text-gray-400 text-xs"
                    >
                        <span>Adjust the system prompt to meet your requirements.</span>
                    </div>

                    <div>
                        <textarea
                            className="system-prompt p-2 w-full bg-gray-700 border border-gray-400 rounded"
                            name="search-ai-system-prompt"
                            value={systemPrompt}
                            onChange={(e) => setSystemPrompt(e.target.value)}
                            placeholder="System prompt"
                            rows={6}
                        />
                    </div>
                </div>

                <div
                    className="space-y-2"
                >
                    <div
                        className="text-gray-400 text-xs"
                    >
                        <span>Click save and refresh the page to apply changes.</span>
                    </div>

                    <button
                        className={`py-1 w-full bg-blue-400 hover:bg-blue-500 rounded ${loading || isconfigured ? 'cursor-not-allowed' : 'cursor-pointer'}`}
                        type="submit"
                        disabled={loading || isconfigured}
                    >
                        {loading ? 'Configuring...' : 'Save'}
                    </button>

                    <button
                        className="py-1 w-full bg-gray-500 hover:bg-gray-600 rounded cursor-pointer"
                        type="reset"
                    >
                        Reset
                    </button>
                </div>
            </div>
        </form>
    );
}

export default Configuration;
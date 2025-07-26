import { useEffect, useState, type ChangeEvent, type FC, type FormEvent } from "react";
import { providers, providerType } from "../utils/constants";
import { Save, CheckCircle, RefreshCw, Key, Check } from "react-feather";
import { config } from "../utils/constants";
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
    const [isApiKeyValidated, setIsApiKeyValidated] = useState<boolean>(true);
    const [isconfigured, setIsConfigured] = useState<boolean>(false);
    const [configureError, setConfigureError] = useState<boolean>(false);

    const clearConfiguration = () => {
        setApiKey("");
        setModel("");
        setModels([]);
        setModelError(false);
        setIsApiKeyValidated(false);
        setIsConfigured(false);
    }

    const handleProviderChange = (event: ChangeEvent<HTMLSelectElement>) => {
        const provider: keyof typeof providerType = event.target.value as keyof typeof providerType;
        setModelProvider(provider);
        clearConfiguration();

        const type: string = providerType[provider];

        if (type === 'local') {

            chrome.runtime.sendMessage({
                client: "search-ai",
                action: "getModels",
                query: {
                    provider: provider,
                    type: type,
                },
                refresh: true,
            }, (response) => {
                if (response) {
                    if (response.success === false) {
                        console.error("Error fetching models: ", response.error);
                    } else {
                        setModels(response?.models);
                    }
                }
            });
        }
    }

    const handleApiKeyChange = (event: ChangeEvent<HTMLInputElement>) => {
        setApiKey(event.target.value);
        setIsApiKeyValidated(false);
        setApiKeyError(false);
    }

    const validateApiKey = async (event: FormEvent<HTMLButtonElement>) => {
        event.preventDefault();
        setValidateApiKeyLoading(true);

        chrome.runtime.sendMessage({
            client: "search-ai",
            action: "getModels",
            query: {
                provider: modelProvider,
                type: modelType,
                apiKey: apiKey,
            },
            refresh: true,
        }, (response) => {
            if (response) {
                if (response.success === false) {
                    setApiKeyError(true);
                    setIsApiKeyValidated(false);
                    setValidateApiKeyLoading(false);
                    console.log("Error validating API key: ", response.error || "An error occurred while fetching models.");
                } else {
                    setModels(response?.models);
                    setApiKeyError(false);
                    setIsApiKeyValidated(true);
                    setValidateApiKeyLoading(false);
                }
            }
        });
    }

    const handleModelChange = (event: ChangeEvent<HTMLSelectElement>) => {
        setModel(event.target.value);
        setModelError(false);
        setIsConfigured(false);
    }

    const validateModel = async () => {
        return new Promise((resolve) => {
            chrome.runtime.sendMessage({
                client: "search-ai",
                action: "validateModel",
                query: {
                    provider: modelProvider,
                    type: modelType,
                    apiKey: apiKey,
                    model: model,
                },
            }, (response) => {
                if (response) {
                    setModelError(!response.success);
                    resolve(response.success);
                }
            });
        });
    }

    const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        setLoading(true);
        setConfigureError(false);

        if (!await validateModel()) {
            setLoading(false);
            setConfigureError(true);
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
    }

    const handleReset = () => {
        setModelProvider("");
        setApiKey("");
        setModel("");
        setModelType("local");
        setModels([]);
        setModelError(false);
        setIsApiKeyValidated(true);
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
            setModels([]);

            if (response['search-ai-model-api-key']) {
                setIsApiKeyValidated(true);
            }

            if (response['search-ai-model']) {
                setIsConfigured(true);
            }

            if (response['search-ai-model']) {
                chrome.runtime.sendMessage({
                    client: "search-ai",
                    action: "getModels",
                    query: {
                        provider: response['search-ai-model-provider'],
                        type: response['search-ai-model-type'],
                        apiKey: response['search-ai-model-api-key'],
                    },
                    refresh: false,
                }, (response) => {
                    if (response) {
                        if (response.success === false) {
                            console.error("Error fetching models: ", response.error);
                            setModels([]);
                        } else {
                            setModels(response?.models);
                        }
                    }
                });
            }

            if (response['search-ai-system-prompt']) {
                setSystemPrompt(response['search-ai-system-prompt']);
            } else {
                setSystemPrompt(config.SYSTEM_PROMPT);
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
                        className="p-2 w-full bg-gray-800 border border-gray-400 rounded cursor-pointer"
                        name="search-ai-llm-provider"
                        value={modelProvider}
                        onChange={handleProviderChange}
                        required
                    >
                        <option value="">Choose model provider</option>
                        {providers?.map((provider) => <option value={provider.value}>{provider.name}</option>)}
                    </select>
                </div>

                {modelType === "remote" &&
                    <div
                        className="space-y-2"
                    >
                        <input
                            className={`p-2 w-full bg-gray-800 border rounded ${apiKeyError ? 'border-red-500 focus:outline focus:outline-red-500' : 'border-gray-400'}`}
                            name="search-ai-llm-api-key"
                            type="password"
                            placeholder="Enter API key"
                            value={apiKey}
                            onChange={handleApiKeyChange}
                            required
                        />

                        {apiKeyError && <div
                            className="px-1 text-red-600 dark:text-red-500 text-xs"
                        >
                            <span>Invalid API key</span>
                        </div>}

                        <div
                            className="text-gray-400 text-xs"
                        >
                            <span>Validate API key to choose provider model.</span>
                        </div>

                        <button
                            className={`p-1 bg-indigo-500 hover:bg-indigo-600 rounded ${validateApiKeyLoading || isApiKeyValidated ? 'cursor-not-allowed' : 'cursor-pointer'}`}
                            onClick={validateApiKey}
                            disabled={validateApiKeyLoading || isApiKeyValidated}
                        >
                            {validateApiKeyLoading ?
                                'Validating...' :
                                isApiKeyValidated ?
                                    <div className="flex justify-center gap-1">
                                        <CheckCircle size={15} />
                                        Validated
                                    </div>
                                    :
                                    <div className="flex justify-center gap-1">
                                        <Key size={15} />
                                        Validate
                                    </div>
                            }
                        </button>
                    </div>}

                <div
                    className="space-y-2"
                >
                    <div>
                        <select
                            className="model-list p-2 w-full bg-gray-800 border border-gray-400 rounded cursor-pointer"
                            name="search-ai-llm-model"
                            value={model}
                            onChange={handleModelChange}
                            required
                        >
                            <option value="">Choose model</option>
                            {models?.map((model) => <option value={model}>{model}</option>)}
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
                            className="system-prompt p-2 w-full bg-gray-800 border border-gray-400 rounded"
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

                    {configureError && <div
                        className="px-1 text-red-500 text-xs"
                    >
                        <span>Error in configuring...</span>
                    </div>}

                    <button
                        className={`py-1 w-full bg-indigo-500 hover:bg-indigo-600 rounded ${loading || isconfigured ? 'cursor-not-allowed' : 'cursor-pointer'}`}
                        type="submit"
                        disabled={loading || isconfigured}
                    >
                        {loading ?
                            'Saving...' :
                            isconfigured ?
                                <div className="flex justify-center gap-1">
                                    <Check size={15} />
                                    Saved
                                </div>
                                :
                                <div className="flex justify-center gap-1">
                                    <Save size={15} />
                                    Save
                                </div>
                        }
                    </button>

                    <button
                        className="py-1 w-full bg-gray-500 hover:bg-gray-600 rounded cursor-pointer"
                        type="reset"
                    >
                        <div className="flex justify-center gap-1">
                            <RefreshCw size={15} />
                            Reset
                        </div>
                    </button>
                </div>
            </div>
        </form>
    );
}

export default Configuration;
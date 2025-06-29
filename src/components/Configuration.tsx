import { useEffect, useState, type FC } from "react";
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

    const handleProvider = (event: any) => {
        const provider: keyof typeof providerType = event.target.value;
        setModelProvider(provider);

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

    const validate = async (event: any) => {
        event.preventDefault();

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
        } catch (error) {
            setApiKeyError(true);
            console.log("Error validating API key: ", error);
        }
    }

    const handleSubmit = (event: any) => {
        event.preventDefault();

        chrome.storage.local.set({
            'select-ai-model-provider': modelProvider,
            'select-ai-model-type': modelType,
            'select-ai-model-api-key': apiKey,
            'select-ai-model': model,
            'select-ai-system-prompt': systemPrompt,
        });

        chrome.runtime.reload();
    }

    const handleReset = () => {
        setModelProvider("");
        setApiKey("");
        setModel("");
        setModelType("local");
        setModels([]);

        chrome.storage.local.remove([
            'select-ai-model-provider',
            'select-ai-model-type',
            'select-ai-model-api-key',
            'select-ai-model',
            'select-ai-system-prompt',
        ]);

        chrome.runtime.reload();
    }

    useEffect(() => {
        const type: string = providerType[modelProvider as keyof typeof providerType];
        setModelType(type);

    }, [modelProvider]);

    useEffect(() => {
        chrome.storage.local.get([
            'select-ai-model-provider',
            'select-ai-model-type',
            'select-ai-model-api-key',
            'select-ai-model',
            'select-ai-system-prompt',
        ], (response) => {
            setModelProvider(response['select-ai-model-provider']);
            setModelType(response['select-ai-model-type']);
            setApiKey(response['select-ai-model-api-key']);
            setModel(response['select-ai-model']);
            setModels([response['select-ai-model']]);

            if (response['select-ai-system-prompt']) {
                setSystemPrompt(response['select-ai-system-prompt']);
            } else {
                setSystemPrompt('You are a helpful AI assisstant. User input selected text from the web page. You need to provide a relevant information / answer with maximum of 200 characters. If you do not know the answer, just say "I do not know". Do not provide any other information.');
            }
        });
    }, []);

    return (
        <form onSubmit={handleSubmit} onReset={handleReset}>
            <div
                className="p-3 w-72 space-y-5"
            >
                <div>
                    <select
                        className="p-2 w-full bg-gray-700 border border-gray-400 rounded cursor-pointer"
                        name="select-ai-llm-provider"
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
                            name="select-ai-llm-api-key"
                            type="text"
                            placeholder="Enter API key"
                            value={apiKey}
                            onChange={(e) => setApiKey(e.target.value)}
                            required
                        />

                        {apiKeyError && <div
                            className="text-red-500"
                        >
                            <span>Invalid API key</span>
                        </div>}

                        <button
                            className="p-1 bg-blue-400 rounded cursor-pointer"
                            onClick={validate}
                        >
                            Validate
                        </button>
                    </div>}

                <div
                    className="space-y-2"
                >
                    <div>
                        <select
                            className="p-2 w-full bg-gray-700 border border-gray-400 rounded cursor-pointer"
                            name="select-ai-llm-model"
                            value={model}
                            onChange={(e) => setModel(e.target.value)}
                            required
                        >
                            <option value="">Choose model</option>
                            {models.map((model) => <option value={model}>{model}</option>)}
                        </select>
                    </div>

                    {modelError && <div
                        className="text-red-500"
                    >
                        <span>Selected invalid text model</span>
                    </div>}
                </div>

                <div>
                    <div
                        className="p-1 text-gray-400 text-xs"
                    >
                        <span>Adjust the system prompt to meet your requirements.</span>
                    </div>

                    <div>
                        <textarea
                            className="system-prompt p-2 w-full bg-gray-700 border border-gray-400 rounded"
                            name="select-ai-system-prompt"
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
                    <button
                        className="py-1 w-full bg-blue-400 hover:bg-blue-500 rounded cursor-pointer"
                        type="submit"
                    >
                        Save
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
# Search AI

A Chrome extension that allows you to search the selected text from web pages using LLM models.

## ✨Features
- Search selected text using LLM models
- Supports local and remote model providers
- Customizable system prompt
- Configurable model parameters

## 🤖 Supported model providers
- Gemini
- Groq
- Ollama

## 🛠️Technologies Used
- ReactJS
- TypeScript
- Tailwind CSS
- Vite
- CRXJS

## 📦Installation
```bash
# Clone the repository
git clone https://github.com/maniprasadkadlaskar/search-ai.git

# Navigate to the project directory
cd search-ai

# Install dependencies
npm install
```

## 🧱Building the Extension
```bash
# Build the extension
npm run build

# Build the extension in watch mode
npm run build:dev
```

## 🚀Running the Extension
1. Open Chrome and navigate to `chrome://extensions/`.
2. Enable "Developer mode" in the top right corner.
3. Click on "Load unpacked" and select the `dist` directory of the project.

## 📝Configuration
- Set environment variable for ollama model provider to be accessed from the extension:
```bash
export OLLAMA_ORIGINS="chrome-extension://*"
```

## ✅Pull Requests
We welcome contributions! Please read our [CONTRIBUTING.md](CONTRIBUTING.md) for details on our code of conduct, and the process for submitting pull requests.

## 📄License
This project is licensed under the MIT License. See the [LICENSE](LICENSE) file for details.
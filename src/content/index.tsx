import { useEffect, useState, type FC } from "react";
import ContentControl from "./ContentControl";
import ContentBox from "./ContentBox";
import "./index.css";

const Content: FC = () => {
    const [isSelected, setIsSelected] = useState(false);
    const [isSearched, setIsSearched] = useState(false);
    const [pos, setPos] = useState<{ x: number; y: number } | null>(null);
    const [selectedText, setSelectedText] = useState<string | null>(null);
    const [content, setContent] = useState<string>("");

    // Function to handle text selection
    const handleSelection = () => {
        const selection = window.getSelection();

        if (selection && selection.rangeCount > 0) {
            setIsSelected(true);
            const range = selection.getRangeAt(0);
            const selectedText = range.toString().trim();

            if (selectedText) {
                const rect = range.getBoundingClientRect();
                const x = rect.left + window.scrollX;
                const y = rect.bottom + window.scrollY + 10;

                setPos({ x, y });
                setIsSearched(false);
                setSelectedText(selectedText);
            } else {
                setIsSelected(false);
            }
        }
    }

    const handleSearch = async () => {
        setIsSelected(false);
        setIsSearched(true);
        setContent('searching...');

        chrome.runtime.sendMessage({
            client: "search-ai",
            action: "processPrompt",
            query: {
                prompt: selectedText,
            },
        }, (response) => {
            if (response) {
                if (response.success === false) {
                    setContent("Error: " + response.error || "An error occurred while processing your request.");
                } else {
                    setContent(response?.text);
                }
            }
        })
    }

    useEffect(() => {
        // Add event listener for text selection
        document.addEventListener("mouseup", handleSelection);

        // Cleanup the event listener on component unmount
        return () => {
            document.removeEventListener("mouseup", handleSelection);
        };
    }, []);

    return (
        <div
            className="!w-min !absolute !text-white !bg-gray-700 !rounded"
            style={{
                top: pos?.y || 0,
                left: pos?.x || 0,
            }}
        >
            {isSelected && <ContentControl handleSearch={handleSearch} />}
            {isSearched && <ContentBox content={content} setIsSearched={setIsSearched} />}
        </div>
    );
}

export default Content;
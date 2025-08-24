import type { FC } from "react";
import Markdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { X } from "react-feather";
import "./index.css";

interface ContentBoxProps {
    content: string;
    setIsSearched: (isSearched: boolean) => void;
}

const ContentBox: FC<ContentBoxProps> = ({ content, setIsSearched }) => {
    return (
        <div
            className="!w-64"
        >
            <div
                className="!p-1 !flex !justify-end !border-b !border-gray-500"
            >
                <button
                    className="search-ai-el hover:!text-indigo-500 !cursor-pointer"
                    onClick={() => setIsSearched(false)}
                >
                    <X size={15} />
                </button>
            </div>

            <div
                className="search-ai-content !p-1 !max-h-80 !overflow-auto"
            >
                <Markdown remarkPlugins={[remarkGfm]}>{content}</Markdown>
            </div>
        </div>
    );
}

export default ContentBox;
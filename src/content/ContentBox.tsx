import type { FC } from "react";
import { X } from "react-feather";

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
                    className="hover:!text-indigo-500 !cursor-pointer"
                    onClick={() => setIsSearched(false)}
                >
                    <X />
                </button>
            </div>

            <div
                className="search-ai-content !p-2 !max-h-80 !overflow-auto"
            >
                {content}
            </div>
        </div>
    );
}

export default ContentBox;
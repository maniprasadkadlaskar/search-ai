import type { FC } from "react";
import { Search } from "react-feather";

interface ContentControlProps {
    handleSearch: () => void;
}

const ContentControl: FC<ContentControlProps> = ({ handleSearch }) => {
    return (
        <div
            className="search-ai-el"
        >
            <button
                className="search-ai-el !p-2 hover:!text-indigo-500 !cursor-pointer"
                onClick={handleSearch}
            >
                <Search />
            </button>
        </div>
    );
}

export default ContentControl;
import type { FC } from "react";
import { Search } from "react-feather";

interface ContentControlProps {
    handleSearch: () => void;
}

const ContentControl: FC<ContentControlProps> = ({ handleSearch }) => {
    return (
        <div>
            <button
                className="!p-2 hover:!text-indigo-500 !cursor-pointer"
                onClick={handleSearch}
            >
                <Search />
            </button>
        </div>
    );
}

export default ContentControl;
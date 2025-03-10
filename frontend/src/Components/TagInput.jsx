import { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { fetchTags } from "../Redux/tagSlice";

const TagInput = ({ type, selectedItems, setSelectedItems }) => {
    const dispatch = useDispatch();
    const { tags, subtags } = useSelector((state) => state.tags);
    const [query, setQuery] = useState("");
    const [showDropdown, setShowDropdown] = useState(false);

    useEffect(() => {
        dispatch(fetchTags());
    }, [dispatch]);

    const filteredItems = (type === "tag" ? tags : subtags).filter((item) =>
        item.toLowerCase().includes(query.toLowerCase())
    );

    const handleSelect = (item) => {
        if (!selectedItems.includes(item)) {
            setSelectedItems([...selectedItems, item]);
        }
        setQuery(item);
        setShowDropdown(false);
    };

    return (
        <div className="relative w-full text-gray-500">
            <input
                type="text"
                value={query}
                onChange={(e) => {
                    setQuery(e.target.value);
                    setShowDropdown(true);
                }}
                placeholder={`Search or create ${type}...`}
                className="w-full p-2 border border-gray-300 rounded-md"
            />
            {showDropdown && query && (
                <div className="absolute w-full bg-white border border-gray-300 rounded-md mt-1 z-10">
                    {filteredItems.length > 0 ? (
                        filteredItems.map((item, index) => (
                            <div
                                key={index}
                                className="p-2 hover:bg-gray-100 cursor-pointer"
                                onClick={() => handleSelect(item)}
                            >
                                {item}
                            </div>
                        ))
                    ) : (
                        <div
                            className="p-2 text-gray-500 cursor-pointer"
                            onClick={() => handleSelect(query)}
                        >
                            Create new {type}: <strong>{query}</strong>
                        </div>
                    )}
                </div>
            )}
        </div>
    );
};

export default TagInput;
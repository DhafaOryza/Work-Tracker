import { useState } from "react";
import TagInput from "../Components/TagInput";
import { useDispatch } from "react-redux";
import { addTag } from "../Redux/tagSlice";

const TaskPanel = ({ onClose }) => {
    const dispatch = useDispatch();
    const [selectedTags, setSelectedTags] = useState([]);
    const [selectedSubtags, setSelectedSubtags] = useState([]);

    const handleSave = () => {
        selectedTags.forEach((tag) => {
            dispatch(addTag({ tag }));
        });

        selectedSubtags.forEach((subtag) => {
            dispatch(addTag({ subtag }));
        });

        onClose();
    }

    return (
        <div className="fixed inset-0 w-full h-screen flex items-center justify-center bg-black/80 z-50 p-12 text-white">
            <div className="w-full h-full flex flex-col bg-neutral-800 rounded-lg border border-neutral-500 shadow-md p-6">
                <div className="w-full h-full flex flex-col gap-4">
                    <h2 className="text-xl py-4">Add New Task</h2>
                    <form action="" className="flex flex-col gap-4 placeholder:text-white">
                        <label>Tags</label>
                        <TagInput type="tag" selectedItems={selectedTags} setSelectedItems={setSelectedTags} />

                        <label>Subtags</label>
                        <TagInput type="subtag" selectedItems={selectedSubtags} setSelectedItems={setSelectedSubtags} />
                    </form>
                </div>
                <div className="w-full flex flex-row justify-end space-x-2">
                    <button
                        onClick={handleSave}
                        className="w-[80px] bg-neutral-700 rounded-md border border-neutral-500 hover:bg-blue-500 p-4"
                    >
                        Save
                    </button>
                    <button
                        onClick={onClose}
                        className="w-[80px] bg-neutral-700 rounded-md border border-neutral-500 hover:bg-red-500 p-4"
                    >
                        Cancel
                    </button>
                </div>
            </div>
        </div>
    );
}

export default TaskPanel;
import { useState } from "react";
import TagInput from "../Components/TagInput";
import { useDispatch } from "react-redux";
import { addTag } from "../Redux/tagSlice";
import { addTask } from "../Redux/taskSlice";

const TaskPanel = ({ onClose }) => {
    const dispatch = useDispatch();

    const [title, setTitle] = useState("");
    const [description, setDescription] = useState("");
    const [status, setStatus] = useState("todo");
    const [selectedTags, setSelectedTags] = useState([]);
    const [selectedSubtags, setSelectedSubtags] = useState([]);
    const [file, setFile] = useState(null);

    const handleFileChange = (e) => {
        setFile(e.target.files[0]);
    };

    const handleSave = async () => {
        try {
            selectedTags.forEach((tag) => {
                dispatch(addTag({ tag }));
            });

            selectedSubtags.forEach((subtag) => {
                dispatch(addTag({ subtag }));
            });

            // Create new task
            const newTask = {
                title,
                description,
                status,
                tags: selectedTags,
                subtags: selectedSubtags,
            };

            const formData = new FormData();
            formData.append('task', JSON.stringify(newTask));
            formData.append('tags', selectedTags.toString());
            formData.append('subtags', selectedSubtags.toString());
            if (file) {
                formData.append('files', file);
            }

            await dispatch(addTask(formData));
            onClose();
        } catch (error) {
            console.error("Failed to add task", error);
        }
    };

    return (
        <div className="fixed inset-0 w-full h-screen flex items-center justify-center bg-black/80 z-50 p-12 text-white">
            <div className="w-full h-full flex flex-col bg-neutral-800 rounded-lg border border-neutral-500 shadow-md p-6">
                <div className="w-full h-full flex flex-col gap-4">
                    <h2 className="text-xl py-4">Add New Task</h2>
                    <form className="flex flex-col gap-4 placeholder:text-white">
                        <label>Title</label>
                        <input
                            type="text"
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                            placeholder="Add new title..."
                            className="w-full p-2 border border-gray-300 rounded-md"
                        />

                        <label>Description</label>
                        <textarea
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                            placeholder="Add new description..."
                            className="w-full p-2 border border-gray-300 rounded-md resize-none"
                        />

                        <label>Status</label>
                        <select
                            name="status"
                            value={status}
                            onChange={(e) => setStatus(e.target.value)}
                            className="w-full p-2 border border-gray-300 rounded-md capitalize"
                        >
                            <option value="todo">ToDo</option>
                            <option value="do">Do</option>
                            <option value="done">Done</option>
                        </select>

                        <label>Tags</label>
                        <TagInput type="tag" selectedItems={selectedTags} setSelectedItems={setSelectedTags} />

                        <label>Subtags</label>
                        <TagInput type="subtag" selectedItems={selectedSubtags} setSelectedItems={setSelectedSubtags} />

                        <label>Files</label>
                        <input type="file" onChange={handleFileChange} className="w-full p-2 border border-gray-300 rounded-md" />
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
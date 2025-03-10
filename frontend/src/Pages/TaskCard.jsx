const TaskCard = ({ task }) => {
    // Get the last uploaded file for preview
    const lastFile = task.files?.length > 0 ? task.files[task.files.length - 1] : null;

    return (
        <div className="bg-neutral-600 shadow-md rounded-md p-4 w-80">
            <h2 className="text-xl font-bold">{task.title}</h2>
            <p className="text-neutral-900">{task.description}</p>

            {lastFile && (
                <div className="mt-3">
                    {lastFile.mimetype.startsWith('image') ? (
                        <img src={`http://localhost:5000/${lastFile.path}`} alt={lastFile.filename} className="w-full h-32 object-contain rounded-md" />
                    ) : (
                        <a href={lastFile.path} target="_blank" rel="noreferrer" className="text-blue-500 hover:underline">
                            {lastFile.filename}
                        </a>
                    )}
                </div>
            )}
        </div>
    );
};

export default TaskCard;
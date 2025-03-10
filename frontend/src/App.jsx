import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchTasks } from "./redux/taskSlice";
import TaskCard from "./Pages/TaskCard";
import TaskPanel from "./Pages/TaskPanel";

const App = () => {
  const [isPanelTaskOpen, setIsPanelTaskOpen] = useState(false);

  const dispatch = useDispatch();
  const tasks = useSelector((state) => state.tasks.items);

  useEffect(() => {
    dispatch(fetchTasks());
  }, [dispatch]);

  const columns = {
    ToDo: tasks.filter((task) => task.status === "todo"),
    Do: tasks.filter((task) => task.status === "do"),
    Done: tasks.filter((task) => task.status === "done"),
  };

  return (
    <div className="w-full h-screen flex flex-col bg-neutral-900 gap-4 p-4">
      <button onClick={() => setIsPanelTaskOpen(true)} className="w-full bg-neutral-800 rounded-md hover:bg-neutral-700 border border-neutral-500 p-4">Add New Task</button>
      <div className="w-full h-full flex gap-4">
        {Object.entries(columns).map(([columnName, columnTasks]) => (
          <div key={columnName} className="w-1/3 bg-neutral-800 border border-neutral-500 p-4 rounded-md shadow-md">
            <h2 className="text-lg font-bold mb-4">{columnName}</h2>
            <div className="space-y-4">
              {columnTasks.map((task) => (
                <TaskCard key={task._id} task={task} />
              ))}
            </div>
          </div>
        ))}
      </div>
      {isPanelTaskOpen && (
        <TaskPanel onClose={() => setIsPanelTaskOpen(false)} />
      )}
    </div>
  );
}

export default App;
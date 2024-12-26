import { useState, useEffect } from "react";
import axios from "axios";

function ToDo() {
    const [data, setData] = useState([]); 
    const [input, setInput] = useState("");

    useEffect(() => {
        fetchData();
    }, []);

    // Fetch all tasks from the backend
    function fetchData() {
        axios
            .get("http://localhost:3000/tasks")
            .then((res) => {
                setData(res.data); // Set fetched tasks
            })
            .catch((error) => console.error("Error fetching data:", error));
    }

    // Add a new task
    const addTask = async () => {
        if (!input.trim()) return; // Prevent adding empty tasks
        try {
            const res = await axios.post("http://localhost:3000/tasks", {
                tasks: input, // Using the input value
                completed: false, // Default value
            });
            setData([...data, res.data]); // Add the new task to the list
            setInput(""); // Clear input field
        } catch (err) {
            console.error("Error adding task:", err.message);
        }
    };

    // Mark a task as completed
    const markCompleted = async (taskId) => {
        try {
            const updatedTask = await axios.patch(`http://localhost:3000/tasks/${taskId}`, {
                completed: true,
            });
            setData(
                data.map((task) =>
                    task._id === taskId ? { ...task, completed: updatedTask.data.completed } : task
                )
            );
        } catch (err) {
            console.error("Error updating task:", err.message);
        }
    };

    const deleteTask = async (taskId) => {
        try {
            await axios.delete(`http://localhost:3000/tasks/${taskId}`);
            setData(data.filter((task) => task._id !== taskId)); // Remove the task from local state
        } catch (err) {
            console.error("Error deleting task:", err.message);
        }
    };

    return (
        <div className="flex flex-col items-center p-4">
            <h1 className="text-4xl font-bold mb-4">To-Do List</h1>

            {/* Input for adding a task */}
            <div className="flex items-center mb-4">
                <input
                    type="text"
                    className="border-2 border-gray-400 p-2 rounded mr-2"
                    placeholder="Add a task"
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                />
                <button
                    className="bg-blue-500 text-white px-4 py-2 rounded"
                    onClick={(e) => {
                        e.preventDefault();
                        addTask();
                    }}
                >
                    Add Task
                </button>
            </div>

            {/* Task List */}
            <ul className="w-1/2">
                {data.map((task) => (
                    <li
                        key={task._id}
                        className="flex justify-between items-center border-b p-2"
                    >
                        <span
                            className={`flex-1 ${
                                task.completed ? "line-through text-gray-500" : ""
                            }`}
                        >
                            {task.tasks}
                        </span>
                        <button
                            className="bg-green-500 hover:bg-lime-900 text-white px-4 py-2 rounded mr-2"
                            onClick={() => markCompleted(task._id)}
                            disabled={task.completed} // Disable button if already completed
                        >
                            {task.completed ? "completed" : "Mark as Done"}
                        </button>
                        <button
                            className="bg-red-500 hover:bg-red-900 text-white px-4 py-2 rounded gap-2"
                            onClick={() => deleteTask(task._id)}
                        >
                            Delete
                        </button>
                    </li>
                ))}
            </ul>
        </div>
    );
}

export default ToDo;

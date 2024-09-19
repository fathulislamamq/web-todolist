import React, { useState, useEffect } from "react";
import { collection, addDoc, getDocs, updateDoc, deleteDoc, doc } from "firebase/firestore";
import { db } from "../database/firebase"; // Import Firestore instance

const TodoList = () => {
  const [tasks, setTasks] = useState([]); // State to hold tasks from Firestore
  const [newTask, setNewTask] = useState(""); // State for input of new task

  // Fetch tasks from Firestore when component mounts
  useEffect(() => {
    const fetchTasks = async () => {
      try {
        const querySnapshot = await getDocs(collection(db, "todo")); // Fetch the collection 'todo'
        const tasksData = querySnapshot.docs.map((doc) => ({
          id: doc.id, // Store document ID
          ...doc.data(), // Store document data
        }));
        setTasks(tasksData); // Set tasks to state
      } catch (error) {
        console.error("Error fetching tasks: ", error);
      }
    };

    fetchTasks();
  }, []); // Run once when the component mounts

  // Add new task to Firestore
  const addTask = async () => {
    if (newTask.trim() !== "") {
      try {
        const docRef = await addDoc(collection(db, "todo"), {
          todo: newTask, // Save the task as 'todo'
          completed: false,
        });
        setTasks([...tasks, { id: docRef.id, todo: newTask, completed: false }]); // Add the new task to state
        setNewTask(""); // Clear the input field
      } catch (error) {
        console.error("Error adding task: ", error);
      }
    }
  };

  // Handle key down event for Enter and Ctrl+Enter
  const handleKeyDown = (e) => {
    if (e.key === "Enter") {
      if (e.ctrlKey) {
        // Ctrl+Enter for multi-line input
        setNewTask((prev) => prev + "\n");
      } else {
        // Enter key for adding task
        e.preventDefault();
        addTask();
      }
    }
  };

  // Toggle task completion in Firestore
  const toggleTaskCompletion = async (taskId, currentStatus) => {
    const taskRef = doc(db, "todo", taskId); // Reference to specific document by ID
    try {
      await updateDoc(taskRef, {
        completed: !currentStatus, // Toggle the completion status
      });
      setTasks((prevTasks) =>
        prevTasks.map((task) =>
          task.id === taskId ? { ...task, completed: !currentStatus } : task
        )
      );
    } catch (error) {
      console.error("Error updating task: ", error);
    }
  };

  // Delete task from Firestore
  const deleteTask = async (taskId) => {
    const taskRef = doc(db, "todo", taskId); // Reference to specific document by ID
    try {
      await deleteDoc(taskRef); // Delete the document
      setTasks((prevTasks) => prevTasks.filter((task) => task.id !== taskId)); // Update state after deletion
    } catch (error) {
      console.error("Error deleting task: ", error);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
      <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-md">
        <h1 className="text-2xl font-bold text-gray-800 mb-4">My To-Do List</h1>
        <div className="flex items-center mb-4">
          <textarea
            type="text"
            className="border-2 border-gray-300 rounded-lg w-full p-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
            placeholder="Add a new task..."
            value={newTask}
            onChange={(e) => setNewTask(e.target.value)}
            onKeyDown={handleKeyDown} // Handle Enter and Ctrl+Enter
            rows="1" // Allow it to expand for multi-line
          />
          <button
            className="ml-2 bg-blue-500 text-white p-2 rounded-lg hover:bg-blue-600 transition-all"
            onClick={addTask}
          >
            Add
          </button>
        </div>
        <ul className="space-y-2">
          {tasks.map((task) => (
            <li
              key={task.id}
              className={`flex justify-between items-center p-2 bg-gray-100 rounded-lg ${
                task.completed ? "line-through text-gray-400" : "text-gray-700"
              }`}
            >
              <span
                onClick={() => toggleTaskCompletion(task.id, task.completed)}
                className="cursor-pointer"
              >
                {task.todo}
              </span>
              <button
                className="ml-4 text-red-500 hover:text-red-700 transition-all"
                onClick={() => deleteTask(task.id)}
              >
                Delete
              </button>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default TodoList;

import React, { useState, useEffect } from "react";
import { useDispatch } from "react-redux";
import { saveState } from "../redux/cardDragableSlice";
import { FaFileUpload } from "react-icons/fa";
import { MdDelete } from "react-icons/md";

function LoadSavedData() {
  const dispatch = useDispatch();
  const [savedList, setSavedList] = useState([]);

  // Fetch saved list data when the component mounts
  const fetchSavedList = async () => {
    try {
      const response = await fetch("http://localhost:5000/api/saved");
      const data = await response.json();
      setSavedList(data);
    } catch (error) {
      console.error("Error fetching saved data:", error);
    }
  };

  // Fetch data initially
  useEffect(() => {
    fetchSavedList(); // Fetch saved list on mount
  }, []); // Empty dependency array, so this effect runs only once when the component mounts

  const handleLoad = (data) => {
    dispatch(saveState(data));
  };

  const handleDelete = async (id) => {
    try {
      const response = await fetch(`http://localhost:5000/api/delete/${id}`, {
        method: "DELETE",
      });

      if (response.ok) {
        setSavedList((prev) => prev.filter((item) => item._id !== id)); // Filter out deleted item
      } else {
        alert("Failed to delete item.");
      }
    } catch (error) {
      console.error("Error deleting item:", error);
      alert("An error occurred while deleting.");
    }
  };

  return (
    <div className="p-2 bg-gray-50 max-h-100 overflow-y-auto border border-gray-300 rounded-md shadow-sm">
      <h2 className="mb-2 text-base font-semibold text-gray-800">History</h2>

      {savedList.length === 0 ? (
        <p className="text-gray-600 text-sm">No saved data found.</p>
      ) : (
        <ul className="list-none p-0 m-0 space-y-2">
          {savedList.map((item) => (
            <li
              key={item._id}
              className="p-2 bg-white border border-gray-300 rounded-md flex items-center justify-between text-sm hover:shadow transition-shadow"
            >
              <div className="text-gray-700 font-normal">{item.name}</div>

              <div className="flex space-x-2">
                <button
                  onClick={() => handleLoad(item.data)}
                  className="w-6 h-6 bg-blue-500 text-white rounded-md flex items-center justify-center hover:bg-blue-600 transition-colors"
                  title="Load"
                >
                  <FaFileUpload className="w-3 h-3" />
                </button>

                <button
                  onClick={() => handleDelete(item._id)}
                  className="w-6 h-6 bg-red-500 text-white rounded-md flex items-center justify-center hover:bg-red-600 transition-colors"
                  title="Delete"
                >
                  <MdDelete className="w-3 h-3" />
                </button>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

export default LoadSavedData;
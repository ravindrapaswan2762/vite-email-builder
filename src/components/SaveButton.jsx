
import React from "react";
import { useSelector } from "react-redux";
import { toast } from 'react-toastify';

function SaveButton() {
  const droppedItems = useSelector((state) => state.cardDragable.droppedItems);

  const handleSave = async () => {
    console.log("droppedItems in ButtonSave: ",droppedItems);
    const saveData = {
      name: "Saved on " + new Date().toLocaleString(),
      data: droppedItems,
    };

    try {
      const response = await fetch("http://localhost:5000/api/save", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(saveData),
      });

      console.log("response: ",response);

      if (response.ok) {
        toast.success("Data saved successfully!");
      } else {
        toast.error("Data saved successfully!");
      }
    } catch (error) {
      console.error("Error saving data:", error);
      alert("An error occurred while saving.");
    }
  };

  return (
    <button
      onClick={handleSave}
      className="px-3 py-1 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition-colors"
    >
      Save
    </button>
  );
}

export default SaveButton;

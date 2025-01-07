
import React from "react";
import { useSelector } from "react-redux";
import { toast } from 'react-toastify';

function SaveButton() {

  const droppedItems = useSelector((state) => state.cardDragable.droppedItems);

  const {templateName, category, subject, language, version, status, activeTemplateId} = useSelector((state) => state.addTemplate);


  const handleSave = async () => {
    console.log("droppedItems in ButtonSave: ",droppedItems);
    const saveData = {
      templateName: templateName,
      category: category,
      subject: subject,
      language: language,
      data: droppedItems,
      version: version,
      status: status,
    };

    console.log("fetched template data from state: ", saveData);

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

  // const updateData = async () => {
  //   console.log("updatedItem: ");

  //   const updatedData = {
  //     data: droppedItems
  //   };

  //   try {
  //     const response = await fetch(`http://localhost:5000/api/update/${activeTemplateId}`, {
  //       method: "PUT",
  //       headers: {
  //         "Content-Type": "application/json",
  //       },
  //       body: JSON.stringify(updatedItem),
  //     });

  //     console.log("response: ", response);
  
  //     if (response.ok) {
  //       setData((prevData) =>
  //         prevData.map((item) => (item.id === updatedItem.id ? updatedItem : item))
  //       );
  //       console.log("Item updated successfully");
  //     } else {
  //       console.error("Failed to update item");
  //     }
  //   } catch (error) {
  //     console.error("Error updating item:", error);
  //   }
  
  //   setEditPopup({ isOpen: false, index: null, item: null });
  // };

  const clickHandler = () => {
    if(activeTemplateId){
      // updateData();
    }
    else{
      handleSave();
    }
  }

  return (
    <button
      onClick={clickHandler}
      className="px-3 py-1 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition-colors"
    >
      Save
    </button>
  );
}

export default SaveButton;

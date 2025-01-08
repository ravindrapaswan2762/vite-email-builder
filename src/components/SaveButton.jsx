
import React from "react";
import { toast } from 'react-toastify';
import { useDispatch, useSelector } from "react-redux";

import { setSelectTeplate } from "../redux/menubarSlice";
import { setBuilder, setViewClick } from "../redux/addTemplateSlice";


function SaveButton() {

  const droppedItems = useSelector((state) => state.cardDragable.droppedItems);

  const {templateName, category, subject, language, version, activeTemplateId} = useSelector((state) => state.addTemplate);

    const dispatch = useDispatch();


  const handleSave = async () => {
    console.log("handleSave called: ");
    const saveData = {
      user_id: null,
      templateName: templateName,
      category: category,
      subject: subject,
      language: language,
      data: droppedItems,
      version: version,
      status: "Pending",

      last_modified: new Date(),
      last_modified_by: null,
      module_id: null,
      template_structure: null,
      project_id: null,
      business_id: null
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

  const updateDropedItems = async () => {
    console.log("Updating data for template with ID:", activeTemplateId);
  
    try {
      const response = await fetch(`http://localhost:5000/api/updateDropedItems/${activeTemplateId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ data: droppedItems }), // Only send the `data` field
      });
  
      if (response.ok) {
        toast.success("Data updated successfully!");
        console.log("Item updated successfully");
      } else {
        console.error("Failed to update item");
        toast.error("Failed to update item.");
      }
    } catch (error) {
      console.error("Error updating item:", error);
      toast.error("An error occurred while updating.");
    }
  };
  

  const clickHandler = async () => {
    console.log("activeTemplateId: ",activeTemplateId);

    if(activeTemplateId){
      await updateDropedItems();

      setTimeout( ()=>{
        dispatch(setSelectTeplate(null));
        dispatch(setBuilder(null));
        dispatch(setViewClick(null));
      }, 3000)
    }
    else{
      handleSave();

      setTimeout( ()=>{
        dispatch(setSelectTeplate(null));
        dispatch(setBuilder(null));
        dispatch(setViewClick(null));
      }, 3000)
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

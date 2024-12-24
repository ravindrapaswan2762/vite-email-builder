import React, { useEffect } from "react";
import { TbDragDrop2 } from "react-icons/tb";
import DropingArea from "./DropingArea";
import { useSelector, useDispatch} from "react-redux";
import {  } from "../redux/cardDragableSlice";
import {  } from "../redux/cardDragableSlice";
import { setActiveEditor } from "../redux/cardToggleSlice";

import { useState } from "react";

import Text from "./domElements/Text";
import TextArea from "./domElements/TextArea";
import Image from "./domElements/Image";
import ColumnOne from "./domElements/ColumnOne";
import ColumnTwo from "./domElements/ColumnTwo";
import Button from "./domElements/Button";
import ColumnThree from "./domElements/ColumnThree";

import { setActiveWidgetId, setDroppedItems, setActiveWidgetName} from "../redux/cardDragableSlice";

import { RxCross2 } from "react-icons/rx";

import { deleteDroppedItemById } from "../redux/cardDragableSlice";

import { generateSourceCode, generateInlineStyles} from "./generateSourceCode";

const WrapperAttribute = () => {
  const { activeWidgetName, droppedItems, activeWidgetId } = useSelector((state) => state.cardDragable);
  const [sourceCode, setSourceCode] = useState("");


  useEffect( ()=>{
    renderWidget(activeWidgetName);
  }, [activeWidgetName])
  
  const { isColumnPopedUp } = useSelector((state) => state.cardToggle);
  
  const dispatch = useDispatch();

  const handleDrop = async (e) => {
    e.preventDefault();
    e.stopPropagation();
  
    if (!activeWidgetName) return; // Ensure activeWidgetName is set before adding
  
    // Dispatch to add the new widget/column to the array
    dispatch(
      setDroppedItems({
        id: Date.now(), // Unique ID
        name: activeWidgetName,
        type: activeWidgetName.includes("column") ? activeWidgetName : "widget", // Set type for columns or widgets
        parentId: null,
        styles: {}
      })

    );

    await dispatch(setActiveEditor(activeWidgetName));
    await dispatch(setActiveWidgetName(activeWidgetName));
    dispatch(setActiveWidgetId(activeWidgetId));


  };

  const onClickHandle = (e) => {
    e.stopPropagation();
    dispatch(setActiveWidgetName("wrapperAttribute"));
    dispatch(setActiveEditor("wrapperAttribute"));
  };

  const handleDelete = (id) => {
    dispatch(deleteDroppedItemById(id)); // Dispatch delete action with id
  };

  const handleShowSourceCode = () => {
    const generatedCode = generateSourceCode(droppedItems);
    setSourceCode(generatedCode);
    // console.log("Generated Source Code:\n", generatedCode);
  };

  
  // Function to render the DOM element based on widget name
  const renderWidget = (id, name) => {
    switch (name) {
      case "Text":
        return (
          <Text id={id}/>
        );
      case "TextArea":
        return <TextArea id={id}/>
      case "Button":
        return <Button id={id}/>;
      case "Image":
        return <Image id={id}/>;
      case "1-column":
        return (
          <ColumnOne handleDelete={()=>handleDelete(id)} id={id}/>
        );
      case "2-columns":
        return (
          <ColumnTwo handleDelete={()=>handleDelete(id)} id={id}/>
        );
      case "3-columns":
        return (
          <ColumnThree handleDelete={()=>handleDelete(id)} id={id}/>
        );
      default:
        return <div className="text-gray-500">Unknown Widget</div>;
    }
  };

  return (
    <div
      onDragOver={(e) => e.preventDefault()} // Allow drop
      onDrop={handleDrop} // Handle drop event
      className="w-[600px] min-h-[250px] border-2 rounded-lg bg-gray-100 p-1 relative hover:border-blue-500 transition-all pb-[50px]
      h-auto"
      tyle={{ paddingBottom: "10px", height: "auto" }}
      onClick={onClickHandle}
    >
      {/* Drag-and-Drop Indicator */}
      {droppedItems.map((item, index) => {
       
          // Render widgets
          return (
            <div key={item.id} className="mb-2">
              {renderWidget(item.id, item.name, handleDelete)}
            </div>
          );
        
      })}
      {/* DropingArea */}
      <DropingArea />
    </div>
  );
};

export default WrapperAttribute;
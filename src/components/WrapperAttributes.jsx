

import React, { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { setDroppedItems, deleteDroppedItemById } from "../redux/cardDragableSlice";
import { setActiveWidgetName, setActiveWidgetId } from "../redux/cardDragableSlice";
import { setActiveColumn, setActiveParentId } from "../redux/cardDragableSlice";
import { setActiveEditor } from "../redux/cardToggleSlice";

import Text from "./domElements/Text";
import TextArea from "./domElements/TextArea";
import Image from "./domElements/Image";
import ColumnOne from "./domElements/ColumnOne";
import ColumnTwo from "./domElements/ColumnTwo";
import ColumnThree from "./domElements/ColumnThree";
import Button from "./domElements/Button";
import Divider from "./domElements/Divider";
import Space from "./domElements/Space";
import SocialMedia from "./domElements/SocialMedia";

import { RxCross2 } from "react-icons/rx";
import { generateSourceCode } from "./generateSourceCode";

import { data } from "./domElements/data";
import { saveState } from "../redux/cardDragableSlice";

const WrapperAttribute = () => {
  const { activeWidgetName, droppedItems, activeWidgetId } = useSelector((state) => state.cardDragable);
  const dispatch = useDispatch();
  const [sourceCode, setSourceCode] = useState("");


  // useEffect( ()=> {
  //   dispatch(saveState(data));
  // }, []);

  useEffect(() => {
    renderWidget(activeWidgetName);
  }, [activeWidgetName]);

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (!activeWidgetName) return;
    dispatch(
      setDroppedItems({
        id: Date.now(),
        name: activeWidgetName,
        type: activeWidgetName.includes("column") ? activeWidgetName : "widget",
        parentId: null,
        styles: {},
      })
    );
    dispatch(setActiveEditor(activeWidgetName));
    dispatch(setActiveWidgetName(activeWidgetName));
    dispatch(setActiveWidgetId(activeWidgetId));
  };

  const handleShowSourceCode = () => {
    const generatedCode = generateSourceCode(droppedItems);
    setSourceCode(generatedCode);
  };

  // Render widgets with delete functionality
  const renderWidget = (id, name) => {
    let WidgetComponent;
    let additionalStyles = {};

    console.log("name in renderWidget: ",name);
  
    switch (name) {
      case "Text":
        WidgetComponent = <Text id={id} />;
        break;
      case "TextArea":
        WidgetComponent = <TextArea id={id} />;
        break;
      case "Button":
        WidgetComponent = <Button id={id} />;
        break;
      case "Image":
        WidgetComponent = <Image id={id} />;
        break;
      case "Divider":
        WidgetComponent = <Divider id={id} />;
        break;
      case "SocialMedia":
        WidgetComponent = <SocialMedia id={id} />;
        break;
      case "Space":
        WidgetComponent = <Space id={id} />;
        break;
      case "1-column":
        WidgetComponent = <ColumnOne id={id} />;
        additionalStyles = { position: "absolute", top: "-1px", right: "1px" }; // Fixed position for 1-column
        break;
      case "2-columns":
        WidgetComponent = <ColumnTwo id={id} />;
        additionalStyles = { position: "absolute", top: "-1px", right: "1px" }; // Fixed position for 2-columns
        break;
      case "3-columns":
        WidgetComponent = <ColumnThree id={id} />;
        additionalStyles = { position: "absolute", top: "-1px", right: "1px" }; // Fixed position for 3-columns
        break;
      default:
        WidgetComponent = <div className="text-gray-500">Unknown Widget</div>;
    }
  
    return (
      <div key={id} className="relative group mb-2"
      onClick={(e) => {
        e.stopPropagation();
        dispatch(setActiveColumn(null));
        dispatch(setActiveParentId(null));
        console.log("WrapperAttributes called");
      }}
      >
        {WidgetComponent}
        
        {/* Delete Button */}
        <button
          onClick={(e) => {
            e.stopPropagation();
            dispatch(deleteDroppedItemById({ parentId: id }));
          }}
          className="absolute top-2 right-2 text-white rounded-full opacity-0 bg-red-500 group-hover:opacity-100 transition-all duration-200"
          style={additionalStyles}
        >
          <RxCross2 size={14} />
        </button>
      </div>
    );
  };
  
  

  return (
    <div
      onDragOver={(e) => e.preventDefault()}
      onDrop={handleDrop}
      className="w-[600px] min-h-[250px] border-2 rounded-lg bg-gray-100 p-1 relative hover:border-blue-500 transition-all pb-[50px]"
      
    >
      {droppedItems.map((item) => renderWidget(item.id, item.name))}

    </div>
  );
};

export default WrapperAttribute;

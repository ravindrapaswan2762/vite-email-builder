import React, { useState, useEffect, useRef } from "react";
import { setActiveWidgetName } from "../../redux/cardDragableSlice";
import { setActiveEditor } from "../../redux/cardToggleSlice";
import { useDispatch, useSelector } from "react-redux";

import { setActiveWidgetId } from "../../redux/cardDragableSlice";
import { setActiveParentId } from "../../redux/cardDragableSlice";
import { setActiveColumn } from "../../redux/cardDragableSlice";

import { setWidgetOrElement } from "../../redux/cardDragableSlice";
import { setSmallGapInTop } from "../../redux/condtionalCssSlice";


import { PiDotsSixBold } from "react-icons/pi";

import { setHoverColumnInCC } from "../../redux/condtionalCssSlice";
import { setHoverParentInCC } from "../../redux/condtionalCssSlice";
import { setPaddingTopInCC } from "../../redux/condtionalCssSlice";
import { setPaddingBottom } from "../../redux/condtionalCssSlice";


const Divider = ({ id, parentId, column, parentName}) => {
  const [hoveredElement, setHoveredElement] = useState(false); // Track hovered element
  const [isFocused, setIsFocused] = useState(false); // Track focus state
  const dividerRef = useRef(null); // Ref to handle divider element

  const { activeWidgetId, droppedItems, activeParentId, activeColumn, widgetOrElement} = useSelector((state) => state.cardDragable);

  const dispatch = useDispatch();

  // Recursive function to find the styles based on activeWidgetId
  const findStylesById = (items, widgetId) => {
    for (const item of items) {
      if (item.id === id) {
        return item.styles || {};
      }

      // Check for children arrays (children, childrenA, childrenB, etc.)
      const nestedKeys = Object.keys(item).filter((key) => key.startsWith("children"));
      for (const key of nestedKeys) {
        const styles = findStylesById(item[key], widgetId);
        if (styles) {
          return styles;
        }
      }
    }
    return null;
  };

  const currentStyles = findStylesById(droppedItems, activeWidgetId) || {};

  const onClickHandle = (e) => {
    e.stopPropagation();

    dispatch(setActiveWidgetName("Divider"));
    dispatch(setActiveEditor("Divider"));
    dispatch(setActiveWidgetId(id));
    dispatch(setActiveParentId(parentId));
    dispatch(setActiveColumn(column));
    
    setIsFocused(true); 

  };

  const onMouseEnterHandler = () => setHoveredElement(true);
  const onMouseLeaveHandler = () => setHoveredElement(false);


  // ************************************************************************ 
    const onClickOutside = () => {
      setIsFocused(false);
    };
    useEffect(() => {
      const handleClickOutside = (event) => {
        if (dividerRef.current && !dividerRef.current.contains(event.target)) {
          onClickOutside(); // Call the function when clicking outside
        }
      };
  
      document.addEventListener("mousedown", handleClickOutside);
      return () => {
        document.removeEventListener("mousedown", handleClickOutside);
      };
    }, []);
    // *****************************************************************************
    // element exchange position through ui
    const onDragStart = (e) => {
      console.log("onDragStart called in Text");
      e.stopPropagation();
      e.dataTransfer.setData(
        "text/plain",
        JSON.stringify({
          id,
          name: "Divider",
          styles: currentStyles,
          type: "widget",
          content: null,
          parentId: parentId || null,
          column: column || null,
        })
      );

      // Create drag preview
      const dragPreview = document.createElement("div");
      dragPreview.style.fontSize = "16px"; // Font size for readability
      dragPreview.style.fontWeight = "bold"; // Bold text for visibility
      dragPreview.style.color = "#1d4ed8"; // Text color
      dragPreview.style.lineHeight = "1"; // Ensure proper line height
      dragPreview.style.whiteSpace = "nowrap"; // Prevent wrapping of text
      dragPreview.style.width = "100px"; // Allow text to determine width
      dragPreview.style.height = "20px"; // Automatically adjust height
      dragPreview.style.opacity = "1"; // Fully opaque for clear visibility
      dragPreview.innerText = "Divider"; // Set the plain text for the drag preview
      document.body.appendChild(dragPreview);

      // Set the custom drag image
      e.dataTransfer.setDragImage(dragPreview, dragPreview.offsetWidth / 2, dragPreview.offsetHeight / 2);

      // Cleanup after drag starts
      setTimeout(() => {
        document.body.removeChild(dragPreview);
      }, 0);

      dispatch(setWidgetOrElement("element"));
      dispatch(setSmallGapInTop(true));

      setTimeout(() => {
        dispatch(setPaddingBottom(true)); 
        dispatch(setPaddingTopInCC(true)); 
      }, 100); // Small delay ensures drag operation completes first
    };

    // ****************************************************************************************
    const handleRightClick = () =>{
      dispatch(setActiveWidgetId(id));
      dispatch(setActiveParentId(parentId));
      dispatch(setActiveColumn(column));
  
      setIsFocused(true);
    }

  return (
    <div
      onContextMenu={handleRightClick}
      style={{ position: "relative"}}
      className={`group
        ${
          isFocused
            ? "border-2 border-blue-500 bg-gray-100"
            : hoveredElement
            ? "border-dashed border border-blue-500"
            : ""
          } 
          ${(activeWidgetId==id) ? "border-2 border-blue-500" : ""}
        `}
      onMouseEnter={onMouseEnterHandler}
      onMouseLeave={onMouseLeaveHandler}
      onClick={onClickHandle}
    >

      {/* 🔹 Small Rectangular Box in the Top-Right Corner */}
      {hoveredElement && (
        <div
        className="absolute top-0 right-0 w-[25px] h-[20px] bg-blue-400 flex items-center justify-center cursor-grab shadow-md"
        style={{
          zIndex: 10
        }}
        draggable
        onDragStart={onDragStart}
        onDragEnd={()=>{
          dispatch(setSmallGapInTop(null));

          dispatch(setHoverParentInCC(null));
          dispatch(setHoverColumnInCC(null));
          dispatch(setPaddingTopInCC(null));
          dispatch(setPaddingBottom(null));
        }}
      >
        <PiDotsSixBold size={12} className="text-black" />
      </div>
      )}


      {/* Divider Element */}
      <hr
        onContextMenu={handleRightClick}
        ref={dividerRef}
        style={{
          ...currentStyles,
        }}
        className="w-full transition-all duration-300"
      />
    </div>
  );
};

export default Divider;

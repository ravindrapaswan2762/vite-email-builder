import React, { useState, useEffect, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";

import { setActiveEditor } from "../../redux/cardToggleSlice";
import { setActiveWidgetName } from "../../redux/cardDragableSlice";
import { updateElementContent, updateElementStyles } from "../../redux/cardDragableSlice";

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
import { setElementDragging } from "../../redux/cardDragableSlice";

const TextArea = ({ id, parentId, column, parentName}) => {
  const [val, setVal] = useState("");
  const [hoveredElement, setHoveredElement] = useState(false); // Hover state
  const [isFocused, setIsFocused] = useState(false); // Focus state
  const inputRef = useRef(null); // Ref for detecting clicks outside

  const { activeWidgetId, droppedItems, activeParentId, activeColumn, widgetOrElement, elementDragging} = useSelector((state) => state.cardDragable);
  const dispatch = useDispatch();

  // *****************************************************************************************************************
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

  // *******************************************************************************************************************
  // Recursive function to find the content based on activeWidgetId 
  const findContentById = (items, widgetId) => {
    for (const item of items) {
      if (item.id === widgetId) {
        return item.content || "";
      }

      // Check for children arrays (children, childrenA, childrenB, etc.)
      const nestedKeys = Object.keys(item).filter((key) => key.startsWith("children"));
      for (const key of nestedKeys) {
        const content = findContentById(item[key], widgetId);
        if (content) {
          return content;
        }
      }
    }
    return "";
  };

  useEffect(() => {
    const currentContent = findContentById(droppedItems, id);
    setVal(currentContent);
  }, []); 

  // *******************************************************************************************************************

  const handleInputChange = (e) => {
    const updatedValue = e.target.value;
    console.log("updatedValue: ",updatedValue);
    setVal(updatedValue);

    autoResize(e.target);

    // Dispatch content update to Redux
    dispatch(
      updateElementContent({
        id,
        content: updatedValue,
        ...(activeParentId && { parentId: activeParentId }),
        ...(activeColumn && { column: activeColumn }),
      })
    );

  };

  const onclickHandle = (e) => {
    e.stopPropagation();
    // e.preventDefault();

    dispatch(setActiveWidgetName("TextArea"));
    dispatch(setActiveEditor("TextArea"));
    dispatch(setActiveWidgetId(id));
    dispatch(setActiveParentId(parentId));
    dispatch(setActiveColumn(column));

    setIsFocused(true); // Set focus state
    
    console.log("droppedItems: ",droppedItems);
    console.log("currentStyles::::: ",currentStyles);
  };

  const onMouseEnterHandler = () => setHoveredElement(true);
  const onMouseLeaveHandler = () => setHoveredElement(false);

  const handleClickOutside = (e) => {
    if (inputRef.current && !inputRef.current.contains(e.target)) {
      setIsFocused(false); // Remove focus and reset background and border
    }
  };

  useEffect(() => {
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);



  // *************************************************************************

  const autoResize = (textarea) => {
    textarea.style.height = `${textarea.scrollHeight}px`; // Set height to scrollHeight
    console.log("textarea.scrollHeight: ",textarea.scrollHeight);

    // Dispatch height update to Redux
    dispatch(
      updateElementStyles({
        id,
        styles: { height: `${textarea.scrollHeight}px` },
        ...(activeParentId && { parentId: activeParentId }),
        ...(activeColumn && { column: activeColumn }),
      })
    );
  };

  // ************************************************************************ 
    const onClickOutside = () => {
      setIsFocused(false);
    };
    useEffect(() => {
      const handleClickOutside = (event) => {
        if (inputRef.current && !inputRef.current.contains(event.target)) {
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
        console.log("onDragEnd called in textarea: ############################################################");
        console.log("onDragStart called in Text");
        e.stopPropagation();

        e.dataTransfer.setData(
          "text/plain",
          JSON.stringify({
            id,
            name: "TextArea",
            styles: currentStyles,
            type: "widget",
            content: val,
            parentId: parentId || null,
            column: column || null,
          })
        );

        // Create drag preview
        const dragPreview = document.createElement("div");
        dragPreview.style.fontSize = "16px";
        dragPreview.style.fontWeight = "bold";
        dragPreview.style.color = "#1d4ed8";
        dragPreview.style.lineHeight = "1";
        dragPreview.style.whiteSpace = "nowrap";
        dragPreview.style.padding = "6px 10px"; // Padding for better visibility
        dragPreview.style.borderRadius = "6px"; // Rounded corners
        dragPreview.style.background = "rgba(255, 255, 255, 0.9)"; // Background color with opacity
        dragPreview.style.border = "1px solid #1d4ed8"; // Border styling
        dragPreview.style.boxShadow = "0 4px 6px rgba(0,0,0,0.1)"; // Soft shadow effect
        dragPreview.style.position = "absolute";
        dragPreview.style.top = "0px"; 
        dragPreview.style.left = "0px"; 
        dragPreview.innerText = 'Text'
    
    
        document.body.appendChild(dragPreview); // Temporarily add (required for setDragImage)
        e.dataTransfer.setDragImage(dragPreview, dragPreview.offsetWidth / 2, dragPreview.offsetHeight / 2);
        dispatch(setElementDragging(true));
    
        setTimeout(() => {
            document.body.removeChild(dragPreview); // Remove preview from DOM after drag starts
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
      className={`group flex relative bg-transparent
        ${!elementDragging && isFocused ? "border-2 border-blue-500 bg-gray-100" : ""}
        ${!elementDragging && activeWidgetId === id ? "border-2 border-blue-500" : ""}
        ${!elementDragging && hoveredElement ? "border border-blue-500" : ""}
      `}
      onMouseEnter={onMouseEnterHandler}
      onMouseLeave={onMouseLeaveHandler}
      ref={inputRef} // Add the ref to the parent div to detect clicks outside

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
            console.log("onDragEnd called in textarea: ############################################################");
            dispatch(setSmallGapInTop(null));

            dispatch(setHoverParentInCC(null));
            dispatch(setHoverColumnInCC(null));
            dispatch(setPaddingTopInCC(null));
            dispatch(setPaddingBottom(null));
            dispatch(setElementDragging(null));
          }}
        >
          <PiDotsSixBold size={12} className="text-black" />
        </div>
        )}


      {/* Text Area */}
      <textarea
        onContextMenu={handleRightClick}
        onChange={handleInputChange}
        onClick={onclickHandle}
        className={`bg-transparent p-2 w-full rounded focus:outline-none transition-all duration-300 focus:outline-none focus:ring-0`}
        placeholder="Text Area"
        value={val}
        style={{
          ...currentStyles,
          overflow: "hidden", // Hide scrollbar
          resize: "none", // Disable manual resizing
          whiteSpace: "pre-wrap", // Preserve line breaks and spaces
          wordWrap: "break-word", // Break long words
          pointerEvents: ["element", "widget", "column"].includes(widgetOrElement) ? "none" : "auto",
        }} // Apply dynamic styles
      />

    </div>
  );
};

export default TextArea;

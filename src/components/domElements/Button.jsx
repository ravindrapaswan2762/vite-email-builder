import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { setActiveWidgetName } from "../../redux/cardDragableSlice";
import { setActiveEditor } from "../../redux/cardToggleSlice";
import { useRef } from "react";

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



const Button = ({ id, parentId, column, parentName}) => {

  const [isFocused, setIsFocused] = useState(false); // Track focus state
  const [hoveredElement, setHoveredElement] = useState(false); // Track hover state

  const { activeWidgetId, droppedItems, activeParentId, activeColumn, widgetOrElement, elementDragging } = useSelector((state) => state.cardDragable);

  const dispatch = useDispatch();
  const inputRef = useRef(null);


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

  const onclickHandle = (e) => {
    e.stopPropagation();
    // e.preventDefault();
    console.log("onclickHandle called in button ############################# ");
    
    dispatch(setActiveWidgetName("Button"));
    dispatch(setActiveEditor("Button"));
    dispatch(setActiveWidgetId(id));
    dispatch(setActiveParentId(parentId));
    dispatch(setActiveColumn(column));

    setIsFocused(true);

    console.log("droppedItems: ", droppedItems);
    console.log("widgetOrElement in button: ",widgetOrElement)
  };

  const onMouseEnterHandler = () => setHoveredElement(true);
  const onMouseLeaveHandler = () => setHoveredElement(false);

  // ************************************************************************ 
    const onClickOutside = () => {
      setIsFocused(false);
    };
    useEffect(() => {
      const handleClickOutside = (event) => {
        // Check if the click is outside the input field
        if (inputRef.current && !inputRef.current.contains(event.target)) {
          onClickOutside(); // Call the function when clicking outside
        }
      };
  
      document.addEventListener("mousedown", handleClickOutside);
      return () => {
        document.removeEventListener("mousedown", handleClickOutside);
      };
    }, [inputRef]); // Add inputRef to the dependency array

    // *****************************************************************************
 
      const onDragStart = (e) => {
        console.log("onDragStart called in button: ############################################################")
        e.stopPropagation();
        e.dataTransfer.setData(
          "text/plain",
          JSON.stringify({
            id,
            name: "Button",
            styles: currentStyles,
            type: "widget",
            content: null,
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
        dragPreview.innerText = 'Button'
    
    
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

      
      // **********************************************************************************
      const handleRightClick = () =>{
        dispatch(setActiveWidgetId(id));
        dispatch(setActiveParentId(parentId));
        dispatch(setActiveColumn(column));

        setIsFocused(true);
      }

  return (
    <div
    onMouseUp={()=>{
      dispatch(setWidgetOrElement(null));
    }}
      // className={`flex justify-center w-full relative
      //   ${
      //     isFocused
      //       ? "border-2 border-blue-500 bg-gray-100"
      //       : elementDragging ? "" : hoveredElement ? "border-dashed border border-blue-500"
      //       : ""
      //     } 
      //     ${(activeWidgetId==id) ? "border-2 border-blue-500" : ""}
      // `}
      className={`flex justify-center w-full relative
        ${!elementDragging && isFocused ? "border-2 border-blue-500 bg-gray-100" : ""}
        ${!elementDragging && activeWidgetId === id ? "border-2 border-blue-500" : ""}
        ${!elementDragging && hoveredElement ? "border border-blue-500" : ""}
      `}
      
      
      
      style={{backgroundColor: `${currentStyles.backgroundColor || "transparent"}` }}
      onMouseEnter={onMouseEnterHandler}
      onMouseLeave={onMouseLeaveHandler}
  
      onClick={onclickHandle}
      onContextMenu={handleRightClick}
    >


      {/* Outer Container with Dashed Border */}
      <div

        className={`relative w-full h-[40px] bg-transparent  flex items-center p-0.5 transition-all duration-300`}

        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: `${currentStyles.textAlign || "center"}`,
          height: "auto",
          
        }}
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
            console.log("onDragEnd called in button: ############################################################")
            dispatch(setSmallGapInTop(null));
    
            dispatch(setHoverParentInCC(null));
            dispatch(setHoverColumnInCC(null));
            dispatch(setPaddingTopInCC(null));
            dispatch(setPaddingBottom(null));
            dispatch(setWidgetOrElement(null));
            dispatch(setElementDragging(null));
            
          }}
          
        
        >
          <PiDotsSixBold size={12} className="text-black" />
        </div>
        )}
        


        {/* Button Content */}
        <button

        ref={inputRef}
          style={{ ...currentStyles, backgroundColor: `${currentStyles.buttonColor || "#1d4ed8"}` }}
          className="relative bg-blue-500 text-white px-3 py-2 rounded-md hover:bg-blue-600 transition duration-200 text-center"
        >
          {currentStyles.content || "Click Here"}
        </button>

      </div>
    </div>
  );
};

export default Button;

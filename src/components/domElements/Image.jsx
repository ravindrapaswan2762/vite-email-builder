import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { setActiveEditor } from "../../redux/cardToggleSlice";
import {setActiveWidgetName } from "../../redux/cardDragableSlice";
import { useRef } from "react";

import img from '../../assets/placeholder.png';

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

const Image = ({ id, parentId, column, parentName}) => {

  const { activeWidgetId, droppedItems, activeParentId , activeColumn, widgetOrElement,elementDragging } = useSelector((state) => state.cardDragable);

  const [imageSrc, setImageSrc] = useState(""); // State for the image source
  const [hoveredElement, setHoveredElement] = useState(false); // State for hover
  const [isFocused, setIsFocused] = useState(false); // State for focus

  const imageRef = useRef(null);

  // Find the styles associated with the widget by its ID
  const findStylesById = (items, widgetId) => {
    for (const item of items) {
      if (item.id === id) {
        return item.styles || {};
      }
      // Check for nested children arrays
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

  const dispatch = useDispatch();

  // Placeholder image URL
  const placeholderImage = img;

  const handleImageUpload = (e) => {
    const file = e.target.files[0]; // Get the selected file
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImageSrc(reader.result); // Set the image source
      };
      reader.readAsDataURL(file);
    }
  };

  const onMouseEnterHandler = () => setHoveredElement(true);
  const onMouseLeaveHandler = () => setHoveredElement(false);

  const onClickHandler = (e) => {
    e.stopPropagation();
    // e.preventDefault();
    
    dispatch(setActiveWidgetName("Image"));
    dispatch(setActiveEditor("Image"));
    dispatch(setActiveWidgetId(id));
    dispatch(setActiveParentId(parentId));
    dispatch(setActiveColumn(column));

    setIsFocused(true);

    console.log("currentStyles in image:::::: ", currentStyles);

  };

  // ************************************************************************ 
  const onClickOutside = () => {
    setIsFocused(false);
  };
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (imageRef.current && !imageRef.current.contains(event.target)) {
        onClickOutside(); // Call the function when clicking outside
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);
  
  // *****************************************************************************
  const onDragStart = (e) => {
    console.log("onDragStart called in Text");
    e.stopPropagation();
    e.dataTransfer.setData(
      "text/plain",
      JSON.stringify({
        id,
        name: "Image",
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
    dragPreview.innerText = 'Image'


    document.body.appendChild(dragPreview); // Temporarily add (required for setDragImage)
    e.dataTransfer.setDragImage(dragPreview, dragPreview.offsetWidth / 2, dragPreview.offsetHeight / 2);
    dispatch(setElementDragging(true));

    setTimeout(() => {
        document.body.removeChild(dragPreview); // Remove preview from DOM after drag starts
    }, 0);

    dispatch(setWidgetOrElement("element"));
    dispatch(dispatch(setSmallGapInTop(true)));

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

  console.log("parentName: oooooooooooooooooooooooooooooooooooooooooooooooooooooooooo",parentName);
    

  return (
    <div
      ref={imageRef}
      style={{
        position: "relative",
        overflow: "visible"
      }}  
      // Removed "flex items-center justify-center" so the image can span the full width
      className={`relative rounded-md text-center w-full h-auto relative overflow-hidden bg-transparent mb-1
          
        ${!elementDragging && isFocused ? "border-2 border-blue-500 bg-gray-100" : ""}
        ${!elementDragging && activeWidgetId === id ? "border-2 border-blue-500" : ""}
        ${!elementDragging && hoveredElement ? "border border-blue-500" : ""}

        `}
      onMouseEnter={onMouseEnterHandler}
      onMouseLeave={onMouseLeaveHandler}
      onClick={onClickHandler}

    >

      {/* Image or Placeholder */}
      {currentStyles.imageUrl ? (
        <a 
          href={currentStyles.href || "#"} 
          target={currentStyles.target || "_self"} 
          rel="noopener noreferrer"
          className="transition-all duration-300"
        >

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
                dispatch(setElementDragging(null));
              }}
            >
              <PiDotsSixBold size={12} className="text-black" />
            </div>
            )}

          <img
            onContextMenu={handleRightClick}
            src={currentStyles.imageUrl}
            alt="Uploaded"
            className="w-full h-full object-contain rounded transition-all duration-300"
            style={{
              ...currentStyles, 
            }}
            
          />
        </a>
      
      ) : imageSrc ? (

        <div className="flex flex-col items-center justify-center text-gray-500">
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

          <img
            onContextMenu={handleRightClick}
            src={imageSrc}
            alt="Uploaded"
            // Ensures the image takes the full width, auto height, and retains aspect ratio
            className="w-full h-full object-contain rounded transition-all duration-300"
            style={{
              ...currentStyles, 
            }}
          />
        </div>
        
        
      ) : (
        <div className="flex flex-col items-center justify-center text-gray-500">

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


          <img
            onContextMenu={handleRightClick}
            src={placeholderImage}
            alt="Placeholder"
            className={`w-full rounded opacity-90 transition-all duration-300 
             
            `}
            style={{
              ...currentStyles, 
              }}
          />
        </div>
      )}


      {/* Hidden File Input */}
      {/* <input
        type="file"
        id="image-upload"
        accept="image/*"
        className="absolute inset-0 opacity-0 cursor-pointer"
        onChange={handleImageUpload}
      /> */}
     
    </div>
  );
};

export default Image;

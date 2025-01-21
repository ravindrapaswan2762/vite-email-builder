import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { RxCross2 } from "react-icons/rx";
import { setActiveEditor } from "../../redux/cardToggleSlice";
import {setActiveWidgetName } from "../../redux/cardDragableSlice";
import { useRef } from "react";

import img from '../../assets/placeholder.png';
import { setActiveNodeList } from "../../redux/treeViewSlice";

import { AiOutlineDrag } from "react-icons/ai";
import { replaceDroppedItem } from "../../redux/cardDragableSlice";

import { setActiveWidgetId } from "../../redux/cardDragableSlice";
import { setActiveParentId } from "../../redux/cardDragableSlice";
import { setActiveColumn } from "../../redux/cardDragableSlice";
import { updateElementStyles } from "../../redux/cardDragableSlice";


import { setColumnOneExtraPadding } from "../../redux/condtionalCssSlice";
import { setColumnTwoExtraPadding } from "../../redux/condtionalCssSlice";
import { setColumnThreeExtraPadding } from "../../redux/condtionalCssSlice";
import { setWrapperExtraPadding } from "../../redux/condtionalCssSlice";

import { setWidgetOrElement } from "../../redux/cardDragableSlice";
import { addElementAtLocation } from "../../redux/cardDragableSlice";


const Image = ({ id, parentId, column}) => {
  const [imageSrc, setImageSrc] = useState(""); // State for the image source
  const [hoveredElement, setHoveredElement] = useState(false); // State for hover
  const [isFocused, setIsFocused] = useState(false); // State for focus
  const [extraGap, setExtraGap] = useState(null);

  const imageRef = useRef(null);

  const { activeWidgetId, droppedItems, activeParentId , activeColumn, widgetOrElement } = useSelector((state) => state.cardDragable);
  const {activeNodeList} = useSelector((state) => state.treeViewSlice);

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
          console.log("findStylesById: ", styles);
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
    // e.stopPropagation();
    // e.preventDefault();
    dispatch(setActiveWidgetName("Image"));
    dispatch(setActiveEditor("Image"));
    dispatch(setActiveWidgetId(id));

    setIsFocused(true);
    dispatch(setActiveNodeList(true));

  };

  // ************************************************************************ 
    const onClickOutside = () => {
      setIsFocused(false);
      dispatch(setActiveNodeList(false));

      console.log("Image outside called!!: ",activeNodeList);
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
    // element exchange position through ui
      const onDragStart = (e) => {
        console.log("onDragStart called in Text");
        e.stopPropagation();
        e.dataTransfer.setData(
          "text/plain",
          JSON.stringify({
            id,
            parentId: activeParentId || null,
            column: activeColumn || null,
          })
        );

        dispatch(setColumnOneExtraPadding(false));
        dispatch(setWidgetOrElement("element"));
      };
      
      const onDrop = (e) => {
        e.stopPropagation();

        const draggedName = e.dataTransfer.getData("text/plain"); // Get the widget name directly
        const restrictedWidgets = ["Text", "TextArea", "Button", "Image", "Divider", "Space", "SocialMedia"];
        if (restrictedWidgets.includes(draggedName)) {
          alert("Please drop it in an black space.");
          return;
        }
        
        const droppedData = JSON.parse(e.dataTransfer.getData("text/plain"));

        setExtraGap(null);
        
        if(widgetOrElement && widgetOrElement === "widget"){
              // for droped widgets from left panel
              dispatch(
                addElementAtLocation({
                  draggedNodeId: Date.now(), 
                  draggedName: droppedData.name, 
                  dragableType: droppedData.type,
                  
                  targetParentId: parentId, 
                  targetColumn: column, 
                  targetNodeId: id, 
                })
              )
            }
          else{
              dispatch(
                replaceDroppedItem({
                  parentId: activeParentId || null,
                  column: activeColumn || null,
                  draggedNodeId: droppedData.id,
                  targetNodeId: id,
                }) 
              );
          }

        // initialize the application after exchage the position
        dispatch(setActiveWidgetId(null));
        dispatch(setActiveParentId(null));
        dispatch(setActiveColumn(null));

        dispatch(setColumnOneExtraPadding(false));
        dispatch(setColumnTwoExtraPadding(false));
        dispatch(setColumnThreeExtraPadding(false));
        dispatch(setWrapperExtraPadding(false));
      };
      
      const onDragOver = (e) => {
        console.log("onDragOver called in Text");
        e.preventDefault(); // Allow dropping
      };
      //******************************************************************************** */ 
      const onDragEnterHandle = () => {
        console.log("onDragEnterHandle called in Image");

        setExtraGap(true);
      }
    
      const onDragLeaveHandle = () => {
        setExtraGap(null);
    
      }
    // ****************************************************************************************

  return (
    <div
      ref={imageRef}
      // Removed "flex items-center justify-center" so the image can span the full width
      className={`rounded-md text-center w-full h-auto relative overflow-hidden bg-transparent
          
        ${
          isFocused
            ? "border-2 border-blue-500 bg-gray-100"
            : hoveredElement
            ? "border-dashed border border-blue-500"
            : ""
          } 
          ${(activeWidgetId==id && activeNodeList) ? "border-2 border-blue-500" : ""}

        `}
      onMouseEnter={onMouseEnterHandler}
      onMouseLeave={onMouseLeaveHandler}
      onClick={onClickHandler}

      draggable
      onDragStart={onDragStart}
      onDrop={onDrop}
      onDragOver={onDragOver}

      onDragEnter={onDragEnterHandle}
      onDragLeave={onDragLeaveHandle}

    >

      {/* Drag Icon */}
      {(activeWidgetId==id) ? (
        <AiOutlineDrag
          style={{
            position: "absolute",
            // left: "-10px",
            top: "50%",
            transform: "translateY(-50%)",
            cursor: "grab",
            zIndex: 10,
            backgroundColor: "white",
            borderRadius: "50%",
          }}
          // className="bg-gray-100"
        />
      ) : ""}
      

      {/* Image or Placeholder */}
      {currentStyles.imageUrl ? (
        <a 
          href={currentStyles.href || "#"} 
          target={currentStyles.target || "_self"} 
          rel="noopener noreferrer"
        >
          <img
            src={currentStyles.imageUrl}
            alt="Uploaded"
            className="w-full h-full object-contain rounded transition-all duration-300"
            style={{...currentStyles, ...(extraGap ? { paddingTop: "150px" } : { paddingTop: currentStyles.paddingTop })}}
            
          />
        </a>
      
      ) : imageSrc ? (
        <img
          src={imageSrc}
          alt="Uploaded"
          // Ensures the image takes the full width, auto height, and retains aspect ratio
          className="w-full h-full object-contain rounded transition-all duration-300"
          style={{...currentStyles, ...(extraGap ? { paddingTop: "150px" } : { paddingTop: "" })}}
        />
      ) : (
        <div className="flex flex-col items-center justify-center text-gray-500 transition-all duration-300">
          <img
            src={placeholderImage}
            alt="Placeholder"
            className="w-full h-auto object-contain rounded opacity-90"
            style={{...currentStyles, ...(extraGap ? { paddingTop: "150px" } : { paddingTop: "" })}}
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

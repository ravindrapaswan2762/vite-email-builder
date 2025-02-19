import React, { useState, useEffect, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { setActiveWidgetName } from "../../redux/cardDragableSlice";
import { setActiveEditor } from "../../redux/cardToggleSlice";
import {setActiveBorders} from '../../redux/activeBorderSlice'

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



// Icons (Replace these with your actual logo images or imports)
import { FaFacebook, FaGoogle, FaTwitter } from "react-icons/fa"; // Example using FontAwesome icons

const SocialMedia = ({ id, parentId, column, parentName}) => {
  const [hoveredElement, setHoveredElement] = useState(false); // Track hover state
  const [isFocused, setIsFocused] = useState(false); // Track focus state
  const containerRef = useRef(null); // Ref for detecting outside clicks
  const {view} = useSelector( (state) => state.navbar );

  const { activeWidgetId, droppedItems, activeParentId, activeColumn, widgetOrElement,elementDragging} = useSelector((state) => state.cardDragable);
  const dispatch = useDispatch();

  // Recursive function to find the styles based on activeWidgetId
  const findStylesById = (items, widgetId) => {
    for (const item of items) {
      if (item.id === id) {
        return item.styles || {};
      }

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
    dispatch(setActiveWidgetName("SocialMedia"));
    dispatch(setActiveEditor("SocialMedia"));
    dispatch(setActiveWidgetId(id));
    dispatch(setActiveParentId(parentId));
    dispatch(setActiveColumn(column));

    setIsFocused(true); // Set focus state
    
    // dispatch(setActiveBorders(true));
  };

  const onMouseEnterHandler = () => setHoveredElement(true);
  const onMouseLeaveHandler = () => setHoveredElement(false);

  const handleClickOutside = (e) => {
    if (containerRef.current && !containerRef.current.contains(e.target)) {
      setIsFocused(false); // Remove focus
    }
  };

  useEffect(() => {
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);


   // ************************************************************************ 
    const onClickOutside = () => {
      setIsFocused(false);
    };
    useEffect(() => {
      const handleClickOutside = (event) => {
        if (containerRef.current && !containerRef.current.contains(event.target)) {
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
            name: "SocialMedia",
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
        dragPreview.innerText = 'Social Media'
    
    
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
      ref={containerRef}
      className={`relative flex items-center justify-center gap-4 p-3 rounded
                  sm:flex-col sm:gap-2 sm:justify-center sm:items-center
                  // deleted for md screen
                  
                  ${!elementDragging && isFocused ? "border-2 border-blue-500 bg-gray-100" : ""}
                  ${!elementDragging && activeWidgetId === id ? "border-2 border-blue-500" : ""}
                  ${!elementDragging && hoveredElement ? "border border-blue-500" : ""}
        `}

      style={{...currentStyles, 
        ...(view === "Desktop" ? {display: "flex", flexDirection: "column" } : {}),
        
      }}
      onMouseEnter={onMouseEnterHandler}
      onMouseLeave={onMouseLeaveHandler}
      onClick={onClickHandle}
      onContextMenu={handleRightClick}

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
            dispatch(setElementDragging(null));
          }}
        >
          <PiDotsSixBold size={12} className="text-black" />
        </div>
        )}
      

      <div className="flex items-center justify-center gap-2 cursor-pointer" onClick={()=>dispatch(setActiveBorders(true))}>
        <FaFacebook className="text-xl text-blue-600" />
      </div>
      <div className="flex items-center justify-center gap-2 cursor-pointer" onClick={()=>dispatch(setActiveBorders(true))}>
        <FaGoogle className="text-xl text-red-600" />
      </div>
      <div className="flex items-center justify-center gap-2 cursor-pointer" onClick={()=>dispatch(setActiveBorders(true))}>
        <FaTwitter className="text-xl text-blue-400" />
      </div>
    </div>

  );

};

export default SocialMedia;

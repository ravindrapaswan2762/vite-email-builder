import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { setActiveWidgetName } from "../redux/cardDragableSlice";
import { setActiveEditor } from "../redux/cardToggleSlice";
import { useRef } from "react";

import { setActiveWidgetId } from "../redux/cardDragableSlice";
import { setActiveParentId } from "../redux/cardDragableSlice";
import { setActiveColumn } from "../redux/cardDragableSlice";

import { setWidgetOrElement } from "../redux/cardDragableSlice";
import { setSmallGapInTop } from "../redux/condtionalCssSlice";

import { PiDotsSixBold } from "react-icons/pi";

import { setHoverColumnInCC } from "../redux/condtionalCssSlice";
import { setHoverParentInCC } from "../redux/condtionalCssSlice";
import { setPaddingTopInCC } from "../redux/condtionalCssSlice";
import { setPaddingBottom } from "../redux/condtionalCssSlice";
import { setElementDragging } from "../redux/cardDragableSlice";

const GoogleMap = ({ id, parentId, column, parentName }) => {
  const { activeWidgetId, droppedItems, elementDragging, widgetOrElement } = useSelector((state) => state.cardDragable);
  const [mapData, setMapData] = useState({ location: "atmik bharat enginering pvt ltd ,Nehru nahar bhilai", zoom: 10, height: 400 });

  const [isFocused, setIsFocused] = useState(false); // Track focus state
  const [hoveredElement, setHoveredElement] = useState(false); // Track hover state
  const [mapStyles, setMapStyles] = useState({});
  const dispatch = useDispatch();
  const mapRef = useRef(null);


  const buildMapUrl = () => {
    const encodedLocation = encodeURIComponent(mapData.location);
    return `https://www.google.com/maps/embed/v1/place?key=AIzaSyB77kZY5EKXeJK-P0t3dOBDGVkbsQlnhUc&q=${encodedLocation}&zoom=${mapData.zoom}`;
  };

  //**********************************************
  // **Find Map Styles from Redux**
  const findStylesById = (items, widgetId) => {
    for (const item of items) {
      if (item.id === widgetId) {
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
    return {};
  };

  useEffect(() => {
    const currentStyles = findStylesById(droppedItems, activeWidgetId) || {};
    setMapStyles(currentStyles);
    setMapData({
      location: currentStyles.location || "atmik bharat enginering pvt ltd ,Nehru nahar bhilai",
      zoom: currentStyles.zoom || 10,
      height: currentStyles.height || 400,
    });
  }, [activeWidgetId, droppedItems]);

  useEffect(() => {
    const currentStyles = findStylesById(droppedItems, activeWidgetId) || {};
    setMapStyles(currentStyles);
    setMapData({
      location: currentStyles.location || "atmik bharat enginering pvt ltd ,Nehru nahar bhilai",
      zoom: currentStyles.zoom || 10,
      height: currentStyles.height || 400,
    });
  }, []);

   

  const onDragStart = (e) => {
      console.log("onDragStart called in VideoPlayer: ############################################################")
      e.stopPropagation();
      e.dataTransfer.setData(
        "text/plain",
        JSON.stringify({
          id,
          name: "GoogleMap",
          styles: mapStyles,
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
      dragPreview.innerText = 'GoogleMap'
  
  
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
  
    const onMouseEnterHandler = () => setHoveredElement(true);
    const onMouseLeaveHandler = () => setHoveredElement(false);
  
    const onclickHandle = (e) => {
      e.stopPropagation();
      // e.preventDefault();
      console.log("onclickHandle called in Map ############################# ");
      
      dispatch(setActiveWidgetName("GoogleMap"));
      dispatch(setActiveEditor("GoogleMap"));
      dispatch(setActiveWidgetId(id));
      dispatch(setActiveParentId(parentId));
      dispatch(setActiveColumn(column));
  
      setIsFocused(true);
  
      console.log("droppedItems: ", droppedItems);
      console.log("widgetOrElement in button: ",widgetOrElement)
    };
  
    const handleRightClick = () =>{
      dispatch(setActiveWidgetId(id));
      dispatch(setActiveParentId(parentId));
      dispatch(setActiveColumn(column));
  
      setIsFocused(true);
    }


  return (
    <div 
        ref={mapRef}
        onMouseUp={()=>{
            dispatch(setWidgetOrElement(null));
        }}
        className={`w-full h-auto relative aspect-[4/3]
            ${!elementDragging && isFocused ? "border-2 border-blue-500 bg-gray-100" : ""}
            ${!elementDragging && activeWidgetId === id ? "border-2 border-blue-500" : ""}
            ${!elementDragging && hoveredElement ? "border border-blue-500" : ""}
        `}

        onMouseEnter={onMouseEnterHandler}
        onMouseLeave={onMouseLeaveHandler}

        onClick={onclickHandle}
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
            console.log("onDragEnd called in ViddeoPlayer: ############################################################")
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


      <iframe
        className="absolute top-0 left-0 w-full h-full"
        src={buildMapUrl()}
        title="Google Map"
        frameBorder="0"
        allowFullScreen
      ></iframe>
    </div>

  );
};

export default GoogleMap;



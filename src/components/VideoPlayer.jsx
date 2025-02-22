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


export const VideoPlayer = ({ id, parentId, column, parentName }) => {
  const { activeWidgetId, droppedItems, elementDragging, widgetOrElement} = useSelector((state) => state.cardDragable);
  const [videoId, setVideoId] = useState('');
  const [videoStyles, setVideoStyles] = useState({});
  const [videoUrl, setVideoUrl] = useState("");

  const [isFocused, setIsFocused] = useState(false); // Track focus state
  const [hoveredElement, setHoveredElement] = useState(false); // Track hover state
  const dispatch = useDispatch();
  const videoRef = useRef(null);

  const defaultVideoUrl = "https://www.youtube.com/watch?v=XHOmBV4js_E";

  // **Extract YouTube Video ID from URL**
  function getYouTubeVideoId(url) {
    const regExp =
      /(?:youtube\.com\/(?:[^\/]+\/[^\/]+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=)|youtu\.be\/)([^"&?\/\s]{11})/;
    const match = url?.match(regExp);
    return match ? match[1] : null;
  }

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
  
  // **Fetch styles & videoUrl when widget changes**
  useEffect(() => {
    const currentStyles = findStylesById(droppedItems, id) || {};

    setVideoStyles(currentStyles);
    setVideoUrl(currentStyles.videoUrl? currentStyles.videoUrl : defaultVideoUrl);
    setVideoId(getYouTubeVideoId(currentStyles.videoUrl? currentStyles.videoUrl : defaultVideoUrl));
  }, [activeWidgetId, droppedItems]);

  // **Fetch styles & videoUrl when mount firs time**
  useEffect(() => {
    const currentStyles = findStylesById(droppedItems, activeWidgetId) || {};
    console.log("currentStyles in videoPlayer =>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>: ",currentStyles);

    setVideoStyles(currentStyles);
    setVideoUrl(currentStyles.videoUrl? currentStyles.videoUrl : defaultVideoUrl);
    setVideoId(getYouTubeVideoId(currentStyles.videoUrl? currentStyles.videoUrl : defaultVideoUrl));
  }, []);

  // **Build iframe URL with YouTube parameters**
  const buildIframeUrl = () => {
    if (!videoId) return "";

    const params = new URLSearchParams();

    if (videoStyles.autoplay) params.append("autoplay", "1");
    if (videoStyles.mute) params.append("mute", "1");
    if (videoStyles.loop) params.append("loop", "1");
    if (!videoStyles.playerControls) params.append("controls", "1");
    if (videoStyles.modestBranding) params.append("modestbranding", "1");
    if (videoStyles.captions) params.append("cc_load_policy", "1");
    if (videoStyles.privacyMode) params.append("privacy_mode", "1");

    return `https://www.youtube.com/embed/${videoId}?${params.toString()}`;
  };

  // *************************************************************************
  const onDragStart = (e) => {
    console.log("onDragStart called in VideoPlayer: ############################################################")
    e.stopPropagation();
    e.dataTransfer.setData(
      "text/plain",
      JSON.stringify({
        id,
        name: "VideoPlayer",
        styles: videoStyles,
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

  const onMouseEnterHandler = () => setHoveredElement(true);
  const onMouseLeaveHandler = () => setHoveredElement(false);

  const onclickHandle = (e) => {
    e.stopPropagation();
    // e.preventDefault();
    console.log("onclickHandle called in button ############################# ");
    
    dispatch(setActiveWidgetName("VideoPlayer"));
    dispatch(setActiveEditor("VideoPlayer"));
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
        ref={videoRef}
        onMouseUp={()=>{
          dispatch(setWidgetOrElement(null));
        }}
        className={`className="w-full h-0 relative pb-[56.25%] overflow-hidden"
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

          {videoId ? (
            <iframe
            className="absolute top-0 left-0 w-full h-full" // Makes video fit parent div
            src={buildIframeUrl()}
            title="YouTube Video Player"
            frameBorder="0"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
            ></iframe>
          ) : (
            <p className="text-red-500">Invalid or Missing YouTube URL</p>
          )}
    </div>
  );
};

export default VideoPlayer;

import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { setActiveParentId, setActiveWidgetId, setActiveWidgetName } from "../redux/cardDragableSlice";
import { setWidgetOrElement } from "../redux/cardDragableSlice";
import { setElementPaddingTop, setSmallGapInTop } from "../redux/condtionalCssSlice";
import { setWrapperExtraPadding } from "../redux/condtionalCssSlice";
import { setCustomClumnsExtraPadding } from "../redux/condtionalCssSlice";
import { setPaddingBottom } from "../redux/condtionalCssSlice";

import { setHoverColumnInCC } from "../redux/condtionalCssSlice";
import { setHoverParentInCC } from "../redux/condtionalCssSlice";
import { setPaddingTopInCC } from "../redux/condtionalCssSlice";

const Widget = ({ id, name, icon: Icon }) => {
  const dispatch = useDispatch();

  // Get the activeWidgetId from Redux state
  const { activeWidgetId, activeParentId, activeColumn } = useSelector((state) => state.cardDragable);

  // Check if the current widget is active
  const isActive = activeWidgetId === id;

  const defaultContent =
            name === "Text"
              ? "Design Beautiful Emails."
              : name === "TextArea"
              ? "Craft professional emails effortlessly with our drag-and-drop builder. Perfect for newsletters, promotions, and campaigns."
              : null; // Default to null if no specific content is neededcc
  

  return (
    <div
      draggable
      onDragStart={(e) => {
        console.log("onDragStart called in widget: ############################################################");
        e.dataTransfer.setData(
          "text/plain",
          JSON.stringify({
            name,
            id,
            parentId: activeParentId || null,
            column: activeColumn || null,
            type: "widget",
            content: defaultContent
          })
        );

        // e.dataTransfer.effectAllowed = "move"; // Allow move

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
        dragPreview.innerText = name==='Text' ? 'Heading' : name; // Set the plain text for the drag preview
        document.body.appendChild(dragPreview);

        // Set the custom drag image
        e.dataTransfer.setDragImage(dragPreview, dragPreview.offsetWidth / 2, dragPreview.offsetHeight / 2);
        
        dispatch(setActiveWidgetName(name));
        dispatch(setWidgetOrElement("widget"));
        dispatch(setActiveWidgetId(null));
        dispatch(setActiveParentId(null));
        dispatch(setSmallGapInTop(true));

        dispatch(setPaddingBottom(true));
        dispatch(setPaddingTopInCC(true));
      }}
      
      onDragEnd={() => {
        dispatch(setSmallGapInTop(null));
        dispatch(setActiveWidgetId(null));
        dispatch(setWrapperExtraPadding(null));
        dispatch(setCustomClumnsExtraPadding(null));
        dispatch(setElementPaddingTop(null));

        dispatch(setPaddingBottom(null));
        dispatch(setHoverColumnInCC(null));
        dispatch(setHoverParentInCC(null));
        dispatch(setPaddingTopInCC(null));
        dispatch(setWidgetOrElement(null));
        console.log("onDragEnd called in widget: ############################################################");
      }} // Reset active widget
      className={`flex flex-col items-center justify-center p-5 m-2 border rounded-lg shadow-md cursor-move w-[115px] h-[90px] transition-all ${
        isActive
          ? "bg-gradient-to-br from-blue-200 text-white border-blue-700 shadow-lg scale-105"
          : "bg-white text-gray-800 border-gray-300 hover:shadow-md"
      }`}
    >
      <div className="text-black text-2xl">
        <Icon />
      </div>
      <span className="text-sm font-medium text-gray-800 text-center">
        {name === 'Text' ? 'Heading' : name}
      </span>
    </div>
  );
};

export default Widget;

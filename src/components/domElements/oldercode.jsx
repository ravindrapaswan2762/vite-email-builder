// index wise drop area indicater implemented in it.


import React, { useState, useRef, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import {
  setDroppedItems,
  deleteDroppedItemById,
  addElementWithSection2,
} from "../redux/cardDragableSlice";

const WrapperAttribute = () => {
  const { droppedItems } = useSelector((state) => state.cardDragable);
  const dispatch = useDispatch();

  // 🔹 Track drop index & position
  const [dropIndex, setDropIndex] = useState(null);
  const [dropPosition, setDropPosition] = useState("above"); // 🟢 "above" or "below"

  const wrapperRef = useRef();

  // 🔵 **Handle Drag Over & Adjust Drop Position Based on Cursor**
  const handleDragOver = (e, targetId, index) => {
    e.preventDefault();
    e.stopPropagation();

    const targetElement = document.getElementById(`widget-${targetId}`);
    if (targetElement) {
      const { top, height } = targetElement.getBoundingClientRect();
      const cursorY = e.clientY;

      // 🔵 **Define Edge Threshold (5%)**
      const edgeThreshold = height * 0.05;

      if (cursorY < top + edgeThreshold) {
        // Cursor is in the top 5%
        if (dropIndex !== index || dropPosition !== "above") {
          setDropPosition("above");
          setDropIndex(index);
        }
      } else if (cursorY > top + height - edgeThreshold) {
        // Cursor is in the bottom 5%
        if (dropIndex !== index || dropPosition !== "below") {
          setDropPosition("below");
          setDropIndex(index);
        }
      } else {
        // Hide the indicator if not within 5% range
        if (dropIndex === index) {
          setDropIndex(null);
        }
      }
    }
  };

  // 🟢 **Handle Drop**
  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();

    if (!dropIndex && dropIndex !== 0) return; // Prevent invalid drops

    const droppedData = JSON.parse(e.dataTransfer.getData("text/plain"));
    console.log("Dropped Data: ", droppedData);

    let finalDropIndex = dropIndex !== null ? dropIndex : droppedItems.length;
    if (dropPosition === "below") {
      finalDropIndex += 1;
    }

    // ✅ Dispatch action to insert at the correct index
    dispatch(
      addElementWithSection2({
        id: Date.now(),
        name: "widgetSection",
        columnCount: 1,
        parentId: null,
        styles: {},
        dropIndex: finalDropIndex, // ✅ Insert at correct index
        childId: Date.now() + Math.floor(Math.random() * 1000),
        childName: droppedData.name,
        childType: droppedData.type,
        childStyle: droppedData.styles,
        childContent: droppedData.content,
      })
    );

    setDropIndex(null);
  };

  // 🔴 **Handle Drag Leave to Hide Drop Indicator**
  const handleDragLeave = (e) => {
    e.preventDefault();
    if (!e.relatedTarget || !e.relatedTarget.classList.contains("drop-zone")) {
      setDropIndex(null);
    }
  };

  // 🎨 **Render Widgets with Drop Zones**
  const renderWidget = (item, index) => {
    return (
      <React.Fragment key={item.id}>
        {/* 🟠 Drop Zone Above the Element */}
        {dropIndex === index && dropPosition === "above" && (
          <div
            className="drop-zone border-2 border-dashed border-blue-500 bg-blue-100 h-10 rounded-md flex justify-center items-center text-blue-500 font-semibold transition-all pointer-events-auto"
            onDragOver={(e) => handleDragOver(e, item.id, index)}
            onDrop={handleDrop}
          >
            Drop Here
          </div>
        )}

        {/* 🔥 Render the Dropped Element */}
        <div
          id={`widget-${item.id}`}
          className="relative group rounded bg-transparent"
          onDragOver={(e) => handleDragOver(e, item.id, index)}
        >
          {item.name}
        </div>

        {/* 🔵 Drop Zone Below the Element */}
        {dropIndex === index && dropPosition === "below" && (
          <div
            className="drop-zone border-2 border-dashed border-blue-500 bg-blue-100 h-10 rounded-md flex justify-center items-center text-blue-500 font-semibold transition-all pointer-events-auto"
            onDragOver={(e) => handleDragOver(e, item.id, index)}
            onDrop={handleDrop}
          >
            Drop Here
          </div>
        )}
      </React.Fragment>
    );
  };

  return (
    <div
      className="w-[600px] min-h-[250px] border-2 rounded-lg bg-gray-100 p-1 mb-[300px] absolute hover:border-blue-500 transition-all h-auto"
      onDrop={handleDrop}
      onDragOver={(e) => e.preventDefault()}
      onDragLeave={handleDragLeave}
      ref={wrapperRef}
    >
      {droppedItems.map((item, index) => renderWidget(item, index))}
    </div>
  );
};

export default WrapperAttribute;

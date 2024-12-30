
import React, { useState } from "react";
import { setActiveWidgetName } from "../../redux/cardDragableSlice";
import { setActiveEditor } from "../../redux/cardToggleSlice";
import { RxCross2 } from "react-icons/rx";
import { deleteDroppedItemById } from "../../redux/cardDragableSlice";
import { setActiveWidgetId } from "../../redux/cardDragableSlice";

import { useDispatch, useSelector } from "react-redux";

const Text = ({id}) => {

  const [val, setVal] = useState("Make it easy for everyone to compose emails!");

  const [hoveredElement, setHoveredElement] = useState(false); // Track hovered element

  const { activeWidgetId, droppedItems } = useSelector((state) => state.cardDragable);

  const dispatch = useDispatch();

  // Find the current element's styles based on the ID
  // const currentStyles = droppedItems.find((item) => item.id === activeWidgetId)?.styles || {};

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
          console.log("findStylesById: ", styles);
          return styles;
        }
      }
    }
    
    return null;
  };

  
  const currentStyles = findStylesById(droppedItems, activeWidgetId) || {};

  const onclickHandle = (e) => {
    e.preventDefault();
    // e.stopPropagation();
    dispatch(setActiveWidgetName("Text"));
    dispatch(setActiveEditor("Text"));
    dispatch(setActiveWidgetId(id));
  };

  const onChangeHandle = (e) => {
    e.stopPropagation();
    setVal(e.target.value);
  };

  const onMouseEnterHandler = () => setHoveredElement(true);
  const onMouseLeaveHandler = () => setHoveredElement(false);

  return (
    <div
      style={{ position: "relative" }}
      className={`group ${hoveredElement ? "hover:border hover:border-dashed hover:border-blue-500" : ""}`}
      onMouseEnter={onMouseEnterHandler}
      onMouseLeave={onMouseLeaveHandler}
    >
 
      {/* Input Field */}
      <input
        onClick={onclickHandle}
        onChange={onChangeHandle}
        type="text"
        className="border p-2 rounded w-full"
        placeholder="Text Field"
        value={val}
        style={currentStyles} // Apply dynamic styles
      />
    </div>
  );
};

export default Text;

import React, { useState, useEffect, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { RxCross2 } from "react-icons/rx";
import { setActiveEditor } from "../../redux/cardToggleSlice";
import { setActiveWidgetId, setActiveWidgetName } from "../../redux/cardDragableSlice";

const TextArea = ({ id }) => {
  const [val, setVal] = useState("Make it easy for everyone to compose emails Make it easy for everyone to compose emails!");
  const [hoveredElement, setHoveredElement] = useState(false); // Hover state
  const [isFocused, setIsFocused] = useState(false); // Focus state
  const inputRef = useRef(null); // Ref for detecting clicks outside

  const { activeWidgetId, droppedItems } = useSelector((state) => state.cardDragable);
  const dispatch = useDispatch();

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

  const handleInputChange = (e) => {
    setVal(e.target.value);
  };

  const onclickHandle = (e) => {
    // e.stopPropagation();
    e.preventDefault();
    dispatch(setActiveWidgetName("TextArea"));
    dispatch(setActiveEditor("TextArea"));
    dispatch(setActiveWidgetId(id));
    setIsFocused(true); // Set focus state
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

  return (
    <div
      className={`group flex`}
      onMouseEnter={onMouseEnterHandler}
      onMouseLeave={onMouseLeaveHandler}
      ref={inputRef} // Add the ref to the parent div to detect clicks outside
    >
      {/* Text Area */}
      <textarea
        onChange={handleInputChange}
        onClick={onclickHandle}
        className={`border p-2 w-full rounded focus:outline-none transition-all duration-300 
          ${isFocused ? "border-gray-300 bg-white" : "border-none bg-transparent"} 
          ${hoveredElement ? "hover:border hover:border-dashed hover:border-blue-500" : ""}`}
        placeholder="Text Area"
        value={val}
        style={{
          ...currentStyles,
          overflow: "hidden",
          resize: "none",
          whiteSpace: "pre-wrap", // Prevent text from overflowing
        }} // Apply dynamic styles
      />
    </div>
  );
};

export default TextArea;

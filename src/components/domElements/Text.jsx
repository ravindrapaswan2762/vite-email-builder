import React, { useState, useEffect, useRef } from "react";
import { setActiveWidgetName } from "../../redux/cardDragableSlice";
import { setActiveEditor } from "../../redux/cardToggleSlice";
import { setActiveWidgetId } from "../../redux/cardDragableSlice";

import { useDispatch, useSelector } from "react-redux";

const Text = ({ id }) => {
  const [val, setVal] = useState("Make it easy for everyone to compose emails!");
  const [hoveredElement, setHoveredElement] = useState(false); // Track hovered element
  const [isFocused, setIsFocused] = useState(false); // Track focus state
  const inputRef = useRef(null); // Ref to handle input element for dynamic resizing

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

  console.log("text currentStyles: ",currentStyles);

  const onClickHandle = (e) => {
    e.preventDefault();
    dispatch(setActiveWidgetName("Text"));
    dispatch(setActiveEditor("Text"));
    dispatch(setActiveWidgetId(id));
    setIsFocused(true); // Set focus state
  };

  const onChangeHandle = (e) => {
    setVal(e.target.value);
  };

  const onMouseEnterHandler = () => setHoveredElement(true);
  const onMouseLeaveHandler = () => setHoveredElement(false);


  const handleClickOutside = (e) => {
    if (inputRef.current && !inputRef.current.contains(e.target)) {
      setIsFocused(false); // Remove focus
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
      style={{ position: "relative" }}
      className={`group ${hoveredElement ? "hover:border hover:border-dashed hover:border-blue-500" : ""}`}
      onMouseEnter={onMouseEnterHandler}
      onMouseLeave={onMouseLeaveHandler}
    >
      {/* Input Field */}
      <input
        ref={inputRef}
        onClick={onClickHandle}
        onChange={onChangeHandle}
        type="text"
        className={`p-2 w-full transition-all duration-300 ${
          isFocused ? "border rounded bg-white border-gray-300" : "border-none bg-transparent"
        }`}
        placeholder="Text Field"
        value={val}
        style={{
          ...currentStyles,
          overflow: "hidden",
          resize: "none",
          whiteSpace: "pre-wrap",

        }} // Apply dynamic styles
      />
    </div>
  );
};

export default Text;

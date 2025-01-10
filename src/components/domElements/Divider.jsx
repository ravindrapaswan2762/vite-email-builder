import React, { useState, useEffect, useRef } from "react";
import { setActiveWidgetName } from "../../redux/cardDragableSlice";
import { setActiveEditor } from "../../redux/cardToggleSlice";
import { setActiveWidgetId } from "../../redux/cardDragableSlice";
import { useDispatch, useSelector } from "react-redux";
import {setActiveBorders} from '../../redux/activeBorderSlice'

const Divider = ({ id }) => {
  const [hoveredElement, setHoveredElement] = useState(false); // Track hovered element
  const [isFocused, setIsFocused] = useState(false); // Track focus state
  const dividerRef = useRef(null); // Ref to handle divider element

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

  const onClickHandle = (e) => {
    e.preventDefault();
    dispatch(setActiveWidgetName("Divider"));
    dispatch(setActiveEditor("Divider"));
    dispatch(setActiveWidgetId(id));
    setIsFocused(true); // Set focus state

    dispatch(setActiveBorders(true));
  };

  const onMouseEnterHandler = () => setHoveredElement(true);
  const onMouseLeaveHandler = () => setHoveredElement(false);

  const handleClickOutside = (e) => {
    if (dividerRef.current && !dividerRef.current.contains(e.target)) {
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
      onClick={onClickHandle}
    >
      {/* Divider Element */}
      <hr
        ref={dividerRef}
        style={{
          ...currentStyles,
        }}
        className="w-full"
      />
    </div>
  );
};

export default Divider;

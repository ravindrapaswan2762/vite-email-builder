import React, { useState, useEffect, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { setActiveWidgetName, setActiveWidgetId } from "../../redux/cardDragableSlice";
import { setActiveEditor } from "../../redux/cardToggleSlice";

// Icons (Replace these with your actual logo images or imports)
import { FaFacebook, FaGoogle, FaTwitter } from "react-icons/fa"; // Example using FontAwesome icons

const SocialMedia = ({ id }) => {
  const [hoveredElement, setHoveredElement] = useState(false); // Track hover state
  const [isFocused, setIsFocused] = useState(false); // Track focus state
  const containerRef = useRef(null); // Ref for detecting outside clicks

  const { activeWidgetId, droppedItems } = useSelector((state) => state.cardDragable);
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
    e.preventDefault();
    dispatch(setActiveWidgetName("SocialMedia"));
    dispatch(setActiveEditor("SocialMedia"));
    dispatch(setActiveWidgetId(id));
    setIsFocused(true); // Set focus state
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

  return (
    <div
      ref={containerRef}
      className={`flex items-center justify-center gap-4 p-3 rounded ${
        isFocused
          ? "border-2 border-blue-500 bg-gray-100"
          : hoveredElement
          ? "border-dashed border-2 border-blue-500"
          : "border-transparent"
      }`}
      style={currentStyles}
      onMouseEnter={onMouseEnterHandler}
      onMouseLeave={onMouseLeaveHandler}
      onClick={onClickHandle}
    >
      <div className="flex items-center gap-2 cursor-pointer">
        <FaFacebook className="text-xl text-blue-600" />
        <span className="text-sm">Facebook</span>
      </div>
      <div className="flex items-center gap-2 cursor-pointer">
        <FaGoogle className="text-xl text-red-600" />
        <span className="text-sm">Google</span>
      </div>
      <div className="flex items-center gap-2 cursor-pointer">
        <FaTwitter className="text-xl text-blue-400" />
        <span className="text-sm">Twitter</span>
      </div>
    </div>
  );
};

export default SocialMedia;

import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { RxCross2 } from "react-icons/rx";
import { deleteDroppedItemById, setActiveWidgetName, setActiveWidgetId } from "../../redux/cardDragableSlice";
import { setActiveEditor } from "../../redux/cardToggleSlice";

const Button = ({ id }) => {
  const [hoveredElement, setHoveredElement] = useState(false); // Track hover state
  const { activeWidgetId, droppedItems } = useSelector((state) => state.cardDragable);
  const dispatch = useDispatch();

  // const currentStyles = droppedItems.find((item) => item.id === id)?.styles || {};
  // console.log("currentStyles: ", currentStyles);

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
    e.stopPropagation();
    dispatch(setActiveWidgetName("Button"));
    dispatch(setActiveEditor("Button"));
    dispatch(setActiveWidgetId(id));
    console.log("droppedItems: ", droppedItems);
  };

  const onMouseEnterHandler = () => setHoveredElement(true);
  const onMouseLeaveHandler = () => setHoveredElement(false);

  return (
    <div
      className="flex justify-center w-full"
      style={{ backgroundColor: `${currentStyles.backgroundColor || "transparent"}` }}
      onMouseEnter={onMouseEnterHandler}
      onMouseLeave={onMouseLeaveHandler}
    >
      {/* Outer Container with Dashed Border */}
      <div
        className={`relative w-full h-[50px] border ${
          hoveredElement ? "border-dashed border-blue-500" : "border-gray-300"
        } flex items-center p-1`}
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: `${currentStyles.textAlign || "center"}`,
          height: "auto",
        }}
      >
        {/* Button Content */}
        <button
          onClick={onclickHandle}
          style={{ ...currentStyles, backgroundColor: `${currentStyles.buttonColor || "#1d4ed8"}` }}
          className="relative bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600 transition duration-200 text-center"
        >
          {currentStyles.content || "Submit"}
        </button>

      </div>
    </div>
  );
};

export default Button;

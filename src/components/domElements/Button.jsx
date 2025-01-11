import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { RxCross2 } from "react-icons/rx";
import { deleteDroppedItemById, setActiveWidgetName, setActiveWidgetId } from "../../redux/cardDragableSlice";
import { setActiveEditor } from "../../redux/cardToggleSlice";
import {setActiveBorders} from '../../redux/activeBorderSlice'
import { setActiveNodeList } from "../../redux/treeViewSlice";
import { useRef } from "react";

const Button = ({ id }) => {
  const [hoveredElement, setHoveredElement] = useState(false); // Track hover state
  const { activeWidgetId, droppedItems } = useSelector((state) => state.cardDragable);
  const {activeNodeList} = useSelector((state) => state.treeViewSlice);
  const dispatch = useDispatch();

  const inputRef = useRef(null);


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

  const onclickHandle = (e) => {
    // e.stopPropagation();
    e.preventDefault();
    dispatch(setActiveWidgetName("Button"));
    dispatch(setActiveEditor("Button"));
    dispatch(setActiveWidgetId(id));

    dispatch(setActiveBorders(true));
    console.log("droppedItems: ", droppedItems);
  };

  const onMouseEnterHandler = () => setHoveredElement(true);
  const onMouseLeaveHandler = () => setHoveredElement(false);

  // ************************************************************************ 
    const onClickOutside = () => {
      dispatch(setActiveNodeList(false));
    };
    useEffect(() => {
      const handleClickOutside = (event) => {
        // Check if the click is outside the input field
        if (inputRef.current && !inputRef.current.contains(event.target)) {
          onClickOutside(); // Call the function when clicking outside
        }
      };
  
      document.addEventListener("mousedown", handleClickOutside);
      return () => {
        document.removeEventListener("mousedown", handleClickOutside);
      };
    }, [inputRef]); // Add inputRef to the dependency array
    // *****************************************************************************

  return (
    <div
      className={`flex justify-center w-full ${(activeWidgetId==id && activeNodeList) ? "border-2 border-blue-500" : ""}`}
      style={{ backgroundColor: `${currentStyles.backgroundColor || "transparent"}` }}
      onMouseEnter={onMouseEnterHandler}
      onMouseLeave={onMouseLeaveHandler}
      onClick={()=>dispatch(setActiveBorders(true))}
    >
      {/* Outer Container with Dashed Border */}
      <div
        className={`relative w-full h-[50px] border-none bg-transparent ${
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
        ref={inputRef}
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

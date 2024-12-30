import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { RxCross2 } from "react-icons/rx";
import { deleteDroppedItemById, setActiveWidgetName, setActiveWidgetId } from "../../redux/cardDragableSlice";
import { setActiveEditor } from "../../redux/cardToggleSlice";

const Button = ({ id }) => {
  const [hoveredElement, setHoveredElement] = useState(false); // Track hover state
  const { droppedItems } = useSelector((state) => state.cardDragable);
  const dispatch = useDispatch();

  // Get the current styles for this button
  const currentStyles = droppedItems.find((item) => item.id === id)?.styles || {};

  const onclickHandle = (e) => {
    e.stopPropagation();
    dispatch(setActiveWidgetName("Button"));
    dispatch(setActiveEditor("Button"));
    dispatch(setActiveWidgetId(id));
    console.log("Button clicked, updated state: ", droppedItems);
  };

  const onMouseEnterHandler = () => setHoveredElement(true);
  const onMouseLeaveHandler = () => setHoveredElement(false);

  return (
    <div
      style={{
        position: "relative",
        backgroundColor: currentStyles.backgroundColor || "transparent",
      }}
      className={`group ${hoveredElement ? "hover:border hover:border-dashed hover:border-blue-500" : ""}`}
      onMouseEnter={onMouseEnterHandler}
      onMouseLeave={onMouseLeaveHandler}
    >
      {/* Delete Button */}
      {hoveredElement && (
        <button
          onClick={() => dispatch(deleteDroppedItemById({ parentId: id }))}
          className="absolute right-2 top-2 text-black rounded-full hover:cursor-pointer"
        >
          <RxCross2 size={14} />
        </button>
      )}

      {/* Button Content */}
      <div
        className="flex items-center justify-center w-full h-[50px] p-2 border rounded"
        style={{
          textAlign: currentStyles.textAlign || "center",
          color: currentStyles.color || "black",
        }}
        onClick={onclickHandle}
      >
        {currentStyles.label || "Button"}
      </div>
    </div>
  );
};

export default Button;

import React, { useEffect } from "react";
import { RxCross2 } from "react-icons/rx";
import Text from "./Text";
import Image from "./Image";
import Button from "./Button";
import TextArea from "./TextArea";

import { useDispatch, useSelector } from "react-redux";
import { setDroppedItems, deleteDroppedItemById } from "../../redux/cardDragableSlice";

// Component Mapping
const componentMap = {
  Text: () => <Text />,
  Image: () => <Image />,
  Button: () => <Button />,
  TextArea: () => <TextArea />,
};

const ColumnOne = ({ handleDelete, id }) => {
  const { activeWidgetName, droppedItems } = useSelector((state) => state.cardDragable);
  const dispatch = useDispatch();

  const parent = droppedItems.find((item) => item.id === id);
  const children = parent?.children || [];

  // Handle Drop
  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();

    console.log("parentId: ", id);

    if (!activeWidgetName) return;

    dispatch(
      setDroppedItems({
        id: Date.now(), // Unique ID
        name: activeWidgetName,
        type: "widget", // Only widgets can be added here
        parentId: id, // Associate with this column
        styles: {},
      })
    );
    console.log("Dropped Element:", activeWidgetName);
  };

  const handleDragOver = (e) => {
    e.preventDefault();
  };

  const handleClick = (e) => {
    e.stopPropagation();
    console.log("ColumnOne clicked!");
  };

  const handleDeleteChild = (childId) => {
    dispatch(deleteDroppedItemById(childId)); // Delete child
  };

  const handleDeleteColumn = (e) => {
    e.stopPropagation();
    handleDelete();
    console.log("Column deleted!");
  };

  return (
    <div
      onClick={handleClick}
      onDrop={handleDrop}
      onDragOver={handleDragOver}
      className="border p-1 bg-white rounded-md text-center min-h-[150px] relative"
    >
      {/* Delete Button for the Column */}
      <button
        onClick={() => dispatch(deleteDroppedItemById(id))}
        className="absolute right-2 text-white p-1 rounded-full transition-all duration-200 z-10"
      >
        <div className="text-black mb-2 ml-2">
          <RxCross2 size={18} />
        </div>
      </button>

      <div className="border border-dashed p-1 bg-gray-50 rounded-md text-center hover:bg-gray-200 min-h-[150px]">
        {/* Render Children */}
        {children.length > 0 ? (
          children.map((child) => (
            <div
              key={child.id}
              className="w-full bg-white p-2 border rounded-md mb-2 relative"
            >
              {componentMap[child.name] ? componentMap[child.name]() : <div>Unknown Component</div>}

              {/* Delete Button for Each Child */}
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  handleDeleteChild(child.id);
                }}
                className="absolute right-2 top-2 bg-red-500 text-white p-1 rounded-full transition-all duration-200"
              >
                <RxCross2 size={12} />
              </button>
            </div>
          ))
        ) : (
          <div className="border-dashed rounded-md text-center text-gray-400 font-semibold">
            Drop an element here
          </div>
        )}
      </div>
    </div>
  );
};

export default ColumnOne;

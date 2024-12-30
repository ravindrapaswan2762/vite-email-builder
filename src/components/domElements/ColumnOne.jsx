
import React, { useState } from "react";
import { RxCross2 } from "react-icons/rx";
import Text from "./Text";
import Image from "./Image";
import Button from "./Button";
import TextArea from "./TextArea";
import { useDispatch, useSelector } from "react-redux";
import { setDroppedItems, deleteDroppedItemById, setActiveParentId, setActiveWidgetId } from "../../redux/cardDragableSlice";

// Component Mapping
const componentMap = {
  Text: (props) => <Text {...props} />,
  Image: (props) => <Image {...props} />,
  Button: (props) => <Button {...props} />,
  TextArea: (props) => <TextArea {...props} />,
};

const ColumnOne = ({ handleDelete, id }) => {
  const { activeWidgetName, droppedItems } = useSelector((state) => state.cardDragable);
  const dispatch = useDispatch();

  const [hoveredColumn, setHoveredColumn] = useState(false); // Track hover state for the column
  const [hoveredChild, setHoveredChild] = useState(null); // Track hover state for children

  const parent = droppedItems.find((item) => item.id === id);
  const children = parent?.children || [];

  // Handle Drop
  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
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

  };

  const handleDragOver = (e) => {
    e.preventDefault();
  };

  const handleDeleteChild = (childId) => {
    dispatch(
      deleteDroppedItemById({
        parentId: id,
        childId: childId,
      })
    );
  };

 
  const onclickHandler = (id, childId) => {
    console.log("Parent Column clicked, ID:", id);
    dispatch(setActiveParentId(id));
    dispatch(setActiveWidgetId(childId));

  };

  return (
    <div
      onDrop={handleDrop}
      onDragOver={handleDragOver}
      onMouseEnter={() => setHoveredColumn(true)}
      onMouseLeave={() => setHoveredColumn(false)}
      className="border rounded-md text-center min-h-[150px] relative group"
    >
      <div className="border border-dashed bg-gray-50 rounded-md text-center hover:border-blue-500 min-h-[150px]">
        {/* Render Children */}
        {children.length > 0 ? (
          children.map((child) => (
            <div
              key={child.id}
              onMouseEnter={() => setHoveredChild(child.id)}
              onMouseLeave={() => setHoveredChild(null)}
              onClick={(e) => {
                e.stopPropagation();
                onclickHandler(id, child.id);
              }}
              className="w-full bg-white border rounded-md relative group"
            >
              {componentMap[child.name] ? componentMap[child.name]({ id: child.id, onParentClick: onclickHandler }) : <div>Unknown Component</div>}

              {/* Delete Button for Each Child */}
              {hoveredChild === child.id && (
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    handleDeleteChild(child.id);
                  }}
                  className="absolute right-2 top-4 bg-red-500 text-white rounded-full hover:bg-red-600 transition-all duration-200"
                >
                  <RxCross2 size={14} />
                </button>
              )}
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


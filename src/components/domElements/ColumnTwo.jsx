import React, { useEffect, useState } from "react";
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

const ColumnTwo = ({ handleDelete, id }) => {
  const { activeWidgetName, droppedItems } = useSelector((state) => state.cardDragable);
  const dispatch = useDispatch();

  const [childrenA, setChildrenA] = useState([]);
  const [childrenB, setChildrenB] = useState([]);

  useEffect(() => {
    // Fetch column data from Redux store
    const parent = droppedItems.find((item) => item.id === id);

    if (parent) {
      setChildrenA(parent.childrenA || []);
      setChildrenB(parent.childrenB || []);
    } else {
      setChildrenA([]);
      setChildrenB([]);
    }
  }, [droppedItems, id]);

  const handleDrop = (column) => (e) => {
    e.preventDefault();
    e.stopPropagation();
    console.log("column: ", column);

    if (!activeWidgetName) return;

    dispatch(
      setDroppedItems({
        id: Date.now(), // Unique ID for the dropped child
        name: activeWidgetName,
        type: "widget",
        parentId: id, // Parent ID to identify the column
        columnName: column, // Specify the column (childrenA or childrenB)
        styles: {}, // Additional styles if needed
      })
    );
  };

  const handleDragOver = (e) => {
    e.preventDefault();
  };

  const handleDeleteChild = (column, childId) => {
    dispatch(
      setDroppedItems({
        parentId: id,
        column,
        deleteChildId: childId, // Pass the ID of the child to be deleted
      })
    );
  };

  return (
    <div className="relative grid grid-cols-2 gap-1 border p-1 rounded-md bg-white shadow-md hover:shadow-lg transition-all duration-300">
      {/* Delete Button for Parent Column */}
      <button
        onClick={handleDelete}
        className="absolute top-2 right-2 text-white p-1 rounded-full transition-all duration-200 z-10"
      >
        <div className="text-black mb-2 ml-2">
          <RxCross2 size={18} />
        </div>
      </button>

      {/* Column A */}
      <div
        onDrop={handleDrop("columnA")}
        onDragOver={handleDragOver}
        className="border border-dashed p-4 bg-gray-50 rounded-md text-center hover:bg-gray-200 min-h-[150px]"
      >
        <p className="text-gray-500 font-medium mb-2">Column A</p>
        {childrenA.map((child) => (
          <div
            key={child.id}
            className="w-full bg-white p-2 border rounded-md mb-2 relative"
          >
            {componentMap[child.name] ? componentMap[child.name]() : <div>Unknown Component</div>}
            {/* Delete Button for Child */}
            <button
              onClick={(e) => {
                e.stopPropagation();
                handleDeleteChild("childrenA", child.id);
              }}
              className="absolute top-1 right-1 bg-red-500 text-white p-1 rounded-full hover:bg-red-600 transition-all duration-200"
            >
              <RxCross2 size={18} />
            </button>
          </div>
        ))}
        {childrenA.length === 0 && <p className="text-gray-400">Drop elements here</p>}
      </div>

      {/* Column B */}
      <div
        onDrop={handleDrop("columnB")}
        onDragOver={handleDragOver}
        className="border border-dashed p-4 bg-gray-50 rounded-md text-center hover:bg-gray-200 min-h-[150px]"
      >
        <p className="text-gray-500 font-medium mb-2">Column B</p>
        {childrenB.map((child) => (
          <div
            key={child.id}
            className="w-full bg-white p-2 border rounded-md mb-2 relative"
          >
            {componentMap[child.name] ? componentMap[child.name]() : <div>Unknown Component</div>}
            {/* Delete Button for Child */}
            <button
              onClick={(e) => {
                e.stopPropagation();
                handleDeleteChild("childrenB", child.id);
              }}
              className="absolute top-1 right-1 bg-red-500 text-white p-1 rounded-full hover:bg-red-600 transition-all duration-200"
            >
              <RxCross2 size={18} />
            </button>
          </div>
        ))}
        {childrenB.length === 0 && <p className="text-gray-400">Drop elements here</p>}
      </div>
    </div>
  );
};

export default ColumnTwo;


import React, { useEffect, useState } from "react";
import { RxCross2 } from "react-icons/rx";
import Text from "./Text";
import Image from "./Image";
import Button from "./Button";
import TextArea from "./TextArea";
import Divider from "./Divider";
import SocialMedia from "./SocialMedia";
import Space from "./Space";

import { useDispatch, useSelector } from "react-redux";
import { setDroppedItems, setActiveWidgetId, deleteDroppedItemById, setActiveParentId, setActiveColumn} from "../../redux/cardDragableSlice";

// Component Mapping
const componentMap = {
  Text: (props) => <Text {...props} />,
  Image: (props) => <Image {...props} />,
  Button: (props) => <Button {...props} />,
  TextArea: (props) => <TextArea {...props} />,
  Divider: (props) => <Divider {...props} />,
  SocialMedia: (props) => <SocialMedia {...props} />,
  Space: (props) => <Space {...props} />,
};

const ColumnTwo = ({ handleDelete, id }) => {
  const { activeWidgetName, droppedItems } = useSelector((state) => state.cardDragable);
  const dispatch = useDispatch();

  const [childrenA, setChildrenA] = useState([]);
  const [childrenB, setChildrenB] = useState([]);
  const [hoveredChildA, setHoveredChildA] = useState(null); // Track hovered child in Column A
  const [hoveredChildB, setHoveredChildB] = useState(null); // Track hovered child in Column B

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
    console.log(`parentId: ${id}, childId: ${childId}, columnName: ${column} from handleDeleteChild ColumnTwo`);
    dispatch(
      deleteDroppedItemById({
        parentId: id,
        columnName: column,
        childId: childId, // Pass the ID of the child to be deleted
      })
    );
  };

  const onclickHandler = (id, childId, column) => {
    console.log("Parent Column clicked, ID:", id);
    dispatch(setActiveParentId(id));
    dispatch(setActiveWidgetId(childId));
    dispatch(setActiveColumn(column));
  };

  return (
    <div className="relative grid grid-cols-2 gap-1 border rounded-md shadow-md hover:shadow-lg transition-all duration-300 group">
      {/* Column A */}
      <div
        onDrop={handleDrop("columnA")}
        onDragOver={handleDragOver}
        className="border border-dashed p-1 bg-gray-50 rounded-md text-center hover:border-blue-500 min-h-[150px]"
      >
        {childrenA.map((child) => (
          <div
            key={child.id}
            className="w-full bg-white border rounded-md mb-1 relative"
            onMouseEnter={() => setHoveredChildA(child.id)} 
            onMouseLeave={() => setHoveredChildA(null)}   
            onClick={(e) => {
              e.stopPropagation();
              onclickHandler(id, child.id, "childrenA");
            }}
          >
            {componentMap[child.name] ? componentMap[child.name]({ id: child.id }) : <div>Unknown Component</div>}
       
            {hoveredChildA === child.id && (
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  handleDeleteChild("childrenA", child.id);
                }}
                className="absolute top-3 right-1 bg-red-500 text-white rounded-full hover:bg-red-600 transition-all duration-200"
              >
                <RxCross2 size={14} />
              </button>
            )}
          </div>
        ))}

        
        {childrenA.length === 0 && (
          <>
            <p className="text-gray-400">Column A</p>
            <p className="text-gray-400">Drop elements here</p>
          </>
        )}
      </div>

      {/* Column B */}
      <div
        onDrop={handleDrop("columnB")}
        onDragOver={handleDragOver}
        className="border border-dashed p-1 bg-gray-50 rounded-md text-center hover:border-blue-500 min-h-[150px]"
      >
        {childrenB.map((child) => (
          <div
            key={child.id}
            className="w-full bg-white border rounded-md mb-1 relative"
            onMouseEnter={() => setHoveredChildB(child.id)}  // Set hover state for the child
            onMouseLeave={() => setHoveredChildB(null)}    // Reset hover state when mouse leaves
            onClick={(e) => {
              e.stopPropagation();
              onclickHandler(id, child.id, "childrenB");
            }}
          >
            {componentMap[child.name] ? componentMap[child.name]({ id: child.id }) : <div>Unknown Component</div>}
            {/* Delete Button for Child in Column B */}
            {hoveredChildB === child.id && (
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  handleDeleteChild("childrenB", child.id);
                }}
                className="absolute top-3 right-1 bg-red-500 text-white rounded-full hover:bg-red-600 transition-all duration-200"
              >
                <RxCross2 size={14} />
              </button>
            )}
          </div>
        ))}
        {childrenB.length === 0 && (
          <>
            <p className="text-gray-400">Column B</p>
            <p className="text-gray-400">Drop elements here</p>
          </>
        )}
      </div>
    </div>
  );
};

export default ColumnTwo;

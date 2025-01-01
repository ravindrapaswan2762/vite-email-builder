
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
import { setDroppedItems, deleteDroppedItemById, setActiveParentId, setActiveWidgetId, setActiveColumn} from "../../redux/cardDragableSlice";

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

const ColumnThree = ({ handleDelete, id }) => {
  const { activeWidgetName, droppedItems } = useSelector((state) => state.cardDragable);
  const dispatch = useDispatch();

  const [childrenA, setChildrenA] = useState([]);
  const [childrenB, setChildrenB] = useState([]);
  const [childrenC, setChildrenC] = useState([]);

  const [hoveredChildA, setHoveredChildA] = useState(null);
  const [hoveredChildB, setHoveredChildB] = useState(null);
  const [hoveredChildC, setHoveredChildC] = useState(null); 
  

  useEffect(() => {
    // Fetch column data from Redux store
    const parent = droppedItems.find((item) => item.id === id);

    if (parent) {
      setChildrenA(parent.childrenA || []);
      setChildrenB(parent.childrenB || []);
      setChildrenC(parent.childrenC || []);
    } else {
      setChildrenA([]);
      setChildrenB([]);
      setChildrenC([]);
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
        columnName: column, // Specify the column (childrenA, childrenB, or childrenC)
        styles: {}, // Additional styles if needed
      })
    );
  };

  const handleDragOver = (e) => {
    e.preventDefault();
  };

  const handleDeleteChild = (column, childId) => {
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
    <div className="relative grid grid-cols-3 gap-1 border rounded-md shadow-md hover:shadow-lg transition-all duration-300">
      
      {/* Column A */}
      <div
        onDrop={handleDrop("columnA")}
        onDragOver={handleDragOver}
        className="border border-dashed p-1 bg-gray-50 rounded-md text-center hover:border-blue-500"
      >
        {childrenA.map((child) => (
          <div
            key={child.id}
            className="w-full bg-white border rounded-md mb-2 relative"
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
                <RxCross2 size={12} />
              </button>
            )}
            
          </div>
        ))}
        {childrenA.length === 0 && 
          <>
            <p className="text-gray-400">Column A</p>
            <p className="text-gray-400">Drop elements here</p>
          </>}
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
            className="w-full bg-whiteborder rounded-md mb-2 relative"
            onMouseEnter={() => setHoveredChildB(child.id)} 
            onMouseLeave={() => setHoveredChildB(null)}   
            onClick={(e) => {
              e.stopPropagation();
              onclickHandler(id, child.id, "childrenB");
            }}
          >
            {componentMap[child.name] ? componentMap[child.name]({ id: child.id }) : <div>Unknown Component</div>}

            {/* Delete Button for Child */}
            {hoveredChildB === child.id && (
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  handleDeleteChild("childrenB", child.id);
                }}
                className="absolute top-3 right-1 bg-red-500 text-white rounded-full hover:bg-red-600 transition-all duration-200"
              >
                <RxCross2 size={12} />
              </button>
            )}
            
          </div>
        ))}
        {childrenB.length === 0 && <>
            <p className="text-gray-400">Column B</p>
            <p className="text-gray-400">Drop elements here</p>
          </>}
      </div>

      {/* Column C */}
      <div
        onDrop={handleDrop("columnC")}
        onDragOver={handleDragOver}
        className="border border-dashed p-1 bg-gray-50 rounded-md text-center hover:border-blue-500 min-h-[150px]"
      >
      
        {childrenC.map((child) => (
          <div
            key={child.id}
            className="w-full bg-white border rounded-md mb-2 relative"
            onMouseEnter={() => setHoveredChildC(child.id)} 
            onMouseLeave={() => setHoveredChildC(null)}   
            onClick={(e) => {
              e.stopPropagation();
              onclickHandler(id, child.id, "childrenC");
            }}
          >
            {componentMap[child.name] ? componentMap[child.name]({ id: child.id }) : <div>Unknown Component</div>}

            {/* Delete Button for Child */}
            {hoveredChildC === child.id && (
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  handleDeleteChild("childrenC", child.id);
                }}
                className="absolute top-3 right-1 bg-red-500 text-white rounded-full hover:bg-red-600 transition-all duration-200"
              >
                <RxCross2 size={12} />
              </button>
            )}
            
            
          </div>
        ))}
        {childrenC.length === 0 && <>
            <p className="text-gray-400">Column B</p>
            <p className="text-gray-400">Drop elements here</p>
          </>}
      </div>
    </div>
  );
};

export default ColumnThree;


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
import { setActiveEditor } from "../../redux/cardToggleSlice";
import {  setDroppedItems, 
          setActiveWidgetName, 
          setActiveWidgetId, 
          deleteDroppedItemById, 
          setActiveParentId, 
          setActiveColumn,
        } from "../../redux/cardDragableSlice";

import { setActiveBorders } from "../../redux/activeBorderSlice";

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
  const { activeWidgetId, activeWidgetName, droppedItems } = useSelector((state) => state.cardDragable);
  const { activeBorders } = useSelector((state) => state.borderSlice);
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

    setIsDragging(false);
    setColumn(null);

    if (!activeWidgetName) return;

    dispatch(
      setDroppedItems({
        id: Date.now(), // Unique ID for the dropped child
        name: activeWidgetName,
        type: "widget",
        parentId: id, // Parent ID to identify the column
        columnName: column, // Specify the column (childrenA or childrenB)
        content: null,
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

  const styleWithBackground = {
    ...currentStyles,
    // If backgroundImage is just a URL, wrap it in `url("...")`
    backgroundImage: currentStyles.backgroundImage
      ? `url("${currentStyles.backgroundImage}")`
      : undefined,
    // If you want the user to set `borderType`, map it to `border`
    ...(currentStyles.borderType && { border: currentStyles.borderType }),
  };



  // ***************************************** write extra logic for hilight drop area while dragEnter
      const [isDragging, setIsDragging] = useState(false); // NEW: Track if an element is being dragged into the column
      const [column, setColumn] = useState(null);
      const handleDragEnter = (column) => {
        console.log("handleDragEnter called", column);
        if (!isDragging || !column) {
          setIsDragging(true);
          setColumn(column);
        }
        
        dispatch(dispatch(setActiveBorders(true)));
      };
      
      const handleDragLeave = () => {
        console.log("handleDragLeave called");
        setIsDragging(false);
        setColumn(null);
      };
  
    
    // *****************************************

  return (
    <div className="relative grid grid-cols-2 gap-1 transition-all duration-300 group bg-transparent"

        onClick={(e) => {
          e.stopPropagation();
          dispatch(setActiveWidgetId(id));
          dispatch(setActiveWidgetName("2-column"));
          dispatch(setActiveEditor("sectionEditor"));
          dispatch(setActiveBorders(true));
        }}
        style={{
          ...styleWithBackground, border: currentStyles.borderType, backgroundRepeat: "no-repeat", 
          backgroundPosition: "center", backgroundSize: "cover", borderRadius: currentStyles.borderRadius,
        }}
    >
      {/* Column A */}
      <div
        onDrop={handleDrop("columnA")}
        onDragOver={handleDragOver}
        onDragEnter={()=>handleDragEnter("columnA")} 
        onDragLeave={handleDragLeave}

        className={`p-1 rounded-md text-center min-h-[150px] hover:border-2 hover:border-dashed hover:border-blue-400
                    ${activeBorders ? 'border-2 border-dashed border-blue-200' : 'bg-transparent'}
                    ${ (isDragging && column==="columnA") ? "bg-blue-100 border-blue-400" : "bg-transparent"}
                  `}
      >
        {childrenA.map((child) => (
          <div
            key={child.id}
            className="w-full mb-1 relative"
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
        onDragEnter={()=>handleDragEnter("columnB")} 
        onDragLeave={handleDragLeave}

        className={`p-1 rounded-md text-center min-h-[150px] hover:border-2 hover:border-dashed hover:border-blue-400
                    ${activeBorders ? 'border-2 border-dashed border-blue-200' : 'bg-transparent'}
                    ${(isDragging && column==="columnB") ? "bg-blue-100 border-blue-400" : "bg-transparent"}
                  `}
      >
        {childrenB.map((child) => (
          <div
            key={child.id}
            className="w-full mb-1 relative"
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

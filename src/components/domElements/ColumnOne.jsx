
import React, { useState } from "react";
import { RxCross2 } from "react-icons/rx";
import Text from "./Text";
import Image from "./Image";
import Button from "./Button";
import TextArea from "./TextArea";
import Divider from "./Divider";
import SocialMedia from "./SocialMedia";
import Space from "./Space";

import { setActiveWidgetName, setActiveColumn} from "../../redux/cardDragableSlice";
import { setActiveEditor } from "../../redux/cardToggleSlice";

import { useDispatch, useSelector } from "react-redux";
import { setDroppedItems, deleteDroppedItemById, setActiveParentId, setActiveWidgetId } from "../../redux/cardDragableSlice";
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

const ColumnOne = ({ handleDelete, id }) => {
  const { activeWidgetId, activeWidgetName, droppedItems } = useSelector((state) => state.cardDragable);
  const { activeBorders } = useSelector((state) => state.borderSlice);

  console.log()
  
  const dispatch = useDispatch();

  const [hoveredColumn, setHoveredColumn] = useState(false); // Track hover state for the column
  const [hoveredChild, setHoveredChild] = useState(null); // Track hover state for children


  const parent = droppedItems.find((item) => item.id === id);
  const children = parent?.children || [];

  // Handle Drop
  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
    console.log("handleDrop called");
    if (!activeWidgetName) return;
    dispatch(
      setDroppedItems({
        id: Date.now(), // Unique ID
        name: activeWidgetName,
        type: "widget", // Only widgets can be added here
        parentId: id, // Associate with this column
        content: null,
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
    dispatch(setActiveColumn(""));


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

  const handleDragEnter = () => {
    console.log("handleDragEnter called");
    setIsDragging(true); // NEW: Trigger only once when the element enters

    dispatch(dispatch(setActiveBorders(true)));
  };
  
  const handleDragLeave = () => {
    console.log("handleDragLeave called");
    setIsDragging(false); // NEW: Reset when the draggable element leaves
  };
  
  // *****************************************

  return (
    <div
      onDrop={handleDrop}

      onDragOver={handleDragOver}
      onMouseEnter={() => setHoveredColumn(true)}
      onMouseLeave={() => setHoveredColumn(false)}

      onDragEnter={handleDragEnter} 
      onDragLeave={handleDragLeave}
   
      className="text-center min-h-[150px] relative group"
      onClick={(e) => {
        e.stopPropagation();
        dispatch(setActiveWidgetId(id));
        dispatch(setActiveWidgetName("1-column"));
        dispatch(setActiveEditor("sectionEditor"));
        dispatch(setActiveBorders(true));
      }}
      style={{
        ...styleWithBackground, border: currentStyles.borderType, backgroundRepeat: "no-repeat", 
        backgroundPosition: "center", backgroundSize: "cover", borderRadius: currentStyles.borderRadius,
      }}

      // access the background image url from currentStyles and set it, if exist background image url.

      
    >
      <div className={`rounded-md text-center hover:border-2 hover:border-dashed hover:border-blue-400 min-h-[150px] p-1
                      ${activeBorders ? 'border-2 border-dashed border-blue-200' : 'bg-transparent'} 
                      ${isDragging ? "bg-blue-100 border-blue-400" : ""}`}>

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
              className="w-full rounded-md relative group"
            >
              {componentMap[child.name] ? componentMap[child.name]({ id: child.id}) : ""}

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




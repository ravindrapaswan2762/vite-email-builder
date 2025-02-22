
import React, { useState, useEffect } from "react";
import { RxCross2 } from "react-icons/rx";
import { useRef } from "react";
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
import { setDroppedItems, deleteDroppedItemById, setActiveParentId, setActiveWidgetId} from "../../redux/cardDragableSlice";
import { setActiveBorders } from "../../redux/activeBorderSlice";

import { replaceDroppedItem } from "../../redux/cardDragableSlice";

import { setColumnOneExtraPadding } from "../../redux/condtionalCssSlice";
import { setColumnTwoExtraPadding } from "../../redux/condtionalCssSlice";
import { setColumnThreeExtraPadding } from "../../redux/condtionalCssSlice";
import { setWrapperExtraPadding } from "../../redux/condtionalCssSlice";
import { setWidgetOrElement } from "../../redux/cardDragableSlice";
import { setSmallGapInTop } from "../../redux/condtionalCssSlice";
import { PiDotsSixBold } from "react-icons/pi";
import { FiEdit } from "react-icons/fi";
import { setActiveRightClick } from "../../redux/cardDragableSlice";
import { duplicateElementInNormalColumn } from "../../redux/cardDragableSlice";

import { setHoverColumnInCC } from "../../redux/condtionalCssSlice";
import { insertElementAtDropIndex } from "../../redux/cardDragableSlice";
import { setElementDragging } from "../../redux/cardDragableSlice";
import { FiCopy, FiTrash2 } from "react-icons/fi"; // Modern icons




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
  const { activeWidgetId, activeWidgetName, droppedItems, activeParentId, activeColumn, widgetOrElement, elementDragging} = useSelector((state) => state.cardDragable);
  const { activeBorders } = useSelector((state) => state.borderSlice);
  const {columnOneExtraPadding, smallGapInTop} = useSelector((state) => state.coditionalCssSlice);


  const oneColumnRef = useRef(null);
  const columnRef = useRef(null);
  
  const dispatch = useDispatch();

  const [hoveredColumn, setHoveredColumn] = useState(false); // Track hover state for the column
  const [hoveredChild, setHoveredChild] = useState(null); // Track hover state for children
  const [paddingTop, setPaddingTop] = useState(null);
  const [isDragging, setIsDragging] = useState(false); 
  const [popup, setPopup] = useState({ visible: false, x: 0, y: 0, columnKey: null, childId: null });
  const [isLastElementHovered, setIsLastElementHovered] = useState(false);





  const parent = droppedItems.find((item) => item.id === id);
  const children = parent?.children || [];

  const [dropIndex, setDropIndex] = useState(null);
  const [dropPosition, setDropPosition] = useState(null);
  
  const handleDragOver = (e, targetId, index) => {
    e.preventDefault();
  
    const targetElement = document.getElementById(`element-${targetId}`);
    if (targetElement) {
      const { top, height } = targetElement.getBoundingClientRect();
      const cursorY = e.clientY;
      const edgeThreshold = height * 0.2; // Top 20%, bottom 20%
  
      if (cursorY < top + edgeThreshold) {
        setDropIndex(index); // Stay at current index for top
        setDropPosition("above");
        console.log("setDropIndex(index) above: ",index);
      } else if (cursorY > top + height - edgeThreshold) {
        setDropIndex(index + 1); // Move to next index for bottom
        setDropPosition("below");
        console.log("setDropIndex(index) below: ",index+1);
      }
    }
  };
  


  // Handle Drop
  const handleDrop = (e) => {
    // e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
    dispatch(setElementDragging(null));

    const defaultContent =
            activeWidgetName === "Text"
              ? "Design Beautiful Emails."
              : activeWidgetName === "TextArea"
              ? "Craft professional emails effortlessly with our drag-and-drop builder. Perfect for newsletters, promotions, and campaigns."
              : null; // Default to null if no specific content is neededcc

    // Safely parse dropped data
    let droppedData = null;
    try {
      droppedData = JSON.parse(e.dataTransfer.getData("text/plain"));
    } catch (error) {
      console.error("Failed to parse dropped data:", error);
      return;
    }

    console.log("droppedData in columnOne:::: ", droppedData);

    if(!['1-column', '2-columns', '3-columns'].includes(droppedData?.name)){
      if(widgetOrElement === 'element'){
        dispatch(
          insertElementAtDropIndex({
            id: Date.now(),
            name: droppedData.name,
            type: droppedData.type,
            parentId: id,
            column: "children",
            styles: droppedData.styles,
            content: droppedData.content,
            dropIndex: dropIndex,
          })
        );

        dispatch(deleteDroppedItemById(
          {
            parentId: droppedData.parentId ? droppedData.parentId : droppedData.id, 
            childId: droppedData.parentId ?  droppedData.id : null, 
            columnName: droppedData.column ? droppedData.column : null}
        ));
      }
      else{
        dispatch(
          insertElementAtDropIndex({
            id: Date.now(),
            name: droppedData.name,
            type: droppedData.type,
            parentId: id,
            column: "children",
            styles: droppedData.styles,
            content: droppedData.content,
            dropIndex: dropIndex,
          })
        );
        
      }
    }
    else if(['1-column', '2-columns', '3-columns'].includes(droppedData?.name)){
      return;
    }

    dispatch(setWidgetOrElement(null));

    dispatch(setActiveWidgetId(null));
    dispatch(setActiveParentId(null));
    dispatch(setActiveColumn(null));
    
    dispatch(setColumnOneExtraPadding(false));
    dispatch(setColumnTwoExtraPadding(false));
    dispatch(setColumnThreeExtraPadding(false));
    dispatch(setWrapperExtraPadding(false));

    if (onDrop) {
      onDrop(e);
    }

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
    // console.log("Parent Column clicked, ID:", id);
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
  const handleDragEnter = (e, index) => {
    e.stopPropagation();
    console.log("handleDragEnter called in columnOne: ");

    if (!isDragging) {
      setIsDragging(true);
      dispatch(setActiveBorders(true));
    }

  };
  const handleDragLeave = (e, ref) => {
    e.preventDefault();
    console.log("handleDragLeave called in ColumnOne ################################################");
    if (ref.current && !ref.current.contains(e.relatedTarget)) {
      setIsDragging(false);
      setDropIndex(null);
      setDropPosition(null);
    }
  };
  

   // ************************************************************************ 
    const onClickOutside = () => {
      dispatch(setColumnOneExtraPadding(false));
      setPopup({ visible: false, x: 0, y: 0, columnKey: null, childId: null });
    };
    useEffect(() => {
      const handleClickOutside = (event) => {
        if (oneColumnRef.current && !oneColumnRef.current.contains(event.target)) {
          onClickOutside(); // Call the function when clicking outside
        }
      };
  
      document.addEventListener("mousedown", handleClickOutside);
      return () => {
        document.removeEventListener("mousedown", handleClickOutside);
      };
    }, []);
    // ***************************************************************************** element exchange position through ui
    const onDragStart = (e) => {
      // console.log("onDragStart called in Text");
      e.stopPropagation();
      e.dataTransfer.setData(
        "text/plain",
        JSON.stringify({
            id,
            name: "1-column",
            dragableName: "dragableColumn"
        })
      );
      e.dataTransfer.effectAllowed = "move";

      // **************************************
      // Create a virtual drag image (using the drag icon)

      const dragPreview = document.createElement("div");
      dragPreview.style.width = `${oneColumnRef.current.offsetWidth}px`;
      dragPreview.style.height = `${oneColumnRef.current.offsetHeight}px`;
      dragPreview.style.backgroundColor = currentStyles.backgroundColor || "#e0e0e0";
      dragPreview.style.border = "2px solid #1d4ed8"; // Same as active border color
      dragPreview.style.borderRadius = currentStyles.borderRadius || "4px";
      dragPreview.style.opacity = "0.8"; // Slightly translucent
      dragPreview.style.boxShadow = "0 4px 6px rgba(0,0,0,0.1)";
      dragPreview.style.display = "flex";
      dragPreview.style.alignItems = "center";
      dragPreview.style.justifyContent = "center";
      dragPreview.style.color = "#1d4ed8";
      dragPreview.style.fontSize = "16px";
      dragPreview.style.fontWeight = "bold";
      dragPreview.innerText = activeWidgetName || "Dragging"; // Optional: Add text

      document.body.appendChild(dragPreview);

      // Set the custom drag image
      e.dataTransfer.setDragImage(dragPreview, dragPreview.offsetWidth / 2, dragPreview.offsetHeight / 2);

      // Cleanup after drag starts
      setTimeout(() => {
        document.body.removeChild(dragPreview);
      }, 0);
      // ********************************************

      dispatch(setWidgetOrElement("column"));
      dispatch(setSmallGapInTop(true));
    
    };
    
    const onDrop = (e) => {
      e.stopPropagation();

      const droppedData = JSON.parse(e.dataTransfer.getData("text/plain"));
      console.log("droppedData: ", droppedData);
      console.log("droppedData.name: ", droppedData.name);

      // setPaddingTop(null);

      const restrictedWidgets = ["2-columns", "3-columns"];

      if (droppedData.name && restrictedWidgets.includes(droppedData.name)) {

        dispatch(
          replaceDroppedItem({
            parentId: null,
            column: null,
            draggedNodeId: droppedData.id,
            targetNodeId: id,
          })
        )

      }
      else{

        dispatch(
          replaceDroppedItem({
            parentId: activeParentId || null,
            column: activeColumn || null,
            draggedNodeId: droppedData.id,
            targetNodeId: id,
          })
        );

      }
    };
  

    // *********************************************************************************************
    const handleRightClick = (e, columnKey, childId = null) => {
      e.preventDefault();
    
      console.log("Right-click detected: ", { columnKey, childId });
    
      const containerRect = oneColumnRef.current.getBoundingClientRect();
      const popupWidth = 150;
      const popupHeight = 100;
      const viewportWidth = window.innerWidth;
      const viewportHeight = window.innerHeight;
    
      let popupX = e.clientX - containerRect.left;
      let popupY = e.clientY - containerRect.top;
    
      if (e.clientX + popupWidth > viewportWidth) {
        popupX -= popupWidth;
      }
    
      if (e.clientY + popupHeight > viewportHeight) {
        popupY -= popupHeight;
      }
    
      setPopup({ visible: true, x: popupX, y: popupY, columnKey, childId: childId || null });
    
      dispatch(setActiveRightClick(true));
      dispatch(setActiveWidgetId(childId));
      dispatch(setActiveParentId(id));
      dispatch(setActiveColumn(columnKey));
      dispatch(setHoverColumnInCC(true));
    };

    const handlePopupDelete = (childId) => {
      if (!popup.columnKey || !childId) return;
      console.log(`childId: ${childId}, popup.columnKey: ${popup.columnKey}`);
    
      dispatch(
        deleteDroppedItemById({
          parentId: id, // Parent column ID
          childId: childId, 
          columnName: popup.columnKey,
        })
      );
    
      setPopup({ visible: false, x: 0, y: 0, columnKey: null, childId: null });
    };
    const handlePopupDuplicate = (childId) => {
        if (!popup.columnKey) return;
    
        console.log("Popup Duplicate: ", popup);
      
        dispatch(
          duplicateElementInNormalColumn({
            parentId: id,
            columnName: popup.columnKey,
            childId: childId || null,
          })
        );
      
        setPopup({ visible: false, x: 0, y: 0, columnKey: null, childId: null });
      };
    
    
    
    

  return (
    <div

      
      ref={oneColumnRef}

      onDragOver={handleDragOver}
      onMouseEnter={() => setHoveredColumn(true)}
      onMouseLeave={() => setHoveredColumn(false)}
   
      className={`text-center min-h-[150px] relative group transition-all duration-300 pt-1 pb-1
        
        ${activeParentId===id || activeWidgetId==id? 'border-2 border-blue-500': ""}
      `}
      // ${smallGapInTop ? 'pt-3' : ""}
      onClick={(e) => {
        e.stopPropagation();
        console.log("ColumnOne - activeWidgetId:", activeWidgetId, "activeParentId:", activeParentId);
        dispatch(setActiveWidgetId(id));
        dispatch(setActiveWidgetName("1-column"));
        dispatch(setActiveEditor("sectionEditor"));
        dispatch(setActiveBorders(true));
      }}
      style={{
        ...styleWithBackground, border: currentStyles.borderType, backgroundRepeat: "no-repeat", 
        backgroundPosition: "center", backgroundSize: "cover", borderRadius: currentStyles.borderRadius,
      }}

    >


      {/* Trapezoid Icon Section */}
      {(activeWidgetId === id || activeParentId==id) && (
        <div
          className="absolute -top-[21px] left-[50%] transform -translate-x-1/2 bg-blue-400 flex items-center justify-center"
          style={{
            width: "90px", // Base width of the trapezoid
            height: "20px", // Adjusted height
            clipPath: "polygon(10% 0%, 90% 0%, 100% 100%, 0% 100%)", // Creates trapezoid with subtle tapering
            borderTopLeftRadius: "8px", // Rounded top-left corner
            borderTopRightRadius: "8px", // Rounded top-right corner
          }}
        >
          {/* Icon Container */}
          <div className="flex items-center justify-between w-full h-full">
            {/* Add Icon */}
            <button
              className="flex items-center justify-center w-full h-full transition duration-200 text-black hover:text-white hover:bg-blue-500"
              onClick={(e) => {
                e.stopPropagation();
                console.log("Add icon clicked");
              }}
            >
              <FiEdit size={12} />
            </button>

            {/* Drag Icon */}
            <button
              draggable
              onDragStart={onDragStart}
              onDragEnd={()=>{
                dispatch(setSmallGapInTop(null));
                setPaddingTop(null);
              }}
        
              className="flex items-center justify-center w-full h-full transition duration-200 text-black hover:text-white hover:bg-blue-500"
              onClick={(e) => e.stopPropagation()}
            >
              <PiDotsSixBold size={16} />
            </button>

            {/* Delete Icon */}
            <button
              className="flex items-center justify-center w-full h-full transition duration-200 hover:bg-blue-500 text-black hover:text-red-500"
              onClick={(e) => {
                e.stopPropagation();
                handleDeleteChild(id);

                dispatch(deleteDroppedItemById(
                  {
                    parentId: id, 
                    childId: null, 
                    columnName: null}
                ));
              }}
            >
              <RxCross2 size={12} />
            </button>
          </div>
        </div>
      )}



      {popup.visible && (
        <div
          className="absolute z-50 bg-white shadow-xl border border-gray-300 rounded-lg transition-all duration-200 transform scale-95 opacity-0 animate-fadeIn"
          style={{
            top: popup.y,
            left: popup.x,
            minWidth: "160px",
            padding: "8px",
            boxShadow: "0px 4px 12px rgba(0, 0, 0, 0.15)",
          }}
        >
          {/* Popup Actions */}
          <div className="flex flex-col">
            {/* Duplicate Button */}
            <button
              className="flex items-center gap-3 px-3 py-2 w-full text-left rounded-md hover:bg-gray-100 transition-all duration-200"
              onClick={(e) => {
                e.stopPropagation();
                handlePopupDuplicate(popup.childId);
              }}
            >
              <FiCopy className="text-gray-600 text-lg" /> 
              <span className="text-sm text-gray-700 font-medium">Duplicate</span>
            </button>

            {/* Delete Button */}
            <button
              className="flex items-center gap-3 px-3 py-2 w-full text-left rounded-md hover:bg-red-100 transition-all duration-200"
              onClick={(e) => {
                e.stopPropagation();
                handlePopupDelete(popup.childId);
              }}
            >
              <FiTrash2 className="text-red-500 text-lg" />
              <span className="text-sm text-red-600 font-medium">Delete</span>
            </button>
          </div>
        </div>
      )}






      <div 
          ref={columnRef}
          className={`rounded-md text-center hover:border hover:border-pink-400 min-h-[150px] pt-1 pb-1
          ${activeBorders ? 'border border-pink-200' : ''} 
          ${isDragging ? "bg-blue-100 border border-pink-400" : "bg-transparent"}
          ${(activeWidgetId==id) ? "border border-pink-400" : ""}
          `}
          onDrop={handleDrop}
          onDragEnter={(e) => handleDragEnter(e, null)}
          onDragLeave={(e)=>handleDragLeave(e, columnRef)}
        >



        {/* Render Children */}
        {children.length > 0 ? (
          children.map((child, index) => (
           <React.Fragment key={child.id}>

            {/* 🟣 Drop Zone Above Each Child */}
            {isDragging && dropIndex === index && dropPosition === "above" && (
              <div
                className="drop-zone border-2 border-dashed border-blue-500 bg-blue-200 h-8 rounded-md flex justify-center items-center text-blue-700 font-semibold transition-all pointer-events-auto"
                onDrop={handleDrop}
              >
                Drop Here
              </div>
            )}

              <div
                key={child.id}
                onMouseEnter={() => setHoveredChild(child.id, index)}
                onMouseLeave={() => setHoveredChild(null, index)}
                onClick={(e) => {
                  e.stopPropagation();
                  onclickHandler(id, child.id);
                }}
                className="w-full rounded-md relative group"
                onContextMenu={(e) => {
                  e.stopPropagation();
                  console.log("Right-clicked  in columnOne:", child.id);
                  handleRightClick(e, "children", child.id); // ✅ Pass childId
                }}

                id={`element-${child.id}`}
                onDragOver={(e) => handleDragOver(e, child.id, index)}
              >
                
                {componentMap[child.name] ? componentMap[child.name]({ id: child.id, parentId: id,  parentName: "1-column"}) : ""}

              </div>

              {/* 🔵 Drop Zone Below Each Child */}
              {isDragging && dropIndex === index + 1 && dropPosition === "below" && (
                <div
                  className="drop-zone border-2 border-dashed border-blue-500 bg-blue-200 h-8 rounded-md flex justify-center items-center text-blue-700 font-semibold transition-all pointer-events-auto"
                  onDrop={handleDrop}
                >
                  Drop Here
                </div>
              )}

            </React.Fragment>
          ))
        ) : (
          <div className="border-dashed rounded-md text-center text-gray-400 font-semibold"
          >
            Drop an element here
          </div>
        )}
      </div>
    </div>
  );
};

export default ColumnOne;




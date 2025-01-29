import React, { useState, useEffect, useRef } from "react";
import { deleteDroppedItemById, setActiveWidgetName } from "../../redux/cardDragableSlice";
import { setActiveEditor } from "../../redux/cardToggleSlice";

import { useDispatch, useSelector } from "react-redux";
import { updateElementContent } from "../../redux/cardDragableSlice";

import { AiOutlineDrag } from "react-icons/ai";
import { replaceDroppedItem} from "../../redux/cardDragableSlice";

import { setActiveWidgetId } from "../../redux/cardDragableSlice";
import { setActiveParentId } from "../../redux/cardDragableSlice";
import { setActiveColumn } from "../../redux/cardDragableSlice";
import { updateElementStyles } from "../../redux/cardDragableSlice";

import { setColumnOneExtraPadding } from "../../redux/condtionalCssSlice";
import { setColumnTwoExtraPadding } from "../../redux/condtionalCssSlice";
import { setColumnThreeExtraPadding } from "../../redux/condtionalCssSlice";
import { setWrapperExtraPadding } from "../../redux/condtionalCssSlice";
import { setActiveRightClick } from "../../redux/cardDragableSlice";
import { replaceDroppedItemInCC } from "../../redux/cardDragableSlice";
import { addElementAtLocationInCC } from "../../redux/cardDragableSlice";

import { addElementAtLocation } from "../../redux/cardDragableSlice";
import { setWidgetOrElement } from "../../redux/cardDragableSlice";
import { setSmallGapInTop } from "../../redux/condtionalCssSlice";
import { PiDotsSixBold } from "react-icons/pi";
import { FiEdit } from "react-icons/fi";
import { RxCross2 } from "react-icons/rx";
import { useMemo } from "react";


const Text = ({ id, parentId, column, parentName}) => {
  const [val, setVal] = useState("");
  const [hoveredElement, setHoveredElement] = useState(false); // Track hovered element
  const [isFocused, setIsFocused] = useState(false); // Track focus state
  const [extraGap, setExtraGap] = useState(null);
  const inputRef = useRef(null); // Ref to handle input element for dynamic resizing

  const { activeWidgetId, droppedItems, activeParentId, activeColumn, widgetOrElement } = useSelector((state) => state.cardDragable);

    // const {textExtraPadding} = useSelector((state) => state.coditionalCssSlice);

  const dispatch = useDispatch();


  // *****************************************************************************************************************
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

  // ********************************************************************************************************************
  // Recursive function to find the content based on activeWidgetId 
  const findContentById = (items, widgetId) => {
    for (const item of items) {
      if (item.id === widgetId) {
        return item.content || "";
      }

      // Check for children arrays (children, childrenA, childrenB, etc.)
      const nestedKeys = Object.keys(item).filter((key) => key.startsWith("children"));
      for (const key of nestedKeys) {
        const content = findContentById(item[key], widgetId);
        if (content) {
          return content;
        }
      }
    }
    return "";
  };

  useEffect(() => {
    const currentContent = findContentById(droppedItems, id);
    console.log("currentContent ",currentContent);
    setVal(currentContent);
  }, [droppedItems, id]); 

  // ******************************************************************************************************************

  const onClickHandle = (e) => {
    e.stopPropagation();
    // e.preventDefault();

    dispatch(setActiveWidgetName("Text"));
    dispatch(setActiveEditor("Text"));
    dispatch(setActiveWidgetId(id));
    dispatch(setActiveColumn(column));
    dispatch(setActiveParentId(parentId));

    console.log("activeWidgetId in text: ",id);
    console.log("parentId in text: ",parentId);
    console.log("column in text: ",column);
    console.log("droppedItems: ",droppedItems);

    setIsFocused(true);
  };

  const onChangeHandle = (e) => {
    const updatedValue = e.target.value;
    setVal(updatedValue);

    dispatch(
      updateElementContent({
        id,
        content: updatedValue,
        ...(activeParentId && { parentId: activeParentId }),
        ...(activeColumn && { column: activeColumn }),
      })
    );
  };
  

  const onMouseEnterHandler = () => setHoveredElement(true);
  const onMouseLeaveHandler = () => setHoveredElement(false);


  const handleClickOutside = (e) => {
    if (inputRef.current && !inputRef.current.contains(e.target)) {
      setIsFocused(false); // Remove focus
    }
  };

  useEffect(() => {
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  // ************************************************************************ 
  const onClickOutside = () => {

  };
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (inputRef.current && !inputRef.current.contains(event.target)) {
        onClickOutside(); // Call the function when clicking outside
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);
  // *****************************************************************************
  // element exchange position through ui
  const onDragStart = (e) => {
    console.log("onDragStart called in Text");
    e.stopPropagation();
    e.dataTransfer.setData(
      "text/plain",
      JSON.stringify({
        id,
        name: "Text",
        styles: currentStyles,
        type: "widget",
        content: val,
        parentId: parentId || null,
        column: column || null,
      })

    );

    // Create drag preview
    const dragPreview = document.createElement("div");
    dragPreview.style.fontSize = "16px"; // Font size for readability
    dragPreview.style.fontWeight = "bold"; // Bold text for visibility
    dragPreview.style.color = "#1d4ed8"; // Text color
    dragPreview.style.lineHeight = "1"; // Ensure proper line height
    dragPreview.style.whiteSpace = "nowrap"; // Prevent wrapping of text
    dragPreview.style.width = "100px"; // Allow text to determine width
    dragPreview.style.height = "20px"; // Automatically adjust height
    dragPreview.style.opacity = "1"; // Fully opaque for clear visibility
    dragPreview.innerText = "Heading"; // Set the plain text for the drag preview
    document.body.appendChild(dragPreview);

    // Set the custom drag image
    e.dataTransfer.setDragImage(dragPreview, dragPreview.offsetWidth / 2, dragPreview.offsetHeight / 2);

    // Cleanup after drag starts
    setTimeout(() => {
      document.body.removeChild(dragPreview);
    }, 0);


    dispatch(setWidgetOrElement("element"));
    dispatch(setSmallGapInTop(true));
  };
  
  const onDrop = (e) => {
    e.stopPropagation();

    // for changing position from the ui
    const draggedName = e.dataTransfer.getData("text/plain");
    console.log("droppedData from the ui: ", draggedName);
    const restrictedWidgets = ["Text", "TextArea", "Button", "Image", "Divider", "Space", "SocialMedia"];
    if (restrictedWidgets.includes(draggedName)) {
      alert("Please drop it in an black space.");
      return;
    }

    // for droped widgets from left panel
    const droppedData = JSON.parse(e.dataTransfer.getData("text/plain"));
    console.log("droppedData: ", droppedData);
    console.log("parentId in text: ",parentId);
    console.log("droppedData.parentId in text: ",droppedData.parentId);

    console.log("column in text: ",column);
    console.log("droppedData.column in text: ",droppedData.column)

    setExtraGap(null);
    console.log("parentName in text: ",parentName);

    if(widgetOrElement && widgetOrElement === "element"){
      console.log("IF PART CALLED");
                  
      if(parentId === droppedData.parentId && column===droppedData.column){
        // customCollumns as parent is same.
        console.log("parentName: ",parentName);
        if(parentName === 'customColumns'){
          console.log("parentName === customColumns");
          dispatch(
            replaceDroppedItemInCC({
              parentId: parentId || null,
              column: column || null,
              draggedNodeId: droppedData.id,
              targetNodeId: id,
            }) 
          );
        }
        else{
          // 1-column, or 2-columns or 3-columns is same as parent
          console.log("parentName !== customColumnssss")
          dispatch(
            replaceDroppedItem({
              parentId: parentId || null,
              column: column || null,
              draggedNodeId: droppedData.id,
              targetNodeId: id,
            }) 
          );
        }
      }
      else{
        // dragable parent not same, but current parent is "customClumns"
        if(parentName === 'customColumns'){
            console.log("dragable parent not same, but current parent is customClumns");
            dispatch(
              addElementAtLocationInCC({
                draggedNodeId: Date.now(), 
                draggedName: droppedData.name, 
                dragableType: droppedData.type,
                styles: droppedData.styles, 
                content: droppedData.content, 
                
                targetParentId: parentId, 
                targetColumn: column, 
                targetNodeId: id, 
              })
            )
      
            dispatch(deleteDroppedItemById(
              {
                parentId: droppedData.parentId ? droppedData.parentId : droppedData.id, 
                childId: droppedData.parentId ?  droppedData.id : null, 
                columnName: droppedData.column ? droppedData.column : null}
            ));
        }
        // dragable parent not same, but parent is "1-column or 2-columns or 3-columns"
        else{
          console.log("IF PART CALLED 3");
          console.log("dragable parent not same, but parent is: 1-column or 2-columns or 3-columns")
          dispatch(
            addElementAtLocation({
              draggedNodeId: Date.now(), 
              draggedName: droppedData.name, 
              dragableType: droppedData.type,
              styles: droppedData.styles, 
              content: droppedData.content, 
              
              targetParentId: parentId, 
              targetColumn: column, 
              targetNodeId: id, 
            })
          )

          dispatch(deleteDroppedItemById(
            {
              parentId: droppedData.parentId ? droppedData.parentId: droppedData.id, 
              childId: droppedData.parentId ? droppedData.id : null, 
              columnName: droppedData.column ? droppedData.column : null }
          ));

        }
      }

    }
    // columns droping on element
    else if(droppedData.dragableName && droppedData.dragableName === 'dragableColumn'){
      console.log("COLUMN DROPES ON ELEMENT");
      dispatch(
        replaceDroppedItem({
          parentId: null,
          column: null,
          draggedNodeId: droppedData.id,
          targetNodeId: id,
        })
      );

    }
    else{
      // for droped widgets from left panel
      console.log("ELSE PART CALLED");
      if(parentName === 'customColumns'){
        dispatch(
          addElementAtLocationInCC({
            draggedNodeId: Date.now(), 
            draggedName: droppedData.name, 
            dragableType: droppedData.type,
            styles: droppedData.styles, 
            content: droppedData.content, 
            
            targetParentId: parentId, 
            targetColumn: column, 
            targetNodeId: id, 
          })
        )
  
        dispatch(deleteDroppedItemById(
          {
            parentId: droppedData.parentId ? droppedData.parentId : droppedData.id, 
            childId: droppedData.parentId ?  droppedData.id : null, 
            columnName: droppedData.column ? droppedData.column : null}
        ));
      }
      else{
        dispatch(
          addElementAtLocation({
            draggedNodeId: Date.now(), 
            draggedName: droppedData.name, 
            dragableType: droppedData.type,
            
            targetParentId: parentId, 
            targetColumn: column, 
            targetNodeId: id, 
          })
        )
      }
      
    }

    // initialize the application
    dispatch(setActiveWidgetId(null));
    dispatch(setActiveParentId(null));
    dispatch(setActiveColumn(null));

    dispatch(setColumnOneExtraPadding(false));
    dispatch(setColumnTwoExtraPadding(false));
    dispatch(setColumnThreeExtraPadding(false));
    dispatch(setWrapperExtraPadding(false));

  };
  
  //******************************************************************************** smooth extra gap b/w elements during replacing*/ 

  const onDragEnterHandle = () => {
    console.log("onDragEnterHandle called in Button");
  
    // Add padding if not already active
    if (!extraGap) {
      setExtraGap(true);
    }
  };
  
  const onDragOver = (e) => {
    e.preventDefault(); // Prevent default to allow dropping
    console.log("onDragOver called in Button");
  
    // Ensure padding is added immediately when dragging over
    if (!extraGap) {
      setExtraGap(true);
    }
  };
  
  const onDragLeaveHandle = () => {
    console.log("onDragLeaveHandle called in Button");
  
    // Remove padding when dragging out
    setExtraGap(null);
  };

  // **********************************************************************************
  const handleRightClick = (event) => {
    event.preventDefault(); // Prevent the default context menu from showing
    
    dispatch(setActiveRightClick(true));
    dispatch(setActiveWidgetId(null));
    dispatch(setActiveParentId(parentId));
    dispatch(setActiveColumn(column));

    console.log("handleRightClick in text");
    setHoveredElement(false);

  };


  return (
    <div
      style={{ position: "relative" }}
      className={`group ${
        isFocused
          ? "border-2 border-blue-500 bg-gray-100"
          : hoveredElement
          ? "border-dashed border border-blue-500"
          : ""
        } 
         ${activeWidgetId===id ? 'border-2 border-blue-500': ""}
                        
      `}
                        

      onMouseEnter={onMouseEnterHandler}
      onMouseLeave={onMouseLeaveHandler}
      onDrop={onDrop}

      onDragOver={onDragOver}
      onDragEnter={onDragEnterHandle}
      onDragLeave={onDragLeaveHandle}

    >


      {/* Trapezoid Icon Section */}
      {(activeWidgetId === id) && (
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
              className="flex items-center justify-center w-full h-full transition duration-200 text-black hover:text-white hover:bg-blue-500"
              onClick={(e) => e.stopPropagation()}
              draggable
              onDragStart={onDragStart}
              onDragEnd={()=>{
                dispatch(setSmallGapInTop(null));
              }}
            >
              <PiDotsSixBold size={16} />
            </button>

            {/* Delete Icon */}
            <button
              className="flex items-center justify-center w-full h-full transition duration-200 hover:bg-blue-500 text-black hover:text-red-500"
              onClick={(e) => {
                e.stopPropagation();
                dispatch(deleteDroppedItemById(
                  {
                    parentId: parentId ? parentId : id, 
                    childId: parentId ? id : null, 
                    columnName: column ? column : null}
                ));
              }}
            >
              <RxCross2 size={12} />
            </button>
          </div>
        </div>
      )}



      {/* Input Field */}
      <input
        onContextMenu={handleRightClick}
        ref={inputRef}
        onClick={onClickHandle}
        onChange={onChangeHandle}
        type="text"
        className={`p-2 w-full transition-all duration-300 ${
          isFocused ? "border rounded border-gray-300" : "border-none bg-transparent"
        }  focus:outline-none focus:ring-0 bg-transparent
        `}
        placeholder="Text Field"
        value={val}
        style={{
          ...currentStyles,
          overflow: "hidden",
          resize: "none",
          whiteSpace: "pre-wrap",
          ...(extraGap ? { paddingTop: "100px" } : { paddingTop: currentStyles.paddingTop })

        }} // Apply dynamic styles
      />
    </div>
  );
};

export default Text;

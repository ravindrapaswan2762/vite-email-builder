import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { deleteDroppedItemById, setActiveWidgetName } from "../../redux/cardDragableSlice";
import { setActiveEditor } from "../../redux/cardToggleSlice";
import { useRef } from "react";

import { AiOutlineDrag } from "react-icons/ai";
import { replaceDroppedItem } from "../../redux/cardDragableSlice";

import { setActiveWidgetId } from "../../redux/cardDragableSlice";
import { setActiveParentId } from "../../redux/cardDragableSlice";
import { setActiveColumn } from "../../redux/cardDragableSlice";
import { updateElementStyles } from "../../redux/cardDragableSlice";

import { setColumnOneExtraPadding } from "../../redux/condtionalCssSlice";
import { setColumnTwoExtraPadding } from "../../redux/condtionalCssSlice";
import { setColumnThreeExtraPadding } from "../../redux/condtionalCssSlice";
import { setWrapperExtraPadding } from "../../redux/condtionalCssSlice";

import { addElementAtLocation } from "../../redux/cardDragableSlice";
import { setWidgetOrElement } from "../../redux/cardDragableSlice";
import { setSmallGapInTop } from "../../redux/condtionalCssSlice";

import { PiDotsSixBold } from "react-icons/pi";
import { FiEdit } from "react-icons/fi";
import { RxCross2 } from "react-icons/rx";



const Button = ({ id, parentId, column }) => {

  const [isFocused, setIsFocused] = useState(false); // Track focus state
  const [hoveredElement, setHoveredElement] = useState(false); // Track hover state
  const [extraGap, setExtraGap] = useState(null);

  const { activeWidgetId, droppedItems, activeParentId, activeColumn, widgetOrElement } = useSelector((state) => state.cardDragable);

  const dispatch = useDispatch();
  const inputRef = useRef(null);


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

  const onclickHandle = (e) => {
    // e.stopPropagation();
    e.preventDefault();
    dispatch(setActiveWidgetName("Button"));
    dispatch(setActiveEditor("Button"));
    dispatch(setActiveWidgetId(id));

    setIsFocused(true);

    console.log("droppedItems: ", droppedItems);
  };

  const onMouseEnterHandler = () => setHoveredElement(true);
  const onMouseLeaveHandler = () => setHoveredElement(false);

  // ************************************************************************ 
    const onClickOutside = () => {
      setIsFocused(false);
    };
    useEffect(() => {
      const handleClickOutside = (event) => {
        // Check if the click is outside the input field
        if (inputRef.current && !inputRef.current.contains(event.target)) {
          onClickOutside(); // Call the function when clicking outside
        }
      };
  
      document.addEventListener("mousedown", handleClickOutside);
      return () => {
        document.removeEventListener("mousedown", handleClickOutside);
      };
    }, [inputRef]); // Add inputRef to the dependency array
    // *****************************************************************************
    // element exchange position through ui
      const onDragStart = (e) => {
        console.log("onDragStart called in Text");
        e.stopPropagation();
        e.dataTransfer.setData(
          "text/plain",
          JSON.stringify({
            id,
            name: "Button",
            styles: currentStyles,
            type: "widget",
            content: null,
            parentId: parentId || null,
            column: column || null,
          })
        );
        dispatch(setWidgetOrElement("element"));
        dispatch(setSmallGapInTop(true));
      };
      
      const onDrop = (e) => {
        e.stopPropagation();

        const draggedName = e.dataTransfer.getData("text/plain"); // Get the widget name directly
        const restrictedWidgets = ["Text", "TextArea", "Button", "Image", "Divider", "Space", "SocialMedia"];
        if (restrictedWidgets.includes(draggedName)) {
          alert("Please drop it in an black space.");
          return;
        }

        const droppedData = JSON.parse(e.dataTransfer.getData("text/plain"));
        console.log("droppedData in button::::: ", droppedData);

        setExtraGap(null);

        if(widgetOrElement && widgetOrElement === "element"){
              
          if(parentId === droppedData.parentId && column===droppedData.column){
            // for element already exist in the perticular column and changing the positiion.
            dispatch(
              replaceDroppedItem({
                parentId: activeParentId || null,
                column: activeColumn || null,
                draggedNodeId: droppedData.id,
                targetNodeId: id,
              }) 
            );
          }
          else{
            // draging element from another columns or parent and adding it.
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
        // columns droping on element
        else if(droppedData.dragableName && droppedData.dragableName === 'dragableColumn'){
          console.log("dragableColumn if else called in button");
          dispatch(
            replaceDroppedItem({
              parentId: activeParentId || null,
              column: activeColumn || null,
              draggedNodeId: droppedData.id,
              targetNodeId: id,
            }) 
          );

        }
        else{
          // for droped widgets from left panel
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

        // initialize the application after exchage the position
        dispatch(setActiveWidgetId(null));
        dispatch(setActiveParentId(null));
        dispatch(setActiveColumn(null));
        
        dispatch(setColumnOneExtraPadding(false));
        dispatch(setColumnTwoExtraPadding(false));
        dispatch(setColumnThreeExtraPadding(false));
        dispatch(setWrapperExtraPadding(false));
      };
      

      //******************************************************************************** smooth extra gap b/w elements during replacing */ 
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

  return (
    <div
      className={`flex justify-center w-full 
        ${
          isFocused
            ? "border-2 border-blue-500 bg-gray-100"
            : hoveredElement
            ? "border-dashed border border-blue-500"
            : ""
          } 
          ${(activeWidgetId==id) ? "border-2 border-blue-500" : ""}
      `}
      style={{backgroundColor: `${currentStyles.backgroundColor || "transparent"}` }}
      onMouseEnter={onMouseEnterHandler}
      onMouseLeave={onMouseLeaveHandler}
  
      onClick={onclickHandle}

      draggable
      onDragStart={onDragStart}
      onDragEnd={()=>{
        dispatch(setSmallGapInTop(null));
      }}
      
      onDrop={onDrop}
      onDragOver={onDragOver}
      onDragEnter={onDragEnterHandle}
      onDragLeave={onDragLeaveHandle}
    >

      {/* Trapezoid Icon Section */}
      {(activeWidgetId === id) && (
        <div
          className="absolute -top-[19px] left-[50%] transform -translate-x-1/2 bg-blue-400 flex items-center justify-center"
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
      

      {/* Outer Container with Dashed Border */}
      <div
        onDragEnter={onDragEnterHandle}
        onDragLeave={onDragLeaveHandle}
        
        className={`relative w-full h-[50px] bg-transparent  flex items-center p-1 transition-all duration-300`}

        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: `${currentStyles.textAlign || "center"}`,
          height: "auto",
          ...(extraGap ? { paddingTop: "100px" } : { paddingTop: currentStyles.paddingTop })
        }}
      >
        {/* Button Content */}
        <button

        
        onDragEnter={onDragEnterHandle}
        onDragLeave={onDragLeaveHandle}

        ref={inputRef}
          style={{ ...currentStyles, backgroundColor: `${currentStyles.buttonColor || "#1d4ed8"}` }}
          className="relative bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600 transition duration-200 text-center"
        >
          {currentStyles.content || "Submit"}
        </button>

      </div>
    </div>
  );
};

export default Button;

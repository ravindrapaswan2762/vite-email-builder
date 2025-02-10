import React, { useState, useEffect, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { setActiveWidgetName } from "../../redux/cardDragableSlice";
import { setActiveEditor } from "../../redux/cardToggleSlice";

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

import { setWidgetOrElement } from "../../redux/cardDragableSlice";
import { deleteDroppedItemById } from "../../redux/cardDragableSlice";
import { setSmallGapInTop } from "../../redux/condtionalCssSlice";
import { setActiveRightClick } from "../../redux/cardDragableSlice";

import { replaceDroppedItemInCC } from "../../redux/cardDragableSlice";
import { replaceDroppedItemInWS } from "../../redux/cardDragableSlice";
import { addElementAtLocationInCC } from "../../redux/cardDragableSlice";
import { addElementAtLocationInWS } from "../../redux/cardDragableSlice";
import { addElementAtLocation } from "../../redux/cardDragableSlice";

import { setHoverColumnInCC } from "../../redux/condtionalCssSlice";
import { setHoverParentInCC } from "../../redux/condtionalCssSlice";
import { setPaddingTopInCC } from "../../redux/condtionalCssSlice";
import { setPaddingBottom } from "../../redux/condtionalCssSlice";

import { PiDotsSixBold } from "react-icons/pi";
import { FiEdit } from "react-icons/fi";
import { RxCross2 } from "react-icons/rx";



const Space = ({ id, parentId, column, parentName}) => {
  const [hoveredElement, setHoveredElement] = useState(false); // Track hover state
  const [isFocused, setIsFocused] = useState(false); // Track focus state
  const containerRef = useRef(null); // Ref for detecting outside clicks
  const [extraGap, setExtraGap] = useState(null);

  const { activeWidgetId, droppedItems, activeParentId, activeColumn, widgetOrElement} = useSelector((state) => state.cardDragable);
  const dispatch = useDispatch();

  // Recursive function to find the styles based on activeWidgetId
  const findStylesById = (items, widgetId) => {
    for (const item of items) {
      if (item.id === id) {
        return item.styles || {};
      }

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

  const onClickHandle = (e) => {
    e.stopPropagation();
    
    dispatch(setActiveWidgetName("Space"));
    dispatch(setActiveEditor("Space"));
    dispatch(setActiveWidgetId(id));
    dispatch(setActiveParentId(parentId));
    dispatch(setActiveColumn(column));

    setIsFocused(true); // Set focus state

  };

  const onMouseEnterHandler = () => setHoveredElement(true);
  const onMouseLeaveHandler = () => setHoveredElement(false);

  // ************************************************************************ 
    const onClickOutside = () => {
      setIsFocused(false);
    };
    useEffect(() => {
      const handleClickOutside = (event) => {
        if (containerRef.current && !containerRef.current.contains(event.target)) {
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
            name: "Space",
            styles: currentStyles,
            type: "widget",
            content: null,
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
        dragPreview.innerText = "Space"; // Set the plain text for the drag preview
        document.body.appendChild(dragPreview);

        // Set the custom drag image
        e.dataTransfer.setDragImage(dragPreview, dragPreview.offsetWidth / 2, dragPreview.offsetHeight / 2);

        // Cleanup after drag starts
        setTimeout(() => {
          document.body.removeChild(dragPreview);
        }, 0);

        dispatch(setWidgetOrElement("element"));
        dispatch(setSmallGapInTop(true));

        setTimeout(() => {
          dispatch(setPaddingBottom(true)); 
          dispatch(setPaddingTopInCC(true)); 
        }, 100); // Small delay ensures drag operation completes first
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
                  else if(parentName==='widgetSection'){
                    console.log("parentName === widgetSection");
                    dispatch(
                      replaceDroppedItemInWS({
                        parentId: parentId || null,
                        column: column || null,
                        draggedNodeId: droppedData.id,
                        targetNodeId: id,
                      }) 
                    );
                  }
                  else{
                    // 1-column, or 2-columns or 3-columns is same as parent
                    console.log("parentName === normal section")
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
                  else if(parentName === 'widgetSection'){
                    console.log("dragable parent not same, but current parent is widgetSection");
                    dispatch(
                      addElementAtLocationInWS({
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
            // nothing to do
          }
          else{
            // for droped widgets from left panel
              console.log("parentName: ",parentName);
              if(parentName==='widgetSection'){
                dispatch(
                  addElementAtLocationInWS({
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
              }
              else if(parentName==='customColumns'){
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

          dispatch(setHoverParentInCC(null));
          dispatch(setHoverColumnInCC(null));
          dispatch(setPaddingTopInCC(null));
          dispatch(setPaddingBottom(null));
      
        };

      //******************************************************************************** */ 
      const onDragEnterHandle = () => {
        console.log("onDragEnterHandle called in Space");

        if (!extraGap) {
          setExtraGap(true);
        }
      }

      const onDragOver = (e) => {
        console.log("onDragOver called in Space");
        e.preventDefault(); // Allow dropping

        if (!extraGap) {
          setExtraGap(true);
        }
      };
    
      const onDragLeaveHandle = () => {
        console.log("onDragLeaveHandle called in Space");
        setExtraGap(null);
      }
    // ****************************************************************************************
    const handleRightClick = () =>{
      dispatch(setActiveWidgetId(id));
      dispatch(setActiveParentId(parentId));
      dispatch(setActiveColumn(column));
  
      setIsFocused(true);
    }

  return (
    <div
      onContextMenu={handleRightClick}
      ref={containerRef}
      className={`relative w-full h-[22px] transition-all duration-300
        ${
          isFocused
            ? "border-2 border-blue-500 bg-gray-100"
            : hoveredElement
            ? "border-dashed border border-blue-500"
            : ""
          } 
          ${(activeWidgetId==id) ? "border-2 border-blue-500" : ""}

      `}

      style={{...currentStyles}}
      onMouseEnter={onMouseEnterHandler}
      onMouseLeave={onMouseLeaveHandler}
      onClick={onClickHandle}
      
      onDrop={onDrop}
      onDragOver={onDragOver}

      onDragEnter={onDragEnterHandle}
      onDragLeave={onDragLeaveHandle}

    >

      {/* Add this div for border only on extra padding */}
      {extraGap && (
        <div
          style={{
            position: "absolute",
            top: "-40px",
            left: 0,
            width: "100%",
            height: "40px",
            backgroundColor: "rgba(173, 216, 230, 0.3)", // ✅ Light highlight for padding area
            borderTop: "1px dashed rgba(30, 144, 255, 0.8)",
            borderLeft: "1px dashed rgba(30, 144, 255, 0.8)",
            borderRight: "1px dashed rgba(30, 144, 255, 0.8)",
            borderBottom: "1px dashed rgba(30, 144, 255, 0.8)", // ✅ No bottom border to avoid confusion
            pointerEvents: "none", // ✅ Ensures it doesn’t interfere with interactions
            zIndex: 0, // ✅ Keeps it visible above the background
          }}
        />
      )}



        {/* ✅ Blank Space for extra padding */}
      <div
        style={{
          ...(extraGap 
            ? { 
                paddingTop: "30px", 
                // backgroundColor: "rgba(173, 216, 230, 0.5)", // Subtle highlight
                // position: "relative",

                overflow: "hidden",
                resize: "none",
                whiteSpace: "pre-wrap",
                // paddingTop: currentStyles.paddingTop, // Input remains normal
                position: "relative",
                zIndex: 2, // Keeps input above the extra padding div
                marginTop: extraGap ? "30px" : "0px", // ✅ Shift input down
 
              } 
            : { 
                paddingTop: currentStyles.paddingTop 
              }
          )
        }}
      />

      {/* 🔹 Small Rectangular Box in the Top-Right Corner */}
        {hoveredElement && (
          <div
          className="absolute top-0 right-0 w-[25px] h-[20px] bg-blue-400 flex items-center justify-center cursor-grab shadow-md"
          style={{
            zIndex: 10
          }}
          draggable
          onDragStart={onDragStart}
          onDragEnd={()=>{
            dispatch(setSmallGapInTop(null));
            setExtraGap(null);

            dispatch(setHoverParentInCC(null));
            dispatch(setHoverColumnInCC(null));
            dispatch(setPaddingTopInCC(null));
            dispatch(setPaddingBottom(null));
          }}
        >
          <PiDotsSixBold size={12} className="text-black" />
        </div>
        )}


        
      
    </div>
  );
};

export default Space;

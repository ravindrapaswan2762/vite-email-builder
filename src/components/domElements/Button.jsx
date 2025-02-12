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

import { setWidgetOrElement } from "../../redux/cardDragableSlice";
import { setSmallGapInTop } from "../../redux/condtionalCssSlice";
import { setActiveRightClick } from "../../redux/cardDragableSlice";

import { replaceDroppedItemInCC } from "../../redux/cardDragableSlice";
import { replaceDroppedItemInWS } from "../../redux/cardDragableSlice";
import { addElementAtLocationInCC } from "../../redux/cardDragableSlice";
import { addElementAtLocationInWS } from "../../redux/cardDragableSlice";
import { addElementAtLocation } from "../../redux/cardDragableSlice";

import { PiDotsSixBold } from "react-icons/pi";
import { FiEdit } from "react-icons/fi";
import { RxCross2 } from "react-icons/rx";

import { setHoverColumnInCC } from "../../redux/condtionalCssSlice";
import { setHoverParentInCC } from "../../redux/condtionalCssSlice";
import { setPaddingTopInCC } from "../../redux/condtionalCssSlice";
import { setPaddingBottom } from "../../redux/condtionalCssSlice";
import { duplicateCustomColumn } from "../../redux/cardDragableSlice";


const Button = ({ id, parentId, column, parentName}) => {

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
    e.stopPropagation();
    // e.preventDefault();
    
    dispatch(setActiveWidgetName("Button"));
    dispatch(setActiveEditor("Button"));
    dispatch(setActiveWidgetId(id));
    dispatch(setActiveParentId(parentId));
    dispatch(setActiveColumn(column));

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
        dragPreview.innerText = "Button"; // Set the plain text for the drag preview
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
      
      // const onDrop = (e) => {
      //   e.stopPropagation();

      //   const draggedName = e.dataTransfer.getData("text/plain"); // Get the widget name directly
      //   const restrictedWidgets = ["Text", "TextArea", "Button", "Image", "Divider", "Space", "SocialMedia"];
      //   if (restrictedWidgets.includes(draggedName)) {
      //     alert("Please drop it in an black space.");
      //     return;
      //   }

      //   const droppedData = JSON.parse(e.dataTransfer.getData("text/plain"));
      //   console.log("droppedData in button::::: ", droppedData);

      //   setExtraGap(null);

      //   if(widgetOrElement && widgetOrElement === "element"){
              
      //     if(parentId === droppedData.parentId && column===droppedData.column){
      //       // for element already exist in the perticular column and changing the positiion.
      //       if(parentName === 'customColumns'){
      //         console.log("parentName === customColumns");
      //         dispatch(
      //           replaceDroppedItemInCC({
      //             parentId: parentId || null,
      //             column: column || null,
      //             draggedNodeId: droppedData.id,
      //             targetNodeId: id,
      //           }) 
      //         );
      //       }
      //       else{
      //         console.log("parentName !== customColumns")
      //         dispatch(
      //           replaceDroppedItem({
      //             parentId: parentId || null,
      //             column: column || null,
      //             draggedNodeId: droppedData.id,
      //             targetNodeId: id,
      //           }) 
      //         );
      //       }
      //     }
      //     else{
      //       // draging element from another columns or parent and adding it.
      //       dispatch(
      //         addElementAtLocation({
      //           draggedNodeId: Date.now(), 
      //           draggedName: droppedData.name, 
      //           dragableType: droppedData.type,
      //           styles: droppedData.styles, 
      //           content: droppedData.content, 
                
      //           targetParentId: parentId, 
      //           targetColumn: column, 
      //           targetNodeId: id, 
      //         })
      //       )

      //       dispatch(deleteDroppedItemById(
      //         {
      //           parentId: droppedData.parentId ? droppedData.parentId: droppedData.id, 
      //           childId: droppedData.parentId ? droppedData.id : null, 
      //           columnName: droppedData.column ? droppedData.column : null }
      //       ));

      //     }

      //   }
      //   // columns droping on element
      //   else if(droppedData.dragableName && droppedData.dragableName === 'dragableColumn'){
      //     console.log("dragableColumn if else called in button");
      //     dispatch(
      //       replaceDroppedItem({
      //         parentId: activeParentId || null,
      //         column: activeColumn || null,
      //         draggedNodeId: droppedData.id,
      //         targetNodeId: id,
      //       }) 
      //     );

      //   }
      //   else{
      //     // for droped widgets from left panel
      //     dispatch(
      //       addElementAtLocation({
      //         draggedNodeId: Date.now(), 
      //         draggedName: droppedData.name, 
      //         dragableType: droppedData.type,
              
      //         targetParentId: parentId, 
      //         targetColumn: column, 
      //         targetNodeId: id, 
      //       })
      //     )
          
      //   }

      //   // initialize the application after exchage the position
      //   dispatch(setActiveWidgetId(null));
      //   dispatch(setActiveParentId(null));
      //   dispatch(setActiveColumn(null));
        
      //   dispatch(setColumnOneExtraPadding(false));
      //   dispatch(setColumnTwoExtraPadding(false));
      //   dispatch(setColumnThreeExtraPadding(false));
      //   dispatch(setWrapperExtraPadding(false));
      // };
      

      //******************************************************************************** smooth extra gap b/w elements during replacing */ 
      
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
      const handleRightClick = () =>{
        dispatch(setActiveWidgetId(id));
        dispatch(setActiveParentId(parentId));
        dispatch(setActiveColumn(column));

        setIsFocused(true);
      }

  return (
    <div
      className={`flex justify-center w-full relative
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
      onContextMenu={handleRightClick}
      
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
            top: 0,  
            left: 0,
            width: "100%",
            height: "40px", // Height of extra padding
            backgroundColor: "rgba(173, 216, 230, 0.3)",  // Light highlight
            borderTop: "1px dashed rgba(30, 144, 255, 0.8)", 
            borderLeft: "1px dashed rgba(30, 144, 255, 0.8)",
            borderRight: "1px dashed rgba(30, 144, 255, 0.8)",
            borderBottom: "1px dashed rgba(30, 144, 255, 0.8)",
            pointerEvents: "none",
            zIndex: 1, // Behind input
          }}
        />
      )}

      {/* Outer Container with Dashed Border */}
      <div
        onDragEnter={onDragEnterHandle}
        onDragLeave={onDragLeaveHandle}
        // onContextMenu={handleRightClick}
        
        className={`relative w-full h-[40px] bg-transparent  flex items-center p-0.5 transition-all duration-300`}

        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: `${currentStyles.textAlign || "center"}`,
          height: "auto",
          ...(extraGap 
            ? { 
                overflow: "hidden",
                resize: "none",
                whiteSpace: "pre-wrap",
                paddingTop: currentStyles.paddingTop, // Input remains normal
                position: "relative",
                zIndex: 2, // Keeps input above the extra padding div
                marginTop: extraGap ? "40px" : "", // ✅ Shift input down
              } 
            : { 
                paddingTop: currentStyles.paddingTop 
              }
          )
        }}
      >

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
        


        {/* Button Content */}
        <button

        onDragEnter={onDragEnterHandle}
        onDragLeave={onDragLeaveHandle}
        // onContextMenu={handleRightClickOnElement}

        ref={inputRef}
          style={{ ...currentStyles, backgroundColor: `${currentStyles.buttonColor || "#1d4ed8"}` }}
          className="relative bg-blue-500 text-white px-3 py-2 rounded-md hover:bg-blue-600 transition duration-200 text-center"
        >
          {currentStyles.content || "Click Here"}
        </button>

      </div>
    </div>
  );
};

export default Button;

import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { setActiveEditor } from "../../redux/cardToggleSlice";
import {setActiveWidgetName } from "../../redux/cardDragableSlice";
import { useRef } from "react";

import img from '../../assets/placeholder.png';

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
import { setElementPaddingTop } from "../../redux/condtionalCssSlice";
import { addElementAtLocationInCC } from "../../redux/cardDragableSlice";

import { setWidgetOrElement } from "../../redux/cardDragableSlice";
import { addElementAtLocation } from "../../redux/cardDragableSlice";
import { deleteDroppedItemById } from "../../redux/cardDragableSlice";
import { setSmallGapInTop } from "../../redux/condtionalCssSlice";
import { setActiveRightClick } from "../../redux/cardDragableSlice";
import { replaceDroppedItemInCC } from "../../redux/cardDragableSlice";
import { setCustomClumnsExtraPadding } from "../../redux/condtionalCssSlice";

import { PiDotsSixBold } from "react-icons/pi";
import { FiEdit } from "react-icons/fi";
import { RxCross2 } from "react-icons/rx";

import { setHoverColumnInCC } from "../../redux/condtionalCssSlice";
import { setHoverParentInCC } from "../../redux/condtionalCssSlice";
import { setPaddingTopInCC } from "../../redux/condtionalCssSlice";
import { setPaddingBottom } from "../../redux/condtionalCssSlice";


const Image = ({ id, parentId, column, parentName}) => {

  const { activeWidgetId, droppedItems, activeParentId , activeColumn, widgetOrElement } = useSelector((state) => state.cardDragable);
  const {elementPaddingTop, smallGapInTop, customClumnsExtraPadding} = useSelector((state) => state.coditionalCssSlice);

  const [imageSrc, setImageSrc] = useState(""); // State for the image source
  const [hoveredElement, setHoveredElement] = useState(false); // State for hover
  const [isFocused, setIsFocused] = useState(false); // State for focus
  const [extraGap, setExtraGap] = useState(elementPaddingTop);

  useEffect( ()=>{
    setExtraGap(elementPaddingTop);
  }, [elementPaddingTop]);

  const imageRef = useRef(null);

  // Find the styles associated with the widget by its ID
  const findStylesById = (items, widgetId) => {
    for (const item of items) {
      if (item.id === id) {
        return item.styles || {};
      }
      // Check for nested children arrays
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

  const dispatch = useDispatch();

  // Placeholder image URL
  const placeholderImage = img;

  const handleImageUpload = (e) => {
    const file = e.target.files[0]; // Get the selected file
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImageSrc(reader.result); // Set the image source
      };
      reader.readAsDataURL(file);
    }
  };

  const onMouseEnterHandler = () => setHoveredElement(true);
  const onMouseLeaveHandler = () => setHoveredElement(false);

  const onClickHandler = (e) => {
    e.stopPropagation();
    // e.preventDefault();
    
    dispatch(setActiveWidgetName("Image"));
    dispatch(setActiveEditor("Image"));
    dispatch(setActiveWidgetId(id));
    dispatch(setActiveParentId(parentId));
    dispatch(setActiveColumn(column));

    setIsFocused(true);

    console.log("currentStyles in image:::::: ", currentStyles);

  };

  // ************************************************************************ 
    const onClickOutside = () => {
      setIsFocused(false);
    };
    useEffect(() => {
      const handleClickOutside = (event) => {
        if (imageRef.current && !imageRef.current.contains(event.target)) {
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
            name: "Image",
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
        dragPreview.innerText = "Image"; // Set the plain text for the drag preview
        document.body.appendChild(dragPreview);

        // Set the custom drag image
        e.dataTransfer.setDragImage(dragPreview, dragPreview.offsetWidth / 2, dragPreview.offsetHeight / 2);

        // Cleanup after drag starts
        setTimeout(() => {
          document.body.removeChild(dragPreview);
        }, 0);

        dispatch(setWidgetOrElement("element"));
        dispatch(dispatch(setSmallGapInTop(true)));

        setTimeout(() => {
          dispatch(setPaddingBottom(true)); 
          dispatch(setPaddingTopInCC(true)); 
        }, 100); // Small delay ensures drag operation completes first
      };
      
      // const onDrop = (e) => {
      //   e.stopPropagation();

      //   setExtraGap(false);
      //   dispatch(setCustomClumnsExtraPadding(null));
      //   console.log("extraGap in image: ",extraGap);

      //   const draggedName = e.dataTransfer.getData("text/plain"); // Get the widget name directly
      //   const restrictedWidgets = ["Text", "TextArea", "Button", "Image", "Divider", "Space", "SocialMedia"];
      //   if (restrictedWidgets.includes(draggedName)) {
      //     alert("Please drop it in an black space.");
      //     return;
      //   }
        
      //   const droppedData = JSON.parse(e.dataTransfer.getData("text/plain"));
        
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
      //   // for columns droping on element
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
      
      //******************************************************************************** */ 
      
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
                console.log("parentName !== customColumns")
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
        if(!customClumnsExtraPadding){
          dispatch(setColumnOneExtraPadding(true));
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
        if (extraGap) {
          setExtraGap(null);
        }

        dispatch(setCustomClumnsExtraPadding(true));
      };
    // ****************************************************************************************
    const handleRightClick = (event) => {
        event.preventDefault(); // Prevent the default context menu from showing
        
        dispatch(setActiveRightClick(true));
        dispatch(setActiveWidgetId(null));
        dispatch(setActiveParentId(parentId));
        dispatch(setActiveColumn(column));

        setHoveredElement(false);
        console.log("handleRightClick in text");
    
      };
    

  return (
    <div
      ref={imageRef}
      style={{
        position: "relative",
        overflow: "visible"
      }}  
      // Removed "flex items-center justify-center" so the image can span the full width
      className={`relative rounded-md text-center w-full h-auto relative overflow-hidden bg-transparent
          
        ${
          isFocused
            ? "border-2 border-blue-500 bg-gray-100"
            : hoveredElement
            ? "border-dashed border border-blue-500"
            : ""
          } 
          ${(activeWidgetId==id) ? "border-2 border-blue-500" : ""}

        `}
      onMouseEnter={onMouseEnterHandler}
      onMouseLeave={onMouseLeaveHandler}
      onClick={onClickHandler}

      onDrop={onDrop}
      onDragOver={onDragOver}

      onDragEnter={onDragEnterHandle}
      onDragLeave={onDragLeaveHandle}

    >

      {/* top icons */}
      {(activeWidgetId === id) && (
        <div
          className="absolute -top-[20px] left-[50%] transform -translate-x-1/2 bg-blue-400 flex items-center justify-center"
          style={{
            position: "absolute", // Ensure the trapezoid is absolutely positioned
            zIndex: 99999, // Place above other elements
            width: "90px", // Trapezoid width
            height: "20px", // Trapezoid height
            clipPath: "polygon(10% 0%, 90% 0%, 100% 100%, 0% 100%)", // Trapezoid shape
            borderTopLeftRadius: "8px", // Top corners rounded
            borderTopRightRadius: "8px",
          }}
        >
          {/* Icon Container */}
          <div className="flex items-center justify-between w-full h-full">
            {/* Add Icon */}
            <button
              className="flex items-center justify-center w-full h-full text-black hover:text-white hover:bg-blue-500"
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
              onDragEnd={(e)=>{
                e.stopPropagation();
                dispatch(setSmallGapInTop(null));
                dispatch(setElementPaddingTop(null));
                dispatch(setColumnOneExtraPadding(null));
                setExtraGap(null);

                dispatch(setHoverParentInCC(null));
                dispatch(setHoverColumnInCC(null));
                dispatch(setPaddingTopInCC(null));
                dispatch(setPaddingBottom(null));
              }}
              className="flex items-center justify-center w-full h-full text-black hover:text-white hover:bg-blue-500"
              onClick={(e) => e.stopPropagation()}
            >
              <PiDotsSixBold size={16} />
            </button>

            {/* Delete Icon */}
            <button
              className="flex items-center justify-center w-full h-full hover:bg-blue-500 text-black hover:text-red-500"
              onClick={(e) => {
                e.stopPropagation();
                dispatch(
                  deleteDroppedItemById({
                    parentId: parentId ? parentId : id,
                    childId: parentId ? id : null,
                    columnName: column ? column : null,
                  })
                );
              }}
            >
              <RxCross2 size={12} />
            </button>
          </div>
        </div>
      )}


      

      {/* Image or Placeholder */}
      {currentStyles.imageUrl ? (
        <a 
          href={currentStyles.href || "#"} 
          target={currentStyles.target || "_self"} 
          rel="noopener noreferrer"
          className="transition-all duration-300"
        >
          <img
            onContextMenu={handleRightClick}
            src={currentStyles.imageUrl}
            alt="Uploaded"
            className="w-full h-full object-contain rounded transition-all duration-300"
            style={{
              ...currentStyles, 
              ...(extraGap 
                ? { 
                    paddingTop: "40px", 
                    backgroundColor: "rgba(173, 216, 230, 0.5)", // Subtle highlight
                    position: "relative",
                  } 
                : { 
                    paddingTop: currentStyles.paddingTop 
                  }
              )
            }}
            
          />
        </a>
      
      ) : imageSrc ? (
        <img
          onContextMenu={handleRightClick}
          src={imageSrc}
          alt="Uploaded"
          // Ensures the image takes the full width, auto height, and retains aspect ratio
          className="w-full h-full object-contain rounded transition-all duration-300"
          style={{
            ...currentStyles, 
            ...(extraGap 
              ? { 
                  paddingTop: "40px", 
                  backgroundColor: "rgba(173, 216, 230, 0.5)", // Subtle highlight
                  position: "relative",
                } 
              : { 
                  paddingTop: currentStyles.paddingTop 
                }
            )
          }}
        />
      ) : (
        <div className="flex flex-col items-center justify-center text-gray-500">
          <img
            onContextMenu={handleRightClick}
            src={placeholderImage}
            alt="Placeholder"
            className="w-full h-auto object-contain rounded opacity-90 transition-all duration-300"
            style={{
              ...currentStyles, 
              ...(extraGap 
                ? { 
                    paddingTop: "40px", 
                    backgroundColor: "rgba(173, 216, 230, 0.5)", // Subtle highlight
                    position: "relative",
                  } 
                : { 
                    paddingTop: currentStyles.paddingTop 
                  }
              )
              }}
          />
        </div>
      )}

      {/* Add this div for border only on extra padding */}
      {extraGap && (
        <div 
          style={{
            position: "absolute",
            top: 0,  // Aligns with extra padding top
            left: 0,
            width: "100%",
            height: "40px", // Same as extra padding height
            borderTop: "1px dashed rgba(30, 144, 255, 0.8)",  // Dashed border only on extra padding
            borderLeft: "1px dashed rgba(30, 144, 255, 0.8)",
            borderRight: "1px dashed rgba(30, 144, 255, 0.8)",
            borderBottom: "1px dashed rgba(30, 144, 255, 0.8)",
            pointerEvents: "none", // Ensures it doesn't interfere with interactions
          }}
        />
      )}


      {/* Hidden File Input */}
      
      {/* <input
        type="file"
        id="image-upload"
        accept="image/*"
        className="absolute inset-0 opacity-0 cursor-pointer"
        onChange={handleImageUpload}
      /> */}
     
    </div>
  );
};

export default Image;

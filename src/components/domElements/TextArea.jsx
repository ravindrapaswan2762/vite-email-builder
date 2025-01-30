import React, { useState, useEffect, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";

import { setActiveEditor } from "../../redux/cardToggleSlice";
import { setActiveWidgetName } from "../../redux/cardDragableSlice";
import { updateElementContent, updateElementStyles } from "../../redux/cardDragableSlice";

import { AiOutlineDrag } from "react-icons/ai";
import { replaceDroppedItem } from "../../redux/cardDragableSlice";

import { setActiveWidgetId } from "../../redux/cardDragableSlice";
import { setActiveParentId } from "../../redux/cardDragableSlice";
import { setActiveColumn } from "../../redux/cardDragableSlice";

import { setColumnOneExtraPadding } from "../../redux/condtionalCssSlice";
import { setColumnTwoExtraPadding } from "../../redux/condtionalCssSlice";
import { setColumnThreeExtraPadding } from "../../redux/condtionalCssSlice";
import { setWrapperExtraPadding } from "../../redux/condtionalCssSlice";
import { addElementAtLocationInCC } from "../../redux/cardDragableSlice";

import { setWidgetOrElement } from "../../redux/cardDragableSlice";
import { addElementAtLocation } from "../../redux/cardDragableSlice";
import { deleteDroppedItemById } from "../../redux/cardDragableSlice";
import { setSmallGapInTop } from "../../redux/condtionalCssSlice";
import { setActiveRightClick } from "../../redux/cardDragableSlice";
import { replaceDroppedItemInCC } from "../../redux/cardDragableSlice";

import { PiDotsSixBold } from "react-icons/pi";
import { FiEdit } from "react-icons/fi";
import { RxCross2 } from "react-icons/rx";



const TextArea = ({ id, parentId, column, parentName}) => {
  const [val, setVal] = useState("");
  const [hoveredElement, setHoveredElement] = useState(false); // Hover state
  const [isFocused, setIsFocused] = useState(false); // Focus state
  const inputRef = useRef(null); // Ref for detecting clicks outside
  const [extraGap, setExtraGap] = useState(null);

  const { activeWidgetId, droppedItems, activeParentId, activeColumn, widgetOrElement} = useSelector((state) => state.cardDragable);
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

  // *******************************************************************************************************************

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
    setVal(currentContent);
  }, []); 

  // *******************************************************************************************************************

  const handleInputChange = (e) => {
    const updatedValue = e.target.value;
    setVal(updatedValue);

    autoResize(e.target);

    // Dispatch content update to Redux
    dispatch(
      updateElementContent({
        id,
        content: updatedValue,
        ...(activeParentId && { parentId: activeParentId }),
        ...(activeColumn && { column: activeColumn }),
      })
    );

  };

  const onclickHandle = (e) => {
    e.stopPropagation();
    // e.preventDefault();

    dispatch(setActiveWidgetName("TextArea"));
    dispatch(setActiveEditor("TextArea"));
    dispatch(setActiveWidgetId(id));
    dispatch(setActiveParentId(parentId));
    dispatch(setActiveColumn(column));

    setIsFocused(true); // Set focus state
    
    console.log("droppedItems: ",droppedItems);
    console.log("currentStyles::::: ",currentStyles);
  };

  const onMouseEnterHandler = () => setHoveredElement(true);
  const onMouseLeaveHandler = () => setHoveredElement(false);

  const handleClickOutside = (e) => {
    if (inputRef.current && !inputRef.current.contains(e.target)) {
      setIsFocused(false); // Remove focus and reset background and border
    }
  };

  useEffect(() => {
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);



  // *************************************************************************

  const autoResize = (textarea) => {
    textarea.style.height = `${textarea.scrollHeight}px`; // Set height to scrollHeight
    console.log("textarea.scrollHeight: ",textarea.scrollHeight);

    // Dispatch height update to Redux
    dispatch(
      updateElementStyles({
        id,
        styles: { height: `${textarea.scrollHeight}px` },
        ...(activeParentId && { parentId: activeParentId }),
        ...(activeColumn && { column: activeColumn }),
      })
    );
  };

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
            name: "TextArea",
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
        dragPreview.innerText = "Text Area"; // Set the plain text for the drag preview
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
      
      // const onDrop = (e) => {
      //   e.stopPropagation();

      //   const draggedName = e.dataTransfer.getData("text/plain");
      //   console.log("droppedData from the ui: ", draggedName);
      //   const restrictedWidgets = ["Text", "TextArea", "Button", "Image", "Divider", "Space", "SocialMedia"];
      //   if (restrictedWidgets.includes(draggedName)) {
      //     alert("Please drop it in an black space.");
      //     return;
      //   }

      //   const droppedData = JSON.parse(e.dataTransfer.getData("text/plain"));
      //   console.log("droppedData in TextArea: ", droppedData);

      //   setExtraGap(null);
        
      //   if(widgetOrElement && widgetOrElement === "element"){
          
      //     if(parentId === droppedData.parentId && column===droppedData.column){
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
      className={`group flex  relative
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
      ref={inputRef} // Add the ref to the parent div to detect clicks outside

      onDragOver={onDragOver}
      onDragEnter={onDragEnterHandle}
      onDragLeave={onDragLeaveHandle}
      onDrop={onDrop}
    >


      {/* Trapezoid Icon Section */}
      {(activeWidgetId === id) && (
        <div
          className="absolute -top-[20px] left-[50%] transform -translate-x-1/2 bg-blue-400 flex items-center justify-center"
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
                setExtraGap(null);
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
            borderTop: "2px dashed rgba(30, 144, 255, 0.8)", 
            borderLeft: "2px dashed rgba(30, 144, 255, 0.8)",
            borderRight: "2px dashed rgba(30, 144, 255, 0.8)",
            borderBottom: "2px dashed rgba(30, 144, 255, 0.8)",
            pointerEvents: "none",
            zIndex: 1, // Behind input
          }}
        />
      )}


      {/* Text Area */}
      <textarea
        onContextMenu={handleRightClick}
        onChange={handleInputChange}
        onClick={onclickHandle}
        className={`border p-2 w-full rounded focus:outline-none transition-all duration-300 focus:outline-none focus:ring-0 bg-transparent
          ${isFocused ? "border rounded border-gray-300" : "border-none bg-transparent"} 
         `}
        placeholder="Text Area"
        value={val}
        style={{
          ...currentStyles,
          overflow: "hidden", // Hide scrollbar
          resize: "none", // Disable manual resizing
          whiteSpace: "pre-wrap", // Preserve line breaks and spaces
          wordWrap: "break-word", // Break long words
          ...(extraGap 
            ? { 
                // paddingTop: "50px", 
                // backgroundColor: "rgba(173, 216, 230, 0.5)", // Subtle highlight
                // position: "relative",

                overflow: "hidden",
                resize: "none",
                whiteSpace: "pre-wrap",
                paddingTop: currentStyles.paddingTop, // Input remains normal
                position: "relative",
                zIndex: 2, // Keeps input above the extra padding div
                marginTop: extraGap ? "40px" : "0px", // ✅ Shift input down
              } 
            : { 
                paddingTop: currentStyles.paddingTop 
              }
          ),
          paddingBottom: currentStyles.paddingBottom || "",
        }} // Apply dynamic styles
      />
    </div>
  );
};

export default TextArea;

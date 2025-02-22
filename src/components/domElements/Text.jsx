import React, { useState, useEffect, useRef } from "react";
import { deleteDroppedItemById, setActiveWidgetName } from "../../redux/cardDragableSlice";
import { setActiveEditor } from "../../redux/cardToggleSlice";

import { useDispatch, useSelector } from "react-redux";
import { updateElementContent } from "../../redux/cardDragableSlice";

// import { AiOutlineDrag } from "react-icons/ai";

import { setActiveWidgetId } from "../../redux/cardDragableSlice";
import { setActiveParentId } from "../../redux/cardDragableSlice";
import { setActiveColumn } from "../../redux/cardDragableSlice";
// import { updateElementStyles } from "../../redux/cardDragableSlice";

// import { setColumnOneExtraPadding } from "../../redux/condtionalCssSlice";
// import { setColumnTwoExtraPadding } from "../../redux/condtionalCssSlice";
// import { setColumnThreeExtraPadding } from "../../redux/condtionalCssSlice";
// import { setWrapperExtraPadding } from "../../redux/condtionalCssSlice";
// import { setActiveRightClick } from "../../redux/cardDragableSlice";

// import { replaceDroppedItemInCC } from "../../redux/cardDragableSlice";
// import { replaceDroppedItemInWS } from "../../redux/cardDragableSlice";
// import { replaceDroppedItem} from "../../redux/cardDragableSlice";
// import { addElementAtLocationInCC } from "../../redux/cardDragableSlice";
// import { addElementAtLocationInWS } from "../../redux/cardDragableSlice";
// import { addElementAtLocation } from "../../redux/cardDragableSlice";


import { setWidgetOrElement } from "../../redux/cardDragableSlice";
import { setSmallGapInTop } from "../../redux/condtionalCssSlice";
import { PiDotsSixBold } from "react-icons/pi";
// import { FiEdit } from "react-icons/fi";
// import { RxCross2 } from "react-icons/rx";
// import { useMemo } from "react";

import { setHoverColumnInCC } from "../../redux/condtionalCssSlice";
import { setHoverParentInCC } from "../../redux/condtionalCssSlice";
import { setPaddingTopInCC } from "../../redux/condtionalCssSlice";
import { setPaddingBottom } from "../../redux/condtionalCssSlice";
import { setElementDragging } from "../../redux/cardDragableSlice";


const Text = ({ id, parentId, column, parentName}) => {
  const [val, setVal] = useState("");
  const [hoveredElement, setHoveredElement] = useState(false); // Track hovered element
  const [isFocused, setIsFocused] = useState(false); // Track focus state
  // const [extraGap, setExtraGap] = useState(null);
  const inputRef = useRef(null); // Ref to handle input element for dynamic resizing

  const { activeWidgetId, droppedItems, activeParentId, activeColumn, widgetOrElement, elementDragging} = useSelector((state) => state.cardDragable);

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

    useEffect(() => {
      console.log("Updated widgetOrElement in text:@$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$", widgetOrElement);
    }, [widgetOrElement]);
    
   

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
    console.log("widgetOrElement in text: ");
    console.log("droppedItems: ",droppedItems);
    dispatch(setWidgetOrElement(null));

    setIsFocused(true);
  };

  const onChangeHandle = (e) => {
    const updatedValue = e.target.value;
    console.log("updatedValue: ",updatedValue);
    setVal(updatedValue);

    dispatch(
      updateElementContent({
        id, 
        parentId, 
        column, 
        content: updatedValue
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
    console.log("onDragStart called in Text: #####################################");
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

    // ✅ Create Drag Preview (But Don't Append to Body)
    const dragPreview = document.createElement("div");
    dragPreview.style.fontSize = "16px";
    dragPreview.style.fontWeight = "bold";
    dragPreview.style.color = "#1d4ed8";
    dragPreview.style.lineHeight = "1";
    dragPreview.style.whiteSpace = "nowrap";
    dragPreview.style.padding = "6px 10px"; // Padding for better visibility
    dragPreview.style.borderRadius = "6px"; // Rounded corners
    dragPreview.style.background = "rgba(255, 255, 255, 0.9)"; // Background color with opacity
    dragPreview.style.border = "1px solid #1d4ed8"; // Border styling
    dragPreview.style.boxShadow = "0 4px 6px rgba(0,0,0,0.1)"; // Soft shadow effect
    dragPreview.style.position = "absolute";
    dragPreview.style.top = "0px"; 
    dragPreview.style.left = "0px"; 
    dragPreview.innerText = 'Heading'


    document.body.appendChild(dragPreview); // Temporarily add (required for setDragImage)
    e.dataTransfer.setDragImage(dragPreview, dragPreview.offsetWidth / 2, dragPreview.offsetHeight / 2);
    dispatch(setElementDragging(true));

    setTimeout(() => {
        document.body.removeChild(dragPreview); // Remove preview from DOM after drag starts
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

  //   // for changing position from the ui
  //   const draggedName = e.dataTransfer.getData("text/plain");
  //   console.log("droppedData from the ui: ", draggedName);
  //   const restrictedWidgets = ["Text", "TextArea", "Button", "Image", "Divider", "Space", "SocialMedia"];
  //   if (restrictedWidgets.includes(draggedName)) {
  //     alert("Please drop it in an black space.");
  //     return;
  //   }

  //   // for droped widgets from left panel
  //   const droppedData = JSON.parse(e.dataTransfer.getData("text/plain"));
  //   console.log("droppedData: ", droppedData);
  //   console.log("parentId in text: ",parentId);
  //   console.log("droppedData.parentId in text: ",droppedData.parentId);

  //   console.log("column in text: ",column);
  //   console.log("droppedData.column in text: ",droppedData.column)

  //   // setExtraGap(null);
  //   console.log("parentName in text: ",parentName);

  //   if(widgetOrElement && widgetOrElement === "element"){
  //     console.log("IF PART CALLED");
                  
  //     if(parentId === droppedData.parentId && column===droppedData.column){
  //       // customCollumns as parent is same.
  //       console.log("parentName: ",parentName);
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
  //       else if(parentName==='widgetSection'){
  //         console.log("parentName === widgetSection");
  //         dispatch(
  //           replaceDroppedItemInWS({
  //             parentId: parentId || null,
  //             column: column || null,
  //             draggedNodeId: droppedData.id,
  //             targetNodeId: id,
  //           }) 
  //         );
  //       }
  //       else{
  //         // 1-column, or 2-columns or 3-columns is same as parent
  //         console.log("parentName === normal section")
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
  //       // dragable parent not same, but current parent is "customClumns"
  //       if(parentName === 'customColumns'){
  //           console.log("dragable parent not same, but current parent is customClumns");
  //           dispatch(
  //             addElementAtLocationInCC({
  //               draggedNodeId: Date.now(), 
  //               draggedName: droppedData.name, 
  //               dragableType: droppedData.type,
  //               styles: droppedData.styles, 
  //               content: droppedData.content, 
                
  //               targetParentId: parentId, 
  //               targetColumn: column, 
  //               targetNodeId: id, 
  //             })
  //           )
      
  //           dispatch(deleteDroppedItemById(
  //             {
  //               parentId: droppedData.parentId ? droppedData.parentId : droppedData.id, 
  //               childId: droppedData.parentId ?  droppedData.id : null, 
  //               columnName: droppedData.column ? droppedData.column : null}
  //           ));
  //       }
  //       else if(parentName === 'widgetSection'){
  //         console.log("dragable parent not same, but current parent is widgetSection");
  //         dispatch(
  //           addElementAtLocationInWS({
  //             draggedNodeId: Date.now(), 
  //             draggedName: droppedData.name, 
  //             dragableType: droppedData.type,
  //             styles: droppedData.styles, 
  //             content: droppedData.content, 
              
  //             targetParentId: parentId, 
  //             targetColumn: column, 
  //             targetNodeId: id, 
  //           })
  //         )
    
  //         dispatch(deleteDroppedItemById(
  //           {
  //             parentId: droppedData.parentId ? droppedData.parentId : droppedData.id, 
  //             childId: droppedData.parentId ?  droppedData.id : null, 
  //             columnName: droppedData.column ? droppedData.column : null}
  //         ));
  //       }
  //       // dragable parent not same, but parent is "1-column or 2-columns or 3-columns"
  //       else{
  //         console.log("IF PART CALLED 3");
  //         console.log("dragable parent not same, but parent is: 1-column or 2-columns or 3-columns")
  //         dispatch(
  //           addElementAtLocation({
  //             draggedNodeId: Date.now(), 
  //             draggedName: droppedData.name, 
  //             dragableType: droppedData.type,
  //             styles: droppedData.styles, 
  //             content: droppedData.content, 
              
  //             targetParentId: parentId, 
  //             targetColumn: column, 
  //             targetNodeId: id, 
  //           })
  //         )

  //         dispatch(deleteDroppedItemById(
  //           {
  //             parentId: droppedData.parentId ? droppedData.parentId: droppedData.id, 
  //             childId: droppedData.parentId ? droppedData.id : null, 
  //             columnName: droppedData.column ? droppedData.column : null }
  //         ));

  //       }
  //     }

  //   }
  //   // columns droping on element
  //   else if(droppedData.dragableName && droppedData.dragableName === 'dragableColumn'){
  //     // nothing to do
  //   }
  //   else{
  //     // for droped widgets from left panel
  //       console.log("parentName: ",parentName);
  //       if(parentName==='widgetSection'){
  //         dispatch(
  //           addElementAtLocationInWS({
  //             draggedNodeId: Date.now(), 
  //             draggedName: droppedData.name, 
  //             dragableType: droppedData.type,
  //             styles: droppedData.styles, 
  //             content: droppedData.content, 
              
  //             targetParentId: parentId, 
  //             targetColumn: column, 
  //             targetNodeId: id, 
  //           })
  //         )
  //       }
  //       else if(parentName==='customColumns'){
  //         dispatch(
  //           addElementAtLocationInCC({
  //             draggedNodeId: Date.now(), 
  //             draggedName: droppedData.name, 
  //             dragableType: droppedData.type,
  //             styles: droppedData.styles, 
  //             content: droppedData.content, 
              
  //             targetParentId: parentId, 
  //             targetColumn: column, 
  //             targetNodeId: id, 
  //           })
  //         )
  //       }
  //       else{
  //         dispatch(
  //           addElementAtLocation({
  //             draggedNodeId: Date.now(), 
  //             draggedName: droppedData.name, 
  //             dragableType: droppedData.type,
              
  //             targetParentId: parentId, 
  //             targetColumn: column, 
  //             targetNodeId: id, 
  //           })
  //         )
  //       }
      
  //   }

  //   // initialize the application
  //   dispatch(setActiveWidgetId(null));
  //   dispatch(setActiveParentId(null));
  //   dispatch(setActiveColumn(null));

  //   dispatch(setColumnOneExtraPadding(false));
  //   dispatch(setColumnTwoExtraPadding(false));
  //   dispatch(setColumnThreeExtraPadding(false));
  //   dispatch(setWrapperExtraPadding(false));

  //   dispatch(setHoverParentInCC(null));
  //   dispatch(setHoverColumnInCC(null));
  //   dispatch(setPaddingTopInCC(null));
  //   dispatch(setPaddingBottom(null));

  // };
  
  //******************************************************************************** smooth extra gap b/w elements during replacing*/ 

  // const onDragEnterHandle = () => {
  //   console.log("onDragEnterHandle called in Text");
  
  //   // Add padding if not already active
  //   if (!extraGap) {
  //     setExtraGap(true);
  //   }
  // };
  
  // const onDragOver = (e) => {
  //   e.preventDefault(); // Prevent default to allow dropping
  //   console.log("onDragOver called in Text");
  
  //   // Ensure padding is added immediately when dragging over
  //   if (!extraGap) {
  //     setExtraGap(true);
  //   }
  // };
  
  // const onDragLeaveHandle = () => {
  //   console.log("onDragLeaveHandle called in Text");
  
  //   // Remove padding when dragging out
  //   setExtraGap(null);
  // };

  // **********************************************************************************
  
  const handleRightClick = () =>{
    dispatch(setActiveWidgetId(id));
    dispatch(setActiveParentId(parentId));
    dispatch(setActiveColumn(column));

    setIsFocused(true);
  }


  return (
    <div
      style={{ position: "relative" }}
      className={`group bg-transparent pt-0.5 pb-0.5
        ${!elementDragging && isFocused ? "border-2 border-blue-500 bg-gray-100" : ""}
        ${!elementDragging && activeWidgetId === id ? "border-2 border-blue-500" : ""}
        ${!elementDragging && hoveredElement ? "border border-blue-500" : ""}
                        
      `}
                        

      onMouseEnter={onMouseEnterHandler}
      onMouseLeave={onMouseLeaveHandler}
      
      // onDrop={onDrop}
      // onDragOver={onDragOver}
      // onDragEnter={onDragEnterHandle}
      // onDragLeave={onDragLeaveHandle}

    >

      {/* Add this div for border only on extra padding */}
      {/* {extraGap && (
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
      )} */}

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
            console.log("onDragEnd called in Text: ###############################################################")
            dispatch(setSmallGapInTop(null));
            // setExtraGap(null);

            dispatch(setHoverParentInCC(null));
            dispatch(setHoverColumnInCC(null));
            dispatch(setPaddingTopInCC(null));
            dispatch(setPaddingBottom(null));
            dispatch(setWidgetOrElement(null));
            dispatch(setElementDragging(null));
          }}
        >
          <PiDotsSixBold size={12} className="text-black" />
        </div>
        )}



      {/* Input Field */}
      <div className="">
      <input
        onContextMenu={handleRightClick}
        ref={inputRef}
        onClick={onClickHandle}
        onChange={onChangeHandle}
        type="text"
        className={`p-2 w-full transition-all duration-300 focus:outline-none focus:ring-0 bg-transparent`}
        placeholder="Text Field"
        value={val}
        style={{
          ...currentStyles,
          overflow: "hidden",
          resize: "none",
          whiteSpace: "pre-wrap",
          pointerEvents: ["element", "widget", "column"].includes(widgetOrElement) ? "none" : "auto",
          // ...(extraGap 
          //   ? { 
          //       // paddingTop: "50px", 
          //       // backgroundColor: "rgba(173, 216, 230, 0.5)", // Subtle highlight
          //       // position: "relative",

          //       overflow: "hidden",
          //       resize: "none",
          //       whiteSpace: "pre-wrap",
          //       paddingTop: currentStyles.paddingTop, // Input remains normal
          //       position: "relative",
          //       zIndex: 2, // Keeps input above the extra padding div
          //       marginTop: extraGap ? "40px" : "0px", // ✅ Shift input down
          //     } 
          //   : { 
          //       paddingTop: currentStyles.paddingTop 
          //     }
          // )

        }} // Apply dynamic styles
      />
      </div>
      
    </div>
  );
};

export default Text;

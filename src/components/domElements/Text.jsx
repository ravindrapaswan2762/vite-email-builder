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

import { addElementAtLocation } from "../../redux/cardDragableSlice";
import { setWidgetOrElement } from "../../redux/cardDragableSlice";
import { setSmallGapInTop } from "../../redux/condtionalCssSlice";


const Text = ({ id, parentId, column}) => {
  const [val, setVal] = useState("");
  const [hoveredElement, setHoveredElement] = useState(false); // Track hovered element
  const [isFocused, setIsFocused] = useState(false); // Track focus state
  const [extraGap, setExtraGap] = useState(null);
  const inputRef = useRef(null); // Ref to handle input element for dynamic resizing

  const { activeWidgetId, droppedItems, activeParentId, activeColumn, widgetOrElement} = useSelector((state) => state.cardDragable);

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
  // console.log("text currentStyles: ",currentStyles);

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
    e.preventDefault();

    // console.log(
    //   `[parentId=${parentId}, column=${column}, nodeId=${id}]`
    // );

    dispatch(setActiveWidgetName("Text"));
    dispatch(setActiveEditor("Text"));
    dispatch(setActiveWidgetId(id));

    setIsFocused(true);
    console.log("dropedItems: ",droppedItems);
    console.log("currentStyles in text:::: ",currentStyles);
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
    console.log("droppedData from left panel: ", droppedData);

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

    // initialize the application
    dispatch(setActiveWidgetId(null));
    dispatch(setActiveParentId(null));
    dispatch(setActiveColumn(null));

    dispatch(setColumnOneExtraPadding(false));
    dispatch(setColumnTwoExtraPadding(false));
    dispatch(setColumnThreeExtraPadding(false));
    dispatch(setWrapperExtraPadding(false));

  };
  
  const onDragOver = (e) => {
    console.log("onDragOver called in Text");
    e.preventDefault(); // Allow dropping
  };
  //******************************************************************************** smooth extra gap b/w elements during replacing*/ 

  const onDragEnterHandle = () => {
    console.log("onDragEnterHandle called in text");
    setExtraGap(true);
  }
  const onDragLeaveHandle = () => {
    setExtraGap(null);
  }

  // **********************************************************************************


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
        ${(activeWidgetId==id) ? "border-2 border-blue-500" : ""}
                        
      `}
                        

      onMouseEnter={onMouseEnterHandler}
      onMouseLeave={onMouseLeaveHandler}


      draggable
      onDragStart={onDragStart}
      onDrop={onDrop}
      onDragOver={onDragOver}

      onDragEnter={onDragEnterHandle}
      onDragLeave={onDragLeaveHandle}
      onDragEnd={()=>{
        dispatch(setSmallGapInTop(null));
      }}

    >


      {/* Drag Icon */}
      {(activeWidgetId==id) ? (
        <AiOutlineDrag
          style={{
            position: "absolute",
            left: "-10px",
            top: "50%",
            transform: "translateY(-50%)",
            cursor: "grab",
            zIndex: 10,
            backgroundColor: "white",
            borderRadius: "50%",
          }}
          // className="bg-gray-100"
        />
      ) : ""}

      {/* Input Field */}
      <input
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

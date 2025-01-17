import React, { useState, useEffect, useRef } from "react";
import { setActiveWidgetName } from "../../redux/cardDragableSlice";
import { setActiveEditor } from "../../redux/cardToggleSlice";
import { useDispatch, useSelector } from "react-redux";
import {setActiveBorders} from '../../redux/activeBorderSlice'
import { setActiveNodeList } from "../../redux/treeViewSlice";

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


const Divider = ({ id }) => {
  const [hoveredElement, setHoveredElement] = useState(false); // Track hovered element
  const [isFocused, setIsFocused] = useState(false); // Track focus state
  const dividerRef = useRef(null); // Ref to handle divider element

  const { activeWidgetId, droppedItems, activeParentId, activeColumn} = useSelector((state) => state.cardDragable);
  const {activeNodeList} = useSelector((state) => state.treeViewSlice);

  const dispatch = useDispatch();

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

  const onClickHandle = (e) => {
    e.preventDefault();
    dispatch(setActiveWidgetName("Divider"));
    dispatch(setActiveEditor("Divider"));
    dispatch(setActiveWidgetId(id));
    setIsFocused(true); // Set focus state

    dispatch(setActiveBorders(true));
  };

  const onMouseEnterHandler = () => setHoveredElement(true);
  const onMouseLeaveHandler = () => setHoveredElement(false);


  // ************************************************************************ 
    const onClickOutside = () => {
      dispatch(setActiveNodeList(false));
    };
    useEffect(() => {
      const handleClickOutside = (event) => {
        if (dividerRef.current && !dividerRef.current.contains(event.target)) {
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
            parentId: activeParentId || null,
            column: activeColumn || null,
          })
        );

        dispatch(setColumnOneExtraPadding(false));
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

        dispatch(
          updateElementStyles({
            id,
            styles: {paddingTop: "", background: "trasparent", border: "none"},
            ...(activeParentId && { parentId: activeParentId }),
            ...(activeColumn && { column: activeColumn }),
          })
        );
        
        dispatch(
          replaceDroppedItem({
            parentId: activeParentId || null,
            column: activeColumn || null,
            draggedNodeId: droppedData.id,
            targetNodeId: id,
          })
        );

        // initialize the application after exchage the position
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
      //******************************************************************************** */ 
      const onDragEnterHandle = () => {
        
        // dispatch(setTextExtraPadding(true));
        dispatch(setActiveWidgetId(id));
    
        dispatch(setActiveBorders(null));
        dispatch(setActiveNodeList(null));
        setHoveredElement(false);
    
        dispatch(
              updateElementStyles({
                id,
                styles: { paddingTop: "150px", background: "transparent" },
                ...(activeParentId && { parentId: activeParentId }),
                ...(activeColumn && { column: activeColumn }),
              })
            );
      }
    
      const onDragLeaveHandle = () => {
    
        // dispatch(setTextExtraPadding(false));
      
        // borders
        dispatch(setActiveBorders(null));
        dispatch(setActiveNodeList(null));
        setHoveredElement(false);
    
        dispatch(
          updateElementStyles({
            id,
            styles: {paddingTop: "", background: "trasparent", border: "none"},
            ...(activeParentId && { parentId: activeParentId }),
            ...(activeColumn && { column: activeColumn }),
          })
        );
    
      }
    // ****************************************************************************************

  return (
    <div
      style={{ position: "relative" }}
      className={`group 
        ${hoveredElement ? "hover:border hover:border-dashed hover:border-blue-500" : ""}
        ${(activeWidgetId==id && activeNodeList) ? "border-2 border-blue-500" : ""}
        `}
      onMouseEnter={onMouseEnterHandler}
      onMouseLeave={onMouseLeaveHandler}
      onClick={onClickHandle}

      draggable
      onDragStart={onDragStart}
      onDrop={onDrop}
      onDragOver={onDragOver}

      onDragEnter={onDragEnterHandle}
      onDragLeave={onDragLeaveHandle}
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

      {/* Divider Element */}
      <hr
        ref={dividerRef}
        style={{
          ...currentStyles,
        }}
        className="w-full"
      />
    </div>
  );
};

export default Divider;

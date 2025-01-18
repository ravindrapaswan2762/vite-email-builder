import React, { useState, useEffect, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { RxCross2 } from "react-icons/rx";
import { setActiveEditor } from "../../redux/cardToggleSlice";
import { setActiveWidgetName } from "../../redux/cardDragableSlice";
import { updateElementContent, updateElementStyles } from "../../redux/cardDragableSlice";
import { setActiveNodeList } from "../../redux/treeViewSlice";

import { AiOutlineDrag } from "react-icons/ai";
import { replaceDroppedItem } from "../../redux/cardDragableSlice";

import { setActiveWidgetId } from "../../redux/cardDragableSlice";
import { setActiveParentId } from "../../redux/cardDragableSlice";
import { setActiveColumn } from "../../redux/cardDragableSlice";
import { setView } from "../../redux/navbarSlice";



import { setColumnOneExtraPadding } from "../../redux/condtionalCssSlice";
import { setColumnTwoExtraPadding } from "../../redux/condtionalCssSlice";
import { setColumnThreeExtraPadding } from "../../redux/condtionalCssSlice";
import { setWrapperExtraPadding } from "../../redux/condtionalCssSlice";



const TextArea = ({ id }) => {
  const [val, setVal] = useState("");
  const [hoveredElement, setHoveredElement] = useState(false); // Hover state
  const [isFocused, setIsFocused] = useState(false); // Focus state
  const textAreaRef = useRef(null); // Ref for detecting clicks outside

  const { activeWidgetId, droppedItems, activeParentId, activeColumn} = useSelector((state) => state.cardDragable);
  const {activeNodeList} = useSelector((state) => state.treeViewSlice);
  const {view} = useSelector( (state) => state.navbar );
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
    // e.stopPropagation();
    e.preventDefault();
    dispatch(setActiveWidgetName("TextArea"));
    dispatch(setActiveEditor("TextArea"));
    dispatch(setActiveWidgetId(id));

    setIsFocused(true); // Set focus state
    dispatch(setActiveNodeList(true));
    
    console.log("droppedItems: ",droppedItems);
  };

  const onMouseEnterHandler = () => setHoveredElement(true);
  const onMouseLeaveHandler = () => setHoveredElement(false);

  const handleClickOutside = (e) => {
    if (textAreaRef.current && !textAreaRef.current.contains(e.target)) {
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

  useEffect(() => {
    if (textAreaRef.current) {
      autoResize(textAreaRef.current); // Recalculate height on mode switch
    }
  }, [view]); // Triggers when the `view` (mobile or desktop) changes
  

  const autoResize = (textarea) => {
    // Reset height to auto to recalculate based on content
    textarea.style.height = "auto";
  
    // Calculate the new height based on scrollHeight
    const contentHeight = textarea.scrollHeight;
  
    // Set the new height to match content height
    textarea.style.height = `${contentHeight}px`;
  
    console.log("Updated textarea height:", contentHeight);
  
    // Dispatch height update to Redux
    dispatch(
      updateElementStyles({
        id,
        styles: { height: `${contentHeight}px` },
        ...(activeParentId && { parentId: activeParentId }),
        ...(activeColumn && { column: activeColumn }),
      })
    );
  };
  

  // ************************************************************************ 
    const onClickOutside = () => {
      dispatch(setActiveNodeList(false));
    };
    useEffect(() => {
      const handleClickOutside = (event) => {
        if (textAreaRef.current && !textAreaRef.current.contains(event.target)) {
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
        console.log("droppedData in textarea: ", droppedData);

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
        e.preventDefault(); // Allow dropping
      };
      //******************************************************************************** */ 
      const onDragEnterHandle = () => {
          
          dispatch(setActiveWidgetId(id));
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
      className={`group flex 
        ${
          isFocused
            ? "border-2 border-blue-500 bg-gray-100"
            : hoveredElement
            ? "border-dashed border border-blue-500"
            : ""
          } 
          ${(activeWidgetId==id && activeNodeList) ? "border-2 border-blue-500" : ""}
      `}
      onMouseEnter={onMouseEnterHandler}
      onMouseLeave={onMouseLeaveHandler}
      ref={textAreaRef} // Add the ref to the parent div to detect clicks outside

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


      {/* Text Area */}
      <textarea
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
        }} // Apply dynamic styles
      />
    </div>
  );
};

export default TextArea;

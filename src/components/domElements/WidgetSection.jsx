import React, { useState, useEffect, useRef } from "react";
import Text from "./Text";
import Image from "./Image";
import Button from "./Button";
import TextArea from "./TextArea";
import Divider from "./Divider";
import SocialMedia from "./SocialMedia";
import Space from "./Space";

import { useSelector, useDispatch } from "react-redux";
import { PiDotsSixVerticalBold } from "react-icons/pi";
import { setActiveParentId, updateColumnWidth } from "../../redux/cardDragableSlice";
import { setActiveWidgetId } from "../../redux/cardDragableSlice";
import { deleteDroppedItemById } from "../../redux/cardDragableSlice";
import { duplicateCustomColumn } from "../../redux/cardDragableSlice";
import { setSmallGapInTop } from "../../redux/condtionalCssSlice";
import { setWidgetOrElement } from "../../redux/cardDragableSlice";
import { setActiveRightClick } from "../../redux/cardDragableSlice";
import { setActiveColumn } from "../../redux/cardDragableSlice";
import { setActiveBorders } from "../../redux/activeBorderSlice";

import { PiDotsSixBold } from "react-icons/pi";
import { FiEdit } from "react-icons/fi";
import { RxCross2 } from "react-icons/rx";

import { deleteCustomColumn } from "../../redux/cardDragableSlice";
import { setElementPaddingTop } from "../../redux/condtionalCssSlice";
import { replaceDroppedItem } from "../../redux/cardDragableSlice";
import { setPaddingBottom } from "../../redux/condtionalCssSlice";
import { setActiveEditor } from "../../redux/cardToggleSlice";

import { setHoverColumnInCC } from "../../redux/condtionalCssSlice";
import { setHoverParentInCC } from "../../redux/condtionalCssSlice";
import { setPaddingTopInCC } from "../../redux/condtionalCssSlice";
import { addElementWithSection_AtSpecificLocation } from "../../redux/cardDragableSlice";
import { insertElementAtDropIndexInCC } from "../../redux/cardDragableSlice";
import { setElementDragging } from "../../redux/cardDragableSlice";
import { FiCopy, FiTrash2 } from "react-icons/fi"; // Modern icons

// Component Mapping
const componentMap = {
  Text: (props) => <Text {...props} />,
  Image: (props) => <Image {...props} />,
  Button: (props) => <Button {...props} />,
  TextArea: (props) => <TextArea {...props} />,
  Divider: (props) => <Divider {...props} />,
  SocialMedia: (props) => <SocialMedia {...props} />,
  Space: (props) => <Space {...props} />,
};


const WidgetSection = ({ id }) => {

  const [resizingIndex, setResizingIndex] = useState(null);
  const [localColumns, setLocalColumns] = useState([]);
  const [showWidthPercentage, setShowWidthPercentage] = useState(false);
  const [popup, setPopup] = useState({ visible: false, x: 0, y: 0, columnId: null, childId: null});
  const [hoverColumn, setHoverColumn] = useState({parentId: null, column: null});

  const [localPaddingTopInCC, setLocalPaddingTopInCC] = useState(false);

  const dispatch = useDispatch();
  const customColumnRef = useRef(null);
  const columnRef = useRef();

  // Fetch the custom column data from Redux state
  const { 
    droppedItems, 
    activeWidgetId, 
    activeWidgetName, 
    activeRightClick, 
    activeParentId, 
    activeColumn, 
    widgetOrElement,
   } = useSelector((state) => state.cardDragable);
   
  const {smallGapInTop, paddingTopInCC, paddingBottomInCC, hoverParentInCC, hoverColumnInCC} = useSelector((state) => state.coditionalCssSlice);
  const {view} = useSelector( (state) => state.navbar );
  const columnData = droppedItems.find((item) => item.id === id);

  if (!columnData || columnData.columnCount < 1) {
    return <div>No columns to display</div>;
  }

  // ******************************************************************************************

  const [dropIndex, setDropIndex] = useState(null);
    const [dropPosition, setDropPosition] = useState(null);
    
    const handleDragStart = () =>{
      setHoverColumn({parentId: hoverColumn.parentId, column: hoverColumn.column, isDragging: true});
      console.log("handleDragStart called: ", hoverColumn);
    }
    const handleDragEnd = () => {
      setHoverColumn({parentId: hoverColumn.parentId, column: hoverColumn.column, isDragging: false});
      setDropIndex(null);
      setDropPosition(null);
      console.log("handleDragStart called: ", hoverColumn);
    };
    
    const handleDragOver = (e, targetId, index) => {
      e.preventDefault();
  
      const targetElement = document.getElementById(`element-${targetId}`);
      if (targetElement) {
        const { top, height } = targetElement.getBoundingClientRect();
        const cursorY = e.clientY;
        const edgeThreshold = height * 0.2; // Top 20%, bottom 20%
    
        if (cursorY < top + edgeThreshold) {
          setDropIndex(index); // Stay at current index for top
          setDropPosition("above");
          console.log("setDropIndex(index) above: ",index);
        } else if (cursorY > top + height - edgeThreshold) {
          setDropIndex(index + 1); // Move to next index for bottom
          setDropPosition("below");
          console.log("setDropIndex(index) below: ",index+1);
        }
      }
    };
    
  
    const handleDragLeave = (e, ref) => {
      e.preventDefault();
      if (ref.current && !ref.current.contains(e.relatedTarget)) {
        setHoverColumn({parentId: null, column: null, isDragging: null});
        setDropIndex(null);
        setDropPosition(null);
      }
    };
  
    const handleDragEnter  = (e, column) =>{
      e.stopPropagation();
      console.log("handleDragEnter called: ",column);
    
      if (hoverColumn.column !== column){
        setHoverColumn({ parentId: id, column: column, isDragging: true }); 
    
        dispatch(setActiveBorders(true));
        setDropIndex(null);
        setDropPosition(null);
        
        dispatch(setHoverParentInCC(id));
        dispatch(setHoverColumnInCC(column));
      }
    
    }
      
  

  // ******************************************************************************************

  useEffect(() => {
    setLocalPaddingTopInCC(paddingTopInCC); // Sync local state with Redux on mount
  }, [paddingTopInCC]);

  useEffect( ()=>{
    dispatch(setActiveWidgetId(id));
  }, [])

  useEffect(() => {
    dispatch(setHoverColumnInCC(null));
    dispatch(setHoverParentInCC(null));
  }, [droppedItems]);

  const handleResizeMouseDown = (index, column) => (e) => {
    e.preventDefault();
    setResizingIndex(index);
    setShowWidthPercentage(true);

    dispatch(setActiveWidgetId(id));
    dispatch(setActiveParentId(null));

    dispatch(setActiveColumn(column));
  };

  const handleResizeMouseMove = (e) => {
    if (resizingIndex === null) return;
  
    const containerWidth = customColumnRef.current.offsetWidth;
    const deltaX = e.movementX; // Mouse movement in pixels
  
    setLocalColumns((prevColumns) => {
      const newColumns = [...prevColumns];
      const leftColumn = newColumns[resizingIndex].data.styles;
      const rightColumn = newColumns[resizingIndex + 1].data.styles;
  
      let newLeftWidth = parseFloat(leftColumn.width) + (deltaX / containerWidth) * 100;
      let newRightWidth = parseFloat(rightColumn.width) - (deltaX / containerWidth) * 100;
  
      // Enforce minimum width to prevent collapse
      if (newLeftWidth < 5) {
        newRightWidth += newLeftWidth - 5;
        newLeftWidth = 5;
      } else if (newRightWidth < 5) {
        newLeftWidth += newRightWidth - 5;
        newRightWidth = 5;
      }
  
      // Apply smooth transition styles
      leftColumn.width = `${newLeftWidth.toFixed(2)}%`;
      rightColumn.width = `${newRightWidth.toFixed(2)}%`;
  
      return newColumns;
    });
  };

  const handleResizeMouseUp = () => {
    if (resizingIndex === null) return;
  
    setResizingIndex(null);
    setShowWidthPercentage(false);
  
    // Get the updated column widths from local state
    const updatedColumns = [...localColumns];
    const leftColumnKey = updatedColumns[resizingIndex].key;
    const rightColumnKey = updatedColumns[resizingIndex + 1].key;
  
    const leftColumnWidth = parseFloat(updatedColumns[resizingIndex].data.styles.width);
    const rightColumnWidth = parseFloat(updatedColumns[resizingIndex + 1].data.styles.width);
  
    // Dispatch updated widths to Redux with a slight delay for smoother UX
    setTimeout(() => {
      dispatch(updateColumnWidth({ parentId: id, columnKey: leftColumnKey, width: leftColumnWidth }));
      dispatch(updateColumnWidth({ parentId: id, columnKey: rightColumnKey, width: rightColumnWidth }));
    }, 100);
  };

  
  useEffect(() => {
    if (resizingIndex !== null) {
      document.addEventListener("mousemove", handleResizeMouseMove);
      document.addEventListener("mouseup", handleResizeMouseUp);
    }
    return () => {
      document.removeEventListener("mousemove", handleResizeMouseMove);
      document.removeEventListener("mouseup", handleResizeMouseUp);
    };
  }, [resizingIndex]);

  useEffect(() => {
    if (columnData) {
      const updatedColumns = Object.keys(columnData)
        .filter((key) => key.startsWith("children"))
        .map((key) => ({
          key,
          data: { ...columnData[key][0], styles: { ...columnData[key][0].styles } },
        }));
      setLocalColumns(updatedColumns);
    }
  }, [columnData]);



  useEffect(() => {
    // Click outside listener
    const handleClickOutside = (e) => {
      if (
        customColumnRef.current &&
        !customColumnRef.current.contains(e.target) &&
        !customColumnRef.current.contains(e.target)
      ) {
        setPopup({ visible: false, x: 0, y: 0, columnKey: null });
      }
    };
  
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);
  

  //********************************************************************************************************************* */ 
  
  const handleRightClick = (e, columnKey, childId = null) => {
    e.preventDefault();
  
    console.log("Right-click detected: ", { columnKey, childId,  });
  
    const containerRect = customColumnRef.current.getBoundingClientRect();
    const popupWidth = 150;
    const popupHeight = 100;
    const viewportWidth = window.innerWidth;
    const viewportHeight = window.innerHeight;
  
    let popupX = e.clientX - containerRect.left;
    let popupY = e.clientY - containerRect.top;
  
    if (e.clientX + popupWidth > viewportWidth) {
      popupX -= popupWidth;
    }
  
    if (e.clientY + popupHeight > viewportHeight) {
      popupY -= popupHeight;
    }
  
    // ✅ Store the childId only if provided (right-click on element)
    setPopup({ visible: true, x: popupX, y: popupY, columnKey, childId: childId || null });
  
    dispatch(setActiveRightClick(true));
    dispatch(setActiveWidgetId(childId));
    dispatch(setActiveParentId(id));
    dispatch(setActiveColumn(columnKey));
    dispatch(setHoverColumnInCC(true));
  };
  

  
  const onclickHandler = (e)=>{
    e.stopPropagation();
    dispatch(setActiveParentId(null));
    dispatch(setActiveRightClick(true));
    dispatch(setActiveWidgetId(id));
    dispatch(setActiveColumn(null));
    dispatch(setActiveEditor("sectionEditor"));

    // console.log("onclickHandler called in custom-COLUMNS: ",id)
  }

  const onDragStart = (e) => {
    e.stopPropagation();
    e.dataTransfer.setData(
      "text/plain",
      JSON.stringify({
        id,
        name: "widgetSection",
        dragableName: "dragableColumn"
      })
    );
    e.dataTransfer.effectAllowed = "move";
    
    // *******************************************
    const dragPreview = document.createElement("div");
    dragPreview.style.width = `${customColumnRef.current.offsetWidth}px`;
    dragPreview.style.height = `${customColumnRef.current.offsetHeight}px`;
    dragPreview.style.backgroundColor = currentStyles.backgroundColor || "#e0e0e0";
    dragPreview.style.border = "2px solid #1d4ed8"; // Same as active border color
    dragPreview.style.borderRadius = currentStyles.borderRadius || "4px";
    dragPreview.style.opacity = "0.8"; // Slightly translucent
    dragPreview.style.boxShadow = "0 4px 6px rgba(0,0,0,0.1)";
    dragPreview.style.display = "flex";
    dragPreview.style.alignItems = "center";
    dragPreview.style.justifyContent = "center";
    dragPreview.style.color = "#1d4ed8";
    dragPreview.style.fontSize = "16px";
    dragPreview.style.fontWeight = "bold";
    dragPreview.innerText = "custom-columns"; // Optional: Add text

    document.body.appendChild(dragPreview);

    // Set the custom drag image
    e.dataTransfer.setDragImage(dragPreview, dragPreview.offsetWidth / 2, dragPreview.offsetHeight / 2);

    // Cleanup after drag starts
    setTimeout(() => {
      document.body.removeChild(dragPreview);
    }, 0);
  // ******************************************

    dispatch(setWidgetOrElement("column"));
    dispatch(setSmallGapInTop(true));
    
  };
  // ***********************************************************************
  const findStylesById = (items, widgetId) => {
    for (const item of items) {
      // Check if the current item's ID matches the widgetId
      if (item.id === widgetId) {
        return item.styles || {};
      }
  
      // Dynamically check for nested children keys (e.g., childrenA, childrenB)
      const nestedKeys = Object.keys(item).filter((key) => key.startsWith("children"));
      for (const key of nestedKeys) {
        const styles = findStylesById(item[key], widgetId); // Recursively search in the children
        if (styles) {
          return styles;
        }
      }
    }
  
    return null; // Return null if no matching widgetId is found
  };
  const currentStyles = findStylesById(droppedItems, activeWidgetId) || {};
  console.log("currentStyles in widgetSection: ",currentStyles);

  // ****************************************************************************

  const handlePopupDelete = (childId) => {
    if (!popup.columnKey) return;

    dispatch(
      deleteCustomColumn({
        parentId: id,
        columnKey: popup.columnKey,
        elementId: childId || null,  // ✅ Pass childId only if available
      })
    );
  
    setPopup({ visible: false, x: 0, y: 0, columnKey: null, childId: null });
  };

  
  const handlePopupDuplicate = (childId) => {
    if (!popup.columnKey) return;

    console.log("Popup Duplicate: ", popup);
  
    dispatch(
      duplicateCustomColumn({
        parentId: id,
        columnKey: popup.columnKey,
        elementId: childId || null,  // ✅ Pass childId only if available
      })
    );
  
    setPopup({ visible: false, x: 0, y: 0, columnKey: null, childId: null });
  };
  
  

  if (!columnData) {
    return <div>Loading...</div>; // Prevent early return
  }
  
  if (columnData.columnCount < 1) {
    return <div>No columns to display</div>; // Handle empty columns
  }

  
// ***************************************************************************************************** drag and drop funtionality

const handleDrop = (columnKey) => (e) => {
  e.preventDefault();
  e.stopPropagation();

  setHoverColumn({parentId: null, column: null});
  dispatch(setElementDragging(null));
  dispatch(setWidgetOrElement(null));


  // Prefill content and styles based on activeWidgetName
  let content = null;
  let styles = {};
  if (activeWidgetName === 'Text') {
    content = "Lorem Ipsum";
  } else if (activeWidgetName === 'TextArea') {
      content = "Liven up your web layout wireframes and mockups with one of these lorem ipsum generators.";
      styles = {height: "85px"}
  }

  // Safely parse dropped data
  let droppedData = null;
  try {
    droppedData = JSON.parse(e.dataTransfer.getData("text/plain"));
    // console.log("droppedData in columnTwo: ",droppedData);
  } catch (error) {
    console.error("Failed to parse dropped data:", error);
    return;
  }

  if(!['1-column','2-columns', '3-columns'].includes(droppedData?.name)){
        if(widgetOrElement === 'element'){
            dispatch(
              insertElementAtDropIndexInCC({
                id: Date.now(),
                name: droppedData.name,
                type: droppedData.type,
                parentId: id,
                column: columnKey,
                styles: droppedData.styles,
                content: droppedData.content,
                dropIndex: dropIndex,
              })
            );
      
            dispatch(deleteDroppedItemById(
              {
                parentId: droppedData.parentId ? droppedData.parentId : droppedData.id, 
                childId: droppedData.parentId ?  droppedData.id : null, 
                columnName: droppedData.column ? droppedData.column : null}
            ));
        }
        else{
          dispatch(
            insertElementAtDropIndexInCC({
              id: Date.now(),
              name: droppedData.name,
              type: droppedData.type,
              parentId: id,
              column: columnKey,
              styles: droppedData.styles,
              content: droppedData.content,
              dropIndex: dropIndex,
            })
          );
        }
      }
      else if(['1-column', '2-columns', '3-columns'].includes(droppedData?.name)){
        return;
      }

      dispatch(setHoverParentInCC(null));
      dispatch(setHoverColumnInCC(null));
      dispatch(setPaddingTopInCC(null));
      dispatch(setPaddingBottom(null));

  // console.log(`Dropped item into column: ${columnKey}`);
};

const onDragEnter = (e, column) =>{
  e.stopPropagation();

  setHoverColumn({parentId: id, column: column});

  dispatch(setActiveBorders(true));
  
  dispatch(setHoverParentInCC(id));
  dispatch(setHoverColumnInCC(column));


}

const handleLeave = (e, ref, column)=>{
  
  if(ref && ref.current && (!e.relatedTarget || !ref.current.contains(e.relatedTarget))){
    setHoverColumn({parentId: null, column: null});

    dispatch(setHoverParentInCC(id));
    dispatch(setHoverColumnInCC(column));
  }
}

 //******************************************************************************** drop Into PaddingTop */
    const dropInPaddingTop = (e)=>{
      e.stopPropagation();

      const droppedData = JSON.parse(e.dataTransfer.getData("text/plain"));

      if(widgetOrElement && widgetOrElement==='widget'){
        dispatch(
          addElementWithSection_AtSpecificLocation({
            id: Date.now(),
            name: "widgetSection",
            columnCount: 1,
            styles: {},

            childId: Date.now() + Math.floor(Math.random() * 1000),
            childName: droppedData.name,
            childType: droppedData.type,
            childStyle: droppedData.styles,
            childContent: droppedData.content,
            
            targetParentId: null, 
            targetColumn: null, 
            targetNodeId: id, 
          })
        )
      }
      else if(widgetOrElement && (widgetOrElement==='column' || widgetOrElement==='element') ){
        if(droppedData.parentId){
          dispatch(
            addElementWithSection_AtSpecificLocation({
              id: Date.now(),
              name: "widgetSection",
              columnCount: 1,
              styles: {},

              childId: Date.now() + Math.floor(Math.random() * 1000),
              childName: droppedData.name,
              childType: droppedData.type,
              childStyle: droppedData.styles,
              childContent: droppedData.content,
              
              targetParentId: null, 
              targetColumn: null, 
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
        else{
          dispatch(
            replaceDroppedItem({
              parentId: null,
              column: null,
              draggedNodeId: droppedData.id,
              targetNodeId: id,
            }) 
          );
        }
      } //else if widgetOrElement=== 'element' or 'column'

      dispatch(setSmallGapInTop(null));
      dispatch(setHoverColumnInCC(null));
      dispatch(setHoverParentInCC(null));
      dispatch(setPaddingTopInCC(null));
    } //dropInPaddingTop

    const enterInPaddingTop = (e)=>{
      e.stopPropagation();
      setLocalPaddingTopInCC(true); // Step 2: Update local state instantly
      console.log("enterInTop called $$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$");

    }
    const leaveFromPaddingTop = (e)=>{
      e.stopPropagation();
      setLocalPaddingTopInCC(true); // Step 3: Hide immediately
      console.log("leaveFromTop called");
    }
    const dragOverOnPaddingTop = (e) =>{
      e.stopPropagation();
      console.log("dragOverOnTop called");

    }
    
  // *********************************************************************************************

  return (
    <div

      onDragStart={handleDragStart}
      onDragEnd={handleDragEnd}
      onDragOver={handleDragOver} 

      ref={customColumnRef}
      className={`relative group bg-transparent pt-1 pb-1
        ${activeParentId===id || activeWidgetId==id? 'border-2 border-blue-500': ""}
        
      `}
      // ${paddingTopInCC ? "pt-[40px] bg-red-500" : ""}

      
      onClick={(e) => {
        e.stopPropagation();
        setPopup({ visible: false, x: 0, y: 0, columnId: null });
        dispatch(setActiveWidgetId(id));
        dispatch(setActiveEditor("sectionEditor"));
      }}
      style={{
        ...findStylesById(droppedItems, id), 
        ...(activeWidgetId === id ? currentStyles : {}),  // Only update the active element
      }}
    >
      

          {/* Trapezoid Icon Section */}
            {(activeWidgetId === id || activeParentId==id) && (
                      <div
                      className="absolute left-1/2 transform -translate-x-1/2 -translate-y-full bg-blue-400 flex items-center justify-center z-50"
                      style={{
                        top: customColumnRef?.current?.offsetTop || "0px", // ✅ Ensures it's attached to the top red-bordered parent
                        left: "50%",
                        width: "90px",
                        height: "20px",
                        clipPath: "polygon(10% 0%, 90% 0%, 100% 100%, 0% 100%)",
                        borderTopLeftRadius: "8px",
                        borderTopRightRadius: "8px",
                      }}
                      >
                        {/* Icon Container */}
                        <div className="flex items-center justify-between w-full h-full">
                          {/* Add Icon */}
                          <button
                            className="flex items-center justify-center w-full h-full transition duration-200 text-black hover:text-white hover:bg-blue-500"
                            onClick={(e) => {
                              e.stopPropagation();
                              // console.log("Add icon clicked");
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
                              // console.log("id in widgetSection: ",id)
                              dispatch(deleteDroppedItemById(
                                {
                                  parentId: id, 
                                  childId: null, 
                                  columnName: null}
                              ));
                            }}
                          >
                            <RxCross2 size={12} />
                          </button>
                        </div>
                      </div>
            )}


          {/* ******************************************************************************************************************** localColumns */}

          <div className="flex w-full h-full relative gap-2" 
              onClick={onclickHandler}
              style={{...(view === "mobile" ? { padding: "12px", display: "flex", flexDirection: "column" } : {}),}}
              ref={columnRef}
              onDragLeave={(e)=>handleDragLeave(e, columnRef)}
          >


            {localColumns.map((column, index) => (
              <div
                onDragEnter={(e)=>onDragEnter(e, column.key)}
                onDrop={handleDrop(column.key)}
                onDragOver={handleDragOver}
                onClick={onclickHandler}

        
                key={column.data.id}
                className={`relative w-full
                  ${(activeWidgetId==id || activeParentId==id) && activeColumn===column.key   ? "border border-pink-500" : ""}

                  ${hoverColumn.parentId===id && hoverColumn.column===column.key ? "border border-pink-500 bg-blue-100" : ""} 


                  ${localColumns.some(col => col.data.children.length > 0) ? 'h-auto' : 'h-[100px]'}
                  ${column.data.children.length === 0 ? "border border-dashed border-blue-500" : ""}
                  ${paddingBottomInCC ? 'pb-[30px]' : ""}


                `}
                onContextMenu={(e) => {
                  console.log("onContextMenu called for COLUMN");
                  e.stopPropagation();
                  handleRightClick(e, column.key);
                }}
                style={{
                  flexBasis: column.data.styles.width,
                  paddingTop: "10px",    // ✅ Adds padding to make the column itself clickable
                  paddingBottom: "10px",
                }}
                
                
              >
                {/* Render placeholder text if no children */}
                {!column.data.children?.length && (
                  <p className="text-gray-500 text-center">{`${column.key.replace("children", "")}`}</p>
                )}

                {/* Render Dropped Items */}
                {column.data.children?.map((child, index) => (
                  <React.Fragment key={child.id}>

                    {/* 🟣 Drop Zone Above Each Child */}
                    {hoverColumn.column===column.key && dropIndex === index && dropPosition === "above" && (
                      <div
                        className="drop-zone border-2 border-dashed border-blue-500 bg-blue-200 h-8 rounded-md flex justify-center items-center text-blue-700 font-semibold transition-all pointer-events-auto"
                        onDrop={handleDrop}
                      >
                        Drop Here
                      </div>
                    )}


                    <div key={child.id} className={`text-sm bg-transparent`}
                      onContextMenu={(e) => {
                        e.stopPropagation();
                        console.log("onContextMenu called for ELEMENT");
                        handleRightClick(e, column.key, child.id);
                      }}
                      id={`element-${child.id}`}
                      onDragOver={(e) => handleDragOver(e, child.id, index)}
                    >
                      {componentMap[child.name] ? componentMap[child.name]({ id: child.id, parentId: id, column: column.key,  parentName: "widgetSection" }) : <div>Unknown Component</div>}
                    </div>

                    {/* 🔵 Drop Zone Below Each Child */}
                    {hoverColumn.column===column.key && dropIndex === index + 1 && dropPosition === "below" && (
                      <div
                        className="drop-zone border-2 border-dashed border-blue-500 bg-blue-200 h-8 rounded-md flex justify-center items-center text-blue-700 font-semibold transition-all pointer-events-auto"
                        onDrop={handleDrop}
                      >
                        Drop Here
                      </div>
                    )}
                  </React.Fragment>
                ))}

                {showWidthPercentage && (
                  <div className="absolute top-[-20px] left-1/2 transform -translate-x-1/2 text-sm text-gray-700 bg-white px-2 py-1 border rounded shadow z-20">
                    {Math.round(parseFloat(column.data.styles.width))}%
                  </div>
                )}

                {activeWidgetId==id && index < localColumns.length - 1 && (
                  <div
                    className="absolute top-0 right-[-17px] h-full w-6 flex items-center justify-center cursor-col-resize z-10"
                    onMouseDown={handleResizeMouseDown(index, column.key)}
                  >
                    <div
                      className="absolute h-full w-0.5 border-l border-dashed border-gray-400"
                      style={{
                        left: "50%",
                        transform: "translateX(-50%)",
                      }}
                    ></div>

                    <PiDotsSixVerticalBold className="text-black" />
                  </div>
                )}

              </div>
            ))}

          </div>
          
          {/* ***************************************************************************************************************** popup.visible */}
          {popup.visible && (
            <div
              className="absolute z-50 bg-white shadow-xl border border-gray-300 rounded-lg transition-all duration-200 transform scale-95 opacity-0 animate-fadeIn"
              style={{
                top: popup.y,
                left: popup.x,
                minWidth: "160px",
                padding: "8px",
                boxShadow: "0px 4px 12px rgba(0, 0, 0, 0.15)",
              }}
            >
              {/* Popup Actions */}
              <div className="flex flex-col">
                {/* Duplicate Button */}
                <button
                  className="flex items-center gap-3 px-3 py-2 w-full text-left rounded-md hover:bg-gray-100 transition-all duration-200"
                  onClick={(e) => {
                    e.stopPropagation();
                    handlePopupDuplicate(popup.childId);
                  }}
                >
                  <FiCopy className="text-gray-600 text-lg" /> 
                  <span className="text-sm text-gray-700 font-medium">Duplicate</span>
                </button>
        
                {/* Delete Button */}
                <button
                  className="flex items-center gap-3 px-3 py-2 w-full text-left rounded-md hover:bg-red-100 transition-all duration-200"
                  onClick={(e) => {
                    e.stopPropagation();
                    handlePopupDelete(popup.childId);
                  }}
                >
                  <FiTrash2 className="text-red-500 text-lg" />
                  <span className="text-sm text-red-600 font-medium">Delete</span>
                </button>
              </div>
            </div>
          )}

    </div>
  );
};

export default WidgetSection;

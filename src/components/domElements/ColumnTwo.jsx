
import React, { useState, useEffect, useRef } from "react";
import { RxCross2 } from "react-icons/rx";
import Text from "./Text";
import Image from "./Image";
import Button from "./Button";
import TextArea from "./TextArea";
import Divider from "./Divider";
import SocialMedia from "./SocialMedia";
import Space from "./Space";


import { useDispatch, useSelector } from "react-redux";
import { setActiveEditor } from "../../redux/cardToggleSlice";
import {  setDroppedItems, 
          setActiveWidgetName, 
          setActiveWidgetId, 
          deleteDroppedItemById, 
          setActiveParentId, 
          setActiveColumn,
        } from "../../redux/cardDragableSlice";

import { setActiveBorders } from "../../redux/activeBorderSlice";

import { replaceDroppedItem } from "../../redux/cardDragableSlice";
import { setActiveRightClick } from "../../redux/cardDragableSlice";

import { duplicateElementInNormalColumn } from "../../redux/cardDragableSlice";
import { setHoverParentInCC } from "../../redux/condtionalCssSlice";
import { setHoverColumnInCC } from "../../redux/condtionalCssSlice";
import { setPaddingTopInCC } from "../../redux/condtionalCssSlice";
import { addElementWithSection_AtSpecificLocation } from "../../redux/cardDragableSlice";

import { setColumnOneExtraPadding } from "../../redux/condtionalCssSlice";
import { setColumnTwoExtraPadding } from "../../redux/condtionalCssSlice";
import { setColumnThreeExtraPadding } from "../../redux/condtionalCssSlice";
import { setWrapperExtraPadding } from "../../redux/condtionalCssSlice";
import { addElementAtLocation } from "../../redux/cardDragableSlice";
import { setWidgetOrElement } from "../../redux/cardDragableSlice";
import { setSmallGapInTop } from "../../redux/condtionalCssSlice";
import { PiDotsSixBold } from "react-icons/pi";
import { FiEdit } from "react-icons/fi";




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

const ColumnTwo = ({ handleDelete, id }) => {

  const { activeWidgetId, activeWidgetName, droppedItems, activeParentId, activeColumn, widgetOrElement } = useSelector((state) => state.cardDragable);
  const { activeBorders } = useSelector((state) => state.borderSlice);
  const {columnTwoExtraPadding, smallGapInTop} = useSelector((state) => state.coditionalCssSlice);
  const {view} = useSelector( (state) => state.navbar );


  const dispatch = useDispatch();

  const columnARef = useRef(null);
  const columnBRef = useRef(null);
  const twoColumnRef = useRef(null);

  const [childrenA, setChildrenA] = useState([]);
  const [childrenB, setChildrenB] = useState([]);
  const [hoveredChildA, setHoveredChildA] = useState(null); // Track hovered child in Column A
  const [hoveredChildB, setHoveredChildB] = useState(null); // Track hovered child in Column B
  const [paddingTop, setPaddingTop] = useState(null);
  const [dragState, setDragState] = useState({ isDragging: false, column: null });
  const [popup, setPopup] = useState({ visible: false, x: 0, y: 0, columnKey: null, childId: null });



  useEffect(() => {
    // Fetch column data from Redux store
    const parent = droppedItems.find((item) => item.id === id);

    if (parent) {
      setChildrenA(parent.childrenA || []);
      setChildrenB(parent.childrenB || []);
    } else {
      setChildrenA([]);
      setChildrenB([]);
    }
  }, [droppedItems, id]);

  const handleDrop = (column) => (e) => {
    e.preventDefault();
    e.stopPropagation();

    setDragState({ isDragging: false, column: null });
    if (!activeWidgetName) return;

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
      console.log("droppedData in columnTwo: ",droppedData);
    } catch (error) {
      console.error("Failed to parse dropped data:", error);
      return;
    }

    console.log("droppedData*******************************************: ", droppedData);
    console.log("droppedData.name***************************************: ", droppedData?.name);

    if(!['1-column','2-columns', '3-columns', 'customColumns'].includes(droppedData?.name)){
      if(widgetOrElement === 'element'){
          dispatch(
              setDroppedItems({
                id: Date.now(), 
                name: droppedData.name, 
                type: droppedData.type, 
                parentId: id,
                columnName: column,
                content: droppedData.content, 
                styles: droppedData.styles, 
                isActive: null
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
          setDroppedItems({
            id: Date.now(), // Unique ID for the dropped child
            name: activeWidgetName,
            type: "widget",
            parentId: id, // Parent ID to identify the column
            columnName: column, // Specify the column (childrenA or childrenB)
            content: content,
            styles: styles, // Additional styles if needed
            isActive: null,
          })
        );
      }
    }
    else if(['1-column', '2-columns', '3-columns', 'customColumns'].includes(droppedData?.name)){
      return;
    }


    dispatch(setActiveWidgetId(null));
    dispatch(setActiveParentId(null));
    dispatch(setActiveColumn(null));

    dispatch(setColumnOneExtraPadding(false));
    dispatch(setColumnTwoExtraPadding(false));
    dispatch(setColumnThreeExtraPadding(false));
    dispatch(setWrapperExtraPadding(false));

    if (onDrop) {
      onDrop(e);
    }

  };

  const handleDragOver = (e) => {
    e.preventDefault();
  };

  const handleDeleteChild = (column, childId) => {
    // console.log(`parentId: ${id}, childId: ${childId}, columnName: ${column} from handleDeleteChild ColumnTwo`);
    dispatch(
      deleteDroppedItemById({
        parentId: id,
        columnName: column,
        childId: childId, // Pass the ID of the child to be deleted
      })
    );
  };

  const onclickHandler = (id, childId, column) => {
    // console.log("Parent Column clicked, ID:", id);
    dispatch(setActiveParentId(id));
    dispatch(setActiveWidgetId(childId));
    dispatch(setActiveColumn(column));
  };

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

  const styleWithBackground = {
    ...currentStyles,
    // If backgroundImage is just a URL, wrap it in `url("...")`
    backgroundImage: currentStyles.backgroundImage
      ? `url("${currentStyles.backgroundImage}")`
      : undefined,
    // If you want the user to set `borderType`, map it to `border`
    ...(currentStyles.borderType && { border: currentStyles.borderType }),
  };



  // ***************************************** write extra logic for hilight drop area while dragEnter
      const handleDragEnter = (column, ref) => {
        // console.log("handleDragEnter called", column);
    
        if (dragState.column !== column) {
    
            setDragState({ isDragging: true, column });
            dispatch(dispatch(setActiveBorders(true)));
            // dispatch(setColumnTwoExtraPadding(true));
          }

      };
      
      const handleDragLeave = (e, ref) => {
        // console.log("handleDragLeave called");
        if(ref && ref.current && (!e.relatedTarget || !ref.current.contains(e.relatedTarget))){
          setDragState({ isDragging: false, column: null });
          dispatch(setColumnTwoExtraPadding(false));
        }
      };
  

      // ************************************************************************ 
      const onClickOutside = () => {
        dispatch(setColumnTwoExtraPadding(false));
        dispatch(setActiveBorders(false)); // Remove active borders
      };
      useEffect(() => {
        const handleClickOutside = (event) => {
          if ((twoColumnRef.current && !twoColumnRef.current.contains(event.target)) 
            && (columnARef.current && !columnARef.current.contains(event.target)) 
            && (columnBRef.current && !columnBRef.current.contains(event.target))) {
            onClickOutside(); // Call the function when clicking outside
            setPopup({ visible: false, x: 0, y: 0, columnKey: null, childId: null });
          }
        };
    
        document.addEventListener("mousedown", handleClickOutside);
        return () => {
          document.removeEventListener("mousedown", handleClickOutside);
        };
      }, []);
      // ***************************************************************************** element exchange position through ui
      const onDragStart = (e) => {
        e.stopPropagation();
        e.dataTransfer.setData(
          "text/plain",
          JSON.stringify({
            id,
            name: "2-columns",
            dragableName: "dragableColumn"
          })
        );
        e.dataTransfer.effectAllowed = "move";
        
        // *******************************************************
        const dragPreview = document.createElement("div");
        dragPreview.style.width = `${twoColumnRef.current.offsetWidth}px`;
        dragPreview.style.height = `${twoColumnRef.current.offsetHeight}px`;
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
        dragPreview.innerText = activeWidgetName || "Dragging"; // Optional: Add text

        document.body.appendChild(dragPreview);

        // Set the custom drag image
        e.dataTransfer.setDragImage(dragPreview, dragPreview.offsetWidth / 2, dragPreview.offsetHeight / 2);

        // Cleanup after drag starts
        setTimeout(() => {
          document.body.removeChild(dragPreview);
        }, 0);
      // ****************************************************

        dispatch(setWidgetOrElement("column"));
        dispatch(setSmallGapInTop(true));
      };
      
      const onDrop = (e) => {
        e.stopPropagation();

        const droppedData = JSON.parse(e.dataTransfer.getData("text/plain"));
        console.log("droppedData: ", droppedData);
        console.log("droppedData.name: ", droppedData.name);

        const restrictedWidgets = ["1-column", "3-columns"];

        if (droppedData.name && restrictedWidgets.includes(droppedData.name)) {

          dispatch(
            replaceDroppedItem({
              parentId: null,
              column: null,
              draggedNodeId: droppedData.id,
              targetNodeId: id,
            })
          )

        }
        else{

          dispatch(
            replaceDroppedItem({
              parentId: activeParentId || null,
              column: activeColumn || null,
              draggedNodeId: droppedData.id,
              targetNodeId: id,
            })
          );

        }
      };
      
      // const onDragOver = (e) => {
      //   e.preventDefault(); // Allow dropping
      // };
      //********************************************************************************   drop Into PaddingTop */ 
      const dropInPaddingTop = (e)=>{
        e.stopPropagation();
  
        const droppedData = JSON.parse(e.dataTransfer.getData("text/plain"));
  
        setDragState({ isDragging: false, column: null });
        setPaddingTop(null);
  
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
        console.log("enterInTop called");
        setPaddingTop(true);
      }
      const leaveFromPaddingTop = (e)=>{
        e.stopPropagation();
        console.log("leaveFromTop called");
        setPaddingTop(null);
      }

      // ****************************************************************************************************
      const handleRightClick = (e, columnKey, childId = null) => {
        e.preventDefault();
      
        console.log("Right-click detected: ", { columnKey, childId });
      
        const containerRect = twoColumnRef.current.getBoundingClientRect();
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
      
        setPopup({ visible: true, x: popupX, y: popupY, columnKey, childId: childId || null });
      
        dispatch(setActiveRightClick(true));
        dispatch(setActiveWidgetId(childId));
        dispatch(setActiveParentId(id));
        dispatch(setActiveColumn(columnKey));
        dispatch(setHoverColumnInCC(true));

      };
      
      const handlePopupDelete = (childId) => {
            if (!popup.columnKey || !childId) return;
  
          
            dispatch(
              deleteDroppedItemById({
                parentId: id, // Parent column ID
                childId: childId, 
                columnName: popup.columnKey,
              })
            );
          
            setPopup({ visible: false, x: 0, y: 0, columnKey: null, childId: null });
          };
      const handlePopupDuplicate = (childId) => {
          if (!popup.columnKey) return;
      
          console.log("Popup Duplicate: ", popup);
        
          dispatch(
            duplicateElementInNormalColumn({
              parentId: id,
              columnName: popup.columnKey,
              childId: childId || null,
            })
          );
        
          setPopup({ visible: false, x: 0, y: 0, columnKey: null, childId: null });
        };
      
      
      

  return (
    <div

    onDrop={dropInPaddingTop}
    onDragEnter={enterInPaddingTop}
    onDragLeave={leaveFromPaddingTop}
    
    ref={twoColumnRef}
    className={`relative grid gap-1 group bg-transparent transition-all duration-300 p-2
      
      ${activeWidgetId===id ? 'border-2 border-blue-500': ""}
      sm:grid-cols-1 
      md:grid-cols-2
      lg:grid-cols-2
    `}
    // ${smallGapInTop ? 'pt-3' : ""}

  onClick={(e) => {
    e.stopPropagation();
    dispatch(setActiveWidgetId(id));
    dispatch(setActiveWidgetName("2-column"));
    dispatch(setActiveEditor("sectionEditor"));
    dispatch(setActiveBorders(true));

    // console.log("activeWidgetId in columnTwo: ", activeWidgetId);
    // console.log("droppedItems in columnTwo: ",droppedItems);
    // console.log("activeWidgetName in columnTwo: ",activeWidgetName);
  }}
  
  style={{
    ...styleWithBackground,
    border: currentStyles.borderType,
    backgroundRepeat: "no-repeat",
    backgroundPosition: "center",
    backgroundSize: "cover",
    borderRadius: currentStyles.borderRadius,
    ...(view === "mobile" ? { padding: "12px", display: "flex", flexDirection: "column" } : {}),
    // ...(paddingTop
    //   ? { 
    //       paddingTop: "50px",  
    //       position: "relative",
    //     } 
    //   : { paddingTop: "" }
    // )
  }}

  // onDragOver={(e) => {
  //   e.stopPropagation();
  //   onDragOver(e);
  // }}
>

  {/* Add this div for border only on extra padding */}
  {/* {paddingTop && (
    <div 
      style={{
        position: "absolute",
        top: "-5px",  // ✅ Moves above the element
        left: 0,
        width: "100%",
        height: "50px",  // ✅ Applies only to paddingTop
        backgroundColor: "rgba(173, 216, 230, 0.3)", // ✅ Background only for extra padding
        borderTop: "2px dashed rgba(30, 144, 255, 0.8)",  
        borderLeft: "2px dashed rgba(30, 144, 255, 0.8)",
        borderRight: "2px dashed rgba(30, 144, 255, 0.8)",
        borderBottom: "2px dashed rgba(30, 144, 255, 0.8)",  // ✅ No bottom border to avoid confusion
        pointerEvents: "none",  // ✅ Prevents interactions
        zIndex: 10,  // ✅ Ensures it stays above
      }}
    />
  )} */}

   
  {/* Trapezoid Icon Section */}
  {(activeWidgetId === id) && (
    <div
      className="absolute -top-[21px] left-[50%] transform -translate-x-1/2 bg-blue-400 flex items-center justify-center"
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
          draggable
          onDragStart={onDragStart}
          onDragEnd={()=>{
            dispatch(setSmallGapInTop(null));
            setPaddingTop(null);
          }}
        >
          <PiDotsSixBold size={16} />
        </button>

        {/* Delete Icon */}
        <button
          className="flex items-center justify-center w-full h-full transition duration-200 hover:bg-blue-500 text-black hover:text-red-500"
          onClick={(e) => {
            e.stopPropagation();
            handleDeleteChild(id);

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



{popup.visible && (
            <div
            
            className="absolute z-20 bg-white shadow-md border border-gray-200 rounded-lg transition-all duration-300"
            style={{
              top: popup.y,
              left: popup.x,
              minWidth: "120px", // Compact size
              padding: "8px", // Slight padding for spacing
            }}
          >
            {/* Popup Actions */}
            <div className="flex flex-col items-start gap-2">
              {/* Duplicate Button */}
              <button
                className="flex items-center gap-2 px-2 py-1 rounded-md hover:bg-gray-100 transition-all duration-200"
                onClick={(e) => {
                  e.stopPropagation();
                  handlePopupDuplicate(popup.childId); // Call the duplicate function
                }}
              >
                <span className="flex items-center justify-center w-6 h-6 bg-blue-50 text-blue-500 rounded-md shadow-sm">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="w-4 h-4"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m4 10h-2m-6-6v6m0 0l-2-2m2 2l2-2"
                    />
                  </svg>
                </span>
                <span className="text-sm text-gray-600">Duplicate</span>
              </button>
          
              {/* Delete Button */}
              <button
                className="flex items-center gap-2 px-2 py-1 rounded-md hover:bg-gray-100 transition-all duration-200"
                onClick={(e) => {
                  e.stopPropagation();
                  handlePopupDelete(popup.childId); // Call the delete function
                }}
              >
                <span className="flex items-center justify-center w-6 h-6 bg-red-50 text-red-500 rounded-md shadow-sm">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="w-4 h-4"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M9 13h6m2 0a2 2 0 100-4H7a2 2 0 100 4zm-6 6h12a2 2 0 002-2V9a2 2 0 00-2-2H7a2 2 0 00-2 2v8a2 2 0 002 2z"
                    />
                  </svg>
                </span>
                <span className="text-sm text-gray-600">Delete</span>
              </button>
            </div>
          </div>
          
          )}




  {/* Column A */}
  <div
    ref={columnARef}
    onDrop={handleDrop("columnA")}
    onDragOver={handleDragOver}
    onDragEnter={() => handleDragEnter("columnA", columnARef)}
    onDragLeave={(e)=>handleDragLeave(e, columnARef)}
    className={`p-1 rounded-md text-center min-h-[150px] hover:border-2 hover:border-dashed hover:border-blue-500
                ${activeBorders ? 'border-2 border-dashed border-blue-200' : 'bg-transparent'}
                ${(dragState.isDragging && dragState.column === "columnA") ? "bg-blue-100 border-blue-400" : "bg-transparent"}
                ${(activeWidgetId == id) ? "border-2 border-blue-500" : ""}
                ${columnTwoExtraPadding ? "pb-[100px] border-2 border-dasshed-500" : ""}
              `}
  >
    {childrenA.map((child) => (
      <div
        key={child.id}
        className="w-full mb-1 relative"
        onMouseEnter={() => setHoveredChildA(child.id)}
        onMouseLeave={() => setHoveredChildA(null)}
        onClick={(e) => {
          e.stopPropagation();
          onclickHandler(id, child.id, "childrenA");
        }}
        onContextMenu={(e) => {
          e.stopPropagation();
          console.log("Right-clicked element in columnTwo:", child.id);
          handleRightClick(e, "childrenA", child.id); // ✅ Pass childId
        }}
      >
        {componentMap[child.name] ? componentMap[child.name]({ id: child.id, parentId: id, column: "childrenA", parentName: "2-columns"}) : <div>Unknown Component</div>}
        
      </div>
    ))}
    {childrenA.length === 0 && (
      <>
        <p className="text-gray-400">Column A</p>
        <p className="text-gray-400">Drop elements here</p>
      </>
    )}
  </div>

  {/* Column B */}
  <div
    ref={columnBRef}
    onDrop={handleDrop("columnB")}
    onDragOver={handleDragOver}
    onDragEnter={() => handleDragEnter("columnB", columnBRef)}
    onDragLeave={(e)=>handleDragLeave(e, columnBRef)}
    className={`p-1 rounded-md text-center min-h-[150px] hover:border-2 hover:border-dashed hover:border-blue-500
                ${activeBorders ? 'border-2 border-dashed border-blue-200' : 'bg-transparent'}
                ${(dragState.isDragging && dragState.column === "columnB") ? "bg-blue-100 border-blue-400" : "bg-transparent"}
                ${(activeWidgetId == id) ? "border-2 border-blue-500" : ""}
                ${columnTwoExtraPadding ? "pb-[100px] border-2 border-dasshed-500" : ""}
              `}
  >
    {childrenB.map((child) => (
      <div
        key={child.id}
        className="w-full mb-1 relative"
        onMouseEnter={() => setHoveredChildB(child.id)}
        onMouseLeave={() => setHoveredChildB(null)}
        onClick={(e) => {
          e.stopPropagation();
          onclickHandler(id, child.id, "childrenB");
        }}
        onContextMenu={(e) => {
          e.stopPropagation();
          console.log("Right-clicked element in columnTwo:", child.id);
          handleRightClick(e, "childrenB", child.id); // ✅ Pass childId
        }}
      >
        {componentMap[child.name] ? componentMap[child.name]({ id: child.id, parentId: id, column: "childrenB", parentName: "2-columns"}) : <div>Unknown Component</div>}
        
      </div>
    ))}
    {childrenB.length === 0 && (
      <>
        <p className="text-gray-400">Column B</p>
        <p className="text-gray-400">Drop elements here</p>
      </>
    )}
  </div>

</div>

  );
};

export default ColumnTwo;

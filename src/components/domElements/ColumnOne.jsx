
import React, { useState, useEffect } from "react";
import { RxCross2 } from "react-icons/rx";
import { useRef } from "react";
import Text from "./Text";
import Image from "./Image";
import Button from "./Button";
import TextArea from "./TextArea";
import Divider from "./Divider";
import SocialMedia from "./SocialMedia";
import Space from "./Space";

import { setActiveWidgetName, setActiveColumn} from "../../redux/cardDragableSlice";
import { setActiveEditor } from "../../redux/cardToggleSlice";

import { useDispatch, useSelector } from "react-redux";
import { setDroppedItems, deleteDroppedItemById, setActiveParentId, setActiveWidgetId} from "../../redux/cardDragableSlice";
import { setActiveBorders } from "../../redux/activeBorderSlice";

import { AiOutlineDrag } from "react-icons/ai";
import { replaceDroppedItem } from "../../redux/cardDragableSlice";

import { setColumnOneExtraPadding } from "../../redux/condtionalCssSlice";
import { setColumnTwoExtraPadding } from "../../redux/condtionalCssSlice";
import { setColumnThreeExtraPadding } from "../../redux/condtionalCssSlice";
import { setWrapperExtraPadding } from "../../redux/condtionalCssSlice";
import { setWidgetOrElement } from "../../redux/cardDragableSlice";
import { addElementAtLocation } from "../../redux/cardDragableSlice";
import { setSmallGapInTop } from "../../redux/condtionalCssSlice";
import { MdOutlineInsertDriveFile, MdDragIndicator } from "react-icons/md";
import { PiDotsSixBold } from "react-icons/pi";
import { FiEdit } from "react-icons/fi";
import { setActiveRightClick } from "../../redux/cardDragableSlice";
import { duplicateCustomColumn } from "../../redux/cardDragableSlice";
import { duplicateElementInNormalColumn } from "../../redux/cardDragableSlice";
import { addElementWithSection_AtSpecificLocation } from "../../redux/cardDragableSlice";

import { setHoverParentInCC } from "../../redux/condtionalCssSlice";
import { setHoverColumnInCC } from "../../redux/condtionalCssSlice";
import { setPaddingTopInCC } from "../../redux/condtionalCssSlice";




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

const ColumnOne = ({ handleDelete, id }) => {
  const { activeWidgetId, activeWidgetName, droppedItems, activeParentId, activeColumn, widgetOrElement} = useSelector((state) => state.cardDragable);
  const { activeBorders } = useSelector((state) => state.borderSlice);
  const {columnOneExtraPadding, smallGapInTop} = useSelector((state) => state.coditionalCssSlice);


  const oneColumnRef = useRef(null);
  
  const dispatch = useDispatch();

  const [hoveredColumn, setHoveredColumn] = useState(false); // Track hover state for the column
  const [hoveredChild, setHoveredChild] = useState(null); // Track hover state for children
  const [paddingTop, setPaddingTop] = useState(null);
  const [isDragging, setIsDragging] = useState(false); 
  const [popup, setPopup] = useState({ visible: false, x: 0, y: 0, columnKey: null, childId: null });




  const parent = droppedItems.find((item) => item.id === id);
  const children = parent?.children || [];

  // Handle Drop
  const handleDrop = (e) => {
    // e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
    // setPaddingTop(null);


    if (!activeWidgetName) return;

    const defaultContent =
            activeWidgetName === "Text"
              ? "Design Beautiful Emails."
              : activeWidgetName === "TextArea"
              ? "Craft professional emails effortlessly with our drag-and-drop builder. Perfect for newsletters, promotions, and campaigns."
              : null; // Default to null if no specific content is neededcc

    // Safely parse dropped data
    let droppedData = null;
    try {
      droppedData = JSON.parse(e.dataTransfer.getData("text/plain"));
    } catch (error) {
      console.error("Failed to parse dropped data:", error);
      return;
    }

    console.log("droppedData in columnOne:::: ", droppedData);

    if(!['1-column', '2-columns', '3-columns'].includes(droppedData?.name)){
      if(widgetOrElement === 'element'){
        dispatch(
          setDroppedItems({
            id: Date.now(), 
            name: droppedData.name, 
            type: droppedData.type, 
            parentId: id, 
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
            content: defaultContent,
            styles: {}, // Additional styles if needed
            isActive: null,
          })
        );
      }
    }
    else if(['1-column', '2-columns', '3-columns'].includes(droppedData?.name)){
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

  const handleDeleteChild = (childId) => {
    dispatch(
      deleteDroppedItemById({
        parentId: id,
        childId: childId,
      })
    );
  };

 
  const onclickHandler = (id, childId) => {
    // console.log("Parent Column clicked, ID:", id);
    dispatch(setActiveParentId(id));
    dispatch(setActiveWidgetId(childId));
    dispatch(setActiveColumn(""));


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
  const handleDragEnter = (e) => {
    e.stopPropagation();
    console.log("handleDragEnter called in columnOne: ",paddingTop);

    if (!isDragging) {
      // setPaddingTop(true);
      setIsDragging(true);
      dispatch(setActiveBorders(true)); // Add active borders for visual feedback
      dispatch(setColumnOneExtraPadding(true)); // Optional Redux state update
    }

  };
  
  const handleDragLeave = (e) => {
    e.stopPropagation();
    console.log("handleDragLeave called in columnOne: ",paddingTop);
 
    if (oneColumnRef.current && !oneColumnRef.current.contains(e.relatedTarget)) {
      setIsDragging(false);
      // setPaddingTop(false);
      dispatch(setColumnOneExtraPadding(false)); // Optional Redux state update
    }

  };
  

   // ************************************************************************ 
    const onClickOutside = () => {
      dispatch(setColumnOneExtraPadding(false));
      setPopup({ visible: false, x: 0, y: 0, columnKey: null, childId: null });
    };
    useEffect(() => {
      const handleClickOutside = (event) => {
        if (oneColumnRef.current && !oneColumnRef.current.contains(event.target)) {
          onClickOutside(); // Call the function when clicking outside
        }
      };
  
      document.addEventListener("mousedown", handleClickOutside);
      return () => {
        document.removeEventListener("mousedown", handleClickOutside);
      };
    }, []);
    // ***************************************************************************** element exchange position through ui
    const onDragStart = (e) => {
      // console.log("onDragStart called in Text");
      e.stopPropagation();
      e.dataTransfer.setData(
        "text/plain",
        JSON.stringify({
            id,
            name: "1-column",
            dragableName: "dragableColumn"
        })
      );
      e.dataTransfer.effectAllowed = "move";

      // **************************************
      // Create a virtual drag image (using the drag icon)

      const dragPreview = document.createElement("div");
      dragPreview.style.width = `${oneColumnRef.current.offsetWidth}px`;
      dragPreview.style.height = `${oneColumnRef.current.offsetHeight}px`;
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
      // ********************************************

      dispatch(setWidgetOrElement("column"));
      dispatch(setSmallGapInTop(true));
    
    };
    
    const onDrop = (e) => {
      e.stopPropagation();

      const droppedData = JSON.parse(e.dataTransfer.getData("text/plain"));
      console.log("droppedData: ", droppedData);
      console.log("droppedData.name: ", droppedData.name);

      // setPaddingTop(null);

      const restrictedWidgets = ["2-columns", "3-columns"];

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
    
    //******************************************************************************** drop Into PaddingTop */
    const dropInPaddingTop = (e)=>{
      e.stopPropagation();

      const droppedData = JSON.parse(e.dataTransfer.getData("text/plain"));

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

    // *********************************************************************************************
    const handleRightClick = (e, columnKey, childId = null) => {
      e.preventDefault();
    
      console.log("Right-click detected: ", { columnKey, childId });
    
      const containerRect = oneColumnRef.current.getBoundingClientRect();
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
      console.log(`childId: ${childId}, popup.columnKey: ${popup.columnKey}`);
    
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
      
      ref={oneColumnRef}

      onDragOver={handleDragOver}
      onMouseEnter={() => setHoveredColumn(true)}
      onMouseLeave={() => setHoveredColumn(false)}

      
   
      className={`text-center min-h-[150px] relative group transition-all duration-300 p-2
        
        ${activeWidgetId===id ? 'border-2 border-blue-500': ""}
      `}
      // ${smallGapInTop ? 'pt-3' : ""}
      onClick={(e) => {
        e.stopPropagation();
        dispatch(setActiveWidgetId(id));
        dispatch(setActiveWidgetName("1-column"));
        dispatch(setActiveEditor("sectionEditor"));
        dispatch(setActiveBorders(true));
      }}
      style={{
        ...styleWithBackground, border: currentStyles.borderType, backgroundRepeat: "no-repeat", 
        backgroundPosition: "center", backgroundSize: "cover", borderRadius: currentStyles.borderRadius,
        
        // ...(paddingTop
        //   ? { 
        //       paddingTop: "50px",  
        //       position: "relative",
        //     } 
        //   : { paddingTop: "" }
        // )
      }}


      
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
              draggable
              onDragStart={onDragStart}
              onDragEnd={()=>{
                dispatch(setSmallGapInTop(null));
                setPaddingTop(null);
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
            <span className="text-sm text-gray-600">🔄 Duplicate</span>
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
            <span className="text-sm text-gray-600">🗑 Delete</span>
          </button>
        </div>
      </div>
      
      )}




      <div className={`rounded-md text-center hover:border-2 hover:border-dashed hover:border-blue-500 min-h-[150px] p-1
                      ${activeBorders ? 'border-2 border-dashed border-blue-200' : ''} 
                      ${isDragging ? "bg-blue-100 border-blue-400" : ""}
                      ${(activeWidgetId==id) ? "border-2 border-blue-500" : ""}
                      ${columnOneExtraPadding ? "pb-[100px] border-2 border-dasshed-500" : ""}
                      `}
                      onDrop={handleDrop}
                      onDragEnter={handleDragEnter} 
                      onDragLeave={handleDragLeave}
                      >

        {/* Render Children */}
        {children.length > 0 ? (
          children.map((child) => (
            <div
              key={child.id}
              onMouseEnter={() => setHoveredChild(child.id)}
              onMouseLeave={() => setHoveredChild(null)}
              onClick={(e) => {
                e.stopPropagation();
                onclickHandler(id, child.id);
              }}
              className="w-full rounded-md relative group"
              onContextMenu={(e) => {
                e.stopPropagation();
                console.log("Right-clicked  in columnOne:", child.id);
                handleRightClick(e, "children", child.id); // ✅ Pass childId
              }}
            >
              {componentMap[child.name] ? componentMap[child.name]({ id: child.id, parentId: id,  parentName: "1-column"}) : ""}
              
            </div>
          ))
        ) : (
          <div className="border-dashed rounded-md text-center text-gray-400 font-semibold"
          >
            Drop an element here
          </div>
        )}
      </div>
    </div>
  );
};

export default ColumnOne;




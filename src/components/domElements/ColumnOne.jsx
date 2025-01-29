
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
      // console.log("onClickOutside called");
      dispatch(setColumnOneExtraPadding(false));
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

      setIsDragging(false);
      setPaddingTop(null);


      if(widgetOrElement && widgetOrElement==='widget'){
        dispatch(
          addElementAtLocation({
            draggedNodeId: Date.now(), 
            draggedName: droppedData.name, 
            dragableType: droppedData.type,
            
            targetParentId: null, 
            targetColumn: null, 
            targetNodeId: id, 
          })
        )
      }
      else if(widgetOrElement && (widgetOrElement==='column' || widgetOrElement==='element') ){

        if(droppedData.parentId){
          dispatch(
            addElementAtLocation({
              draggedNodeId: Date.now(), 
              draggedName: droppedData.name, 
              dragableType: droppedData.type,
              styles: droppedData.styles, 
              content: droppedData.content, 
              
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
      }
    }

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
    

  return (
    <div
      onDrop={dropInPaddingTop}
      onDragEnter={enterInPaddingTop}
      onDragLeave={leaveFromPaddingTop}
      
      ref={oneColumnRef}

      onDragOver={handleDragOver}
      onMouseEnter={() => setHoveredColumn(true)}
      onMouseLeave={() => setHoveredColumn(false)}

      
   
      className={`text-center min-h-[150px] relative group transition-all duration-300 
        ${smallGapInTop ? 'pt-3' : ""}
        ${activeWidgetId===id ? 'border-2 border-blue-500 p-2': ""}
      `}
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
        ...(paddingTop ? { paddingTop: "100px"} : { paddingTop: currentStyles.paddingTop}),
      }}


      
    >

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




      <div className={`rounded-md text-center hover:border-2 hover:border-dashed hover:border-blue-500 min-h-[150px] p-1
                      ${activeBorders ? 'border-2 border-dashed border-blue-200' : 'bg-transparent'} 
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




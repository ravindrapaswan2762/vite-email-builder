
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

import { AiOutlineDrag } from "react-icons/ai";
import { replaceDroppedItem } from "../../redux/cardDragableSlice";
import { height } from "@mui/system";


import { setColumnOneExtraPadding } from "../../redux/condtionalCssSlice";
import { setColumnTwoExtraPadding } from "../../redux/condtionalCssSlice";
import { setColumnThreeExtraPadding } from "../../redux/condtionalCssSlice";
import { setWrapperExtraPadding } from "../../redux/condtionalCssSlice";
import { addElementAtLocation } from "../../redux/cardDragableSlice";
import { setWidgetOrElement } from "../../redux/cardDragableSlice";
import { setSmallGapInTop } from "../../redux/condtionalCssSlice";



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

    if(!['1-column','2-columns', '3-columns'].includes(droppedData?.name)){
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
            dispatch(setColumnTwoExtraPadding(true));
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
          if ((columnARef.current && !columnARef.current.contains(event.target)) &&
          (columnBRef.current && !columnBRef.current.contains(event.target))) {
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
        e.stopPropagation();
        e.dataTransfer.setData(
          "text/plain",
          JSON.stringify({
            id,
            name: "2-columns"
          })
        );

        dispatch(setWidgetOrElement("column"));
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
      
      const onDragOver = (e) => {
        e.preventDefault(); // Allow dropping
      };
      //********************************************************************************   drop Into PaddingTop */ 
      const dropInPaddingTop = (e)=>{
        e.stopPropagation();

        setDragState({ isDragging: false, column: null });
        setPaddingTop(null);
  
        const droppedData = JSON.parse(e.dataTransfer.getData("text/plain"));
  
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
                parentId: activeParentId || null,
                column: activeColumn || null,
                draggedNodeId: droppedData.id,
                targetNodeId: id,
              }) 
            );
          }

        }//else if widgetOrElement==='element'
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

  return (
    <div

    onDrop={dropInPaddingTop}
    onDragEnter={enterInPaddingTop}
    onDragLeave={leaveFromPaddingTop}

    ref={twoColumnRef}
    className={`relative grid gap-1 group bg-transparent transition-all duration-300 ${smallGapInTop ? 'pt-3' : ""}
      sm:grid-cols-1 
      md:grid-cols-2
      lg:grid-cols-2
    `}

  onClick={(e) => {
    e.stopPropagation();
    dispatch(setActiveWidgetId(id));
    dispatch(setActiveWidgetName("2-column"));
    dispatch(setActiveEditor("sectionEditor"));
    dispatch(setActiveBorders(true));
  }}
  style={{
    ...styleWithBackground,
    border: currentStyles.borderType,
    backgroundRepeat: "no-repeat",
    backgroundPosition: "center",
    backgroundSize: "cover",
    borderRadius: currentStyles.borderRadius,
    ...(view === "mobile" ? { padding: "12px", display: "flex", flexDirection: "column" } : {}),
    ...(paddingTop ? { paddingTop: "100px"} : { paddingTop: currentStyles.paddingTop}),
  }}
  
  draggable
  onDragStart={onDragStart}
  onDragOver={(e) => {
    e.stopPropagation();
    onDragOver(e);
  }}
>

   {/* Drag Icon */}
    {(activeWidgetId==id) ? (
        <AiOutlineDrag
          style={{
            position: "absolute",
            left: "-20px",
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
      >
        {componentMap[child.name] ? componentMap[child.name]({ id: child.id, parentId: id, column: "childrenA" }) : <div>Unknown Component</div>}
        {hoveredChildA === child.id && (
          <button
            onClick={(e) => {
              e.stopPropagation();
              handleDeleteChild("childrenA", child.id);
            }}
            className="absolute top-3 right-1 bg-red-500 text-white rounded-full hover:bg-red-600 transition-all duration-200"
          >
            <RxCross2 size={14} />
          </button>
        )}
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
      >
        {componentMap[child.name] ? componentMap[child.name]({ id: child.id, parentId: id, column: "childrenB"}) : <div>Unknown Component</div>}
        {hoveredChildB === child.id && (
          <button
            onClick={(e) => {
              e.stopPropagation();
              handleDeleteChild("childrenB", child.id);
            }}
            className="absolute top-3 right-1 bg-red-500 text-white rounded-full hover:bg-red-600 transition-all duration-200"
          >
            <RxCross2 size={14} />
          </button>
        )}
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

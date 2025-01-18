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
import {
   setDroppedItems, 
   setActiveWidgetName, 
   deleteDroppedItemById, 
   setActiveParentId, 
   setActiveWidgetId,
   setActiveColumn,
} from "../../redux/cardDragableSlice";

import { setActiveBorders } from "../../redux/activeBorderSlice";
import { setActiveNodeList } from "../../redux/treeViewSlice";

import { AiOutlineDrag } from "react-icons/ai";
import { replaceDroppedItem } from "../../redux/cardDragableSlice";


import { setColumnOneExtraPadding } from "../../redux/condtionalCssSlice";
import { setColumnTwoExtraPadding } from "../../redux/condtionalCssSlice";
import { setColumnThreeExtraPadding } from "../../redux/condtionalCssSlice";
import { setWrapperExtraPadding } from "../../redux/condtionalCssSlice";


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

const ColumnThree = ({ handleDelete, id }) => {
  const { activeWidgetId, activeWidgetName, droppedItems, activeParentId, activeColumn } = useSelector((state) => state.cardDragable);

  const { activeBorders } = useSelector((state) => state.borderSlice);
  const { activeNodeList } = useSelector((state) => state.treeViewSlice);
  const {columnThreeExtraPadding} = useSelector((state) => state.coditionalCssSlice);
  const {view} = useSelector( (state) => state.navbar );
  

  const dispatch = useDispatch();

  const threeColumnRef = useRef(null);

  const [childrenA, setChildrenA] = useState([]);
  const [childrenB, setChildrenB] = useState([]);
  const [childrenC, setChildrenC] = useState([]);

  const [hoveredChildA, setHoveredChildA] = useState(null);
  const [hoveredChildB, setHoveredChildB] = useState(null);
  const [hoveredChildC, setHoveredChildC] = useState(null); 
  

  useEffect(() => {
    // Fetch column data from Redux store
    const parent = droppedItems.find((item) => item.id === id);

    if (parent) {
      setChildrenA(parent.childrenA || []);
      setChildrenB(parent.childrenB || []);
      setChildrenC(parent.childrenC || []);
    } else {
      setChildrenA([]);
      setChildrenB([]);
      setChildrenC([]);
    }
  }, [droppedItems, id]);

  const handleDrop = (column) => (e) => {
    e.preventDefault();
    e.stopPropagation();
    // console.log("column: ", column);

    setIsDragging(false); // for hovering box while draging
    setColumn(null); // for hovering box while draging

    if (!activeWidgetName) return;

    // Prefill content and styles based on activeWidgetName
    let content = null;
    let styles = {};
    if (activeWidgetName === 'Text') {
      content = "Lorem Ipsum";
    } else if (activeWidgetName === 'TextArea') {
        content = "Liven up your web layout wireframes and mockups with one of these lorem ipsum generators.";
        styles = {height: "135px"}
    }

    // Safely parse dropped data
    let droppedData = null;
    try {
      droppedData = JSON.parse(e.dataTransfer.getData("text/plain"));
    } catch (error) {
      console.error("Failed to parse dropped data:", error);
      return;
    }

    console.log("droppedData********************************************************: ", droppedData);
    console.log("droppedData.name***************************************************: ", droppedData?.name);

    if(!['1-column', '2-columns', '3-columns'].includes(droppedData?.name)){
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
      const [isDragging, setIsDragging] = useState(false);
      const [column, setColumn] = useState(null);

        const handleDragEnter = (column) => {
          // console.log("columnThree handleDragEnter called");
          if (!isDragging || !column) {
            setIsDragging(true);
            setColumn(column);
          }

          dispatch(dispatch(setActiveBorders(true)));
          dispatch(setColumnThreeExtraPadding(true));
        };
        
        const handleDragLeave = () => {
          // console.log("handleDragLeave called");
          setIsDragging(false); 
          setColumn(null);
        };
          
    // ************************************************************************ 
      const onClickOutside = () => {
        dispatch(setActiveNodeList(false));
        dispatch(setColumnThreeExtraPadding(false));
        
      };
      useEffect(() => {
        const handleClickOutside = (event) => {
          if (threeColumnRef.current && !threeColumnRef.current.contains(event.target)) {
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
        // console.log("activeColumn:::::::::::: ",activeColumn);
        // console.log("onDragStart called in Text");
        e.stopPropagation();
        e.dataTransfer.setData(
          "text/plain",
          JSON.stringify({
            id,
            name: "3-columns"
          })
        );
      };
      
      const onDrop = (e) => {
        e.stopPropagation();

        const droppedData = JSON.parse(e.dataTransfer.getData("text/plain"));
        console.log("droppedData: ", droppedData);
        console.log("droppedData.name: ", droppedData.name);

        const restrictedWidgets = ["1-column", "2-columns"];

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
        // console.log("onDragOver called in Text");
        e.preventDefault(); // Allow dropping
      };
      //******************************************************************************** */ 
      

  return (
    <div className={`relative grid gap-1 group bg-transparent
      sm:grid-cols-1
      md:grid-cols-3
      lg:grid-cols-3
    `}

      onClick={(e) => {
        e.stopPropagation();
        dispatch(setActiveWidgetId(id));
        dispatch(setActiveWidgetName("3-column"));
        dispatch(setActiveEditor("sectionEditor"));
        dispatch(setActiveBorders(true));
      }}
      style={{
        ...styleWithBackground, border: currentStyles.borderType, backgroundRepeat: "no-repeat", 
        backgroundPosition: "center", backgroundSize: "cover", borderRadius: currentStyles.borderRadius,
        ...(view === "mobile" ? { padding: "30px", display: "flex", flexDirection: "column" } : {}),
      }}
      ref={threeColumnRef}

      draggable
      onDragStart={onDragStart}
      onDragOver={(e)=>{
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
        />
      ) : ""}
      
      {/* Column A */}
      <div
        onDrop={handleDrop("columnA")}
        onDragOver={handleDragOver}
        onDragEnter={()=>handleDragEnter("columnA")} 
        onDragLeave={handleDragLeave}
        className={`p-1 rounded-md text-center min-h-[150px] hover:border-2 hover:border-dashed hover:border-blue-400
                    ${activeBorders ? 'border-2 border-dashed border-blue-200' : 'bg-transparent'}
                    ${(isDragging && column==="columnA") ? "bg-blue-100 border-blue-400" : "bg-transparent"}
                    ${(activeWidgetId==id && activeNodeList) ? "border-2 border-blue-500" : ""}
                    ${columnThreeExtraPadding ? "pb-[100px] border-2 border-dasshed-500" : ""}
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
            {componentMap[child.name] ? componentMap[child.name]({ id: child.id }) : <div>Unknown Component</div>}

            {hoveredChildA === child.id && (
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  handleDeleteChild("childrenA", child.id);
                }}
                className="absolute top-3 right-1 bg-red-500 text-white rounded-full hover:bg-red-600 transition-all duration-200"
              >
                <RxCross2 size={12} />
              </button>
            )}
            
          </div>
        ))}
        {childrenA.length === 0 && 
          <>
            <p className="text-gray-400">Column A</p>
            <p className="text-gray-400">Drop elements here</p>
          </>}
      </div>

      {/* Column B */}
      <div
        onDrop={handleDrop("columnB")}
        onDragOver={handleDragOver}
        onDragEnter={()=>handleDragEnter("columnB")} 
        onDragLeave={handleDragLeave}
        className={`p-1 rounded-md text-center min-h-[150px] hover:border-2 hover:border-dashed hover:border-blue-400
                    ${activeBorders ? 'border-2 border-dashed border-blue-200' : 'bg-transparent'}
                    ${(isDragging && column==="columnB") ? "bg-blue-100 border-blue-400" : "bg-transparent"}
                    ${(activeWidgetId==id && activeNodeList) ? "border-2 border-blue-500" : ""}
                    ${columnThreeExtraPadding ? "pb-[100px] border-2 border-dasshed-500" : ""}
                    

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
            {componentMap[child.name] ? componentMap[child.name]({ id: child.id }) : <div>Unknown Component</div>}

            {/* Delete Button for Child */}
            {hoveredChildB === child.id && (
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  handleDeleteChild("childrenB", child.id);
                }}
                className="absolute top-3 right-1 bg-red-500 text-white rounded-full hover:bg-red-600 transition-all duration-200"
              >
                <RxCross2 size={12} />
              </button>
            )}
            
          </div>
        ))}
        {childrenB.length === 0 && <>
            <p className="text-gray-400">Column B</p>
            <p className="text-gray-400">Drop elements here</p>
          </>}
      </div>

      {/* Column C */}
      <div
        onDrop={handleDrop("columnC")}
        onDragOver={handleDragOver}
        onDragEnter={()=>handleDragEnter("columnC")} 
        onDragLeave={handleDragLeave}
        className={`p-1 rounded-md text-center min-h-[150px] hover:border-2 hover:border-dashed hover:border-blue-400
                    ${activeBorders ? 'border-2 border-dashed border-blue-200' : 'bg-transparent'}
                    ${(isDragging && column==="columnC") ? "bg-blue-100 border-blue-400" : "bg-transparent"}
                    ${(activeWidgetId==id && activeNodeList) ? "border-2 border-blue-500" : ""}
                    ${columnThreeExtraPadding ? "pb-[100px] border-2 border-dasshed-500" : ""}
                    

                  `}
      >
      
        {childrenC.map((child) => (
          <div
            key={child.id}
            className="w-full mb-1 relative"
            onMouseEnter={() => setHoveredChildC(child.id)} 
            onMouseLeave={() => setHoveredChildC(null)}   
            onClick={(e) => {
              e.stopPropagation();
              onclickHandler(id, child.id, "childrenC");
            }}
          >
            {componentMap[child.name] ? componentMap[child.name]({ id: child.id }) : <div>Unknown Component</div>}

            {/* Delete Button for Child */}
            {hoveredChildC === child.id && (
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  handleDeleteChild("childrenC", child.id);
                }}
                className="absolute top-3 right-1 bg-red-500 text-white rounded-full hover:bg-red-600 transition-all duration-200"
              >
                <RxCross2 size={12} />
              </button>
            )}
            
            
          </div>
        ))}
        {childrenC.length === 0 && <>
            <p className="text-gray-400">Column C</p>
            <p className="text-gray-400">Drop elements here</p>
          </>}
      </div>
    </div>
  );
};

export default ColumnThree;

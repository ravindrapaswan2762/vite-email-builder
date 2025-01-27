import React, { useState, useEffect, useRef } from "react";
import { useSelector, useDispatch } from "react-redux";
import { PiDotsSixVerticalBold } from "react-icons/pi";
import { updateColumnWidth } from "../../redux/cardDragableSlice";
import { setActiveWidgetId } from "../../redux/cardDragableSlice";
import { deleteDroppedItemById } from "../../redux/cardDragableSlice";
import { duplicateCustomColumn } from "../../redux/cardDragableSlice";

import { PiDotsSixBold } from "react-icons/pi";
import { FiEdit } from "react-icons/fi";
import { RxCross2 } from "react-icons/rx";

import { deleteCustomColumn } from "../../redux/cardDragableSlice";

const CustomColumns = ({ id }) => {

  const [resizingIndex, setResizingIndex] = useState(null);
  const [localColumns, setLocalColumns] = useState([]);
  const [showWidthPercentage, setShowWidthPercentage] = useState(false);
  const [popup, setPopup] = useState({ visible: false, x: 0, y: 0, columnId: null });

  const dispatch = useDispatch();
  const customColumnRef = useRef(null);

  // Fetch the custom column data from Redux state
  const { droppedItems, activeWidgetId, activeWidgetName} = useSelector((state) => state.cardDragable);
  const columnData = droppedItems.find((item) => item.id === id);

  if (!columnData || columnData.columnCount < 1) {
    return <div>No columns to display</div>;
  }

  const handleResizeMouseDown = (index) => (e) => {
    e.preventDefault();
    setResizingIndex(index);
    setShowWidthPercentage(true);
  };

  const handleResizeMouseMove = (e) => {
    if (resizingIndex === null) return;

    const containerWidth = customColumnRef.current.offsetWidth;
    const deltaX = e.movementX;

    setLocalColumns((prevColumns) => {
      const newColumns = [...prevColumns];
      const leftColumn = newColumns[resizingIndex].data.styles;
      const rightColumn = newColumns[resizingIndex + 1].data.styles;

      let newLeftWidth = parseFloat(leftColumn.width) + (deltaX / containerWidth) * 100;
      let newRightWidth = parseFloat(rightColumn.width) - (deltaX / containerWidth) * 100;

      if (newLeftWidth < 1) {
        newRightWidth += newLeftWidth - 1;
        newLeftWidth = 1;
      } else if (newRightWidth < 1) {
        newLeftWidth += newRightWidth - 1;
        newRightWidth = 1;
      }

      if (newLeftWidth >= 1 && newRightWidth >= 1) {
        leftColumn.width = `${newLeftWidth.toFixed(2)}%`;
        rightColumn.width = `${newRightWidth.toFixed(2)}%`;
      }

      return newColumns;
    });
  };

  const handleResizeMouseUp = () => {
    if (resizingIndex === null) return;

    setResizingIndex(null);
    setShowWidthPercentage(false);

    // Dispatch updated widths to Redux
    const leftColumnKey = localColumns[resizingIndex].key;
    const rightColumnKey = localColumns[resizingIndex + 1].key;

    const leftColumnWidth = parseFloat(localColumns[resizingIndex].data.styles.width);
    const rightColumnWidth = parseFloat(localColumns[resizingIndex + 1].data.styles.width);

    dispatch(updateColumnWidth({ parentId: id, columnKey: leftColumnKey, width: leftColumnWidth }));
    dispatch(updateColumnWidth({ parentId: id, columnKey: rightColumnKey, width: rightColumnWidth }));
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
  

  

  const handleRightClick = (e, columnKey) => {
    e.preventDefault();
  
    const containerRect = customColumnRef.current.getBoundingClientRect();
    const popupWidth = 150; // Estimated popup width
    const popupHeight = 100; // Estimated popup height
    const viewportWidth = window.innerWidth;
    const viewportHeight = window.innerHeight;
  
    // Calculate the initial popup position
    let popupX = e.clientX - containerRect.left;
    let popupY = e.clientY - containerRect.top;
  
    // Adjust if the popup goes out of the viewport horizontally
    if (e.clientX + popupWidth > viewportWidth) {
      popupX -= popupWidth; // Shift to the left
    }
  
    // Adjust if the popup goes out of the viewport vertically
    if (e.clientY + popupHeight > viewportHeight) {
      popupY -= popupHeight; // Shift upward
    }
  
    // Pass column key (e.g., `childrenB`) instead of the column ID
    setPopup({ visible: true, x: popupX, y: popupY, columnKey });
  };
  
  //********************************************************************************************************************* */ 
  const onclickHandler = ()=>{
    dispatch(setActiveWidgetId(id));
    console.log("onclickHandler called in custom-COLUMNS: ",id)
  }

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
    dragPreview.innerText = activeWidgetName || "Dragging"; // Optional: Add text

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
  console.log("currentStyles in custom-column: ",currentStyles);
  // ****************************************************************************
  const handlePopupDelete = () => {
    if (!popup.columnKey) return;
  
    // Dispatch the action with the column key
    dispatch(deleteCustomColumn({ parentId: id, columnKey: popup.columnKey }));
  
    // Close the popup
    setPopup({ visible: false, x: 0, y: 0, columnKey: null });
  
    console.log(`Deleted column: ${popup.columnKey} from parent: ${id}`);
  };
  

  const handlePopupDuplicate = () => {
    if (!popup.columnKey) return;
  
    // Dispatch the action with the column key
    dispatch(duplicateCustomColumn({ parentId: id, columnKey: popup.columnKey }));
  
    // Close the popup
    setPopup({ visible: false, x: 0, y: 0, columnKey: null });
  
    console.log(`Duplicated column: ${popup.columnKey} for parent: ${id}`);
  };
  
  

  if (!columnData) {
    return <div>Loading...</div>; // Prevent early return
  }
  
  if (columnData.columnCount < 1) {
    return <div>No columns to display</div>; // Handle empty columns
  }

  
  
  

  return (
    <div
      ref={customColumnRef}
      className={`relative grid gap-1 group bg-transparent
        ${activeWidgetId===id ? 'border-2 border-blue-500 p-2': ""}
      `}
      
      onClick={() => setPopup({ visible: false, x: 0, y: 0, columnId: null })}
    >
      <div className="flex w-full h-full relative gap-2" 
      onClick={onclickHandler}
      >

        {/* *************************************/}
        {/* Trapezoid Icon Section */}
              {(activeWidgetId === id) && (
                <div
                  className="absolute -top-[29px] left-[50%] transform -translate-x-1/2 bg-blue-400 flex items-center justify-center"
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
                      }}
                    >
                      <PiDotsSixBold size={16} />
                    </button>
        
                    {/* Delete Icon */}
                    <button
                      className="flex items-center justify-center w-full h-full transition duration-200 hover:bg-blue-500 text-black hover:text-red-500"
                      onClick={(e) => {
                        e.stopPropagation();
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
        {/* ***********************************/}

        {localColumns.map((column, index) => (
          <div
            key={column.data.id}
            className="relative border border-dashed border-blue-500 text-center p-4 bg-gray-100"
            onContextMenu={(e) => handleRightClick(e, column.key)}
            style={{
              flexBasis: column.data.styles.width,
              backgroundColor: column.data.styles.backgroundColor || "#f0f0f0", // Use bg color from Redux
            }}
          >
            <p className="text-gray-500">{`${column.key.replace('children', '')}`}</p>

            {showWidthPercentage && (
              <div className="absolute top-[-20px] left-1/2 transform -translate-x-1/2 text-sm text-gray-700 bg-white px-2 py-1 border rounded shadow">
                {Math.round(parseFloat(column.data.styles.width))}%
              </div>
            )}

            {index < localColumns.length - 1 && (
              <div
                className="absolute top-0 right-[-17px] h-full w-6 flex items-center justify-center cursor-col-resize z-10"
                onMouseDown={handleResizeMouseDown(index)}
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
              handlePopupDuplicate(); // Call the duplicate function
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
              handlePopupDelete(); // Call the delete function
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

    </div>
  );
};

export default CustomColumns;

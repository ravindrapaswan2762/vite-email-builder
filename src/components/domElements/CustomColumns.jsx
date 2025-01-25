import React, { useState, useEffect, useRef } from "react";
import { PiDotsSixVerticalBold } from "react-icons/pi";

const CustomColumns = () => {
  const [columns, setColumns] = useState([
    { id: 1, width: 33.33, content: "1" },
    { id: 2, width: 33.33, content: "2" },
    { id: 3, width: 33.34, content: "3" },
  ]);

  const [resizingIndex, setResizingIndex] = useState(null);
  const [showWidthPercentage, setShowWidthPercentage] = useState(false);
  const [popup, setPopup] = useState({ visible: false, x: 0, y: 0, columnId: null });

  const containerRef = useRef(null);

  const handleResizeMouseDown = (index) => (e) => {
    e.preventDefault();
    setResizingIndex(index);
    setShowWidthPercentage(true);
  };

  const handleResizeMouseMove = (e) => {
    if (resizingIndex === null) return;

    const containerWidth = containerRef.current.offsetWidth;
    const deltaX = e.movementX;

    setColumns((prevColumns) => {
      const newColumns = [...prevColumns];
      const leftColumn = newColumns[resizingIndex];
      const rightColumn = newColumns[resizingIndex + 1];

      let newLeftWidth = leftColumn.width + (deltaX / containerWidth) * 100;
      let newRightWidth = rightColumn.width - (deltaX / containerWidth) * 100;

      if (newLeftWidth < 1) {
        newRightWidth += newLeftWidth - 1;
        newLeftWidth = 1;
      } else if (newRightWidth < 1) {
        newLeftWidth += newRightWidth - 1;
        newRightWidth = 1;
      }

      if (newLeftWidth >= 1 && newRightWidth >= 1) {
        leftColumn.width = parseFloat(newLeftWidth.toFixed(2));
        rightColumn.width = parseFloat(newRightWidth.toFixed(2));
      }

      return newColumns;
    });
  };

  const handleResizeMouseUp = () => {
    setResizingIndex(null);
    setShowWidthPercentage(false);
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

  const handleRightClick = (e, columnId) => {
    e.preventDefault();
    setPopup({ visible: true, x: e.clientX, y: e.clientY, columnId });
  };

  const handleDuplicate = () => {
    if (!popup.columnId) return;

    setColumns((prevColumns) => {
      const columnToDuplicate = prevColumns.find((col) => col.id === popup.columnId);
      const newColumn = {
        ...columnToDuplicate,
        id: Date.now(),
        width: columnToDuplicate.width,
      };

      // Add the new column at the end and adjust widths
      const updatedColumns = [...prevColumns, newColumn];
      return updatedColumns.map((col) => ({ ...col, width: 100 / updatedColumns.length }));
    });
    setPopup({ visible: false, x: 0, y: 0, columnId: null });
  };

  const handleDelete = () => {
    if (!popup.columnId || columns.length <= 1) return;

    setColumns((prevColumns) => {
      const updatedColumns = prevColumns.filter((col) => col.id !== popup.columnId);
      return updatedColumns.map((col) => ({ ...col, width: 100 / updatedColumns.length }));
    });
    setPopup({ visible: false, x: 0, y: 0, columnId: null });
  };

  return (
    <div
      className={`relative w-full border border-gray-300 rounded-md p-4 bg-transparent transition-all duration-300`}
      ref={containerRef}
      onClick={() => setPopup({ visible: false, x: 0, y: 0, columnId: null })} // Close popup on click
    >
      {/* Columns */}
      <div className="flex w-full h-full relative gap-2">
        {columns.map((column, index) => (
          <div
            key={column.id}
            className="relative border border-dashed border-blue-500 text-center p-4 bg-gray-100"
            style={{ flexBasis: `${column.width}%` }}
            onContextMenu={(e) => handleRightClick(e, column.id)}
          >
            <p className="text-gray-500">{column.content}</p>

            {/* Live Width Percentage */}
            {showWidthPercentage && (
              <div className="absolute top-[-20px] left-1/2 transform -translate-x-1/2 text-sm text-gray-700 bg-white px-2 py-1 border rounded shadow">
                {Math.round(column.width)}%
              </div>
            )}

            {/* Resize Handle */}
            {index < columns.length - 1 && (
              <div
                className="absolute top-0 right-[-17px] h-full w-6 flex items-center justify-center cursor-col-resize z-10"
                onMouseDown={handleResizeMouseDown(index)}
              >
                {/* Vertical Dashed Line */}
                <div
                  className="absolute h-full w-0.5 border-l border-dashed border-gray-400"
                  style={{
                    left: "50%", // Center the dashed line behind the icon
                    transform: "translateX(-50%)",
                  }}
                ></div>

                <PiDotsSixVerticalBold className="text-black" />
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Right-Click Popup **********************************************************/}
      {popup.visible && (
        <div
          className="absolute bg-white shadow-md border rounded z-20"
          style={{
            top: (popup.y)-400,
            left: (popup.x)-650,
          }}
        >
          <button
            className="block px-4 py-2 text-gray-700 hover:bg-gray-200"
            onClick={handleDuplicate}
          >
            Duplicate
          </button>
          <button
            className="block px-4 py-2 text-gray-700 hover:bg-gray-200"
            onClick={handleDelete}
          >
            Delete
          </button>
        </div>
      )}
    </div>
  );
};

export default CustomColumns;

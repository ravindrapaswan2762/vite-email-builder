// Original

import React, { useState } from "react";
import { IconButton } from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import AddCircleOutlineIcon from "@mui/icons-material/AddCircleOutline";
import Column from "./Column"; // Import the new Column component

const Section = ({ id, columns, onDelete, onAddSection , onWidgetDrop}) => {
  const [columnWidths, setColumnWidths] = useState(
    Array(columns).fill(100 / columns) // Equal width for all columns initially
  );

  // State to store widgets for each column
  const [columnWidgets, setColumnWidgets] = useState(
    Array(columns).fill([]) // Initialize with empty arrays for each column
  );

  const handleWidgetDrop = (columnIndex, newWidgets) => {
    // Update widgets for the specific column
    setColumnWidgets((prevWidgets) => {
      const updatedWidgets = [...prevWidgets];
      updatedWidgets[columnIndex] = newWidgets;
      return updatedWidgets;
    });
  };


  

  // Handle column resizing
const handleMouseDown = (index, event) => {
  const startX = event.clientX;
  const startWidth = [...columnWidths];

  const handleMouseMove = (moveEvent) => {
    const deltaX = moveEvent.clientX - startX;
    const containerWidth =
      event.target.parentElement.parentElement.offsetWidth;

    const deltaWidthPercent = (deltaX / containerWidth) * 100;
    const newWidths = [...startWidth];

    newWidths[index] = Math.max(5, startWidth[index] + deltaWidthPercent);

    if (index + 1 < columns) {
      newWidths[index + 1] = Math.max(5, startWidth[index + 1] - deltaWidthPercent);
    }

    setColumnWidths(newWidths); // Only adjusts width
  };

  const handleMouseUp = () => {
    document.removeEventListener("mousemove", handleMouseMove);
    document.removeEventListener("mouseup", handleMouseUp);
  };

  document.addEventListener("mousemove", handleMouseMove);
  document.addEventListener("mouseup", handleMouseUp);
};


  return (
    <div
      style={{
        display: "flex",
        flexWrap: "nowrap", // Allow columns to wrap to a new line if needed
        width: "100%",
        margin: "10px 0",
        border: "1px solid #ccc",
        boxSizing: "border-box",
        backgroundColor: "#f9f9f9",
        borderRadius: "8px",
        position: "relative",
        overflow: "visible",
        boxShadow: "0px 3px 6px rgba(0, 0, 0, 0.1)",
        alignItems: "flex-start", // Align columns at the top
        // alignItems: "stretch", // Ensure columns stretch
        padding: "10px",
      }}
    >
      {/* Render Columns */}
      {columnWidgets.map((widgets, columnIndex) => (
        <Column
          key={columnIndex}
          columnIndex={columnIndex}
          width={columnWidths[columnIndex]}
          widgets={widgets}
         
          onWidgetDrop={handleWidgetDrop}
          onResize={columnIndex < columns - 1 ? handleMouseDown : null} // Add resize logic to all except the last column
        />
      ))}

      {/* Add Section Button */}
      <IconButton
        onClick={onAddSection}
        sx={{
          position: "absolute",
          top: "50%",
          right: "40px",
          transform: "translateY(-50%)",
          backgroundColor: "#ffffff",
          color: "#1976d2",
          border: "1px solid #1976d2",
          width: "30px",
          height: "30px",
          borderRadius: "50%",
          marginRight: "10px",
          boxShadow: "0px 4px 8px rgba(0, 0, 0, 0.2)",
          "&:hover": {
            backgroundColor: "#1565c0",
            color: "#ffffff",
            boxShadow: "0px 6px 15px rgba(0, 0, 0, 0.3)",
          },
          transition: "all 0.3s ease-in-out",
        }}
      >
        <AddCircleOutlineIcon sx={{ fontSize: "20px",  }} />
      </IconButton>

      {/* Delete Button */}
      <IconButton
        onClick={onDelete}
        sx={{
          position: "absolute",
          top: "50%",
          right: "5px",
          transform: "translateY(-50%)",
          backgroundColor: "#ffffff",
          color: "#ff5252",
          border: "1px solid #ff5252",
          width: "30px",
          height: "30px",
          borderRadius: "50%",
          boxShadow: "0px 4px 8px rgba(0, 0, 0, 0.2)",
          "&:hover": {
            backgroundColor: "#ff1744",
            color: "#ffffff",
            boxShadow: "0px 6px 15px rgba(0, 0, 0, 0.3)",
          },
          transition: "all 0.3s ease-in-out",
        }}
      >
        <DeleteIcon sx={{ fontSize: "20px" }} />
      </IconButton>
    </div>
  );
};

export default Section;






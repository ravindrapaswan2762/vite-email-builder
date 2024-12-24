// =================================Original=================================-//

import React, { useState } from "react";
import { useDrop } from "react-dnd";
import Widget from "./Widget";
import StyleEditor from "./StyleEditor";

const Column = ({ columnIndex, width, widgets, onWidgetDrop, onResize }) => {
  const [isStyleEditorOpen, setStyleEditorOpen] = useState(false);
  const [selectedWidget, setSelectedWidget] = useState(null);
  const [selectedWidgetIndex, setSelectedWidgetIndex] = useState(null);

  const [, drop] = useDrop({
    accept: "widget",
    drop: (item) => {
      const newWidgets = [...widgets, { name: item.name, style: {} }]; // Widgets now include a style object
      onWidgetDrop(columnIndex, newWidgets);
    },
  });

  const deleteWidget = (widgetIndex) => {
    const updatedWidgets = widgets.filter((_, index) => index !== widgetIndex);
    onWidgetDrop(columnIndex, updatedWidgets);
  };

  const updateWidgetStyle = (style) => {
    const updatedWidgets = [...widgets];
    updatedWidgets[selectedWidgetIndex].style = {
      ...updatedWidgets[selectedWidgetIndex].style,
      ...style,
    };
    onWidgetDrop(columnIndex, updatedWidgets); // Update widgets with the new style
  };

  return (
    <div
      ref={drop}
      style={{
        flex: `${width} 0 0`,
        border: "1px dashed #aaa",
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
        position: "relative",
        overflow: "hidden",
        padding: "10px",
        minHeight: "50px",
      }}
    >
      {widgets.map((widget, widgetIndex) => (
        <Widget
          key={`${widget.name}-${widgetIndex}`}
          type={widget.name}
          style={widget.style} // Pass style to Widget
          onDelete={() => deleteWidget(widgetIndex)}
          onDoubleClick={() => {
            setSelectedWidget(widget);
            setSelectedWidgetIndex(widgetIndex);
            setStyleEditorOpen(true);
          }}
        />
      ))}

      <span>Column {columnIndex + 1}</span>

      {onResize && (
        <div
          style={{
            position: "absolute",
            right: 0,
            top: 0,
            bottom: 0,
            width: "5px",
            cursor: "ew-resize",
            backgroundColor: "#ccc",
          }}
          onMouseDown={(e) => onResize(columnIndex, e)}
        />
      )}

      {/* Style Editor Modal */}
      <StyleEditor
        open={isStyleEditorOpen}
        onClose={() => setStyleEditorOpen(false)}
        widget={selectedWidget}
        onUpdateStyle={updateWidgetStyle} // Pass the update function
      />
    </div>
  );
};

export default Column;

// =================================Original=================================-//















// =================================Original=================================//
// import React, { useState } from "react";
// import { Modal, Box, Button } from "@mui/material";

// const StyleEditor = ({ open, onClose, widget, onUpdateStyle }) => {
//   const [fontSize, setFontSize] = useState(widget?.style?.fontSize?.replace('px', '') || ""); // Remove 'px' for input
//   const [color, setColor] = useState(widget?.style?.color || "");

//   const handleSave = () => {
//     const updatedStyle = {
//       fontSize: fontSize ? `${fontSize}px` : "", // Append 'px' to font size
//       color,
//     };
//     onUpdateStyle(updatedStyle);
//     onClose();
//   };

//   return (
//     <Modal open={open} onClose={onClose}>
//       <Box
//         sx={{
//           position: "absolute",
//           top: "50%",
//           left: "50%",
//           transform: "translate(-50%, -50%)",
//           bgcolor: "white",
//           boxShadow: 24,
//           p: 4,
//           borderRadius: "8px",
//           minWidth: "300px",
//         }}
//       >
//         <h2>Style Editor for {widget?.name}</h2>
//         <div style={{ marginBottom: "20px" }}>
//           <label>Font Size (px):</label>
//           <input
//             type="number"
//             value={fontSize}
//             onChange={(e) => setFontSize(e.target.value)}
//             placeholder="Enter font size"
//             style={{ marginLeft: "10px" }}
//           />
//         </div>
//         <div style={{ marginBottom: "20px" }}>
//           <label>Color:</label>
//           <input
//             type="color"
//             value={color}
//             onChange={(e) => setColor(e.target.value)}
//             style={{ marginLeft: "10px" }}
//           />
//         </div>
//         <Button onClick={handleSave} variant="contained" color="primary">
//           Save
//         </Button>
//       </Box>
//     </Modal>
//   );
// };

// export default StyleEditor;


// =================================Original=================================-//



import React, { useState } from "react";
import { Modal, Box, Button } from "@mui/material";

const StyleEditor = ({ open, onClose, widget, onUpdateStyle }) => {
  const [fontSize, setFontSize] = useState(widget?.style?.fontSize?.replace("px", "") || ""); // Remove 'px' for input
  const [color, setColor] = useState(widget?.style?.color || "");
  const [fontStyle, setFontStyle] = useState(widget?.style?.fontStyle || "normal");
  const [textDecoration, setTextDecoration] = useState(widget?.style?.textDecoration || "none");
  const [fontWeight, setFontWeight] = useState(widget?.style?.fontWeight || "normal");

  const handleSave = () => {
    const updatedStyle = {
      fontSize: fontSize ? `${fontSize}px` : "", // Append 'px' to font size
      color,
      fontStyle,
      textDecoration,
      fontWeight,
    };
    onUpdateStyle(updatedStyle); // Callback to update the parent state
    onClose();
  };

  return (
    <Modal open={open} onClose={onClose}>
      <Box
        sx={{
          position: "absolute",
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          bgcolor: "white",
          boxShadow: 24,
          p: 4,
          borderRadius: "8px",
          minWidth: "300px",
        }}
      >
        <h2>Style Editor for {widget?.name}</h2>

        {/* Font Size */}
        <div style={{ marginBottom: "20px" }}>
          <label>Font Size (px):</label>
          <input
            type="number"
            value={fontSize}
            onChange={(e) => setFontSize(e.target.value)}
            placeholder="Enter font size"
            style={{ marginLeft: "10px" }}
          />
        </div>

        {/* Font Color */}
        <div style={{ marginBottom: "20px" }}>
          <label>Color:</label>
          <input
            type="color"
            value={color}
            onChange={(e) => setColor(e.target.value)}
            style={{ marginLeft: "10px" }}
          />
        </div>

        {/* Font Style (Bold, Italic, Underline) */}
        <div style={{ marginBottom: "20px" }}>
          <label>Font Style:</label>
          <div style={{ display: "flex", gap: "10px", marginTop: "10px" }}>
            <Button
              variant={fontWeight === "bold" ? "contained" : "outlined"}
              onClick={() => setFontWeight(fontWeight === "bold" ? "normal" : "bold")}
            >
              Bold
            </Button>
            <Button
              variant={fontStyle === "italic" ? "contained" : "outlined"}
              onClick={() => setFontStyle(fontStyle === "italic" ? "normal" : "italic")}
            >
              Italic
            </Button>
            <Button
              variant={textDecoration === "underline" ? "contained" : "outlined"}
              onClick={() =>
                setTextDecoration(textDecoration === "underline" ? "none" : "underline")
              }
            >
              Underline
            </Button>
          </div>
        </div>

        {/* Save Button */}
        <Button onClick={handleSave} variant="contained" color="primary">
          Save
        </Button>
      </Box>
    </Modal>
  );
};

export default StyleEditor;

















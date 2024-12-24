// // =================================Original=================================-//
// import React, { useState } from "react";
// import Section from "./Section";
// import { Modal, Box, Grid } from "@mui/material";
// import { useDrag, useDrop } from "react-dnd";

// const DropZone = () => {
//   const [sections, setSections] = useState([]);
//   const [open, setOpen] = useState(false);

//   const handleOpen = () => setOpen(true);
//   const handleClose = () => setOpen(false);

//   // Add Section with Column Structure
//   const addSection = (columns) => {
//     setSections([...sections, { id: Date.now(), columns, widgets: [] }]);
//     handleClose(); // Close the modal after adding the section
//   };

//   // Delete Section
//   const handleDelete = (id) => {
//     setSections(sections.filter((section) => section.id !== id));
//   };

//   // Handle Widget Drop
//   const handleWidgetDrop = (sectionId, item) => {
//     setSections((prevSections) =>
//       prevSections.map((section) =>
//         section.id === sectionId
//           ? { ...section, widgets: [...section.widgets, item.name] }
//           : section
//       )
//     );
//   };

//   // Drop Zone for drag-and-drop items outside sections
//   const [, drop] = useDrop({
//     accept: "widget",
//     drop: (item) => {
//       // setWidgets([...widgets, { name: item.name, style: {} }]);
//       console.log(`Widget ${item.name} dropped outside!`);
//     },
//   });


//    // Move Section for Drag and Drop
//    const moveSection = (dragIndex, hoverIndex) => {
//     const updatedSections = [...sections];
//     const [draggedSection] = updatedSections.splice(dragIndex, 1); // Remove dragged section
//     updatedSections.splice(hoverIndex, 0, draggedSection); // Insert at hover position
//     setSections(updatedSections);
//   };



//   return (
//     <div
//       ref={drop} // Connect drop zone for items outside sections
//       style={{
//         width: "100%",
//         height: "auto",
//         border: "3px solid #e0e0e0",
//         overflowX: "hidden",
//         overflowY: "hidden",
//         padding: "20px",
//         boxSizing: "border-box",
//         backgroundColor: "#f5f5f5",
//         borderRadius: "8px",
//       }}
//     >
      
//       {/* Add Section Button */}
//       <button
//         style={{
//           marginBottom: "20px",
//           padding: "12px 24px",
//           fontSize: "16px",
//           backgroundColor: "#1976d2",
//           color: "#fff",
//           border: "none",
//           cursor: "pointer",
//           borderRadius: "8px",
//           boxShadow: "0px 3px 6px rgba(0, 0, 0, 0.1)",
//           transition: "background-color 0.3s ease",
//         }}
//         onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = "#1565c0")}
//         onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = "#1976d2")}
//         onClick={handleOpen}
//       >
//         Add Section
//       </button>


//     {/* Modal for Selecting Columns */}
//       <Modal open={open} onClose={handleClose}>
//         <Box
//           sx={{
//             position: "absolute",
//             top: "50%",
//             left: "50%",
//             transform: "translate(-50%, -50%)",
//             width: { xs: "90%", sm: "80%", md: "500px" }, // Responsive width
//             bgcolor: "#ffffff",
//             border: "1px solid #e0e0e0",
//             boxShadow: 24,
//             p: { xs: 2, sm: 3, md: 4 }, // Responsive padding
//             borderRadius: "12px",
//           }}
//         >
//           {/* Add Title */}
//           <h2
//             style={{
//               textAlign: "center",
//               fontSize: "20px",
//               marginBottom: "20px",
//               fontWeight: "600",
//               color: "#333",
//             }}
//           >
//             Select Your Structure
//           </h2>

//           <Grid container spacing={2}>
//             {[1, 2, 3, 4, 5, 6].map((cols) => (
//               <Grid
//                 item
//                 xs={12}
//                 sm={6}
//                 md={4}
//                 key={cols}
//                 onClick={() => addSection(cols)}
//                 style={{
//                   padding: "20px",
//                   textAlign: "center",
//                   cursor: "pointer",
//                   borderRadius: "8px",
//                   transition: "all 0.3s ease-in-out",
//                   backgroundColor: "#f9f9f9",
//                   border: "1px solid #ddd",
//                   boxShadow: "0px 2px 5px rgba(0, 0, 0, 0.1)",
//                 }}
//                 onMouseEnter={(e) => {
//                   e.currentTarget.style.backgroundColor = "#e3f2fd";
//                   e.currentTarget.style.transform = "scale(1.05)";
//                   e.currentTarget.style.boxShadow =
//                     "0px 4px 10px rgba(0, 0, 0, 0.2)";
//                 }}
//                 onMouseLeave={(e) => {
//                   e.currentTarget.style.backgroundColor = "#f9f9f9";
//                   e.currentTarget.style.transform = "scale(1)";
//                   e.currentTarget.style.boxShadow =
//                     "0px 2px 5px rgba(0, 0, 0, 0.1)";
//                 }}
//               >
//                 <div
//                   style={{
//                     display: "flex",
//                     justifyContent: "center",
//                     alignItems: "center",
//                     gap: "8px",
//                     height: "80px",
//                   }}
//                 >
//                   {Array.from({ length: cols }).map((_, i) => (
//                     <div
//                       key={i}
//                       style={{
//                         width: `${100 / cols - 5}%`,
//                         height: "35px",
//                         backgroundColor: "#1976d2",
//                         borderRadius: "6px",
//                       }}
//                     ></div>
//                   ))}
//                 </div>
//               </Grid>
//             ))}
//           </Grid>
//         </Box>
//       </Modal>

//   {/* Render Sections */}
//         {sections.map((section, index) => (
//         <DraggableSection
//           key={section.id}
//           section={section}
//           index={index}
//           moveSection={moveSection}
//           onDelete={() => handleDelete(section.id)}
//           onAddSection={handleOpen} // Opens the modal for adding a new section
//           onWidgetDrop={handleWidgetDrop}
//         />
//       ))}

          
//     </div>
       
    
//   );
// };


// // Draggable Section Wrapper
// const DraggableSection = ({ section, index, moveSection, onDelete, onAddSection, onWidgetDrop }) => {
//   const ref = React.useRef(null);

//   // Drag Logic
//   const [, drag] = useDrag({
//     type: "SECTION",
//     item: { index },
//   });

//   // Drop Logic
//   const [, drop] = useDrop({
//     accept: "SECTION",
//     hover: (draggedItem) => {
//       if (draggedItem.index !== index) {
//         moveSection(draggedItem.index, index);
//         draggedItem.index = index; // Update index
//       }
//     },
//   });

//   drag(drop(ref)); // Combine drag and drop refs

//   return (
//     <div ref={ref} style={{ marginBottom: "10px", cursor: "move" }}>
//       <Section
//         id={section.id}
//         key={section.id}
//         columns={section.columns}
//         onDelete={onDelete}
//         onWidgetDrop={onWidgetDrop}
//         onAddSection={onAddSection}
      
//       />
//     </div>
//   );
// };

// export default DropZone;





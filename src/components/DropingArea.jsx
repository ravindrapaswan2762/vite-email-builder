// import React from "react";
// import { useDispatch, useSelector } from "react-redux";
// import { setShowDropingArea } from "../redux/cardDragableSlice";

// const DropingArea = () => {
//   const dispatch = useDispatch();
//   const { showDropingArea } = useSelector((state) => state.cardDragable);

//   const handleDragEnter = (e) => {
//     e.preventDefault();
//     e.stopPropagation();
//     dispatch(setShowDropingArea(true)); // Show the drop area
//   };

//   const handleDragLeave = (e) => {
//     e.preventDefault();
//     e.stopPropagation();
//     dispatch(setShowDropingArea(false)); // Hide the drop area
//   };

//   const handleDragOver = (e) => {
//     e.preventDefault();
//     e.stopPropagation();
//   };

//   const handleDrop = (e) => {
//     e.preventDefault();
//     e.stopPropagation();
//     dispatch(setShowDropingArea(false)); // Hide the drop area
//     const data = e.dataTransfer.getData("text/plain");
//     console.log("Dropped data:", data);
//   };

//   return (
//     showDropingArea && ( // Conditionally render drop area
//       <section
//         onDragEnter={handleDragEnter}
//         onDragLeave={handleDragLeave}
//         onDragOver={handleDragOver}
//         onDrop={handleDrop}
//         className="show_droping_area border-2 border-dashed border-blue-400 bg-blue-50 rounded-lg p-4 text-center"
//       >
//         <p>Drop items here</p>
//       </section>
//     )
//   );
// };

// export default DropingArea;

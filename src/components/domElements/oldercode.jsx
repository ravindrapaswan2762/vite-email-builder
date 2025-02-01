// import React from "react";
// import { setActiveEditor } from "../redux/cardToggleSlice";
// import { useDispatch } from "react-redux";
// import { setActiveWidgetName, setActiveWidgetId } from "../redux/cardDragableSlice";
// import { setDroppedItems } from "../redux/cardDragableSlice";
// import { setActiveBorders } from "../redux/activeBorderSlice";

// const StructurePopup = ({ onClose, onAdd, id}) => {

//   const dispatch = useDispatch();

//   const structures = [
//     { id: "1-column", name: "1-column", label: "1 Column"},
//     { id: "2-columns", name: "2-columns", label: "2 Columns" },
//     { id: "3-columns", name: "3-columns", label: "3 Columns" },
//   ];

//   const onClickHandle = (structureId, name, e) =>{
//     e.stopPropagation();
//     console.log("structureId: ",structureId);

//     dispatch(setActiveEditor("sectionEditor"));
//     dispatch(setActiveWidgetName(name));
//     if(name === '1-column'){
//       dispatch(setDroppedItems({id:  Date.now(), name: name, parentId: id, type: "1-column"}));
//     }
//     else if(name === '2-columns'){
//       dispatch(setDroppedItems({id:  Date.now(), name: name, parentId: id, type: "2-columns"}));
//     }
//     else if(name === '3-columns'){
//       dispatch(setDroppedItems({id:  Date.now(), name: name, parentId: id, type: "3-columns"}));
//     }
//     onAdd(structureId);

//     dispatch(setActiveBorders(true));

//   }

//   return (
//     <div className="grid grid-cols-3 gap-6">
//       {structures.map((structure) => (
//         <button
//           key={structure.id}
//           onClick={(e) => onClickHandle(structure.id, structure.name, e)}
//           className="rounded-lg bg-gradient-to-r from-gray-100 to-gray-200 hover:from-blue-50 hover:to-blue-100 hover:shadow-lg transition-all duration-300 relative group"
//         >
//           {/* Container for the visualization */}
//           <div
//             className={`w-full h-20 border-2 border-dotted border-gray-300 rounded-lg bg-white flex items-center justify-center overflow-hidden pl-3 pr-3 ${
//               structure.id === "1-column"
//                 ? "grid-cols-1"
//                 : structure.id === "2-columns"
//                 ? "grid-cols-2"
//                 : "grid-cols-3"
//             }`}
//             style={{
//               display: "grid",
//               gap: "8px",
//             }}
//           >
//             {/* Visualizing the structure */}
//             {Array.from(
//               { length: structure.id === "1-column" ? 1 : structure.id === "2-columns" ? 2 : 3 },
//               (_, index) => (
//                 <div
//                   key={index}
//                   className="w-full h-16 bg-gradient-to-r from-gray-200 to-gray-300 rounded-md shadow-sm transition-transform group-hover:scale-105 group-hover:from-blue-200 group-hover:to-blue-300"
//                 ></div>
//               )
//             )}
//           </div>
//           {/* Subtle overlay effect */}
//           <div className="absolute inset-0 opacity-0 group-hover:opacity-100 bg-blue-500 bg-opacity-10 rounded-lg transition duration-300"></div>
//         </button>
//       ))}
//     </div>




//   );
// };

// export default StructurePopup;



// *************************************************************************************************************
import React, { useState } from "react";
import { setActiveEditor } from "../redux/cardToggleSlice";
import { useDispatch, useSelector } from "react-redux";
import { setActiveWidgetName, setDroppedItems, addCustomColumns } from "../redux/cardDragableSlice";
import { setActiveBorders } from "../redux/activeBorderSlice";

const StructurePopup = ({ onClose, onAdd, id }) => {
  const dispatch = useDispatch();
  const [columnCount, setColumnCount] = useState(4); // Tracks number of custom columns
  const { droppedItems } = useSelector((state) => state.cardDragable);

  const structures = [
    { id: "1-column", name: "1-column", label: "1 Column" },
    { id: "2-columns", name: "2-columns", label: "2 Columns" },
    { id: "3-columns", name: "3-columns", label: "3 Columns" },
    { id: "custom-columns", name: "custom-columns", label: "Custom Columns" },
  ];

  const onClickHandle = (structureId, name, e) => {
    // e.stopPropagation();
    console.log("onClickHandle called in Structure Popup");

    dispatch(setActiveEditor("sectionEditor"));
    dispatch(setActiveWidgetName(name));

    if (name === "1-column") {
      dispatch(setDroppedItems({ id: Date.now(), name: name, parentId: id, type: "1-column" }));
    } else if (name === "2-columns") {
      dispatch(setDroppedItems({ id: Date.now(), name: name, parentId: id, type: "2-columns" }));
    } else if (name === "3-columns") {
      dispatch(setDroppedItems({ id: Date.now(), name: name, parentId: id, type: "3-columns" }));
    } else if (name === "custom-columns") {
      // Handle custom columns
      if (columnCount > 0) {
        dispatch(
          addCustomColumns({
            id: Date.now(),
            name: "customColumns",
            columnCount, // Specify the number of columns
            parentId: id
          })
        );
        console.log("Custom Columns Added: ", columnCount);
        onClose(); // Close the popup
      } else {
        console.warn("Invalid column count. Must be greater than 0.");
      }
    }

    if (name !== "custom-columns") {
      onAdd(structureId);
      dispatch(setActiveBorders(true));
    }
  };

  return (
    <div className="grid grid-cols-3 gap-6">
      {structures.map((structure) => (
        <div
          key={structure.id}
          onClick={(e) => onClickHandle(structure.id, structure.name, e)}
          className="rounded-lg bg-gradient-to-r from-gray-100 to-gray-200 hover:from-blue-50 hover:to-blue-100 hover:shadow-lg transition-all duration-300 relative group"
        >
          {/* Container for the visualization */}
          <div
            className={`w-full h-20 border-2 border-dotted border-gray-300 rounded-lg bg-white flex items-center justify-center overflow-hidden pl-3 pr-3 ${
              structure.id === "1-column"
                ? "grid-cols-1"
                : structure.id === "2-columns"
                ? "grid-cols-2"
                : structure.id === "3-columns"
                ? "grid-cols-3"
                : ""
            }`}
            style={{
              display: "grid",
              gap: "8px",
            }}
          >
            {/* For 1, 2, or 3 columns */}
            {structure.id !== "custom-columns" &&
              Array.from(
                {
                  length:
                    structure.id === "1-column"
                      ? 1
                      : structure.id === "2-columns"
                      ? 2
                      : 3,
                },
                (_, index) => (
                  <div
                    key={index}
                    className="w-full h-16 bg-gradient-to-r from-gray-200 to-gray-300 rounded-md shadow-sm transition-transform group-hover:scale-105 group-hover:from-blue-200 group-hover:to-blue-300"
                  ></div>
                )
              )}

            {/* ********************************************************************************************** */}
            
            {/* Custom Columns Input UI */}
            {structure.id === "custom-columns" && (
              <div id="t2" className="flex flex-col items-center justify-center p-4">
                <div className="flex items-center gap-2">
                  <input
                    type="number"
                    min="1"
                    max="10"
                    value={columnCount}
                    onClick={(e) => e.stopPropagation()}
                    onChange={(e) => setColumnCount(Number(e.target.value))}
                    placeholder="Columns"
                    className="w-16 border border-gray-300 rounded p-1 text-center"
                  />
                  <button
                    onClick={(e) => {
                      e.stopPropagation(); // Prevent click propagation
                      onClickHandle(structure.id, structure.name, e); // Handle Add logic
                      
                    }}
                    className="px-3 py-1 bg-blue-500 text-white text-sm rounded hover:bg-blue-600 transition-all"
                  >
                    Add
                  </button>
                </div>
                <span className="text-sm text-gray-500 mt-1">Enter Columns</span>
              </div>
            )}
          </div>
          {/* Subtle overlay effect */}
          <div className="absolute inset-0 opacity-0 group-hover:opacity-100 bg-blue-500 bg-opacity-10 rounded-lg transition duration-300"></div>
        </div>
      ))}
    </div>
  );
};

export default StructurePopup;


// import React, { useEffect } from "react";
// import { TbDragDrop2 } from "react-icons/tb";
// // import DropingArea from "./DropingArea";
// import { useSelector, useDispatch} from "react-redux";
// import {  } from "../redux/cardDragableSlice";
// import {  } from "../redux/cardDragableSlice";
// import { setActiveEditor } from "../redux/cardToggleSlice";

// import { useState } from "react";

// import Text from "./domElements/Text";
// import TextArea from "./domElements/TextArea";
// import Image from "./domElements/Image";
// import ColumnOne from "./domElements/ColumnOne";
// import ColumnTwo from "./domElements/ColumnTwo";
// import Button from "./domElements/Button";
// import ColumnThree from "./domElements/ColumnThree";

// import { setActiveWidgetId, setDroppedItems, setActiveWidgetName} from "../redux/cardDragableSlice";

// import { RxCross2 } from "react-icons/rx";

// import { deleteDroppedItemById } from "../redux/cardDragableSlice";

// import { generateSourceCode, generateInlineStyles} from "./generateSourceCode";

// const WrapperAttribute = () => {
//   const { activeWidgetName, droppedItems, activeWidgetId } = useSelector((state) => state.cardDragable);
//   const [sourceCode, setSourceCode] = useState("");


//   useEffect( ()=>{
//     renderWidget(activeWidgetName);
//   }, [activeWidgetName])
  
//   const { isColumnPopedUp } = useSelector((state) => state.cardToggle);
  
//   const dispatch = useDispatch();

//   const handleDrop = async (e) => {
//     e.preventDefault();
//     e.stopPropagation();
  
//     if (!activeWidgetName) return; // Ensure activeWidgetName is set before adding
  
//     // Dispatch to add the new widget/column to the array
//     dispatch(
//       setDroppedItems({
//         id: Date.now(), // Unique ID
//         name: activeWidgetName,
//         type: activeWidgetName.includes("column") ? activeWidgetName : "widget", // Set type for columns or widgets
//         parentId: null,
//         styles: {}
//       })

//     );

//     await dispatch(setActiveEditor(activeWidgetName));
//     await dispatch(setActiveWidgetName(activeWidgetName));
//     dispatch(setActiveWidgetId(activeWidgetId));


//   };

//   const onClickHandle = (e) => {
//     e.stopPropagation();
//     dispatch(setActiveWidgetName("wrapperAttribute"));
//     dispatch(setActiveEditor("wrapperAttribute"));
//   };

//   const handleDelete = (id) => {
//     dispatch(deleteDroppedItemById({parentId: id})); // Dispatch delete action with id
//   };

//   const handleShowSourceCode = () => {
//     const generatedCode = generateSourceCode(droppedItems);
//     setSourceCode(generatedCode);
//     // console.log("Generated Source Code:\n", generatedCode);
//   };

  
//   // Function to render the DOM element based on widget name
//   const renderWidget = (id, name) => {
//     switch (name) {
//       case "Text":
//         return (
//           <Text id={id}/>
//         );
//       case "TextArea":
//         return <TextArea id={id}/>
//       case "Button":
//         return <Button id={id}/>;
//       case "Image":
//         return <Image id={id}/>;
//       case "1-column":
//         return (
//           <ColumnOne handleDelete={()=>handleDelete(id)} id={id}/>
//         );
//       case "2-columns":
//         return (
//           <ColumnTwo handleDelete={()=>handleDelete(id)} id={id}/>
//         );
//       case "3-columns":
//         return (
//           <ColumnThree handleDelete={()=>handleDelete(id)} id={id}/>
//         );
//       default:
//         return <div className="text-gray-500">Unknown Widget</div>;
//     }
//   };

//   return (
//     <div
//       onDragOver={(e) => e.preventDefault()} // Allow drop
//       onDrop={handleDrop} // Handle drop event
//       className="w-[600px] min-h-[250px] border-2 rounded-lg bg-gray-100 p-1 relative hover:border-blue-500 transition-all pb-[50px]
//       h-auto"
//       style={{ paddingBottom: "10px", height: "auto" }}
//       onClick={onClickHandle}
//     >
//       {/* Drag-and-Drop Indicator */}
//       {droppedItems.map((item, index) => {
       
//           // Render widgets
//           return (
//             <div key={item.id} className="mb-2">
//               {renderWidget(item.id, item.name, handleDelete)}
//             </div>
//           );
        
//       })}
 
//     </div>
//   );
// };

// export default WrapperAttribute;









import React, { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { setDroppedItems, deleteDroppedItemById } from "../redux/cardDragableSlice";
import { setActiveWidgetName, setActiveWidgetId } from "../redux/cardDragableSlice";
import { setActiveColumn, setActiveParentId } from "../redux/cardDragableSlice";
import { setActiveEditor } from "../redux/cardToggleSlice";
import Text from "./domElements/Text";
import TextArea from "./domElements/TextArea";
import Image from "./domElements/Image";
import ColumnOne from "./domElements/ColumnOne";
import ColumnTwo from "./domElements/ColumnTwo";
import ColumnThree from "./domElements/ColumnThree";
import Button from "./domElements/Button";
import { RxCross2 } from "react-icons/rx";
import { generateSourceCode } from "./generateSourceCode";

const WrapperAttribute = () => {
  const { activeWidgetName, droppedItems, activeWidgetId } = useSelector((state) => state.cardDragable);
  const dispatch = useDispatch();
  const [sourceCode, setSourceCode] = useState("");

  useEffect(() => {
    renderWidget(activeWidgetName);
  }, [activeWidgetName]);

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (!activeWidgetName) return;
    dispatch(
      setDroppedItems({
        id: Date.now(),
        name: activeWidgetName,
        type: activeWidgetName.includes("column") ? activeWidgetName : "widget",
        parentId: null,
        styles: {},
      })
    );
    dispatch(setActiveEditor(activeWidgetName));
    dispatch(setActiveWidgetName(activeWidgetName));
    dispatch(setActiveWidgetId(activeWidgetId));
  };

  const handleShowSourceCode = () => {
    const generatedCode = generateSourceCode(droppedItems);
    setSourceCode(generatedCode);
  };

  // Render widgets with delete functionality
  const renderWidget = (id, name) => {
    let WidgetComponent;
    let additionalStyles = {};
  
    switch (name) {
      case "Text":
        WidgetComponent = <Text id={id} />;
        break;
      case "TextArea":
        WidgetComponent = <TextArea id={id} />;
        break;
      case "Button":
        WidgetComponent = <Button id={id} />;
        break;
      case "Image":
        WidgetComponent = <Image id={id} />;
        break;
      case "1-column":
        WidgetComponent = <ColumnOne id={id} />;
        additionalStyles = { position: "absolute", top: "-1px", right: "1px" }; // Fixed position for 1-column
        break;
      case "2-columns":
        WidgetComponent = <ColumnTwo id={id} />;
        additionalStyles = { position: "absolute", top: "-1px", right: "1px" }; // Fixed position for 2-columns
        break;
      case "3-columns":
        WidgetComponent = <ColumnThree id={id} />;
        additionalStyles = { position: "absolute", top: "-1px", right: "1px" }; // Fixed position for 3-columns
        break;
      default:
        WidgetComponent = <div className="text-gray-500">Unknown Widget</div>;
    }
  
    return (
      <div key={id} className="relative group border rounded mb-2"
      onClick={(e) => {
        e.stopPropagation();
        dispatch(setActiveColumn(null));
        dispatch(setActiveParentId(null));
      }}
      >
        {WidgetComponent}
        
        {/* Delete Button */}
        <button
          onClick={(e) => {
            e.stopPropagation();
            dispatch(deleteDroppedItemById({ parentId: id }));
          }}
          className="absolute top-2 right-2 text-white rounded-full opacity-0 bg-red-500 group-hover:opacity-100 transition-all duration-200"
          style={additionalStyles}
        >
          <RxCross2 size={14} />
        </button>
      </div>
    );
  };
  
  

  return (
    <div
      onDragOver={(e) => e.preventDefault()}
      onDrop={handleDrop}
      className="w-[600px] min-h-[250px] border-2 rounded-lg bg-gray-100 p-1 relative hover:border-blue-500 transition-all pb-[50px]"
    >
      {droppedItems.map((item) => renderWidget(item.id, item.name))}

    </div>
  );
};

export default WrapperAttribute;

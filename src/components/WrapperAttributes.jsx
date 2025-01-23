

import React, { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { setDroppedItems, deleteDroppedItemById } from "../redux/cardDragableSlice";
import { setActiveWidgetName, setActiveWidgetId } from "../redux/cardDragableSlice";
import { setActiveColumn, setActiveParentId } from "../redux/cardDragableSlice";
import { setActiveEditor, setColumnPopUp } from "../redux/cardToggleSlice";
import { FiGrid } from "react-icons/fi"; // Updated Icon

import Text from "./domElements/Text";
import TextArea from "./domElements/TextArea";
import Image from "./domElements/Image";
import ColumnOne from "./domElements/ColumnOne";
import ColumnTwo from "./domElements/ColumnTwo";
import ColumnThree from "./domElements/ColumnThree";
import Button from "./domElements/Button";
import Divider from "./domElements/Divider";
import Space from "./domElements/Space";
import SocialMedia from "./domElements/SocialMedia";

import { RxCross2 } from "react-icons/rx";
import { generateSourceCode } from "./generateSourceCode";

import { data } from "./domElements/data";
import { saveState } from "../redux/cardDragableSlice";

import StructurePopup from "./StructurePopup";
import { useRef } from "react";
import { setWrapperExtraPadding } from "../redux/condtionalCssSlice";
import { PiCircleNotchFill } from "react-icons/pi";
import { replaceDroppedItem } from "../redux/cardDragableSlice";


const WrapperAttribute = () => {

  const { activeWidgetName, droppedItems, activeWidgetId, activeParentId, activeColumn, widgetOrElement} = useSelector((state) => state.cardDragable);
  const {wrapperExtraPadding} = useSelector((state) => state.coditionalCssSlice);
  const {view} = useSelector( (state) => state.navbar );

  console.log("view in wrapperAttributes: ", view);

  const dispatch = useDispatch();
  const [sourceCode, setSourceCode] = useState("");
  const [showPopup, setShowPopup] = useState(false);

  const wrapperRef = useRef();


  // useEffect( ()=> {
  //   dispatch(saveState(data));
  // }, []);

  useEffect(() => {
    renderWidget(activeWidgetName);
  }, [activeWidgetName]);

  const handleDrop = (e) => {
    if (view === "tablet" || view === "mobile") return;

    e.preventDefault();
    e.stopPropagation();

    // if (!activeWidgetName) return;

    const droppedData = JSON.parse(e.dataTransfer.getData("text/plain"));
    console.log("droppedData in wrapperAttribute: ", droppedData);

    const defaultContent =
            activeWidgetName === "Text"
              ? "Design Beautiful Emails."
              : activeWidgetName === "TextArea"
              ? "Craft professional emails effortlessly with our drag-and-drop builder. Perfect for newsletters, promotions, and campaigns."
              : null; // Default to null if no specific content is needed
      
    if(widgetOrElement === 'element'){
      dispatch(
          setDroppedItems({
            id: Date.now(), 
            name: droppedData.name, 
            type: droppedData.type, 
            styles: droppedData.styles, 
            content: droppedData.content, 
            isActive: null
          }) 
        );

        dispatch(deleteDroppedItemById(
          {
            parentId: droppedData.parentId ? droppedData.parentId: droppedData.id, 
            childId: droppedData.parentId ? droppedData.id : null, 
            columnName: droppedData.column ? droppedData.column : null }
        ));
    }
    else{
      dispatch(
        setDroppedItems({
          id: Date.now(),
          name: activeWidgetName,
          type: activeWidgetName.includes("column") ? activeWidgetName : "widget",
          parentId: null,
          content: defaultContent,
          styles: {},
          isActive: null,
        })
      );
    }

    dispatch(setActiveEditor(activeWidgetName));
    dispatch(setActiveWidgetName(activeWidgetName));
    dispatch(setActiveWidgetId(activeWidgetId));
    dispatch(setWrapperExtraPadding(false));
  };

  // **********************************************************************
    const togglePopup = (e) => {
      // e.stopPropagation(); // Prevent triggering the parent's onClick
      setShowPopup(!showPopup);
      dispatch(setColumnPopUp(!showPopup)); // Update column popup state
    };
    const handleAddStructure = (structureType) => {
      setShowPopup(false); // Close the popup
    };
  // *********************************************************************
      const onClickOutside = () => {
        dispatch(setWrapperExtraPadding(false));
        
      };
      useEffect(() => {
        const handleClickOutside = (event) => {
          if (wrapperRef.current && !wrapperRef.current.contains(event.target)) {
            onClickOutside(); // Call the function when clicking outside
          }
        };
    
        document.addEventListener("mousedown", handleClickOutside);
        return () => {
          document.removeEventListener("mousedown", handleClickOutside);
        };
      }, []);
      // *****************************************************************************

  // Render widgets with delete functionality
  const renderWidget = (id, name) => {
    let WidgetComponent;
    let additionalStyles = {};

    console.log("name in renderWidget: ",name);
  
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
      case "Divider":
        WidgetComponent = <Divider id={id} />;
        break;
      case "SocialMedia":
        WidgetComponent = <SocialMedia id={id} />;
        break;
      case "Space":
        WidgetComponent = <Space id={id} />;
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
      <div key={id} className="relative group mb-2"
      onClick={(e) => {
        e.stopPropagation();
        dispatch(setActiveColumn(null));
        dispatch(setActiveParentId(null));
        console.log("WrapperAttributes called");
      }}
      >
        {WidgetComponent}
        
        {/* Delete Button */}
        <button
          onClick={(e) => {
            e.stopPropagation();
            if (view === "tablet" || view === "mobile") return;
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
    <>
      {
    view === 'tablet' 
  ? (
      <div className="flex justify-center items-center mt-[30px]">
        <div
          onDragOver={(e) => {
            if (view === "tablet" || view === "mobile") return; // Prevent interaction
            e.preventDefault();
          }}

          onDrop={handleDrop}
          onDragEnter={() => {
            console.log(
              "wrapperExtraPadding*****************: ",
              wrapperExtraPadding
            );
            dispatch(setWrapperExtraPadding(true));
          }}
          className={`relative w-[668px] max-w-[668px] min-h-[850px] bg-gray-100 rounded-[30px] border-4 border-black shadow-lg overflow-hidden ${
            wrapperExtraPadding ? "pb-[100px] border-dashed" : ""
          }`}
          style={{
            boxShadow: "0px 4px 15px rgba(0, 0, 0, 0.5)",
          }}
          ref={wrapperRef}
        >
          {/* App Bar */}
          <div className="absolute inset-0 h-[45px] bg-gray-500 flex items-center justify-center text-black font-bold text-xl z-20">
          <PiCircleNotchFill />
          </div>

          {/* Scrollable Content */}
          <div
            className="absolute top-[45px] w-full h-[calc(100%-45px)] overflow-y-scroll bg-gray-100 px-4"
            style={{
              scrollBehavior: "smooth",
              scrollbarWidth: "none", // Hides scrollbar in Firefox
              msOverflowStyle: "none", // Hides scrollbar in IE/Edge
            }}
          >
            {/* Hides scrollbar for webkit browsers */}
            <style>{`
              ::-webkit-scrollbar {
                display: none;
              }
            `}</style>

            {/* Render Dropped Items */}
            <div className="w-full">
              {droppedItems.map((item) => renderWidget(item.id, item.name))}
            </div>
          </div>
        </div>
      </div>
      ) 
  : view === 'mobile' 
    ? (
      <div className="flex justify-center items-center mt-[50px]">
        <div
          
          className={`relative w-[375px] min-h-[700px] bg-gray-100 mx-auto rounded-[50px] border-4 border-black shadow-lg overflow-hidden ${
            wrapperExtraPadding ? "pb-[100px] border-dashed" : ""
          }`}
          
        >
          {/* Mobile App Bar */}
          <div className="absolute inset-0 h-[50px] bg-gray-500 flex items-center justify-center font-bold text-lg z-20 text-black">
            <PiCircleNotchFill />
          </div>

          {/* Scrollable Content */}
          <div
            className="absolute top-[50px] w-full h-[calc(100%-50px)] overflow-y-scroll bg-gray-100"
            style={{
              scrollBehavior: "smooth",
              scrollbarWidth: "none", // Hides scrollbar in Firefox
              msOverflowStyle: "none", // Hides scrollbar in IE/Edge
            }}
          >
            {/* Hides scrollbar for webkit browsers */}
            <style>{`
              ::-webkit-scrollbar {
                display: none;
              }
            `}</style>

            {/* Render Dropped Items */}
            <div className="w-full">
              {droppedItems.map((item) => renderWidget(item.id, item.name))}
            </div>

          </div>

        </div>
      </div>
      ) 
    : (
        <div
            onDragOver={(e) => e.preventDefault()}
            onDrop={handleDrop}
            onDragEnter={()=>{
              // console.log("wrapperExtraPadding*****************: ", wrapperExtraPadding);
              dispatch(setWrapperExtraPadding(true));
            }}
            className={`w-[600px] min-h-[250px] border-2 rounded-lg bg-gray-100 p-1 mb-[300px] absolute hover:border-blue-500 transition-all h-auto
              ${wrapperExtraPadding ? "pb-[150px] border-2 border-dashed-500" : ""}
            `}

            ref={wrapperRef}
           
          >
            {/* Render Dropped Items */}
            {droppedItems.map((item) => {
              console.log("widgetOrElement in wrapperAttribute: ", widgetOrElement);
              if(item){
                return renderWidget(item.id, item.name);
              }
              else{
                return;
              }
            } )}

            {/* Structure Popup */}
            {showPopup && (
              <StructurePopup onClose={togglePopup} onAdd={handleAddStructure} />
            )}

            {/* Add Button */}
            <div
              className="absolute left-1/2 transform -translate-x-1/2 mt-4"
              style={{ bottom: "-55px" }} // Adjust this value to control spacing from the bottom of the parent div
            >
              <button
                className="bg-blue-500 text-white p-3 rounded-full shadow-md hover:bg-blue-600 transition duration-200 flex items-center"
                onClick={togglePopup} // Handle click and prevent propagation
              >
                <FiGrid className="text-2xl" /> {/* Column popup Icon */}
              </button>
            </div>
        </div>
      )

  }

    </>
  )
  
};

export default WrapperAttribute;

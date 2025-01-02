import React, { useState } from "react";
import WrapperAttribute from "./WrapperAttributes";
import StructurePopup from "./StructurePopup";
import { FiGrid } from "react-icons/fi"; // Updated Icon
import { setActiveEditor, setColumnPopUp } from "../redux/cardToggleSlice";
import { setActiveWidgetName } from "../redux/cardDragableSlice";
import { useDispatch } from "react-redux";

const PageAttribute = () => {
  const [showPopup, setShowPopup] = useState(false);

  const dispatch = useDispatch();

  const handleAddStructure = (structureType) => {
    setShowPopup(false); // Close the popup
  };

  const togglePopup = (e) => {
    // e.stopPropagation(); // Prevent triggering the parent's onClick
    setShowPopup(!showPopup);
    dispatch(setColumnPopUp(!showPopup)); // Update column popup state
  };

  const onClickHandle = (e) => {
    // e.stopPropagation();
    dispatch(setActiveWidgetName("pageAttribute"))
    dispatch(setActiveEditor("pageAttribute"))
  }

  return (
    <div
      className={`w-full h-full border-2 border-blue-300 rounded-lg bg-gray-100 flex flex-col items-center hover:border-blue-500 transition-all relative
        h-screen overflow-y-auto`}
      style={{ paddingBottom: "10px", height: "100vh" }}
      onClick={onClickHandle}
    >
      {/* WrapperAttribute Component */}
      <WrapperAttribute />

      {/* Add Button */}
      <div className="flex justify-center mt-4">
        <button
          className="bg-blue-500 text-white p-3 rounded-full shadow-md hover:bg-blue-600 transition duration-200 flex items-center"
          onClick={togglePopup} // Handle click and prevent propagation
        >
          <FiGrid className="text-2xl" /> {/* Column popup Icon */}
        </button>
      </div>

      {/* Structure Popup */}
      {showPopup && (
        <StructurePopup onClose={togglePopup} onAdd={handleAddStructure} />
      )}
    </div>
  );
};

export default PageAttribute;

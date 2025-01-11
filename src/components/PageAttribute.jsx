import React, { useState } from "react";
import WrapperAttribute from "./WrapperAttributes";
import StructurePopup from "./StructurePopup";
import { FiGrid } from "react-icons/fi"; // Updated Icon
import { setActiveEditor, setColumnPopUp } from "../redux/cardToggleSlice";
import { setActiveWidgetName } from "../redux/cardDragableSlice";
import { useDispatch } from "react-redux";
import { setActiveBorders } from "../redux/activeBorderSlice";

const PageAttribute = () => {

  const dispatch = useDispatch();


  const onClickHandle = (e) => {
    // e.stopPropagation();
    dispatch(setActiveWidgetName("pageAttribute"))
    dispatch(setActiveEditor("pageAttribute"))

    dispatch(setActiveBorders(null));

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

    </div>
  );
};

export default PageAttribute;

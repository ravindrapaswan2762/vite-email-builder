import React, { useState } from "react";
import WrapperAttribute from "./WrapperAttributes";
import StructurePopup from "./StructurePopup";
import { FiGrid } from "react-icons/fi"; // Updated Icon
import { setActiveEditor, setColumnPopUp } from "../redux/cardToggleSlice";
import { setActiveWidgetName } from "../redux/cardDragableSlice";
import { useDispatch } from "react-redux";
import { setActiveBorders } from "../redux/activeBorderSlice";

import { setActiveWidgetId } from "../redux/cardDragableSlice";
import { setActiveParentId } from "../redux/cardDragableSlice";
import { setActiveColumn } from "../redux/cardDragableSlice";

import { setColumnOneExtraPadding } from "../redux/condtionalCssSlice";
import { setColumnTwoExtraPadding } from "../redux/condtionalCssSlice";
import { setColumnThreeExtraPadding } from "../redux/condtionalCssSlice";
import { setWrapperExtraPadding } from "../redux/condtionalCssSlice";
import { setSmallGapInTop } from "../redux/condtionalCssSlice";

import { setHoverColumnInCC } from "../redux/condtionalCssSlice";
import { setHoverParentInCC } from "../redux/condtionalCssSlice";
import { setPaddingTopInCC } from "../redux/condtionalCssSlice";
import { setPaddingBottom } from "../redux/condtionalCssSlice";

import VideoPlayer from "./VideoPlayer";
import VideoEditor from "../editors/VideoEditor";


const PageAttribute = () => {

  const dispatch = useDispatch();


  const onClickHandle = (e) => {
    e.stopPropagation();
    e.preventDefault();
    dispatch(setActiveWidgetName("pageAttribute"))
    dispatch(setActiveEditor("pageAttribute"))

    dispatch(setActiveBorders(null));
    dispatch(setActiveWidgetId(null));
    dispatch(setActiveParentId(null));
    dispatch(setActiveColumn(null));

    dispatch(setColumnOneExtraPadding(false));
    dispatch(setColumnTwoExtraPadding(false));
    dispatch(setColumnThreeExtraPadding(false));
    dispatch(setWrapperExtraPadding(false));

    dispatch(setSmallGapInTop(null));

    dispatch(setHoverColumnInCC(null));
    dispatch(setHoverParentInCC(null));
    dispatch(setPaddingTopInCC(null));
    dispatch(setPaddingBottom(null));



  }

  return (
    <div
      className={`w-full h-full border-2 border-blue-300 rounded-lg bg-gray-100 flex flex-col items-center hover:border-blue-500 transition-all relative
        h-screen overflow-y-auto pt-2`}
      style={{ paddingBottom: "10px", height: "100vh", position: "relative",
      }}
      onClick={onClickHandle}
    >
      {/* WrapperAttribute Component */}
      <WrapperAttribute />

      {/* <VideoPlayer videoUrl="https://www.youtube.com/watch?v=XHOmBV4js_E" /> */}
    </div>
  );
};

export default PageAttribute;

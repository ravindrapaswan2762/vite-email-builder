import React, { useState } from "react";
import { FaDesktop, FaTabletAlt, FaMobileAlt } from "react-icons/fa";

import { setLeftTab, setRightTab, setView} from "../redux/navbarSlice";
import { useDispatch, useSelector } from "react-redux";

import SaveButton from "./SaveButton";
import ExitButton from "./ExitButton";
import ClearElements from "./ClearElements";

import { setActiveBorders } from "../redux/activeBorderSlice";
import { setActiveWidgetId } from "../redux/cardDragableSlice";
import { setActiveParentId } from "../redux/cardDragableSlice";
import { setActiveColumn } from "../redux/cardDragableSlice";
import { setActiveNodeList } from "../redux/treeViewSlice";

import { setSmallGapInTop } from "../redux/condtionalCssSlice";

import { setHoverColumnInCC } from "../redux/condtionalCssSlice";
import { setHoverParentInCC } from "../redux/condtionalCssSlice";
import { setPaddingTopInCC } from "../redux/condtionalCssSlice";



const Navbar = () => {

  const {view} = useSelector( (state) => state.navbar );

  const {activeLeftTab, activeRightTab} = useSelector( (state) => state.navbar);
  const dispatch = useDispatch();

  const resetAllActiveElement = () =>{
    console.log("resetAllActiveElement called!");
    dispatch(setActiveBorders(null));
    dispatch(setActiveWidgetId(null));
    dispatch(setActiveParentId(null));
    dispatch(setActiveColumn(null));
    dispatch(setActiveNodeList(null));
    dispatch(setSmallGapInTop(null));

    dispatch(setHoverColumnInCC(null));
    dispatch(setHoverParentInCC(null));
    dispatch(setPaddingTopInCC(null));
  }

  return (
    <div className="flex justify-between items-center bg-gray-100 text-gray-700 p-6 shadow-lg" 
      onClick={()=>{
        dispatch(setActiveWidgetId(null));
        resetAllActiveElement();
      }}>
      {/* Left Navbar Section */}
      <div className="flex items-center gap-6 pr-8">
        {["Contents", "Elements"].map((tab) => (
          <div
            key={tab}
            className={`cursor-pointer px-6 py-2 font-semibold ${
              activeLeftTab === tab
                ? "text-blue-600 bg-gray-200 border-b-2 border-blue-600"
                : "hover:bg-gray-200"
            } rounded transition-all`}
            onClick={() => {
              dispatch( setLeftTab(tab));
              resetAllActiveElement();
            }}
          >
            {tab}
          </div>
        ))}
      </div>

      {/* Middle Navbar Section */}
      <div className="flex items-center gap-8 border-gray-300 px-12">
      <ExitButton />
      {[
        { view: "desktop", icon: <FaDesktop /> },
        { view: "tablet", icon: <FaTabletAlt /> },
        { view: "mobile", icon: <FaMobileAlt /> },
      ].map(({ view: tabView, icon }) => (
        <div
          key={tabView}
          className={`text-2xl cursor-pointer ${
            view === tabView ? "text-blue-600" : "text-gray-400"
          } hover:text-blue-600 transition-all`}
          onClick={() => {
            dispatch(setView(tabView));
            resetAllActiveElement();
          }}
        >
          {icon}
        </div>
      ))}

       <ClearElements />
       <SaveButton />

    </div>
      

      {/* Right Navbar Section */}
      <div className="flex items-center gap-6 pl-8 pr-8">
        {["Editor", "Source Code"].map((tab) => (
          <div
            key={tab}
            className={`cursor-pointer px-6 py-2 font-semibold ${
              activeRightTab === tab
                ? "text-blue-600 bg-gray-200 border-b-2 border-blue-600"
                : "hover:bg-gray-200"
            } rounded transition-all`}
            onClick={() => {
              dispatch( setRightTab(tab));
              resetAllActiveElement();
            }}
          >
            {tab}
          </div>
        ))}
      </div>
    </div>
  );
};

export default Navbar;

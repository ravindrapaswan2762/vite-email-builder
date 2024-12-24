import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { setActiveWidgetId, setActiveWidgetName } from "../redux/cardDragableSlice";

const Widget = ({ id, name, icon: Icon }) => {
  const dispatch = useDispatch();

  // Get the activeWidgetId from Redux state
  const { activeWidgetId } = useSelector((state) => state.cardDragable);

  // Check if the current widget is active
  const isActive = activeWidgetId === id;

  return (
    <div
      draggable
      onDragStart={(e) => {
        e.dataTransfer.setData("text/plain", name); // Pass widget ID
        e.dataTransfer.effectAllowed = "move"; // Allow move
        dispatch(setActiveWidgetName(name));
      }}
      
      onDragEnd={() => dispatch(setActiveWidgetId(null))} // Reset active widget
      className={`flex flex-col items-center justify-center p-5 m-2 border rounded-lg shadow-md cursor-move w-[115px] h-[90px] transition-all ${
        isActive
          ? "bg-gradient-to-br from-blue-200 text-white border-blue-700 shadow-lg scale-105"
          : "bg-white text-gray-800 border-gray-300 hover:shadow-md"
      }`}
    >
      <div className="text-black text-2xl">
        <Icon />
      </div>
      <span className="text-sm font-medium text-gray-800 text-center">
        {name}
      </span>
    </div>
  );
};

export default Widget;

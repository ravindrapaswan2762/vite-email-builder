// ClearButton.jsx
import React from "react";
import { useDispatch } from "react-redux";
import { clearState } from "../redux/cardDragableSlice";

function ClearElements() {
  const dispatch = useDispatch();

  const handleClear = () => {
    dispatch(clearState());
  };

  return (
    <button
      onClick={handleClear}
      className="px-3 py-1 bg-red-400 text-white rounded-md hover:bg-red-500 transition-colors"
    >
      Clear
    </button>
  );
}

export default ClearElements;

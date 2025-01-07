import React from "react";
import { useDispatch } from "react-redux";

import { setSelectTeplate } from "../redux/menubarSlice";
import { setBuilder } from "../redux/addTemplateSlice";
import { setViewClick } from "../redux/addTemplateSlice";

function ExitButton() {

  const dispatch = useDispatch();
  const handleExit = () => {

    const confirmExit = window.confirm(
      "Data is not saved. Are you sure you want to exit?"
    );

    if (confirmExit) {
      dispatch(setSelectTeplate(null));
      dispatch(setBuilder(null));
      dispatch(setViewClick(null));
    }
  };

  return (
    <button
    onClick={handleExit}
    className="px-3 py-1 bg-gray-500 text-white rounded-md hover:bg-gray-600 transition-colors"
    >
  Exit
</button>

  );
}

export default ExitButton;

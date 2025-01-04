import React from "react";
import { setSelectTeplate } from "../redux/menubarSlice";
import { useDispatch } from "react-redux";

function ExitButton() {

  const dispatch = useDispatch();
  const handleExit = () => {

    const confirmExit = window.confirm(
      "Data is not saved. Are you sure you want to exit?"
    );

    if (confirmExit) {
      dispatch(setSelectTeplate(null));
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

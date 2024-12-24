import React, { useState } from "react";
import { useDispatch } from "react-redux";
import { RxCross2 } from "react-icons/rx";
import { deleteDroppedItemById } from "../../redux/cardDragableSlice";

import { setActiveWidgetName } from "../../redux/cardDragableSlice";
import { setActiveEditor } from "../../redux/cardToggleSlice";
import { setActiveWidgetId } from "../../redux/cardDragableSlice";
import { useSelector } from "react-redux";

const Button = ({ id }) => {

  const { activeWidgetId, droppedItems } = useSelector((state) => state.cardDragable);

  const dispatch = useDispatch();
 
  const [text, setText] = useState("Submit");

  const currentStyles = droppedItems.find((item) => item.id === id)?.styles || {};

  const handleClick = (e) => {
    e.stopPropagation();
    dispatch(setActiveWidgetName("Button"));
    dispatch(setActiveEditor("Button"));
    dispatch(setActiveWidgetId(id));

    console.log("updated state: ", droppedItems)

    // window.open(`${currentStyles.href}`, `${currentStyles.target}`, "noopener,noreferrer")
  };



  return (
    <div className="flex justify-center w-full"  style={{backgroundColor: `${currentStyles.backgroundColor}`}}>
      {/* Outer Container with Dashed Border */}
      <div className="relative w-full h-[50px] border border-2 border-gray-300 flex items-center p-1" 
              style={{ display: "flex", alignItems: "center", justifyContent: `${currentStyles.textAlign}`, height: "auto"}}

              >
        {/* Editable Text Button */}
        {(
          <button
            onClick={handleClick}
            style={{...currentStyles, backgroundColor: `${currentStyles.buttonColor}`}}
            className="relative bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600 transition duration-200 text-center"
          >
            {/* Delete Button Inside the Button */}
            <span
              onClick={(e) => {
                e.stopPropagation();
                dispatch(deleteDroppedItemById(id));
              }}
              className="absolute -top-3 -right-3 bg-grey-500 text-black p-1 rounded-full hover:bg-grey-600 cursor-pointer"
            >
              <RxCross2 size={14} />
            </span>
            {currentStyles.content ? currentStyles.content : "Submit"}
          </button>
        )}
      </div>
    </div>
  );
};

export default Button;

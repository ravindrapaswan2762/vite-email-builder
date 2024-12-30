import React, { useState } from "react";
import { useDispatch } from "react-redux";
import { RxCross2 } from "react-icons/rx";

import { deleteDroppedItemById, setActiveWidgetId, setActiveWidgetName} from "../../redux/cardDragableSlice";

const TextArea = ({ id }) => {
  const [val, setVal] = useState("Make it easy for everyone to compose emails!");
  const [hoveredElement, setHoveredElement] = useState(false); // Hover state

  const dispatch = useDispatch();

  const handleInputChange = (e) => {
    setVal(e.target.value);
  };

  const onclickHandle = (e) => {
    e.stopPropagation();
    dispatch(setActiveWidgetName("TextArea"));
    dispatch(setActiveEditor("TextArea"));
    dispatch(setActiveWidgetId(id));

    console.log("droppedItems: ", droppedItems);
  };

  const onMouseEnterHandler = () => setHoveredElement(true);
  const onMouseLeaveHandler = () => setHoveredElement(false);

  return (
    <div
      className={`relative rounded w-full bg-gray-50 border transition-all duration-300`}
      onMouseEnter={onMouseEnterHandler}
      onMouseLeave={onMouseLeaveHandler}
      onClick={(e) => e.stopPropagation()}
    >

      {/* Text Area */}
      <textarea
        onChange={handleInputChange}
        onClick={onclickHandle}
        className={`border p-2 rounded w-full focus:outline-none ${hoveredElement ? "hover:border hover:border-dashed hover:border-blue-500" : ""}`}
        placeholder="Text Area"
        value={val}
      />
    </div>
  );
};

export default TextArea;

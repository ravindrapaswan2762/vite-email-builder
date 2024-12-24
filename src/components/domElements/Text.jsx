// import React, { useState } from "react";
// import { setActiveWidgetName } from "../../redux/cardDragableSlice";
// import { setActiveEditor } from "../../redux/cardToggleSlice";
// import { RxCross2 } from "react-icons/rx";
// import { deleteDroppedItemById } from "../../redux/cardDragableSlice";
// import { setActiveWidgetId } from "../../redux/cardDragableSlice";

// import { useDispatch, useSelector } from "react-redux";

// const Text = ({id}) => {

//     const [val, setVal] = useState("Make it easy for everyone to compose emails!");

//     const { activeWidgetId, droppedItems } = useSelector((state) => state.cardDragable);

//     const dispatch = useDispatch();


//     const onclickHandle = (e) =>{
//         e.stopPropagation()
//         dispatch(setActiveWidgetName("Text"));
//         dispatch(setActiveEditor("Text"));
//         dispatch(setActiveWidgetId(id));
//     }
//     const onChangeHandle = (e) =>{
//         e.stopPropagation()
//         setVal(e.target.value);
//     }

//     return (
//         <div>
//            <button
//                 onClick={()=>dispatch(deleteDroppedItemById(id))}
//                 className="absolute right-2 text-white p-1 rounded-full transition-all duration-200 z-10"
//                 >
//                 <div className="text-black mb-2 ml-2"><RxCross2 size={18} /></div>
//             </button>
            
//             <input onClick={onclickHandle}
//             onChange={onChangeHandle}
//             type="text"
//             className="border p-2 rounded w-full"
//             placeholder="Text Field"
//             value={val}
//           />
//         </div>
//     )
// }

// export default Text;


import React, { useState } from "react";
import { setActiveWidgetName } from "../../redux/cardDragableSlice";
import { setActiveEditor } from "../../redux/cardToggleSlice";
import { RxCross2 } from "react-icons/rx";
import { deleteDroppedItemById } from "../../redux/cardDragableSlice";
import { setActiveWidgetId } from "../../redux/cardDragableSlice";

import { useDispatch, useSelector } from "react-redux";

const Text = ({ id }) => {
  const [val, setVal] = useState("Make it easy for everyone to compose emails!");

  const { activeWidgetId, droppedItems } = useSelector((state) => state.cardDragable);

  const dispatch = useDispatch();

  // Find the current element's styles based on the ID
  const currentStyles = droppedItems.find((item) => item.id === id)?.styles || {};

  const onclickHandle = (e) => {
    e.stopPropagation();
    dispatch(setActiveWidgetName("Text"));
    dispatch(setActiveEditor("Text"));
    dispatch(setActiveWidgetId(id));

    console.log("droppedItems: ", droppedItems);
  };

  const onChangeHandle = (e) => {
    e.stopPropagation();
    setVal(e.target.value);
  };

  return (
    <div style={{ position: "relative"}}>
      {/* Delete Button */}
      <button
        onClick={() => dispatch(deleteDroppedItemById(id))}
        className="absolute right-2 text-white p-1 rounded-full transition-all duration-200 z-10"
      >
        <div className="text-black mb-2 ml-2">
          <RxCross2 size={18} />
        </div>
      </button>

      {/* Input Field */}
      <input
        onClick={onclickHandle}
        onChange={onChangeHandle}
        type="text"
        className="border p-2 rounded w-full"
        placeholder="Text Field"
        value={val}
        style={currentStyles} // Apply dynamic styles
      />
    </div>
  );
};

export default Text;

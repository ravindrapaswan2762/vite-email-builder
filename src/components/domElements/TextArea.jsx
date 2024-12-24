import React, { useState } from "react";
import { deleteDroppedItemById } from "../../redux/cardDragableSlice";
import { useDispatch } from "react-redux";
import { RxCross2 } from "react-icons/rx";

const TextArea = ({id}) => {

    const [val, setVal] = useState("Make it easy for everyone to compose emails!");

    const dispatch = useDispatch();

    const onclickHandle = (e) =>{
        setVal(e.target.value)
    }

    return (
        <div>
            <button
                onClick={()=>dispatch(deleteDroppedItemById(id))}
                className="absolute right-2 text-white p-1 rounded-full transition-all duration-200 z-10"
                >
                <div className="text-black mb-2 ml-2"><RxCross2 size={18} /></div>
            </button>

            <textarea 
            onClick={(e)=>e.stopPropagation()}
            onChange={(e)=>onclickHandle(e)}
            className="border p-2 rounded w-full" placeholder="Text Area" 
            value={val}
            />
        </div>
    )
}

export default TextArea;
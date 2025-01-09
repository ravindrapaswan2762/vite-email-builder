import React from "react";
import { setActiveEditor } from "../redux/cardToggleSlice";
import { useDispatch } from "react-redux";
import { setActiveWidgetName, setActiveWidgetId } from "../redux/cardDragableSlice";
import { setDroppedItems } from "../redux/cardDragableSlice";
import { setActiveBorders } from "../redux/activeBorderSlice";

const StructurePopup = ({ onClose, onAdd, id}) => {

  const dispatch = useDispatch();

  const structures = [
    { id: "1-column", name: "1-column", label: "1 Column"},
    { id: "2-columns", name: "2-columns", label: "2 Columns" },
    { id: "3-columns", name: "3-columns", label: "3 Columns" },
  ];

  const onClickHandle = (structureId, name, e) =>{
    e.stopPropagation();
    console.log("structureId: ",structureId);

    dispatch(setActiveEditor("sectionEditor"));
    dispatch(setActiveWidgetName(name));
    if(name === '1-column'){
      dispatch(setDroppedItems({id:  Date.now(), name: name, parentId: id, type: "1-column"}));
    }
    else if(name === '2-columns'){
      dispatch(setDroppedItems({id:  Date.now(), name: name, parentId: id, type: "2-columns"}));
    }
    else if(name === '3-columns'){
      dispatch(setDroppedItems({id:  Date.now(), name: name, parentId: id, type: "3-columns"}));
    }
    onAdd(structureId);

    dispatch(setActiveBorders(true));

  }

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
      <div className="bg-white p-6 rounded-lg shadow-lg w-1/2">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-bold">Select Your Structure</h3>
          <button
            onClick={onClose}
            className="text-red-500 font-bold text-xl hover:text-red-600"
          >
            ×
          </button>
        </div>
        <div className="grid grid-cols-3 gap-4">
          {structures.map((structure) => (
            <button
              key={structure.id}
              onClick={(e)=>onClickHandle(structure.id, structure.name, e)}
              className="p-4 border rounded-lg hover:bg-gray-100 text-center"
            >
              {structure.label}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default StructurePopup;

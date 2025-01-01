import React, { useState, useEffect } from "react";
import { FiChevronDown, FiChevronRight } from "react-icons/fi";
import { useDispatch, useSelector } from "react-redux";
import { updateElementStyles } from "../redux/cardDragableSlice";

const SpacerEditOption = () => {
  const [isDimensionOpen, setIsDimensionOpen] = useState(true);
  const [isBackgroundOpen, setIsBackgroundOpen] = useState(true);
  const [isExtraOpen, setIsExtraOpen] = useState(true);

  const dispatch = useDispatch();
  const { activeWidgetId, activeParentId, activeColumn, droppedItems } = useSelector((state) => state.cardDragable);

  const selectedElement =
    droppedItems.find((item) => item.id === activeWidgetId) || {};

  const [fields, setFields] = useState({
    height: "20px",
    paddingTop: "",
    paddingBottom: "",
    paddingLeft: "",
    paddingRight: "",
    backgroundColor: "",
    className: "",
  });

  useEffect(() => {
    if (selectedElement.styles) {
      setFields((prev) => ({
        ...prev,
        ...selectedElement.styles,
      }));
    }
  }, [selectedElement]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;

    const updatedValue =
      name.includes("padding") || name === "height"
        ? value && !value.includes("px")
          ? `${value}px`
          : value
        : value;

    setFields((prev) => ({
      ...prev,
      [name]: updatedValue,
    }));

    dispatch(
      updateElementStyles({
        id: activeWidgetId,
        styles: { [name]: updatedValue },
        ...(activeParentId && { parentId: activeParentId }),
        ...(activeColumn && { column: activeColumn }),
      })
    );
  };

  return (
    <div className="w-full max-w-md p-6 bg-white border rounded-lg shadow-lg h-screen overflow-y-auto">
      <h2 className="text-lg font-bold text-gray-800 mb-4">Spacer Attributes</h2>

      {/* Dimension Section */}
      <div className="p-4 m-1 bg-gray-100 rounded-lg">
        <div
          className="flex items-center justify-between cursor-pointer"
          onClick={() => setIsDimensionOpen(!isDimensionOpen)}
        >
          <h3 className="text-md font-bold text-gray-700">Dimension</h3>
          <button className="text-gray-500 focus:outline-none">
            {isDimensionOpen ? <FiChevronDown /> : <FiChevronRight />}
          </button>
        </div>
        {isDimensionOpen && (
          <div className="mt-3 space-y-4">
            <div>
              <label className="block text-sm font-bold text-gray-600 mb-1">Height (px)</label>
              <input
                type="number"
                name="height"
                value={fields.height.replace("px", "")}
                onChange={handleInputChange}
                className="w-full p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-300"
              />
            </div>
            <div>
              <label className="block text-sm font-bold text-gray-600 mb-1">Padding</label>
              <div className="grid grid-cols-2 gap-4">
                {["Top", "Bottom", "Left", "Right"].map((direction) => (
                  <div key={direction}>
                    <label className="block text-sm font-bold text-gray-600">
                      {direction} (px)
                    </label>
                    <input
                      type="number"
                      name={`padding${direction}`}
                      value={fields[`padding${direction}`]?.replace("px", "")}
                      onChange={handleInputChange}
                      className="w-full p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-300"
                    />
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Background Section */}
      <div className="p-4 m-1 bg-gray-100 rounded-lg">
        <div
          className="flex items-center justify-between cursor-pointer"
          onClick={() => setIsBackgroundOpen(!isBackgroundOpen)}
        >
          <h3 className="text-md font-bold text-gray-700">Background</h3>
          <button className="text-gray-500 focus:outline-none">
            {isBackgroundOpen ? <FiChevronDown /> : <FiChevronRight />}
          </button>
        </div>
        {isBackgroundOpen && (
          <div className="mt-3">
            <label className="block text-sm font-bold text-gray-600 mb-1">Background Color</label>
            <input
              type="color"
              name="backgroundColor"
              value={fields.backgroundColor}
              onChange={handleInputChange}
              className="w-full p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-300"
            />
          </div>
        )}
      </div>

      {/* Extra Section */}
      <div className="p-4 m-1 bg-gray-100 rounded-lg">
        <div
          className="flex items-center justify-between cursor-pointer"
          onClick={() => setIsExtraOpen(!isExtraOpen)}
        >
          <h3 className="text-md font-bold text-gray-700">Extra</h3>
          <button className="text-gray-500 focus:outline-none">
            {isExtraOpen ? <FiChevronDown /> : <FiChevronRight />}
          </button>
        </div>
        {isExtraOpen && (
          <div className="mt-3">
            <label className="block text-sm font-bold text-gray-600 mb-1">Class Name</label>
            <input
              type="text"
              name="className"
              value={fields.className}
              onChange={handleInputChange}
              className="w-full p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-300"
            />
          </div>
        )}
      </div>
    </div>
  );
};

export default SpacerEditOption;

import React, { useState, useEffect } from "react";
import { FiChevronDown, FiChevronRight } from "react-icons/fi";
import { useDispatch, useSelector } from "react-redux";
import { updateElementStyles } from "../redux/cardDragableSlice";
import { useMemo } from "react";

const SpacerEditOption = () => {
  const [isDimensionOpen, setIsDimensionOpen] = useState(true);
  const [isBackgroundOpen, setIsBackgroundOpen] = useState(true);
  const [isExtraOpen, setIsExtraOpen] = useState(true);

  const dispatch = useDispatch();
  const { activeWidgetId, activeParentId, activeColumn, droppedItems } = useSelector((state) => state.cardDragable);

  // Find the currently selected element from Redux state recursively
  const findElementById = (items, widgetId) => {
    for (const item of items) {
      if (item.id === widgetId) {
        return item;
      }
      // Check for nested children
      const nestedKeys = Object.keys(item).filter((key) => key.startsWith("children"));
      for (const key of nestedKeys) {
        const found = findElementById(item[key], widgetId);
        if (found) {
          return found;
        }
      }
    }
    return null;
  }

  // Memoized selectedElement to ensure stability
  const selectedElement = useMemo(() => findElementById(droppedItems, activeWidgetId) || {}, [droppedItems, activeWidgetId]);

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
    const defaultFields = {
      height: "20px",
      paddingTop: "",
      paddingBottom: "",
      paddingLeft: "",
      paddingRight: "",
      backgroundColor: "",
      className: "",
    };
  
    if (selectedElement.styles) {
      const newFields = {
        height: selectedElement.styles.height || "20px",
        paddingTop: selectedElement.styles.paddingTop || "",
        paddingBottom: selectedElement.styles.paddingBottom || "",
        paddingLeft: selectedElement.styles.paddingLeft || "",
        paddingRight: selectedElement.styles.paddingRight || "",
        backgroundColor: selectedElement.styles.backgroundColor || "",
        className: selectedElement.styles.className || "",
      };
  
      // Update fields only if they are different from the current state
      if (JSON.stringify(fields) !== JSON.stringify(newFields)) {
        setFields(newFields);
      }
    } else if (JSON.stringify(fields) !== JSON.stringify(defaultFields)) {
      // Reset to default values if no styles are found
      setFields(defaultFields);
    }
  }, [selectedElement.styles]);
  
  

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

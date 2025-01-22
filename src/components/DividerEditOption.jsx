import React, { useState, useEffect } from "react";
import { FiChevronDown, FiChevronRight } from "react-icons/fi";
import { useDispatch, useSelector } from "react-redux";
import { updateElementStyles } from "../redux/cardDragableSlice";
import { useMemo } from "react";

const DividerEditOption = () => {
  const [isDimensionOpen, setIsDimensionOpen] = useState(true);
  const [isBorderOpen, setIsBorderOpen] = useState(true);
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
    width: "",
    align: "center",
    paddingTop: "10px",
    paddingBottom: "10px",
    paddingLeft: "0px",
    paddingRight: "0px",
    borderWidth: "1px",
    borderStyle: "solid",
    borderColor: "#000000",
    backgroundColor: "#FFFFFF",
    className: "",
  });

  useEffect(() => {
    if (selectedElement.styles) {
      const newFields = {
        width: selectedElement.styles.width || "",
        align: selectedElement.styles.align || "center",
        paddingTop: selectedElement.styles.paddingTop || "10px",
        paddingBottom: selectedElement.styles.paddingBottom || "10px",
        paddingLeft: selectedElement.styles.paddingLeft || "0px",
        paddingRight: selectedElement.styles.paddingRight || "0px",
        borderWidth: selectedElement.styles.borderWidth || "1px",
        borderStyle: selectedElement.styles.borderStyle || "solid",
        borderColor: selectedElement.styles.borderColor || "#000000",
        backgroundColor: selectedElement.styles.backgroundColor || "#FFFFFF",
        className: selectedElement.styles.className || "",
      };
  
      // Only update state if there are meaningful changes
      if (JSON.stringify(fields) !== JSON.stringify(newFields)) {
        setFields(newFields);
      }
    } else {
      const defaultFields = {
        width: "",
        align: "center",
        paddingTop: "10px",
        paddingBottom: "10px",
        paddingLeft: "0px",
        paddingRight: "0px",
        borderWidth: "1px",
        borderStyle: "solid",
        borderColor: "#000000",
        backgroundColor: "#FFFFFF",
        className: "",
      };
  
      // Only reset fields if current fields differ from default
      if (JSON.stringify(fields) !== JSON.stringify(defaultFields)) {
        setFields(defaultFields);
      }
    }
  }, [selectedElement.styles]);
  
  

  const handleInputChange = (e) => {
    const { name, value } = e.target;

    const updatedValue =
      name.includes("padding") || name === "width" || name === "borderWidth"
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
      <h2 className="text-lg font-bold text-gray-800 mb-4">Divider Attributes</h2>

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
              <label className="block text-sm font-bold text-gray-600 mb-1">Width</label>
              <input
                type="number"
                name="width"
                value={fields.width.replace("px", "")}
                onChange={handleInputChange}
                className="w-full p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-300"
              />
            </div>
            <div>
              <label className="block text-sm font-bold text-gray-600 mb-1">Align</label>
              <div className="flex space-x-4">
                {["left", "center", "right"].map((align) => (
                  <label key={align} className="flex items-center space-x-2">
                    <input
                      type="radio"
                      name="align"
                      value={align}
                      checked={fields.align === align}
                      onChange={handleInputChange}
                      className="form-radio"
                    />
                    <span className="text-sm text-gray-600">{align}</span>
                  </label>
                ))}
              </div>
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

      {/* Border Section */}
      <div className="p-4 m-1 bg-gray-100 rounded-lg">
        <div
          className="flex items-center justify-between cursor-pointer"
          onClick={() => setIsBorderOpen(!isBorderOpen)}
        >
          <h3 className="text-md font-bold text-gray-700">Border</h3>
          <button className="text-gray-500 focus:outline-none">
            {isBorderOpen ? <FiChevronDown /> : <FiChevronRight />}
          </button>
        </div>
        {isBorderOpen && (
          <div className="mt-3 space-y-4">
            <div>
              <label className="block text-sm font-bold text-gray-600 mb-1">Width (px)</label>
              <input
                type="number"
                name="borderWidth"
                value={fields.borderWidth.replace("px", "")}
                onChange={handleInputChange}
                className="w-full p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-300"
              />
            </div>
            <div>
              <label className="block text-sm font-bold text-gray-600 mb-1">Style</label>
              <select
                name="borderStyle"
                value={fields.borderStyle}
                onChange={handleInputChange}
                className="w-full p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-300"
              >
                <option value="solid">Solid</option>
                <option value="dotted">Dotted</option>
                <option value="dashed">Dashed</option>
                <option value="double">Double</option>
                <option value="inset">Inset</option>
                <option value="outset">Outset</option>
                <option value="groove">Groove</option>
                <option value="ridge">Ridge</option>
                
              </select>
            </div>
            <div>
              <label className="block text-sm font-bold text-gray-600 mb-1">Color</label>
              <input
                type="color"
                name="borderColor"
                value={fields.borderColor}
                onChange={handleInputChange}
                className="w-full p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-300"
              />
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
            <label className="block text-sm font-bold text-gray-600 mb-1">Background</label>
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

export default DividerEditOption;

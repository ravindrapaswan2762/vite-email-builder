import React, { useState, useEffect } from "react";
import { FiChevronDown, FiChevronRight } from "react-icons/fi";
import { useDispatch, useSelector } from "react-redux";
import { updateElementStyles } from "../redux/cardDragableSlice";
import { useMemo } from "react";

const TextAreaEditOption = () => {
  const [isDimensionOpen, setIsDimensionOpen] = useState(true);
  const [isColorOpen, setIsColorOpen] = useState(true);
  const [isTypographyOpen, setIsTypographyOpen] = useState(true);
  const [isExtraOpen, setIsExtraOpen] = useState(true); // State to toggle the "Extra" section

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
    height: "",
    paddingTop: "0px",
    paddingLeft: "",
    paddingBottom: "",
    paddingRight: "",
    color: "#000000",
    backgroundColor: "#ffffff",
    fontFamily: "",
    fontSize: "25",
    lineHeight: "",
    letterSpacing: "",
    textDecoration: "none",
    fontWeight: "normal",
    textAlign: "left",
    fontStyle: "normal",
    border: "1px solid #000000", // Border property
    borderRadius: "4px", // Border radius
    boxShadow: "none", // Box shadow property
  });

  useEffect(() => {
    if (selectedElement.styles) {
      const newFields = {
        height: selectedElement.styles.height || "",
        paddingTop: selectedElement.styles.paddingTop || "0px",
        paddingLeft: selectedElement.styles.paddingLeft || "",
        paddingBottom: selectedElement.styles.paddingBottom || "",
        paddingRight: selectedElement.styles.paddingRight || "",
        color: selectedElement.styles.color || "#000000",
        backgroundColor: selectedElement.styles.backgroundColor || "#ffffff",
        fontFamily: selectedElement.styles.fontFamily || "",
        fontSize: selectedElement.styles.fontSize || "25px",
        lineHeight: selectedElement.styles.lineHeight || "",
        letterSpacing: selectedElement.styles.letterSpacing || "",
        textDecoration: selectedElement.styles.textDecoration || "none",
        fontWeight: selectedElement.styles.fontWeight || "normal",
        textAlign: selectedElement.styles.textAlign || "left",
        fontStyle: selectedElement.styles.fontStyle || "normal",
        border: selectedElement.styles.border || "1px solid #000000",
        borderRadius: selectedElement.styles.borderRadius || "4px",
        boxShadow: selectedElement.styles.boxShadow || "none",
      };
  
      // Only update fields if the new values are different
      if (JSON.stringify(fields) !== JSON.stringify(newFields)) {
        setFields(newFields);
      }
    } else {
      // Reset fields to default values if no styles are found
      setFields({
        height: "",
        paddingTop: "0px",
        paddingLeft: "",
        paddingBottom: "",
        paddingRight: "",
        color: "#000000",
        backgroundColor: "#ffffff",
        fontFamily: "",
        fontSize: "25px",
        lineHeight: "",
        letterSpacing: "",
        textDecoration: "none",
        fontWeight: "normal",
        textAlign: "left",
        fontStyle: "normal",
        border: "1px solid #000000",
        borderRadius: "4px",
        boxShadow: "none",
      });
    }
  }, [selectedElement.styles]); // Depend on selectedElement.styles to avoid unnecessary re-renders
  
  
  

  // Handle input changes dynamically
  const handleInputChange = (e) => {
    const { name, value } = e.target;

    // Append 'px' for padding and other dimension-related fields
    let updatedValue = value;

    if (
      ["paddingTop", "paddingLeft", "paddingBottom", "paddingRight", "height", "fontSize", "letterSpacing"].includes(name)
    ) {
      updatedValue = value && !value.includes("px") ? `${value}px` : value;
    }

    setFields((prev) => ({
      ...prev,
      [name]: updatedValue,
    }));

    console.log("Updated Style:", name, updatedValue);

    // Dispatch updated styles to Redux
    dispatch(
      updateElementStyles({
        id: activeWidgetId,
        styles: { [name]: updatedValue },
        ...(activeParentId && { parentId: activeParentId }), // Include parentId if activeParentId is valid
        ...(activeColumn && { column: activeColumn }),
      })
    );
  };

  return (
    <div className="w-full max-w-md p-6 bg-white border rounded-lg shadow-lg h-screen overflow-y-auto">
      <h2 className="text-lg font-bold text-gray-800 mb-4">Text Area Attributes</h2>

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
              <label className="block text-sm font-bold text-gray-600 mb-1">Height</label>
              <input
                type="number"
                name="height"
                value={fields.height?.replace("px", "")}
                onChange={handleInputChange}
                className="w-full p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-300"
              />
            </div>
            <div>
              <label className="block text-sm font-bold text-gray-600 mb-1">Padding</label>
              <div className="grid grid-cols-2 gap-4">
                {[
                  { name: "paddingTop", label: "Top (px)" },
                  { name: "paddingLeft", label: "Left (px)" },
                  { name: "paddingBottom", label: "Bottom (px)" },
                  { name: "paddingRight", label: "Right (px)" },
                ].map(({ name, label }) => (
                  <div key={name}>
                    <label className="block text-xs font-bold text-gray-600 mb-1">{label}</label>
                    <input
                      type="number"
                      name={name}
                      value={fields[name]?.replace("px", "")} // Strip 'px' for display
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

      {/* Color Section */}
      <div className="p-4 m-1 bg-gray-100 rounded-lg">
        <div
          className="flex items-center justify-between cursor-pointer"
          onClick={() => setIsColorOpen(!isColorOpen)}
        >
          <h3 className="text-md font-bold text-gray-700">Color</h3>
          <button className="text-gray-500 focus:outline-none">
            {isColorOpen ? <FiChevronDown /> : <FiChevronRight />}
          </button>
        </div>
        {isColorOpen && (
          <div className="mt-3 space-y-4">
            {[
              { name: "color", label: "Text Color" },
              { name: "backgroundColor", label: "Background Color" },
            ].map(({ name, label }) => (
              <div key={name}>
                <label className="block text-sm font-bold text-gray-600 mb-1">{label}</label>
                <div className="relative">
                  <input
                    type="text"
                    name={name}
                    value={fields[name]}
                    onChange={handleInputChange}
                    className="w-full pl-12 p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-300"
                  />
                  <input
                    type="color"
                    name={name}
                    value={fields[name]}
                    onChange={handleInputChange}
                    className="absolute left-2 top-2 w-8 h-8 border rounded-lg cursor-pointer"
                  />
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Typography Section */}
      <div className="p-4 m-1 bg-gray-100 rounded-lg">
        <div
          className="flex items-center justify-between cursor-pointer"
          onClick={() => setIsTypographyOpen(!isTypographyOpen)}
        >
          <h3 className="text-md font-bold text-gray-700">Typography</h3>
          <button className="text-gray-500 focus:outline-none">
            {isTypographyOpen ? <FiChevronDown /> : <FiChevronRight />}
          </button>
        </div>
        {isTypographyOpen && (
          <div className="mt-3 space-y-4">
            {/* Font Family */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-bold text-gray-600 mb-1">Font Family</label>
                <input
                  type="text"
                  name="fontFamily"
                  value={fields.fontFamily}
                  onChange={handleInputChange}
                  className="w-full p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-300"
                />
              </div>

              {/* Font Size */}
              <div>
                <label className="block text-sm font-bold text-gray-600 mb-1">Font Size (px)</label>
                <input
                  type="number"
                  name="fontSize"
                  value={fields.fontSize?.replace("px", "")}
                  onChange={handleInputChange}
                  className="w-full p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-300"
                />
              </div>
            </div>

            {/* Line Height */}
            <div>
              <label className="block text-sm font-bold text-gray-600 mb-1">Line Height</label>
              <input
                type="text"
                name="lineHeight"
                value={fields.lineHeight}
                onChange={handleInputChange}
                className="w-full p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-300"
              />
            </div>

            {/* Letter Spacing */}
            <div>
              <label className="block text-sm font-bold text-gray-600 mb-1">Letter Spacing</label>
              <input
                type="text"
                name="letterSpacing"
                value={fields.letterSpacing}
                onChange={handleInputChange}
                className="w-full p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-300"
              />
            </div>

            {/* Text Decoration */}
            <div>
              <label className="block text-sm font-bold text-gray-600 mb-1">Text Decoration</label>
              <select
                name="textDecoration"
                value={fields.textDecoration}
                onChange={handleInputChange}
                className="w-full p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-300"
              >
                <option value="none">None</option>
                <option value="underline">Underline</option>
                <option value="line-through">Line-through</option>
              </select>
            </div>
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
          <div className="mt-3 space-y-4">
            <div>
              <label className="block text-sm font-bold text-gray-600 mb-1">Font Weight</label>
              <select
                name="fontWeight"
                value={fields.fontWeight}
                onChange={handleInputChange}
                className="w-full p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-300"
              >
                <option value="normal">Normal</option>
                <option value="bold">Bold</option>
                <option value="bolder">Bolder</option>
                <option value="lighter">Lighter</option>
              </select>
            </div>
            {/* Text Alignment */}
            <div>
              <label className="block text-sm font-bold text-gray-600 mb-1">Text Alignment</label>
              <div className="flex space-x-4">
                {["left", "center", "right", "justify"].map((align) => (
                  <label key={align} className="flex items-center space-x-2">
                    <input
                      type="radio"
                      name="textAlign"
                      value={align}
                      checked={fields.textAlign === align}
                      onChange={handleInputChange}
                      className="form-radio text-blue-600 focus:ring-blue-300"
                    />
                    <span className="text-sm text-gray-600">{align.charAt(0).toUpperCase() + align.slice(1)}</span>
                  </label>
                ))}
              </div>
            </div>

            {/* Font Style */}
            <div>
              <label className="block text-sm font-bold text-gray-600 mb-1">Font Style</label>
              <div className="flex space-x-4">
                {["normal", "italic"].map((style) => (
                  <label key={style} className="flex items-center space-x-2">
                    <input
                      type="radio"
                      name="fontStyle"
                      value={style}
                      checked={fields.fontStyle === style}
                      onChange={handleInputChange}
                      className="form-radio text-blue-600 focus:ring-blue-300"
                    />
                    <span className="text-sm text-gray-600">{style.charAt(0).toUpperCase() + style.slice(1)}</span>
                  </label>
                ))}
              </div>
            </div>

            {/* Border */}
            <div>
              <label className="block text-sm font-bold text-gray-600 mb-1">Border</label>
              <input
                type="text"
                name="border"
                value={fields.border}
                onChange={handleInputChange}
                className="w-full p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-300"
              />
            </div>

            {/* Border Radius */}
            <div>
              <label className="block text-sm font-bold text-gray-600 mb-1">Border Radius</label>
              <input
                type="text"
                name="borderRadius"
                value={fields.borderRadius}
                onChange={handleInputChange}
                className="w-full p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-300"
              />
            </div>

            {/* Box Shadow */}
            <div>
              <label className="block text-sm font-bold text-gray-600 mb-1">Box Shadow</label>
              <input
                type="text"
                name="boxShadow"
                value={fields.boxShadow}
                onChange={handleInputChange}
                className="w-full p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-300"
              />
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default TextAreaEditOption;

import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { updateElementStyles } from "../redux/cardDragableSlice";

const SectionEditOption = () => {
  const dispatch = useDispatch();
  const { activeWidgetId, droppedItems } = useSelector((state) => state.cardDragable);

  // Find the currently selected element from Redux state
  // const selectedElement =
  //   droppedItems.find((item) => item.id === activeWidgetId) || {};

  const selectedElement =
    droppedItems.find((item) => item?.id === activeWidgetId) || {};
  if (!selectedElement) {
    console.error("Error: No matching element found or activeWidgetId is invalid.");
    return;
  }

  // 1. Local state for component attributes
  const [attributes, setAttributes] = useState({
    group: false,
    fullWidth: "",
    paddingTop: "20px",
    paddingLeft: "0px",
    paddingBottom: "20px",
    paddingRight: "0px",
    backgroundImage: "",
    backgroundColor: "",
    backgroundRepeat: "Repeat",
    backgroundSize: "auto",
    borderType: "5px",
    borderRadius: "5px",
    className: "",
  });

  // 2. On mount or when the selected element changes, merge Redux styles
  useEffect(() => {
    if (selectedElement.styles) {
      setAttributes((prev) => ({
        ...prev,
        ...selectedElement.styles,
      }));
    }
  }, [selectedElement]);

  // 3. Handle input changes, including numeric -> "px" transformation
  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    let updatedValue = type === "checkbox" ? checked : value;

    // List of fields we want to store with a "px" suffix if the user inputs a numeric value
    const pxFields = [
      "paddingTop",
      "paddingLeft",
      "paddingBottom",
      "paddingRight",
      "borderRadius",
    ];

    // If this field is in pxFields, strip any existing "px" and add it back
    if (pxFields.includes(name)) {
      updatedValue = updatedValue.replace("px", ""); // remove existing px
      if (updatedValue !== "") {
        updatedValue += "px";
      }
    }

    setAttributes((prev) => ({
      ...prev,
      [name]: updatedValue,
    }));

    // Dispatch the change to Redux
    dispatch(
      updateElementStyles({
        id: activeWidgetId,
        styles: { [name]: updatedValue },
      })
    );
  };

  return (
    <div className="w-full max-w-md p-6 bg-white border rounded-lg shadow-lg h-screen overflow-y-auto">
      <h2 className="text-lg font-bold text-gray-800 mb-4">Section Attributes</h2>

      {/* Dimension Section */}
      <div className="p-4 mb-4 bg-gray-100 rounded-lg">
        <h3 className="text-md font-bold text-gray-700 mb-2">Dimension</h3>

        {/* Group */}
        <div className="flex items-center justify-between mb-4">
          <label className="text-sm font-bold text-gray-600">Group</label>
          <input
            type="checkbox"
            name="group"
            checked={attributes.group}
            onChange={handleInputChange}
            className="w-5 h-5"
          />
        </div>

        {/* Full Width */}
        <div className="mb-4">
          <label className="block text-sm font-bold text-gray-600 mb-1">
            Full Width
          </label>
          <input
            type="text"
            name="fullWidth"
            value={attributes.fullWidth}
            onChange={handleInputChange}
            className="w-full p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-300"
          />
        </div>

        {/* Padding */}
        <h4 className="text-sm font-bold text-gray-600 mb-2">Padding</h4>
        <div className="grid grid-cols-2 gap-4">
          {["Top", "Left", "Bottom", "Right"].map((direction) => {
            const fieldName = `padding${direction}`;
            return (
              <div key={direction}>
                <label className="block text-xs font-bold text-gray-600 mb-1">
                  {direction} (px)
                </label>
                <input
                  type="number"
                  name={fieldName}
                  // show only the numeric part in the input
                  value={attributes[fieldName]?.replace("px", "")}
                  onChange={handleInputChange}
                  className="w-full p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-300"
                />
              </div>
            );
          })}
        </div>
      </div>

      {/* Background Section */}
      <div className="p-4 mb-4 bg-gray-100 rounded-lg">
        <h3 className="text-md font-bold text-gray-700 mb-2">Background</h3>

        {/* Background Image */}
        <div className="mb-4">
          <label className="block text-sm font-bold text-gray-600 mb-1">
            Background Image
          </label>
          <input
            type="text"
            name="backgroundImage"
            value={attributes.backgroundImage}
            onChange={handleInputChange}
            placeholder="Image URL"
            className="w-full p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-300"
          />
          <p className="text-xs text-gray-500 mt-1">
            The image suffix should be .jpg, .jpeg, .png, .gif, etc. Otherwise,
            the picture may not be displayed normally.
          </p>
        </div>

        {/* Background Color */}
        <div className="mb-4">
          <label className="block text-sm font-bold text-gray-600 mb-1">
            Background Color
          </label>
          <div className="relative">
            <input
              type="text"
              name="backgroundColor"
              value={attributes.backgroundColor}
              onChange={handleInputChange}
              className="w-full pl-12 p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-300"
            />
            <input
              type="color"
              name="backgroundColor"
              value={attributes.backgroundColor}
              onChange={handleInputChange}
              className="absolute left-2 top-2 w-8 h-8 border rounded-lg cursor-pointer"
            />
          </div>
        </div>

        {/* Background Repeat */}
        <div className="mb-4">
          <label className="block text-sm font-bold text-gray-600 mb-1">
            Background Repeat
          </label>
          <select
            name="backgroundRepeat"
            value={attributes.backgroundRepeat}
            onChange={handleInputChange}
            className="w-full p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-300"
          >
            <option value="Repeat">Repeat</option>
            <option value="No-Repeat">No Repeat</option>
          </select>
        </div>

        {/* Background Size */}
        <div>
          <label className="block text-sm font-bold text-gray-600 mb-1">
            Background Size
          </label>
          <input
            type="text"
            name="backgroundSize"
            value={attributes.backgroundSize}
            onChange={handleInputChange}
            placeholder="auto, cover, contain"
            className="w-full p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-300"
          />
        </div>
      </div>

      {/* Border Section */}
      <div className="p-4 mb-4 bg-gray-100 rounded-lg">
        <h3 className="text-md font-bold text-gray-700 mb-2">Border</h3>

        {/* Border Type */}
        <div className="mb-4">
          <label className="block text-sm font-bold text-gray-600 mb-1">
            Border
          </label>
          <input
            type="text"
            name="borderType"
            value={attributes.borderType}
            onChange={handleInputChange}
            placeholder="Ex: 2px solid red"
            className="w-full p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-300"
          />
        </div>

        {/* Border Radius */}
        <div>
          <label className="block text-sm font-bold text-gray-600 mb-1">
            Border Radius
          </label>
          <input
            type="number"
            name="borderRadius"
            // Show only the numeric part
            value={attributes.borderRadius.replace("px", "")}
            onChange={handleInputChange}
            placeholder="e.g., 5px, 50"
            className="w-full p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-300"
          />
        </div>
      </div>

      {/* Extra Section */}
      <div className="p-4 bg-gray-100 rounded-lg">
        <h3 className="text-md font-bold text-gray-700 mb-2">Extra</h3>
        <div>
          <label className="block text-sm font-bold text-gray-600 mb-1">
            Class Name
          </label>
          <input
            type="text"
            name="className"
            value={attributes.className}
            onChange={handleInputChange}
            placeholder="e.g., wrapper-class"
            className="w-full p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-300"
          />
        </div>
      </div>
    </div>
  );
};

export default SectionEditOption;

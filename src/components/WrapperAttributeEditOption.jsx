import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { updateWrapperAttribute } from "../redux/attributesSlice";
import { FiChevronDown, FiChevronRight } from "react-icons/fi";

const WrapperAttributeEditOption = () => {
  const dispatch = useDispatch();

  // ✅ Fetch stored wrapper attributes from Redux
  const wrapperAttributes = useSelector((state) => state.attributes.wrapperAttributes);

  // ✅ Local state initialized with Redux values (to reflect UI)
  const [attributes, setAttributes] = useState({
    paddingTop: wrapperAttributes.dimensions.padding.top,
    paddingLeft: wrapperAttributes.dimensions.padding.left,
    paddingBottom: wrapperAttributes.dimensions.padding.bottom,
    paddingRight: wrapperAttributes.dimensions.padding.right,
    backgroundImage: wrapperAttributes.background.image,
    backgroundColor: wrapperAttributes.background.color,
    backgroundRepeat: wrapperAttributes.background.repeat,
    backgroundSize: wrapperAttributes.background.size,
    borderType: wrapperAttributes.border.type,
    borderRadius: wrapperAttributes.border.radius,
    className: wrapperAttributes.extra.className,
  });

  // ✅ Update local state when Redux state changes (ensures UI reflects updates)
  useEffect(() => {
    console.log("wrapperAttributes in editor: ", wrapperAttributes);
    setAttributes({
      paddingTop: wrapperAttributes.dimensions.padding.top,
      paddingLeft: wrapperAttributes.dimensions.padding.left,
      paddingBottom: wrapperAttributes.dimensions.padding.bottom,
      paddingRight: wrapperAttributes.dimensions.padding.right,
      backgroundImage: wrapperAttributes.background.image,
      backgroundColor: wrapperAttributes.background.color,
      backgroundRepeat: wrapperAttributes.background.repeat,
      backgroundSize: wrapperAttributes.background.size,
      borderType: wrapperAttributes.border.type,
      borderRadius: wrapperAttributes.border.radius,
      className: wrapperAttributes.extra.className,
    });
  }, [wrapperAttributes]); // ✅ Listens for Redux state changes

  // ✅ Handle Input Change & Dispatch Redux Action
  const handleChange = (category, field, value) => {
    setAttributes((prev) => ({
      ...prev,
      [field]: value,
    }));
    dispatch(updateWrapperAttribute({ category, field, value }));
  };

  return (
    <div className="w-full max-w-md p-1 bg-white border rounded-lg shadow-lg h-screen overflow-y-auto">
      <h2 className="text-lg font-bold text-gray-800 mb-4">Wrapper Attributes</h2>

      {/* Dimension Section */}
      <div className="p-4 m-1 bg-gray-100 rounded-lg">
        <div className="flex items-center justify-between cursor-pointer">
          <h3 className="text-md font-bold text-gray-700">Dimension</h3>
          <button className="text-gray-500 focus:outline-none">
            <FiChevronDown />
          </button>
        </div>
        <div className="mt-3 space-y-4">
          <h4 className="text-sm font-bold text-gray-600">Padding</h4>
          <div className="grid grid-cols-2 gap-4">
            {["Top", "Left", "Bottom", "Right"].map((direction) => (
              <div key={direction}>
                <label className="block text-xs font-bold text-gray-600 mb-1">
                  {direction} (px)
                </label>
                <input
                  type="number"
                  name={`padding${direction}`}
                  value={attributes[`padding${direction}`]}
                  onChange={(e) => handleChange("dimensions", `padding.${direction.toLowerCase()}`, e.target.value)}
                  className="w-full p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-300"
                />
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Background Section */}
      <div className="p-4 m-1 bg-gray-100 rounded-lg">
        <div className="flex items-center justify-between cursor-pointer">
          <h3 className="text-md font-bold text-gray-700">Background</h3>
          <button className="text-gray-500 focus:outline-none">
            <FiChevronDown />
          </button>
        </div>
        <div className="mt-3 space-y-4">
          <div>
            <label className="block text-sm font-bold text-gray-600 mb-1">Background Image</label>
            <input
              type="text"
              name="backgroundImage"
              value={attributes.backgroundImage}
              onChange={(e) => handleChange("background", "image", e.target.value)}
              placeholder="Image URL"
              className="w-full p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-300"
            />
          </div>
          <div>
            <label className="block text-sm font-bold text-gray-600 mb-1">Background Color</label>
            <div className="relative">
              <input
                type="text"
                name="backgroundColor"
                value={attributes.backgroundColor}
                onChange={(e) => handleChange("background", "color", e.target.value)}
                className="w-full pl-12 p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-300"
              />
              <input
                type="color"
                name="backgroundColor"
                value={attributes.backgroundColor}
                onChange={(e) => handleChange("background", "color", e.target.value)}
                className="absolute left-2 top-2 w-8 h-8 border rounded-lg cursor-pointer"
              />
            </div>
          </div>
          <div>
            <label className="block text-sm font-bold text-gray-600 mb-1">Background Repeat</label>
            <select
              name="backgroundRepeat"
              value={attributes.backgroundRepeat}
              onChange={(e) => handleChange("background", "repeat", e.target.value)}
              className="w-full p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-300"
            >
              <option value="no-repeat">No Repeat</option>
              <option value="repeat">Repeat</option>
              <option value="repeat-x">Repeat-X</option>
              <option value="repeat-y">Repeat-Y</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-bold text-gray-600 mb-1">Background Size</label>
            <input
              type="text"
              name="backgroundSize"
              value={attributes.backgroundSize}
              onChange={(e) => handleChange("background", "size", e.target.value)}
              placeholder="e.g., cover, contain"
              className="w-full p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-300"
            />
          </div>
        </div>
      </div>

      {/* Border Section */}
      <div className="p-4 m-1 bg-gray-100 rounded-lg">
        <div className="flex items-center justify-between cursor-pointer">
          <h3 className="text-md font-bold text-gray-700">Border</h3>
          <button className="text-gray-500 focus:outline-none">
            <FiChevronDown />
          </button>
        </div>
        <div className="mt-3 space-y-4">
          <div>
            <label className="block text-sm font-bold text-gray-600 mb-1">Border Type</label>
            <input
              type="text"
              name="borderType"
              value={attributes.borderType}
              onChange={(e) => handleChange("border", "type", e.target.value)}
              className="w-full p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-300"
            />
          </div>
          <div>
            <label className="block text-sm font-bold text-gray-600 mb-1">Border Radius</label>
            <input
              type="text"
              name="borderRadius"
              value={attributes.borderRadius}
              onChange={(e) => handleChange("border", "radius", e.target.value)}
              className="w-full p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-300"
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default WrapperAttributeEditOption;

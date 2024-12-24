import React, { useState } from "react";
import { FiChevronDown, FiChevronRight } from "react-icons/fi";

const WrapperAttributeEditOption = () => {
  const [isDimensionOpen, setIsDimensionOpen] = useState(true);
  const [isBackgroundOpen, setIsBackgroundOpen] = useState(true);
  const [isBorderOpen, setIsBorderOpen] = useState(true);
  const [isExtraOpen, setIsExtraOpen] = useState(true);

  const [attributes, setAttributes] = useState({
    paddingTop: "20",
    paddingLeft: "0",
    paddingBottom: "20",
    paddingRight: "0",
    backgroundImage: "",
    backgroundColor: "#ffffff",
    backgroundRepeat: "no-repeat",
    backgroundSize: "cover",
    borderType: "none",
    borderRadius: "",
    className: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setAttributes((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  return (
    <div className="w-full max-w-md p-1 bg-white border rounded-lg shadow-lg h-screen overflow-y-auto">
      <h2 className="text-lg font-bold text-gray-800 mb-4">Wrapper Attributes</h2>

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
                    onChange={handleChange}
                    className="w-full p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-300"
                  />
                </div>
              ))}
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
          <div className="mt-3 space-y-4">
            <div>
              <label className="block text-sm font-bold text-gray-600 mb-1">
                Background Image
              </label>
              <input
                type="text"
                name="backgroundImage"
                value={attributes.backgroundImage}
                onChange={handleChange}
                placeholder="Image URL"
                className="w-full p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-300"
              />
              <p className="text-xs text-gray-500 mt-1">
                The image suffix should be .jpg, .jpeg, .png, .gif, etc.
              </p>
            </div>
            <div>
              <label className="block text-sm font-bold text-gray-600 mb-1">
                Background Color
              </label>
              <div className="relative">
                <input
                  type="text"
                  name="backgroundColor"
                  value={attributes.backgroundColor}
                  onChange={handleChange}
                  className="w-full pl-12 p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-300"
                />
                <input
                  type="color"
                  name="backgroundColor"
                  value={attributes.backgroundColor}
                  onChange={handleChange}
                  className="absolute left-2 top-2 w-8 h-8 border rounded-lg cursor-pointer"
                />
              </div>
            </div>
            <div>
              <label className="block text-sm font-bold text-gray-600 mb-1">
                Background Repeat
              </label>
              <select
                name="backgroundRepeat"
                value={attributes.backgroundRepeat}
                onChange={handleChange}
                className="w-full p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-300"
              >
                <option value="no-repeat">No Repeat</option>
                <option value="repeat">Repeat</option>
                <option value="repeat-x">Repeat-X</option>
                <option value="repeat-y">Repeat-Y</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-bold text-gray-600 mb-1">
                Background Size
              </label>
              <input
                type="text"
                name="backgroundSize"
                value={attributes.backgroundSize}
                onChange={handleChange}
                placeholder="e.g., cover, contain"
                className="w-full p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-300"
              />
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
              <label className="block text-sm font-bold text-gray-600 mb-1">
                Border
              </label>
              <input
                type="text"
                name="borderType"
                value={attributes.borderType}
                onChange={handleChange}
                placeholder="e.g., none, solid, dashed"
                className="w-full p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-300"
              />
            </div>
            <div>
              <label className="block text-sm font-bold text-gray-600 mb-1">
                Border Radius
              </label>
              <input
                type="text"
                name="borderRadius"
                value={attributes.borderRadius}
                onChange={handleChange}
                placeholder="e.g., 5px, 50%"
                className="w-full p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-300"
              />
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
          <div className="mt-3">
            <label className="block text-sm font-bold text-gray-600 mb-1">
              Class Name
            </label>
            <input
              type="text"
              name="className"
              value={attributes.className}
              onChange={handleChange}
              placeholder="e.g., wrapper-class"
              className="w-full p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-300"
            />
          </div>
        )}
      </div>
    </div>
  );
};

export default WrapperAttributeEditOption;

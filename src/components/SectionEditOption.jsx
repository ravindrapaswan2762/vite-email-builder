import React, { useState } from "react";

const SectionEditOption = () => {
  const [attributes, setAttributes] = useState({
    group: false,
    fullWidth: "",
    paddingTop: 20,
    paddingLeft: 0,
    paddingBottom: 20,
    paddingRight: 0,
    backgroundImage: "",
    backgroundColor: "",
    backgroundRepeat: "Repeat",
    backgroundSize: "auto",
    borderType: "none",
    borderRadius: "",
    className: "",
  });

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setAttributes((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  return (
    <div className="w-full max-w-md p-6 bg-white border rounded-lg shadow-lg h-auto overflow-y-auto">
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
            onChange={handleChange}
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
            onChange={handleChange}
            className="w-full p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-300"
          />
        </div>

        {/* Padding */}
        <h4 className="text-sm font-bold text-gray-600 mb-2">Padding</h4>
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
            onChange={handleChange}
            placeholder="Image URL"
            className="w-full p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-300"
          />
          <p className="text-xs text-gray-500 mt-1">
            The image suffix should be .jpg, jpeg, png, gif, etc. Otherwise, the
            picture may not be displayed normally.
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

        {/* Background Repeat */}
        <div className="mb-4">
          <label className="block text-sm font-bold text-gray-600 mb-1">
            Background Repeat
          </label>
          <select
            name="backgroundRepeat"
            value={attributes.backgroundRepeat}
            onChange={handleChange}
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
            onChange={handleChange}
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
            onChange={handleChange}
            placeholder="e.g., none, solid, dashed"
            className="w-full p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-300"
          />
        </div>

        {/* Border Radius */}
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
            onChange={handleChange}
            placeholder="e.g., wrapper-class"
            className="w-full p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-300"
          />
        </div>
      </div>
    </div>
  );
};

export default SectionEditOption;

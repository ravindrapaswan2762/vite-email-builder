import React, { useState, useEffect } from "react";
import { FiChevronDown, FiChevronRight } from "react-icons/fi";
import { useDispatch, useSelector } from "react-redux";
import { updateElementStyles } from "../redux/cardDragableSlice";

const ImageEditOption = () => {
  const [isSettingOpen, setIsSettingOpen] = useState(true);
  const [isDimensionOpen, setIsDimensionOpen] = useState(true);
  const [isLinkOpen, setIsLinkOpen] = useState(true);
  const [isBorderOpen, setIsBorderOpen] = useState(true);
  const [isExtraOpen, setIsExtraOpen] = useState(true);

  const dispatch = useDispatch();
  const { activeWidgetId, droppedItems } = useSelector(
    (state) => state.cardDragable
  );

  const selectedElement =
    droppedItems.find((item) => item.id === activeWidgetId) || {};

  const [fields, setFields] = useState({
    imageUrl: "",
    backgroundColor: "#ffffff",
    fullWidthMobile: false,
    width: "",
    height: "",
    paddingTop: "",
    paddingLeft: "",
    paddingBottom: "",
    paddingRight: "",
    align: "left",
    href: "",
    target: "_self",
    border: "",
    borderRadius: "",
    title: "",
    alt: "",
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
    const { name, value, type, checked } = e.target;
    const updatedValue = type === "checkbox" ? checked : value;

    setFields((prev) => ({
      ...prev,
      [name]: updatedValue,
    }));

    dispatch(
      updateElementStyles({
        id: activeWidgetId,
        styles: { [name]: updatedValue },
      })
    );
  };

  return (
    <div className="w-full max-w-md p-6 bg-white border rounded-lg shadow-lg h-screen overflow-y-auto">
      <h2 className="text-lg font-bold text-gray-800 mb-4">Image Attributes</h2>

      {/* Setting Section */}
      <div className="p-4 m-1 bg-gray-100 rounded-lg">
        <div
          className="flex items-center justify-between cursor-pointer"
          onClick={() => setIsSettingOpen(!isSettingOpen)}
        >
          <h3 className="text-md font-bold text-gray-700">Setting</h3>
          <button className="text-gray-500 focus:outline-none">
            {isSettingOpen ? <FiChevronDown /> : <FiChevronRight />}
          </button>
        </div>
        {isSettingOpen && (
          <div className="mt-3 space-y-4">
            <div>
              <label className="block text-sm font-bold text-gray-600 mb-1">
                The image suffix should be .jpg, jpeg, png, gif, etc. Otherwise, the picture may not be displayed normally.
              </label>
              <input
                type="text"
                name="imageUrl"
                value={fields.imageUrl}
                onChange={handleInputChange}
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
                  value={fields.backgroundColor}
                  onChange={handleInputChange}
                  className="w-full pl-12 p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-300"
                />
                <input
                  type="color"
                  name="backgroundColor"
                  value={fields.backgroundColor}
                  onChange={handleInputChange}
                  className="absolute left-2 top-2 w-8 h-8 border rounded-lg cursor-pointer"
                />
              </div>
            </div>
            <div>
              <label className="block text-sm font-bold text-gray-600 mb-1">Full Width on Mobile</label>
              <input
                type="checkbox"
                name="fullWidthMobile"
                checked={fields.fullWidthMobile}
                onChange={handleInputChange}
                className="w-5 h-5 border rounded focus:outline-none focus:ring-2 focus:ring-blue-300"
              />
            </div>
          </div>
        )}
      </div>

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
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-bold text-gray-600 mb-1">Width</label>
                <input
                  type="text"
                  name="width"
                  value={fields.width}
                  onChange={handleInputChange}
                  className="w-full p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-300"
                />
              </div>
              <div>
                <label className="block text-sm font-bold text-gray-600 mb-1">Height</label>
                <input
                  type="text"
                  name="height"
                  value={fields.height}
                  onChange={handleInputChange}
                  className="w-full p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-300"
                />
              </div>
            </div>
            <div>
              <label className="block text-sm font-bold text-gray-600 mb-1">Padding</label>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-gray-600 mb-1">Top (px)</label>
                  <input
                    type="text"
                    name="paddingTop"
                    value={fields.paddingTop}
                    onChange={handleInputChange}
                    className="w-full p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-300"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-600 mb-1">Left (px)</label>
                  <input
                    type="text"
                    name="paddingLeft"
                    value={fields.paddingLeft}
                    onChange={handleInputChange}
                    className="w-full p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-300"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-600 mb-1">Bottom (px)</label>
                  <input
                    type="text"
                    name="paddingBottom"
                    value={fields.paddingBottom}
                    onChange={handleInputChange}
                    className="w-full p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-300"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-600 mb-1">Right (px)</label>
                  <input
                    type="text"
                    name="paddingRight"
                    value={fields.paddingRight}
                    onChange={handleInputChange}
                    className="w-full p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-300"
                  />
                </div>
              </div>
            </div>
            <div>
              <label className="block text-sm font-bold text-gray-600 mb-1">Align</label>
              <div className="flex items-center gap-4">
                <label className="flex items-center">
                  <input
                    type="radio"
                    name="align"
                    value="left"
                    checked={fields.align === "left"}
                    onChange={handleInputChange}
                    className="mr-2"
                  />
                  Left
                </label>
                <label className="flex items-center">
                  <input
                    type="radio"
                    name="align"
                    value="center"
                    checked={fields.align === "center"}
                    onChange={handleInputChange}
                    className="mr-2"
                  />
                  Center
                </label>
                <label className="flex items-center">
                  <input
                    type="radio"
                    name="align"
                    value="right"
                    checked={fields.align === "right"}
                    onChange={handleInputChange}
                    className="mr-2"
                  />
                  Right
                </label>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Link Section */}
      <div className="p-4 m-1 bg-gray-100 rounded-lg">
        <div
          className="flex items-center justify-between cursor-pointer"
          onClick={() => setIsLinkOpen(!isLinkOpen)}
        >
          <h3 className="text-md font-bold text-gray-700">Link</h3>
          <button className="text-gray-500 focus:outline-none">
            {isLinkOpen ? <FiChevronDown /> : <FiChevronRight />}
          </button>
        </div>
        {isLinkOpen && (
          <div className="mt-3 space-y-4">
            <div>
              <label className="block text-sm font-bold text-gray-600 mb-1">Href</label>
              <input
                type="text"
                name="href"
                value={fields.href}
                onChange={handleInputChange}
                className="w-full p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-300"
              />
            </div>
            <div>
              <label className="block text-sm font-bold text-gray-600 mb-1">Target</label>
              <select
                name="target"
                value={fields.target}
                onChange={handleInputChange}
                className="w-full p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-300"
              >
                <option value="_self">_self</option>
                <option value="_blank">_blank</option>
              </select>
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
                    <label className="block text-sm font-bold text-gray-600 mb-1">Border</label>
                    <input
                      type="text"
                      className="w-full p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-300"
                      name="border"
                      onChange={handleInputChange}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-bold text-gray-600 mb-1">Border Radius</label>
                    <input
                      type="text"
                      className="w-full p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-300"
                      name="borderRadius"
                      onChange={handleInputChange}
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
                <div className="mt-3 space-y-4">
                  <div>
                    <label className="block text-sm font-bold text-gray-600 mb-1">Title</label>
                    <input
                      type="text"
                      className="w-full p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-300"
                      name="tittle"
                      onChange={handleInputChange}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-bold text-gray-600 mb-1">Alt</label>
                    <input
                      type="text"
                      className="w-full p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-300"
                      name="alt"
                      onChange={handleInputChange}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-bold text-gray-600 mb-1">Class Name</label>
                    <input
                      type="text"
                      className="w-full p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-300"
                      name="className"
                      onChange={handleInputChange}
                    />
                  </div>
                </div>
              )}
            </div>
          </div>
        );
      };
      
      export default ImageEditOption;
      

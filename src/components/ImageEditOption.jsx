import React, { useState, useEffect } from "react";
import { FiChevronDown, FiChevronRight } from "react-icons/fi";
import { useDispatch, useSelector } from "react-redux";
import { updateElementStyles } from "../redux/cardDragableSlice";
import { useMemo } from "react";

const ImageEditOption = () => {
  const [isSettingOpen, setIsSettingOpen] = useState(true);
  const [isDimensionOpen, setIsDimensionOpen] = useState(true);
  const [isLinkOpen, setIsLinkOpen] = useState(true);
  const [isBorderOpen, setIsBorderOpen] = useState(true);
  const [isExtraOpen, setIsExtraOpen] = useState(true);

  const dispatch = useDispatch();
  const { activeWidgetId, activeParentId, activeColumn, droppedItems } = useSelector(
    (state) => state.cardDragable
  );

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
      const newFields = {
        imageUrl: selectedElement.styles.imageUrl || "",
        backgroundColor: selectedElement.styles.backgroundColor || "#ffffff",
        fullWidthMobile: selectedElement.styles.fullWidthMobile || false,
        width: selectedElement.styles.width || "",
        height: selectedElement.styles.height || "",
        paddingTop: selectedElement.styles.paddingTop || "",
        paddingLeft: selectedElement.styles.paddingLeft || "",
        paddingBottom: selectedElement.styles.paddingBottom || "",
        paddingRight: selectedElement.styles.paddingRight || "",
        align: selectedElement.styles.align || "left",
        href: selectedElement.styles.href || "",
        target: selectedElement.styles.target || "_self",
        border: selectedElement.styles.border || "",
        borderRadius: selectedElement.styles.borderRadius || "",
        title: selectedElement.styles.title || "",
        alt: selectedElement.styles.alt || "",
        className: selectedElement.styles.className || "",
      };
  
      // Update fields only if they have changed to avoid unnecessary re-renders
      if (JSON.stringify(fields) !== JSON.stringify(newFields)) {
        setFields(newFields);
      }
    } else {
      // Reset fields to default values when no styles are found
      const defaultFields = {
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
      };
  
      // Update fields only if they are different from the current state
      if (JSON.stringify(fields) !== JSON.stringify(defaultFields)) {
        setFields(defaultFields);
      }
    }
  }, [selectedElement.styles]); // Dependency array ensures proper updates
  
  

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;

    console.log(`name: ${name}, value: ${value}`);

    let updatedValue = type === "checkbox" ? checked : value;

    if (
      ["paddingTop", "paddingLeft", "paddingBottom", "paddingRight"].includes(name)
    ) {
      updatedValue = value && !value.includes("px") ? `${value}px` : value;
    }

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
            <div>
              <label className="block text-sm font-bold text-gray-600 mb-1">Height</label>
              <input
                type="number"
                name="height"
                value={fields.height}
                onChange={handleInputChange}
                placeholder="Height in pixels"
                className="w-full p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-300"
              />
            </div>
            <div>
              <label className="block text-sm font-bold text-gray-600 mb-1">Width</label>
              <input
                type="number"
                name="width"
                value={fields.width}
                onChange={handleInputChange}
                placeholder="Width in pixels"
                className="w-full p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-300"
              />
            </div>
            {/* Padding Section */}
            <div>
              <h4 className="text-sm font-bold text-gray-600 mb-2">Padding</h4>
              <div className="grid grid-cols-4 gap-2">
                <div>
                  <label className="block text-xs font-bold text-gray-500 mb-1">Top</label>
                  <input
                    type="number"
                    name="paddingTop"
                    value={fields.paddingTop?.replace("px", "")}
                    onChange={handleInputChange}
                    placeholder="0"
                    className="w-full p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-300"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-500 mb-1">Right</label>
                  <input
                    type="number"
                    name="paddingRight"
                    value={fields.paddingRight?.replace("px", "")}
                    onChange={handleInputChange}
                    placeholder="0"
                    className="w-full p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-300"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-500 mb-1">Bottom</label>
                  <input
                    type="number"
                    name="paddingBottom"
                    value={fields.paddingBottom?.replace("px", "")}
                    onChange={handleInputChange}
                    placeholder="0"
                    className="w-full p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-300"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-500 mb-1">Left</label>
                  <input
                    type="number"
                    name="paddingLeft"
                    value={fields.paddingLeft?.replace("px", "")}
                    onChange={handleInputChange}
                    placeholder="0"
                    className="w-full p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-300"
                  />
                </div>
              </div>
            </div>


            <div>
              <label className="block text-sm font-bold text-gray-600 mb-1">Border</label>
              <input
                type="text"
                name="border"
                value={fields.border}
                onChange={handleInputChange}
                placeholder="2px solid red"
                className="w-full p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-300"
              />
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
              <label className="block text-sm font-bold text-gray-600 mb-1">URL</label>
              <input
                type="text"
                name="href"
                value={fields.href}
                onChange={handleInputChange}
                placeholder="Enter URL"
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
                <option value="_self">Same Window</option>
                <option value="_blank">New Window</option>
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
              <label className="block text-sm font-bold text-gray-600 mb-1">Title</label>
              <input
                type="text"
                name="title"
                value={fields.title}
                onChange={handleInputChange}
                placeholder="Title"
                className="w-full p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-300"
              />
            </div>
            <div>
              <label className="block text-sm font-bold text-gray-600 mb-1">Alt Text</label>
              <input
                type="text"
                name="alt"
                value={fields.alt}
                onChange={handleInputChange}
                placeholder="Alt Text"
                className="w-full p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-300"
              />
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ImageEditOption;

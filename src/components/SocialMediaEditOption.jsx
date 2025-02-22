import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { updateElementStyles } from "../redux/cardDragableSlice";
import { useMemo } from "react";
import { FiChevronDown, FiChevronRight, FiTrash2, FiPlusCircle } from "react-icons/fi";

const SocialMediaEditOption = () => {
  const [isSettingOpen, setIsSettingOpen] = useState(true);
  const [isTypographyOpen, setIsTypographyOpen] = useState(true);
  const [isSocialItemOpen, setIsSocialItemOpen] = useState(true);
  const [isDimensionOpen, setIsDimensionOpen] = useState(true);
  const [isExtraOpen, setIsExtraOpen] = useState(true);

  const dispatch = useDispatch();
  const { activeWidgetId,activeParentId, activeColumn, droppedItems } = useSelector((state) => state.cardDragable);

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
    mode: "horizontal",
    align: "center",
    fontFamily: "",
    fontSize: "13px",
    fontWeight: "normal",
    lineHeight: "22px",
    color: "#333333",
    backgroundColor: "#ffffff",
    textDecoration: "none",
    fontStyle: "normal",
    iconWidth: "20px",
    borderRadius: "3px",
    paddingTop: "10px",
    paddingBottom: "10px",
    paddingLeft: "25px",
    paddingRight: "25px",
    iconPaddingTop: "4px",
    iconPaddingBottom: "4px",
    iconPaddingLeft: "4px",
    iconPaddingRight: "4px",
    textPaddingTop: "4px",
    textPaddingBottom: "4px",
    textPaddingLeft: "0px",
    textPaddingRight: "4px",
    className: "",

    socialItems: [
      { id: Date.now()+10, iconUrl: "Default Url", iconName: "Facebook", redirectUrl: "" },
      { id: Date.now()+20, iconUrl: "Default Url", iconName: "Instagram", redirectUrl: "" },
      { id: Date.now()+30, iconUrl: "Default Url", iconName: "WhatsApp", redirectUrl: "" },
      { id: Date.now()+40, iconUrl: "Default Url", iconName: "YouTube", redirectUrl: "" },
    ],
  });

  useEffect(() => {
    if (selectedElement.styles) {
      const newFields = {
        mode: selectedElement.styles.mode || "horizontal",
        align: selectedElement.styles.align || "center",
        fontFamily: selectedElement.styles.fontFamily || "",
        fontSize: selectedElement.styles.fontSize || "13px",
        fontWeight: selectedElement.styles.fontWeight || "normal",
        lineHeight: selectedElement.styles.lineHeight || "22px",
        color: selectedElement.styles.color || "#333333",
        backgroundColor: selectedElement.styles.backgroundColor || "#ffffff",
        textDecoration: selectedElement.styles.textDecoration || "none",
        fontStyle: selectedElement.styles.fontStyle || "normal",
        iconWidth: selectedElement.styles.iconWidth || "20px",
        borderRadius: selectedElement.styles.borderRadius || "3px",
        paddingTop: selectedElement.styles.paddingTop || "10px",
        paddingBottom: selectedElement.styles.paddingBottom || "10px",
        paddingLeft: selectedElement.styles.paddingLeft || "25px",
        paddingRight: selectedElement.styles.paddingRight || "25px",
        iconPaddingTop: selectedElement.styles.iconPaddingTop || "4px",
        iconPaddingBottom: selectedElement.styles.iconPaddingBottom || "4px",
        iconPaddingLeft: selectedElement.styles.iconPaddingLeft || "4px",
        iconPaddingRight: selectedElement.styles.iconPaddingRight || "4px",
        textPaddingTop: selectedElement.styles.textPaddingTop || "4px",
        textPaddingBottom: selectedElement.styles.textPaddingBottom || "4px",
        textPaddingLeft: selectedElement.styles.textPaddingLeft || "0px",
        textPaddingRight: selectedElement.styles.textPaddingRight || "4px",
        className: selectedElement.styles.className || "",
        socialItems: selectedElement.styles.socialItems || fields.socialItems,
      };
  
      // Only update fields if there's a meaningful difference
      if (JSON.stringify(fields) !== JSON.stringify(newFields)) {
        setFields(newFields);
      }
    } else {
      // Reset fields to default values when no styles are found
      const defaultFields = {
        mode: "horizontal",
        align: "center",
        fontFamily: "",
        fontSize: "13px",
        fontWeight: "normal",
        lineHeight: "22px",
        color: "#333333",
        backgroundColor: "#ffffff",
        textDecoration: "none",
        fontStyle: "normal",
        iconWidth: "20px",
        borderRadius: "3px",
        paddingTop: "10px",
        paddingBottom: "10px",
        paddingLeft: "25px",
        paddingRight: "25px",
        iconPaddingTop: "4px",
        iconPaddingBottom: "4px",
        iconPaddingLeft: "4px",
        iconPaddingRight: "4px",
        textPaddingTop: "4px",
        textPaddingBottom: "4px",
        textPaddingLeft: "0px",
        textPaddingRight: "4px",
        className: "",
        socialItems: fields.socialItems,
      };
  
      // Only reset fields if they are different
      if (JSON.stringify(fields) !== JSON.stringify(defaultFields)) {
        setFields(defaultFields);
      }
    }
  }, [selectedElement.styles]);
  
  

  const handleInputChange = (e) => {
    const { name, value } = e.target;

    const updatedValue =
      name.includes("padding") ||
      ["iconWidth", "borderRadius", "fontSize", "lineHeight"].includes(name)
        ? value && !value.includes("px")
          ? `${value}px`
          : value
        : value;

    setFields((prev) => ({
      ...prev,
      [name]: updatedValue,
    }));

    console.log("Updated Social Items:", updatedValue);
    dispatch(
      updateElementStyles({
        id: activeWidgetId,
        styles: { [name]: updatedValue },
        ...(activeParentId && { parentId: activeParentId }),
        ...(activeColumn && { column: activeColumn }),
      })
    );
  };


  const handleSocialItemChange = (index, key, value) => {
    const updatedItems = [...fields.socialItems]; // Create a new array
    updatedItems[index] = { ...updatedItems[index], [key]: value }; // Update specific item
  
    setFields((prev) => ({
      ...prev,
      socialItems: updatedItems,
    }));
  
    console.log("Updated Social Items:", updatedItems);
    dispatch(
      updateElementStyles({
        id: activeWidgetId,
        styles: { ...selectedElement.styles, socialItems: updatedItems }, // Ensure full styles object is updated
        ...(activeParentId && { parentId: activeParentId }),
        ...(activeColumn && { column: activeColumn }),
      })
    );
  };
  

  const addSocialItem = () => {
    const newSocialItem = { id: Date.now(), iconUrl: "Default Url", iconName: "Facebook", redirectUrl: "" }
    const updatedItems = [...fields.socialItems, newSocialItem]; // Create new array
  
    setFields((prev) => ({
      ...prev,
      socialItems: updatedItems,
    }));
   
    console.log("Updated Social Items:", updatedItems);
    dispatch(
      updateElementStyles({
        id: activeWidgetId,
        styles: { ...selectedElement.styles, socialItems: updatedItems },
        ...(activeParentId && { parentId: activeParentId }),
        ...(activeColumn && { column: activeColumn }),
      })
    );
  };
  

  const removeSocialItem = (id) => {
    // Filter out the item with the matching id
    const updatedItems = fields.socialItems.filter((item) => item.id !== id);
  
    // Update local state
    setFields((prev) => ({
      ...prev,
      socialItems: updatedItems,
    }));
  
    console.log("Updated Social Items:", updatedItems);
  
    // Dispatch the updated social items list to Redux
    dispatch(
      updateElementStyles({
        id: activeWidgetId,
        styles: { ...selectedElement.styles, socialItems: updatedItems },
        ...(activeParentId && { parentId: activeParentId }),
        ...(activeColumn && { column: activeColumn }),
      })
    );
  };
  
  

  return (
    <div className="w-full max-w-md p-6 bg-white border rounded-lg shadow-lg h-screen overflow-y-auto">
      <h2 className="text-lg font-bold text-gray-800 mb-4">Social Attributes</h2>

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
              <label className="block text-sm font-bold text-gray-600 mb-1">Mode</label>
              <div className="flex space-x-4">
                {["vertical", "horizontal"].map((mode) => (
                  <label key={mode} className="flex items-center space-x-2">
                    <input
                      type="radio"
                      name="mode"
                      value={mode}
                      checked={fields.mode === mode}
                      onChange={handleInputChange}
                      className="form-radio"
                    />
                    <span className="text-sm text-gray-600">{mode}</span>
                  </label>
                ))}
              </div>
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

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-bold text-gray-600 mb-1">Color</label>
                <input 
                  type="color"
                  name="color"
                  value={fields.color}
                  onChange={handleInputChange}
                  className="w-full p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-300"
                />
              </div>
            </div>
            <div>
              <label className="block text-sm font-bold text-gray-600 mb-1">Background Color</label>
              <input
                type="color"
                name="backgroundColor"
                value={fields.backgroundColor}
                onChange={handleInputChange}
                className="w-full p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-300"
              />
            </div>
          </div>
        )}
      </div>

      {/* Social Items */}
      <div className="p-4 m-1 bg-gray-100 rounded-lg">
        {/* Header Section with Expand/Collapse */}
        <div
          className="flex items-center justify-between cursor-pointer px-2 rounded-md transition"
          onClick={() => setIsSocialItemOpen(!isSocialItemOpen)}
        >
          <h3 className="text-md font-semibold text-gray-700">Social Items</h3>
          <button className="text-gray-500 focus:outline-none">
            {isSocialItemOpen ? <FiChevronDown size={18} /> : <FiChevronRight size={18} />}
          </button>
        </div>

        {isSocialItemOpen && (
          <div className="mt-3 space-y-4">
            {fields.socialItems.map((item, index) => (
              <div key={item.id} className="p-4 border rounded-lg bg-white shadow-md relative transition">
                <div className="absolute top-2 right-2">
                  <button
                    // onClick={() => removeSocialItem(item.id)}
                    className="text-red-500 hover:text-red-700 transition"
                    title="Remove"
                  >
                    <FiTrash2 size={18} />
                  </button>
                </div>

                <div className="grid grid-cols-2 gap-4 mb-3">
                  <div>
                    <label className="block text-xs font-semibold text-gray-600">Icon URL</label>
                    <input
                      type="text"
                      placeholder="Paste Icon URL"
                      // value={item.iconUrl}
                      value={'Dedault Url'}
                      onChange={(e) => handleSocialItemChange(index, "iconUrl", e.target.value)}
                      className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-blue-300 text-sm"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-gray-600">Icon Name</label>
                    <input
                      type="text"
                      placeholder="Enter Icon Name"
                      // value={item.iconName}
                      value={index===0? 'Facebook' : index===1? 'Instagram' : index===2? 'WhatsApp': index===3? 'YouTube' : ''}
                      onChange={(e) => handleSocialItemChange(index, "iconName", e.target.value)}
                      className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-blue-300 text-sm"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-gray-600">Redirect URL</label>
                  <input
                    type="text"
                    placeholder="Enter Redirect Url"
                    value={item.redirectUrl}
                    onChange={(e) => handleSocialItemChange(index, "redirectUrl", e.target.value)}
                    className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-blue-300 text-sm"
                  />
                </div>
              </div>
            ))}

            {/* Add New Social Item Button */}
            <button
              onClick={addSocialItem}
              className="flex items-center space-x-2 text-blue-500 hover:underline hover:text-blue-700 transition"
            >
              <FiPlusCircle size={18} />
              <span>Add New Item</span>
            </button>
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
              <label className="block text-sm font-bold text-gray-600 mb-1">Icon Width</label>
              <input
                type="number"
                name="iconWidth"
                value={fields.iconWidth.replace("px", "")}
                onChange={handleInputChange}
                className="w-full p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-300"
              />
            </div>
            <div>
              <label className="block text-sm font-bold text-gray-600 mb-1">Border Radius</label>
              <input
                type="number"
                name="borderRadius"
                value={fields.borderRadius.replace("px", "")}
                onChange={handleInputChange}
                className="w-full p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-300"
              />
            </div>
            <hr className="border border-gray-300 my-4" />
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
            <hr className="border border-gray-300 my-4" />
            <div>
              <label className="block text-sm font-bold text-gray-600 mb-1">Icon Padding</label>
              <div className="grid grid-cols-2 gap-4">
                {["Top", "Bottom", "Left", "Right"].map((direction) => (
                  <div key={direction}>
                    <label className="block text-sm font-bold text-gray-600">
                      {direction} (px)
                    </label>
                    <input
                      type="number"
                      name={`iconPadding${direction}`}
                      value={fields[`iconPadding${direction}`]?.replace("px", "")}
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

export default SocialMediaEditOption;

import React, { useState, useEffect } from "react";
import { FiChevronDown, FiChevronRight } from "react-icons/fi";
import { useDispatch, useSelector } from "react-redux";
import { updateElementStyles } from "../redux/cardDragableSlice";

const ButtonEditOption = () => {
  const [isSettingOpen, setIsSettingOpen] = useState(true);
  const [isDimensionOpen, setIsDimensionOpen] = useState(true);
  const [isColorOpen, setIsColorOpen] = useState(true);
  const [isTypographyOpen, setIsTypographyOpen] = useState(true);
  const [isBorderOpen, setIsBorderOpen] = useState(true);
  const [isExtraOpen, setIsExtraOpen] = useState(true);

  const dispatch = useDispatch();
  const { activeWidgetId, droppedItems } = useSelector(
    (state) => state.cardDragable
  );

  // Find the currently selected element from Redux state
  const selectedElement =
    droppedItems.find((item) => item.id === activeWidgetId) || {};

  const [fields, setFields] = useState({
    content: "",
    href: "#",
    target: "_self",
    width: "",
    paddingTop: "10px",
    paddingLeft: "25px",
    paddingBottom: "10px",
    paddingRight: "25px",

    marginTop: "10px",
    marginLeft: "25px",
    marginBottom: "10px",
    marginRight: "25px",

    color: "#ffffff",
    buttonColor: "#414141",
    backgroundColor: "#ffffff",
    fontFamily: "",
    fontSize: "",
    fontWeight: "normal",
    lineHeight: "120%",
    textDecoration: "none",
    letterSpacing: "",
    textAlign: "left",
    fontStyle: "normal",
    border: "none",
    borderRadius: "3px",
    title: "",
    alt: "",
    className: "",
  });

  // Update local fields state when the selected element changes
  useEffect(() => {
    if (selectedElement.styles) {
      setFields((prev) => ({
        ...prev,
        ...selectedElement.styles,
      }));
    }
  }, [selectedElement]);

  // Handle input changes dynamically
  const handleInputChange = (e) => {
    const { name, value } = e.target;

    // Append 'px' for padding, margin, and other dimension-related fields
    let updatedValue = value;

    if (
      [
        "paddingTop",
        "paddingLeft",
        "paddingBottom",
        "paddingRight",

        "marginTop",
        "marginLeft",
        "marginBottom",
        "marginRight",

        "width",
        "fontSize",
        "letterSpacing",
        "borderRadius",
      ].includes(name)
    ) {
      updatedValue = value && !value.includes("px") ? `${value}px` : value;
    }

    setFields((prev) => ({
      ...prev,
      [name]: updatedValue,
    }));

    // Dispatch updated styles to Redux
    dispatch(
      updateElementStyles({
        id: activeWidgetId,
        styles: { [name]: updatedValue },
      })
    );
  };

  return (
    <div className="w-full max-w-md p-6 bg-white border rounded-lg shadow-lg h-screen overflow-y-auto">
      <h2 className="text-lg font-bold text-gray-800 mb-4">
        Button Attributes
      </h2>

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
            {/* Content */}
            <div>
              <label className="block text-sm font-bold text-gray-600 mb-1">
                Content
              </label>
              <input
                type="text"
                name="content"
                value={fields.content}
                onChange={handleInputChange}
                placeholder="Button"
                className="w-full p-2 border rounded-lg focus:outline-none"
              />
            </div>
            {/* Href */}
            <div>
              <label className="block text-sm font-bold text-gray-600 mb-1">
                Href
              </label>
              <input
                type="text"
                name="href"
                value={fields.href}
                onChange={handleInputChange}
                placeholder="#"
                className="w-full p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-300"
              />
            </div>
            {/* Target */}
            <div>
              <label className="block text-sm font-bold text-gray-600 mb-1">
                Target
              </label>
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
            {/* Width and Font Weight */}
            <div className="grid grid-cols-2 gap-4">
              {/* Width */}
              <div>
                <label className="block text-sm font-bold text-gray-600 mb-1">
                  Width
                </label>
                <input
                  type="text"
                  name="width"
                  value={fields.width}
                  onChange={handleInputChange}
                  className="w-full p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-300"
                />
              </div>
              {/* Font Weight */}
              <div>
                <label className="block text-sm font-bold text-gray-600 mb-1">
                  Font Weight
                </label>
                <select
                  name="fontWeight"
                  value={fields.fontWeight}
                  onChange={handleInputChange}
                  className="w-full p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-300"
                >
                  <option value="normal">Normal</option>
                  <option value="bold">Bold</option>
                </select>
              </div>
            </div>

            {/* Padding */}
            <div>
              <label className="block text-sm font-bold text-gray-600 mb-1">
                Padding
              </label>
              <div className="grid grid-cols-2 gap-4">
                {[
                  { name: "paddingTop", label: "Top (px)" },
                  { name: "paddingLeft", label: "Left (px)" },
                  { name: "paddingBottom", label: "Bottom (px)" },
                  { name: "paddingRight", label: "Right (px)" },
                ].map(({ name, label }) => (
                  <div key={name}>
                    <label className="block text-xs font-bold text-gray-600 mb-1">
                      {label}
                    </label>
                    <input
                      type="number"
                      name={name}
                      value={fields[name]?.replace("px", "")}
                      onChange={handleInputChange}
                      className="w-full p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-300"
                    />
                  </div>
                ))}
              </div>
            </div>

            {/* Margin */}
            <div>
              <label className="block text-sm font-bold text-gray-600 mb-1">
                Margin
              </label>
              <div className="grid grid-cols-2 gap-4">
                {[
                  { name: "marginTop", label: "Top (px)" },
                  { name: "marginLeft", label: "Left (px)" },
                  { name: "marginBottom", label: "Bottom (px)" },
                  { name: "marginRight", label: "Right (px)" },
                ].map(({ name, label }) => (
                  <div key={name}>
                    <label className="block text-xs font-bold text-gray-600 mb-1">
                      {label}
                    </label>
                    <input
                      type="number"
                      name={name}
                      value={fields[name]?.replace("px", "")}
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
              { name: "buttonColor", label: "Button Color" },
              { name: "backgroundColor", label: "Background Color" },
            ].map(({ name, label }) => (
              <div key={name}>
                <label className="block text-sm font-bold text-gray-600 mb-1">
                  {label}
                </label>
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
            <div className="grid grid-cols-2 gap-4">
              {/* Font Family */}
              <div>
                <label className="block text-sm font-bold text-gray-600 mb-1">
                  Font Family
                </label>
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
                <label className="block text-sm font-bold text-gray-600 mb-1">
                  Font Size (px)
                </label>
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
              <label className="block text-sm font-bold text-gray-600 mb-1">
                Line Height
              </label>
              <input
                type="text"
                name="lineHeight"
                value={fields.lineHeight}
                onChange={handleInputChange}
                placeholder="120%"
                className="w-full p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-300"
              />
            </div>
            {/* Text Decoration */}
            <div>
              <label className="block text-sm font-bold text-gray-600 mb-1">
                Text Decoration
              </label>
              <select
                name="textDecoration"
                value={fields.textDecoration}
                onChange={handleInputChange}
                className="w-full p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-300"
              >
                <option value="none">None</option>
                <option value="underline">Underline</option>
                <option value="line-through">Line Through</option>
              </select>
            </div>
            {/* Letter Spacing */}
            <div>
              <label className="block text-sm font-bold text-gray-600 mb-1">
                Letter Spacing
              </label>
              <input
                type="text"
                name="letterSpacing"
                value={fields.letterSpacing}
                onChange={handleInputChange}
                className="w-full p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-300"
              />
            </div>
            {/* Align */}
            <div>
              <label className="block text-sm font-bold text-gray-600 mb-1">
                Align
              </label>
              <div className="flex items-center gap-4">
                {[
                  { label: "Left", value: "left" },
                  { label: "Center", value: "center" },
                  { label: "Right", value: "right" },
                ].map((align) => (
                  <label key={align.value} className="flex items-center">
                    <input
                      type="radio"
                      name="textAlign"
                      value={align.value}
                      checked={fields.textAlign === align.value}
                      onChange={handleInputChange}
                      className="mr-2"
                    />
                    {align.label}
                  </label>
                ))}
              </div>
            </div>
            {/* Font Style */}
            <div>
              <label className="block text-sm font-bold text-gray-600 mb-1">
                Font Style
              </label>
              <div className="flex items-center gap-4">
                {[
                  { label: "Normal", value: "normal" },
                  { label: "Italic", value: "italic" },
                ].map((style) => (
                  <label key={style.value} className="flex items-center">
                    <input
                      type="radio"
                      name="fontStyle"
                      value={style.value}
                      checked={fields.fontStyle === style.value}
                      onChange={handleInputChange}
                      className="mr-2"
                    />
                    {style.label}
                  </label>
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
                   {/* Border */}
                   <div>
                     <label className="block text-sm font-bold text-gray-600 mb-1">
                       Border
                     </label>
                     <input
                       type="text"
                       name="border"
                       value={fields.border}
                       onChange={handleInputChange}
                       placeholder="none"
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
                       value={fields.borderRadius}
                       onChange={handleInputChange}
                       placeholder="3px"
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
                 <div className="mt-3 space-y-4">
                   {/* Title */}
                   <div>
                     <label className="block text-sm font-bold text-gray-600 mb-1">
                       Title
                     </label>
                     <input
                       type="text"
                       name="title"
                       value={fields.title}
                       onChange={handleInputChange}
                       className="w-full p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-300"
                     />
                   </div>
                   {/* Alt */}
                   <div>
                     <label className="block text-sm font-bold text-gray-600 mb-1">
                       Alt
                     </label>
                     <input
                       type="text"
                       name="alt"
                       value={fields.alt}
                       onChange={handleInputChange}
                       className="w-full p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-300"
                     />
                   </div>
                   {/* Class Name */}
                   <div>
                     <label className="block text-sm font-bold text-gray-600 mb-1">
                       Class Name
                     </label>
                     <input
                       type="text"
                       name="className"
                       value={fields.className}
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
       
       export default ButtonEditOption;
       

import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { RxCross2 } from "react-icons/rx";
import { setActiveEditor } from "../../redux/cardToggleSlice";
import { setActiveWidgetId, setActiveWidgetName } from "../../redux/cardDragableSlice";

import img from '../../assets/placeholder.png';

const Image = ({ id }) => {
  const [imageSrc, setImageSrc] = useState(""); // State for the image source
  const [hoveredElement, setHoveredElement] = useState(false); // State for hover
  const [isFocused, setIsFocused] = useState(false); // State for focus

  const { activeWidgetId, droppedItems } = useSelector((state) => state.cardDragable);

  // Find the styles associated with the widget by its ID
  const findStylesById = (items, widgetId) => {
    for (const item of items) {
      if (item.id === id) {
        return item.styles || {};
      }
      // Check for nested children arrays
      const nestedKeys = Object.keys(item).filter((key) => key.startsWith("children"));
      for (const key of nestedKeys) {
        const styles = findStylesById(item[key], widgetId);
        if (styles) {
          console.log("findStylesById: ", styles);
          return styles;
        }
      }
    }
    return null;
  };

  const currentStyles = findStylesById(droppedItems, activeWidgetId) || {};

  const dispatch = useDispatch();

  // Placeholder image URL
  const placeholderImage = img;

  const handleImageUpload = (e) => {
    const file = e.target.files[0]; // Get the selected file
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImageSrc(reader.result); // Set the image source
      };
      reader.readAsDataURL(file);
    }
  };

  const onMouseEnterHandler = () => setHoveredElement(true);
  const onMouseLeaveHandler = () => setHoveredElement(false);

  const onClickHandler = (e) => {
    e.stopPropagation();
    dispatch(setActiveWidgetName("Image"));
    dispatch(setActiveEditor("Image"));
    dispatch(setActiveWidgetId(id));
    setIsFocused(true);
  };

  return (
    <div
      // Removed "flex items-center justify-center" so the image can span the full width
      className={`border-2 rounded-md text-center w-full h-auto bg-gray-50 relative overflow-hidden transition-all duration-300 shadow-sm
        ${hoveredElement ? "hover:border hover:border-dashed hover:border-blue-500" : ""}`}
      onMouseEnter={onMouseEnterHandler}
      onMouseLeave={onMouseLeaveHandler}
      onClick={onClickHandler}
    >
      {/* Image or Placeholder */}
      {currentStyles.imageUrl ? (
        <img
          src={currentStyles.imageUrl}
          alt="Uploaded"
          // Ensures the image takes the full width, auto height, and retains aspect ratio
          className="w-full h-full object-contain rounded"
          style={currentStyles}
        />
      ) : imageSrc ? (
        <img
          src={imageSrc}
          alt="Uploaded"
          // Ensures the image takes the full width, auto height, and retains aspect ratio
          className="w-full h-full object-contain rounded"
          style={currentStyles}
        />
      ) : (
        <div className="flex flex-col items-center justify-center text-gray-500">
          <img
            src={placeholderImage}
            alt="Placeholder"
            className="w-full h-auto object-contain rounded opacity-90"
            style={currentStyles}
          />
        </div>
      )}


      {/* Hidden File Input */}
      
      {/* <input
        type="file"
        id="image-upload"
        accept="image/*"
        className="absolute inset-0 opacity-0 cursor-pointer"
        onChange={handleImageUpload}
      /> */}
     
    </div>
  );
};

export default Image;

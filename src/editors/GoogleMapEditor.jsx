import React, { useState, useEffect, useMemo } from "react";
import { FiChevronDown, FiChevronRight } from "react-icons/fi";
import { useDispatch, useSelector } from "react-redux";
import { updateElementStyles } from "../redux/cardDragableSlice";

const GoogleMapEditor = () => {
  const dispatch = useDispatch();
  const { activeWidgetId, droppedItems, activeParentId, activeColumn } = useSelector((state) => state.cardDragable);

  // **Collapsible Section States**
  const [isLocationOpen, setIsLocationOpen] = useState(true);
  const [isMapOptionsOpen, setIsMapOptionsOpen] = useState(true);

  // **Find Active Map Element in Redux**
  const findElementById = (items, widgetId) => {
    for (const item of items) {
      if (item.id === widgetId) return item;
      const nestedKeys = Object.keys(item).filter((key) => key.startsWith("children"));
      for (const key of nestedKeys) {
        const found = findElementById(item[key], widgetId);
        if (found) return found;
      }
    }
    return null;
  };

  const selectedElement = useMemo(
    () => findElementById(droppedItems, activeWidgetId) || {},
    [droppedItems, activeWidgetId]
  );

  // **State for Map Attributes**
  const [fields, setFields] = useState({
    location: "ATMIK BHARAT Nehru Nagar Bhilai, Chhattisgarh",
    zoom: 10,
    height: 400,
  });

  // **Sync State with Redux**
  useEffect(() => {
    if (selectedElement.styles) {
      setFields((prev) => ({ ...prev, ...selectedElement.styles }));
    }
  }, [selectedElement.styles]);

  // **Handle Input Changes**
  const handleInputChange = (e) => {
    const { name, value } = e.target;

    setFields((prev) => ({
      ...prev,
      [name]: value,
    }));

    dispatch(
      updateElementStyles({
        id: activeWidgetId,
        styles: { [name]: value },
        ...(activeParentId && { parentId: activeParentId }),
        ...(activeColumn && { column: activeColumn }),
      })
    );
  };

  return (
    <div className="w-full max-w-md p-6 bg-white border rounded-lg shadow-lg h-screen overflow-y-auto">
      <h2 className="text-lg font-bold text-gray-800 mb-4">Google Maps Settings</h2>

      {/* 📌 Location Settings */}
      <div className="p-4 mb-3 bg-gray-100 rounded-lg">
        <div className="flex items-center justify-between cursor-pointer" onClick={() => setIsLocationOpen(!isLocationOpen)}>
          <h3 className="text-md font-bold text-gray-700">Location</h3>
          <button className="text-gray-500 focus:outline-none">
            {isLocationOpen ? <FiChevronDown /> : <FiChevronRight />}
          </button>
        </div>
        {isLocationOpen && (
          <div className="mt-3">
            <label className="block text-sm font-bold text-gray-600 mb-1">Location</label>
            <input
              type="text"
              name="location"
              value={fields.location}
              onChange={handleInputChange}
              placeholder="Enter location"
              className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-blue-300"
            />
          </div>
        )}
      </div>

      {/* 📌 Map Options */}
      <div className="p-4 bg-gray-100 rounded-lg">
        <div className="flex items-center justify-between cursor-pointer" onClick={() => setIsMapOptionsOpen(!isMapOptionsOpen)}>
          <h3 className="text-md font-bold text-gray-700">Map Options</h3>
          <button className="text-gray-500 focus:outline-none">
            {isMapOptionsOpen ? <FiChevronDown /> : <FiChevronRight />}
          </button>
        </div>
        {isMapOptionsOpen && (
          <div className="mt-3 space-y-4">
            {/* Zoom Slider */}
            <div>
              <label className="block text-sm font-bold text-gray-600 mb-1">Zoom Level</label>
              <input
                type="range"
                name="zoom"
                min="1"
                max="20"
                value={fields.zoom}
                onChange={handleInputChange}
                className="w-full"
              />
              <input
                type="number"
                name="zoom"
                value={fields.zoom}
                onChange={handleInputChange}
                className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-blue-300 mt-2"
              />
            </div>

            {/* Height Slider */}
            <div>
              <label className="block text-sm font-bold text-gray-600 mb-1">Height (px)</label>
              <input
                type="range"
                name="height"
                min="200"
                max="800"
                value={fields.height}
                onChange={handleInputChange}
                className="w-full"
              />
              <input
                type="number"
                name="height"
                value={fields.height}
                onChange={handleInputChange}
                className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-blue-300 mt-2"
              />
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default GoogleMapEditor;

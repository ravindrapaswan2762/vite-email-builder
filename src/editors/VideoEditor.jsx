import React, { useState, useEffect, useMemo } from "react";
import { FiChevronDown, FiChevronRight } from "react-icons/fi";
import { useDispatch, useSelector } from "react-redux";
import { updateElementStyles } from "../redux/cardDragableSlice";

const VideoEditor = () => {
  const dispatch = useDispatch();
  const { activeWidgetId, droppedItems, activeParentId, activeColumn} = useSelector((state) => state.cardDragable);

  // **Collapsible Section States**
  const [isBasicOpen, setIsBasicOpen] = useState(true);
  const [isVideoOptionsOpen, setIsVideoOptionsOpen] = useState(true);

  // **Find Active Video Element in Redux State**
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

  // **State for Video Attributes**
  const [fields, setFields] = useState({
    videoUrl: "",
    autoplay: true,
    mute: false,
    loop: false,
    playerControls: true,
    modestBranding: false,
    captions: false,
    privacyMode: false,
  });

  // **Sync State with Redux**
  useEffect(() => {
    if (selectedElement.styles) {
      setFields((prev) => ({ ...prev, ...selectedElement.styles }));
    }
  }, [selectedElement.styles]);


  const handleInputChange = (e) => {
    const { name, type, value, checked } = e.target;

    // If it's a checkbox, use `checked`, otherwise use `value`
    let updatedValue = type === "checkbox" ? checked : value;

    console.log("handleInputChange in VideoEditor: ", "name:", name, "updatedValue:", updatedValue);

    setFields((prev) => ({
      ...prev,
      [name]: updatedValue,
    }));

    dispatch(
      updateElementStyles({
        id: activeWidgetId,
        styles: { [name]: updatedValue },
        ...(activeParentId && { parentId: activeParentId }), // Include parentId if activeParentId is valid
        ...(activeColumn && { column: activeColumn }),
      })
    );
  };


  return (
    <div className="w-full max-w-md p-6 bg-white border rounded-lg shadow-lg h-screen overflow-y-auto">
      <h2 className="text-lg font-bold text-gray-800 mb-4">Video Settings</h2>

      {/* 📌 Basic Settings */}
      <div className="p-4 mb-3 bg-gray-100 rounded-lg">
        <div className="flex items-center justify-between cursor-pointer" onClick={() => setIsBasicOpen(!isBasicOpen)}>
          <h3 className="text-md font-bold text-gray-700">Basic Settings</h3>
          <button className="text-gray-500 focus:outline-none">
            {isBasicOpen ? <FiChevronDown /> : <FiChevronRight />}
          </button>
        </div>
        {isBasicOpen && (
          <div className="mt-3 space-y-4">
            {/* Video URL */}
            <div>
              <label className="block text-sm font-bold text-gray-600 mb-1">Video Link</label>
              <input
                type="text"
                name="videoUrl"
                value={fields.videoUrl}
                onChange={handleInputChange}
                placeholder="Enter YouTube/Vimeo URL"
                className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-blue-300"
              />
            </div>
          </div>
        )}
      </div>

      {/* 📌 Video Options */}
      <div className="p-4 bg-gray-100 rounded-lg">
        <div className="flex items-center justify-between cursor-pointer" onClick={() => setIsVideoOptionsOpen(!isVideoOptionsOpen)}>
          <h3 className="text-md font-bold text-gray-700">Video Options</h3>
          <button className="text-gray-500 focus:outline-none">
            {isVideoOptionsOpen ? <FiChevronDown /> : <FiChevronRight />}
          </button>
        </div>
        {isVideoOptionsOpen && (
          <div className="mt-3 space-y-4">
            {[
              { name: "autoplay", label: "Autoplay" },
              { name: "mute", label: "Mute" },
              { name: "loop", label: "Loop" },
              { name: "playerControls", label: "Player Controls" },
              { name: "modestBranding", label: "Modest Branding" },
              { name: "captions", label: "Captions" },
              { name: "privacyMode", label: "Privacy Mode" },
            ].map(({ name, label }) => (
              <div key={name} className="flex justify-between items-center">
                <label className="text-sm font-bold text-gray-700">{label}</label>
                  
                <label className="relative inline-flex items-center cursor-pointer">
                  <input 
                    type="checkbox" 
                    name={name} 
                    checked={fields[name]} 
                    onChange={handleInputChange} 
                    className="sr-only peer" 
                  />
                  
                  <div className="w-16 h-7 bg-gray-300 rounded-full flex items-center transition-all
                      peer-checked:bg-blue-400 peer-checked:flex-row-reverse">

                    

                    {/* Knob (Toggle Button) - Swaps position with text after toggling */}
                    <span className="w-6 h-6 bg-white rounded-full border transition-all transform
                        peer-checked:translate-x-7">
                    </span>

                    {/* Text - Swaps position after toggling */}
                    <span className="text-sm font-medium transition-all px-2">
                      {fields[name] ? <span className="text-white">Yes</span> : <span className="text-gray-700">No</span>}
                    </span>

                  </div>
                </label>

              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default VideoEditor;

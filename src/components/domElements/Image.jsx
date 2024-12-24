import React, { useState } from "react";
import { deleteDroppedItemById } from "../../redux/cardDragableSlice";
import { useDispatch } from "react-redux";
import { RxCross2 } from "react-icons/rx";
import { useSelector } from "react-redux";

const Image = ({id}) => {
  const [imageSrc, setImageSrc] = useState(""); // State for the image source

  const { activeWidgetId, droppedItems } = useSelector((state) => state.cardDragable);

  const currentStyles = droppedItems.find((item) => item.id === id)?.styles || {};

  const dispatch = useDispatch();

  // New and improved placeholder image URL
  const placeholderImage =
    "https://dummyimage.com/300x300/ccc/000.png&text=Upload+Image";

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

  return (
    <div
      className="border-2 border-gray-300 p-2 rounded-md text-center w-full h-[300px] bg-gray-50 flex items-center justify-center relative overflow-hidden hover:border-blue-400 transition-all duration-300 shadow-sm"
      onClick={(e) => e.stopPropagation()}
    >

      <button
          onClick={()=>dispatch(deleteDroppedItemById(id))}
          className="absolute -top-1 -right-1 text-white p-1 rounded-full transition-all duration-200 z-10"
          >
          <div className="text-black mb-2 ml-2"><RxCross2 size={18} /></div>
      </button>

      {imageSrc ? (
        <img
          src={imageSrc}
          alt="Uploaded"
          className="w-full h-full object-contain rounded"
        />
      ) : (
        <div className="flex flex-col items-center justify-center text-gray-500">
          <img
            src={placeholderImage}
            alt="Placeholder"
            className="w-full h-full object-cover rounded opacity-90"
            style={currentStyles}
          />
        </div>
      )}

      {/* Hidden File Input */}
      <input
        type="file"
        accept="image/*"
        className="absolute inset-0 opacity-0 cursor-pointer"
        onChange={handleImageUpload}
      />
    </div>
  );
};

export default Image;

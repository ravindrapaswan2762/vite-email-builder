import React from "react";
import { v4 as uuidv4 } from "uuid";

import { CiText } from "react-icons/ci";
import { MdOutlineHorizontalRule } from "react-icons/md";
import { RxButton } from "react-icons/rx";
import { IoShareSocialOutline } from "react-icons/io5";
import { BsTextareaResize } from "react-icons/bs";
import { MdSpaceBar } from "react-icons/md";
import { CiImageOn } from "react-icons/ci";

import Widget from "./Widget";
import { blue } from "@mui/material/colors";
import LoadSavedData from "./LoadSaveData";

const Sidebar = () => {
  const widgets = [
    { id: uuidv4(), name: "Text", icon: CiText },
    { id: uuidv4(), name: "Button", icon: RxButton },
    { id: uuidv4(), name: "Image", icon: CiImageOn },
    { id: uuidv4(), name: "TextArea", icon: BsTextareaResize },
    { id: uuidv4(), name: "Divider", icon: MdOutlineHorizontalRule },
    { id: uuidv4(), name: "Space", icon: MdSpaceBar },
    { id: uuidv4(), name: "SocialMedia", icon: IoShareSocialOutline },
  ];

  return (
    // <div
    //   className="w-full max-w-xs border rounded-lg p-4 bg-gray-50 shadow-lg grid grid-cols-2 h-screen overflow-y-auto"
    //   style={{ height: "auto" }}
    // >
    //   <h3 className="col-span-2 text-lg font-semibold text-gray-800 text-center">
    //     Widgets
    //   </h3>
    //   {widgets.map((widget) => (
    //     <Widget key={widget.id} id={widget.id} name={widget.name} icon={widget.icon} />
    //   ))}
    // </div>


    <div
      style={{

        display: "flex",
        flexDirection: "row",
        flexWrap: "wrap",
        
        width: "100%",
        // Tailwind `max-w-xs` is roughly 20rem (320px)
        maxWidth: "20rem",
        // Tailwind `border` => 1px solid default border color (#e5e7eb)
        border: "1px solid #e5e7eb",
        // Tailwind `rounded-lg` => border-radius: 0.5rem
        borderRadius: "0.5rem",
        // Tailwind `p-4` => padding: 1rem
        padding: "1rem",
        // Tailwind `bg-gray-50` => background-color: #f9fafb
        backgroundColor: "#f9fafb",
        // Tailwind `shadow-lg` => approximate large box-shadow
        boxShadow:
          "0 10px 15px -3px rgba(0,0,0,0.1), 0 4px 6px -4px rgba(0,0,0,0.1)",
  
        height: "auto",
        overflowY: "auto",
      }}
    >
      

      {/* Render each widget */}
      <div style={{display: "flex", flexDirection: "row", flexWrap: "wrap", height: "40%"}}>
        {widgets.map((widget) => (
          <Widget
            key={widget.id}
            id={widget.id}
            name={widget.name}
            icon={widget.icon}
          />
        ))}
        
        <div style={{width: "100%", marginTop: "5%"}}>
          <LoadSavedData />
        </div>
      </div>
      
    </div>


  );
};

export default Sidebar;

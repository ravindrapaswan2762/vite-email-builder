import React from "react";
import { v4 as uuidv4 } from "uuid";

import { CiText } from "react-icons/ci";
import { MdOutlineHorizontalRule } from "react-icons/md";
import { RxButton } from "react-icons/rx";
import { IoShareSocialOutline } from "react-icons/io5";
import { BsTextareaResize } from "react-icons/bs";
import { MdSpaceBar } from "react-icons/md";
import { CiImageOn } from "react-icons/ci";
import { CiYoutube } from "react-icons/ci";
import { IoLocationOutline } from "react-icons/io5";

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
    { id: uuidv4(), name: "VideoPlayer", icon: CiYoutube },
    { id: uuidv4(), name: "GoogleMap", icon: IoLocationOutline },
  ];

  return (

    <div
      style={{
        display: "flex",
        flexDirection: "row",
        flexWrap: "wrap",
        width: "100%",
        maxWidth: "20rem",
        border: "1px solid #e5e7eb",
        borderRadius: "0.5rem",
        padding: "1rem",
        backgroundColor: "#f9fafb",
        boxShadow:"0 10px 15px -3px rgba(0,0,0,0.1), 0 4px 6px -4px rgba(0,0,0,0.1)",
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

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
    <div
      className="w-full max-w-xs border rounded-lg p-4 bg-gray-50 shadow-lg grid grid-cols-2 gap-4 h-screen overflow-y-auto"
      style={{ height: "100vh" }}
    >
      <h3 className="col-span-2 mb-4 text-lg font-semibold text-gray-800 text-center">
        Widgets
      </h3>
      {widgets.map((widget) => (
        <Widget key={widget.id} id={widget.id} name={widget.name} icon={widget.icon} />
      ))}
    </div>
  );
};

export default Sidebar;

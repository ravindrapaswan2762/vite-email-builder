import React, { useState } from "react";
import { FiChevronDown, FiChevronRight } from "react-icons/fi";

const PageAttributes = () => {
  const [isEmailSettingOpen, setIsEmailSettingOpen] = useState(true);
  const [isThemeSettingOpen, setIsThemeSettingOpen] = useState(true);

  const [emailSettings, setEmailSettings] = useState({
    subject: "Welcome to Atmik Bharat",
    subtitle: "Nice to meet you!",
    width: "600px",
    breakpoint: "480px",
  });

  const [themeSettings, setThemeSettings] = useState({
    fontFamily:
      "-apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Oxygen', 'Ubuntu', 'Cantarell', 'Fira Sans', 'Droid Sans','Helvetica Neue', sans-serif",
    fontSize: "14",
    lineHeight: "1.7",
    fontWeight: "400",
    textColor: "#000000",
    background: "#efeeea",
    contentBackground: "",
    userStyle: "",
    importFont: {
      name: "",
      href: "",
    },
  });

  const handleEmailChange = (e) => {
    const { name, value } = e.target;
    setEmailSettings({ ...emailSettings, [name]: value });
  };

  const handleThemeChange = (e) => {
    const { name, value } = e.target;
  
    // Check if the field belongs to a nested object (like importFont)
    if (name.includes(".")) {
      const [parent, child] = name.split("."); // Split the nested key (e.g., "importFont.name")
      setThemeSettings((prevSettings) => ({
        ...prevSettings,
        [parent]: {
          ...prevSettings[parent],
          [child]: value,
        },
      }));
    } else {
      // Update the root-level field
      setThemeSettings((prevSettings) => ({
        ...prevSettings,
        [name]: value,
      }));
    }
  };
  

  const handleImportFontChange = (e) => {
    const { name, value } = e.target;
    setThemeSettings((prevSettings) => ({
      ...prevSettings,
      importFont: {
        ...prevSettings.importFont,
        [name]: value,
      },
    }));
  };

  return (
    <div className="w-full max-w-md p-1 bg-white border rounded-lg shadow-lg h-screen overflow-y-auto">
      <h2 className="text-lg font-bold text-gray-800 mb-4">Page Attributes</h2>

      {/* Email Setting */}
      <div className="p-4 m-1 bg-gray-100 rounded-lg">
        <div
          className="flex items-center justify-between cursor-pointer"
          onClick={() => setIsEmailSettingOpen(!isEmailSettingOpen)}
        >
          <h3 className="text-md font-bold text-gray-700">Email Setting</h3>
          <button className="text-gray-500 focus:outline-none">
            {isEmailSettingOpen ? <FiChevronDown /> : <FiChevronRight />}
          </button>
        </div>
        {isEmailSettingOpen && (
          <div className="mt-3 space-y-4">
            <div>
              <label className="block text-sm font-bold text-gray-600 mb-1">
                Subject
              </label>
              <input
                type="text"
                name="subject"
                value={emailSettings.subject}
                onChange={handleEmailChange}
                className="w-full p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-300"
              />
            </div>
            <div>
              <label className="block text-sm font-bold text-gray-600 mb-1">
                SubTitle
              </label>
              <input
                type="text"
                name="subtitle"
                value={emailSettings.subtitle}
                onChange={handleEmailChange}
                className="w-full p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-300"
              />
            </div>
            <div>
              <label className="block text-sm font-bold text-gray-600 mb-1">
                Width
              </label>
              <input
                type="text"
                name="width"
                value={emailSettings.width}
                onChange={handleEmailChange}
                className="w-full p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-300"
              />
            </div>
            <div>
              <label className="block text-sm font-bold text-gray-600 mb-1">
                Breakpoint
              </label>
              <input
                type="text"
                name="breakpoint"
                value={emailSettings.breakpoint}
                onChange={handleEmailChange}
                className="w-full p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-300"
              />
            </div>
            <p className="text-xs text-gray-500">
              Allows you to control on which breakpoint the layout should go
              desktop/mobile.
            </p>
          </div>
        )}
      </div>

      {/* Theme Setting */}
      <div className="p-4 m-1 bg-gray-100 rounded-lg">
        <div
          className="flex items-center justify-between cursor-pointer"
          onClick={() => setIsThemeSettingOpen(!isThemeSettingOpen)}
        >
          <h3 className="text-md font-bold text-gray-700">Theme Setting</h3>
          <button className="text-gray-500 focus:outline-none">
            {isThemeSettingOpen ? <FiChevronDown /> : <FiChevronRight />}
          </button>
        </div>
        {isThemeSettingOpen && (
          <div className="mt-3 space-y-4">
            <div>
              <label className="block text-sm font-bold text-gray-600 mb-1">
                Font Family
              </label>
              <input
                type="text"
                name="fontFamily"
                value={themeSettings.fontFamily}
                onChange={handleThemeChange}
                className="w-full p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-300"
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-bold text-gray-600 mb-1">
                  Font Size (px)
                </label>
                <input
                  type="number"
                  name="fontSize"
                  value={themeSettings.fontSize}
                  onChange={handleThemeChange}
                  className="w-full p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-300"
                />
              </div>
              <div>
                <label className="block text-sm font-bold text-gray-600 mb-1">
                  Line Height
                </label>
                <input
                  type="text"
                  name="lineHeight"
                  value={themeSettings.lineHeight}
                  onChange={handleThemeChange}
                  className="w-full p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-300"
                />
              </div>
              <div>
                <label className="block text-sm font-bold text-gray-600 mb-1">
                  Font Weight
                </label>
                <input
                  type="number"
                  name="fontWeight"
                  value={themeSettings.fontWeight}
                  onChange={handleThemeChange}
                  className="w-full p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-300"
                />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">

              {/* ************** */}
            <div>
              <label className="block text-sm font-bold text-gray-600 mb-1">Text Color</label>
              <div className="relative">
                <input
                  type="text"
                  name="textColor"
                  value={themeSettings.textColor}
                  onChange={handleThemeChange}
                  className="w-full pl-12 p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-300"
                />
                <input
                  type="color"
                  name="textColor"
                  value={themeSettings.textColor}
                  onChange={handleThemeChange}
                  className="absolute left-2 top-2 w-8 h-8 border rounded-lg cursor-pointer"
                />
              </div>
            </div>
              {/* **************** */}
              <div>
              <label className="block text-sm font-bold text-gray-600 mb-1">Background</label>
              <div className="relative">
                <input
                  type="text"
                  name="background"
                  value={themeSettings.background}
                  onChange={handleThemeChange}
                  className="w-full pl-12 p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-300"
                />
                <input
                  type="color"
                  name="background"
                  value={themeSettings.background}
                  onChange={handleThemeChange}
                  className="absolute left-2 top-2 w-8 h-8 border rounded-lg cursor-pointer"
                />
              </div>
            </div>
            {/* ***************** */}


            </div>

            <div>
              <label className="block text-sm font-bold text-gray-600 mb-1">Content Background</label>
              <div className="relative">
                <input
                  type="text"
                  name="contentBackground"
                  value={themeSettings.contentBackground}
                  onChange={handleThemeChange}
                  className="w-full pl-12 p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-300"
                />
                <input
                  type="color"
                  name="contentBackground"
                  value={themeSettings.contentBackground}
                  onChange={handleThemeChange}
                  className="absolute left-2 top-2 w-8 h-8 border rounded-lg cursor-pointer"
                />
              </div>
            </div>



            <div>
              <label className="block text-sm font-bold text-gray-600 mb-1">
                User Style
              </label>
              <textarea
                name="userStyle"
                value={themeSettings.userStyle}
                onChange={handleThemeChange}
                className="w-full p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-300"
              />
            </div>
            <div>
              <label className="block text-sm font-bold text-gray-600 mb-1">
                Import Font
              </label>
              <div className="grid grid-cols-2 gap-4">
                <input
                  type="text"
                  name="name"
                  placeholder="Name"
                  value={themeSettings.importFont.name}
                  onChange={handleImportFontChange}
                  className="w-full p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-300"
                />
                <input
                  type="text"
                  name="href"
                  placeholder="Href"
                  value={themeSettings.importFont.href}
                  onChange={handleImportFontChange}
                  className="w-full p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-300"
                />
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default PageAttributes;

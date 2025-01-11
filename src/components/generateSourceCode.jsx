// Helper function to generate inline styles
export const generateInlineStyles = (styles) => {
    return Object.entries(styles)
      .map(([key, value]) => `${key}: ${value};`)
      .join(" ");
  };
  
  // Recursive function to generate source code from state
  export const generateSourceCode = (items) => {
    return items
      .map((item) => {
        const { name, children = [], styles = {} } = item;
  
        // Generate inline styles
        const inlineStyles = generateInlineStyles(styles);
        console.log("inlineStyles: ", inlineStyles);
  
        // Base case for individual widgets
        let html = "";
        switch (name) {
          case "Text":
            html = `
            <div style={{ position: \"relative\"}}>
              <input
  
                type=\"text\"
                className=\"border p-2 rounded w-full\"
                placeholder=\"Text Field\"
                value={val}
                style=\"${inlineStyles}\" 
              />
            </div>
          `;
          break;
          case "Button":
            html = `
              <div className=\"flex justify-center w-full\"  style="backgroundColor: \"${inlineStyles.backgroundColor}\">
              
                <div className=\"relative w-full h-[50px] border border-2 border-gray-300 flex items-center p-1\" 
                          style={{ display: "flex", alignItems: "center", justifyContent: ${inlineStyles.textAlign}, height: "auto" }}>
                  {(
                    <button
                     
                      style=\"${inlineStyles}\ ${inlineStyles.buttonColor}\" 
                      className=\"relative bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600 transition duration-200 text-center\"
                    >
                      {currentStyles.content ? currentStyles.content : \"Submit\"}
                    </button>
                  )}
                </div>
              </div>
            `;
            break;
          case "Image":
              html = `
                <div
                  className=\"border-2 border-gray-300 p-2 rounded-md text-center w-full h-[300px] bg-gray-50 flex items-center justify-center relative overflow-hidden hover:border-blue-400 transition-all duration-300 shadow-sm\"
                >
                  <img
                      src={imageSrc}
                      alt=\"Uploaded\"
                      className=\"w-full h-full object-contain rounded\"
                      style=\"${inlineStyles}\"
                    />
                </div>
              `;
              break;
          case "TextArea":
            html = `
              <div>
                <textarea 
                className=\"border p-2 rounded w-full\" placeholder=\"Text Area\" 
                value={val}
                style=\"${inlineStyles}\" 
                />
              </div>
            `;
            break;
          case "Divider":
            html = `
              <div
                style={{ position: "relative" }}
              >
                <hr
                  className="w-full"
                  style=\"${inlineStyles}\" 
                />
              </div>
            `;
            break;
          case "Space":
            html = `
              <div
                style={{ width: "100%", height: "1rem" }}
                style=\"${inlineStyles}\" 
              ></div>
            `;
            break;
          case "SocialMedia":
            html = `
                <div style=\"${inlineStyles}\">
      
                  <div style={{display: "flex",alignItems: "center",gap: "0.5rem",cursor: "pointer"}} >
                    <FaFacebook style={{fontSize: "1.25rem",color: "#2563EB"}} />
                    <span style={{ fontSize: "0.875rem" }}> Facebook </span>
                  </div>

                  <div style={{ display: "flex", alignItems: "center",gap: "0.5rem",cursor: "pointer"}}>
                    <FaGoogle style={{ fontSize: "1.25rem", color: "#DC2626"}} />
                    <span style={{ fontSize: "0.875rem" }}>Google</span>
                  </div>

                  <div
                    style={{ display: "flex", alignItems: "center",  gap: "0.5rem", cursor: "pointer"}} >
                    <FaTwitter style={{ fontSize: "1.25rem",  color: "#60A5FA"  }} />
                    <span style={{ fontSize: "0.875rem" }}>Twitter</span>
                  </div>
                </div>
            `;
            break;
          case "1-column":
            html = `
              <div
                className=\"border p-1 bg-white rounded-md text-center min-h-[150px] relative\"
              >
                <div className=\"border border-dashed p-1 bg-gray-50 rounded-md text-center hover:bg-gray-200 min-h-[150px]\">
                    ${generateSourceCode(children)}
                </div>
              </div>
            `;
            break;
          case "2-columns":
              html = `
                <div className=\"relative grid grid-cols-2 gap-1 border p-1 rounded-md bg-white shadow-md hover:shadow-lg transition-all duration-300\">

                  {/* Column A */}
                  <div
                    className=\"border border-dashed p-4 bg-gray-50 rounded-md text-center hover:bg-gray-200 min-h-[150px]\"
                  >
                    <p className=\"text-gray-500 font-medium mb-2\">Column A</p>
                    ${generateSourceCode(children)}
                  </div>
    
                  {/* Column B */}
                  <div
                    className=\"border border-dashed p-4 bg-gray-50 rounded-md text-center hover:bg-gray-200 min-h-[150px]\"
                  >
                    <p className=\"text-gray-500 font-medium mb-2\">Column B</p>
                    ${generateSourceCode(children)}
                  </div>
                </div>
              `;
              break;
          case "3-columns":
                html = `
                  <div className=\"relative grid grid-cols-3 gap-1 border p-1 rounded-md bg-white shadow-md hover:shadow-lg transition-all duration-300\">
                    <div
                      className=\"border border-dashed p-4 bg-gray-50 rounded-md text-center hover:bg-gray-200 min-h-[150px]\">
                      ${generateSourceCode(children)}
                    </div>
                    <div
                      className=\"border border-dashed p-4 bg-gray-50 rounded-md text-center hover:bg-gray-200 min-h-[150px]\">
                      ${generateSourceCode(children)}
                    </div>
                    <div
                      className=\"border border-dashed p-4 bg-gray-50 rounded-md text-center hover:bg-gray-200 min-h-[150px]\">
                      ${generateSourceCode(children)}
                    </div>
                  </div>
                `;
                break;
          default:
            html = `<div style=\"${inlineStyles}\">Unknown Widget</div>`;
            break;
        }
  
        // Avoid rendering children separately within the parent
        console.log("html: ",html);
        return html;
      })
      .join("");
  };
  
  
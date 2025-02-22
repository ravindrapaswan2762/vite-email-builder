

import { extractSocialMediaHTML } from "../externalFunctions"; 
import { FaFacebook, FaInstagram, FaWhatsapp, FaYoutube} from "react-icons/fa"; // Example using FontAwesome icons

// // Helper function to generate inline styles in JSX object format
export const generateInlineStyles = (styles) => {
  return Object.entries(styles).reduce((acc, [key, value]) => {
    acc[key] = `${value}`; // Ensures all values are stored as strings for JSX
    return acc;
  }, {});
};

// Function to generate styles for custom columns
export const generateCustomColumnStyles = (column) => {
  return generateInlineStyles(column.styles);
};

// Recursive function to generate source code
export const generateSourceCode = (items) => {
  console.log("generateSourceCode called!");
  return items
    .map((item) => {
      const { name, children = [], styles = {}, content } = item;

      // ✅ Convert styles to JSX-friendly format
      const inlineStyles = generateInlineStyles(styles);
      console.log("styles: =>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>> ",styles);

      const inlineStylesString = JSON.stringify(inlineStyles)
        .replace(/"([^"]+)":/g, "$1:")
        .replace(/"/g, "'") // Fix JSX formatting
        .slice(1, -1); // Remove extra `{}`

        
      console.log("inlineStylesString: =>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>> ",inlineStylesString);

//*********************************************************
          
//*******************************************************

      let html = "";

      switch (name) {
        case "Text":
          html = `
            <div style={{ ${inlineStylesString} }} className="mb-2">
              <input
                type="text"
                className="p-2 rounded w-full border-none bg-transparent mb-2"
                placeholder="Text Field"
                value="${content}"
                style={{ ${inlineStylesString} }} 
              />
            </div>
          `;
          break;

        case "Button":

        const filteredStyles = { ...inlineStyles };

        delete filteredStyles.backgroundColor;
        delete filteredStyles.textAlign;
        delete filteredStyles.buttonColor;
  
        // Convert remaining styles to JSX format
        const filteredInlineStylesString = JSON.stringify(filteredStyles)
        .replace(/"([^"]+)":/g, "$1:")
        .replace(/"/g, "'") // Fix JSX formatting
        .slice(1, -1); // Remove extra `{}`


        console.log("filteredInlineStylesString: ", filteredInlineStylesString);
          

          html = `
            <div className="flex justify-center w-full" style={{ backgroundColor: "${styles.backgroundColor}" }}>
              <div className="relative w-full h-[50px] flex items-center p-1"
                   style={{ display: "flex", alignItems: "center", justifyContent: "${styles.textAlign || "center"}", height: "auto" }}>
                <button
                 style={{ backgroundColor: "${styles.buttonColor}", ${filteredInlineStylesString}  }}
                  className="relative bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600 transition duration-200 text-center"
                >
                  ${content || "Submit"}
                </button>
              </div>
            </div>
          `;
          break;

        case "Image":
          html = `
            <div className="rounded-md text-center w-full h-auto flex items-center justify-center
                            relative overflow-hidden border-none bg-transparent mb-1"
                 style={{ ${inlineStylesString} }}>
              <img src="${styles.imageUrl || "placeholder.jpg"}" className="w-full h-full object-contain rounded" />
            </div>
          `;
          break;

        case "TextArea":
          html = `
            <div className="mb-2">
              <textarea 
                className="p-2 rounded w-full border-none bg-transparent" placeholder="Text Area" 
                value="${content}"
                style={{ ${inlineStylesString} }} 
              />
            </div>
          `;
          break;

        case "Divider":
          html = `
            <div style={{ position: "relative" }}  className="mb-2">
              <hr className="w-full" style={{ ${inlineStylesString} }} />
            </div>
          `;
          break;

        case "Space":
          html = `
            <div style={{ width: "100%", height: "1rem", ${inlineStylesString} }}  className="mb-2" ></div>
          `;
          break;

          case "SocialMedia":
            const socialMediaStyles = generateInlineStyles(styles);
            const socialMediaStylesString = JSON.stringify(socialMediaStyles)
              .replace(/"([^"]+)":/g, "$1:")
              .replace(/"/g, "'") // Fix JSX formatting
              .slice(1, -1); // Remove extra `{}`
          
            html = `
              <div style={{ backgroundColor: "${styles.backgroundColor || "transparent"}", display: "flex", flexDirection: "${styles.mode === "vertical" ? "column" : "row"}", justifyContent: "${styles.align === "left" ? "flex-start" : styles.align === "right" ? "flex-end" : "center"}", alignItems: "center", width: "100%", gap: "15px" }}>
              
                <div 
                  style={{
                    display: "flex",
                    flexDirection: "${styles.mode === "vertical" ? "column" : "row"}",
                    width: "100%",
                    gap: "10px",
                    alignItems: "${styles.mode === "vertical" ? (styles.align === "left" ? "flex-start" : styles.align === "right" ? "flex-end" : "center") : "center"}",
                    justifyContent: "${styles.mode === "vertical" ? "center" : styles.align === "left" ? "flex-start" : styles.align === "right" ? "flex-end" : "center"}"
                  }}

                >
                  
                  <div className="cursor-pointer" onClick={() => window.open('https://www.facebook.com', '_blank')} 
                       style={{ display: "flex", alignItems: "center", justifyContent: "center", width: "${styles.iconWidth || "30px"}", height: "${styles.iconWidth || "30px"}", paddingTop: "${styles.iconPaddingTop}px", paddingRight: "${styles.iconPaddingRight}px", paddingBottom: "${styles.iconPaddingBottom}px", paddingLeft: "${styles.iconPaddingLeft}px", borderRadius: "${styles.borderRadius || "50%"}" }}>
                    <img src="https://upload.wikimedia.org/wikipedia/commons/5/51/Facebook_f_logo_%282019%29.svg" alt="Facebook" width=${styles.iconWidth || "30px"}" height=${styles.iconWidth || "30px"}" style={{ objectFit: "contain" }} />
                  </div>
          
                  <div className="cursor-pointer" onClick={() => window.open('https://www.instagram.com', '_blank')} 
                       style={{ display: "flex", alignItems: "center", justifyContent: "center", width: "${styles.iconWidth || "30px"}", height: "${styles.iconWidth || "30px"}", paddingTop: "${styles.iconPaddingTop}px", paddingRight: "${styles.iconPaddingRight}px", paddingBottom: "${styles.iconPaddingBottom}px", paddingLeft: "${styles.iconPaddingLeft}px", borderRadius: "${styles.borderRadius || "50%"}" }}>
                    <img src="https://upload.wikimedia.org/wikipedia/commons/a/a5/Instagram_icon.png" alt="Instagram" width=${styles.iconWidth || "30px"}" height=${styles.iconWidth || "30px"}" style={{ objectFit: "contain" }} />
                  </div>
          
                  <div className="cursor-pointer" onClick={() => window.open('https://www.whatsapp.com', '_blank')} 
                       style={{ display: "flex", alignItems: "center", justifyContent: "center", width: "${styles.iconWidth || "30px"}", height: "${styles.iconWidth || "30px"}", paddingTop: "${styles.iconPaddingTop}px", paddingRight: "${styles.iconPaddingRight}px", paddingBottom: "${styles.iconPaddingBottom}px", paddingLeft: "${styles.iconPaddingLeft}px", borderRadius: "${styles.borderRadius || "50%"}" }}>
                    <img src="https://upload.wikimedia.org/wikipedia/commons/6/6b/WhatsApp.svg" alt="WhatsApp" width=${styles.iconWidth || "30px"}" height=${styles.iconWidth || "30px"}" style={{ objectFit: "contain" }} />
                  </div>
          
                  <div className="cursor-pointer" onClick={() => window.open('https://www.youtube.com', '_blank')} 
                       style={{ display: "flex", alignItems: "center", justifyContent: "center", width: "${styles.iconWidth || "30px"}", height: "${styles.iconWidth || "30px"}", paddingTop: "${styles.iconPaddingTop}px", paddingRight: "${styles.iconPaddingRight}px", paddingBottom: "${styles.iconPaddingBottom}px", paddingLeft: "${styles.iconPaddingLeft}px", borderRadius: "${styles.borderRadius || "50%"}" }}>
                       <img src="https://upload.wikimedia.org/wikipedia/commons/0/09/YouTube_full-color_icon_(2017).svg" 
                            alt="YouTube" width=${styles.iconWidth || "30px"}" height=${styles.iconWidth || "30px"}" style={{ objectFit: "contain" }} />
                  </div>
          
                </div>
              
              </div>
            `;
            break;
          
          
          
        
        
        case "1-column":
          html = `

            <div
              className="text-center min-h-[150px] relative group transition-all duration-300 bg-transparent pb-2"
              style={{ ${inlineStylesString} }}
            >
              <div
                className="rounded-md text-center min-h-[150px] p-1 bg-transparent"
              >
                ${generateSourceCode(children)}
              </div>
            </div>
          `;
          break;

        case "2-columns":
          html = `
            {/*  Main Parent Wrapper */}
            <div className="relative grid gap-1 group bg-transparent transition-all duration-300"
                style={{ ${JSON.stringify(inlineStyles).slice(1, -1)} }}>

              {/*  Column A */}
              <div className="rounded-md text-center min-h-[150px] hover:border-2 hover:border-dashed hover:border-blue-500"
                  style={{ ${JSON.stringify(generateInlineStyles(item.childrenA?.[0]?.styles || {})).slice(1, -1)} }}>
                ${item.childrenA?.map((child) => generateSourceCode([child])).join("") || ``}
              </div>

              {/*  Column B */}
              <div className="rounded-md text-center min-h-[150px] hover:border-2 hover:border-dashed hover:border-blue-500"
                  style={{ ${JSON.stringify(generateInlineStyles(item.childrenB?.[0]?.styles || {})).slice(1, -1)} }}>
                ${item.childrenB?.map((child) => generateSourceCode([child])).join("") || ``}
              </div>

            </div>
          `;
          break;

        case "3-columns":
          html = `
            {/*  Main Parent Wrapper */}
            <div className="relative grid gap-1 group bg-transparent transition-all duration-300"
                style={{ ${JSON.stringify(inlineStyles).slice(1, -1)} }}>

              {/*  Column A */}
              <div className="rounded-md text-center min-h-[150px] hover:border-2 hover:border-dashed hover:border-blue-500"
                  style={{ ${JSON.stringify(generateInlineStyles(item.childrenA?.[0]?.styles || {})).slice(1, -1)} }}>
                ${item.childrenA?.map((child) => generateSourceCode([child])).join("") || ``}
              </div>

              {/*  Column B */}
              <div className="rounded-md text-center min-h-[150px] hover:border-2 hover:border-dashed hover:border-blue-500"
                  style={{ ${JSON.stringify(generateInlineStyles(item.childrenB?.[0]?.styles || {})).slice(1, -1)} }}>
                ${item.childrenB?.map((child) => generateSourceCode([child])).join("") || ``}
              </div>

              {/*  Column C */}
              <div className="rounded-md text-center min-h-[150px] hover:border-2 hover:border-dashed hover:border-blue-500"
                  style={{ ${JSON.stringify(generateInlineStyles(item.childrenC?.[0]?.styles || {})).slice(1, -1)} }}>
                ${item.childrenC?.map((child) => generateSourceCode([child])).join("") || ``}
              </div>

            </div>
          `;
          break;

        // ✅ Handling `widgetSection`
        case "widgetSection":
          const childKeys1 = Object.keys(item).filter((key) => key.startsWith("children"));
          html = `
            <div className="relative group bg-transparent" style={{ ${inlineStylesString} }}>
              <div className="flex w-full h-full relative gap-2">
                ${childKeys1
                  .map((childKey) => {
                    const column = item[childKey][0]; // Get the first column object
                    const columnStyle = JSON.stringify(generateCustomColumnStyles(column))
                      .replace(/"([^"]+)":/g, "$1:")
                      .replace(/"/g, "'"); // Format styles properly for JSX

                    return `
                      <div className="relative w-full bg-transparent" style={ ${columnStyle} }>
                        ${column.children
                          .map((child) => generateSourceCode([child]))
                          .join("")}
                      </div>
                    `;
                  })
                  .join("")}
              </div>
            </div>
          `;
          break;

        // ✅ Handling `customColumns` with dynamic columns (A-J)
        case "customColumns":
          const childKeys = Object.keys(item).filter((key) => key.startsWith("children"));
          html = `
            <div className="relative group bg-transparent p-4 border border-gray-300 rounded-md"
                 style={{ ${inlineStylesString} }}>
              <div className="flex w-full h-full gap-2">
                ${childKeys
                  .map((childKey) => {
                    const column = item[childKey][0]; // Get the first column object
                    const columnStyle = JSON.stringify(generateCustomColumnStyles(column))
                      .replace(/"([^"]+)":/g, "$1:")
                      .replace(/"/g, "'"); // Format styles properly for JSX

                    return `
                      <div className="relative w-full bg-transparent p-2 border border-gray-200 rounded-md"
                           style={ ${JSON.stringify(columnStyle).slice(1, -1)} }>
                        ${column.children
                          .map((child) => generateSourceCode([child]))
                          .join("")}
                      </div>
                    `;
                  })
                  .join("")}
              </div>
            </div>
          `;
          break;

        default:
          html = `<div style={ ${inlineStylesString} }>Unknown Widget</div>`;
          break;
      }

      return html;
    })
    .join("");
};

// // Helper function to generate inline styles
// // export const generateInlineStyles = (styles) => {
// //     return Object.entries(styles)
// //       .map(([key, value]) => `${key}: ${value};`)
// //       .join(" ");
// //   };

// // Helper function to generate inline styles in JSX object format with string values
// export const generateInlineStyles = (styles) => {
//   return Object.entries(styles).reduce((acc, [key, value]) => {
//     acc[key] = `${value}`; // Ensures all values are stored as strings for JSX
//     return acc;
//   }, {});
// };

// // Function to generate styles for `customColumns`
// export const generateCustomColumnStyles = (column) => {
//   return generateInlineStyles(column.styles);
// };
  
  
// // Recursive function to generate source code from state
// export const generateSourceCode = (items) => {
//   console.log("item in generateSourceCode: ", items);
//   return items
//     .map((item) => {
//       const { name, children = [], styles = {}, content } = item;

//       // ✅ Fix: Format styles properly for JSX
//       const inlineStyles = generateInlineStyles(styles);
//       const inlineStylesString = JSON.stringify(inlineStyles)
//         .replace(/"([^"]+)":/g, "$1:")
//         .replace(/"/g, "'") // Convert object to JSX-friendly format
//         .slice(1, -1); // Remove extra `{}`

//         console.log("inlineStylesString#####################: ",inlineStylesString);


//       // *********************************************************
//           const filteredStyles = { ...inlineStyles };
  
//           // Convert remaining styles to JSX format
//           const filteredInlineStylesString = JSON.stringify(filteredStyles)
//           .replace(/"([^"]+)":/g, "$1:")
//           .replace(/"/g, "'") // Fix JSX formatting
//           .slice(1, -1); // Remove extra `{}`
//       // *******************************************************

//       let html = "";

//       switch (name) {
//         case "Text":
//           html = `
//             <div style={{ ${inlineStylesString} }} className="mb-2">
//               <input
//                 type="text"
//                 className="p-2 rounded w-full border-none bg-transparent mb-2"
//                 placeholder="Text Field"
//                 value="${content}"
//                 style={{ ${inlineStylesString} }} 
//               />
//             </div>
//           `;
//           break;

//         case "Button":

//           delete filteredStyles.backgroundColor;
//           delete filteredStyles.textAlign;
//           delete filteredStyles.buttonColor;
          
//           html = `
//             <div className="flex justify-center w-full" style={{ backgroundColor: "${styles.backgroundColor}" }}>
//               <div className="relative w-full h-[50px] flex items-center p-1"
//                    style={{ display: "flex", alignItems: "center", justifyContent: "${styles.textAlign? styles.textAlign : "center"}", height: "auto" }}>
//                 <button
//                   style={{ backgroundColor: "${styles.buttonColor}", ${filteredInlineStylesString}  }}
//                   className="relative bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600 transition duration-200 text-center"
//                 >
//                   ${content || "Submit"}
//                 </button>
//               </div>
//             </div>
//           `;
//           break;

//         case "Image":
//           delete filteredStyles.imageUrl;

//           html = `
//             <div className="rounded-md text-center w-full h-auto flex items-center justify-center
//                             relative overflow-hidden border-none bg-transparent mb-1"
//                  style={{ ${filteredInlineStylesString} }}>
//               <img src="${styles.imageUrl || "placeholder.jpg"}" className="w-full h-full object-contain rounded" />
//             </div>
//           `;
//           break;

//         case "TextArea":
//           html = `
//             <div className="mb-2">
//               <textarea 
//                 className="p-2 rounded w-full border-none bg-transparent" placeholder="Text Area" 
//                 value="${content}"
//                 style={{ ${inlineStylesString} }} 
//               />
//             </div>
//           `;
//           break;

//         case "Divider":
//           html = `
//             <div style={{ position: "relative" }}  className="mb-2">
//               <hr className="w-full" style={{ ${inlineStylesString} }} />
//             </div>
//           `;
//           break;

//         case "Space":
//           html = `
//             <div style={{ width: "100%", height: "1rem", ${inlineStylesString} }}  className="mb-2" ></div>
//           `;
//           break;

//         case "SocialMedia":
//           html = `
//             <div style={{ ${inlineStylesString} }}  className="mb-2">
//               <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", cursor: "pointer" }}>
//                 <span style={{ fontSize: "1.25rem", color: "#2563EB" }}>Facebook</span>
//               </div>
//               <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", cursor: "pointer" }}>
//                 <span style={{ fontSize: "1.25rem", color: "#DC2626" }}>Google</span>
//               </div>
//               <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", cursor: "pointer" }}>
//                 <span style={{ fontSize: "1.25rem", color: "#60A5FA" }}>Twitter</span>
//               </div>
//             </div>
//           `;
//           break;

//         case "1-column":
//           html = `

//             <div
//               className="text-center min-h-[150px] relative group transition-all duration-300 bg-transparent pb-2"
//               style={{ ${inlineStylesString} }}
//             >
//               <div
//                 className="rounded-md text-center min-h-[150px] p-1 bg-transparent"
//               >
//                 ${generateSourceCode(children)}
//               </div>
//             </div>
//           `;
//           break;

//         case "2-columns":
//           html = `
//             {/*  Main Parent Wrapper */}
//             <div className="relative grid gap-1 group bg-transparent transition-all duration-300"
//                 style={{ ${JSON.stringify(inlineStyles).slice(1, -1)} }}>

//               {/*  Column A */}
//               <div className="rounded-md text-center min-h-[150px] hover:border-2 hover:border-dashed hover:border-blue-500"
//                   style={{ ${JSON.stringify(generateInlineStyles(item.childrenA?.[0]?.styles || {})).slice(1, -1)} }}>
//                 ${item.childrenA?.map((child) => generateSourceCode([child])).join("") || ``}
//               </div>

//               {/*  Column B */}
//               <div className="rounded-md text-center min-h-[150px] hover:border-2 hover:border-dashed hover:border-blue-500"
//                   style={{ ${JSON.stringify(generateInlineStyles(item.childrenB?.[0]?.styles || {})).slice(1, -1)} }}>
//                 ${item.childrenB?.map((child) => generateSourceCode([child])).join("") || ``}
//               </div>

//             </div>
//           `;
//           break;

//         case "3-columns":
//             html = `
//               {/* ✅ Main Parent Wrapper */}
//               <div className="relative grid gap-1 group bg-transparent transition-all duration-300"
//                    style={{ ${JSON.stringify(inlineStyles).slice(1, -1)} }}>
          
//                 {/* ✅ Column A */}
//                 <div className="p-1 rounded-md text-center min-h-[150px]"
//                      style={{ ${JSON.stringify(generateInlineStyles(item.childrenA?.[0]?.styles || {})).slice(1, -1)} }}>
//                   ${item.childrenA?.map((child) => generateSourceCode([child])).join("") || ``}
//                 </div>
          
//                 {/* ✅ Column B */}
//                 <div className="p-1 rounded-md text-center min-h-[150px] hover:border-2"
//                      style={{ ${JSON.stringify(generateInlineStyles(item.childrenB?.[0]?.styles || {})).slice(1, -1)} }}>
//                   ${item.childrenB?.map((child) => generateSourceCode([child])).join("") || ``}
//                 </div>
          
//                 {/* ✅ Column C */}
//                 <div className="p-1 rounded-md text-center min-h-[150px] hover:border-2"
//                      style={{ ${JSON.stringify(generateInlineStyles(item.childrenC?.[0]?.styles || {})).slice(1, -1)} }}>
//                   ${item.childrenC?.map((child) => generateSourceCode([child])).join("") || ``}
//                 </div>
          
//               </div>
//             `;
//             break;
          
          

//         case "customColumns":
//           const childKeys = Object.keys(item).filter((key) => key.startsWith("children"));
//           html = `
//             <div className="relative group bg-transparent" style={{ ${JSON.stringify(inlineStyles).slice(1, -1)} }}>
//               <div className="flex w-full h-full relative gap-2">
//                 ${childKeys
//                   .map((childKey) => {
//                     const column = item[childKey][0]; // Get the first column object
//                     const columnStyle = JSON.stringify(generateCustomColumnStyles(column))
//                       .replace(/"([^"]+)":/g, "$1:")
//                       .replace(/"/g, "'"); // Format styles properly for JSX

//                     return `
//                       <div className="relative w-full bg-transparent" style={ ${JSON.stringify(columnStyle).slice(1, -1)} }>
//                         ${column.children
//                           .map((child) => generateSourceCode([child]))
//                           .join("")}
//                       </div>
//                     `;
//                   })
//                   .join("")}
//               </div>
//             </div>
//           `;
//           break;

//         default:
//           html = `<div style={ ${JSON.stringify(inlineStyles).slice(1, -1)} }>Unknown Widget</div>`;
//           break;
//       }

//       return html;
//     })
//     .join("");
// };








// Helper function to generate inline styles in JSX-friendly format
// export const generateInlineStyles = (styles) => {
//   return Object.entries(styles).reduce((acc, [key, value]) => {
//     acc[key] = `${value}`; // Ensures all values are stored as strings for JSX
//     return acc;
//   }, {});
// };

// // Function to generate styles for custom columns
// export const generateCustomColumnStyles = (column) => {
//   return generateInlineStyles(column.styles);
// };

// // Recursive function to generate source code from the latest Redux state structure
// export const generateSourceCode = (items) => {
//   console.log("Processing items in generateSourceCode: ", items);

//   return items
//     .map((item) => {
//       const { name, styles = {}, content, childrenA, childrenB, childrenC, childrenD, children } = item;

//       const inlineStyles = generateInlineStyles(styles);
//       const inlineStylesString = JSON.stringify(inlineStyles)
//         .replace(/"([^"]+)":/g, "$1:")
//         .replace(/"/g, "'")
//         .slice(1, -1);

//       let html = "";

//       switch (name) {
//         case "Text":
//           html = `
//             <div style={{ ${inlineStylesString} }} className="mb-2">
//               <input
//                 type="text"
//                 className="p-2 rounded w-full border-none bg-transparent mb-2"
//                 placeholder="Text Field"
//                 value="${content}"
//                 style={{ ${inlineStylesString} }} 
//               />
//             </div>
//           `;
//           break;

//         case "Button":
//           html = `
//             <div className="flex justify-center w-full" style={{ backgroundColor: "${styles.backgroundColor}" }}>
//               <div className="relative w-full h-[50px] flex items-center p-1"
//                    style={{ display: "flex", alignItems: "center", justifyContent: "${styles.textAlign || "center"}", height: "auto" }}>
//                 <button
//                   style={{ backgroundColor: "${styles.buttonColor}", ${inlineStylesString} }}
//                   className="relative bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600 transition duration-200 text-center"
//                 >
//                   ${content || "Submit"}
//                 </button>
//               </div>
//             </div>
//           `;
//           break;

//         case "Image":
//           html = `
//             <div className="rounded-md text-center w-full h-auto flex items-center justify-center relative overflow-hidden border-none bg-transparent mb-1"
//                  style={{ ${inlineStylesString} }}>
//               <img src="${styles.imageUrl || "placeholder.jpg"}" className="w-full h-full object-contain rounded" />
//             </div>
//           `;
//           break;

//         case "TextArea":
//           html = `
//             <div className="mb-2">
//               <textarea 
//                 className="p-2 rounded w-full border-none bg-transparent" placeholder="Text Area" 
//                 value="${content}"
//                 style={{ ${inlineStylesString} }} 
//               />
//             </div>
//           `;
//           break;

//         case "Divider":
//           html = `
//             <div style={{ position: "relative" }} className="mb-2">
//               <hr className="w-full" style={{ ${inlineStylesString} }} />
//             </div>
//           `;
//           break;

//         case "Space":
//           html = `
//             <div style={{ width: "100%", height: "1rem", ${inlineStylesString} }} className="mb-2"></div>
//           `;
//           break;

//         case "SocialMedia":
//           html = `
//             <div style={{ ${inlineStylesString} }} className="mb-2">
//               <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", cursor: "pointer" }}>
//                 <span style={{ fontSize: "1.25rem", color: "#2563EB" }}>Facebook</span>
//               </div>
//               <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", cursor: "pointer" }}>
//                 <span style={{ fontSize: "1.25rem", color: "#DC2626" }}>Google</span>
//               </div>
//               <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", cursor: "pointer" }}>
//                 <span style={{ fontSize: "1.25rem", color: "#60A5FA" }}>Twitter</span>
//               </div>
//             </div>
//           `;
//           break;

//         case "widgetSection":
//           html = `
//             <div className="relative p-2 bg-gray-100 rounded-lg shadow-lg"
//                  style={{ ${inlineStylesString} }}>
//               ${generateSourceCode(childrenA?.[0]?.children || [])}
//             </div>
//           `;
//           break;

//         case "1-column":
//           html = `
//             <div className="relative p-2 bg-gray-100 rounded-lg shadow-lg"
//                  style={{ ${inlineStylesString} }}>
//               ${generateSourceCode(children || [])}
//             </div>
//           `;
//           break;

//         case "2-columns":
//           html = `
//             <div className="relative grid grid-cols-2 gap-2 group bg-transparent transition-all duration-300"
//                 style={{ ${inlineStylesString} }}>

//               <div className="rounded-md text-center min-h-[150px] hover:border-2 hover:border-dashed hover:border-blue-500"
//                   style={{ ${generateInlineStyles(childrenA?.[0]?.styles || {})} }}>
//                 ${childrenA?.map((child) => generateSourceCode([child])).join("") || ``}
//               </div>

//               <div className="rounded-md text-center min-h-[150px] hover:border-2 hover:border-dashed hover:border-blue-500"
//                   style={{ ${generateInlineStyles(childrenB?.[0]?.styles || {})} }}>
//                 ${childrenB?.map((child) => generateSourceCode([child])).join("") || ``}
//               </div>

//             </div>
//           `;
//           break;

//         case "3-columns":
//           html = `
//             <div className="relative grid grid-cols-3 gap-2 group bg-transparent transition-all duration-300"
//                 style={{ ${inlineStylesString} }}>

//               <div className="rounded-md text-center min-h-[150px] hover:border-2"
//                   style={{ ${generateInlineStyles(childrenA?.[0]?.styles || {})} }}>
//                 ${childrenA?.map((child) => generateSourceCode([child])).join("") || ``}
//               </div>

//               <div className="rounded-md text-center min-h-[150px] hover:border-2"
//                   style={{ ${generateInlineStyles(childrenB?.[0]?.styles || {})} }}>
//                 ${childrenB?.map((child) => generateSourceCode([child])).join("") || ``}
//               </div>

//               <div className="rounded-md text-center min-h-[150px] hover:border-2"
//                   style={{ ${generateInlineStyles(childrenC?.[0]?.styles || {})} }}>
//                 ${childrenC?.map((child) => generateSourceCode([child])).join("") || ``}
//               </div>

//             </div>
//           `;
//           break;

//         case "customColumns":
//           const childKeys = Object.keys(item).filter((key) => key.startsWith("children"));
//           html = `
//             <div className="relative group bg-transparent" style={{ ${inlineStylesString} }}>
//               <div className="flex w-full h-full relative gap-2">
//                 ${childKeys
//                   .map((childKey) => {
//                     const column = item[childKey][0];
//                     const columnStyle = JSON.stringify(generateCustomColumnStyles(column))
//                       .replace(/"([^"]+)":/g, "$1:")
//                       .replace(/"/g, "'");

//                     return `
//                       <div className="relative w-full bg-transparent" style={{ ${columnStyle} }}>
//                         ${column.children
//                           .map((child) => generateSourceCode([child]))
//                           .join("")}
//                       </div>
//                     `;
//                   })
//                   .join("")}
//               </div>
//             </div>
//           `;
//           break;

//         default:
//           html = `<div style={{ ${inlineStylesString} }}>Unknown Widget</div>`;
//           break;
//       }

//       return html;
//     })
//     .join("");
// };



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
  return items
    .map((item) => {
      const { name, children = [], styles = {}, content } = item;

      // ✅ Convert styles to JSX-friendly format
      const inlineStyles = generateInlineStyles(styles);

      const inlineStylesString = JSON.stringify(inlineStyles)
        .replace(/"([^"]+)":/g, "$1:")
        .replace(/"/g, "'") // Fix JSX formatting
        .slice(1, -1); // Remove extra `{}`

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
          html = `
            <div style={{ ${inlineStylesString} }}  className="mb-2">
              <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", cursor: "pointer" }}>
                <span style={{ fontSize: "1.25rem", color: "#2563EB" }}>Facebook</span>
              </div>
              <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", cursor: "pointer" }}>
                <span style={{ fontSize: "1.25rem", color: "#DC2626" }}>Google</span>
              </div>
              <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", cursor: "pointer" }}>
                <span style={{ fontSize: "1.25rem", color: "#60A5FA" }}>Twitter</span>
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

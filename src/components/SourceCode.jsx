// import React, { useState } from "react";
// import { generateSourceCode } from "./generateSourceCode";
// import { useSelector } from "react-redux";

// const SourceCode = () => {
//   const [showSourceCode, setShowSourceCode] = useState(false);

  
//   const { droppedItems } = useSelector( (state) => state.cardDragable);

//   // Generate source code based on items state
//   const sourceCode = generateSourceCode(droppedItems);

//   return (
//     <div className="w-full max-w-md p-1 bg-white border rounded-lg shadow-lg h-screen overflow-y-auto"
//     style={{ height: "100vh" }}>
//       {/* Toggle Button */}
//       <div className="flex justify-between items-center p-1 bg-gray-100 border-b">
//         <h3 className="text-lg font-semibold text-gray-800">Source Code Panel</h3>
//         <button
//           onClick={() => setShowSourceCode(!showSourceCode)}
//           className="px-4 py-2 bg-blue-500 text-white rounded-md shadow hover:bg-blue-600"
//         >
//           {showSourceCode ? "Hide Source Code" : "Show Source Code"}
//         </button>
//       </div>

//       {/* Source Code Display */}
//       {showSourceCode && (
//         <div>
//           {sourceCode ? (
            
//                 <pre className="bg-gray-800 text-white p-4 rounded overflow-x-auto h-auto">
//                   <code>
//                     {`
//                       <div className="w-[600px] min-h-[250px] border-2 rounded-lg bg-gray-100 p-1 relative hover:border-blue-500 transition-all pb-[50px]
//                         h-auto">
//                           <div className="mb-2">
//                               ${sourceCode}
//                         </div>
//                       </div>
//                     `}
//                   </code>
//                 </pre>

              
//           ) : (
//             <p className="text-gray-500">No source code to display.</p>
//           )}
//         </div>
//       )}
//     </div>
//   );
// };

// export default SourceCode;






import React, { useState } from "react";
import { generateSourceCode } from "./generateSourceCode";
import { useSelector } from "react-redux";
import { FiClipboard } from "react-icons/fi"; // 📌 Import copy icon

const SourceCode = () => {
  const [showSourceCode, setShowSourceCode] = useState(false);
  const [copied, setCopied] = useState(false); // 📌 Track copy status

  const { droppedItems } = useSelector((state) => state.cardDragable);

  // Generate source code based on items state
  const sourceCode = generateSourceCode(droppedItems);

  // 📌 Copy to clipboard function
  const handleCopy = () => {

    const wrappedSourceCode = `
    <div className="w-[600px] min-h-[250px] border-2 rounded-lg bg-gray-100 p-1 relative hover:border-blue-500 transition-all pb-[50px] h-auto">
      <div className="mb-2">
        ${sourceCode}
      </div>
    </div>
  `;

    navigator.clipboard.writeText(wrappedSourceCode).then(() => {
      setCopied(true);
      console.log("handleCopy called: ", wrappedSourceCode);
      setTimeout(() => setCopied(false), 2000); // Reset after 2s
    });
  };

  return (
    <div className="w-full max-w-md p-1 bg-white border rounded-lg shadow-lg h-screen overflow-y-auto"
         style={{ height: "100vh" }}>
      
      {/* Toggle Button & Copy Icon */}
      <div className="flex justify-between items-center p-1 bg-gray-100 border-b">
        
        {/* 📌 Show/Hide Source Code Button */}
        <button
          onClick={() => setShowSourceCode(!showSourceCode)}
          className="px-4 py-2 bg-blue-500 text-white rounded-md shadow hover:bg-blue-600"
        >
          {showSourceCode ? "Hide Code" : "Show Code"}
        </button>

        {/* 📌 Copy Icon (Only Visible When Code is Shown) */}
        {showSourceCode && (
          <button 
            onClick={handleCopy} 
            className="text-gray-600 hover:text-blue-500 transition duration-200"
            title="Copy Code"
          >
            <FiClipboard size={24} />
          </button>
        )}
      </div>

      {/* 📌 Source Code Display */}
      {showSourceCode && (
        <div>
          {sourceCode ? (
            <div className="relative">
              
              {/* 📌 Copy Confirmation Message */}
              {copied && (
                <div className="absolute top-2 right-10 bg-green-500 text-white text-sm px-2 py-1 rounded-md">
                  Copied!
                </div>
              )}

              <pre className="bg-gray-800 text-white p-4 rounded overflow-x-auto h-auto">
                <code>
                  {`
                    <div className="w-[600px] min-h-[250px] border-2 rounded-lg bg-gray-100 p-1 relative hover:border-blue-500 transition-all pb-[50px]
                      h-auto">
                        <div className="mb-2">
                            ${sourceCode}
                      </div>
                    </div>
                  `}
                </code>
              </pre>
            </div>
          ) : (
            <p className="text-gray-500">No source code to display.</p>
          )}
        </div>
      )}
    </div>
  );
};

export default SourceCode;

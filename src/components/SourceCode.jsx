import React, { useState } from "react";
import { generateSourceCode } from "./generateSourceCode";
import { useSelector } from "react-redux";

const SourceCode = () => {
  const [showSourceCode, setShowSourceCode] = useState(false);

  
  const { droppedItems } = useSelector( (state) => state.cardDragable);

  // Generate source code based on items state
  const sourceCode = generateSourceCode(droppedItems);

  return (
    <div className="w-full max-w-md p-1 bg-white border rounded-lg shadow-lg h-screen overflow-y-auto"
    style={{ height: "100vh" }}>
      {/* Toggle Button */}
      <div className="flex justify-between items-center p-1 bg-gray-100 border-b">
        <h3 className="text-lg font-semibold text-gray-800">Source Code Panel</h3>
        {/* <button
          onClick={() => setShowSourceCode(!showSourceCode)}
          className="px-4 py-2 bg-blue-500 text-white rounded-md shadow hover:bg-blue-600"
        >
          {showSourceCode ? "Hide Source Code" : "Show Source Code"}
        </button> */}
      </div>

      {/* Source Code Display */}
      {showSourceCode && (
        <div className="flex-1 p-1 bg-gray-50">
          {sourceCode ? (
            <pre className="w-[600px] min-h-[250px] border-2 rounded-lg bg-gray-100 p-1 relative hover:border-blue-500 transition-all pb-[50px] mt-4 bg-gray-800 text-white p-4 rounded overflow-x-auto">
              <code>{sourceCode}</code>
            </pre>
          ) : (
            <p className="text-gray-500">No source code to display.</p>
          )}
        </div>
      )}
    </div>
  );
};

export default SourceCode;

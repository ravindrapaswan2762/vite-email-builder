// import React, { useState } from "react";
// import { useSelector } from "react-redux";
// import { FaFolder, FaFolderOpen } from "react-icons/fa";
// import { MdOutlineInsertDriveFile } from "react-icons/md";

// const TreeNode = ({ node }) => {
//   const [isExpanded, setIsExpanded] = useState(false);

//   // Check if node has children
//   const hasChildren =
//     node.children?.length > 0 ||
//     node.childrenA?.length > 0 ||
//     node.childrenB?.length > 0 ||
//     node.childrenC?.length > 0;

//   const toggleExpand = () => setIsExpanded(!isExpanded);

//   return (
//     <div className="pl-4">
//       {/* Node Header */}
//       <div
//         className={`flex items-center cursor-pointer p-2 rounded transition-all ${
//           hasChildren ? "hover:bg-blue-50" : "hover:bg-gray-100"
//         }`}
//         onClick={toggleExpand}
//       >
//         {/* Icon */}
//         <span className="mr-2 text-blue-500">
//           {hasChildren ? (
//             isExpanded ? (
//               <FaFolderOpen size={16} />
//             ) : (
//               <FaFolder size={16} />
//             )
//           ) : (
//             <MdOutlineInsertDriveFile size={16} />
//           )}
//         </span>

//         {/* Node Name */}
//         <span className="font-medium text-gray-700">{node.name}</span>
//       </div>

//       {/* Render Children */}
//       {isExpanded && (
//         <div className="pl-4 border-l-2 border-blue-200">
//           {/* Standard Children */}
//           {node.children?.length > 0 && (
//             <div className="pt-2">
//               <h4 className="text-sm font-semibold text-gray-600 mb-1">
//                 Standard
//               </h4>
//               {node.children.map((child) => (
//                 <TreeNode key={child.id} node={child} />
//               ))}
//             </div>
//           )}

//           {/* Column A Children */}
//           {node.childrenA?.length > 0 && (
//             <div className="pt-2">
//               <h4 className="text-sm font-semibold text-gray-600 mb-1">
//                 Column A
//               </h4>
//               {node.childrenA.map((child) => (
//                 <TreeNode key={child.id} node={child} />
//               ))}
//             </div>
//           )}

//           {/* Column B Children */}
//           {node.childrenB?.length > 0 && (
//             <div className="pt-2">
//               <h4 className="text-sm font-semibold text-gray-600 mb-1">
//                 Column B
//               </h4>
//               {node.childrenB.map((child) => (
//                 <TreeNode key={child.id} node={child} />
//               ))}
//             </div>
//           )}

//           {/* Column C Children */}
//           {node.childrenC?.length > 0 && (
//             <div className="pt-2">
//               <h4 className="text-sm font-semibold text-gray-600 mb-1">
//                 Column C
//               </h4>
//               {node.childrenC.map((child) => (
//                 <TreeNode key={child.id} node={child} />
//               ))}
//             </div>
//           )}
//         </div>
//       )}
//     </div>
//   );
// };



// const TreeView = () => {
//   const droppedItems = useSelector((state) => state.cardDragable.droppedItems);

//   return (
//     <div className="w-full max-w-xs border rounded-lg p-4 bg-gray-50 shadow-lg h-screen overflow-y-auto"
//     style={{ height: "100vh" }}>

//       <h3 className="text-lg font-semibold text-gray-800 p-4 border-b">
//         Tree View
//       </h3>
//       <div className="p-4">
//         {droppedItems.length > 0 ? (
//           droppedItems.map((item) => <TreeNode key={item.id} node={item} />)
//         ) : (
//           <p className="text-gray-500">No items dropped yet.</p>
//         )}
//       </div>
//     </div>
//   );
// };

// export default TreeView;


// ************************************************************************

// import React, { useState } from "react";
// import { useSelector, useDispatch } from "react-redux";
// import { FaFolder, FaFolderOpen } from "react-icons/fa";
// import { MdOutlineInsertDriveFile, MdDragIndicator } from "react-icons/md";
// import { AiOutlineMinusSquare, AiOutlinePlusSquare } from "react-icons/ai";
// import { setActiveNodeList } from "../redux/treeViewSlice";

// import { setActiveWidgetId, setActiveWidgetName, replaceDroppedItem} from "../redux/cardDragableSlice";
// import { setActiveEditor } from "../redux/cardToggleSlice";

// const TreeView = () => {
//   const droppedItems = useSelector((state) => state.cardDragable.droppedItems);
//   const dispatch = useDispatch();
//   const [draggedNode, setDraggedNode] = useState(null);
//   const [expandedNodes, setExpandedNodes] = useState({});

//   const handleDragStart = (e, node) => {
//     e.stopPropagation();
//     setDraggedNode(node);
//   };

//   const handleDrop = (e, targetNode) => {
//     e.stopPropagation();
//     if (draggedNode && draggedNode.id !== targetNode.id) {
//       dispatch(replaceDroppedItem({ draggedNodeId: draggedNode.id, targetNodeId: targetNode.id }));
//     }
//     setDraggedNode(null);
//   };

//   const handleDragOver = (e) => {
//     e.preventDefault();
//   };

//   const toggleExpand = (nodeId) => {
//     setExpandedNodes((prevState) => ({
//       ...prevState,
//       [nodeId]: !prevState[nodeId],
//     }));
//   };

//   const renderTree = (node) => {
//     const isExpandable =
//       node.name === "1-column" || node.name === "2-columns" || node.name === "3-columns";

//     const isExpanded = expandedNodes[node.id];
//     const hasChildren =
//       node.children?.length > 0 ||
//       node.childrenA?.length > 0 ||
//       node.childrenB?.length > 0 ||
//       node.childrenC?.length > 0;

//     const onclickHandler = (node) => {
//       dispatch(setActiveNodeList(true));
//       dispatch(setActiveWidgetName(node.name));
//       dispatch(setActiveEditor(node.name));
//       dispatch(setActiveWidgetId(node.id));
//     }

//     return (
//       <div key={node.id} className="w-full" onClick={()=>onclickHandler(node)}>
//         <div
//           className={`flex items-center justify-between w-full p-2 rounded transition-all ${
//             hasChildren ? "hover:bg-blue-50" : "hover:bg-gray-100"
//           }`}
//           draggable={!(isExpandable && isExpanded)}
//           onDragStart={(e) => !(isExpandable && isExpanded) && handleDragStart(e, node)}
//           onDrop={(e) => handleDrop(e, node)}
//           onDragOver={handleDragOver}
//         >
//           <div className="flex items-center">
//             {/* Expand/Collapse Icon */}
//             {isExpandable ? (
//               <span
//                 className="mr-2 text-blue-500 cursor-pointer"
//                 onClick={() => toggleExpand(node.id)}
//               >
//                 {isExpanded ? <AiOutlineMinusSquare size={16} /> : <AiOutlinePlusSquare size={16} />}
//               </span>
//             ) : (
//               <span className="mr-2 text-gray-500">
//                 <MdOutlineInsertDriveFile size={16} />
//               </span>
//             )}

//             {/* Node Name */}
//             <span className="font-medium text-gray-700">{node.name}</span>
//           </div>

//           {/* Drag Indicator */}
//           {!(isExpandable && isExpanded) && (
//             <MdDragIndicator className="text-gray-500 cursor-move" />
//           )}
//         </div>

//         {/* Render Children */}
//         {isExpandable && isExpanded && (
//           <div className="ml-10 pl-4 border-l-2 border-blue-200">
//             {/* Standard for 1-column */}
//             {node.name === "1-column" && node.children?.length > 0 && (
//               <div className="mt-2">
//                 <h4 className="text-sm font-semibold text-gray-600 mb-1">Standard</h4>
//                 {node.children.map((child) => (
//                   <div
//                     key={child.id}
//                     className="flex items-center justify-between p-2 rounded hover:bg-gray-100"
//                     draggable
//                     onDragStart={(e) => handleDragStart(e, child)}
//                     onDrop={(e) => handleDrop(e, child)}
//                     onDragOver={handleDragOver}
//                   >
//                     <div className="flex items-center">
//                       <MdOutlineInsertDriveFile className="mr-2 text-gray-500" size={16} />
//                       <span className="font-medium text-gray-700">{child.name}</span>
//                     </div>
//                     <MdDragIndicator className="text-gray-500 cursor-move" />
//                   </div>
//                 ))}
//               </div>
//             )}

//             {/* Column A and Column B for 2-columns */}
//             {node.name === "2-columns" && (
//               <>
//                 {node.childrenA?.length > 0 && (
//                   <div className="mt-2">
//                     <h4 className="text-sm font-semibold text-gray-600 mb-1">Column A</h4>
//                     {node.childrenA.map((child) => (
//                       <div
//                         key={child.id}
//                         className="flex items-center justify-between p-2 rounded hover:bg-gray-100"
//                         draggable
//                         onDragStart={(e) => handleDragStart(e, child)}
//                         onDrop={(e) => handleDrop(e, child)}
//                         onDragOver={handleDragOver}
//                       >
//                         <div className="flex items-center">
//                           <MdOutlineInsertDriveFile className="mr-2 text-gray-500" size={16} />
//                           <span className="font-medium text-gray-700">{child.name}</span>
//                         </div>
//                         <MdDragIndicator className="text-gray-500 cursor-move" />
//                       </div>
//                     ))}
//                   </div>
//                 )}
//                 {node.childrenB?.length > 0 && (
//                   <div className="mt-2">
//                     <h4 className="text-sm font-semibold text-gray-600 mb-1">Column B</h4>
//                     {node.childrenB.map((child) => (
//                       <div
//                         key={child.id}
//                         className="flex items-center justify-between p-2 rounded hover:bg-gray-100"
//                         draggable
//                         onDragStart={(e) => handleDragStart(e, child)}
//                         onDrop={(e) => handleDrop(e, child)}
//                         onDragOver={handleDragOver}
//                       >
//                         <div className="flex items-center">
//                           <MdOutlineInsertDriveFile className="mr-2 text-gray-500" size={16} />
//                           <span className="font-medium text-gray-700">{child.name}</span>
//                         </div>
//                         <MdDragIndicator className="text-gray-500 cursor-move" />
//                       </div>
//                     ))}
//                   </div>
//                 )}
//               </>
//             )}

//             {/* Column A, Column B, Column C for 3-columns */}
//             {node.name === "3-columns" && (
//               <>
//                 {node.childrenA?.length > 0 && (
//                   <div className="mt-2">
//                     <h4 className="text-sm font-semibold text-gray-600 mb-1">Column A</h4>
//                     {node.childrenA.map((child) => (
//                       <div
//                         key={child.id}
//                         className="flex items-center justify-between p-2 rounded hover:bg-gray-100"
//                         draggable
//                         onDragStart={(e) => handleDragStart(e, child)}
//                         onDrop={(e) => handleDrop(e, child)}
//                         onDragOver={handleDragOver}
//                       >
//                         <div className="flex items-center">
//                           <MdOutlineInsertDriveFile className="mr-2 text-gray-500" size={16} />
//                           <span className="font-medium text-gray-700">{child.name}</span>
//                         </div>
//                         <MdDragIndicator className="text-gray-500 cursor-move" />
//                       </div>
//                     ))}
//                   </div>
//                 )}
//                 {node.childrenB?.length > 0 && (
//                   <div className="mt-2">
//                     <h4 className="text-sm font-semibold text-gray-600 mb-1">Column B</h4>
//                     {node.childrenB.map((child) => (
//                       <div
//                         key={child.id}
//                         className="flex items-center justify-between p-2 rounded hover:bg-gray-100"
//                         draggable
//                         onDragStart={(e) => handleDragStart(e, child)}
//                         onDrop={(e) => handleDrop(e, child)}
//                         onDragOver={handleDragOver}
//                       >
//                         <div className="flex items-center">
//                           <MdOutlineInsertDriveFile className="mr-2 text-gray-500" size={16} />
//                           <span className="font-medium text-gray-700">{child.name}</span>
//                         </div>
//                         <MdDragIndicator className="text-gray-500 cursor-move" />
//                       </div>
//                     ))}
//                   </div>
//                 )}
//                 {node.childrenC?.length > 0 && (
//                   <div className="mt-2">
//                     <h4 className="text-sm font-semibold text-gray-600 mb-1">Column C</h4>
//                     {node.childrenC.map((child) => (
//                       <div
//                         key={child.id}
//                         className="flex items-center justify-between p-2 rounded hover:bg-gray-100"
//                         draggable
//                         onDragStart={(e) => handleDragStart(e, child)}
//                         onDrop={(e) => handleDrop(e, child)}
//                         onDragOver={handleDragOver}
//                       >
//                         <div className="flex items-center">
//                           <MdOutlineInsertDriveFile className="mr-2 text-gray-500" size={16} />
//                           <span className="font-medium text-gray-700">{child.name}</span>
//                         </div>
//                         <MdDragIndicator className="text-gray-500 cursor-move" />
//                       </div>
//                     ))}
//                   </div>
//                 )}
//               </>
//             )}
//           </div>
//         )}
//       </div>
//     );
//   };

//   return (
//     <div
//       className="w-full max-w-xs border rounded-lg p-4 bg-gray-50 shadow-lg h-screen overflow-y-auto"
//       style={{ height: "100vh" }}
//     >
//       <h3 className="text-lg font-semibold text-gray-800 p-4 border-b">Tree View</h3>
//       <div className="p-4">
//         {droppedItems.length > 0 ? (
//           droppedItems.map((item) => renderTree(item))
//         ) : (
//           <p className="text-gray-500">No items dropped yet.</p>
//         )}
//       </div>
//     </div>
//   );
// };

// export default TreeView;

// *********************************************************************************
import React, { useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { FaFolder, FaFolderOpen } from "react-icons/fa";
import { MdOutlineInsertDriveFile, MdDragIndicator } from "react-icons/md";
import { AiOutlineMinusSquare, AiOutlinePlusSquare } from "react-icons/ai";
import { setActiveNodeList } from "../redux/treeViewSlice";
import { setActiveWidgetId, setActiveWidgetName, replaceDroppedItem } from "../redux/cardDragableSlice";
import { setActiveEditor } from "../redux/cardToggleSlice";

const TreeView = () => {
  const droppedItems = useSelector((state) => state.cardDragable.droppedItems);
  const dispatch = useDispatch();
  const [draggedNode, setDraggedNode] = useState(null);
  const [expandedNodes, setExpandedNodes] = useState({});

  const handleDragStart = (e, node) => {
    e.stopPropagation();
    setDraggedNode(node);
  };

  const handleDrop = (e, targetNode, parentId = null, column = null) => {
    e.stopPropagation();

    if (draggedNode && draggedNode.id !== targetNode.id) {
      dispatch(
        replaceDroppedItem({
          parentId,
          column,
          draggedNodeId: draggedNode.id,
          targetNodeId: targetNode.id,
        })
      );
    }
    setDraggedNode(null);
  };

  const handleDragOver = (e) => {
    e.preventDefault();
  };

  const toggleExpand = (nodeId) => {
    setExpandedNodes((prevState) => ({
      ...prevState,
      [nodeId]: !prevState[nodeId],
    }));
  };

  const onclickHandler = (node) => {
    dispatch(setActiveNodeList(true));
    dispatch(setActiveWidgetName(node.name));
    dispatch(setActiveEditor(node.name));
    dispatch(setActiveWidgetId(node.id));
  };

  const renderTree = (node) => {
    const isExpandable =
      node.name === "1-column" || node.name === "2-columns" || node.name === "3-columns";

    const isExpanded = expandedNodes[node.id];
    const hasChildren =
      node.children?.length > 0 ||
      node.childrenA?.length > 0 ||
      node.childrenB?.length > 0 ||
      node.childrenC?.length > 0;

    return (
      <div key={node.id} className="w-full" onClick={() => onclickHandler(node)}>
        <div
          className={`flex items-center justify-between w-full p-2 rounded transition-all ${
            hasChildren ? "hover:bg-blue-50" : "hover:bg-gray-100"
          }`}
          draggable={!(isExpandable && isExpanded)}
          onDragStart={(e) => !(isExpandable && isExpanded) && handleDragStart(e, node)}
          onDrop={(e) => handleDrop(e, node)}
          onDragOver={handleDragOver}
        >
          <div className="flex items-center">
            {/* Expand/Collapse Icon */}
            {isExpandable ? (
              <span
                className="mr-2 text-blue-500 cursor-pointer"
                onClick={() => toggleExpand(node.id)}
              >
                {isExpanded ? <AiOutlineMinusSquare size={16} /> : <AiOutlinePlusSquare size={16} />}
              </span>
            ) : (
              <span className="mr-2 text-gray-500">
                <MdOutlineInsertDriveFile size={16} />
              </span>
            )}

            {/* Node Name */}
            <span className="font-medium text-gray-700">{node.name}</span>
          </div>

          {/* Drag Indicator */}
          {!(isExpandable && isExpanded) && (
            <MdDragIndicator className="text-gray-500 cursor-move" />
          )}
        </div>

        {/* Render Children */}
        {isExpandable && isExpanded && (
          <div className="ml-10 pl-4 border-l-2 border-blue-200">
            {/* Standard for 1-column */}
            {node.name === "1-column" && node.children?.length > 0 && (
              <div className="mt-2">
                <h4 className="text-sm font-semibold text-gray-600 mb-1">Standard</h4>
                {node.children.map((child) => (
                  <div
                    key={child.id}
                    className="flex items-center justify-between p-2 rounded hover:bg-gray-100"
                    draggable
                    onDragStart={(e) => handleDragStart(e, child)}
                    onDrop={(e) => handleDrop(e, child, node.id)}
                    onDragOver={handleDragOver}
                  >
                    <div className="flex items-center">
                      <MdOutlineInsertDriveFile className="mr-2 text-gray-500" size={16} />
                      <span className="font-medium text-gray-700">{child.name}</span>
                    </div>
                    <MdDragIndicator className="text-gray-500 cursor-move" />
                  </div>
                ))}
              </div>
            )}

            {/* Column A and Column B for 2-columns */}
            {node.name === "2-columns" && (
              <>
                {node.childrenA?.length > 0 && (
                  <div className="mt-2">
                    <h4 className="text-sm font-semibold text-gray-600 mb-1">Column A</h4>
                    {node.childrenA.map((child) => (
                      <div
                        key={child.id}
                        className="flex items-center justify-between p-2 rounded hover:bg-gray-100"
                        draggable
                        onDragStart={(e) => handleDragStart(e, child)}
                        onDrop={(e) => handleDrop(e, child, node.id, "childrenA")}
                        onDragOver={handleDragOver}
                      >
                        <div className="flex items-center">
                          <MdOutlineInsertDriveFile className="mr-2 text-gray-500" size={16} />
                          <span className="font-medium text-gray-700">{child.name}</span>
                        </div>
                        <MdDragIndicator className="text-gray-500 cursor-move" />
                      </div>
                    ))}
                  </div>
                )}
                {node.childrenB?.length > 0 && (
                  <div className="mt-2">
                    <h4 className="text-sm font-semibold text-gray-600 mb-1">Column B</h4>
                    {node.childrenB.map((child) => (
                      <div
                        key={child.id}
                        className="flex items-center justify-between p-2 rounded hover:bg-gray-100"
                        draggable
                        onDragStart={(e) => handleDragStart(e, child)}
                        onDrop={(e) => handleDrop(e, child, node.id, "childrenB")}
                        onDragOver={handleDragOver}
                      >
                        <div className="flex items-center">
                          <MdOutlineInsertDriveFile className="mr-2 text-gray-500" size={16} />
                          <span className="font-medium text-gray-700">{child.name}</span>
                        </div>
                        <MdDragIndicator className="text-gray-500 cursor-move" />
                      </div>
                    ))}
                  </div>
                )}
              </>
            )}

            {/* Column A, Column B, Column C for 3-columns */}
            {node.name === "3-columns" && (
              <>
                {node.childrenA?.length > 0 && (
                  <div className="mt-2">
                    <h4 className="text-sm font-semibold text-gray-600 mb-1">Column A</h4>
                    {node.childrenA.map((child) => (
                      <div
                        key={child.id}
                        className="flex items-center justify-between p-2 rounded hover:bg-gray-100"
                        draggable
                        onDragStart={(e) => handleDragStart(e, child)}
                        onDrop={(e) => handleDrop(e, child, node.id, "childrenA")}
                        onDragOver={handleDragOver}
                      >
                        <div className="flex items-center">
                          <MdOutlineInsertDriveFile className="mr-2 text-gray-500" size={16} />
                          <span className="font-medium text-gray-700">{child.name}</span>
                        </div>
                        <MdDragIndicator className="text-gray-500 cursor-move" />
                      </div>
                    ))}
                  </div>
                )}
                {node.childrenB?.length > 0 && (
                  <div className="mt-2">
                    <h4 className="text-sm font-semibold text-gray-600 mb-1">Column B</h4>
                    {node.childrenB.map((child) => (
                      <div
                        key={child.id}
                        className="flex items-center justify-between p-2 rounded hover:bg-gray-100"
                        draggable
                        onDragStart={(e) => handleDragStart(e, child)}
                        onDrop={(e) => handleDrop(e, child, node.id, "childrenB")}
                        onDragOver={handleDragOver}
                      >
                        <div className="flex items-center">
                          <MdOutlineInsertDriveFile className="mr-2 text-gray-500" size={16} />
                          <span className="font-medium text-gray-700">{child.name}</span>
                        </div>
                        <MdDragIndicator className="text-gray-500 cursor-move" />
                      </div>
                    ))}
                  </div>
                )}
                {node.childrenC?.length > 0 && (
                  <div className="mt-2">
                    <h4 className="text-sm font-semibold text-gray-600 mb-1">Column C</h4>
                    {node.childrenC.map((child) => (
                      <div
                        key={child.id}
                        className="flex items-center justify-between p-2 rounded hover:bg-gray-100"
                        draggable
                        onDragStart={(e) => handleDragStart(e, child)}
                        onDrop={(e) => handleDrop(e, child, node.id, "childrenC")}
                        onDragOver={handleDragOver}
                      >
                        <div className="flex items-center">
                          <MdOutlineInsertDriveFile className="mr-2 text-gray-500" size={16} />
                          <span className="font-medium text-gray-700">{child.name}</span>
                        </div>
                        <MdDragIndicator className="text-gray-500 cursor-move" />
                      </div>
                    ))}
                  </div>
                )}
              </>
            )}
          </div>
        )}
      </div>
    );
  };

  return (
    <div
      className="w-full max-w-xs border rounded-lg p-4 bg-gray-50 shadow-lg h-screen overflow-y-auto"
      style={{ height: "100vh" }}
    >
      <h3 className="text-lg font-semibold text-gray-800 p-4 border-b">Tree View</h3>
      <div className="p-4">
        {droppedItems.length > 0 ? (
          droppedItems.map((item) => renderTree(item))
        ) : (
          <p className="text-gray-500">No items dropped yet.</p>
        )}
      </div>
    </div>
  );
};

export default TreeView;






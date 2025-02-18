
// import React, { useState } from "react";
// import { useSelector, useDispatch } from "react-redux";
// import { MdOutlineInsertDriveFile, MdDragIndicator } from "react-icons/md";
// import { AiOutlineMinusSquare, AiOutlinePlusSquare } from "react-icons/ai";
// import { setActiveNodeList } from "../redux/treeViewSlice";
// import {
//   setActiveWidgetId,
//   setActiveParentId,
//   setActiveColumn,
//   setActiveWidgetName,
//   replaceDroppedItem,
//   updateElementActiveState, // Action for updating isActive
// } from "../redux/cardDragableSlice";
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

//   const handleDrop = (e, targetNode, parentId = null, column = null) => {
//     e.stopPropagation();

//     if (draggedNode && draggedNode.id !== targetNode.id) {
//       dispatch(
//         replaceDroppedItem({
//           parentId,
//           column,
//           draggedNodeId: draggedNode.id,
//           targetNodeId: targetNode.id,
//         })
//       );
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

//   const onclickHandler = (node, parentId, column) => {
//     console.log(`node: ${JSON.stringify(node)}, parentId: ${parentId}, column: ${column} in onclickHandler`);
//     dispatch(setActiveWidgetName(node.name));
//     dispatch(setActiveWidgetId(node.id));

//     const columnNames = ['1-column', '2-columns', '3-columns'];
//     if(columnNames.includes(node.name)){
//       dispatch(setActiveEditor("sectionEditor"));
//     }else{
//       dispatch(setActiveEditor(node.name));
//     }

//     // Dispatch action to update isActive state
//     dispatch(
//       updateElementActiveState({
//         id: node.id,   
//         parentId: parentId ? parentId : null,
//         column: column ? column : null,
//         isActive: true,
//       })
//     );
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

//     return (
//       <div key={node.id} className="w-full" onClick={() => onclickHandler(node)}>
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
//                     onDrop={(e) => handleDrop(e, child, node.id)}
//                     onDragOver={handleDragOver}
//                     onClick={(e) => {
//                       e.stopPropagation();
//                       onclickHandler(child, node.id);
//                     }}
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
//                         onDrop={(e) => handleDrop(e, child, node.id, "childrenA")}
//                         onDragOver={handleDragOver}
//                         onClick={(e) => {
//                           e.stopPropagation();
//                           onclickHandler(child, node.id, "childrenA");
//                         }}
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
//                         onDrop={(e) => handleDrop(e, child, node.id, "childrenB")}
//                         onDragOver={handleDragOver}
//                         onClick={(e) =>{
//                           e.stopPropagation();
//                           onclickHandler(child, node.id, "childrenB");
//                         }}
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
//                         onDrop={(e) => handleDrop(e, child, node.id, "childrenA")}
//                         onDragOver={handleDragOver}
//                         onClick={(e) => {
//                           e.stopPropagation();
//                           onclickHandler(child, node.id, "childrenA");
//                         }}
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
//                         onDrop={(e) => handleDrop(e, child, node.id, "childrenB")}
//                         onDragOver={handleDragOver}
//                         onClick={(e) =>{
//                           e.stopPropagation();
//                           onclickHandler(child, node.id, "childrenB");
//                         }}
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
//                         onDrop={(e) => handleDrop(e, child, node.id, "childrenC")}
//                         onDragOver={handleDragOver}
//                         onClick={(e) => {
//                           e.stopPropagation();
//                           onclickHandler(child, node.id, "childrenC");
//                         }}
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


























import React, { useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { MdOutlineInsertDriveFile, MdDragIndicator } from "react-icons/md";
import { AiOutlineMinusSquare, AiOutlinePlusSquare } from "react-icons/ai";
import { setActiveNodeList } from "../redux/treeViewSlice";
import { replaceDroppedItemInCC } from "../redux/cardDragableSlice";
import {
  setActiveWidgetId,
  setActiveParentId,
  setActiveColumn,
  setActiveWidgetName,
  replaceDroppedItem,
  updateElementActiveState, // Action for updating isActive
} from "../redux/cardDragableSlice";
import { setActiveEditor } from "../redux/cardToggleSlice";

const TreeView = () => {
  const droppedItems = useSelector((state) => state.cardDragable.droppedItems);
  const dispatch = useDispatch();
  const [draggedNode, setDraggedNode] = useState(null);
  const [expandedNodes, setExpandedNodes] = useState({});


  const [selectedNodeId, setSelectedNodeId] = useState(null);
  const handleNodeClick = (e, node, parentId = null, column = null) => {
    e.stopPropagation();
    setSelectedNodeId(node.id); // Set selected node
    onclickHandler(node, parentId, column);
  };  
  const getNodeClasses = (node, hasChildren) => {
    const isSelected = selectedNodeId === node.id;
    return `w-full rounded transition-all ${
      isSelected ? "border-2 border-blue-200" : hasChildren ? "hover:bg-blue-50" : "hover:bg-gray-100"
    }`;
  };
  


  const handleDragStart = (e, node) => {
    e.stopPropagation();
    console.log("handleDragStart in TreeView: ",node);
    setDraggedNode(node);
  };

  const handleDrop = (e, targetNode, parentId = null, column = null) => {
    e.stopPropagation();
    console.log("targetNode in handleDrop: ",targetNode);
    console.log("parentId in handleDrop: ",parentId);
    console.log("column in handleDrop: ",column);

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

  const handleDropInCC = (e, targetNode, parentId = null, column = null) => {
    e.stopPropagation();
    console.log("targetNode in handleDropInCC: ",targetNode);
    console.log("parentId in handleDropInCC: ",parentId);
    console.log("column in handleDropInCC: ",column);

    if (draggedNode && draggedNode.id !== targetNode.id) {
      dispatch(
        replaceDroppedItemInCC({
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
    console.log("toggleExpand in TreeView: ",nodeId);
    setExpandedNodes((prevState) => ({
      ...prevState,
      [nodeId]: !prevState[nodeId],
    }));
  };

  const onclickHandler = (node, parentId, column) => {

    console.log("node:::::::::: ",node);
    console.log("parentId:::::::::: ",parentId);
    console.log("column:::::::::: ",column);

    dispatch(setActiveWidgetName(node.name));
    dispatch(setActiveWidgetId(node.id));
    dispatch(setActiveParentId(parentId));
    dispatch(setActiveColumn(column));

    const columnNames = ['1-column', '2-columns', '3-columns', 'customColumns', 'widgetSection'];
    if(columnNames.includes(node.name)){
      dispatch(setActiveEditor("sectionEditor"));
    }else{
      dispatch(setActiveEditor(node.name));
    }

    dispatch(
      updateElementActiveState({
        id: node.id,   
        parentId: parentId ? parentId : null,
        column: column ? column : null,
        isActive: true,
      })
    );
  };

  const renderTree = (section) => {
    const isExpandable =
    section.name === "1-column" || section.name === "2-columns" || section.name === "3-columns" || 
    section.name === "widgetSection" || section.name === "customColumns";

    const isExpanded = expandedNodes[section.id];
    const hasChildren =
    section.children?.length > 0 ||
    section.childrenA?.length > 0 ||
    section.childrenB?.length > 0 ||
    section.childrenC?.length > 0;

    return (
      <div key={section.id} className={`w-full ${getNodeClasses(section, hasChildren)}`} onClick={(e) => handleNodeClick(e, section)}>
        <div
          className={`flex items-center justify-between w-full p-2 rounded transition-all ${
            hasChildren ? "hover:bg-blue-50" : "hover:bg-gray-100"
          }`}
          draggable={!(isExpandable && isExpanded)}
          onDragStart={(e) => !(isExpandable && isExpanded) && handleDragStart(e, section)}
          onDrop={(e) => handleDrop(e, section)}
          onDragOver={handleDragOver}
        >
          <div className="flex items-center">
            {isExpandable ? (
              <span
                className="mr-2 text-blue-500 cursor-pointer"
                onClick={() => toggleExpand(section.id)}
              >
                {isExpanded ? <AiOutlineMinusSquare size={16} /> : <AiOutlinePlusSquare size={16} />}
              </span>
            ) : (
              <span className="mr-2 text-gray-500">
                <MdOutlineInsertDriveFile size={16} />
              </span>
            )}

            <span className="font-medium text-gray-700">{section.name}</span>
          </div>

          {!(isExpandable && isExpanded) && (
            <MdDragIndicator className="text-gray-500 cursor-move" />
          )}
        </div>

        {isExpandable && isExpanded && (
          <div className="ml-8 pl-6">

            {section.name === "1-column" && section.children?.length > 0 && (
              <div className="mt-2">
                <h4 className="font-medium text-gray-700">Standard</h4>
                {section.children.map((child) => (
                  <div key={child.id} className={`flex items-center justify-between p-2 rounded hover:bg-gray-100 ${getNodeClasses(child, false)}`}
                    draggable
                    onDragStart={(e) => handleDragStart(e, child)}
                    onDrop={(e) => handleDrop(e, child, section.id)}
                    onDragOver={handleDragOver}
                    onClick={(e) => { e.stopPropagation(); handleNodeClick(e, child, section.id, "children"); }}
                    >
                    <div className="flex items-center">
                      <MdOutlineInsertDriveFile className="mr-2 text-gray-500" size={16} />
                      <span className="text-sm font-semibold text-gray-600">{child.name}</span>
                    </div>
                    <MdDragIndicator className="text-gray-500 cursor-move" />
                  </div>
                ))}
              </div>
            )}

            {/* Column A and Column B for 2-columns */}
            {section.name === "2-columns" && (
              <>
                {section.childrenA?.length > 0 && (
                  <div className="mt-2">
                    <h4 className="font-medium text-gray-700">Column A</h4>
                    {section.childrenA.map((child) => (
                      <div key={child.id} 
                        className={`flex items-center justify-between p-2 rounded hover:bg-gray-100
                          ${getNodeClasses(child, false)} 
                        `}
                        draggable
                        onDragStart={(e) => handleDragStart(e, child)}
                        onDrop={(e) => handleDrop(e, child, section.id, "childrenA")}
                        onDragOver={handleDragOver}
                        onClick={(e) => { e.stopPropagation(); handleNodeClick(e, child, section.id, "childrenA") }}>
                        <div className="flex items-center">
                          <MdOutlineInsertDriveFile className="mr-2 text-gray-500" size={16} />
                          <span className="text-sm font-semibold text-gray-600">{child.name}</span>
                        </div>
                        <MdDragIndicator className="text-gray-500 cursor-move" />
                      </div>
                    ))}
                  </div>
                )}
                {section.childrenB?.length > 0 && (
                  <div className="mt-2">
                    <h4 className="font-medium text-gray-700">Column B</h4>
                    {section.childrenB.map((child) => (
                      <div key={child.id} 
                        className={`flex items-center justify-between p-2 rounded hover:bg-gray-100
                          ${getNodeClasses(child, false)} 
                        `} 
                        draggable
                        onDragStart={(e) => handleDragStart(e, child)}
                        onDrop={(e) => handleDrop(e, child, section.id, "childrenB")}
                        onDragOver={handleDragOver}
                        onClick={(e) => { e.stopPropagation(); handleNodeClick(e, child, section.id, "childrenB")}}>
                        <div className="flex items-center">
                          <MdOutlineInsertDriveFile className="mr-2 text-gray-500" size={16} />
                          <span className="text-sm font-semibold text-gray-600">{child.name}</span>
                        </div>
                        <MdDragIndicator className="text-gray-500 cursor-move" />
                      </div>
                    ))}
                  </div>
                )}
              </>
            )}

            {/* Column A, Column B, Column C for 3-columns */}
            {section.name === "3-columns" && (
              <>
                {section.childrenA?.length > 0 && (
                  <div className="mt-2">
                    <h4 className="font-medium text-gray-700">Column A</h4>
                    {section.childrenA.map((child) => (
                      <div key={child.id}
                        className={`flex items-center justify-between p-2 rounded hover:bg-gray-100
                          ${getNodeClasses(child, false)} 
                        `}
                        draggable
                        onDragStart={(e) => handleDragStart(e, child)}
                        onDrop={(e) => handleDrop(e, child, section.id, "childrenA")}
                        onDragOver={handleDragOver}
                        onClick={(e) => { e.stopPropagation(); handleNodeClick(e, child, section.id, "childrenA")}}>
                        <div className="flex items-center">
                          <MdOutlineInsertDriveFile className="mr-2 text-gray-500" size={16} />
                          <span className="text-sm font-semibold text-gray-600">{child.name}</span>
                        </div>
                        <MdDragIndicator className="text-gray-500 cursor-move" />
                      </div>
                    ))}
                  </div>
                )}
                {section.childrenB?.length > 0 && (
                  <div className="mt-2">
                    <h4 className="font-medium text-gray-700">Column B</h4>
                    {section.childrenB.map((child) => (
                      <div key={child.id} 
                        className={`flex items-center justify-between p-2 rounded hover:bg-gray-100
                          ${getNodeClasses(child, false)} 
                        `}
                        draggable
                        onDragStart={(e) => handleDragStart(e, child)}
                        onDrop={(e) => handleDrop(e, child, section.id, "childrenB")}
                        onDragOver={handleDragOver}
                        onClick={(e) => { e.stopPropagation(); handleNodeClick(e, child, section.id, "childrenB")}}>
                        <div className="flex items-center">
                          <MdOutlineInsertDriveFile className="mr-2 text-gray-500" size={16} />
                          <span className="text-sm font-semibold text-gray-600">{child.name}</span>
                        </div>
                        <MdDragIndicator className="text-gray-500 cursor-move" />
                      </div>
                    ))}
                  </div>
                )}
                {section.childrenC?.length > 0 && (
                  <div className="mt-2">
                    <h4 className="font-medium text-gray-700">Column C</h4>
                    {section.childrenC.map((child) => (
                      <div key={child.id}
                        className={`flex items-center justify-between p-2 rounded hover:bg-gray-100
                          ${getNodeClasses(child, false)} 
                        `}
                        draggable
                        onDragStart={(e) => handleDragStart(e, child)}
                        onDrop={(e) => handleDrop(e, child, section.id, "childrenC")}
                        onDragOver={handleDragOver}
                        onClick={(e) => { e.stopPropagation(); handleNodeClick(e, child, section.id, "childrenC")}}>
                        <div className="flex items-center">
                          <MdOutlineInsertDriveFile className="mr-2 text-gray-500" size={16} />
                          <span className="text-sm font-semibold text-gray-600">{child.name}</span>
                        </div>
                        <MdDragIndicator className="text-gray-500 cursor-move" />
                      </div>
                    ))}
                  </div>
                )}
              </>
            )}


            {["widgetSection", "customColumns"].includes(section.name) &&
              Object.keys(section)
                .filter((key) => key.startsWith("children") && section[key]?.length > 0)
                .map((columnKey, columnIndex) => (
                  <div key={columnKey} className="mt-2">
                    <h4 className="font-medium text-gray-700">
                      Column {String.fromCharCode(65 + columnIndex)}
                    </h4>
                    {section[columnKey].map((columnData) =>
                      columnData.children?.map((child) => (
                        <div key={child.id} 
                          className={`flex items-center justify-between p-2 rounded hover:bg-gray-100 ${getNodeClasses(child, false)} `} 
                          draggable
                          onDragStart={(e) => handleDragStart(e, child)}
                          onDrop={(e) => handleDropInCC(e, child, section.id, columnKey)}
                          onDragOver={handleDragOver}
                          onClick={(e) => { e.stopPropagation(); handleNodeClick(e, child, section.id, columnKey)}}>
                          <div className="flex items-center">
                            <MdOutlineInsertDriveFile className="mr-2 text-gray-500" size={16} />
                            <span className="text-sm font-semibold text-gray-600">{child.name}</span>
                          </div>
                          <MdDragIndicator className="text-gray-500 cursor-move" />
                        </div>
                      ))
                    )}
                  </div>
                ))}
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="w-full max-w-xs border rounded-lg p-4 bg-gray-50 shadow-lg h-screen overflow-y-auto"
      onClick={() => {
        setSelectedNodeId(null);
        dispatch(setActiveWidgetId(null));
        dispatch(setActiveParentId(null));
        dispatch(setActiveColumn(null));
      }}
    >
      <h3 className="text-lg font-semibold text-gray-800 p-4 border-b">Tree View</h3>
      <div className="p-4">
        {droppedItems.length > 0 ? (
          droppedItems.map((section) => renderTree(section))
        ) : (
          <p className="text-gray-500">No items dropped yet.</p>
        )}
      </div>
    </div>
  );
};

export default TreeView;












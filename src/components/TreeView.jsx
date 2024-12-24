import React, { useState } from "react";
import { useSelector } from "react-redux";
import { FaFolder, FaFolderOpen } from "react-icons/fa";
import { MdOutlineInsertDriveFile } from "react-icons/md";

const TreeNode = ({ node }) => {
  const [isExpanded, setIsExpanded] = useState(false);

  const hasChildren =
    node.children?.length > 0 ||
    node.childrenA?.length > 0 ||
    node.childrenB?.length > 0 ||
    node.childrenC?.length > 0;

  const toggleExpand = () => setIsExpanded(!isExpanded);

  return (
    <div className="pl-4">
      {/* Node Header */}
      <div
        className={`flex items-center cursor-pointer p-2 rounded transition-all ${
          hasChildren
            ? "hover:bg-blue-50"
            : "hover:bg-gray-100"
        }`}
        onClick={toggleExpand}
      >
        {/* Icon */}
        <span className="mr-2 text-blue-500">
          {hasChildren ? (
            isExpanded ? (
              <FaFolderOpen size={16} />
            ) : (
              <FaFolder size={16} />
            )
          ) : (
            <MdOutlineInsertDriveFile size={16} />
          )}
        </span>

        {/* Node Name */}
        <span className="font-medium text-gray-700">{node.name}</span>
      </div>

      {/* Children */}
      {isExpanded && (
        <div className="pl-4 border-l-2 border-blue-200">
          {/* Standard children */}
          {node.children?.map((child) => (
            <TreeNode key={child.id} node={child} />
          ))}

          {/* Column-specific children */}
          {node.childrenA?.map((child) => (
            <TreeNode key={child.id} node={child} />
          ))}
          {node.childrenB?.map((child) => (
            <TreeNode key={child.id} node={child} />
          ))}
          {node.childrenC?.map((child) => (
            <TreeNode key={child.id} node={child} />
          ))}
        </div>
      )}
    </div>
  );
};

const TreeView = () => {
  const droppedItems = useSelector((state) => state.cardDragable.droppedItems);

  return (
    <div className="w-full max-w-xs border rounded-lg p-4 bg-gray-50 shadow-lg h-screen overflow-y-auto"
    style={{ height: "100vh" }}>

      <h3 className="text-lg font-semibold text-gray-800 p-4 border-b">
        Tree View
      </h3>
      <div className="p-4">
        {droppedItems.length > 0 ? (
          droppedItems.map((item) => <TreeNode key={item.id} node={item} />)
        ) : (
          <p className="text-gray-500">No items dropped yet.</p>
        )}
      </div>
    </div>
  );
};

export default TreeView;

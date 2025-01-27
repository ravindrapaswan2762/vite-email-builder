import { createSlice } from "@reduxjs/toolkit";


const initialState = {
  activeWidgetId: null,
  activeWidgetName: "",
  activeParentId: "",
  activeColumn: "",
  showDropingArea: false,
  dragableWidget: null,
  droppedItems: [], // This will store the dropped items

  widgetOrElement: null,
};


const cardDragableSlice = createSlice({
  name: "cardDragable",
  initialState,
  reducers: {
    saveState: (state, action) => {
      console.log("saveState called: ", action.payload);
      state.droppedItems = [...action.payload];
    },

    clearState: (state, action) => {
      state.droppedItems = [];
    },

    setActiveWidgetId: (state, action) => {
      state.activeWidgetId = action.payload;
      console.log("activeWidgetId: ", action.payload);
    },

    setShowDropingArea: (state, action) => {
      state.showDropingArea = action.payload;
    },

    setActiveWidgetName: (state, action) => {
      console.log("activeWidgetName: ", action.payload);
      state.activeWidgetName = action.payload;
    },

    setActiveParentId: (state, action) => {
      console.log("seted activeParent: ", action.payload);
      state.activeParentId = action.payload;
    },

    setActiveColumn: (state, action) => {
      console.log("seted activeColumn: ", action.payload);
      state.activeColumn = action.payload;
    },

    setDroppedItems: (state, action) => {
      const { id, name, type, parentId, styles, columnName, children, content, isActive } = action.payload;
    
      console.log("setDroppedItems called:::: ", action.payload);
      
    
      if (!parentId) {
        // Add top-level item
        const newItem = { id, name, type, content, styles: styles || {}, isActive };
    
        // Initialize children arrays for 2-columns or 3-columns
        if (name === "2-columns") {
          newItem.childrenA = [];
          newItem.childrenB = [];
        } else if (name === "3-columns") {
          newItem.childrenA = [];
          newItem.childrenB = [];
          newItem.childrenC = [];
        } else {
          newItem.children = children || [];
        }
    
        state.droppedItems.push(newItem);
        console.log("Current State: ", JSON.parse(JSON.stringify(state.droppedItems)));
      } else {
        // Add child to the appropriate parent
        const addToParent = (items) => {
          for (const item of items) {
            console.log("Checking item: ", item); // Debug each item being checked
    
            if (item.id === parentId) {
              // Use columnName to identify the correct children array
              if (columnName === "columnA" || columnName === "childrenA") {
                item.childrenA = item.childrenA || [];
                item.childrenA.push({ id, name, type, content, styles: styles || {}, isActive });
                console.log("Child added to childrenA: ", item.childrenA);
              } else if (columnName === "columnB" || columnName === "childrenB") {
                item.childrenB = item.childrenB || [];
                item.childrenB.push({ id, name, type, content, styles: styles || {}, isActive });
                console.log("Child added to childrenB: ", item.childrenB);
              }
              else if (columnName === "columnC" || columnName === "childrenC") {
                item.childrenC = item.childrenC || [];
                item.childrenC.push({ id, name, type, content, styles: styles || {}, isActive });
                console.log("Child added to childrenC: ", item.childrenC);
              }else{
                item.children = item.children || [];
                item.children.push({ id, name, type, content, styles: styles || {}, isActive });
              }
              console.log("Updated Item: ", item);
              return true;
    
            }
    
            // Recursively traverse nested children
            if (item.children && item.children.length > 0) {
              const added = addToParent(item.children);
              if (added) return true;
            }
          }
          return false;
        };
    
        const success = addToParent(state.droppedItems);
        if (!success) {
          console.warn("Parent ID not found for: ", parentId); // Warn if parent ID does not match
        }
      }
    
      console.log("Current State: ", JSON.parse(JSON.stringify(state.droppedItems)));
    },
    

    updateElementStyles: (state, action) => {
      console.log("action.payload in updateElementStyles: ", action.payload);
      const { id, parentId, column, styles } = action.payload;
    
      console.log("parentId::::", parentId, "childId::::", id, "columnName::::", column, "styles:::: ", styles, "in redux action");
    
      if (id && !parentId) {
        // Case 1: Update styles for the parent item
        state.droppedItems = state.droppedItems.map((item) => {
          if (item.id === id) {
            return {
              ...item,
              styles: { ...item.styles, ...styles },
            };
          }
          return item;
        });
        console.log(`Parent item styles updated, updated droppedItems: `, JSON.parse(JSON.stringify(state.droppedItems)));
      } else if (id && parentId && column) {
        
        // Case 2: Update styles for a child in a specific column
        state.droppedItems = state.droppedItems.map((item) => {
          if (item.id === parentId) {
            return {
              ...item,
              [column]: item[column].map((child) => {
                if (child.id === id) {
                  return {
                    ...child,
                    styles: { ...child.styles, ...styles },
                  };
                }
                return child;
              }),
            };
          }
          return item;
        });
        console.log(`Child item styles updated in column, updated droppedItems: `, JSON.parse(JSON.stringify(state.droppedItems)));
      } else if (id && parentId) {
        // Case 3: Update styles for a child without specifying a column
        state.droppedItems = state.droppedItems.map((item) => {
          if (item.id === parentId) {
            return {
              ...item,
              children: item.children.map((child) => {
                if (child.id === id) {
                  return {
                    ...child,
                    styles: { ...child.styles, ...styles },
                  };
                }
                return child;
              }),
            };
          }
          return item;
        });
        console.log(`Child item styles updated without column, updated droppedItems: `, JSON.parse(JSON.stringify(state.droppedItems)));
      }
    },
    
    
    deleteDroppedItemById: (state, action) => {

      const { parentId, childId, columnName } = action.payload;

      console.log("parentId:", parentId, "childId:", childId, "columnName:", columnName, "in deleteDroppedItemById action");
    
      if (!childId && parentId) {
        // Case 1: Delete the parent item
        state.droppedItems = state.droppedItems.filter((item) => item.id !== parentId);
        console.log(`Parent item deleted, updated droppedItems: `, JSON.parse(JSON.stringify(state.droppedItems)));
        
      } else if (childId && parentId && columnName) {
        // Case 2: Delete the child from the specified parent and column
        state.droppedItems = state.droppedItems.map((item) => {
          if (item.id === parentId) {
            return {
              ...item,
              [columnName]: item[columnName].filter((child) => child.id !== childId),
            };
          }
          return item;
        });
        console.log(`Child item deleted, updated droppedItems: `, JSON.parse(JSON.stringify(state.droppedItems)));
      } else if (childId && parentId) {
        // Case 3: Delete the child from the specified parent, without column
        state.droppedItems = state.droppedItems.map((item) => {
          if (item.id === parentId) {
            return {
              ...item,
              children: item.children.filter((child) => child.id !== childId),
            };
          }
          return item;
        });
        console.log(`Child item deleted without column, updated droppedItems: `, JSON.parse(JSON.stringify(state.droppedItems)));
      }
    },

    updateElementContent: (state, action) => {
      console.log("action.payload in updateElementContent: ", action.payload);
      const { id, parentId, column, content } = action.payload;
    
      console.log(
        "parentId::::",
        parentId,
        "childId::::",
        id,
        "columnName::::",
        column,
        "content:::: ",
        content,
        "in redux action"
      );
    
      if (id && !parentId) {
        // Case 1: Update content for the parent item
        state.droppedItems = state.droppedItems.map((item) => {
          if (item.id === id) {
            return {
              ...item,
              content, // Directly update content
            };
          }
          return item;
        });
        console.log(
          `Parent item content updated, updated droppedItems: `,
          JSON.parse(JSON.stringify(state.droppedItems))
        );
      } else if (id && parentId && column) {
        // Case 2: Update content for a child in a specific column
        state.droppedItems = state.droppedItems.map((item) => {
          if (item.id === parentId) {
            return {
              ...item,
              [column]: item[column].map((child) => {
                if (child.id === id) {
                  return {
                    ...child,
                    content, // Update content for the specific child
                  };
                }
                return child;
              }),
            };
          }
          return item;
        });
        console.log(
          `Child item content updated in column, updated droppedItems: `,
          JSON.parse(JSON.stringify(state.droppedItems))
        );
      } else if (id && parentId) {
        // Case 3: Update content for a child without specifying a column
        state.droppedItems = state.droppedItems.map((item) => {
          if (item.id === parentId) {
            return {
              ...item,
              children: item.children.map((child) => {
                if (child.id === id) {
                  return {
                    ...child,
                    content, // Update content for the specific child
                  };
                }
                return child;
              }),
            };
          }
          return item;
        });
        console.log(
          `Child item content updated without column, updated droppedItems: `,
          JSON.parse(JSON.stringify(state.droppedItems))
        );
      }
    },

    
    replaceDroppedItem: (state, action) => {
      const { parentId, column, draggedNodeId, targetNodeId } = action.payload;

      console.log("replaceDroppedItem called:::: ",action.body);

      const findAndInsert = (items, parentId, column, draggedNodeId, targetNodeId) => {
        // Helper function to handle reordering
        const reorderItems = (list, draggedIndex, targetIndex) => {
          const [draggedItem] = list.splice(draggedIndex, 1); // Remove dragged item

          // Adjust targetIndex for upward movement
          if (draggedIndex < targetIndex) {
            targetIndex -= 1;
          }

          // Place dragged item at target position
          list.splice(targetIndex, 0, draggedItem);

          // Move target item to the position below the dragged item
          const [targetItem] = list.splice(targetIndex + 1, 1);
          list.splice(targetIndex + 1, 0, targetItem);

          return list;
        };

        if (parentId && column) {
          return items.map((item) => {
            if (item.id === parentId) {
              const columnItems = [...item[column]];
              const draggedIndex = columnItems.findIndex((child) => child.id === draggedNodeId);
              const targetIndex = columnItems.findIndex((child) => child.id === targetNodeId);

              if (draggedIndex !== -1 && targetIndex !== -1) {
                reorderItems(columnItems, draggedIndex, targetIndex);
                console.log(`Reordered in column: ${column}`);
              }

              return { ...item, [column]: columnItems };
            }
            return item;
          });
        }

        if (!parentId && !column) {
          const draggedIndex = items.findIndex((item) => item.id === draggedNodeId);
          const targetIndex = items.findIndex((item) => item.id === targetNodeId);

          if (draggedIndex !== -1 && targetIndex !== -1) {
            reorderItems(items, draggedIndex, targetIndex);
            console.log(`Reordered at the top level`);
          }

          return items;
        }

        if (parentId && !column) {
          return items.map((item) => {
            if (item.id === parentId && item.children) {
              const children = [...item.children];
              const draggedIndex = children.findIndex((child) => child.id === draggedNodeId);
              const targetIndex = children.findIndex((child) => child.id === targetNodeId);

              if (draggedIndex !== -1 && targetIndex !== -1) {
                reorderItems(children, draggedIndex, targetIndex);
                console.log(`Reordered in children of parentId: ${parentId}`);
              }

              return { ...item, children };
            }
            return item;
          });
        }

        return items;
      };

      state.droppedItems = findAndInsert(
        state.droppedItems,
        parentId,
        column,
        draggedNodeId,
        targetNodeId
      );

      console.log("Updated droppedItems: ", JSON.parse(JSON.stringify(state.droppedItems)));
    },

    // replaceDroppedItem: (state, action) => {
    //   const {
    //     draggedParentId, // Parent ID of the dragged element
    //     draggedColumn, // Column of the dragged element
    //     draggedNodeId, // ID of the dragged element
    //     targetParentId, // Parent ID of the target position
    //     targetColumn, // Column of the target position
    //     targetNodeId, // ID of the target element
    //   } = action.payload;
    
    //   console.log(
    //     `Dragged: parentId=${draggedParentId}, column=${draggedColumn}, nodeId=${draggedNodeId}`
    //   );
    //   console.log(
    //     `Target: parentId=${targetParentId}, column=${targetColumn}, nodeId=${targetNodeId}`
    //   );
    
    //   // Helper function to remove an item from the source location
    //   const findAndRemove = (items, parentId, column, nodeId) => {
    //     for (let item of items) {
    //       if (item.id === parentId) {
    //         const columnItems = column ? item[column] || [] : item.children || [];
    //         const draggedIndex = columnItems.findIndex((child) => child.id === nodeId);
    //         if (draggedIndex !== -1) {
    //           const [draggedItem] = columnItems.splice(draggedIndex, 1);
    //           return draggedItem;
    //         }
    //       }
    
    //       const nestedKeys = Object.keys(item).filter((key) => key.startsWith("children"));
    //       for (let key of nestedKeys) {
    //         const draggedItem = findAndRemove(item[key], parentId, column, nodeId);
    //         if (draggedItem) return draggedItem;
    //       }
    //     }
    //     return null;
    //   };
    
    //   // Helper function to insert an item at the target location
    //   const findAndInsert = (items, parentId, column, nodeId, itemToInsert) => {
    //     for (let item of items) {
    //       if (item.id === parentId) {
    //         const columnItems = column ? item[column] || [] : item.children || [];
    //         const targetIndex = columnItems.findIndex((child) => child.id === nodeId);
    
    //         if (targetIndex !== -1) {
    //           // Insert at the target index
    //           columnItems.splice(targetIndex, 0, itemToInsert);
    //         } else {
    //           // Append if targetNodeId is not found
    //           columnItems.push(itemToInsert);
    //         }
    
    //         return true;
    //       }
    
    //       const nestedKeys = Object.keys(item).filter((key) => key.startsWith("children"));
    //       for (let key of nestedKeys) {
    //         if (findAndInsert(item[key], parentId, column, nodeId, itemToInsert)) {
    //           return true;
    //         }
    //       }
    //     }
    //     return false;
    //   };
    
    //   // Step 1: Remove the dragged element from its original location
    //   const draggedItem = findAndRemove(
    //     state.droppedItems,
    //     draggedParentId,
    //     draggedColumn,
    //     draggedNodeId
    //   );
    
    //   if (!draggedItem) {
    //     console.warn(`Dragged node not found: ${draggedNodeId}`);
    //     return;
    //   }
    
    //   // Step 2: Insert the dragged element into the target location
    //   const success = findAndInsert(
    //     state.droppedItems,
    //     targetParentId,
    //     targetColumn,
    //     targetNodeId,
    //     draggedItem
    //   );
    
    //   if (!success) {
    //     console.warn(
    //       `Target parent or node not found: parentId=${targetParentId}, nodeId=${targetNodeId}`
    //     );
    //   }
    
    //   console.log("Updated droppedItems: ", JSON.parse(JSON.stringify(state.droppedItems)));
    // },
    
    
    updateElementActiveState: (state, action) => {

      console.log("updateElementActiveState: ",action.payload);

      const { id, parentId, column, isActive } = action.payload;
    
      if (id && !parentId) {
        // Case 1: Update isActive for the parent item
        state.droppedItems = state.droppedItems.map((item) => {
          if (item.id === id) {
            return {
              ...item,
              isActive,
            };
          }
          return item;
        });
      } else if (id && parentId && column) {
        // Case 2: Update isActive for a child in a specific column
        state.droppedItems = state.droppedItems.map((item) => {
          if (item.id === parentId) {
            return {
              ...item,
              [column]: item[column].map((child) => {
                if (child.id === id) {
                  return {
                    ...child,
                    isActive,
                  };
                }
                return child;
              }),
            };
          }
          return item;
        });
      } else if (id && parentId) {
        // Case 3: Update isActive for a child without specifying a column
        state.droppedItems = state.droppedItems.map((item) => {
          if (item.id === parentId) {
            return {
              ...item,
              children: item.children.map((child) => {
                if (child.id === id) {
                  return {
                    ...child,
                    isActive,
                  };
                }
                return child;
              }),
            };
          }
          return item;
        });
      }
    },
    
    addElementAtLocation: (state, action) => {
      console.log("addElementAtLocation called: ", action.payload);

      const { 
        draggedNodeId, 
        draggedName, 
        dragableType, 
        content, 
        styles,

        targetParentId, 
        targetColumn, 
        targetNodeId} = action.payload;

      // Helper function to find and insert the dragged item
      const findAndInsert = (items, draggedNodeId, draggedName, dragableType, targetParentId, targetColumn, targetNodeId) => {
        for (let item of items) {
          // If the parent is matched
          if (item.id === targetParentId) {
            const columnName = targetColumn || "children"; // Default to "children" if no column is specified
            item[columnName] = item[columnName] || [];

            // Find the target index
            const targetIndex = item[columnName].findIndex((child) => child.id === targetNodeId);

            // Create the new draggable item
            const newItem = {
              id: draggedNodeId,
              name: draggedName,
              type: dragableType, // Specify type if needed
              content: content,
              styles: styles,
              children: [],
            };

            if (targetIndex !== -1) {
              // Insert the new item at the correct position
              item[columnName].splice(targetIndex, 0, newItem);
            } else {
              // If targetNodeId is not found, append to the column
              item[columnName].push(newItem);
            }

            console.log(`Item added to ${columnName} of parent ID: ${targetParentId}`);
            return true; // Stop recursion when the parent is found
          }

          // Recursively traverse nested children
          const nestedKeys = Object.keys(item).filter((key) => key.startsWith("children"));
          for (let key of nestedKeys) {
            if (
              findAndInsert(
                item[key],
                draggedNodeId,
                draggedName,
                dragableType,
                targetParentId,
                targetColumn,
                targetNodeId
              )
            ) {
              return true;
            }
          }
        }
        return false;
      };

      // Top-level operation if no parent is specified
      if (!targetParentId) {
        const newItem = {
          id: draggedNodeId,
          name: draggedName,
          type: dragableType, // Specify type if needed
          content: content,
          styles: styles,
          children: [],
        };

        // Find the target index at the top level
        const targetIndex = state.droppedItems.findIndex((item) => item.id === targetNodeId);

        if (targetIndex !== -1) {
          state.droppedItems.splice(targetIndex, 0, newItem);
          console.log("New item inserted at the top level at index: ", targetIndex);
        } else {
          // Append at the top level if targetNodeId is not found
          state.droppedItems.push(newItem);
          console.log("New item appended to the top level");
        }
      } else {
        // Find the parent and insert into the appropriate column
        const success = findAndInsert(
          state.droppedItems,
          draggedNodeId,
          draggedName,
          dragableType,
          targetParentId,
          targetColumn,
          targetNodeId
        );
        if (!success) {
          console.warn("Parent ID or target not found: ", targetParentId);
        }
      }

      console.log("Updated State: ", JSON.parse(JSON.stringify(state.droppedItems)));
    },

    setWidgetOrElement: (state, action) =>{
      console.log("setWidgetOrElement called: ", action.payload);
      state.widgetOrElement = action.payload;
    },

    replaceElementInlast: (state, action) => {
      const id = action.payload;

      console.log(`Moving item with id::: ${id} to the end of the list`);

      const moveToLast = (items, id) => {
        const itemIndex = items.findIndex((item) => item.id === id);

        if (itemIndex !== -1) {
          // Remove the item from its current position
          const [item] = items.splice(itemIndex, 1);

          // Push the item to the end of the list
          items.push(item);
        }

        return items;
      };

      // Update droppedItems by moving the specified item to the end
      state.droppedItems = moveToLast(state.droppedItems, id);

      console.log("Updated droppedItems: ", JSON.parse(JSON.stringify(state.droppedItems)));
    },

    // addCustomColumns: (state, action) => {
    //   const { id, name, columnCount, parentId } = action.payload;
    
    //   console.log("addCustomColumns called:::: ", action.payload);
    
    //   // Validate the input
    //   if (name !== "customColumns" || columnCount < 1) {
    //     console.warn("Invalid name or columnCount for custom columns");
    //     return;
    //   }
    
    //   // Create the new item for custom columns
    //   const newItem = { id, name, columnCount, parentId, width: 100/columnCount};
    
    //   console.log(`Creating customColumns with ${columnCount} columns`);
    
    //   // Dynamically create children arrays based on columnCount
    //   for (let i = 1; i <= columnCount; i++) {
    //     const columnKey = `children${String.fromCharCode(64 + i)}`; // Generate keys like childrenA, childrenB, etc.
    //     newItem[columnKey] = [];
    //   }
    
    //   // Add the new item to droppedItems
    //   state.droppedItems.push(newItem);
    
    //   console.log("Custom Columns Added: ", JSON.parse(JSON.stringify(newItem)));
    //   console.log("Updated droppedItems: ", JSON.parse(JSON.stringify(state.droppedItems)));
    // },
    
    
    addCustomColumns: (state, action) => {
      const { id, name, columnCount, parentId } = action.payload;
    
      console.log("addCustomColumns called:::: ", action.payload);
    
      // Validate the input
      if (name !== "customColumns" || columnCount < 1) {
        console.warn("Invalid name or columnCount for custom columns");
        return;
      }
    
      // Create the new item for custom columns
      const newItem = { id, name, columnCount, parentId };
    
      console.log(`Creating customColumns with ${columnCount} columns`);
    
      // Dynamically create children keys with styles based on columnCount
      for (let i = 1; i <= columnCount; i++) {
        const columnKey = `children${String.fromCharCode(64 + i)}`; // Generate keys like childrenA, childrenB, etc.
        newItem[columnKey] = [
          {
            id: `${id}-${columnKey}`, // Unique ID for tracking each column's children
            styles: { width: `${(100 / columnCount).toFixed(2)}%` }, // Dynamic width
            children: [], // Nested children array for this column
          },
        ];
      }
    
      // Add the new item to droppedItems
      state.droppedItems.push(newItem);
    
      console.log("Custom Columns Added: ", JSON.parse(JSON.stringify(newItem)));
      console.log("Updated droppedItems: ", JSON.parse(JSON.stringify(state.droppedItems)));
    },
    
    updateColumnWidth: (state, action) => {
      const { parentId, columnKey, width } = action.payload;

      console.log("updateColumnWidth called: ",action.payload);
    
      state.droppedItems = state.droppedItems.map((item) => {
        if (item.id === parentId) {
          return {
            ...item,
            [columnKey]: item[columnKey].map((child) => ({
              ...child,
              styles: { ...child.styles, width: `${width}%` },
            })),
          };
        }
        return item;
      });
    },
    deleteCustomColumn: (state, action) => {
      const { parentId, columnKey } = action.payload;
      console.log("deleteCustomColumn called: ", action.payload);
    
      state.droppedItems = state.droppedItems.map((item) => {
        if (item.id === parentId) {
          const updatedItem = { ...item };

          // Prevent deleting below 1 column
          if (updatedItem.columnCount <= 1) {
            console.warn("Minimum column limit (1) reached.");
            return updatedItem;
          }
    
          // Remove the specified child key (e.g., childrenA)
          if (updatedItem[columnKey]) {
            delete updatedItem[columnKey];
          }
    
          // Reorganize children keys (renaming sequentially)
          const childrenKeys = Object.keys(updatedItem)
            .filter((key) => key.startsWith("children"))
            .sort();
    
          // Dynamically recalculate columnCount
          updatedItem.columnCount = childrenKeys.length;
    
          // Update widths for remaining children
          const newWidth = updatedItem.columnCount > 0 ? (100 / updatedItem.columnCount).toFixed(2) + "%" : "0%";
          const newChildren = {};
          childrenKeys.forEach((key, index) => {
            const newKey = `children${String.fromCharCode(65 + index)}`;
            newChildren[newKey] = updatedItem[key];
    
            // Update width and assign random background color
            if (newChildren[newKey]?.[0]) {
              newChildren[newKey][0].styles.width = newWidth;
              newChildren[newKey][0].styles.backgroundColor =
                "#" + Math.floor(Math.random() * 16777215).toString(16);
            }
          });
    
          // Replace old children keys with reorganized ones
          // Object.keys(updatedItem)
          //   .filter((key) => key.startsWith("children"))
          //   .forEach((key) => delete updatedItem[key]);
          // Object.assign(updatedItem, newChildren);
    
          return updatedItem; // Return updated parent item
        }
    
        return item; // Other items remain unchanged
      });
    
      console.log("Updated droppedItems after delete:", JSON.stringify(state.droppedItems, null, 2));
    },
    
    duplicateCustomColumn: (state, action) => {
      const { parentId, columnKey } = action.payload;
      console.log("duplicateCustomColumn called: ", action.payload);
    
      state.droppedItems = state.droppedItems.map((item) => {
        if (item.id === parentId) {
          // Create a deep copy of the item
          const updatedItem = { ...item };
          console.log("updatedItem before duplication: ", updatedItem);
    
          // Prevent adding more than 10 columns
          if (updatedItem.columnCount >= 10) {
            console.warn("Maximum column limit (10) reached.");
            return updatedItem;
          }
    
          // Find the key to duplicate
          const targetChild = updatedItem[columnKey]?.[0];
          if (!targetChild) return updatedItem;
    
          // Increment columnCount
          updatedItem.columnCount += 1;
    
          // Calculate new width for all columns
          const newWidth = (100 / updatedItem.columnCount).toFixed(2) + "%";
    
          // Assign new widths to existing children
          Object.keys(updatedItem)
            .filter((key) => key.startsWith("children"))
            .forEach((key) => {
              if (updatedItem[key]?.[0]) {
                updatedItem[key][0].styles.width = newWidth;
              }
            });
    
          // Create a new child key for the duplicated column
          const newChildKey = `children${String.fromCharCode(65 + updatedItem.columnCount - 1)}`; // E.g., childrenE
          updatedItem[newChildKey] = [
            {
              ...targetChild,
              id: `${parentId}-${newChildKey}`, // Assign a unique ID
              styles: {
                ...targetChild.styles,
                width: newWidth,
                backgroundColor: "#" + Math.floor(Math.random() * 16777215).toString(16), // Random background color
              },
            },
          ];
    
          console.log("updatedItem after duplication: ", updatedItem);
          return updatedItem;
        }
    
        return item; // Other items remain unchanged
      });
    
      console.log("Updated droppedItems after duplication:", JSON.stringify(state.droppedItems, null, 2));
    },
    
    
    
    
    
    
    
    
    
    
    
    
    
    

  },
});

export const { 
  setActiveWidgetId, 
  setShowDropingArea, 
  setActiveWidgetName, 
  setDroppedItems, 
  deleteDroppedItemById, 
  updateElementStyles,
  setActiveParentId,
  setActiveColumn,
  saveState,
  clearState,
  updateElementContent,
  replaceDroppedItem,
  updateElementActiveState,
  addElementAtLocation,
  setWidgetOrElement,
  replaceElementInlast,
  addCustomColumns,
  updateColumnWidth,
  deleteCustomColumn,
  duplicateCustomColumn
} = cardDragableSlice.actions;

export default cardDragableSlice.reducer;



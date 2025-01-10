import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  activeWidgetId: null,
  activeWidgetName: "",
  activeParentId: "",
  activeColumn: "",
  showDropingArea: false,
  droppedItems: [], // This will store the dropped items
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
      const { id, name, type, parentId, styles, columnName, children, content } = action.payload;
    
      console.log("columnName from reducer: ", columnName);
      console.log("Payload: ", action.payload); // Debug log to check payload
    
      if (!parentId) {
        // Add top-level item
        const newItem = { id, name, type, content, styles: styles || {} };
    
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
                item.childrenA.push({ id, name, type, content, children: children || [], styles: styles || {} });
                console.log("Child added to childrenA: ", item.childrenA);
              } else if (columnName === "columnB" || columnName === "childrenB") {
                item.childrenB = item.childrenB || [];
                item.childrenB.push({ id, name, type, content, children: children || [], styles: styles || {} });
                console.log("Child added to childrenB: ", item.childrenB);
              }
              else if (columnName === "columnC" || columnName === "childrenC") {
                item.childrenC = item.childrenC || [];
                item.childrenC.push({ id, name, type, content, children: children || [], styles: styles || {} });
                console.log("Child added to childrenC: ", item.childrenC);
              }else{
                item.children = item.children || [];
                item.children.push({ id, name, type, content, children: children || [], styles: styles || {} });
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
      console.log("parentId:", parentId, "childId:", childId, "columnName:", columnName, "in redux action");
    
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
} = cardDragableSlice.actions;

export default cardDragableSlice.reducer;



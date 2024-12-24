import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  activeWidgetId: null,
  activeWidgetName: "",
  showDropingArea: false,
  droppedItems: [], // This will store the dropped items
};

const cardDragableSlice = createSlice({
  name: "cardDragable",
  initialState,
  reducers: {
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
    // setDroppedItems: (state, action) => {
    //   const { id, name, type, parentId, styles, children} = action.payload;
    
    //   console.log("Payload: ", action.payload); // Debug log to check payload
    
    //   if (!parentId) {
    //     // Add top-level item
    //     state.droppedItems.push({ id, name, type, children: children, styles: styles || {} });
    //     console.log("Top-level item added: ", state.droppedItems[state.droppedItems.length - 1]);
    //   } else {
    //     // Add child to the appropriate parent
    //     const addToParent = (items) => {
    //       for (const item of items) {
    //         console.log("Checking item: ", item); // Debug each item being checked
    
    //         if (item.id === parentId) {
    //           item.children.push({ id, name, type, children: children });
    //           console.log("Child added to parent: ", JSON.parse(JSON.stringify(item)));
    //           return true;
    //         }
    //         if (item.children.length > 0) {
    //           const added = addToParent(item.children);
    //           if (added) return true;
    //         }
    //       }
    //       return false;
    //     };
    
    //     const success = addToParent(state.droppedItems);
    //     if (!success) {
    //       console.warn("Parent ID not found for: ", parentId); // Warn if parent ID does not match
    //     }
    //   }

    //   console.log("Current State: ", JSON.parse(JSON.stringify(state.droppedItems)));

    // },



    setDroppedItems: (state, action) => {
      const { id, name, type, parentId, styles, columnName, children } = action.payload;
    
      console.log("columnName from reducer: ", columnName);
      console.log("Payload: ", action.payload); // Debug log to check payload
    
      if (!parentId) {
        // Add top-level item
        const newItem = { id, name, type, styles: styles || {} };
    
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
                item.childrenA.push({ id, name, type, children: children || [], styles: styles || {} });
                console.log("Child added to childrenA: ", item.childrenA);
              } else if (columnName === "columnB" || columnName === "childrenB") {
                item.childrenB = item.childrenB || [];
                item.childrenB.push({ id, name, type, children: children || [], styles: styles || {} });
                console.log("Child added to childrenB: ", item.childrenB);
              }
              else if (columnName === "columnC" || columnName === "childrenC") {
                item.childrenC = item.childrenC || [];
                item.childrenC.push({ id, name, type, children: children || [], styles: styles || {} });
                console.log("Child added to childrenC: ", item.childrenC);
              }else{
                item.children = item.children || [];
                item.children.push({ id, name, type, children: children || [], styles: styles || {} });
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
      const { id, styles } = action.payload;
      const element = state.droppedItems.find((item) => item.id === id);
      if (element) {
        element.styles = { ...element.styles, ...styles };
      }
      console.log(`stype applied to element ${id}: `, JSON.parse(JSON.stringify(state.droppedItems)));
    },

    deleteDroppedItemById: (state, action) => {
      console.log("deleteDroppedItemById called", state.droppedItems);
      const idToDelete = action.payload;
      state.droppedItems = state.droppedItems.filter(
        (item) => item.id !== idToDelete
      );
      console.log("Item deleted, updated droppedItems: ", state.droppedItems);
    },


  },
});

export const { setActiveWidgetId, setShowDropingArea, setActiveWidgetName, setDroppedItems, deleteDroppedItemById, updateElementStyles } =
  cardDragableSlice.actions;
export default cardDragableSlice.reducer;



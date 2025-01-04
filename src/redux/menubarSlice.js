import { createSlice } from '@reduxjs/toolkit';

const initialState = {
    isOpen: true,
    selectedMenuItem: null, // Track selected menu item
    selectedTemplate: null,
    isModalOpen: false
};

const menubarSlice = createSlice({
  name: 'menubar',
  initialState,
  reducers: {

    handleMenuItemClick: (state, action) => {
        console.log("Menu Item Clicked:", action.payload);
        state.selectedMenuItem = action.payload;
    },
    toggleSidebar: (state) => {
        console.log("toggleSidebar called!")
        state.isOpen = !state.isOpen;
    },
    clearSelectedItem: (state, action) => {
      console.log("clearSelectedItem called!");
      state.selectedMenuItem = null;
    },
    setSelectTeplate: (state, action) => { 
      console.log("setSelectTeplate called: ",action.payload);
      state.selectedTemplate = action.payload;
    },
    toggleModal: (state, action) => {
      state.isModalOpen = !state.isModalOpen;
      console.log("toggleModal called: ", state.isModalOpen);
    }
  },
});

export const { handleMenuItemClick, toggleSidebar, clearSelectedItem, setSelectTeplate, toggleModal} = menubarSlice.actions;

export default menubarSlice.reducer;

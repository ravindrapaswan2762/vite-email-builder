import { configureStore } from '@reduxjs/toolkit';


import cardToggleSlice from './redux/cardToggleSlice';
import cardDragableSlice from './redux/cardDragableSlice';
import navbarSlice from './redux/navbarSlice';
import menubarSlice from './redux/menubarSlice';
import addTemplateSlice from './redux/addTemplateSlice';
import activeBorderSlice from './redux/activeBorderSlice';
import treeViewSlice from './redux/treeViewSlice';


export const store = configureStore({
  reducer: {
    cardToggle: cardToggleSlice,
    cardDragable: cardDragableSlice,
    navbar: navbarSlice,
    menubar: menubarSlice,
    addTemplate: addTemplateSlice,
    borderSlice: activeBorderSlice,
    treeViewSlice: treeViewSlice,
  },
});

export default store;

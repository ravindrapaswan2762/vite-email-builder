import { configureStore } from '@reduxjs/toolkit';


import cardToggleSlice from './redux/cardToggleSlice';
import cardDragableSlice from './redux/cardDragableSlice';
import navbarSlice from './redux/navbarSlice';
import menubarSlice from './redux/menubarSlice';
import addTemplateSlice from './redux/addTemplateSlice';
import activeBorderSlice from './redux/activeBorderSlice';
import treeViewSlice from './redux/treeViewSlice';
import exchangeElePosSlice from './redux/exchangeElePosSlice';
import conditionalCssSlice from './redux/condtionalCssSlice';


export const store = configureStore({
  reducer: {
    cardToggle: cardToggleSlice,
    cardDragable: cardDragableSlice,
    navbar: navbarSlice,
    menubar: menubarSlice,
    addTemplate: addTemplateSlice,
    borderSlice: activeBorderSlice,
    treeViewSlice: treeViewSlice,
    elementPosition: exchangeElePosSlice,
    coditionalCssSlice: conditionalCssSlice,
  },
});

export default store;

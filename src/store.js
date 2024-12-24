import { configureStore } from '@reduxjs/toolkit';


import cardToggleSlice from './redux/cardToggleSlice';
import cardDragableSlice from './redux/cardDragableSlice';
import navbarSlice from './redux/navbarSlice';

export const store = configureStore({
  reducer: {
    cardToggle: cardToggleSlice,
    cardDragable: cardDragableSlice,
    navbar: navbarSlice
  },
});

export default store;

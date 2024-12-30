import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  activeLeftTab: "Contents",
  activeRightTab: "Editor",
  view: "desktop",
};

const navbarSlice = createSlice({
  name: 'navbar',
  initialState,
  reducers: {
    setLeftTab: (state, action) => {
      console.log("setLeftTab: ",action.payload);
      state.activeLeftTab = action.payload;
      state.leftComponent = action.payload.component;
    },
    setRightTab: (state, action) => {
      console.log("setRightTab: ",action.payload);
      state.activeRightTab = action.payload;
      state.rightComponent = action.payload.component;
    },
    setView: (state, action) => {
      console.log("setView: ",action.payload);
      state.view = action.payload;
    },
  },
});

export const { setLeftTab, setRightTab, setView } = navbarSlice.actions;

export default navbarSlice.reducer;

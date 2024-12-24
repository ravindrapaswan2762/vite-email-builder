import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  selectedEditor: "",
  isColumnPopedUp: false,
};

const cardToggleSlice = createSlice({
  name: 'cardToggle',
  initialState,
  reducers: {
    setActiveEditor: (state, action) => {
      console.log("Editor has changed in state to : ", action.payload)
      state.selectedEditor = action.payload;
    },
    setColumnPopUp: (state, action) => {
      console.log("setColumnPopUp: ", action.payload)
      state.isColumnPopedUp = action.payload
    }

    
  },
});

export const { setActiveEditor, setColumnPopUp} = cardToggleSlice.actions;
export default cardToggleSlice.reducer;

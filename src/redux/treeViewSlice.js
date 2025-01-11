import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    activeNodeList: null
}

const treeViewSlice = createSlice({
    name: "treeViewSlice",
    initialState,
    reducers: {
        setActiveNodeList: (state, action) =>{
            state.activeNodeList = action.payload;
        }
    }
})

export const { setActiveNodeList } = treeViewSlice.actions;
export default treeViewSlice.reducer;
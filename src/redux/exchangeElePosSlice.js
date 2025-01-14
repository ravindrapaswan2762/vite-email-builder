import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    activePosition: true
}

const exchangeElePosSlice = createSlice({
    name: "exchangeElement",
    initialState,

    reducers: {
        setActivePosition: (state, action) => {
            console.log("setActivePosition called: ", action.payload);
            state.activePosition = action.payload;
        }
    }
})

export const { setActivePosition } = exchangeElePosSlice.actions;
export default exchangeElePosSlice.reducer;
import { createSlice } from "@reduxjs/toolkit"


const initialState = {
    activeBorders: false
}

const activeBorderSlice = createSlice({
    name: 'activeBorderSlice',
    initialState,

    reducers: {
        setActiveBorders: (state, action) => {
            console.log("setActiveBorders action called: ", action.payload);
            state.activeBorders = action.payload;
        }
    }
})

export const { setActiveBorders } = activeBorderSlice.actions;
export default activeBorderSlice.reducer;
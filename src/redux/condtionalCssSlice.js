import { createSlice } from "@reduxjs/toolkit";
import ColumnOne from "../components/domElements/ColumnOne";

const initialState = {
    columnOneExtraPadding: false,
    columnTwoExtraPadding: false,
}

const conditionalCssSlice = createSlice({
    name: "exchangeElement",
    initialState,

    reducers: {

        setColumnOneExtraPadding: (state, action) => {
            console.log("setColumnOneExtraPadding called: ", action.payload);
            state.columnOneExtraPadding = action.payload;
        },
        setColumnTwoExtraPadding: (state, action) => {
            console.log("setColumnTwoExtraPadding called: ", action.payload);
            state.columnTwoExtraPadding = action.payload;
        },
    }
})

export const { setColumnOneExtraPadding, setColumnTwoExtraPadding } = conditionalCssSlice.actions;
export default conditionalCssSlice.reducer;
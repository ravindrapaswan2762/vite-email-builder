import { createSlice } from "@reduxjs/toolkit";
import ColumnOne from "../components/domElements/ColumnOne";

const initialState = {
    columnOneExtraPadding: false,
    columnTwoExtraPadding: false,
    columnThreeExtraPadding: false,
    wrapperExtraPadding: false,
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
        setColumnThreeExtraPadding: (state, action) => {
            console.log("setColumnTwoExtraPadding called: ", action.payload);
            state.columnThreeExtraPadding = action.payload;
        },
        setWrapperExtraPadding: (state, action) => {
            console.log("setWrapperExtraPadding called: ", action.payload);
            state.wrapperExtraPadding = action.payload;
        }

    }
})

export const { setColumnOneExtraPadding, setColumnTwoExtraPadding, setColumnThreeExtraPadding, setWrapperExtraPadding } = conditionalCssSlice.actions;
export default conditionalCssSlice.reducer;
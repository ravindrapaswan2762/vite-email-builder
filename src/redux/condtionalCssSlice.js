import { createSlice } from "@reduxjs/toolkit";
import ColumnOne from "../components/domElements/ColumnOne";

const initialState = {
    columnOneExtraPadding: false,
    columnTwoExtraPadding: false,
    columnThreeExtraPadding: false,
    wrapperExtraPadding: false,

    textExtraPadding: false,
    smallGapInTop: false,
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
        },
        setTextExtraPadding: (state, action) => {
            console.log("setTextExtraPadding called: ", action.payload);
            state.textExtraPadding = action.payload;
        },
        setSmallGapInTop: (state, action) =>{
            console.log("setSmallGapInTop called: ", action.payload);
            state.smallGapInTop = action.payload;
        }

    }
})

export const { 
    setColumnOneExtraPadding, 
    setColumnTwoExtraPadding, 
    setColumnThreeExtraPadding, 
    setWrapperExtraPadding,

    setTextExtraPadding,
    setSmallGapInTop,
    
 } = conditionalCssSlice.actions;
export default conditionalCssSlice.reducer;
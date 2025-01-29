import { createSlice } from "@reduxjs/toolkit";
import ColumnOne from "../components/domElements/ColumnOne";

const initialState = {
    columnOneExtraPadding: false,
    columnTwoExtraPadding: false,
    columnThreeExtraPadding: false,
    wrapperExtraPadding: false,
    customClumnsExtraPadding: false,

    textExtraPadding: false,
    smallGapInTop: false,

    elementPaddingTop: null,
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
        },
        setCustomClumnsExtraPadding: (state, action) =>{
            console.log("setCustomClumnsExtraPadding called: ", action.payload);
            state.customClumnsExtraPadding = action.payload;
        },
        setElementPaddingTop: (state, action) =>{
            state.elementPaddingTop = action.payload;
            console.log("setElementPaddingTop called: ",action.payload);
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
    setCustomClumnsExtraPadding,
    setElementPaddingTop,
    
 } = conditionalCssSlice.actions;
export default conditionalCssSlice.reducer;
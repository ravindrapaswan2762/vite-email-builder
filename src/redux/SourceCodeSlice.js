import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  showSourceCode: false,
  sourceCode: [],
}
const SourceCodeSlice = createSlice({
  name: 'sourceCode',
  initialState,
  reducers: {
    setShowSourceCode: (state, action) => {
      
    },
    setSourceCode: (state, action) => {
     
    }

  
  },
});

export const {setShowSourceCode, setSourceCode} = SourceCodeSlice.actions;
export default SourceCodeSlice.reducer;

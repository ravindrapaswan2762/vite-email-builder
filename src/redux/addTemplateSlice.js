import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  templateName: "",
  category: "",
  subject: "",
  language: "",
  version: "1.0",

  isBuilder: null,
  isEditer: null,
  isViewClick: null,
  activeTemplateId: null
};

const addTemplateSlice = createSlice({
  name: 'addTemplate',
  initialState,
  reducers: {
    setTemplateData: (state, action) => {
      console.log("setTemplateData called : ", action.payload);
      const {templateName, category, subject, language} = action.payload;
      return {
        ...state,
        templateName,
        category,
        subject,
        language,
      };

    },

    setBuilder: (state, action) => {
      console.log("setBuilder called: ",action.payload);
      state.isBuilder = action.payload
    },
    setEditor: (state, action) => {
      console.log("setEditor called: ",action.payload);
      state.isEditer = action.payload
    },
    setViewClick: (state, action) => {
      console.log("setViewClick called: ",action.payload);
      state.isViewClick = action.payload
    },
    setActiveTemplateId: (state, action) => {
      console.log("setActiveTemplateId: ", action.payload);
      state.activeTemplateId = action.payload;
    }
    
  },
});

export const { setTemplateData, setBuilder, setEditor, setViewClick, setActiveTemplateId} = addTemplateSlice.actions;
export default addTemplateSlice.reducer;

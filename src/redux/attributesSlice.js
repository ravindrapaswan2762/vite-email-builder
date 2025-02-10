import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  wrapperAttributes: {
    dimensions: {
      padding: {
        top: 20,
        bottom: 20,
        left: 0,
        right: 0,
      },
    },
    background: {
      image: "",
      color: "",
      repeat: "no-repeat",
      size: "cover",
    },
    border: {
      type: "2px solid rgb(218, 220, 226)",
      radius: "",
    },
    extra: {
      className: "",
    },
  },

  pageAttributes: {
    emailSettings: {
      subject: "Welcome to Atmik Bharat",
      subtitle: "Nice to meet you!",
      width: "600px",
      breakpoint: "480px",
    },
    themeSettings: {
      fontFamily: "-apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto'",
      fontSize: 14,
      lineHeight: 1.7,
      fontWeight: "400",
      textColor: "#000000",
      background: "#efeeea",
      contentBackground: "#000000",
      userStyle: "",
      importFont: {
        name: "",
        href: "",
      },
    },
  },
};

// ✅ Helper function to update nested properties safely
const updateNestedProperty = (obj, path, value) => {
  const keys = path.split(".");
  let current = obj;

  for (let i = 0; i < keys.length - 1; i++) {
    if (!current[keys[i]]) {
      current[keys[i]] = {}; // Create the path if it does not exist
    }
    current = current[keys[i]];
  }

  current[keys[keys.length - 1]] = value;
};

const attributesSlice = createSlice({
  name: "attributes",
  initialState,
  reducers: {
    updateWrapperAttribute: (state, action) => {
      console.log("🟢 updateWrapperAttribute called: ", action.payload);
      const { category, field, value } = action.payload;
      updateNestedProperty(state.wrapperAttributes, `${category}.${field}`, value);
    },
    updatePageAttribute: (state, action) => {
      console.log("🟢 updatePageAttribute called: ", action.payload);
      const { category, field, value } = action.payload;
      updateNestedProperty(state.pageAttributes, `${category}.${field}`, value);
    },
  },
});

export const { updateWrapperAttribute, updatePageAttribute } = attributesSlice.actions;
export default attributesSlice.reducer;

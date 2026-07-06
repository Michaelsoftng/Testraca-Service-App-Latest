// src/redux/userPopularTestSlice.js
import { createSlice } from "@reduxjs/toolkit";

const userPopularTestSlice = createSlice({
  name: "userTest",
  initialState: {
    list: [],
    totalCount: 0,
  },
  reducers: {
    setTests: (state, action) => {
      state.list = action.payload.tests;
      state.totalCount = action.payload.totalCount;
    },
    addTests: (state, action) => {
      state.list = [...state.list, ...action.payload.tests];
      state.totalCount = action.payload.totalCount;
    },
    resetTests: (state) => {
      state.list = [];
      state.totalCount = 0;
    },
  },
});

export const { setTests, addTests, resetTests } = userPopularTestSlice.actions;
export default userPopularTestSlice.reducer;

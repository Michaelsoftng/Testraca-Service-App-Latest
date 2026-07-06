
import { createSlice } from "@reduxjs/toolkit";

const userPackagesSlice = createSlice({
  name: "userPackage",
  initialState: {
    list: [],
    totalCount: 0,
  },
  reducers: {
    setPackages: (state, action) => {
      state.list = action.payload.packages;
      state.totalCount = action.payload.totalCount;
    },
    addPackages: (state, action) => {
      state.list = [...state.list, ...action.payload.packages];
      state.totalCount = action.payload.totalCount;
    },
    resetPackages: (state) => {
      state.list = [];
      state.totalCount = 0;
    },
  },
});

export const { setPackages, addPackages, resetPackages } = userPackagesSlice.actions;
export default userPackagesSlice.reducer;

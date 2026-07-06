// src/redux/userSlice.js
import { createSlice } from "@reduxjs/toolkit";

const userSlice = createSlice({
  name: "users",
  initialState: {
    list: [],
    totalCount: 0,
  },
  reducers: {
    setUsers: (state, action) => {
      state.list = action.payload.users;
      state.totalCount = action.payload.totalCount;
    },
    addUsers: (state, action) => {
      state.list = [...state.list, ...action.payload.users];
      state.totalCount = action.payload.totalCount;
    },
    resetUsers: (state) => {
      state.list = [];
      state.totalCount = 0;
    },
  },
});

export const { setUsers, addUsers, resetUsers } = userSlice.actions;
export default userSlice.reducer;

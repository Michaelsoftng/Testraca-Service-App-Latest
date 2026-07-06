// src/redux/phlebotomistRequestsSlice.js
import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  byUser: {}, // keyed by phlebotomistId
};

const phlebotomistRequestsSlice = createSlice({
  name: "phlebotomistRequests",
  initialState,
  reducers: {
    setRequests: (state, action) => {
      const { phlebotomistId, requests, totalCount, offset } = action.payload;
      if (!phlebotomistId) return;

      state.byUser[phlebotomistId] = {
        list: requests || [],
        totalCount: totalCount ?? requests?.length ?? 0,
        offset: offset ?? 0,
      };
    },

    addRequests: (state, action) => {
      const { phlebotomistId, requests, totalCount, offset } = action.payload;
      if (!phlebotomistId) return;

      const existing = state.byUser[phlebotomistId]?.list || [];
      const existingIds = new Set(existing.map((r) => r.id));

      const filteredNew = (requests || []).filter(
        (r) => !existingIds.has(r.id)
      );

      state.byUser[phlebotomistId] = {
        list: [...existing, ...filteredNew],
        totalCount: totalCount ?? existing.length + filteredNew.length,
        offset: offset ?? existing.length,
      };
    },

    resetRequests: (state, action) => {
      const { phlebotomistId } = action.payload || {};
      if (phlebotomistId) {
        delete state.byUser[phlebotomistId];
      } else {
        state.byUser = {};
      }
    },

    clearRequests: (state) => {
      state.byUser = {};
    },
  },
});

export const {
  setRequests,
  addRequests,
  resetRequests,
  clearRequests,
} = phlebotomistRequestsSlice.actions;

export default phlebotomistRequestsSlice.reducer;

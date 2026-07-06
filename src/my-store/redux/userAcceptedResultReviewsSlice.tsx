// src/my-store/redux/userAcceptedResultReviewsSlice.js
import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  byUser: {}, // keyed by patientId
};

const userAcceptedResultReviewsSlice = createSlice({
  name: "userAcceptedResultReviews",
  initialState,
  reducers: {
    setAcceptedResultReviews: (state, action) => {
      const { patientId, reviews, totalCount, offset } = action.payload;
      if (!patientId) return;

      state.byUser[patientId] = {
        list: reviews || [],
        totalCount: totalCount ?? reviews?.length ?? 0,
        offset: offset ?? 0,
      };
    },

    addAcceptedResultReviews: (state, action) => {
      const { patientId, reviews, totalCount, offset } = action.payload;
      if (!patientId) return;

      const existing = state.byUser[patientId]?.list || [];
      const existingIds = new Set(existing.map((r) => r.id));
      const filteredNew = (reviews || []).filter((r) => !existingIds.has(r.id));

      state.byUser[patientId] = {
        list: [...existing, ...filteredNew],
        totalCount: totalCount ?? existing.length + filteredNew.length,
        offset: offset ?? existing.length,
      };
    },

    resetAcceptedResultReviews: (state, action) => {
      const { patientId } = action.payload || {};
      if (patientId) delete state.byUser?.[patientId];
      else state.byUser = {};
    },

    clearAcceptedResultReviews: (state) => {
      state.byUser = {};
    },
  },
});

export const {
  setAcceptedResultReviews,
  addAcceptedResultReviews,
  resetAcceptedResultReviews,
  clearAcceptedResultReviews,
} = userAcceptedResultReviewsSlice.actions;

export default userAcceptedResultReviewsSlice.reducer;

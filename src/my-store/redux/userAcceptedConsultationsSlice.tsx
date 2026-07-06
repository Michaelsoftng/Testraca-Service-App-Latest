import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  byUser: {}, // keyed by patientId
};

const userAcceptedConsultationsSlice = createSlice({
  name: "userAcceptedConsultations",
  initialState,
  reducers: {
    // Replace consultations for a user
    setAcceptedConsultations: (state, action) => {
      const { patientId, consultations, totalCount, offset } = action.payload;
      if (!patientId) return;

      state.byUser[patientId] = {
        list: consultations || [],
        totalCount: totalCount ?? consultations?.length ?? 0,
        offset: offset ?? 0,
      };
    },

    // Append consultations (for pagination)
    addAcceptedConsultations: (state, action) => {
      const { patientId, consultations, totalCount, offset } = action.payload;
      if (!patientId) return;

      const existing = state.byUser[patientId]?.list || [];
      const existingIds = new Set(existing.map((c) => c.id));

      const filteredNew = (consultations || []).filter(
        (c) => !existingIds.has(c.id)
      );

      state.byUser[patientId] = {
        list: [...existing, ...filteredNew],
        totalCount: totalCount ?? existing.length + filteredNew.length,
        offset: offset ?? existing.length,
      };
    },

    // Reset one user’s consultations
    resetAcceptedConsultations: (state, action) => {
      const { patientId } = action.payload || {};
      if (patientId) {
        delete state.byUser?.[patientId];
      } else {
        state.byUser = {};
      }
    },

    // Clear all
    clearAcceptedConsultations: (state) => {
      state.byUser = {};
    },
  },
});

export const {
  setAcceptedConsultations,
  addAcceptedConsultations,
  resetAcceptedConsultations,
  clearAcceptedConsultations,
} = userAcceptedConsultationsSlice.actions;

export default userAcceptedConsultationsSlice.reducer;

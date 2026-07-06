import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  byUser: {}, // keyed by patientId
};

const userOrdersSlice = createSlice({
  name: "userOrders",
  initialState,
  reducers: {
    // Replace all orders for a user (used on initial load or refetch)
    setOrders: (state, action) => {
      const { patientId, orders, totalCount, offset } = action.payload;
      if (!patientId) return;
      if (!state.byUser) state.byUser = {};

      state.byUser[patientId] = {
        list: orders || [],
        totalCount: totalCount ?? orders?.length ?? 0,
        offset: offset ?? 0,
      };
    },

    // Append new orders safely (for pagination)
    addOrders: (state, action) => {
      const { patientId, orders, totalCount, offset } = action.payload;
      if (!patientId) return;
      if (!state.byUser) state.byUser = {};

      const existing = state.byUser[patientId]?.list || [];

      // ✅ Prevent duplicates using order.id
      const existingIds = new Set(existing.map((o) => o.id));
      const filteredNew = (orders || []).filter((o) => !existingIds.has(o.id));

      state.byUser[patientId] = {
        list: [...existing, ...filteredNew],
        totalCount: totalCount ?? existing.length + filteredNew.length,
        offset: offset ?? existing.length,
      };
    },

    // Remove one user's orders
    resetOrders: (state, action) => {
      const { patientId } = action.payload || {};
      if (patientId) {
        delete state.byUser?.[patientId];
      } else {
        state.byUser = {};
      }
    },

    // Clear everything
    clearOrders: (state) => {
      state.byUser = {};
    },
  },
});

export const { setOrders, addOrders, resetOrders, clearOrders } = userOrdersSlice.actions;
export default userOrdersSlice.reducer;




// src/redux/userOrdersSlice.js
// import { createSlice } from "@reduxjs/toolkit";

// const initialState = {
//   byUser: {}, // keyed by patientId
// };

// const userOrdersSlice = createSlice({
//   name: "userOrders",
//   initialState,
//   reducers: {
//     setOrders: (state, action) => {
//       const { patientId, orders, totalCount, offset } = action.payload;
//       if (!state.byUser) state.byUser = {}; // ensure safe
//       state.byUser[patientId] = {
//         list: orders,
//         totalCount,
//         offset,
//       };
//     },
//     addOrders: (state, action) => {
//       const { patientId, orders, totalCount, offset } = action.payload;
//       if (!state.byUser) state.byUser = {}; // ensure safe
//       const existing = state.byUser[patientId]?.list || [];
//       state.byUser[patientId] = {
//         list: [...existing, ...orders],
//         totalCount,
//         offset,
//       };
//     },
//     resetOrders: (state, action) => {
//       const { patientId } = action.payload || {};
//       if (patientId) {
//         if (state.byUser) delete state.byUser[patientId];
//       } else {
//         state.byUser = {};
//       }
//     },
//     clearOrders: (state) => {
//       state.byUser = {}; // reset everything safely
//     },
//   },
// });

// export const { setOrders, addOrders, resetOrders, clearOrders } = userOrdersSlice.actions;
// export default userOrdersSlice.reducer;







// // src/redux/userOrdersSlice.js
// import { createSlice } from "@reduxjs/toolkit";

// const userOrdersSlice = createSlice({
//   name: "userOrders",
//   initialState: {
//     byUser: {}, // keyed by patientId
//   },
//   reducers: {
//     setOrders: (state, action) => {
//       const { patientId, orders, totalCount, offset } = action.payload;
//       state.byUser[patientId] = {
//         list: orders,
//         totalCount,
//         offset,
//       };
//     },
//     addOrders: (state, action) => {
//       const { patientId, orders, totalCount, offset } = action.payload;
//       const existing = state.byUser[patientId]?.list || [];
//       state.byUser[patientId] = {
//         list: [...existing, ...orders],
//         totalCount,
//         offset,
//       };
//     },
//     resetOrders: (state, action) => {
//       const { patientId } = action.payload || {};
//       if (patientId) {
//         delete state.byUser[patientId];
//       } else {
//         state.byUser = {};
//       }
//     },
//   },
// });

// export const { setOrders, addOrders, resetOrders } = userOrdersSlice.actions;
// export default userOrdersSlice.reducer;


// import { createSlice } from "@reduxjs/toolkit";

// const userOrdersSlice = createSlice({
//   name: "userOrders",
//   initialState: {
//     list: [],
//     totalCount: 0,
//   },
//   reducers: {
//     setOrders: (state, action) => {
//       state.list = action.payload.orders;
//       state.totalCount = action.payload.totalCount;
//     },
//     addOrders: (state, action) => {
//       state.list = [...state.list, ...action.payload.orders];
//       state.totalCount = action.payload.totalCount;
//     },
//     resetOrders: (state) => {
//       state.list = [];
//       state.totalCount = 0;
//     },
//   },
// });

// export const { setOrders, addOrders, resetOrders } = userOrdersSlice.actions;
// export default userOrdersSlice.reducer;

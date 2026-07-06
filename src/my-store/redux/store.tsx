// src/redux/store.js
import AsyncStorage from "@react-native-async-storage/async-storage";
import { combineReducers, configureStore } from "@reduxjs/toolkit";
import { persistReducer, persistStore } from "redux-persist";

import patientRequestsSlice from "./patientRequestsSlice";
import phlebotomistRequestsReducer from "./phlebotomistRequestsSlice";
import phlebotomistAcceptedRequestsReducer from "./phlebotomistAcceptedRequestsSlice";

import userDetailsReducer from "./userDetailsSlice";
import userOrdersSlice from "./userOrdersSlice";
import packageReducer from "./userPackagesSlice";
import TestReducer from "./userPopularTestSlice";
import userReducer from "./userSlice";
import resultReviewsReducer from "./userResultReviewsSlice";
import acceptedResultReviewsReducer from "./userAcceptedResultReviewsSlice";
import notificationsReducer from "./notificationsSlice";

const rootReducer = combineReducers({
  users: userReducer,
  tests: TestReducer,
  _packages: packageReducer,
  patientRequests: patientRequestsSlice,
  orders: userOrdersSlice,
  userDetails_: userDetailsReducer,

  phlebotomistRequests: phlebotomistRequestsReducer,
  phlebotomistAcceptedRequests: phlebotomistAcceptedRequestsReducer,

  resultReviews: resultReviewsReducer,
  acceptedResultReviews: acceptedResultReviewsReducer,
  notifications: notificationsReducer,
});

const persistConfig = {
  key: "root",
  storage: AsyncStorage,
  whitelist: [
    "users",
    "tests",
    "_packages",
    "patientRequests",
    "orders",
    "userDetails_",
    "phlebotomistRequests",
    "phlebotomistAcceptedRequests",
    "resultReviews",
    "acceptedResultReviews",
  ],
};

const persistedReducer = persistReducer(persistConfig, rootReducer);

export const store = configureStore({
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({ serializableCheck: false, immutableCheck: false }),
});

export const persistor = persistStore(store);



// // src/redux/store.js
// import AsyncStorage from "@react-native-async-storage/async-storage";
// import { combineReducers, configureStore } from "@reduxjs/toolkit";
// import { persistReducer, persistStore } from "redux-persist";


// import patientRequestsSlice from "./patientRequestsSlice";
// import consultationsReducer from "./userConsultationsSlice";
// import consultationsAcceptedReducer from "./userAcceptedConsultationsSlice";
// import userDetailsReducer from "./userDetailsSlice";
// import userOrdersSlice from "./userOrdersSlice";
// import packageReducer from "./userPackagesSlice";
// import TestReducer from "./userPopularTestSlice";
// import userReducer from "./userSlice";
// import resultReviewsReducer from "./userResultReviewsSlice";
// import acceptedResultReviewsReducer from "./userAcceptedResultReviewsSlice";

// const rootReducer = combineReducers({
//   users: userReducer,
//   tests: TestReducer,
//   _packages: packageReducer,
//   patientRequests: patientRequestsSlice,
//   orders: userOrdersSlice,
//   userDetails_: userDetailsReducer,
//   consultations: consultationsReducer,
//   acceptedConsulttattion: consultationsAcceptedReducer,
//   resultReviews: resultReviewsReducer,
//   acceptedResultReviews: acceptedResultReviewsReducer,
// });

// const persistConfig = {
//   key: "root",
//   storage: AsyncStorage,
//   whitelist: ["users", "tests", "_packages", "patientRequests", "orders", "userDetails_", "consultations", "acceptedConsulttattion", "resultReviews",
//     "acceptedResultReviews",], // persist both slices
// };

// const persistedReducer = persistReducer(persistConfig, rootReducer);

// export const store = configureStore({
//   reducer: persistedReducer,
//   middleware: (getDefaultMiddleware) =>
//     getDefaultMiddleware({ serializableCheck: false }),
// });

// export const persistor = persistStore(store);

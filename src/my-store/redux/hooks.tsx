import { useDispatch, useSelector } from "react-redux";
// import { store } from "./store";

export const useAppDispatch = () => useDispatch();
export const useAppSelector = useSelector;

// Selectors
export const selectAllTestRequests = state => state.patientRequests.testRequests;

export const selectTestRequestById = (state, id) =>
  state.patientRequests.testRequests.find(r => r.id === id);

export const selectPatientsByTestId = (state, id) => {
  const request = state.patientRequests.testRequests.find(r => r.id === id);
  return request ? request.patients : [];
};

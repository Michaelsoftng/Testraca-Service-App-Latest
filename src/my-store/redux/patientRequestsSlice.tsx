import { createSlice } from "@reduxjs/toolkit";
import { nanoid } from "nanoid";
import 'react-native-get-random-values';

const initialState = {
  testRequests: [],
};

const patientRequestsSlice = createSlice({
  name: "patientRequests",
  initialState,
  reducers: {
    // Add a new test request (e.g. Malaria Test)
    addTestRequest: (state, action) => {
      const { testName, facilityId, facilityName, testId, facilityType, priceAmount } = action.payload;
      state.testRequests.push({
        id: nanoid(),
        testName,
        facilityId,
        facilityName,
        testId,
        facilityType,
        priceAmount,
        patients: [],
      });
    }, 

    // Add a patient to a specific test request
    addPatientToTest: (state, action) => {
      const { requestId, patient } = action.payload;
      const request = state.testRequests.find(r => r.id === requestId);
      if (request) {
        request.patients.push({ id: nanoid(), ...patient });
      }
    },

    // Update a specific patient under a test request
    updatePatientInTest: (state, action) => {
      const { requestId, patientId, updates } = action.payload;
      const request = state.testRequests.find(r => r.id === requestId);
      if (request) {
        const patient = request.patients.find(p => p.id === patientId);
        if (patient) {
          Object.assign(patient, updates);
        }
      }
    },

    // Remove a specific patient
    removePatientFromTest: (state, action) => {
      const { requestId, patientId } = action.payload;
      const request = state.testRequests.find(r => r.id === requestId);
      if (request) {
        request.patients = request.patients.filter(p => p.id !== patientId);
      }
    },

    // Remove all patients from a test request
    clearPatientsFromTest: (state, action) => {
      const { requestId } = action.payload;
      const request = state.testRequests.find(r => r.id === requestId);
      if (request) {
        request.patients = [];
      }
    },

    // Delete entire test request
    removeTestRequest: (state, action) => {
      const { requestId } = action.payload;
      state.testRequests = state.testRequests.filter(r => r.id !== requestId);
    },
    // ✅ Clear all test requests
    clearAllTestRequests: (state) => {
      state.testRequests = [];
    },

  },
});

export const {
  addTestRequest,
  addPatientToTest,
  updatePatientInTest,
  removePatientFromTest,
  clearPatientsFromTest,
  removeTestRequest,
  clearAllTestRequests,
} = patientRequestsSlice.actions;

export default patientRequestsSlice.reducer;

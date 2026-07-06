import React, { useState, useEffect } from 'react';
import { Alert } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import { GET_ALL_REQUEST, GET_ALL_REQUEST_ASSIGNMENT } from './ApiSchema';
import { URL_LINK } from '../../config';

const GetUserAssignment = () => {
  const [token, setToken] = useState(null);
  const [patientId, setPatientId] = useState(null);
  const [countAssigned, setCountAssigned] = useState(0);
  const [countAssignedCompleted, setCountAssignedCompleted] = useState(0);
  const [dataStore, setDataStore] = useState([]);


  useEffect(() => {
    const fetchToken = async () => {
      try {
        const storedToken = await AsyncStorage.getItem('userToken');
        const storedID = await AsyncStorage.getItem('id');

        setToken(storedToken);
        setPatientId(storedID);
      } catch (err) {
        console.error("Error fetching token:", err.message);
      }
    };
    fetchToken();
  }, []);

  const fetchDataAssignment = async () => {
    if (token && patientId) {
      try {
        const response = await axios.post(
          URL_LINK,
          {
            query: GET_ALL_REQUEST_ASSIGNMENT,
            variables: {
              userId: atob(patientId).replace('UserNode:', ''),
            },
          },
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
          console.info('XXXXXX ', atob(patientId).replace('UserNode:', ''));
          // console.error('FFAFAFAFAFA:::: ', response);
        // Extract assignments
        const assignments = response?.data?.data?.getAllAssignmentForUser || [];
        
        // console.warn('DASADADADDSSSSSSA:::: ',assignments);
        // Update state safely  pId: 74e640ce-8955-4f72-b39b-fc96a3a7fb13
        // UserId: 4733c483-b914-4a04-b91c-5b6c96020fd7s
        setDataStore(assignments);
        let i = 0;
        assignments.forEach((assignment, index) => {
                      // console.log(`Assignment ${index + 1}:`, assignment);
                      // console.log(`Assignment XXXX ${index + 1}:`, assignment.isAccepted === true);
                      if(assignment.isAccepted === false){
                        setCountAssigned(i + 1);
                        // console.error('AAAAAAAAAAAA:::: ',i + 1);
                        i++;
                      }
                      
                      
                      // setDataStore(assignment);
                    });
        // setCountAssigned(assignments.length);

        // console.log("Assignments:", assignments);
        // console.log("Total Assignments Count:", assignments.length);

      } catch (err) {
        console.error("Error fetching data:", err.message);
      }
    }
  };

  useEffect(() => {
    fetchDataAssignment();
  }, [token, patientId]);

  return {
    countAssigned,
    dataStore,
    fetchDataAssignment
  };
};

export default GetUserAssignment;


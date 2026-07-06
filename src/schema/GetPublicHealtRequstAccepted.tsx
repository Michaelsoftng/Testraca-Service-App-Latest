import { useState, useEffect, useCallback } from 'react';
import { Alert } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import { URL_LINK } from '../../config';
import { GET_ALL_PUBLIC_HEALTH_BY_PHLEB } from './ApiSchema';

const GetPublicHealthRequestAccepted = (navigation) => {
  const [token, setToken] = useState(null);
  const [patientId, setPatientId] = useState(null);
  const [publicHealthAccepted, setPublicHealthAccepted] = useState(null);

  useEffect(() => {
    const fetchToken = async () => {
      try {
        const storedToken = await AsyncStorage.getItem('userToken_');
        const storedID = await AsyncStorage.getItem('id_');

        if (storedToken && storedID) {
          setToken(storedToken);
          setPatientId(atob(storedID).replace('UserNode:', '')); // Decoding patient ID
        }
      } catch (err) {
        console.error("Error fetching token:", err.message);
      }
    };
    fetchToken();
  }, []);

  const fetchPHAccepted = useCallback(async () => {
    if (!token || !patientId) return;

    try {
      const response = await axios.post(
        URL_LINK,
        {
          query: GET_ALL_PUBLIC_HEALTH_BY_PHLEB,
          variables: {
            limit: 10000,
            offset: 0,
            phlebotomistId: patientId, 
          },
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const requests = response?.data?.data?.getPublicRequestsByUser;
      // console.log('Public Health Requests:', requests);
      // console.log('Phleb ID :: ', patientId);
      setPublicHealthAccepted(requests || []);
      
    } catch (err) {
      console.error('Error fetching data:', err.message);
    }
  }, [token, patientId]);

  useEffect(() => {
    fetchPHAccepted();
  }, [fetchPHAccepted]);

  // useEffect(() => {
  //   const intervalId = setInterval(() => {
  //     fetchPHAccepted();
  //   }, 60000); // fetch data every 1 minute
  
  //   return () => {
  //     clearInterval(intervalId);
  //   };
  // }, [token]);
  return { publicHealthAccepted, fetchPHAccepted };
};

export default GetPublicHealthRequestAccepted;









  
         
                   
          
        
          
   
  


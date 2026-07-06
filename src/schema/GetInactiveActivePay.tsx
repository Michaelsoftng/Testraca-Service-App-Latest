import { useState, useEffect } from 'react';
import { Alert } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useQuery } from '@apollo/client';
import { GET_CHARGES, GET_INACTIVE_INCOME, GET_USER_BY_ID_ADMIN } from './ApiSchema';
import axios from 'axios';
import { URL_LINK } from '../../config';

const GetInactiveActivePay = (navigation) => {
  const [token, setToken] = useState(null);
  const [refreshToken, setRefreshToken] = useState(null);
  const [patientId, setPatientId] = useState(null);
  const [inActive, setInactive] = useState(null);


  useEffect(() => {
    const fetchToken = async () => {
      try {
        const storedToken = await AsyncStorage.getItem('userToken');
        const storedRefreshToken = await AsyncStorage.getItem('refreshToken');
        const storedID = await AsyncStorage.getItem('id');

        setToken(storedToken);
        setRefreshToken(storedRefreshToken);
        setPatientId(storedID);
      } catch (err) {
        console.error("Error fetching token:", err.message);
      }
    };
    fetchToken();
  }, []);


  const fetchDataInactiveDetails = async () => {
    
    if (token && patientId) {
      console.info('YYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYY '+atob(patientId).replace('UserNode:', ''));
    //   setIsLoading(true);
    // console.info('MMMMMMMMMMMMMMMMMMMMMMMMMMMMM ',atob(patientId)); 
      try {
        const response = await axios.post(
          URL_LINK,
          {
            query: GET_INACTIVE_INCOME, 
            variables: {
                phlebotomist: atob(patientId).replace('UserNode:', ''),
            },           
          },
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        // console.log('MMMMMMMMMMMMMMMMMMMmmmmmmmmmmbbbbbbbbbbbbbb ', response?.data?.data?.getPhlebotomistInActivePayment); //?.getCharges ?.data   ?.data        


         const {inactiveIncome,
            ongoingRequest,
            completedRequest,
            scheduledRequest,
            cancelledRequest} = response?.data?.data?.getPhlebotomistInActivePayment || [];
            setInactive(inactiveIncome);

      } catch (err) { 
        console.log('Error fetching dataGGGAGGA:', err);
        console.log('Error fetching data NNNNN:', err.message);
        
        // setError(err.message);
      } finally {
        // setIsLoading(false);
      }
    }
  };

  useEffect(() => {
    fetchDataInactiveDetails();
  }, [token, patientId]);
  let data_ = 'llll';
  return {
    inActive,
    fetchDataInactiveDetails
  };
};


export default GetInactiveActivePay;


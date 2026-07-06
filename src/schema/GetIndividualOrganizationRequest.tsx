



































import { useState, useEffect } from 'react';
import { Alert } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useQuery } from '@apollo/client';
import { GET_CHARGES, GET_INDIVIDUAL_ORGANIZATION_REQUEST, GET_PUBLIC_HEALTH_REQUEST } from './ApiSchema';
import axios from 'axios';
import { URL_LINK } from '../../config';

const GetIndividualOrganizationRequest = (navigation) => {
  const [token, setToken] = useState(null);
  const [refreshToken, setRefreshToken] = useState(null);
  const [patientId, setPatientId] = useState(null);
  const [publicHealth, setPublicHealth] = useState({});
  const [individualOrganization, setIndividualOrganization] = useState({});


  useEffect(() => {
    const fetchToken = async () => {
      try {
        const storedToken = await AsyncStorage.getItem('userToken_');
        const storedRefreshToken = await AsyncStorage.getItem('refreshToken_');
        const storedID = await AsyncStorage.getItem('id_');

        setToken(storedToken);
        setRefreshToken(storedRefreshToken);
        setPatientId(storedID);
      } catch (err) {
        // console.error("Error fetching TTTTTTTTTT:", err.message);
      }
    };
    fetchToken();
  }, []);


  const fetchIndividualOrganization = async () => {
  
    if (token) {
      try {
        const response = await axios.post(
          URL_LINK,
          { 
            query: GET_INDIVIDUAL_ORGANIZATION_REQUEST,    
            variables:{
              "search": "",
              "limit": 1000,
              "offset": 0
            }       
                   
          },
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
          
          
          // const {getRequestsQueue} = response?.data?.data;
          const {getRequestByUsers} = response?.data?.data;
          // console.log('INDIVIDUAL ZZZZZZZZZZZZZZZZZZZZZ', getRequestsQueue);

          setIndividualOrganization({getRequestByUsers});
   
      } catch (err) {
        console.log('Error fetching data:', err.message);
        // setError(err.message);
      } finally {
        // setIsLoading(false);
      }
    }
  };
  useEffect(() => {
    fetchIndividualOrganization();
  }, [token]);


  // useEffect(() => {
  //   const intervalId = setInterval(() => {
  //     fetchIndividualOrganization();
  //   }, 2000); // fetch data every 1 minute
  
  //   return () => {
  //     clearInterval(intervalId);
  //   };
  // }, [token]);
  return {
    individualOrganization,  
   fetchIndividualOrganization   
  };
};

export default GetIndividualOrganizationRequest;

import { useState, useEffect, useRef } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import { GET_PUBLIC_HEALTH_REQUEST } from './ApiSchema';
import { URL_LINK } from '../../config';

const GetPublicHealtRequsts = () => {
  const [token, setToken] = useState(null);
  const [publicHealth, setPublicHealth] = useState([]);
  const previousDataRef = useRef(null); // to compare new vs old data

  useEffect(() => {
    const fetchToken = async () => {
      try {
        const storedToken = await AsyncStorage.getItem('userToken_');
        setToken(storedToken);
      } catch (err) {
        console.error("Error fetching token:", err.message);
      }
    };
    fetchToken();
  }, []);

  const fetchPublicHealth = async () => {
    if (!token) return;

    try {
      const response = await axios.post(
        URL_LINK,
        {
          query: GET_PUBLIC_HEALTH_REQUEST,
          variables: {
            search: "",
            limit: 10000,
            offset: 0,
          },
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      // const newRequests = response?.data?.data?.getPublicRequestQueue?.requests ?? []; 


      const {getPublicRequestQueue} = response?.data?.data;
      console.log('PUBLIC ::::: ', getPublicRequestQueue); 

      setPublicHealth({getPublicRequestQueue});

      // setIndividualOrganization({getRequestsQueue});
      // Only update state if data has changed
      // const prevString = JSON.stringify(previousDataRef.current);
      // const newString = JSON.stringify(newRequests);

      // if (prevString !== newString) {
      //   previousDataRef.current = newRequests;
      //   setPublicHealth(newRequests);
      // }

    } catch (err) {
      console.error("Error fetching data:", err.message);
    }
  };

  useEffect(() => {
    fetchPublicHealth();
  }, [token]);

  // // Initial fetch + polling
  // useEffect(() => {
  //   if (token) {
  //     fetchPublicHealth(); // first fetch

  //     const intervalId = setInterval(() => {
  //       fetchPublicHealth();
  //     }, 5000); // every 10 seconds  10000

  //     return () => clearInterval(intervalId);
  //   }
  // }, [token]);

  return {
    publicHealth,
    fetchPublicHealth,
  };
};

export default GetPublicHealtRequsts;










  
          
          

   
  


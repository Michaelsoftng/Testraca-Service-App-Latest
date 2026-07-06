import { useState, useEffect, useCallback } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import { URL_LINK } from '../../config';
import { GET_INDIVIDUAL_ORGANIZATION_REQUEST_NEW, GETREQUEST } from './ApiSchema';
import { useGetUserDetails } from '../hook/useGetUserDetails';

const GetIndividualOrganizationAccepted = (navigation) => {
  const {
        userData,
        loadingUserDetails,
        errorUserDetails,
        patientIdPay,
        reloadUserDetails,
      } = useGetUserDetails();
    
      console.error('SEEYEYEYEYEYEYE :::::::::: ',userData);

  const [token, setToken] = useState(null);
  const [patientId, setPatientId] = useState(null);
  const [individualOrganizationAccepted, setIndividualOrganizationAccepted] = useState([]);
  // const { userData, loadingUserDetails } = useGetUserDetails();
  console.log('USER DATA WWWWWW :::::', userData);
  useEffect(() => {
    const fetchToken = async () => {
      try {
        const storedToken = await AsyncStorage.getItem('userToken_');
        const storedID = await AsyncStorage.getItem('id_');
        if (storedToken && storedID) {
          setToken(storedToken);
          setPatientId(userData.id);
          // setPatientId(atob(storedID).replace('UserNode:', ''));
        }
      } catch (err) {
        console.error("Error fetching token:", err.message);
      }
    };
    fetchToken();
  }, [userData]);

const fetchIndividualOrganizationAccepted = useCallback(async () => {
  if (!token || !patientId) return;

  try {
    const response = await axios.post(
      URL_LINK,
      {
        query: GETREQUEST,
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

    const requests =
      response?.data?.data?.getAllRequests || [];

    console.log("REQUESTS:", requests);

    setIndividualOrganizationAccepted(requests);
  } catch (err) {
    console.log("SERVER RESPONSE:", err.response?.data);
    console.log("STATUS:", err.response?.status);
  }
}, [token, patientId]);

  useEffect(() => {
    fetchIndividualOrganizationAccepted();
  }, [fetchIndividualOrganizationAccepted]);

  // useEffect(() => {
  //   const intervalId = setInterval(() => {
  //     fetchIndividualOrganizationAccepted();
  //   }, 60000); // fetch data every 1 minute
  
  //   return () => {
  //     clearInterval(intervalId);
  //   };
  // }, [token, patientId]);

  return { individualOrganizationAccepted, fetchIndividualOrganizationAccepted };
};

export default GetIndividualOrganizationAccepted;


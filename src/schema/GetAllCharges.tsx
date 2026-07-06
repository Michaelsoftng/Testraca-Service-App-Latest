import { useState, useEffect } from 'react';
import { Alert } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useQuery } from '@apollo/client';
import { GET_CHARGES } from './ApiSchema';
import axios from 'axios';
import { URL_LINK } from '../../config';

const useGetAllCharges = (navigation) => {
  const [token, setToken] = useState(null);
  const [refreshToken, setRefreshToken] = useState(null);
  const [patientId, setPatientId] = useState(null);
  const [distanceChargePerDistance, setDistanceChargePerDistance] = useState(null);
  const [phlebotomistCharge, setPhlebotomistCharge] = useState(null);
  const [serviceCharge, setServiceCharge] = useState(null);
  const [doctorsPercentage, setDoctorsPercentage] = useState(null);

  const [chargesData, setChargesData] = useState({});
  useEffect(() => {
    const fetchToken = async () => {
      try {
        const storedToken = await AsyncStorage.getItem('userToken_');
        const storedRefreshToken = await AsyncStorage.getItem('refreshToken');
        const storedID = await AsyncStorage.getItem('id_');

        setToken(storedToken);
        setRefreshToken(storedRefreshToken);
        setPatientId(storedID);
      } catch (err) {
        console.error("Error fetching token:", err.message);
      }
    };
    fetchToken();
  }, []);


  const fetchChargesData = async () => {
    // console.info('DDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDD');
    if (token) {
    //   setIsLoading(true);
    // console.info('DDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDD2222');
      try {
        const response = await axios.post(
          URL_LINK,
          {
            query: GET_CHARGES,            
          },
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        // console.log('KKKKK 1', response);
        // console.log('KKKKK 2', response?.data);
        // console.log('KKKKK 3', response?.data?.data);        
          console.log('KKKKK 4 GAGAGAGAGA', response?.data?.data?.getCharges);
          
          const {serviceCharge,
            chargePerDistance,
            consultationCharge,
            consultationDiscount,
            partPayment,
            doctorsPercentage,
            phlebotomistPercentage,
            budgetPerDistance,
            referralBonusPercentage,
            baseCharge} = response?.data?.data?.getCharges;
          // setDistanceChargePerDistance(chargePerDistance);
          // setPhlebotomistCharge(phlebotomistPercentage);
          // setServiceCharge(serviceCharge);
          // setDoctorsPercentage(doctorsPercentage);

          setChargesData({serviceCharge,
            chargePerDistance,
            consultationCharge,
            consultationDiscount,
            partPayment,
            doctorsPercentage,
            phlebotomistPercentage,
            budgetPerDistance,
            referralBonusPercentage,
            baseCharge});
   
      } catch (err) {
        console.log('Error fetching data:', err.message);
        // setError(err.message);
      } finally {
        // setIsLoading(false);
      }
    }
  };


  useEffect(() => {
    fetchChargesData();
  }, [token]);
  return {
   chargesData,
   fetchChargesData     
  };
};

export default useGetAllCharges;












    










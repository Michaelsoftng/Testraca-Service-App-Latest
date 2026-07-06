import { useState, useEffect } from 'react';
import { Alert } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useQuery } from '@apollo/client';
import { GET_CHARGES, GET_USER_BY_ID_ADMIN } from './ApiSchema';
import axios from 'axios';
import { URL_LINK } from '../../config';

const GetUserDetails = (navigation) => {
  const [token, setToken] = useState(null);
  const [refreshToken, setRefreshToken] = useState(null);
  const [patientId, setPatientId] = useState(null);
  const [distanceChargePerDistance, setDistanceChargePerDistance] = useState(null);
  const [phlebotomistCharge, setPhlebotomistCharge] = useState(null);
  const [serviceCharge, setServiceCharge] = useState(null);
  const [pId, setPId] = useState(null);
  const [isLoading1, setIsLoading] = useState(true);
  
  const [email, setEmail] = useState(null);
  const [firstName, setFirstName] = useState(null);
  const [lastName, setLastName] = useState(null);
  const [streetAddress, setStreetAddress] = useState(null);
  const [city, setCity] = useState(null);
  const [state, setState] = useState(null);
  const [country, setCountry] = useState(null);
  const [postal, setPostal] = useState(null);
  const [location, setLocation] = useState(null);
  const [longitude_, setLongitude] = useState(null);
  const [dateOfBirth, setDateOfBirth] = useState(null);
  const [online, setonline] = useState(false);
  const [bankInfomation, setBankInfomation] = useState(null);
  const [streetAddress2, setStreetAddress2] = useState(null);
  const [phlebotomistEarning_, setPhlebotomistEarning] = useState(0.0);
  // dob
       



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
        console.error("Error fetching token:", err.message);
      }
    };
    fetchToken();
  }, []);


  const fetchDataUserDetails = async () => {
    
    if (token && patientId) {
      try {
        const response = await axios.post(
          URL_LINK,
          {
            query: GET_USER_BY_ID_ADMIN, 
            variables: {
              id: atob(patientId).replace('UserNode:', ''),
            },           
          },
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        // console.log('CCCCCXXXXXXXXXXXX MMMMMM ', response); 
        // console.info('MMMMMMMMMMMMMMMMMMMMMMMMMMMMM ',atob(patientId).replace('UserNode:', '')); 
        // console.log('CCCCCXXXXXXXXXXXX ', response?.data?.data?.getUserById); //?.getCharges ?.data   ?.data        
        // console.log('CCCCCYYYYYYYYYYYYYYYYYYYYY ', response?.data); //?.getCharges ?.data   ?.data
          // console.log('CCCCCMMMMMMMMMMMMMMMMMMM ', response?.data?.data?.getUserById); //?.getCharges ?.data   ?.data
        //   console.log('CCCCCMMMMMMMMMMMMMMMMMMM PA', response?.data?.data?.getUserById?.patient); //?.getCharges ?.data   ?.data
        //   console.log('FFFFFFFFF ', atob(patientId).replace('UserNode:', ''));

  //       const [oline, setonline] = useState(false);
  // const [bankInfomation, setBankInfomation] = useState(null);
  // const [streetAddress2, setStreetAddress2] = useState(null);
        if (response?.data?.data?.getUserById === null) {
          navigation.navigate('login');
          return;
        }

         const {email,
          firstName,
          lastName,
          streetAddress,
          streetAddress2,
          city,
          state,
          country, 
          postal,
          location,
          // latitude,
          // longitude,
          dateOfBirth, phlebotomist, doctor} = response?.data?.data?.getUserById || [];
if(phlebotomist){
const {bankInfomation, dob, id, online, phlebotomistEarning} = phlebotomist;
setDateOfBirth(dob);
          setPId(id);
          setPhlebotomistEarning(phlebotomistEarning);
          setonline(online);
          // console.error('ONLINE :::: ', online,'   ', id);
}else{
  const {bankInfomation,  id, online} = doctor;  
          setPId(id);
          setonline(online);
          // console.error('ONLINE XXX :::: ', online);  
}
          setEmail(email);
          setFirstName(firstName);
          setLastName(lastName);
          setStreetAddress(streetAddress);
          setCity(city);
          setState(state);
          setCountry(country);
          setPostal(postal);
          setLocation(location);
          // setLongitude(longitude);
          // setPId(response?.data?.data?.getUserById?.patient?.id);
          // setDateOfBirth(response?.data?.data?.getUserById?.patient?.dateOfBirth);
          setBankInfomation(bankInfomation);
          
          // const {distanceChargePerDistance, phlebotomistCharge, serviceCharge} = response?.data?.data?.getCharges;
          // setDistanceChargePerDistance(distanceChargePerDistance);
          // setPhlebotomistCharge(phlebotomistCharge);
          // setServiceCharge(serviceCharge);
        // const fetchedData = response?.data?.data?.getAllFacilitiesByTestAndLocation;

        // if (Array.isArray(fetchedData?.facilityTests)) {
        //   setDataFacility(fetchedData.facilityTests);
        // } else {
        //   console.log('Fetched data is not an array:', fetchedData);
        //   setError("Unexpected data format.");
        // }
        setIsLoading(false);
      } catch (err) { 
        console.log('Error fetching dataBBBBBBB:', err);
        console.log('Error fetching data BBBBB DDDDDD:', err.message);
        
        // setError(err.message);
      } finally {
        // setIsLoading(false);
      }
    }
  };

  useEffect(() => {
    fetchDataUserDetails();
  }, [token, patientId]);
  // let data_ = 'llll';
  return {
    email,
    firstName,
    lastName,
    streetAddress,
    city,
    state,
    country, 
    postal,
    location,
    // latitude_,
    // longitude_,
    dateOfBirth,    
  pId,
  bankInfomation,
  online,
  phlebotomistEarning_,
  isLoading1,
  fetchDataUserDetails
  };
};


export default GetUserDetails;












    










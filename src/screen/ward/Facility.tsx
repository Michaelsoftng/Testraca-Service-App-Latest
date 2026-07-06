import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import KeyboardAvoidingContainer from '../../components/utils/KeyboardAvoidingContainer';
import styles_ from '../../components/utils/styles';
import CustomButton from '../../components/CustomButton';
import { Formik } from 'formik';
import CustomCardWard from '../../components/CustomCardWard';
import CardList from '../../components/CardList';
import { useNavigation, useRoute } from '@react-navigation/native';
import CustomLocationInput from '../../components/CustomLocationInput';
import Location from '../../assets/images/svg-icon/location';
import axios from 'axios';
import { URL_LINK } from '../../../config';
import { GET_ALL_FACILITIES_BY_TEST_AND_LOCATION } from '../../schema/ApiSchema';
import useAuth from '../../schema/UseAuth';
import GetAllCharges from '../../schema/GetAllCharges';
import useGetAllCharges from '../../schema/GetAllCharges';

const FacilityPage = () => {
  const navigation = useNavigation();
  const { token, patientId } = useAuth(navigation);
  const route = useRoute();
  
  const {   chargesData,
    fetchChargesData } = useGetAllCharges(navigation);

  const {
    testID, 
    testName, 
    
    
    currentAddress
  } = route.params || {};
  
  const [lat, setLatitude] = useState(null);
  const [long, setLongitude] = useState(null);
  const [dataFacility, setDataFacility] = useState([]);
  const [error_, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedData, setSelectedData] = useState(null);
  const [facilityId, setFacilityId] = useState(null);
  const [facilityName, setFacilityName] = useState(null);
  const [facilityType, setFacilityType] = useState(null);
  const [price, setPrice] = useState(null);
  const [distance, setDistance] = useState(null);

  useEffect(() => {
    setLatitude(latitude);
    setLongitude(longitude);
   
  }, [latitude, longitude]);

  const fetchData = async () => {
    if (token) {
      setIsLoading(true);
      try {
        const response = await axios.post(
          URL_LINK,
          {
            query: GET_ALL_FACILITIES_BY_TEST_AND_LOCATION,
            variables: {
              testId: testID,
              latitude: lat,
              longitude: long,
            },
          },
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        
          
        const fetchedData = response?.data?.data?.getAllFacilitiesByTestAndLocation;

        if (Array.isArray(fetchedData?.facilityTests)) {
          setDataFacility(fetchedData.facilityTests);
        } else {
          console.log('Fetched data is not an array:', fetchedData);
          setError("Unexpected data format.");
        }
      } catch (err) {
        console.log('Error fetching data:', err.message);
        setError(err.message);
      } finally {
        setIsLoading(false);
      }
    }
  };







  useEffect(() => {
    fetchData();    
  }, [token, lat, long]);

  
  useEffect(() => {
    if (selectedData) {
      setFacilityId(selectedData.facility.id);
      setFacilityName(selectedData.facility.facilityName);
      setFacilityType(selectedData.facility.facilityType);
      setPrice(selectedData.price);
      setDistance(selectedData.distance);
    }
  }, [selectedData]);

  const handlePress = () => {
    navigation.navigate('request_test', {
      testID, testName, currentAddress, latitude, 
      longitude, patientId, token, facilityId, facilityName, facilityType, price, distance
    });
  };

  const handleSelectItem = (item) => {
    setSelectedData(item);
  };

  return (
    <Formik
      initialValues={{ cardNumber: '', expiryDate: '', cvv: '', pin: '' }}
      validationSchema={null} 
      onSubmit={() => {
        navigation.navigate('cabinet_page');
      }}
    >
      {() => (
        <KeyboardAvoidingContainer style={styles_.containerBackGround}>
          <View style={styles.container}>
            <View style={{ paddingLeft: 5, paddingRight: 5, paddingBottom: 5 }}>
              <Text style={styles_.titleCustom}>Chosen Location</Text>
              <CustomLocationInput
                editable={false}
                leftIcon={<Location width={15} height={15} />}
                value={currentAddress}
                placeholder={'Current location'}
              />
            </View>

            <CustomCardWard
              colorBack="#F5F6F7"
              tittle={testName}
              centerText="From NGN 8,000"
              onPress={() => console.log('Card Pressed')}
            />

            <View>
              <Text style={[styles_.titleText, { fontSize: 16, fontWeight: '800', color: '#0F1D40' }]}>
                Facilities
              </Text>
            </View>

            {Array.isArray(dataFacility) ? (
              <CardList
                data={{ facilityTests: dataFacility }}
                itemsPerPage={2} 
                onSelectItem={handleSelectItem} 
                distannce={distanceChargePerDistance}
              />
            ) : (
              <Text>No facilities available</Text>
            )}

            {Array.isArray(dataFacility) && (
              <CustomButton
                backgroundColor={styles_.loginScreenButtonEnable}
                children={
                  <Text style={styles_.loginTextEnable}>
                    Continue
                  </Text>
                }
                handlePress={handlePress}
              />
            )}
          </View>
        </KeyboardAvoidingContainer>
      )}
    </Formik>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 10,
    paddingTop: 0,
    backgroundColor: '#FFFFFF',
  },
  titleText: {
    fontSize: 16,
    fontWeight: '800',
    color: '#0F1D40',
  },
});

export default FacilityPage;



















































  





























        










































































              











        






















































































































































































































































































































































  

  







































































































































































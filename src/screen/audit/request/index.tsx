import React, { useCallback, useEffect, useState } from 'react';
import { View, Text, StyleSheet, Pressable, TextInput, Image, TouchableOpacity, ScrollView, FlatList } from 'react-native';
import { appColors, appFonts, hp } from './../../../lib/utils/scale';
import BackBtn from './../../../components/atoms/a-back-btn';
import { useNavigation } from '@react-navigation/native';
import GetPublicHealthRequestAccepted from '../../../schema/GetPublicHealtRequstAccepted';
import GetIndividualOrganizationAccepted from '../../../schema/GetIndividualOrganizationAccepted';
import { Picker } from '@react-native-picker/picker';
import { CREATE_REQUEST_TOOL_AUDIT } from '../../../schema/ApiSchema';
import { URL_LINK } from '../../../../config';
import axios from 'axios';
import useAuth from '../../../schema/UseAuth';
import CustomLabtracaInputText from '../../../components/CustomLabtracaInputText';
import GetUserDetails from '../../../schema/GetUserDetails';
import CustomAlert from '../../../components/CustomAlert';

// const options = ['Sample bottle', 'Needles', 'Hand gloves', 'Bolt strips',];
   const options = [
      // Qualitative Pro throat swab
      // 
      { id: 1, name: 'Samble Bottle', tag:'sambleBottle' },
      { id: 2, name: 'Methlylated Spirit', tag:'methlylatedSpirit' },
      { id: 3, name: 'Alcohol Pad', tag:'alcoholPad' },
      { id: 4, name: 'Hand Sanitizer', tag:'handSanitizer' },
      { id: 5, name: 'N95 Face mask', tag:'N95Facemask' },
      { id: 6, name: 'Surgical Facemask', tag:'surgicalFacemask' },
      { id: 7, name: 'Anti-Septic Wipes', tag:'antisepticWipes' },
      { id: 8, name: 'Nitrile Gloves', tag:'nitrileGloves'},
      { id: 9, name: 'Latex gloves', tag:'latexgloves' },
      { id: 10, name: 'Powder Free Gloves', tag:'powderFreeGloves' },
      { id: 11, name: 'Vacutainers', tag:'vacutainers' },
      { id: 12, name: 'Syringes', tag:'syringes' },
      { id: 13, name: 'Needles', tag:'needles' },
      { id: 14, name: 'Tourniquets', tag:'tourniquets' },
      { id: 15, name: 'Lancets', tag:'lancets' },
      { id: 16, name: 'Pipettes', tag:'pipettes' },
      { id: 17, name: 'Droppers', tag:'droppers' },
      { id: 18, name: 'Cotton Wool', tag:'cottonWool' },
      { id: 19, name: 'Gauze Pads', tag:'gauzePads' },
      { id: 20, name: 'Thermometer', tag:'thermometer' },
      { id: 21, name: 'Adhesive Bandages', tag:'adhesiveBandages' },
      { id: 22, name: 'Blood Pressure Monitor', tag:'bloodPressureMonitor' },
      { id: 23, name: 'Glucometer', tag:'glucometer' },
      { id: 24, name: 'Glucose Test Strip', tag:'glucoseTestStrip' },
      { id: 25, name: 'EDTA Tube', tag:'EDTATube' },
      { id: 26, name: 'Heparin Tubes', tag:'heparinTubes' },
      { id: 27, name: 'Serum Separating Tubes', tag:'serumSeparatingTubes' },
      { id: 28, name: 'Urine Sample Cups', tag:'urineSampleCups' },
      { id: 29, name: 'Stool Sample Containers', tag:'stoolSampleContainers' },
      { id: 30, name: 'Swabs', tag:'swabs' },
      { id: 31, name: 'Specimen Bags', tag:'specimenBags' },
      { id: 32, name: 'Insulated Transport Containers', tag:'insulatedTransportContainers' },
      { id: 33, name: 'Disinfectants', tag:'disinfectants' },
      { id: 34, name: 'Waste Disposal Bags', tag:'wasteDisposalBags' },
      { id: 35, name: 'Needle Disposal Containers', tag:'needleDisposalContainers' },
      { id: 36, name: 'Barcode Labels', tag:'barcodeLabels' },
      { id: 37, name: 'Permanent Markers', tag:'permanentMarkers' },
      { id: 38, name: 'Specimen Labels', tag:'specimenLabels' },
      { id: 39, name: 'Bolt Strips', tag:'boltStrips' },
      { id: 40, name: 'Pressure Cuff', tag:'pressureCuff' },
      // { id: 41, name: 'Alcohol Pad', tag:'' },
      // { id: 42, name: 'Alcohol Pad', tag:'' },


    ];
const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

export default function RequestScreen(props: any) {
  
  const navigation = useNavigation();
  const { token, refreshToken, patientId, email_1, verifyTokenFun } = useAuth(navigation);
  const [showOptions, setShowOptions] = useState(false);
  const [selectedOption, setSelectedOption] = useState('');
  const [error, setError] = useState(null);
  const [reload, setReload] = useState(false);
  const [loading, setLoading] = useState(true);
  const [selectedItem, setSelectedItem] = useState(null);
  const [selectedItemNumber, setSelectedItemNumber] = useState(null);

  const [modalVisible, setModalVisible] = useState(false);
  const [msgTitle, setMsgTitle] = useState('');
  const [msgDescription, setMsgDescription] = useState('');
  const [isLoading, setIsLoading] = useState(true);
   

    const [formData, setFormData] = useState({
    amount: '',
    // password: ''
  });

  const {   email,
            firstName,
            lastName,
            streetAddress,
            city,
            state,
            country, 
            postal,
            // latitude_,
            // longitude_,
            dateOfBirth,    
          pId,
          bankInfomation,
          online,phlebotomistEarning_} = GetUserDetails(navigation);

  const handleInputChange = (name, value) => {
    setFormData({ ...formData, [name]: value });
  };

  const handleOptionSelect = (option: string) => {
    setSelectedOption(option);
    setShowOptions(false);
  };

  const [requestValuesIndividualACCEPTED, setRequestValuesIndividualACCEPTED] = useState([]); 
  const [requestValuesPHACCEPTED, setRequestValuesPHACCEPTED] = useState([]); 


  const {
    publicHealthAccepted,
    fetchPHAccepted  
   } = GetPublicHealthRequestAccepted(navigation);
   const {
    individualOrganizationAccepted,
  fetchIndividualOrganizationAccepted
   } = GetIndividualOrganizationAccepted(navigation);

   const updateAcceptedRequests = useCallback(async () => {
   try{
       const fetchedDataIndividual = individualOrganizationAccepted?.requests ?? [];
       if (fetchedDataIndividual.length === 0) return;
       const mappedData = fetchedDataIndividual.map((item) => ({
         id: item.id,
        //  title: item.facility?.facilityName || "",
        //  total: item.total ? item.total : 0.0,
        //  pickUpAddress: item.samplePickUpAddress,
        //  requestDate: item.requestDate,
        //  requestStatus: item.requestStatus,
        //  detailsVisible: false,
        //  sampleCollectionDate: item.sampleCollectionDate,
        //  sampleDropOffDate: item.samepleDropOffDate,
        //  dropOffDistance: item.dropOffDistance,
        //  distanceCharge: item.distanceCharge,
        //  pickupDistance: item.pickupDistance,
        //  firstName: item.patient?.user?.firstName || "",
        //  lastName: item.patient?.user?.lastName || "",
        //  email: item.patient?.user?.email || "",
        //  phoneNumber: item.patient?.user?.phoneNumber || "",
        //  phlebotomistEarning:item.phlebotomistEarning||0.0,
        //  testRequest: Array.isArray(item.requestId) ? item.requestId.map((tr) => ({      
        //    patientAge: tr.patientAge,
        //    patientName: tr.patientName,
        //    status: tr.status,
        //  })) : [],
        //  tests: Array.isArray(item.requestId) ? item.requestId.map((t) => ({
        //    name: t.test.name,    
        //  })) : [],
         
        //     balance: item.balance,
       })
      );
       setRequestValuesIndividualACCEPTED(mappedData);
   }catch(err){
     setError(err.message);
   }finally{
     await sleep(3000);
     setLoading(false);
   }
     // setLoading(false);
   }, [individualOrganizationAccepted]);
   
   const updatePHAcceptedRequests = useCallback(async () => {
     const fetchedDataIndOrg = publicHealthAccepted?.requests ?? []; 
   
     if (fetchedDataIndOrg.length === 0) return;
   
     console.log("Fetching Accepted Requests WWWWMWMWMW 233333 :", fetchedDataIndOrg);
     console.log("Fetching Accepted Requests SSSSSSSSSSSSSSSSSS:", fetchedDataIndOrg);
   
     const mappedData = [...fetchedDataIndOrg]
       .filter((item) => {
         const status = item.requestStatus;
         return (
            status === "REQUEST_ACCEPTED"
         );
       })
       .map((item) => ({
         id: item.id,
         noOfPeople:item.noOfPeople ||"",
         noOfEmployees:item.noOfEmployees ||"",
         organisationName: item.patient.organisationName ||"",
         organisationType:item.patient.organisationType ||"",
       })
      
      );
      console.log("Mapped Accepted Requests Audit:", mappedData);
     // setRequestValuesACCEPTED(mappedData);
     setRequestValuesPHACCEPTED(mappedData);
     // setLoading(false);
   }, [publicHealthAccepted]);
   
   
       useEffect(() => {
         const fetchData = async () => {
           await Promise.all([
             updateAcceptedRequests(),
             updatePHAcceptedRequests()
           ]);
         };    
         fetchData();
         console.log("Accepted PH Requests Audit:", requestValuesPHACCEPTED);
       }, [      
         publicHealthAccepted, 
         individualOrganizationAccepted      
       ]);
//////////////Add Tool
const handleWorkTools = async () => {

  console.log(formData.amount,'    ', selectedOption,'    ',pId ? pId : atob(patientId).replace('UserNode:', ''))
    try {
      setLoading(true);
      const response = await axios.post(
        URL_LINK,
        {
          query: CREATE_REQUEST_TOOL_AUDIT,
         variables: {
  "phlebotomistId": pId ? pId : atob(patientId).replace('UserNode:', ''),
  "input": {
    // "handSanitizer":5
    [selectedOption.toString()]: formData.amount,

  }
}

        },
        {
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
        }
      );
      // console.log('LEXXXXXXXX :::::::::::::: ',response.data.data);
      setMsgTitle('Successful.');
      setMsgDescription('Updated successful.');
      setModalVisible(true);
      setLoading(false);
      formData.amount='';
      setSelectedOption('');
      // setReload(!reload);
      await sleep(2000);
      setModalVisible(false);
      navigation.goBack();
      // navigation.navigate('AuditBottomTab');
      // navigation.navigate('AuditHome');
      // navigation.navigate('AuditWorkTools');
    } catch (error) {
      setLoading(false);
      console.error(error);
      console.error(error.message);
    }
  };
  ///////






const renderItem = ({ item }) => (
  <TouchableOpacity onPress={() => setSelectedItem(item)}>
    <View style={{ paddingVertical: 10, borderBottomWidth: 1, borderBottomColor: '#E2E4E8' }}>
      <Text style={{ fontSize: hp(2), fontFamily: appFonts.semiBoldText.fontFamily }}>{item.organisationName}</Text>
    </View>
  </TouchableOpacity>
);

  return (
    <View style={styles.Container}>
      {/* <View style={{ flexDirection: 'row', padding: 8, alignItems: 'center' }}>
        <BackBtn withStraigthLine navigation={props?.navigation} />
        <Text style={styles.title}>Item request</Text>
      </View> */}
      <View style={{ paddingVertical: 25 }}>
        <Text style={styles.inputText}>Select Organisation/User</Text>
         <View>
          
             <FlatList
               data={requestValuesPHACCEPTED}
               renderItem={renderItem}
               keyExtractor={(item) => item.id}
             />
          
            {/* <Picker
      selectedValue={selectedItem}
      onValueChange={(itemValue) => setSelectedItem(itemValue)}
      style={{ height: 50, width: '100%' }}
    >
           {requestValuesPHACCEPTED.length === 0 ? (
            <Text style={{ fontSize: hp(1.5), fontFamily: appFonts.regularText.fontFamily }}>Loading...</Text>
          ) : (

      <Picker.Item label="Select an organisation" value={null} />

      {requestValuesPHACCEPTED.map((item) => (
        <Picker.Item label={item.organisationName} value={item} key={item.id} />
      ))}

    )}

    </Picker> */}


  {/* <Picker
  selectedValue={selectedItem}
  onValueChange={(itemValue) => setSelectedItem(itemValue)}
  style={{ height: 50, width: '100%' }}
>
  {requestValuesPHACCEPTED.length === 0 ? (
    <Picker.Item label="Loading..." value={null} />
  ) : (
    <>
      <Picker.Item label="Select an organisation" value={null} />
      {requestValuesPHACCEPTED.map((item) => (
        <Picker.Item
          label={item.organisationName}
          value={item}
          key={item.id}
        />
      ))}
    </>
  )}
</Picker> */}

    
    
          {selectedItem && (
            <View style={{ paddingVertical: 10, backgroundColor: '#F5F5F5', padding: 10, borderRadius: 5, marginTop: 10 }}>
              <Text style={{ fontSize: hp(1.5), fontFamily: appFonts.regularText.fontFamily }}>Type: {selectedItem.organisationType}</Text>
              <Text style={{ fontSize: hp(1.5), fontFamily: appFonts.regularText.fontFamily }}>No of Employees: {selectedItem.noOfEmployees}</Text>
              <Text style={{ fontSize: hp(1.5), fontFamily: appFonts.regularText.fontFamily }}>No of People: {selectedItem.noOfPeople}</Text>
            </View>
          )}
      </View>

        <View>
          <Text style={styles.inputText}>Name of equipment</Text>
          <View style={styles.selectContainer}>
             <Image source={require('../../../../assets/images/png/bolts.png')} width={20} height={20} />
            <TextInput
              style={styles.selectInput}
              placeholder="Select equipment"
              value={selectedOption}
              onChangeText={(text) => setSelectedOption(text)}
              onFocus={() => setShowOptions(true)}
              editable={false}
            />
            <TouchableOpacity style={styles.selectIcon} onPress={() => setShowOptions(!showOptions)}>
              <Image source={require('../../../../assets/images/png/select.png')} />
            </TouchableOpacity>
          </View>
          {showOptions && (
            
            <View style={styles.optionsContainer}>
<ScrollView 
            style={{flex:1, maxHeight: 200}}
            >
              {options.map((option, index) => (
                <TouchableOpacity key={index} style={[styles.option, {backgroundColor:'white'}]} onPress={() => handleOptionSelect(option.tag)}>
                  <Text>{option.name}</Text>
                </TouchableOpacity>
              ))}
 </ScrollView>
            </View>
           

          )}
        </View>
        <View>
          {/* <Text style={styles.inputText}>Amount</Text>
          <TextInput 
          style={styles.input} 
          placeholder="Enter amount used" 
          value={selectedItem?.noOfPeople?.toString()||''} 
          /> */}

          <CustomLabtracaInputText
                      title="Amount"        
                      placeholder="Enter amount used"
                      onChangeText={(value) => handleInputChange('amount', value)}
                      // onBlur={handleBlur('amount')}
                      value={formData.amount}
                      leftIcon="calculator-outline"
                      // errorMessage={touched.amount && errors.amount ? errors.amount : ''} 
                    />

        </View>
      </View>

      <Pressable style={styles.addButton} onPress={handleWorkTools}
      
      disabled={loading}>
        <Text style={styles.buttonText}>{loading?  'Processing...' : 'Submit'}</Text>
      </Pressable>
      <CustomAlert
                  title={msgTitle}
                  msg={msgDescription}
                  visible={modalVisible}
                  onClose={() => setModalVisible(false)}
                />
    </View>
  );
}

const styles = StyleSheet.create({
  Container: {
    flex: 1,
    paddingHorizontal: 15,
    paddingVertical: 50,
    backgroundColor: '#FFFFFF',
    rowGap: 5,
  },
  title: {
    flex: 1,
    justifyContent: 'center',
    textAlign: 'center',
    fontSize: hp(2),
    fontFamily: appFonts.semiBoldText.fontFamily,
  },
  inputText: {
    fontSize: hp(1.5),
    paddingVertical: 10,
  },
  input: {
    height: 40,
    borderColor: '#E2E4E8',
    borderWidth: 1,
    borderRadius: 3,
    paddingHorizontal: 10,
    marginBottom: 10,
  },
  addButton: {
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 3,
    paddingVertical: 15,
    paddingHorizontal: 10,
    backgroundColor: appColors.primaryGreen,
  },
  buttonText: {
    fontSize: hp(2),
    fontWeight: 'bold',
    color: appColors.white,
    textAlign: 'center',
  },
  textAreaContainer: {
    borderColor: '#E2E4E8',
    borderWidth: 1,
    padding: 5,
    borderRadius: 5,
  },
  textArea: {
    height: 150,
    justifyContent: 'flex-start',
  },
  selectContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 5,
    borderWidth: 1,
    borderColor: '#E2E4E8',
    minWidth: '100%',
  },
  selectInput: {
    flex: 1,
    fontSize: hp(2),
    fontFamily: appFonts.regularText.fontFamily,
    color: '#333',
  },
  selectIcon: {
    marginLeft: 10,
  },
  optionsContainer: {
    position: 'absolute',
    top: '100%',
    left: 0,
    right: 0,
    backgroundColor: 'grey',
    borderColor: '#E2E4E8',
    borderWidth: 1,
    borderRadius: 5,
    marginTop: 5,
    zIndex: 1,
  },
  option: {
    paddingVertical: 10,
    paddingHorizontal: 10,
  },
});

import React, { useCallback, useEffect, useState } from 'react';
import { SafeAreaView, View, Text, TouchableOpacity, StyleSheet, ScrollView, Dimensions, RefreshControl, PixelRatio, ActivityIndicator } from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import { BarChart, LineChart, PieChart, PopulationPyramid, yAxisSides } from "react-native-gifted-charts";
import axios from 'axios';
import styles from '../../../components/utils/styles';
import CustomFlatList from '../../../components/CustomFlatList';
import useAuth from '../../../schema/UseAuth';
import GetUserAssignment from '../../../schema/GetUserAssignment';
import { URL_LINK } from '../../../../config';
import { GET_CONSULTATION_BY_CONSULTATION_ID, GET_PERSON_REQUEST_DETAILS } from '../../../schema/ApiSchema';
import { FlatList } from 'react-native-gesture-handler';
import GetPublicHealthRequestAccepted from '../../../schema/GetPublicHealtRequstAccepted';
import GetIndividualOrganizationAccepted from '../../../schema/GetIndividualOrganizationAccepted';
import KeyboardAvoidingContainer from '../../../components/utils/KeyboardAvoidingContainer';


const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));


const fontScale = PixelRatio.getFontScale();
const Activity = () => {
    const navigation = useNavigation();
    const route = useRoute();
    

const [dataOrder, setDataOrder] = useState([]);
const [error_, setError] = useState(null);
const [isLoading, setIsLoading] = useState(true);
const [selectedData, setSelectedData] = useState(null);
const [requestValues, setRequestValues] = useState([]); 
const [requestValuesConsultation, setRequestValuesConsultation] = useState([]); 
const [data1, setData] = useState([]);
const [acceptAssignedID, setAcceptAssignedID] = useState();
const [acceptAssignmentID, setAcceptAssignmentID] = useState();
const [loading, setLoading] = useState(true);
const [role, setRole] = useState();
const [completedCount, setCompletedCount] = useState(0);
const { token,
  refreshToken,
  patientId,
  email_1,
  userType,    
  verifyTokenFun,} = useAuth(navigation);
    useEffect(() => {
        setRole(userType?.toLowerCase() || '');
        if(role){
        setLoading(false);
        }
      }, [token, patientId, role, userType]);

  const {countAssigned,
    dataStore,} = GetUserAssignment(navigation);
    
    
    const fetchData = async () => {
      const updatedRequestValues = []; 
      const updatedRequestValuesConsultation = [];
      const fetchAssignment = async (assignment, index) => {
        console.log(`Assignment ${index + 1}:`, assignment);
        let assignedID = assignment.assigned.id;
          let assignmentID = assignment.id;
          let isAccepted = assignment.isAccepted;
          console.error('DDDSSS:::: ', isAccepted);
        try {
          const response = await axios.post(
            URL_LINK,
            {
              query: role !== 'phlebotomist'?GET_CONSULTATION_BY_CONSULTATION_ID:GET_PERSON_REQUEST_DETAILS,
              variables: { id: assignment.taskObjectId },
            },
            { headers: { Authorization: `Bearer ${token}` } }
          );
  
          if(role === 'phlebotomist'){
          const data = response.data.data.getRequest[0];   

          const { samepleDropOffDate, balance, pickupDistance, patient, tests, requestStatus, sampleStatus } = data;
          const { firstName, lastName, phoneNumber, email } = patient.user;
          const { name, code } = tests[0];
          
          
          if (name && email && firstName && lastName && phoneNumber && assignedID && assignmentID) {
            
  
            
            if (!updatedRequestValues.find((item) => item.id === index)) {
              updatedRequestValues.push({
                id: index,
                name,
                code,
                amount: balance,
                firstName,
                lastName,
                phoneNumber,
                sampleStatus,
                samepleDropOffDate,
                email,
                pickupDistance,
                detailsVisible: false,
                assignedID:assignedID,
                assignmentID:assignmentID,
                isAccepted:assignment.isAccepted,
                requestStatus:requestStatus,
                tests:tests
              });
            }
          }
        }else{
          const fetchedData = response.data.data.getConsultationById;
          const {attachments, consultationStartedAt, consultationTime, currentSyptoms, doctor, doctorsReport, medicalhistory, otherdetails, patient, prescription, purpose, requestedDoctorType, requestedDuration, status, doctorEarning} = fetchedData;
          const {email, firstName, lastName, phoneNumber} = patient?.user || {};;
          console.error('WAAAAAKKKKKAAAAAAA VVVVVVV :::::: ', patient.user);

          if (!updatedRequestValuesConsultation.find((item) => item.id === index)) {
              
              updatedRequestValuesConsultation.push({
              id: index,
              attachments, 
              consultationStartedAt, 
              consultationTime, 
              currentSyptoms, 
              doctor, 
              doctorsReport, 
              medicalhistory, 
              otherdetails, 
              patient, 
              prescription, 
              purpose, 
              requestedDoctorType, 
              requestedDuration, 
              status, 
              doctorEarning,
              firstName,
              lastName,
              phoneNumber,
              email,             
              detailsVisible: false,
              assignedID:assignedID,
              assignmentID:assignmentID,
              isAccepted:isAccepted,
              requestId:assignment.taskObjectId
                          });

          }

        }





        } catch (err) {
          console.error('Error fetching data:', err.message);
        }finally{
          await sleep(10000);
          setLoading(false);
        }
      };
  
      
      const fetchAllAssignments = async () => {
        for (let i = 0; i < dataStore.length; i++) {
          await fetchAssignment(dataStore[i], i);
        }
      };
  
      await fetchAllAssignments();
  
      
      setRequestValues(updatedRequestValues.filter(item => item.requestStatus === "ONGOING"));
      
      setCompletedCount(requestValues.filter(item => item.requestStatus === "ONGOING").length);
      setRequestValuesConsultation(updatedRequestValuesConsultation);
      
    };
    useEffect(() => {
   
    
      fetchData();
    
      
    
    
    
    }, [navigation, token, countAssigned, dataStore, completedCount]);
    



    const [requestValuesIndividualACCEPTED, setRequestValuesIndividualACCEPTED] = useState([]); 

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
      const fetchedDataIndOrg = publicHealthAccepted?.requests ?? [];
      const fetchedDataIndividual = individualOrganizationAccepted?.requests ?? [];
      console.log("Fetching Accepted Requests:", fetchedDataIndOrg, fetchedDataIndividual);
      if (fetchedDataIndOrg.length === 0 && fetchedDataIndividual.length === 0) return;
    
      console.log("Fetching Accepted Requests:", fetchedDataIndOrg, fetchedDataIndividual);
    
      const mappedData = [...fetchedDataIndOrg, ...fetchedDataIndividual]
        .filter((item) => {
          const status = item.requestStatus;
          return (
            status === "SAMPLE_RECEIVED" ||
            status === "REQUEST_COMPLETED" ||
            status === "TESTING_ONGOING" ||
            status === "REQUEST_CANCELLED" 
            
            
          );
        })
        .map((item) => ({
          id: item.id,
          title: item.facility?.facilityName || "",
          amount: item.total ? `₦${item.total}` : "",
          pickUpAddress: item.samplePickUpAddress,
          requestDate: item.requestDate,
          requestStatus: item.requestStatus,
          detailsVisible: false,
          sampleCollectionDate: item.sampleCollectionDate,
          sampleDropOffDate: item.sampleDropOffDate,
          dropOffDistance: item.dropOffDistance,
          distanceCharge: item.distanceCharge,
          pickupDistance: item.pickupDistance,
          sampleStatus: item.sampleStatus,
          firstName: item.patient?.user?.firstName || "",
          lastName: item.patient?.user?.lastName || "",
          email: item.patient?.user?.email || "",
          phoneNumber: item.patient?.user?.phoneNumber || "",

          testRequest: Array.isArray(item.requestId) ? item.requestId.map((tr) => ({      
            patientAge: tr.patientAge,
            patientName: tr.patientName,
            status: tr.status,
          })) : [],
          tests: Array.isArray(item.requestId) ? item.requestId.map((t) => ({
            name: t.test.name,    
          })) : [],
          
            balance: item.balance,

        }));
    
      console.log("Accepted Requests:", mappedData);
    
      
      setRequestValuesIndividualACCEPTED(mappedData);
      
      
    }catch(err){
      setError(err.message);
    }finally{
      await sleep(3000);
      setLoading(false);
    }
    }, [publicHealthAccepted, individualOrganizationAccepted]);
    
    
    
    
        useEffect(() => {
          const fetchData = async () => {
            await Promise.all([
              updateAcceptedRequests(),
            ]);
          };
        
          fetchData();
        }, [
          
          publicHealthAccepted, 
          individualOrganizationAccepted
          
        ]);
    


const data_chart=[ {value: 230, label: 'MON', frontColor: '#4ABFF4'},
    {value: 180, label: 'TUE', frontColor: '#79C3DB'},
    {value: 200, label: 'WED', frontColor: '#28B2B3'},
    {value: 250, label: 'THU', frontColor: '#34D399'},
    {value: 320, label: 'FRI', frontColor: '#91E3E3'}, 
    {value: 250, label: 'SAT', frontColor: '#34D399'},
    {value: 320, label: 'SUN', frontColor: '#91E3E3'},]




















        
          



        
































    const screenWidth = Dimensions.get('window').width;
    const paddingHorizontal = 5;
    const data = [
        
        
        { id: 1, name:'Sarah Joe', title: 'Covid 19 Qualitative Pro throat swab', amount:'Result pending', time:'06:30 AM', type_person_single:'Single, 2 Persons' },
        { id: 2, name:'Sarah Kent', title: 'Covid 19 Qualitative Pro throat swab', amount:'Result sent', time:'02:30 PM', type_person_single:'Single' },
        { id: 3, name:'Sarah John', title: 'Covid 19 Qualitative Pro throat swab', amount:'Result sent', time:'12:30 AM', type_person_single:'Single, 2 Persons' },
      ];

      const data_can = [
        
        
        { id: 1, name:'Sarah Joe', title: 'Covid 19 Qualitative Pro throat swab', amount:'Request cancelled', time:'06:30 AM', type_person_single:'Single, 2 Persons' },
        { id: 2, name:'Sarah Kent', title: 'Covid 19 Qualitative Pro throat swab', amount:'Request cancelled', time:'02:30 PM', type_person_single:'Single' },
        { id: 3, name:'Sarah John', title: 'Covid 19 Qualitative Pro throat swab', amount:'Request cancelled', time:'12:30 AM', type_person_single:'Single, 2 Persons' },
      ];
    const [selection, setSelection] = useState(1);

    
    
    const renderContent = ()=> {
        switch (selection) {
            case 1:
                if (loading) {
                              return (
                                <View style={styles_.loadingContainer}>
                                  <ActivityIndicator size="large" color="#059669" />
                                </View>
                              );
                            } else if (error_){
                              return (
                                <View style={styles_.errorContainer}>
                                  {/* <FontAwesomeIcon icon={faSearch} size={50} color="#059669" /> */}
                                  <Text style={styles.labelText}>No data found.</Text>
                                </View>
                              );
                            } else {
                return <ScrollView>
                    <View  >
<View style={[{paddingBottom:10, paddingLeft:20, paddingRight:20}]}>
<Text style={[{color:'#8C93A3', fontSize:12, fontWeight:'500', lineHeight:19.2}]}><Text style={[{fontSize:16, color:'#000000', fontWeight:'700', lineHeight:26.6}]}> </Text>{role === 'phlebotomist'? requestValuesIndividualACCEPTED.filter(item => item.requestStatus === "REQUEST_COMPLETED" ).length   +' Request completed':'Consultation completed'}</Text>
</View>

                 
                    {/* {!isLoading ? ( */}
                    <View style={[{paddingBottom:15, paddingLeft:10, paddingRight:10}, ]}>
                   {/* {requestValuesIndividualACCEPTED.filter(item => (item.requestStatus === 'TESTING_ONGOING')).length > 0 &&
                   (<CustomFlatList data={requestValues} data_type={'TESTING_ONGOING'} activeType={'test'} typeOfMethod={'dont'}   showSpecial={true}/>)
                   } */}
    {/* <Text>sss</Text> */}
{requestValuesIndividualACCEPTED.filter(item => (item.requestStatus === 'REQUEST_COMPLETED')).length > 0 &&
                   (<CustomFlatList data={requestValuesIndividualACCEPTED} data_type={'REQUEST_COMPLETED'} activeType={'test'} typeOfMethod={'dont'}   showSpecial={true}/>)
                   }
                   {/* {
                        requestValuesIndividualACCEPTED.filter(item => item.requestStatus === "REQUEST_COMPLETED" || item.requestStatus === "SAMPLE_RECEIVED"  || item.requestStatus === "COMPLETE" ).length > 0 &&
                        (<CustomFlatList data={requestValuesIndividualACCEPTED} data_type={'SAMPLE_RECEIVED'} activeType={'test'} typeOfMethod={'dont'}  showSpecial={true}/>)
                  } */}
                   </View>
        
                    </View>
                </ScrollView>;

        }
            case 2:
                return <Text style={styles.contentText}>Completed Tasks (8)</Text>;
            case 3:
              if (loading) {
                return (
                  <View style={styles_.loadingContainer}>
                    <ActivityIndicator size="large" color="#059669" />
                  </View>
                );
              } else if (requestValuesIndividualACCEPTED.filter(item => item.requestStatus === "REQUEST_CANCELLED" ).length === 0) {
                return (
                  <View style={styles_.errorContainer}>
                    {/* <FontAwesomeIcon icon={faSearch} size={50} color="#059669" /> */}
                    <Text style={styles.errorText}>No request cancelled</Text>
                  </View>
                );
              } else {
                return <ScrollView>

                        <View style={[{paddingBottom:15, paddingLeft:20, paddingRight:20}, ]}>
                        {requestValuesIndividualACCEPTED.filter(item => (item.requestStatus === 'CANCELLED') || (item.requestStatus === 'REQUEST_CANCELLED')).length > 0  ?(<CustomFlatList data={requestValuesIndividualACCEPTED} data_type={'CANCELLED'} />):(
                    <CustomFlatList data={requestValuesIndividualACCEPTED} data_type={'REQUEST_CANCELLED'} activeType={'REQUEST_CANCELLED'} />)}
                    </View>
                </ScrollView>;
        }
            default:
                return null;
        }
    };

    const [refreshing, setRefreshing] = useState(false);

const handleRefresh = async () => {
    setRefreshing(true);
    
    setRefreshing(false);
  };
    return (
  
      
  
  <KeyboardAvoidingContainer style={styles.containerBackGround}>
     <View style={[styles.containerBackGround,{backgroundColor:'#FFFFFF'}]}>
             {/* <View style={[styles.container,{backgroundColor:'#FFFFFF'}]}> */}
            
     
               {/* Tabs */}
                <View 
                           style={[{paddingLeft:20, paddingRight:20, alignContent:'center',  justifyContent:'center'}]}
                           >
               <View style={[styles_.tabContainer,{backgroundColor:'#FFFFFF'}]}>
                 <TouchableOpacity
                   style={[
                     styles_.tab,
                     selection === 1  ? styles_.activeTab : null,
                   ]}
                   onPress={() => {
                    
                    setSelection(1);
                    
                     
                   }}
                 >
                   <Text
                     style={[
                       styles_.tabText,
                       selection === 1  ?  styles_.activeTabText : null,
                     ]}
                   >
                    Complete
                    {/* ({requestValuesIndividualACCEPTED.filter(item =>item.requestStatus === "REQUEST_ACCEPTED" || item.requestStatus === "SAMPLE_COLLECTED"  ).length}) */}
                   </Text>
                 </TouchableOpacity>
     
                 
                 <TouchableOpacity
                   style={[
                     styles_.tab,
                     selection === 3 ? styles_.activeTab : null,
                   ]}
                   onPress={() => {
                    
                    setSelection(3);
                     
                   }}
                 >
                   <Text
                     style={[
                       styles_.tabText,
                       selection === 3 ? styles_.activeTabText : null,
                     ]}
                   >
                     Cancelled 
                     {/* ({requestValuesPHACCEPTED.filter(item => item.requestStatus === "REQUEST_ACCEPTED" || item.requestStatus === "SAMPLE_COLLECTED" ).length}) */}
                     {/* ({requestValuesACCEPTED.length}) */}
                   </Text>
                 </TouchableOpacity>
               </View>
     </View>
               {/* Separator Line */}
               <View style={styles.line} />
       
            <View style={styles.contentContainer}>
                {renderContent()}
            </View>
            {/* </View> */}
            </View>
            </KeyboardAvoidingContainer>
            
    );
}

const styles_ = StyleSheet.create({
    container: {
      flex: 1,
      padding: 20,
      backgroundColor: '#f8f8f8',
    },
    scrollContainer: {
      paddingHorizontal: 10,
      alignItems: 'center',
    },
    chart: {
      alignSelf: 'center',
    },titleText: {
      fontSize: 25/fontScale,
      fontWeight: '600',
      color: '#022920',
      lineHeight: 37,
      paddingLeft: 10,
      paddingBottom: 20,
    },
    tabContainer: {
      flexDirection: 'row',
      justifyContent: 'space-around',
      alignItems: 'center',
      backgroundColor: '#E0E0E0',
      borderRadius: 10,
      marginBottom: 5,
    },
    tab: {
      flex: 1,
      paddingVertical: 15,
      alignItems: 'center',
      borderTopLeftRadius: 10,
      borderTopRightRadius: 10,
      borderColor: 'black',
      borderWidth: 1,
    },
    activeTab: {
      backgroundColor: '#059669',
    },
    inactiveTab: {
      backgroundColor: '#D3D3D3',
    },
    tabText: {
      color: '#000',
      fontSize: 16/fontScale,
    },
    activeTabText: {
      color: '#fff',
      fontWeight: 'bold',
    },
    line: {
      width: '100%',
      height: 2,
      backgroundColor: '#059669',
    },
    loadingContainer: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
    },
    errorContainer: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
    },
    errorText: {
      fontSize: 18,
      color: '#333',
      marginTop: 10,
    },
  });

export default Activity;


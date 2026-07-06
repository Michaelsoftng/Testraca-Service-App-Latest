import { useQuery } from "@apollo/client";
import { GET_REQUEST_DISTANCE, GET_REQUEST_DISTANCE_PH } from "./ApiSchema";
import { Text, View, StyleSheet, Dimensions, PixelRatio } from "react-native";
import Icon from 'react-native-vector-icons/MaterialIcons';
import useAuth from "./UseAuth";
import { useNavigation } from "@react-navigation/native";
import axios from "axios";
import { URL_LINK } from "../../config";
import { useEffect, useState } from "react";

const { height: deviceHeight } = Dimensions.get('window');




const fontScale = PixelRatio.getFontScale();

const GetDistanceForPhlebRequest = ({ item, phlebotomistId, ph }) => {
const navigation = useNavigation();

const [data, setData] = useState(0);

    const { token,
        refreshToken,
        patientId,
        email_1,
        userType,    
        verifyTokenFun,} = useAuth(navigation);
    // const { data, loading, error } = useQuery(GET_REQUEST_DISTANCE, {
    //   variables: {
    //     phlebotomistId,
    //     requestId: item.requestId,
    //   },
    // });
  
    // if (loading) return <Text>Loading...</Text>;
    // if (error) return <Text>Error: {error.message}</Text>;

    const fetchDistance = async () => {
  
        if (token) {
          try {
            const response = await axios.post(
              URL_LINK,
              {
                query: ph === true ? GET_REQUEST_DISTANCE_PH : GET_REQUEST_DISTANCE,
                variables: {
                  phlebotomistId,
                  requestId: item.requestId,
                },
              },
              {
                headers: {
                  Authorization: `Bearer ${token}`,
                },
              }
            );
            
            // const key = ph ? 'getPublicRequestDistance' : 'getRequestDistance';
            // const { [key]: distance } = response?.data?.data;
              // console.log('INDIVIDUAL ZZZZZZZZZZZZZZZZZZZZZ', getRequestsQueue);
    
              setData( ph === true ? response?.data?.data?.getPublicRequestDistance: response?.data?.data?.getRequestDistance);
       
          } catch (err) {
            console.log('Error fetching data:', err.message);
            // setError(err.message);
          } finally {
            // setIsLoading(false);
          }
        }
      };
  
        useEffect(() => {
            fetchDistance();
        }, [token]);
    return (
      <View style={[styles.row, { paddingTop: 10 }]}>
        <View style={styles.column}>
          <Text style={[styles.timeText, { fontWeight: '900', fontSize: 12 / fontScale }]}>
            <Icon name="place" size={15} color="#059669" /> Pick-up distance
          </Text>
        </View>
        <View style={styles.column}>
          <Text style={[styles.timeText, { fontStyle: 'italic', fontWeight: '700', fontSize: 12 / fontScale }]}>
            {data} KM
          </Text>
        </View>
      </View>
    );
  };

  const styles = StyleSheet.create({
    container: {
      padding: 10,
      backgroundColor:'white',
    },
    card: {
      backgroundColor: '#fff',
      borderRadius: 8,
      borderWidth:0,
      elevation: 1,
      marginVertical: 8,
      padding: 10,
    },
    cardSection: {
      marginBottom: 10,
    },
    acceptButton: {
      backgroundColor: '#059669',
      padding: 10,
      borderRadius: 5,
      alignItems: 'center',
    },
      sampleCollectedButton: {
      backgroundColor: 'teal', //#059669
      padding: 10,
      borderRadius: 5,
      alignItems: 'center',
    },
      sampleDroppedButton: {
      backgroundColor: 'green', //#059669
      padding: 10,
      borderRadius: 5,
      alignItems: 'center',
    },
    buttonText: {
      color: '#fff',
      fontWeight: 'bold',
    },
    row: {
      flexDirection: 'row',
      justifyContent: 'space-between',
    },
    actionButton: {
      padding: 10,
      backgroundColor: '#2196F3',
      borderRadius: 5,
      flex: 0.48,
      alignItems: 'center',
    },
    actionText: {
      color: '#fff',
      fontWeight: 'bold',
    },
    detailsCard: {
      marginTop: 10,
      padding: 10,
      backgroundColor: '#f0f0f0',
      borderRadius: 5,
    },
    detailsText: {
      color: '#333',
    },
    column: {
      
      // flex: 1,
      // marginHorizontal: 5,
    },
    timeText:{
      color:'#8C93A3',
      fontSize:13/fontScale,
      fontWeight:'600',
      lineHeight:19.2,
    },
    text: {
      fontSize: 16/fontScale,
      marginBottom: 10,
      color: '#495057',
    },
    textSmall: {
      fontSize: 16/fontScale,
      marginBottom: 10,
      fontWeight:'600',
      color: '#000',
    },
    card_: {
      padding: 10,
      marginBottom: 10,
      backgroundColor: '#ffffff',
      borderRadius: 5,
      shadowColor: '#000',
      shadowOpacity: 0.1,
      shadowRadius: 3,
      elevation: 2,
    },
    titleText: {
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
    },  loadingContainer: {
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
  
  export default GetDistanceForPhlebRequest;
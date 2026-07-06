import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import Icon from 'react-native-vector-icons/MaterialIcons';
import DateTimePicker from '@react-native-community/datetimepicker'; 
import KeyboardAvoidingContainer from '../../components/utils/KeyboardAvoidingContainer';
import styles_ from '../../components/utils/styles';
import CustomButton from '../../components/CustomButton';
import { Formik } from 'formik';
import CustomCardWard from '../../components/CustomCardWard';
import SuccessSvg from '../../assets/images/svg-icon/Success';
import Edit_Svg from '../../assets/images/svg-icon/edit-2';
import CardList from '../../components/CardList';
import AddIcon from '../../assets/images/svg-icon/add';
import TimerStart from '../../assets/images/svg-icon/timer-start';
import Location from '../../assets/images/svg-icon/location';
import CustomLocationInput from '../../components/CustomLocationInput';
import { useNavigation, useRoute } from '@react-navigation/native';
import formatNaira from '../../components/FormatNaira';
import useGetAllCharges from '../../schema/GetAllCharges';
import GetUserDetails from '../../schema/GetUserDetails';
import { useMutation } from '@apollo/client';
import { CREATE_REQUEST } from '../../schema/ApiSchema';
import useAuth from '../../schema/UseAuth';
import axios from 'axios';
import { URL_LINK } from '../../../config';


const RequestTestPage = () => {
  const navigation = useNavigation();
  const route = useRoute();
  const { token_1,
    refreshToken_1,
    patientId_1,
    email_1,    
    verifyTokenFun,} = useAuth(navigation);
  const {
    testID, testName, currentAddress, latitude, 
    longitude, patientId, token, facilityId, facilityName, facilityType, price, distance
  } = route.params || {};


  const {    chargesData,
    fetchChargesData  } = useGetAllCharges(navigation);

    const { email,
      firstName,
      lastName,
      streetAddress,
      city,
      state,
      country, 
      postal,
      latitude_,
      longitude_,
      dateOfBirth,    
    pId,  bankInfomation,
    online,
    phlebotomistEarning_} = GetUserDetails(navigation);

  const [time, setTime] = useState(new Date());
    const [showTimePicker, setShowTimePicker] = useState(false);
    
    
    const [date, setDate] = useState(null);
    const [showDatePicker, setShowDatePicker] = useState(false);
    const [serviceFee, setServiceFee] = useState(1000);
    const [totalAmount, setTotal] = useState(0);
  
    let chergeFee = 1000;
    const formatDate = (date) => {
      const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
      return date.toLocaleDateString(undefined, options);
    }


  const handleContinue = () => {

    
    navigation.navigate('select_payment_type', {
      testID, testName, currentAddress, patientId, token, facilityId, facilityName, facilityType, price, distance, quantity, serviceFee, 
    });
    
        
      
    };
    
    
    
    
    



  const [isPasswordVisible, setPasswordVisible] = useState(false);
  const [isFocused, setFocused] = useState(false);

  const [packageType, setPackageType] = useState('Single'); 
    const [quantity, setQuantity] = useState(1); 

    const handleIncrement = () => {
        setQuantity((prevQuantity) => prevQuantity + 1);
        setServiceFee(chergeFee * (quantity+1));
    };

    const handleDecrement = () => {
        setQuantity((prevQuantity) => Math.max(1, prevQuantity - 1));
        if(quantity !== 1){
        setServiceFee(serviceFee - chergeFee);
        }
    };
  
  const getTomorrow = () => {
    const today = new Date();
    const tomorrow = new Date(today);
    tomorrow.setDate(today.getDate() + 1); 

    const daysOfWeek = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

    
    const formattedDate = tomorrow.toISOString().split('T')[0]; 

    
    const dayName = daysOfWeek[tomorrow.getDay()];

    return { formattedDate, dayName, tomorrow };
  };
  const { formattedDate, dayName, tomorrow } = getTomorrow();

  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  const handleSubmit22 = async () => {
    
    console.info('P ID:: ',testID);
    console.info('P FAc:: ',facilityId);
    try {
       
       const isoString = date ? date.toISOString():tomorrow.toISOString(); 
       const [datePart, timePart] = isoString.split("T");
     
       
       const microseconds = Math.floor(Math.random() * 1000000).toString().padStart(6, '0');
     
       
       const formattedDate = `${datePart} ${timePart.slice(0, -1)}.${microseconds}+00`;

      const response = await axios.post(URL_LINK, {  
        query: CREATE_REQUEST,
        variables: {
          "patient": pId,
            "samplePickupAddress": currentAddress,
            "sampleCollectionDate": formattedDate,
            "samplePickupLatitude": latitude, 
            "samplepickupLongitude": longitude,
            "tests": [
                
                {
                "facility":  facilityId,  
                "test":      testID 
                }
        
            ],
            "total": (price*quantity + serviceCharge + phlebotomistCharge + (distance * distanceChargePerDistance))
        },
        
        
        
        
        
        
        
        
        
        
        
        
        
        
        
      }, 
      {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
          
        },
      });
      
      
      
      
      
      
      
      let request_id = response.data.data.CreateRequest.request.id;
      
        navigation.navigate('select_payment_type', {
              testID, testName, currentAddress, patientId, token, facilityId, facilityName, facilityType, price, distance, quantity, serviceFee, request_id
            });
      
    } catch (error) {
      console.error(error.message);
      
    }
  };
  return (
    <Formik
      initialValues={{ cardNumber: '', expiryDate: '', cvv: '', pin: '', date: '' }}
      validationSchema={''} 
      onSubmit={ async (values) => {
        
        
        
        
        
        
        
        
        
        
        
        
        
        
        


        const handleCreateUser = async () => {
          console.info('TOKEN ', token);
          try {
            
            const isoString = date ? date.toISOString():tomorrow.toISOString(); 
            const [datePart, timePart] = isoString.split("T");
          
            
            const microseconds = Math.floor(Math.random() * 1000000).toString().padStart(6, '0');
          
            
            const formattedDate = `${datePart} ${timePart.slice(0, -1)}.${microseconds}+00`;

            
            
            
            
            
            
            
            
            
            
            
            
                      
            
                  
            

            

            const response = await axios.post(
              URL_LINK,
              {
                query: CREATE_REQUEST, 
                variables: {
                  patient:pId,
                  samplePickupAddress: currentAddress,
                  sampleCollectionDate:formattedDate,
                  samplePickupLatitude: latitude,
                  samplepickupLongitude:longitude,
                    tests: [
                        {
                          facility: facilityId,
                          test: testID
                        }
                        
                    ]
                    
                },          
              },
              {
                headers: {
                  Authorization: `Bearer ${token}`,
                  'Content-Type': 'application/json'
                },
              }
            );
            console.log('CCCCCXXXXXXXXXXXX ', response);

            console.log("Test Requested:", response);
            console.log("Test Requested:", response.data);
            console.log("Test Requested:", response.data.CreateRequest);
            
            
            
            console.log("Mutation successful:", response.data);
          } catch (err) {
            console.error("Mutation error:", err);
            console.error("Mutation error:", err.message);
          
            
            
            
          }
        };

        await handleCreateUser(); 


      }}
    >
      {({ handleChange, handleBlur, handleSubmit, values, errors, touched }) => (
        <KeyboardAvoidingContainer style={styles_.containerBackGround}>
          <View style={[styles.container]}>
          {/* <View style={{ paddingLeft: 20, paddingRight: 20, paddingTop: 5, paddingBottom: 5 }}> */}
                
                    <View style={styles.cardInfo}>
                        <MaterialIcons name="info" size={24} color="#1B4ACB" style={styles.icon} />
                        <Text style={styles.cardText}>
                        You will be notify 30 mins before sample collection.
                        </Text>
                        </View>
              
                 
                        <View style={[{paddingLeft:0, paddingRight:0, paddingBottom:8}]}>
        {/* <Text style={styles_.titleCustom}>Current location</Text> */}
        <View style={styles.cardInfo_}>
                        <MaterialIcons name="info" size={24} color="#022C22" style={styles.icon} />
                        <Text style={styles.cardText_}>
                        {'Your Test day will be '+formattedDate+' ('+dayName+')'}
                        </Text>
                        </View>
      
    </View>
   
            

    <View style={[{paddingLeft:0, paddingRight:0, paddingBottom:8}]}>
      {/* Date Picker */}
      {/* <Text style={styles.label}>Select Date:</Text> */}
      <TouchableOpacity
        onPress={() => setShowDatePicker(true)}
        style={[
          styles.datePickerButton,
          { borderColor: '#ccc', borderWidth: 1, backgroundColor: '#f0f0f0' }
        ]}
      >
        <Text style={styles.datePickerText}>
          {date ? formatDate(date) : 'Reschedule Date'}
          {/* {console.error(formatDateWithMicroseconds(date))} */}
        </Text>
      </TouchableOpacity>

      {showDatePicker && (
        <DateTimePicker
          value={date || new Date()}
          mode="date"
          display="default"
          minimumDate={new Date()} 
          onChange={(event, selectedDate) => {
            setShowDatePicker(false);
            if (selectedDate) setDate(selectedDate);
          }}
        />
      )}
    </View>
    <View style={[
      styles_.cardAccountRequest, 
      styles_.cardElevatedOrder
      ]}>

    <View style={[styles_.cardAccountRequestInner, {backgroundColor:'#fff'}
      
       ]}>
          <Text  style={{
      color: '#0F1D40',
      fontSize: 16,
      fontWeight: '700',
      paddingLeft: 5,
      paddingRight: 5,
      flexShrink: 1,        
      flexWrap: 'wrap',     
    }}
                 numberOfLines={1}
    ellipsizeMode="tail"
                 >Requesting</Text>
                 <CustomCardWard
                    colorBack="#FFFFFF"                    
                    tittle={testName}
                    
                    
                    centerText= {formatNaira(price)}
                    
                    
                  />

                  {/* <Text>GGG GHAGHAGHA JHAJJAHJ</Text> */}

</View>


{/* Begins */}

<View style={[styles_.cardAccountRequestInner, styles_.cardElevatedOrder]}>
    <Text style={[{color:'#0F1D40', fontSize:16, fontWeight:'700', paddingLeft:10}]}>Package(s)</Text>

        <View style={styles.columnQuantity}>
                <TouchableOpacity onPress={handleDecrement}>
                    <Icon name="remove-circle" size={24} color="#059669" />
                </TouchableOpacity>
                <TextInput
                editable={false} 
                    style={styles.quantityInput}
                    value={`for ${quantity} ${quantity > 1 ? 'Persons' : 'Person'}`}
                    onChangeText={(text) => {
                        const numericValue = parseInt(text.replace(/\D/g, '')); 
                        setQuantity(Math.max(1, numericValue || 1));
                        
                    }}
                    textAlign="center"
                    />
                <TouchableOpacity onPress={handleIncrement}>
                    <Icon name="add-circle-outline" size={24} color="#059669" />
                </TouchableOpacity>
            </View>

        </View>
{/* Ends */}

<View style={[styles_.cardAccountRequestInner, styles_.cardElevatedOrder, {backgroundColor:'#3A4662'}]}>
<View style={styles.row}>
                    <View style={styles.column}>
                        <Text style={styles.payMent}>
                        Test amount
                        </Text>
                    </View>
                    <View 
                    
                    >
                        <Text style={[styles.payMent, {alignItems:'flex-end', justifyContent:'flex-end', alignContent:'flex-end', paddingRight:5}]}>{formatNaira(price*quantity)}</Text>
                    </View>
    </View>
    
    <View style={styles.row}>
                    <View style={styles.column}>
                        <Text style={styles.payMent}>
                        Service charge
                        </Text>
                    </View>
                    <View 
                    
                    >
                        <Text style={[styles.payMent, {alignItems:'flex-end', justifyContent:'flex-end', alignContent:'flex-end', paddingRight:5}]}>{formatNaira(serviceCharge)}</Text>
                    </View>
    </View>
    <View style={styles.row}>
                    <View style={styles.column}>
                        <Text style={styles.payMent}>
                        Distance charge <Text style={[{fontSize:9, fontWeight:'500'}]}>{distance ? `(${distance.toFixed(2)} KM)` : '(N/A)'}</Text>
                        </Text>
                    </View>
                    <View 
                    
                    >
          <Text style={[styles.payMent, {alignItems:'flex-end', justifyContent:'flex-end', alignContent:'flex-end', paddingRight:5}]}>{formatNaira(distance * distanceChargePerDistance)}</Text>
                    </View>
    </View>
    <View style={styles.row}>
                    <View style={styles.column}>
                        <Text style={styles.payMent}>
                        Phlebotomist charge
                        </Text>
                    </View>
                    <View 
                    
                    >
                        <Text style={[styles.payMent, {alignItems:'flex-end', justifyContent:'flex-end', alignContent:'flex-end', paddingRight:5}]}>{formatNaira(phlebotomistCharge)}</Text>
                    </View>
    </View>

    <View style={[{paddingLeft:5, paddingRight:5}]}>
    <View style={styles_.line} />
    </View>
    <View style={styles.row}>
                    <View style={styles.column}>
                        <Text style={[styles.payMent, {fontSize:15, fontWeight:'800', lineHeight:23.4}]}>
                        Total
                        </Text>
                    </View>
                    <View 
                    
                    >
                        <Text style={[styles.payMent, {alignItems:'flex-end', justifyContent:'flex-end', alignContent:'flex-end', paddingRight:5,fontSize:15, fontWeight:'800', lineHeight:23.4}]}>{formatNaira(price*quantity + serviceCharge + phlebotomistCharge + (distance * distanceChargePerDistance))}</Text>
                    </View>
    </View>
</View>


</View>




            <CustomButton
              backgroundColor={
                  styles_.loginScreenButtonEnable
              }
              children={
                <Text
                  style={
                      styles_.loginTextEnable
                  }
                >
                  Continue
                </Text>
              }
              handlePress={handleSubmit22} 
            />
            {/* Schedule test */}
   
   <Text>
    {/* {error?.cause} */}
   </Text>

          </View>
        </KeyboardAvoidingContainer>
      )}
    </Formik>
  );
};

const styles = StyleSheet.create({
    butt:{
        color:'#059669',
        backgroundColor:'#FFFFFF',
    borderWidth:1,
    borderColor:'#5C657D',
    justifyContent:'center',
    borderRadius:4,
    alignItems:'center'
    },
    centerText:{
        justifyContent:'center',
        textAlign:'center',        
        color:'#525C76',
        fontWeight:'800',
        fontSize:16,
        
        paddingTop:10,
        paddingBottom:10,
        alignItems:'center'
      },
  container: {
    flex: 1,
    padding: 10,
    paddingTop: 0,
    backgroundColor: '#FFFFFF',
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-evenly',
  },
  column: {
    flex: 1,
    marginHorizontal: 5,
  },
  label: {
    fontSize: 13,
    fontWeight: '700',
    marginVertical: 8,
    lineHeight: 20.2,
    color: '#525C76',
  },
  input: {
    borderWidth: 1,
    borderColor: '#E2E4E8',
    height: 48,
    padding: 10,
    borderRadius: 5,
    marginBottom: 12,
    fontSize: 18,
    fontWeight: '800',
    backgroundColor: '#fff',
    textAlign: 'center',
    letterSpacing: 2,
  },
  activeInput: {
    borderColor: 'green', 
  },
  confirmButton: {
    backgroundColor: '#3498db',
    padding: 15,
    borderRadius: 5,
    alignItems: 'center',
    marginVertical: 20,
  },
  confirmButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
  keypadContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
  },
  keyButton: {
    width: '30%',
    margin: 5,
    paddingVertical: 10,
    backgroundColor: '#e0e0e0',
    alignItems: 'center',
    borderRadius: 5,
  },
  keyButtonZero: {
    width: '63%', 
  },
  keyButtonText: {
    fontSize: 20,
    fontWeight: '600',
  },
  cardInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#D3E5FE',
    borderColor: '#1B4ACB',
    borderWidth: 1,
    borderRadius: 4,
    padding: 10,
    marginVertical: 10,
  },
  cardInfo_: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFF',
    borderColor: '#022C22',
    borderWidth: 1,
    borderRadius: 4,
    padding: 10,
    marginVertical: 10,
  },
  icon: {
    marginRight: 10, 
  },
  cardText: {
    color: '#1B4ACB',
    fontSize: 12,
    fontWeight:'400',
    flex: 1, 
  },
  cardText_: {
    color: '#022C22',
    fontSize: 12,
    fontWeight:'800',
    flex: 1, 
  },

  card: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 15,
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    marginBottom: 10,
    backgroundColor: '#fff',
    justifyContent: 'space-between',
},
column_: {
    flex: 1,
    justifyContent: 'center',
},
columnQuantity: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
},
label_: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
},
radioButton: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginVertical: 5,
},
radioText: {
    fontSize: 14,
    color: '#000000',
    marginLeft: 0,
    fontWeight:'700',
},
quantityInput: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 5,
    width: 220,
    paddingVertical: 5,
    marginHorizontal: 5,
    fontSize: 16,
    color: '#333',
},
payMent:{
    color:'#FAFAFB',
    fontSize:14,
    fontWeight:'700',
    lineHeight:23.4,
},
datePickerButton: {
    padding: 5,
    borderWidth: 0,
    borderColor: '#ddd',
    borderRadius: 5,
    marginBottom: 2,
    backgroundColor: '#fff',
    justifyContent: 'center',
    alignItems: 'center',
},
datePickerText: {
    fontSize: 16,
},
});

export default RequestTestPage;

import { useNavigation } from '@react-navigation/native'
import { Dimensions, StyleSheet, Text, View } from 'react-native'
import React, { useState } from 'react'
import { GestureHandlerRootView } from 'react-native-gesture-handler'
import KeyboardAvoidingContainer from '../../components/utils/KeyboardAvoidingContainer'
import { SafeAreaView } from 'react-native-safe-area-context'
import styles from '../../components/utils/styles'
import formatNaira from '../../components/FormatNaira'
import { PieChart } from 'react-native-gifted-charts'
import CustomAccountMenuCard from '../../components/CustomAccountMenuCard'
import ArrowRight from './../../assets/images/svg-icon/arrow-right.svg';
import Support from './../../assets/images/svg-icon/support.svg';
import PasswordSvg from './../../assets/images/svg-icon/password.svg';
import Audit from './../../assets/images/svg-icon/record.svg';
import PaymentRec from './../../assets/images/svg-icon/cash.svg';
import LogoutSvg from './../../assets/images/svg-icon/logout.svg';
import CardSvg from './../../assets/images/svg-icon/navigate.svg';
import CustomButton from '../../components/CustomButton'
import { MaterialIcons } from '@expo/vector-icons'
import CustomLabtracaInputText from '../../components/CustomLabtracaInputText'
import { TouchableOpacity } from '@gorhom/bottom-sheet'


const options = [
    { id: '1', label: 'Pay in office' },
    { id: '2', label: 'Pay online' },

  ];

  const CustomCard = ({ data, selectedDuration, onSelectDuration }) => {
    return (
      <TouchableOpacity 
        style={[
          styles_.card1, 
          selectedDuration === data.label ? styles_.selectedDuration : null
        ]}
        onPress={() => {
          onSelectDuration(data.label)
          console.info(data.label);
        }
      }
      >
        <View style={styles_.row1}>
          <View style={styles_.column1}>
            <Text 
              style={[
                styles_.labelText, 
                { fontSize: 12 },
                selectedDuration === data.label && { color: '#fff', fontSize: 15, fontWeight: 'bold', alignContent:'flex-start', alignItems:'flex-start', justifyContent:'flex-start' }
              ]}
            >
              {data.label}
            </Text>
          </View>
    
        </View>
      </TouchableOpacity>
    );
  };
const RemitPayment = () => {
    const navigation = useNavigation();
    const [selectedOption, setSelectedOption] = useState(null);
    const [selectedDuration, setSelectedDuration] = useState(null);
    const [selectedDate, setSelectedDate] = useState(null);
    const [selectedAmount, setSelectedAmount] = useState(null);

    const handleSelectDuration = (duration) => {
        setSelectedDuration(duration);
      };
      const handleSubmit = async () => {
        console.log('Remit cash');
        // navigation.navigate('remit_payment', {});
      }
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
    <KeyboardAvoidingContainer style={styles.containerBackGround}>
    <SafeAreaView style={styles.containerOrder}>
    
    <Text style={styles.titleText}>{"Amount to be remitted"}</Text>
    <View style={styles_.cardInfo}>
                        <MaterialIcons name="info" size={24} color="#1B4ACB" style={styles.icon} />
                        <Text style={styles_.cardText}>
                         Please note there could be a delay of up to 24hrs before it reflects in your balance.
                        </Text>
                        </View>
                        <View style={styles.sizeSpaceBottom}></View>
          <CustomLabtracaInputText
            title="Amount"        
            placeholder="Enter amount"
            // keyboardType={}
            // onChangeText={handleChange('email')} // Changed to Formik's handleChange
            // onBlur={handleBlur('email')}
            // value={values.email}
            // leftIcon="mail-outline"
            // errorMessage={touched.email && errors.email ? errors.email : ''} // Show error message from Formik
          />
          {options.map((item) => (
        <CustomCard 
          key={item.id}
          data={item}
          selectedDuration={selectedDuration}
          onSelectDuration={handleSelectDuration}
        />
        
      ))}

<View style={{paddingTop:10}}/>
<CustomButton
            backgroundColor={styles.loginScreenButtonEnable}
            children={
              <Text style={styles.loginTextEnable}>{'Remit cash payment'}</Text>
            }

            // 
            handlePress={
              handleSubmit
            } // Formik's handleSubmit
          />
    </SafeAreaView>
    </KeyboardAvoidingContainer>
    </GestureHandlerRootView>
  )
}

export default RemitPayment;

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
  },
  // container: {
  //   padding: 10,
  // },
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

  timeText:{
    color:'#8C93A3',
    fontSize:13,
    fontWeight:'600',
    lineHeight:19.2,
  },
  column: {
    flex: 1,
    marginHorizontal: 5,
  },
// scrollContainer: {
//   paddingHorizontal: 10,
//   alignItems: 'center',
// },
// chart: {
//   alignSelf: 'center',
// },
// container: {
//     // flex: 1,
//     justifyContent: 'center',
//     alignItems: 'center',
//     backgroundColor: '#f8f8f8',
//   },
//   card: {
//     backgroundColor: '#071971', // Blue background
//     borderRadius: 10,
//     padding: 20,
//     // paddingTop:150,
    
//     width: '100%',
//     alignItems: 'center',
//     shadowColor: '#000',
//     shadowOffset: { width: 0, height: 2 },
//     shadowOpacity: 0.2,
//     shadowRadius: 4,
//     elevation: 5, // Adds shadow for Android
//   },
  amountText: {
    color: '#fff',
    fontSize: 36,
    fontWeight: '700',
    marginBottom: 5,
  },
  commissionText: {
    color: '#fff',        
    fontSize: 12,
    fontWeight: '600',
  },
  rowTwo: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    width: '90%',
  },
  cardTwo: {
    backgroundColor: '#F5F6F7', // Blue background
    borderRadius: 10,
    paddingTop: 20,
    paddingBottom: 20,
    paddingLeft:10,
    width: '45%', // Each card takes 45% of the row width
    // alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 5, // Adds shadow for Android
  },
  largeText: {
    color: '#000000',
    fontSize: 28,
    fontWeight: '700',
    marginBottom: 10,
  },
  smallText: {
    color: '#8C93A3',
    fontSize: 12,
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
    width:Dimensions.get('window').width  - 2 * 20
  },
  cardText: {
    color: '#1B4ACB',
    fontSize: 12,
    fontWeight:'400',
    flex: 1, // Allows text to occupy remaining space
  },
  checkboxContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 10,
    marginBottom: 20,
  },
  checkboxLabel: {
    marginLeft: 8,
    fontSize: 14,
    color: '#333',
  },
  card1: {
    width: '100%',
    padding: 20,
    borderRadius: 10,
    backgroundColor: '#F6F6F6',
    borderColor: '#E2E4E8',
    borderWidth: 1,
    elevation: 3,
    alignItems: 'center',
    justifyContent: 'center',
    marginVertical: 10,
  },
  uploadContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  uploadText: {
    fontSize: 16,
    color: '#888',
    marginLeft: 10,
  },
  backColor: {
    backgroundColor: '#F6F6F6',
  },
  labelText: {
    color: '#525C76',
    fontWeight: '800',
    fontSize: 14,
    lineHeight: 19.2,
    paddingBottom: 5,
  },
  row1: {
    flexDirection: 'row', // Aligns the children horizontally
    justifyContent: 'space-between', // Adds space between buttons
    width: '100%', // Ensures the row takes up the full width
  },
  selectedDuration: {
    backgroundColor: '#059669',
    color:'#fff'
},
  column1: {
    flex: 1, // Ensures buttons take equal space
    alignItems: 'center', // Centers buttons horizontally within the column
    marginHorizontal: 5, // Adds space between buttons
  },
  button: {
    padding: 10,
    backgroundColor: '#059669', // Green background for buttons
    borderRadius: 5,
    justifyContent: 'center',
    alignItems: 'center',
    width: '100%', // Ensures buttons fill available width
  },
  buttonPrev: {
    padding: 10,
    borderWidth:1.5,
    borderColor: '#059669', // Green background for buttons
    borderRadius: 5,
    justifyContent: 'center',
    alignItems: 'center',
    width: '100%', // Ensures buttons fill available width
  },
  buttonText1: {
    color: '#fff',
    fontSize: 16,
  },
  buttonTextPrev: {
    color: '#059669',
    fontSize: 16,
  },
});
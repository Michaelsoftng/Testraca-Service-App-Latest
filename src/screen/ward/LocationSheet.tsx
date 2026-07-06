import React, { useState } from 'react';
import { MaterialIcons } from '@expo/vector-icons';
import { GestureHandlerRootView, ScrollView } from 'react-native-gesture-handler';
import { StyleSheet, View, Button, Text } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import BottomSheet, { TouchableOpacity } from '@gorhom/bottom-sheet';
import CustomSearchInput from '../../components/CustomSearchInput';
import CustomCardWard from '../../components/CustomCardWard';
import SuccessSvg from '../../assets/images/svg-icon/Success';
import Location from '../../assets/images/svg-icon/location';

import styles_ from '../../components/utils/styles';

import CustomLocationInput from '../../components/CustomLocationInput';
import CustomInputDropdown from '../../components/CustomInputDropdown';
import CustomButton from '../../components/CustomButton';

export default function LocationSheet() {

    const navigation = useNavigation();  
    const handleContinue = () => {
      navigation.navigate('select_slot', { Data: '', data_tittle:'Select Facilities'})
          
        
      };
    const data = ["FCT", "Abia", "Kano", "Kaduna", "Ibadan", "Lagos"];

    const handleSelectItem = (item) => {
        console.log("Selected Item:", item);
    };

    const renderItem = ({ item }) => (
      <View>
        <Text>{item.title}</Text>
      </View>
    );
  return (
                
    <ScrollView showsVerticalScrollIndicator={false}>

<View style={styles.sheetContent}>
            

            <View style={{ paddingLeft: 20, paddingRight: 20, paddingTop: 5, paddingBottom: 5 }}>
                  <CustomCardWard
                    colorBack="#F5F6F7"                    
                    tittle="COVID 19 Qualitative Prc throat swab"
                    timeContent="Available between 6am - 9pm"
                    leftIcon={<SuccessSvg width={15} height={15} />}
                    centerText="NGN 8,000"
                    
                    onPress={() => console.log('Card Pressed')}
                  />
                </View>       
    <View style={[{paddingLeft:20, paddingRight:20, paddingBottom:8}]}>
        <Text style={styles_.titleCustom}>Current location</Text>
      <CustomLocationInput 
      
      leftIcon={<Location  width={15} height={15}/>}
      value={'British council Abuja, Abaji, FCT'}
      placeholder={'Current location'}

      />
    </View>
    
    <View style={[{paddingLeft:20, paddingRight:20, paddingBottom:8}]}>
        <Text style={styles.label}>Select State</Text>
<CustomInputDropdown
        data={data}
        placeholder="Type to search..."
        onSelectItem={handleSelectItem}
      />
    </View>
{/* LGA */}
<View style={[{paddingLeft:20, paddingRight:20, paddingBottom:8}]}>
        <Text style={styles.label}>Select LGA</Text>
<CustomInputDropdown
        data={data}
        placeholder="Type to search..."
        onSelectItem={handleSelectItem}
      />
    </View>
    {/* Sub-region */}
    <View style={[{paddingLeft:20, paddingRight:20, paddingBottom:8}]}>
        <Text style={styles.label}>Select Sub-region</Text>
<CustomInputDropdown
        data={data}
        placeholder="Type to search..."
        onSelectItem={handleSelectItem}

      />
    </View>
    {/* Choose from map */}
    <View style={[{paddingLeft:20, paddingRight:20, paddingBottom:8}]}>
   <Text style={{color:'#059669', fontSize:13, fontWeight:'600'}}>Select from map</Text>
   </View>
   <View style={[{paddingLeft:20, paddingRight:20, paddingBottom:8}]}>
   <Text style={{color:'#059669', fontSize:13, fontWeight:'600'}}>Select Registered Location</Text>
   </View>


   <View style={[{paddingLeft:20, paddingRight:20, paddingBottom:8}]}>
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
              handlePress={handleContinue} 
            />
            </View>

  </View>
    </ScrollView>
  )
}


const styles = StyleSheet.create({
    container: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
      backgroundColor: '#FFF',
      padding: 20,
    },
    row: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      marginVertical: 10, 
    },
    column: {
      flex: 1,
      marginHorizontal: 5,
    },
    sheetContent: {
      flex: 1,
      justifyContent: 'flex-start',
      
    },
    sheetText: {
      fontSize: 18,
      padding:8,
      paddingLeft:20,
      paddingRight:20,
      
      fontWeight: 'bold',
      color: '#333',
    },
    headingText: {
      fontSize: 16,
      fontWeight: "bold",
      paddingHorizontal: 2,
      justifyContent:'flex-start',
      alignItems:'flex-start'
    },
    card: {
      
      
      borderRadius: 4,    
      backgroundColor: '#059669',
      height: 170, 
    },
    cardElevated: {
      backgroundColor: '#059669', 
      elevation: 5,
      shadowOffset: {
        width: 3,
        height: 3,
      },
      shadowColor: '#EF5354',
      borderWidth:1,
      borderColor:'#059669',
    },
    loginScreenButtonEnable: {
      paddingTop: 2,
      paddingBottom: 10,
      backgroundColor: '#059669',
      borderRadius: 4,
      borderWidth: 1,
      borderColor: '#fff',
    },
    button: {
      backgroundColor: '#059669',
      borderRadius: 5, 
      padding: 10,
      alignItems: 'center',
      justifyContent:'center',
      borderWidth:1,
      borderColor:'white',
      
    },
    subText:{
      lineHeight:18.2,
      fontSize:12,
      paddingHorizontal: 2,
      paddingBottom:8,
      justifyContent:'flex-start',
      textAlign:'justify',
      color:'#FFFFFF'
    },
    titleText: {
      fontSize: 20,
      fontWeight: 'bold',
      color: '#333',
    },
    footer: {
      padding: 10,
      
      borderBottomEndRadius: 4,
      borderBottomStartRadius: 4,
    },
    footerText: {
      fontSize: 12,
      color: '#333',
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
    icon: {
      marginRight: 10, 
    },
    cardText: {
      color: '#1B4ACB',
      fontSize: 14,
      flex: 1, 
    },
    label: {
        fontSize: 13,
        fontWeight: '700',
        
        
        color: '#8C93A3',
      },
  });
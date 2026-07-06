import {
    Image,
    Pressable,
    SafeAreaView,
    ScrollView,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View,
  } from 'react-native';
//   import {useQuery} from '@apollo/client';
  import React, { useState } from 'react';
  import { Picker } from '@react-native-picker/picker';
  import {appColors, appFonts, hp, wp} from './../../lib/utils/scale';
  import Notification from './../../components/molecules/m-notification';
  import LabAuditItem from './../../components/molecules/m-lab-audit-item';
//   import {GetInventoryInfoQry} from '../../../lib/graphql/Query';
//   import {
//     GetInventoryInfoQryQuery,
//     GetInventoryInfoQryQueryVariables,
//   } from '../../../lib/types/generated/graphql';
  import SampleCollectionNotice from './../../components/molecules/m-info-card';
import BackBtn from '../../components/atoms/a-back-btn';
import styles_ from '../../components/utils/styles';



const options = ['Sample bottle', 'Needles', 'Hand gloves', 'Bolt strips', 'Sample bottle2', 'Needles2', 'Hand gloves2', 'Bolt strips2'];
  
  const AuditScreen = (props: any) => {
  
    const [showOptions, setShowOptions] = useState(false);
      const [selectedOption, setSelectedOption] = useState('');
     const [userType, setUserType] = useState('Select user type');
     const [isPickerFocused, setIsPickerFocused] = useState(false);
      const handleOptionSelect = (option: string) => {
        setSelectedOption(option);
        setShowOptions(false);
      };
    
    const notifications = [
      {
        id: 1,
        image: require('../../../assets/images/png/bottles.png'),
        message: 'Sample bottle',
        description: '30 quantity supplied',
        date: '12',
        dataTitle: 'Remains',
      },
      {
        id: 2,
        image: require('../../../assets/images/png/needles.png'),
        message: 'Needles',
        description: '40 quantity supplied',
        date: '15',
        dataTitle: 'Remains',
      },
      {
        id: 3,
        image: require('../../../assets/images/png/bolts.png'),
        message: 'Bolts stripes',
        description: '30 quantity supplied',
        date: '12',
        dataTitle: 'Remains',
      },
      {
        id: 4,
        image: require('../../../assets/images/png/gloves.png'),
        message: 'Hand gloves',
        description: '30 quantity supplied',
        date: '12',
        dataTitle: 'Remains',
      },
      {
        id: 5,
        image: require('../../../assets/images/png/spirit.png'),
        message: 'Methylated spirit',
        description: '30 quantity supplied',
        date: '12',
        dataTitle: 'Remains',
      },
    ];
  
    
    // const {data, error, loading} = useQuery<
    //   GetInventoryInfoQryQuery,
    //   GetInventoryInfoQryQueryVariables
    // >(GetInventoryInfoQry, {
    //   pollInterval: 5000, // 5000 milliseconds (5 seconds)
    // });  name
    const data = [
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
    // const data = [];
    // CREATE_REQUEST_TOOL_AUDIT
    
    const returnedData = data || [];
    return (
      <SafeAreaView style={{flex: 1}}>
        <ScrollView
          showsVerticalScrollIndicator={false}
          style={{
            backgroundColor: '#FFFFFF',
            gap: hp(3),
            paddingHorizontal: wp(2.4),
          }}>
          <View>
            {/* <View
              style={{
                flex: 1,
                flexDirection: 'row',
                padding: 10,
                alignItems: 'center',
                gap: 30,
                marginTop: hp(5),
              }}>
              <BackBtn withStraigthLine navigation={props?.navigation} />
              <Text style={styles.title}>Audit</Text>
            </View> */}
  
            <View style={styles.summaryBox}>
              <Text
                style={{
                  fontSize: hp(2.4),
                  fontWeight: 'bold',
                  color: appColors.black,
                }}>
                Summary
              </Text>
              <View style={{flexDirection: 'row', gap: 10}}>
                <Pressable
                  onPress={() =>
                    props.navigation.navigate('audit_history_screen')
                  }
                  >
                  <Text style={styles.subText}>History</Text>
                </Pressable>
                <Pressable
                  onPress={() =>
                    props.navigation.navigate('request_screen')
                  }
                  >
                  <Text style={styles.subText}>Item request</Text>
                </Pressable>
              </View>
            </View>
          </View>
          <View
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              justifyContent: 'center',
              paddingBottom: hp(2),
            }}>
            <SampleCollectionNotice text="Items are supplied ones every month. except emergency shortage" />
          </View>
          <ScrollView style={styles.boxContainer}>
            {/* {returnedData.length > 0 ? (
              returnedData.map((inventory, i) => (
                <LabAuditItem inventory={inventory} key={i} />
              ))
            ) : (
            
              <Text style={styles.emptyText}>No data found.</Text>
            )}   */}
         <Picker
                selectedValue={userType}                
                style={[styles_.dropdown, styles_.inputInput]}
                onValueChange={(itemValue) => {
                  setUserType(itemValue);
                  console.error('CHCHCHCHCHC:::: ', itemValue);
                  // handleChange('userType')(itemValue); // Set userType when Picker value changes
                }}
                
                onFocus={() => setIsPickerFocused(true)} // Set focus state to true
                onBlur={() => setIsPickerFocused(false)}
              >
                <Picker.Item label="Select equipment" value="Select equipment" />
                <Picker.Item label="Samble Bottle" value="sambleBottle" />
                <Picker.Item label="Methlylated Spirit" value="methlylatedSpirit" />
                <Picker.Item label="Alcohol Pad" value="alcoholPad" />
                <Picker.Item label="Hand Sanitizer" value="handSanitizer" />
                <Picker.Item label="N95 Face mask" value="N95Facemask" />
                <Picker.Item label="Surgical Facemask" value="surgicalFacemask" />
                <Picker.Item label="Anti-Septic Wipes" value="antisepticWipes" />
                <Picker.Item label="Nitrile Gloves" value="nitrileGloves" />
                <Picker.Item label="Latex gloves" value="latexgloves" />
                <Picker.Item label="Powder Free Gloves" value="powderFreeGloves" />
                <Picker.Item label="Vacutainers" value="vacutainers" />
                <Picker.Item label="Syringes" value="syringes" />
                <Picker.Item label="Needles" value="needles" />
                <Picker.Item label="Tourniquets" value="tourniquets" />
                <Picker.Item label="Lancets" value="lancets" />
                <Picker.Item label="Pipettes" value="pipettes" />
                <Picker.Item label="Droppers" value="droppers" />
                <Picker.Item label="Cotton Wool" value="cottonWool" /> 
                <Picker.Item label="Gauze Pads" value="gauzePads" /> 
                <Picker.Item label="Thermometer" value="thermometer" /> 
                <Picker.Item label="Adhesive Bandages" value="adhesiveBandages" /> 
                <Picker.Item label="Blood Pressure Monitor" value="bloodPressureMonitor" />                
                <Picker.Item label="Glucometer" value="glucometer" /> 
                <Picker.Item label="Glucose Test Strip" value="glucoseTestStrip" /> 
                <Picker.Item label="EDTA Tube" value="EDTATube" /> 
                <Picker.Item label="Heparin Tubes" value="heparinTubes" /> 
                <Picker.Item label="Serum Separating Tubes" value="serumSeparatingTubes" /> 
                <Picker.Item label="Urine Sample Cups" value="urineSampleCups" /> 
                <Picker.Item label="Stool Sample Containers" value="stoolSampleContainers" /> 
                <Picker.Item label="Swabs" value="swabs" /> 
                <Picker.Item label="Specimen Bags" value="specimenBags" /> 
                <Picker.Item label="Insulated Transport Containers" value="insulatedTransportContainers" /> 
                <Picker.Item label="Disinfectants" value="disinfectants" /> 
                <Picker.Item label="Waste Disposal Bags" value="wasteDisposalBags" /> 
                <Picker.Item label="Needle Disposal Containers" value="needleDisposalContainers" /> 
                <Picker.Item label="Barcode Labels" value="barcodeLabels" /> 
                <Picker.Item label="Permanent Markers" value="permanentMarkers" /> 
                <Picker.Item label="Specimen Labels" value="specimenLabels" /> 
                <Picker.Item label="Bolt Strips" value="boltStrips" /> 
                <Picker.Item label="Pressure Cuff" value="pressureCuff" />      
              </Picker> 


            {/* <View>
                      <Text style={styles.inputText}>Name of equipment</Text>
                      <View style={styles.selectContainer}>
                        <TextInput
                          style={styles.selectInput}
                          placeholder="Select equipment"
                          value={selectedOption}
                          onChangeText={(text) => setSelectedOption(text)}
                          onFocus={() => setShowOptions(true)}
                          editable={false}
                        />
                        <TouchableOpacity style={styles.selectIcon} onPress={() => setShowOptions(!showOptions)}>
                          <Image source={require('./../../../assets/images/png/select.png')} />
                        </TouchableOpacity>
                      </View>
                      {showOptions && (
                        <View style={styles.optionsContainer}>
                          {options.map((option, index) => (
                            <TouchableOpacity key={index} style={styles.option} onPress={() => handleOptionSelect(option)}>
                              <Text>{option}</Text>
                            </TouchableOpacity>
                          ))}
                        </View>
                      )}
                    </View> */}
                    <View>
                      <Text style={styles.inputText}>Amount</Text>
                      <TextInput style={styles.input} placeholder="Enter amount used" />
                    </View>
          </ScrollView>
          <Pressable
            onPress={() =>
              console.error('LEXXXXXX ',userType)
              // props.navigation.navigate('update_screen')
            }>
            <View style={styles.button}>
              <Text style={styles.buttonText}>Update inventory</Text>
            </View>
          </Pressable>
        </ScrollView>
      </SafeAreaView>
    );
  };
  
  const styles = StyleSheet.create({
    title: {
      justifyContent: 'center',
      textAlign: 'center',
      paddingLeft: 70,
      fontSize: hp(3),
      fontFamily: appFonts.semiBoldText.fontFamily,
    },
    summaryBox: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      paddingHorizontal: 15,
      alignItems: 'center',
      paddingTop: 20,
      paddingBottom: hp(2),
    },
    subText: {
      fontWeight: '600',
      color: '#059669',
    },
    boxContainer: {
      rowGap: 10,
      borderColor: appColors?.['gray-35'],
      marginHorizontal: 15,
      borderWidth: 1,
      height: 405,
      overflow: 'scroll',
    },
    boxBackground: {
      flexDirection: 'row',
      paddingHorizontal: 15,
      paddingVertical: 10,
      justifyContent: 'space-between',
      alignItems: 'center',
      backgroundColor: appColors?.['gray-55'],
      borderRadius: 8,
      margin: 5,
    },
    notificationDate: {
      textAlign: 'center',
      alignContent: 'center',
      justifyContent: 'center',
      backgroundColor: '#D3E5FE',
      borderRadius: 3,
      width: 52,
      height: 40,
    },
    descriptiveText: {
      fontSize: hp(1.5),
      color: appColors.gray,
    },
    button: {
      marginTop: 20,
      justifyContent: 'center',
      alignItems: 'center',
      borderRadius: 3,
      paddingVertical: 15,
      paddingHorizontal: 16,
      margin: 10,
      backgroundColor: appColors.primaryGreen,
    },
    buttonText: {
      fontSize: hp(2),
      fontWeight: 'bold',
      color: appColors.white,
      textAlign: 'center',
    },
    emptyText: {
      fontSize: 16, // Adjust font size as needed
      color: '#808080', // Adjust color as needed (gray in this example)
      textAlign: 'center', // Center align the text
      marginTop: 20, // Add some margin from top (adjust as needed)
    },
    Container: {
      flex: 1,
      paddingHorizontal: 15,
      paddingVertical: 50,
      backgroundColor: '#FFFFFF',
      rowGap: 5,
    },
    // title: {
    //   flex: 1,
    //   justifyContent: 'center',
    //   textAlign: 'center',
    //   fontSize: hp(2),
    //   fontFamily: appFonts.semiBoldText.fontFamily,
    // },
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
    // buttonText: {
    //   fontSize: hp(2),
    //   fontWeight: 'bold',
    //   color: appColors.white,
    //   textAlign: 'center',
    // },
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
    // selectContainer: {
    //   flexDirection: 'row',
    //   alignItems: 'center',
    //   paddingHorizontal: 10,
    //   paddingVertical: 10,
    //   borderRadius: 5,
    //   borderWidth: 1,
    //   borderColor: '#E2E4E8',
    //   minWidth: '100%',
    // },
    selectInput: {
      flex: 1,
      fontSize: hp(2),
      fontFamily: appFonts.regularText.fontFamily,
      color: '#333',
    },
    selectIcon: {
      marginLeft: 10,
    },
    // optionsContainer: {
    //   position: 'absolute',
    //   top: '100%',
    //   left: 0,
    //   right: 0,
    //   backgroundColor: 'grey',
    //   borderColor: '#E2E4E8',
    //   borderWidth: 1,
    //   borderRadius: 5,
    //   marginTop: 5,
    //   zIndex: 1,
    // },
    // option: {
    //   paddingVertical: 10,
    //   paddingHorizontal: 10,
    // },


    selectContainer: {
      flexDirection: 'row',
      alignItems: 'center',
      paddingHorizontal: 10,
      paddingVertical: 10,
      borderRadius: 5,
      borderWidth: 1,
      borderColor: '#E2E4E8',
      minWidth: '100%',
      position: 'relative', // Added
    },
    optionsWrapper: {
      position: 'absolute',
      top: 50, // Adjust based on input height
      left: 0,
      right: 0,
      zIndex: 100, // Higher to ensure visibility
    },
    optionsContainer: {
      // position:'absolute',
      backgroundColor: '#fff',
      borderColor: '#E2E4E8',
      borderWidth: 1,
      borderRadius: 5,
      elevation: 3, // Adds shadow for better visibility
      paddingVertical: 5,
    },
    option: {
      paddingVertical: 10,
      paddingHorizontal: 10,
      borderBottomWidth: 0.5,
      borderBottomColor: '#E2E4E8',
    },

  });
  
  export default AuditScreen;
  
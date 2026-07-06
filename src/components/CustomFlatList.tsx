import React, { useState } from 'react';
import { FlatList, Text, View, TouchableOpacity,Dimensions } from 'react-native';
import { useNavigation } from '@react-navigation/native';  // Import the hook
import styles from './utils/styles';  // Assuming you have a styles file
import formatNaira from './FormatNaira';

const CustomFlatList = ({ data, data_type, onSelectItem, activeType, showSpecial = false, typeOfMethod }) => {
  const navigation = useNavigation();  // Get navigation object from the hook
  const maxLength = 30;
  const [selectedItem, setSelectedItem] = useState(null);

  console.log('LOOOOKIT ::: ',data);
   const renderItem = ({ item }) => {
    if(activeType === 'test'){
    if (data_type === "CANCELLED" && item.requestStatus === "CANCELLED") {
      // Case 1: `data_type` and `item.requestStatus` are both "CANCELLED"
      return (
        <TouchableOpacity
          style={styles.itemFlatList}
          onPress={() => navigation.navigate('veiw_order', { itemData: item, data_type: data_type })} // Use navigation hook
        >
          <View style={styles.itemFlatList}>
            <View style={styles.row}>
              <Text
                style={[styles.name, { color: '#0F1D40' }]}
                numberOfLines={1} // Limit to one line
                ellipsizeMode="clip"
              > 
                {item.type_person_single.length > maxLength
                  ? `${item.type_person_single.substring(0, maxLength)}...`
                  : item.type_person_single}
              </Text>
              <Text
                style={[
                  styles.textRight,
                  { color: '#FF3236', fontWeight: '800', fontSize: 12, lineHeight: 20.2 },
                ]}
              >
                {item.requestStatus.replaceAll('_', ' ')}
              </Text>
            </View>
            <View style={styles.row}>
              <View style={styles.row}>
                <Text style={{ paddingRight: 5 }}>
                  {item.lastName} {item.firstName}
                </Text>
                <View style={styles.borderContainerMin}>
                  <Text
                    style={[
                      styles.textLeft,
                      {
                        fontSize: 14,
                        fontWeight: '800',
                        color: '#8C93A3',
                        justifyContent: 'flex-start',
                        alignContent: 'flex-start',
                        alignItems: 'flex-start',
                      },
                    ]}
                  >
                    {/* {'Single, '} */}
                    {item.noOfPeople.toString()} {item.noOfPeople > 1 ? 'Persons' : 'Person'}
                  </Text>
                </View>
              </View>
              <Text
                style={[
                  styles.textRight,
                  { fontSize: 14, fontWeight: '800', color: '#8C93A3' },
                ]}
              >
                {formatNaira(item.amount)}
              </Text>
            </View>
          </View>
        </TouchableOpacity>
      );
    } 
    else if (data_type === "PENDING" && item.requestStatus === "PENDING")  {
      // Case 2: Any other condition
      return (
        <TouchableOpacity
          style={styles.itemFlatList}
            onPress={() => 
              typeOfMethod === 'dont'?null:  
              navigation.navigate('veiw_order', { itemData: item, data_type: data_type })
            
            } // Use navigation hook
        >
          <View style={styles.itemFlatList}>
            <View style={styles.row}>
            <Text style={{ paddingRight: 5 }}>
                  {item.lastName} {item.firstName}
                </Text>
              <Text
                style={[styles.labelText, { color: '#0F1D40' }]}
                numberOfLines={1} // Limit to one line
                ellipsizeMode="clip"
              >
                
                {
                item.type_person_single.length > maxLength
                  ? `${item.type_person_single.substring(0, maxLength)}...`
                  : 
                  item.type_person_single
                  }
                  
              </Text>
              <Text
                style={[
                  styles.textRight,
                  {
                    color: item.requestStatus === 'PENDING' ? '#DB8C09' : '#10B981',
                    fontWeight: '800',
                  },
                ]}
              >
                {item.requestStatus.replaceAllAll('_', ' ')}
              </Text>
            </View>
            <View style={styles.row}>
              <View style={styles.row}>
                
                <View style={styles.borderContainerMin}>
                  <Text
                    style={[
                      styles.textLeft,
                      {
                        fontSize: 14,
                        fontWeight: '800',
                        color: '#8C93A3',
                        justifyContent: 'flex-start',
                        alignContent: 'flex-start',
                        alignItems: 'flex-start',
                      },
                    ]}
                  >
                    {'Single, '}
                    {item.tests.length} {item.tests.length > 1 ? 'Persons' : 'Person'}
                  </Text>
                </View>
              </View>
              <Text
                style={[
                  styles.textRight,
                  { fontSize: 14, fontWeight: '800', color: '#8C93A3' },
                ]}
              >
                {formatNaira(item.amount)}
              </Text>
            </View>
          </View>
        </TouchableOpacity>
      );
    } 
    
    else if ((data_type.toString() === "SCHEDULED"  && item.requestStatus === "SCHEDULED") ||(data_type.toString() === "SCHEDULED" && item.requestStatus === "SCHEDULED" ) && showSpecial === true)  {
      // Case 2: Any other condition
      return (
        <TouchableOpacity
          style={styles.itemFlatList}
          onPress={() =>  typeOfMethod === 'dont'?null:  navigation.navigate('veiw_order', { itemData: item, data_type: data_type })} // Use navigation hook
        >
          <View style={styles.itemFlatList}>
            <View style={styles.row}>
            <View style={styles.row}>
            <Text style={{ paddingRight: 5 }}>
                  {item.lastName} {item.firstName}
                </Text>
              <Text
                style={[styles.labelText, { color: '#0F1D40' }]}
                numberOfLines={1} // Limit to one line
                ellipsizeMode="clip"
              >
                
                
                {
                // item.type_person_single.length > maxLength
                //   ? `${item.type_person_single.substring(0, maxLength)}...`
                //   : 
                  item.type_person_single} 
              </Text>
            </View>

             
              <Text
                style={[
                  styles.textRight,
                  {
                    color: item.requestStatus === 'ONGOING' ? 'blue' : '#10B981',
                    fontWeight: '800',
                  },
                ]}
              >

{/* "requestStatus": "SCHEDULED", "samepleDropOffDate": null, "sampleCollectionDate": "2025-02-28T21:07:14.662000+00:00", "sampleStatus": "PENDING", */}
                {/* {item.requestStatus} */}
                {item.sampleStatus === 'PENDING' && item.requestStatus === 'SCHEDULED' ? 'Request accepted':item.requestStatus.replaceAll('_', ' ')
     }
              </Text>
            </View>



            <View style={styles.row}>
              <View style={styles.row}>
                
                <View style={styles.borderContainerMin}>
                  <Text
                    style={[
                      styles.textLeft,
                      {
                        fontSize: 14,
                        fontWeight: '800',
                        color: '#8C93A3',
                        justifyContent: 'flex-start',
                        alignContent: 'flex-start',
                        alignItems: 'flex-start',
                      },
                    ]}
                  >
                    {'Single, '}
                    {item.tests.length} {item.tests.length > 1 ? 'Persons' : 'Person'}
                  </Text>
                </View>

              </View>
              <Text
                style={[
                  styles.textRight,
                  { fontSize: 14, fontWeight: '800', color: '#8C93A3' },
                ]}
              >
                {formatNaira(item.amount)}
              </Text>
            </View>
          </View>
        
        
        </TouchableOpacity>
      );
    }else if (((data_type.toString() === "SAMPLE_RECEIVED"  && item.requestStatus === "SAMPLE_RECEIVED") || (data_type.toString() === "SAMPLE_COLLECTED"  && item.requestStatus === "SAMPLE_COLLECTED")) && showSpecial === true)  {
      // Case 2: Any other condition
      return (
        <TouchableOpacity
          style={styles.itemFlatList}
          onPress={() =>  typeOfMethod === 'dont'?null:  navigation.navigate('veiw_order', { itemData: item, data_type: data_type })} // Use navigation hook
        >
          <View style={styles.itemFlatList}>
            <View style={styles.row}>
            <View style={styles.row}>
            <Text style={{ paddingRight: 5 }}>
              {/* {item.title}  */}
                  {item.lastName} {item.firstName}
                </Text>
              <Text
                style={[styles.labelText, { color: '#0F1D40' }]}
                numberOfLines={1} // Limit to one line
                ellipsizeMode="clip"
              >
                
                
                {
                // item.type_person_single.length > maxLength
                //   ? `${item.type_person_single.substring(0, maxLength)}...`
                //   : 
                  item.type_person_single} 
              </Text>
            </View>

             
              <Text
                style={[
                  styles.textRight,
                  {
                    color: item.requestStatus === 'TESTING_ONGOING' ? 'blue' : activeType === 'test'?'blue': '#10B981',
                    fontWeight: '800',
                  },
                ]}
              >

{/* "requestStatus": "SCHEDULED", "samepleDropOffDate": null, "sampleCollectionDate": "2025-02-28T21:07:14.662000+00:00", "sampleStatus": "PENDING", */}
                {/* {item.requestStatus} */}
                {item.sampleStatus === 'PENDING' && item.requestStatus === 'SCHEDULED' ? 'Request accepted': activeType === 'test'?'TESTING ONGOING':item.requestStatus.replaceAll('_', ' ')
     }
              </Text>
            </View>



            <View style={styles.row}>
              <View style={styles.row}>
                
                <View style={styles.borderContainerMin}>
                  <Text
                    style={[
                      styles.textLeft,
                      {
                        fontSize: 14,
                        fontWeight: '800',
                        color: '#8C93A3',
                        justifyContent: 'flex-start',
                        alignContent: 'flex-start',
                        alignItems: 'flex-start',
                      },
                    ]}
                  >
                    {/* {'Single, '} */}
                    {item.pickUpAddress}
                    {/* {item.tests.length} {item.tests.length > 1 ? 'Persons' : 'Person'} */}
                  </Text> 
                </View>

              </View>
              <Text
                style={[
                  styles.textRight,
                  { fontSize: 14, fontWeight: '800', color: '#8C93A3' },
                ]}
              >
                {/* {formatNaira(item.amount)} */}
              </Text>
            </View>
          </View>
        
        
        </TouchableOpacity>
      );
    }


    else if ((data_type.toString() === "REQUEST_COMPLETED"  && item.requestStatus === "REQUEST_COMPLETED" ) && showSpecial === true)  {
      // Case 2: Any other condition
      return (
        <TouchableOpacity
          style={styles.itemFlatList}
          onPress={() =>  typeOfMethod === 'dont'?null:  navigation.navigate('veiw_order', { itemData: item, data_type: data_type })} // Use navigation hook
        >
          <View style={styles.itemFlatList}>
            <View style={styles.row}>
            <View style={styles.row}>
            <View >
            <Text style={{ paddingRight: 5 }}>
              {/* {item.title}  */}
                  {item.lastName} {item.firstName}
                </Text>
</View>

            </View>

             
              <Text
                style={[
                  styles.textRight,
                  {
                    color: item.requestStatus === 'TESTING_ONGOING' ? 'blue' : '#10B981',
                    fontWeight: '800',
                  },
                ]}
              >

{/* "requestStatus": "SCHEDULED", "samepleDropOffDate": null, "sampleCollectionDate": "2025-02-28T21:07:14.662000+00:00", "sampleStatus": "PENDING", */}
                {/* {item.requestStatus} */}
                {item.sampleStatus === 'PENDING' && item.requestStatus === 'SCHEDULED' ? 'Request accepted':item.requestStatus.replaceAll('_', ' ')
     }
              </Text>
            </View>


            <View style={[styles.row, { paddingRight: 5 }]}>

<Text
  style={[styles.labelText, styles.textLeft, { 
    color: '#0F1D40', justifyContent: 'flex-start',
    alignContent: 'flex-start',
    alignItems: 'flex-start',  
    paddingLeft: 10 }]}
  numberOfLines={1} // Limit to one line
  ellipsizeMode="clip"
>
{item.tests.length === 1? `${item.tests.length} person`:`${item.tests.length} persons`} 
</Text>
{/* <Text>{"                                                              "}</Text> */}
</View>

            <View style={styles.row}>
              <View style={styles.row}>
                
                <View style={styles.borderContainerMin}>
                  <Text
                    style={[
                      styles.textLeft,
                      {
                        fontSize: 14,
                        fontWeight: '800',
                        color: '#8C93A3',
                        justifyContent: 'flex-start',
                        alignContent: 'flex-start',
                        alignItems: 'flex-start',
                      },
                    ]}
                  >
                    {/* {'Single, '} */}
                    {item.pickUpAddress}
                    {/* {item.tests.length} {item.tests.length > 1 ? 'Persons' : 'Person'} */}
                  </Text> 
                </View>

              </View>
              <Text
                style={[
                  styles.textRight,
                  { fontSize: 14, fontWeight: '800', color: '#8C93A3' },
                ]}
              >
                {/* {formatNaira(item.amount)} */}
              </Text>
            </View>
          </View>
        
        
        </TouchableOpacity>
      );
    }
    

    else if ((data_type.toString() === "TESTING_ONGOING"  && item.requestStatus === "TESTING_ONGOING") ||(data_type.toString() === "TESTING_ONGOING" && item.requestStatus === "TESTING_ONGOING" ) && showSpecial === true)  {
      // Case 2: Any other condition
      return (
        <TouchableOpacity
          style={styles.itemFlatList}
          onPress={() =>  typeOfMethod === 'dont'?null:  navigation.navigate('veiw_order', { itemData: item, data_type: data_type })} // Use navigation hook
        >
          <View style={styles.itemFlatList}>
            <View style={styles.row}>
            <View style={styles.row}>
            <Text style={{ paddingRight: 5 }}>
                  {item.lastName} {item.firstName}
                </Text>
              <Text
                style={[styles.labelText, { color: '#0F1D40' }]}
                numberOfLines={1} // Limit to one line
                ellipsizeMode="clip"
              >
                
               
                {
                // item.type_person_single.length > maxLength
                //   ? `${item.type_person_single.substring(0, maxLength)}...` RECEIVED
                //   : 
                  item.type_person_single} 
              </Text>
            </View>

             
              <Text
                style={[
                  styles.textRight,
                  {
                    color: item.requestStatus === 'TESTING_ONGOING' ? 'blue' : '#10B981',
                    fontWeight: '800',
                  },
                ]}
              >
                {item.sampleStatus === 'COLLECTED'? 'Sample collected':item.sampleStatus === 'RECEIVED'?"Sample submitted":item.requestStatus.replaceAll('_', ' ')
     }
              </Text>
            </View>



            <View style={styles.row}>
              <View style={styles.row}>
                
                <View style={styles.borderContainerMin}>
                  <Text
                    style={[
                      styles.textLeft,
                      {
                        fontSize: 14,
                        fontWeight: '800',
                        color: '#8C93A3',
                        justifyContent: 'flex-start',
                        alignContent: 'flex-start',
                        alignItems: 'flex-start',
                      },
                    ]}
                  >
                    {'Single, '}
                    {item.tests.length} {item.tests.length > 1 ? 'Persons' : 'Person'}
                  </Text>
                </View>

              </View>
              <Text
                style={[
                  styles.textRight,
                  { fontSize: 14, fontWeight: '800', color: '#8C93A3' },
                ]}
              >
                {(item.amount)}
              </Text>
            </View>
          </View>
        
        
        </TouchableOpacity>
      );
    }

    else if ((data_type.toString() === "REQUEST_COMPLETED" && item.requestStatus === "REQUEST_COMPLETED") && showSpecial === true)  {
      // Case 2: Any other condition
      return (
        <TouchableOpacity
          style={styles.itemFlatList}
          onPress={() =>  typeOfMethod === 'dont'?null:  navigation.navigate('veiw_order', { itemData: item, data_type: data_type })} // Use navigation hook
        >
          <View style={styles.itemFlatList}>
            <View style={styles.row}>
            <View style={styles.row}>
            <Text style={{ paddingRight: 5 }}>
                  {item.lastName} {item.firstName}
                </Text>
              <Text
                style={[styles.labelText, { color: '#0F1D40' }]}
                numberOfLines={1} // Limit to one line
                ellipsizeMode="clip"
              >
                
                {
                // item.type_person_single.length > maxLength
                //   ? `${item.type_person_single.substring(0, maxLength)}...`
                //   : 
                  item.type_person_single} 
              </Text>
            </View>

             
              <Text
                style={[
                  styles.textRight,
                  {
                    color: item.requestStatus === 'COMPLETE' ? 'green' : '#10B981',
                    fontWeight: '800',
                  },
                ]}
              >
                {item.sampleStatus === 'COMPLETE' && item.requestStatus === 'COMPLETE' ? 'Request completed/Result sent':item.requestStatus.replaceAll('_', ' ')
     }
                {/* {item.requestStatus} */}
              </Text>
            </View>



            <View style={styles.row}>
              <View style={styles.row}>
                
                <View style={styles.borderContainerMin}>
                  <Text
                    style={[
                      styles.textLeft,
                      {
                        fontSize: 14,
                        fontWeight: '800',
                        color: '#8C93A3',
                        justifyContent: 'flex-start',
                        alignContent: 'flex-start',
                        alignItems: 'flex-start',
                      },
                    ]}
                  >
                    {'Single, '}
                    {item.tests.length} {item.tests.length > 1 ? 'Persons' : 'Person'}
                  </Text>
                </View>

              </View>
              <Text
                style={[
                  styles.textRight,
                  { fontSize: 14, fontWeight: '800', color: '#8C93A3' },
                ]}
              >
                {formatNaira(item.amount)}
              </Text>
            </View>
          </View>
        
        
        </TouchableOpacity>
      );
    }
    ///////
   else if ((data_type.toString() === "IN_TRANSIT_TO_LAB"  && item.requestStatus === "IN_TRANSIT_TO_LAB") ||(data_type.toString() === "IN_TRANSIT_TO_LAB" && item.requestStatus === "IN_TRANSIT_TO_LAB" ) && showSpecial === true)  {
      // Case 2: Any other condition
      return (
        <TouchableOpacity
          style={styles.itemFlatList}
          onPress={() =>  typeOfMethod === 'dont'?null:  navigation.navigate('veiw_order', { itemData: item, data_type: data_type })} // Use navigation hook
        >
          <View style={styles.itemFlatList}>
            <View style={styles.row}>
            <View style={styles.row}>
            <Text style={{ paddingRight: 5 }}>
                  {item.lastName} {item.firstName}
                </Text>
              <Text
                style={[styles.labelText, { color: '#0F1D40' }]}
                numberOfLines={1} // Limit to one line
                ellipsizeMode="clip"
              >
                
               
                {
                // item.type_person_single.length > maxLength
                //   ? `${item.type_person_single.substring(0, maxLength)}...` RECEIVED
                //   : 
                  item.type_person_single} 
              </Text>
            </View>

             
              <Text
                style={[
                  styles.textRight,
                  {
                    color: item.requestStatus === 'IN_TRANSIT_TO_LAB' ? 'blue' : '#10B981',
                    fontWeight: '800',
                  },
                ]}
              >
                {item.sampleStatus === 'COLLECTED'? 'Sample collected':item.sampleStatus === 'RECEIVED'?"Sample submitted":item.requestStatus.replaceAll('_', ' ')
     }
              </Text>
            </View>



            <View style={styles.row}>
              <View style={styles.row}>
                
                <View style={styles.borderContainerMin}>
                  <Text
                    style={[
                      styles.textLeft,
                      {
                        fontSize: 14,
                        fontWeight: '800',
                        color: '#8C93A3',
                        justifyContent: 'flex-start',
                        alignContent: 'flex-start',
                        alignItems: 'flex-start',
                      },
                    ]}
                  >
                    {'Single, '}
                    {item.tests.length} {item.tests.length > 1 ? 'Persons' : 'Person'}
                  </Text>
                </View>

              </View>
              <Text
                style={[
                  styles.textRight,
                  { fontSize: 14, fontWeight: '800', color: '#8C93A3' },
                ]}
              >
                {(item.amount)}
              </Text>
            </View>
          </View>
        
        
        </TouchableOpacity>
      );
    }

       else if ((data_type.toString() === "DROPPED_AT_LOCATION"  && item.requestStatus === "DROPPED_AT_LOCATION") ||(data_type.toString() === "DROPPED_AT_LOCATION" && item.requestStatus === "DROPPED_AT_LOCATION" ) && showSpecial === true)  {
      // Case 2: Any other condition
      return (
        <TouchableOpacity
          style={styles.itemFlatList}
          onPress={() =>  typeOfMethod === 'dont'?null:  navigation.navigate('veiw_order', { itemData: item, data_type: data_type })} // Use navigation hook
        >
          <View style={styles.itemFlatList}>
            <View style={styles.row}>
            <View style={styles.row}>
            <Text style={{ paddingRight: 5 }}>
                  {item.lastName} {item.firstName}
                </Text>
              <Text
                style={[styles.labelText, { color: '#0F1D40' }]}
                numberOfLines={1} // Limit to one line
                ellipsizeMode="clip"
              >
                
               
                {
                // item.type_person_single.length > maxLength
                //   ? `${item.type_person_single.substring(0, maxLength)}...` RECEIVED
                //   : 
                  item.type_person_single} 
              </Text>
            </View>

             
              <Text
                style={[
                  styles.textRight,
                  {
                    color: item.requestStatus === 'DROPPED_AT_LOCATION' ? 'blue' : '#10B981',
                    fontWeight: '800',
                  },
                ]}
              >
                {item.sampleStatus === 'COLLECTED'? 'Sample collected':item.sampleStatus === 'RECEIVED'?"Sample submitted":item.requestStatus.replaceAll('_', ' ')
     }
              </Text>
            </View>



            <View style={styles.row}>
              <View style={styles.row}>
                
                <View style={styles.borderContainerMin}>
                  <Text
                    style={[
                      styles.textLeft,
                      {
                        fontSize: 14,
                        fontWeight: '800',
                        color: '#8C93A3',
                        justifyContent: 'flex-start',
                        alignContent: 'flex-start',
                        alignItems: 'flex-start',
                      },
                    ]}
                  >
                    {'Single, '}
                    {item.tests.length} {item.tests.length > 1 ? 'Persons' : 'Person'}
                  </Text>
                </View>

              </View>
              <Text
                style={[
                  styles.textRight,
                  { fontSize: 14, fontWeight: '800', color: '#8C93A3' },
                ]}
              >
                {(item.amount)}
              </Text>
            </View>
          </View>
        
        
        </TouchableOpacity>
      );
    }

       else if ((data_type.toString() === "DISPATCHER_ASSIGNED"  && item.requestStatus === "DISPATCHER_ASSIGNED") ||(data_type.toString() === "DISPATCHER_ASSIGNED" && item.requestStatus === "DISPATCHER_ASSIGNED" ) && showSpecial === true)  {
      // Case 2: Any other condition
      return (
        <TouchableOpacity
          style={styles.itemFlatList}
          onPress={() =>  typeOfMethod === 'dont'?null:  navigation.navigate('veiw_order', { itemData: item, data_type: data_type })} // Use navigation hook
        >
          <View style={styles.itemFlatList}>
            <View style={styles.row}>
            <View style={styles.row}>
            <Text style={{ paddingRight: 5 }}>
                  {item.lastName} {item.firstName}
                </Text>
              <Text
                style={[styles.labelText, { color: '#0F1D40' }]}
                numberOfLines={1} // Limit to one line
                ellipsizeMode="clip"
              >
                
               
                {
                // item.type_person_single.length > maxLength
                //   ? `${item.type_person_single.substring(0, maxLength)}...` RECEIVED
                //   : 
                  item.type_person_single} 
              </Text>
            </View>

             
              <Text
                style={[
                  styles.textRight,
                  {
                    color: item.requestStatus === 'TESTING_ONGOING' ? 'blue' : '#10B981',
                    fontWeight: '800',
                  },
                ]}
              >
                {item.sampleStatus === 'COLLECTED'? 'Sample collected':item.sampleStatus === 'RECEIVED'?"Sample submitted":item.requestStatus.replaceAll('_', ' ')
     }
              </Text>
            </View>



            <View style={styles.row}>
              <View style={styles.row}>
                
                <View style={styles.borderContainerMin}>
                  <Text
                    style={[
                      styles.textLeft,
                      {
                        fontSize: 14,
                        fontWeight: '800',
                        color: '#8C93A3',
                        justifyContent: 'flex-start',
                        alignContent: 'flex-start',
                        alignItems: 'flex-start',
                      },
                    ]}
                  >
                    {'Single, '}
                    {item.tests.length} {item.tests.length > 1 ? 'Persons' : 'Person'}
                  </Text>
                </View>

              </View>
              <Text
                style={[
                  styles.textRight,
                  { fontSize: 14, fontWeight: '800', color: '#8C93A3' },
                ]}
              >
                {(item.amount)}
              </Text>
            </View>
          </View>
        
        
        </TouchableOpacity>
      );
    }

       else if ((data_type.toString() === "DIRECT_TO_LAB"  && item.requestStatus === "DIRECT_TO_LAB") ||(data_type.toString() === "DIRECT_TO_LAB" && item.requestStatus === "DIRECT_TO_LAB" ) && showSpecial === true)  {
      // Case 2: Any other condition
      return (
        <TouchableOpacity
          style={styles.itemFlatList}
          onPress={() =>  typeOfMethod === 'dont'?null:  navigation.navigate('veiw_order', { itemData: item, data_type: data_type })} // Use navigation hook
        >
          <View style={styles.itemFlatList}>
            <View style={styles.row}>
            <View style={styles.row}>
            <Text style={{ paddingRight: 5 }}>
                  {item.lastName} {item.firstName}
                </Text>
              <Text
                style={[styles.labelText, { color: '#0F1D40' }]}
                numberOfLines={1} // Limit to one line
                ellipsizeMode="clip"
              >
                
               
                {
                // item.type_person_single.length > maxLength
                //   ? `${item.type_person_single.substring(0, maxLength)}...` RECEIVED
                //   : 
                  item.type_person_single} 
              </Text>
            </View>

             
              <Text
                style={[
                  styles.textRight,
                  {
                    color: item.requestStatus === 'DIRECT_TO_LAB' ? 'blue' : '#10B981',
                    fontWeight: '800',
                  },
                ]}
              >
                {item.sampleStatus === 'COLLECTED'? 'Sample collected':item.sampleStatus === 'RECEIVED'?"Sample submitted":item.requestStatus.replaceAll('_', ' ')
     }
              </Text>
            </View>



            <View style={styles.row}>
              <View style={styles.row}>
                
                <View style={styles.borderContainerMin}>
                  <Text
                    style={[
                      styles.textLeft,
                      {
                        fontSize: 14,
                        fontWeight: '800',
                        color: '#8C93A3',
                        justifyContent: 'flex-start',
                        alignContent: 'flex-start',
                        alignItems: 'flex-start',
                      },
                    ]}
                  >
                    {'Single, '}
                    {item.tests.length} {item.tests.length > 1 ? 'Persons' : 'Person'}
                  </Text>
                </View>

              </View>
              <Text
                style={[
                  styles.textRight,
                  { fontSize: 14, fontWeight: '800', color: '#8C93A3' },
                ]}
              >
                {(item.amount)}
              </Text>
            </View>
          </View>
        
        
        </TouchableOpacity>
      );
    }

       else if ((data_type.toString() === "DROP_OFF"  && item.requestStatus === "DROP_OFF") ||(data_type.toString() === "DROP_OFF" && item.requestStatus === "DROP_OFF" ) && showSpecial === true)  {
      // Case 2: Any other condition
      return (
        <TouchableOpacity
          style={styles.itemFlatList}
          onPress={() =>  typeOfMethod === 'dont'?null:  navigation.navigate('veiw_order', { itemData: item, data_type: data_type })} // Use navigation hook
        >
          <View style={styles.itemFlatList}>
            <View style={styles.row}>
            <View style={styles.row}>
            <Text style={{ paddingRight: 5 }}>
                  {item.lastName} {item.firstName}
                </Text>
              <Text
                style={[styles.labelText, { color: '#0F1D40' }]}
                numberOfLines={1} // Limit to one line
                ellipsizeMode="clip"
              >
                
               
                {
                // item.type_person_single.length > maxLength
                //   ? `${item.type_person_single.substring(0, maxLength)}...` RECEIVED
                //   : 
                  item.type_person_single} 
              </Text>
            </View>

             
              <Text
                style={[
                  styles.textRight,
                  {
                    color: item.requestStatus === 'DROP_OFF' ? 'blue' : '#10B981',
                    fontWeight: '800',
                  },
                ]}
              >
                {item.sampleStatus === 'COLLECTED'? 'Sample collected':item.sampleStatus === 'RECEIVED'?"Sample submitted":item.requestStatus.replaceAll('_', ' ')
     }
              </Text>
            </View>



            <View style={styles.row}>
              <View style={styles.row}>
                
                <View style={styles.borderContainerMin}>
                  <Text
                    style={[
                      styles.textLeft,
                      {
                        fontSize: 14,
                        fontWeight: '800',
                        color: '#8C93A3',
                        justifyContent: 'flex-start',
                        alignContent: 'flex-start',
                        alignItems: 'flex-start',
                      },
                    ]}
                  >
                    {'Single, '}
                    {item.tests.length} {item.tests.length > 1 ? 'Persons' : 'Person'}
                  </Text>
                </View>

              </View>
              <Text
                style={[
                  styles.textRight,
                  { fontSize: 14, fontWeight: '800', color: '#8C93A3' },
                ]}
              >
                {(item.amount)}
              </Text>
            </View>
          </View>
        
        
        </TouchableOpacity>
      );
    }
















  }
  
  else{



    if (data_type === "CANCELLED" && item.requestStatus === "CANCELLED") {
      // Case 1: `data_type` and `item.requestStatus` are both "CANCELLED"
      return (
        <TouchableOpacity
          style={styles.itemFlatList}
          onPress={() => navigation.navigate('veiw_order', { itemData: item, data_type: data_type })} // Use navigation hook
        >
          <View style={styles.itemFlatList}>
            <View style={styles.row}>
              <Text
                style={[styles.name, { color: '#0F1D40' }]}
                numberOfLines={1} // Limit to one line
                ellipsizeMode="clip"
              >
                {item.status.length > maxLength
                  ? `${item.status.substring(0, maxLength)}...`
                  : item.status}
              </Text>
              <Text
                style={[
                  styles.textRight,
                  { color: '#FF3236', fontWeight: '800', fontSize: 12, lineHeight: 20.2 },
                ]}
              >
                {item.status}
              </Text>
            </View>
            <View style={styles.row}>
              <View style={styles.row}>
                <Text style={{ paddingRight: 5 }}>
                  {item.lastName} {item.firstName}
                </Text>
                <View style={styles.borderContainerMin}>
                  <Text
                    style={[
                      styles.textLeft,
                      {
                        fontSize: 14,
                        fontWeight: '800',
                        color: '#8C93A3',
                        justifyContent: 'flex-start',
                        alignContent: 'flex-start',
                        alignItems: 'flex-start',
                      },
                    ]}
                  >
                    {item.requestStatus.replaceAll('_', ' ')}
                    {/* {item.tests.length} {item.tests.length > 1 ? 'Persons' : 'Person'} */}
                  </Text>
                </View>
              </View>
              {/* <Text
                style={[
                  styles.textRight,
                  { fontSize: 14, fontWeight: '800', color: '#8C93A3' },
                ]}
              >
                {formatNaira(item.amount)}
              </Text> */}
            </View>
          </View>
        </TouchableOpacity>
      );
    } else if (data_type === "PENDING" && item.requestStatus === "PENDING" && showSpecial)  {
      // Case 2: Any other condition
      return (
        <TouchableOpacity
          style={styles.itemFlatList}
          onPress={() => navigation.navigate('veiw_order', { itemData: item, data_type: data_type })} // Use navigation hook
        >
          <View style={styles.itemFlatList}>
            <View style={styles.row}>
              <Text
                style={[styles.name, { color: '#0F1D40' }]}
                numberOfLines={1} // Limit to one line
                ellipsizeMode="clip"
              >
                {
                // item.status.length > maxLength
                //   ? `${item.status.substring(0, maxLength)}...`
                //   : 
                  item.status}
              </Text>
              <Text
                style={[
                  styles.textRight,
                  {
                    color: item.status === 'PENDING' ? '#DB8C09' : '#10B981',
                    fontWeight: '800',
                  },
                ]}
              >
                {item.requestStatus.replaceAll('_', ' ')}
              </Text>
            </View>
            <View style={styles.row}>
             
                {showSpecial && (<Text>Sample collection date</Text>)}
                <View style={styles.borderContainerMin}>
                {
                showSpecial?(

                <Text  style={[
                  styles.textLeft,
                  {
                    fontSize: 14,
                    fontWeight: '800',
                    color: '#8C93A3',
                    justifyContent: 'flex-start',
                    alignContent: 'flex-start',
                    alignItems: 'flex-start',
                  },
                ]}>
                {item.sampleCollectionDate.toString().split('T')[0]} 
              </Text>
                ):
                (
                  <Text  style={[
                    styles.textLeft,
                    {
                      fontSize: 14,
                      fontWeight: '800',
                      color: '#8C93A3',
                      justifyContent: 'flex-start',
                      alignContent: 'flex-start',
                      alignItems: 'flex-start',
                    },
                  ]}>
                    {item.lastName} {item.firstName}
                  </Text>)

                }
                
                
                
              </View>
              {/* <Text
                style={[
                  styles.textRight,
                  { fontSize: 14, fontWeight: '800', color: '#8C93A3' },
                ]}
              >
                {formatNaira(item.amount)}
              </Text> */}
            </View>
          </View>
        </TouchableOpacity>
      );
    } 
    // else if ((data_type === "SCHEDULED" && item.requestStatus === "TESTING_ONGOING") ||(data_type === "SCHEDULED" && item.requestStatus === "SCHEDULED") && showSpecial === false)  {
    //   // Case 2: Any other condition
    //   return (
    //     <TouchableOpacity
    //       style={styles.itemFlatList}
    //       onPress={() => navigation.navigate('veiw_order', { itemData: item, data_type: data_type })} // Use navigation hook
    //     >
    //       <View style={styles.itemFlatList}>
    //         <View style={styles.row}>
    //           <Text
    //             style={[styles.name, { color: '#0F1D40' }]}
    //             numberOfLines={1} // Limit to one line
    //             ellipsizeMode="clip"
    //           >
                
    //             {item.status// > maxLength
    //               ? `${item.status.substring(0, maxLength)}...`
    //               : item.status}
    //           </Text>
    //           <Text
    //             style={[
    //               styles.textRight,
    //               {
    //                 color: item.status === 'ONGOING' ? 'yellow' : '#10B981',
    //                 fontWeight: '800',
    //               },
    //             ]}
    //           >
    //             {item.status}
    //           </Text>
    //         </View>
    //         <View style={styles.row}>
    //           <View style={styles.row}>
    //             <Text style={{ paddingRight: 5 }}>
    //               {item.lastName} {item.firstName}
    //             </Text>
    //             <View style={styles.borderContainerMin}>
    //               <Text
    //                 style={[
    //                   styles.textLeft,
    //                   {
    //                     fontSize: 14,
    //                     fontWeight: '800',
    //                     color: '#8C93A3',
    //                     justifyContent: 'flex-start',
    //                     alignContent: 'flex-start',
    //                     alignItems: 'flex-start',
    //                   },
    //                 ]}
    //               >
    //                 {item.requestStatus}
    //                 {/* {'Consultation'} */}
    //                 {/* {item.tests.length} {item.tests.length > 1 ? 'Persons' : 'Person'} */}
    //               </Text>
    //             </View>
    //           </View>
    //           {/* <Text
    //             style={[
    //               styles.textRight,
    //               { fontSize: 14, fontWeight: '800', color: '#8C93A3' },
    //             ]}
    //           >
    //             {formatNaira(item.amount)}
    //           </Text> */}
    //         </View>
    //       </View>
    //     </TouchableOpacity>
    //   );
    // }
  }
  }
  ;
  
  return (
    <FlatList
      data={data}
      renderItem={renderItem}
      keyExtractor={(item) => item.id.toString()}
      contentContainerStyle={[styles.listFlatList]}
    />
  );
};

export default CustomFlatList;


// import React from 'react';
// import { FlatList, Text, TouchableOpacity } from 'react-native';
// import styles from './utils/styles';  // Assuming you have a styles file

// const CustomFlatList = ({ data, navigation }) => {
//   const maxLength = 20;

//   const renderItem = ({ item }) => (
//     <TouchableOpacity
//       style={styles.item}
//       onPress={() => navigation.navigate('ViewOrder', { itemData: item })}  // Correct screen name
//     >
//       <Text>Yop</Text>
//     </TouchableOpacity>
//   );

//   return (
//     <FlatList
//       data={data}
//       renderItem={renderItem}
//       keyExtractor={(item) => item.id.toString()}
//       contentContainerStyle={[styles.listFlatList]}
//     />
//   );
// };

// export default CustomFlatList;


// import React from 'react';
// import { FlatList, Text, StyleSheet, View, Dimensions, TouchableOpacity } from 'react-native';
// import styles from './utils/styles';

// const CustomFlatList = ({ data, navigation}) => {
//       // Maximum number of characters allowed before truncation
//   const maxLength = 20;

//   const renderItem = ({ item }) => (
// <TouchableOpacity
//       style={styles.item}
//       onPress={() => navigation.navigate('veiw_order', { itemData: item })}  // Pass data to Details screen
//     >
//       <Text>Yop</Text>
//     </TouchableOpacity>


    
//   );

//   return (
//     <FlatList
//       data={data}
//       renderItem={renderItem}
//       keyExtractor={(item) => item.id.toString()}
//       contentContainerStyle={[styles.listFlatList, ]}
//     />
//   );
// };

// export default CustomFlatList;


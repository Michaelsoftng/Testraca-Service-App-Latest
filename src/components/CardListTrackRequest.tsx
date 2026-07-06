import React, { useState } from 'react';
import { View, Text, FlatList, TouchableOpacity, StyleSheet } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import formatNaira from './FormatNaira';
import styles_ from './utils/styles';
import CompleteIndicator from './../assets/images/svg-icon/complete';
import OnGoing from './../assets/images/svg-icon/ongoing';
import Pending from './../assets/images/svg-icon/pending';
const CardListTrackRequest = ({ data, tests}) => {
    
  // console.log('LEXXX:: ', data.trackTest);
  console.log('ALEXXX:: ', tests.testData);
  // console.log('ALEXXXxx:: ', tests.testData.samepleDropOffDate);
    const [currentPage, setCurrentPage] = useState(1);
    const [selectedItem, setSelectedItem] = useState(null);

    const renderItem = ({ item }) => {
        let IndicatorComponent;
         let status;
        console.error('::::::: ',tests.testData.requestStatus) 

        if (tests.testData.requestStatus === 'PENDING' || tests.testData.requestStatus ===  'REQUEST_PLACED' ||  tests.testData.requestStatus === 'REQUEST_ACCEPTED' || tests.testData.requestStatus === 'REQUEST_PLACED') {
          console.error('::::::: 333 ',tests.testData.requestStatus) 
          if (item.id === 1) {
            IndicatorComponent = <CompleteIndicator width="50" height="55" />;
            status = 'done';
          } 
          else if (item.id === 2) {
            IndicatorComponent = <OnGoing width="50" height="55" />;
            status = 'pending';
          } else {
            IndicatorComponent = <Pending width="50" height="55" />;
            status = 'pending';
          }
        } 
        
        else if (tests.testData.requestStatus === 'TESTING_ONGOING' || tests.testData.requestStatus === "SAMPLE_RECEIVED"  || tests.testData.requestStatus === "SAMPLE_COLLECTED") {
          if ([1, 2, 3, 4, 5].includes(item.id)) {
            IndicatorComponent = <CompleteIndicator width="50" height="55" />;
            status = 'done';
          } else if (item.id === 6) {
            IndicatorComponent = <OnGoing width="50" height="55" />;
            status = 'pending';
          } else {
            status = 'pending';
            IndicatorComponent = <Pending width="50" height="55" />;
          }
        } else if (tests.testData.requestStatus === 'COMPLETED' || tests.testData.requestStatus === 'REQUEST_COMPLETED') {
          IndicatorComponent = <CompleteIndicator width="50" height="55" />;
          status = 'done';
        }



        
        return (
            <View style={[styles.row, {}]}>
  <View style={[styles.column_, {flex: 1, maxWidth: 50}]}>
    {IndicatorComponent}
  </View>
  <View style={[styles.column_, {flex: 1}]}>
    <View style={[styles.card, {backgroundColor:'#F5F6F7'}]}>
      {/* Slots Information */}
      <View style={styles.slotInfo}>
        <Text style={[styles.facilityText, {fontSize:18, fontWeight:'700'}]}>

           {(() => {
    const total = tests.testData.testRequest.length || 0;
    const testRequests = tests.testData.testRequest || [];

    // Status counts
    const collectedCount = testRequests.filter(t => t.status === "SAMPLE_COLLECTED" || t.status === "SAMPLE_RECEIVED").length;
    const receivedCount = testRequests.filter(t => t.status === "SAMPLE_RECEIVED" || t.status === "SAMPLE_COLLECTED" ).length;
    const submittedCount = testRequests.filter(t => t.status === "SAMPLE_SUBMITTED").length;
    const testedCount = testRequests.filter(t => t.status === "SAMPLE_TESTED").length;
    const resultReadyCount = testRequests.filter(t => t.status === "RESULT_READY").length;
    const resultSentCount = testRequests.filter(t => t.status === "REQUEST_COMPLETED").length;

    // For each item, show the right count/total and label
    switch (item.id) {
      case 3: // Sample collected
        return `${collectedCount + resultSentCount}/${total} Sample collected`;
      case 4: // Sample submitted
        return `${receivedCount + resultSentCount }/${total} Sample submitted`;
      case 5: // Sample received
        return `${receivedCount + resultSentCount }/${total} Sample received`;
      case 6: // Sample tested
        return `${resultSentCount}/${total} Sample tested`;
      case 7: // Result ready
        return `${resultSentCount}/${total} Result ready`;
      case 8: // Result sent
        return `${resultSentCount }/${total} Result sent`;
      default:
        return item.title;
    }
  })()}

          {/* {item.title === 'Sample received' ? tests.testData.testRequest.filter(items => items.patientName !== null).length+'/'+tests.testData.testRequest.length  +' Sample received': item.title } */}
          {/* {item.title === 'Sample received' || item.title === 'Sample tested' || item.title === 'Result ready' || item.title === 'Result sent' ||  item.title === 'Sample submitted' ||  item.title ===  'Sample collected'? 
          
          status === "done" ?tests.testData.testRequest.filter(items => items.patientName !== null).length+'/'+tests.testData.testRequest.length  +` ${item.title }` :0: item.title } */}
          </Text>
        <Text style={[styles.distanceText, { fontSize: 12, fontWeight:'600' }]}>{item.sub}</Text>
      </View>
      {/* <View style={styles.column_}></View> */}
    </View>
  </View>
</View>
        );
      };
// // "requestStatus": "PENDING", "samepleDropOffDate": null, "sampleCollectionDate": "2025-01-10T21:03:45.834000+00:00",
//     const renderItem = ({ item }) => (
//         <View style={styles.row}>
//         <View style={styles.column_}>
            
//          {/* {IndicatorComponent} */}
//         </View>
//             <View style={styles.column_}>
//             <View style={styles.card}>
           
//             {/* Slots Information */}
//             <View style={styles.slotInfo}>
//                 <Text style={styles.facilityText}>
//                     {item.title}
//                 </Text>
//                 <Text style={[styles.distanceText, {fontSize:10,}]}>
//                     {item.sub}
//                 </Text>
//             </View>
//             <View style={styles.column_}>                           
//             </View>            
//         </View>
//             </View>
//         </View>
//     );

    return (
        <View style={styles.container}>
            <FlatList
                data={data.trackTest}
                renderItem={renderItem}
                keyExtractor={(item, index) => item.id || index.toString()}
                numColumns={1}
                showsVerticalScrollIndicator={false}
            />
        </View>
    );
};

export default CardListTrackRequest;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 10,
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
    radioButton: {
        marginRight: 10,
    },
    slotInfo: {
        flex: 1,
        alignItems: 'flex-start',
    },
    facilityText: {
        fontSize: 12,
        color: '#555',
    },
    distanceText: {
        fontSize: 12,
        color: '#888',
    },
    priceText: {
        fontSize: 12,
        color: '#059669',
    },
    moreButton: {
        borderRadius: 5,
        alignItems: 'center',
        marginTop: 10,
    },
    moreButtonText: {
        color: '#059669',
        fontSize: 14,
        fontWeight: '700',
    },
    column_: {
        flex: 1,
        flexDirection: 'column',
        justifyContent: 'flex-end',
    },
    row: {
        flexDirection: 'row',
        justifyContent: 'flex-start', // Push items to edges
        paddingHorizontal: 2,           // Add some horizontal padding
        alignItems: 'center',            // Vertically center the text
        marginVertical: 5,              // Add vertical space
      },
});

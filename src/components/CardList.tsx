import React, { useState } from 'react';
import { View, Text, FlatList, TouchableOpacity, StyleSheet } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import formatNaira from './FormatNaira';
import styles_ from './utils/styles';
const CardList = ({ data, itemsPerPage = 2, onSelectItem, distannce }) => {
    
    const [currentPage, setCurrentPage] = useState(1);
    const [selectedItem, setSelectedItem] = useState(null);

    // Displayed data based on pagination
    const displayedData = data.facilityTests.slice(0, currentPage * itemsPerPage);

    const loadMoreSlots = () => {
        if (displayedData.length < data.facilityTests.length) {
            setCurrentPage((prev) => prev + 1);
        }
    };

    const handleSelect = (item) => {
        const newItem = item === selectedItem ? null : item; // Toggle selection
        setSelectedItem(newItem);
        if (onSelectItem) {
            onSelectItem(newItem); // Notify parent component
        }
    };

    const renderItem = ({ item }) => (
        <View style={styles.card}>
            {/* Selectable Radio Button */}
            <TouchableOpacity onPress={() => handleSelect(item)} style={styles.radioButton}>
                <Icon
                    name={item === selectedItem ? "radio-button-checked" : "radio-button-unchecked"}
                    size={16}
                    color={item === selectedItem ? "#059669" : "#555"}
                />
            </TouchableOpacity>

            {/* Slots Information */}
            <View style={styles.slotInfo}>
                <Text style={styles.facilityText}>
                    {item.facility.facilityName} ({item.facility.facilityType})
                </Text>
                <Text style={[styles.distanceText, {fontSize:10,}]}>
                    Distance: {item.distance ? `${item.distance.toFixed(2)} KM` : 'N/A'}
                </Text>
            </View>

            <View style={styles.column_}>
            <View style={styles_.row}>
            <Text style={[styles.priceText, {fontSize:9,fontWeight:'800'}]}><Text style={[{fontWeight:'200'}]}>{'Price:'}</Text> {formatNaira(item.price)}</Text>
                 {/* <Text style={styles.priceText}>{formatNaira(item.price)}</Text> */}
                 </View>
                 <View style={styles_.row}>
            <Text style={[styles.priceText, {fontSize:9, fontWeight:'700'}]}>{'Dist. Price:'} {item.distance ? formatNaira((distannce*item.distance)): 'N/A'}</Text>
                 {/* <Text style={styles.priceText}>{formatNaira(item.price)}</Text> */}
                 </View>
            </View>
            
        </View>
    );

    return (
        <View style={styles.container}>
            <FlatList
                data={displayedData}
                renderItem={renderItem}
                keyExtractor={(item, index) => item.facility.id || index.toString()}
                numColumns={1}
                showsVerticalScrollIndicator={false}
            />

            {/* "More Slots" Button */}
            {displayedData.length < data.facilityTests.length && (
                <TouchableOpacity style={styles.moreButton} onPress={loadMoreSlots}>
                    <Text style={styles.moreButtonText}>More Facilities</Text>
                </TouchableOpacity>
            )}
        </View>
    );
};

export default CardList;

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
});



// import React, { useState } from 'react';
// import { View, Text, FlatList, TouchableOpacity, StyleSheet } from 'react-native';
// import Icon from 'react-native-vector-icons/MaterialIcons';

// const CardList = ({ data, itemsPerPage = 2 }) => {
//     const [currentPage, setCurrentPage] = useState(1);
//     const [selectedItem, setSelectedItem] = useState(null);

//     const displayedData = data.facilityTests.slice(0, currentPage * itemsPerPage);

  
//     const loadMoreSlots = () => {
//         if (displayedData.length < data.facilityTests.length) {
//             setCurrentPage(prev => prev + 1);
//         }
//     };

//     const handleSelect = (item) => {
//         setSelectedItem(item === selectedItem ? null : item); // Toggle selection
//     };

//     const renderItem = ({ item }) => (
//         <View style={styles.card}>
//             {/* Selectable Radio Button */}
//             <TouchableOpacity onPress={() => handleSelect(item)} style={styles.radioButton}>
//                 <Icon
//                     name={item === selectedItem ? "radio-button-checked" : "radio-button-unchecked"}
//                     size={24}
//                     color= {item === selectedItem ? "#059669" : "#555"}
//                 />
//             </TouchableOpacity>

//             {/* Slots Information */}
//             <View style={styles.slotInfo}>
//                 {/* <Text style={styles.slotText}>Test: {item.test.name}</Text> */}
//                 <Text style={styles.facilityText}>{item.facility.facilityName} ({item.facility.facilityType})</Text>
//                 <Text style={styles.distanceText}>
//                     Distance: {item.distance ? `${item.distance.toFixed(2)} KM` : 'N/A'}
//                 </Text>
//                 {/* <Text style={styles.priceText}>Price: {item.price}</Text> */}
//             </View>
//             <Text style={styles.priceText}>NGN {item.price}</Text>
//             {/* Time Placeholder */}
//             {/* <Text style={styles.time}>{item.time || 'Time not available'}</Text> */}
//         </View>
//     );

//     return (
//         <View style={styles.container}>
//             <FlatList
//                 data={displayedData}
//                 renderItem={renderItem}
//                 keyExtractor={(item, index) => item.facility.id}
//                 numColumns={1}
//                 showsVerticalScrollIndicator={false}
//             />

//             {/* "More Slots" Button */}
//             {displayedData.length < data.facilityTests.length && (
//                 <TouchableOpacity style={styles.moreButton} onPress={loadMoreSlots}>
//                     <Text style={styles.moreButtonText}>More Facilities</Text>
//                 </TouchableOpacity>
//             )}
//         </View>
//     );
// };

// export default CardList;

// const styles = StyleSheet.create({
//     container: {
//         flex: 1,
//         padding: 10,
//     },
//     card: {
//         flexDirection: 'row',
//         alignItems: 'center',
//         padding: 15,
//         borderWidth: 1,
//         borderColor: '#ddd',
//         borderRadius: 8,
//         marginBottom: 10,
//         backgroundColor: '#fff',
//         justifyContent: 'space-between',
//     },
//     radioButton: {
//         marginRight: 10,
//     },
//     slotInfo: {
//         flex: 1,
//         alignItems: 'flex-start',
//     },
//     slotText: {
//         fontSize: 14,
//         color: '#333',
//     },
//     facilityText: {
//         fontSize: 12,
//         color: '#555',
//     },
//     distanceText: {
//         fontSize: 12,
//         color: '#888',
//     },
//     priceText: {
//         fontSize: 12,
//         color: '#059669',
//     },
//     time: {
//         fontSize: 14,
//         color: '#333',
//     },
//     moreButton: {
//         borderRadius: 5,
//         alignItems: 'center',
//         marginTop: 10,
//     },
//     moreButtonText: {
//         color: '#059669',
//         fontSize: 14,
//         fontWeight: '700',
//     },
// });

// import React, { useState } from 'react';
// import { View, Text, FlatList, TouchableOpacity, StyleSheet } from 'react-native';
// import Icon from 'react-native-vector-icons/MaterialIcons';

// const CardList = ({ data, itemsPerPage = 4 }) => {
//     const [currentPage, setCurrentPage] = useState(1);
//     const [selectedItem, setSelectedItem] = useState(null);

//     const displayedData = data.slice(0, currentPage * itemsPerPage);

//     const loadMoreSlots = () => {
//         if (displayedData.length < data.length) {
//             setCurrentPage(prev => prev + 1);
//         }
//     };

//     const handleSelect = (item) => {
//         setSelectedItem(item === selectedItem ? null : item); // Toggle selection
//     };

//     const renderItem = ({ item }) => (
//         <View style={styles.card}>
//             {/* Selectable Radio Button */}
//             <TouchableOpacity onPress={() => handleSelect(item)} style={styles.radioButton}>
//                 <Icon
//                     name={item === selectedItem ? "radio-button-checked" : "radio-button-unchecked"}
//                     size={24}
//                     color= {item === selectedItem ?  "#059669": "#555"}
//                 />
//             </TouchableOpacity>

//             {/* Slots Information */}
//             <View style={styles.slotInfo}>
//                 <Text style={styles.slotText}> FCT ({item.facilityTests.distance}KM)</Text>
//                 <Text style={styles.availableText}>{item.availableSlots} address</Text>
//             </View>

//             {/* Time */}
//             <Text></Text>
//             <Text style={styles.time}>{item.time}</Text>
//         </View>
//     );

//     return (
//         <View style={styles.container}>
//             <FlatList
//                 data={displayedData}
//                 renderItem={renderItem}
//                 keyExtractor={(item, index) => index.toString()}
//                 numColumns={1}
//                 showsVerticalScrollIndicator={false}
//             />

//             {/* "More Slots" Button */}
//             {displayedData.length < data.length && (
//                 <TouchableOpacity style={styles.moreButton} onPress={loadMoreSlots}>
//                     <Text style={styles.moreButtonText}>More Facilities</Text>
//                 </TouchableOpacity>
//             )}
//         </View>
//     );
// };

// export default CardList;

// const styles = StyleSheet.create({
//     container: {
//         flex: 1,
//         padding: 10,
//     },
//     card: {
//         flexDirection: 'row',
//         alignItems: 'center',
//         padding: 15,
//         borderWidth: 1,
//         borderColor: '#ddd',
//         borderRadius: 8,
//         marginBottom: 10,
//         backgroundColor: '#fff',
//         justifyContent: 'space-between',
//     },
//     radioButton: {
//         marginRight: 10,
//     },
//     slotInfo: {
//         flex: 1,
//         alignItems: 'flex-start',
//     },
//     slotText: {
//         fontSize: 14,
//         color: '#333',
//     },
//     availableText: {
//         fontSize: 12,
//         color: '#888',
//     },
//     time: {
//         fontSize: 14,
//         color: '#333',
//     },
//     moreButton: {
//         borderRadius: 5,
//         alignItems: 'left',
//         marginTop: 10,
//     },
//     moreButtonText: {
//         color: '#059669',
//         fontSize: 14,
//         fontWeight: '700',
//     },
// });

import React, { useState } from 'react';
import { View, TextInput, FlatList, Text, StyleSheet, TouchableOpacity } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons'; // Import the icon
import styles_ from './utils/styles'; // Import your centralized styles
const CustomInputDropdown = ({ data, placeholder, onSelectItem }) => {
    const [inputText, setInputText] = useState('');
    const [filteredData, setFilteredData] = useState([]);
    const [showDropdown, setShowDropdown] = useState(false);

    const handleInputChange = (text) => {
        setInputText(text);
        if (text.length > 0) {
            const filtered = data.filter(item => 
                item.toLowerCase().includes(text.toLowerCase())
            );
            setFilteredData(filtered);
            setShowDropdown(true);
        } else {
            setShowDropdown(false);
        }
    };

    const handleSelectItem = (item) => {
        setInputText(item);
        setShowDropdown(false);
        onSelectItem(item);  // Trigger the callback function if provided
    };

    const renderDropdownItem = ({ item }) => (
        <TouchableOpacity onPress={() => handleSelectItem(item)}>
            <Text style={styles.dropdownItem}>{item}</Text>
        </TouchableOpacity>
    );

    return (
        <View style={styles_.searchContainerSearch}>
            <View style={styles.inputContainer}>
                <TextInput
                    // style={styles.input}
                    style={styles_.inputSearch}
                    placeholder={placeholder}
                    value={inputText}
                    onChangeText={handleInputChange}
                />
                <Icon 
                    name="arrow-drop-down" 
                    size={24} 
                    color="#555" 
                    style={styles.icon} 
                    onPress={() => setShowDropdown(!showDropdown)}
                />
            </View>
            {showDropdown && (
                <FlatList
                    style={styles.dropdown}
                    data={filteredData}
                    keyExtractor={(item, index) => index.toString()}
                    renderItem={renderDropdownItem}
                />
            )}
        </View>
    );
};

export default CustomInputDropdown;

const styles = StyleSheet.create({
    container: {
        width: '90%',
        alignSelf: 'center',
        marginTop: 20,
    },
    inputContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        borderWidth: 1,
        borderColor: '#FFF',
        borderRadius: 5,
        // backgroundColor: '#fff',
        paddingRight: 10,  // Added space for icon
    },
    input: {
        flex: 1,
        padding: 10,
    },
    icon: {
        marginLeft: 5,
    },
    dropdown: {
        maxHeight: 150,
        backgroundColor: '#fff',
        borderWidth: 1,
        borderColor: '#ccc',
        borderRadius: 5,
        marginTop: 5,
    },
    dropdownItem: {
        padding: 10,
        borderBottomWidth: 1,
        borderBottomColor: '#eee',
    },
});


// import React, { useState } from 'react';
// import { View, TextInput, FlatList, Text, StyleSheet, TouchableOpacity } from 'react-native';

// const CustomInputDropdown = ({ data, placeholder, onSelectItem }) => {
//     const [inputText, setInputText] = useState('');
//     const [filteredData, setFilteredData] = useState([]);
//     const [showDropdown, setShowDropdown] = useState(false);

//     const handleInputChange = (text) => {
//         setInputText(text);
//         if (text.length > 0) {
//             const filtered = data.filter(item => 
//                 item.toLowerCase().includes(text.toLowerCase())
//             );
//             setFilteredData(filtered);
//             setShowDropdown(true);
//         } else {
//             setShowDropdown(false);
//         }
//     };

//     const handleSelectItem = (item) => {
//         setInputText(item);
//         setShowDropdown(false);
//         onSelectItem(item);  // Trigger the callback function if provided
//     };

//     const renderDropdownItem = ({ item }) => (
//         <TouchableOpacity onPress={() => handleSelectItem(item)}>
//             <Text style={styles.dropdownItem}>{item}</Text>
//         </TouchableOpacity>
//     );

//     return (
//         <View style={styles.container}>
//             <TextInput
//                 style={styles.input}
//                 placeholder={placeholder}
//                 value={inputText}
//                 onChangeText={handleInputChange}
//             />
//             {showDropdown && (
//                 <FlatList
//                     style={styles.dropdown}
//                     data={filteredData}
//                     keyExtractor={(item, index) => index.toString()}
//                     renderItem={renderDropdownItem}
//                 />
//             )}
//         </View>
//     );
// };

// export default CustomInputDropdown;

// const styles = StyleSheet.create({
//     container: {
//         width: '90%',
//         alignSelf: 'center',
//         marginTop: 20,
//     },
//     input: {
//         borderWidth: 1,
//         borderColor: '#ccc',
//         padding: 10,
//         borderRadius: 5,
//         backgroundColor: '#fff',
//     },
//     dropdown: {
//         maxHeight: 150,
//         backgroundColor: '#fff',
//         borderWidth: 1,
//         borderColor: '#ccc',
//         borderRadius: 5,
//         marginTop: 5,
//     },
//     dropdownItem: {
//         padding: 10,
//         borderBottomWidth: 1,
//         borderBottomColor: '#eee',
//     },
// });


// // import React, { useState } from 'react';
// // import { View, TextInput, Text, TouchableOpacity, FlatList, StyleSheet } from 'react-native';

// // const CustomInputDropdown = ({ data, placeholder, onSelect }) => {
// //   const [input, setInput] = useState('');
// //   const [filteredData, setFilteredData] = useState([]);
// //   const [dropdownVisible, setDropdownVisible] = useState(false);

// //   const handleInputChange = (text) => {
// //     setInput(text);
// //     if (text.length > 0) {
// //       const newData = data.filter((item) =>
// //         item.toLowerCase().includes(text.toLowerCase())
// //       );
// //       setFilteredData(newData);
// //       setDropdownVisible(newData.length > 0);
// //     } else {
// //       setDropdownVisible(false);
// //     }
// //   };

// //   const handleSelect = (item) => {
// //     setInput(item);
// //     setDropdownVisible(false);
// //     onSelect(item);
// //   };

// //   const renderDropdownItem = ({ item }) => (
// //     <TouchableOpacity style={styles.dropdownItem} onPress={() => handleSelect(item)}>
// //       <Text style={styles.dropdownItemText}>{item}</Text>
// //     </TouchableOpacity>
// //   );

// //   return (
// //     <View style={styles.container}>
// //       <TextInput
// //         style={styles.input}
// //         placeholder={placeholder}
// //         value={input}
// //         onChangeText={handleInputChange}
// //       />
// //       {dropdownVisible && (
// //         <View style={styles.dropdown}>
// //           <FlatList
// //             data={filteredData}
// //             keyExtractor={(item, index) => index.toString()}
// //             renderItem={renderDropdownItem}
// //           />
// //         </View>
// //       )}
// //     </View>
// //   );
// // };

// // const styles = StyleSheet.create({
// //   container: {
// //     width: '100%',
// //     marginVertical: 10,
// //   },
// //   input: {
// //     height: 40,
// //     borderWidth: 1,
// //     borderColor: '#ccc',
// //     borderRadius: 8,
// //     paddingLeft: 10,
// //   },
// //   dropdown: {
// //     backgroundColor: '#fff',
// //     borderWidth: 1,
// //     borderColor: '#ccc',
// //     borderRadius: 8,
// //     marginTop: 5,
// //     maxHeight: 150,
// //   },
// //   dropdownItem: {
// //     padding: 10,
// //   },
// //   dropdownItemText: {
// //     fontSize: 16,
// //   },
// // });

// // export default CustomInputDropdown;

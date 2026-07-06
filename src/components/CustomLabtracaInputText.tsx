import React, { useState } from 'react';
import { TextInput, View, TouchableOpacity, StyleSheet, Text } from 'react-native';
import { Ionicons } from '@expo/vector-icons'; // Or use react-native-vector-icons
import styles from './utils/styles';

const CustomLabtracaInputText = ({
  
  title,
  placeholder,
  isPassword = false,
  keyboardType,
  onChangeText,
  value,
  leftIcon,      // Left icon for regular input
  passwordIconVisible,  // Icon when password is visible
  passwordIconHidden,   // Icon when password is hidden
  errorMessage,  // Custom error/warning message
  backStyle,
  textArea = false
}) => {
  const [isPasswordVisible, setPasswordVisible] = useState(false);
  const [isFocused, setFocused] = useState(false);

  // Toggle password visibility
  const togglePasswordVisibility = () => {
    setPasswordVisible(!isPasswordVisible);
  };

  // Determine the border color based on focus and validation
  const getBorderColor = () => {
    if (errorMessage) return 'red'; // Show red border if there is an error message
    if (isFocused) return '#059669';  // Show green border if the input is focused
    return value ? '#059669' : '#E2E4E8'; // Show green if there's input, otherwise gray
  };

  return (
    <View style={styles.containerBackGround}>
      {title ? <Text style={styles.labelText}>{title}</Text> : null}
      <View style={[styles.inputContainer, backStyle, { borderColor: getBorderColor() }]}>
        {/* Dynamic Left Icon */}
        {leftIcon && (
          <Ionicons
            name={leftIcon}
            size={20}
            color="#666"            
            style={styles.inputIcon}
          />
        )}
        
        {/* Text Input */}
        <TextInput 
          style={[styles.inputInput, backStyle]}
          placeholder={placeholder}
          onChangeText={onChangeText}
          value={value}
          secureTextEntry={isPassword && !isPasswordVisible} // Toggle password visibility
          placeholderTextColor="#525C76"
          keyboardType={keyboardType}
          onFocus={() => setFocused(true)}  // Set focus state
          onBlur={() => setFocused(false)}  // Unset focus state
          multiline={textArea} // Enable multiline input
          numberOfLines={textArea?4:1}
          textAlignVertical="top"
        />

        {/* Right Icon for Password Visibility */}
        {isPassword && (
          <TouchableOpacity onPress={togglePasswordVisibility} style={styles.inputToggleIcon}>
            <Ionicons
              name={isPasswordVisible ? passwordIconVisible : passwordIconHidden}
              size={20}
              color="#666"
            />
          </TouchableOpacity>
        )}
      </View>

      {/* Display Error or Warning Message */}
      {errorMessage ? <Text style={styles.errorText}>{errorMessage}</Text> : null}
    </View>
  );
};

// const styles = StyleSheet.create({
//   container: {
//     marginVertical: 10,
//   },
//   inputContainer: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     backgroundColor: '#f0f0f0',
//     borderRadius: 8,
//     paddingHorizontal: 10,
//     borderWidth: 1,
//   },
//   icon: {
//     marginRight: 10,
//   },
//   input: {
//     flex: 1,
//     fontSize: 16,
//     color: '#333',
//     paddingVertical: 10,
//   },
//   toggleIcon: {
//     padding: 5,
//   },
//   errorText: {
//     color: 'red',
//     fontSize: 12,
//     marginTop: 5,
//   },
// });

export default CustomLabtracaInputText;

// import React, { useState } from 'react';
// import { TextInput, View, TouchableOpacity, StyleSheet, Text } from 'react-native';
// import { Ionicons } from '@expo/vector-icons'; // Or use react-native-vector-icons
// import styles from './utils/styles';

// const CustomLabtracaInputText = ({
  
//   title,
//   placeholder,
//   isPassword = false,
//   keyboardType,
//   onChangeText,
//   value,
//   leftIcon,      // Left icon for regular input
//   passwordIconVisible,  // Icon when password is visible
//   passwordIconHidden,   // Icon when password is hidden
//   errorMessage,  // Custom error/warning message
// }) => {
//   const [isPasswordVisible, setPasswordVisible] = useState(false);
//   const [isFocused, setFocused] = useState(false);

//   // Toggle password visibility
//   const togglePasswordVisibility = () => {
//     setPasswordVisible(!isPasswordVisible);
//   };

//   // Determine the border color based on focus and validation
//   const getBorderColor = () => {
//     if (errorMessage) return 'red'; // Show red border if there is an error message
//     if (isFocused) return '#059669';  // Show green border if the input is focused
//     return value ? '#059669' : '#E2E4E8'; // Show green if there's input, otherwise gray
//   };

//   return (
//     <View style={styles.containerBackGround}>
//       {title ? <Text style={styles.labelText}>{title}</Text> : null}
//       <View style={[styles.inputContainer, { borderColor: getBorderColor() }]}>
//         {/* Dynamic Left Icon */}
//         {leftIcon && (
//           <Ionicons
//             name={leftIcon}
//             size={20}
//             color="#666"            
//             style={styles.inputIcon}
//           />
//         )}
        
//         {/* Text Input */}
//         <TextInput
//           style={styles.inputInput}
//           placeholder={placeholder}
//           onChangeText={onChangeText}
//           value={value}
//           secureTextEntry={isPassword && !isPasswordVisible} // Toggle password visibility
//           placeholderTextColor="#525C76"
//           keyboardType={keyboardType}
//           onFocus={() => setFocused(true)}  // Set focus state
//           onBlur={() => setFocused(false)}  // Unset focus state
//         />

//         {/* Right Icon for Password Visibility */}
//         {isPassword && (
//           <TouchableOpacity onPress={togglePasswordVisibility} style={styles.inputToggleIcon}>
//             <Ionicons
//               name={isPasswordVisible ? passwordIconVisible : passwordIconHidden}
//               size={20}
//               color="#666"
//             />
//           </TouchableOpacity>
//         )}
//       </View>

//       {/* Display Error or Warning Message */}
//       {errorMessage ? <Text style={styles.errorText}>{errorMessage}</Text> : null}
//     </View>
//   );
// };

// // const styles = StyleSheet.create({
// //   container: {
// //     marginVertical: 10,
// //   },
// //   inputContainer: {
// //     flexDirection: 'row',
// //     alignItems: 'center',
// //     backgroundColor: '#f0f0f0',
// //     borderRadius: 8,
// //     paddingHorizontal: 10,
// //     borderWidth: 1,
// //   },
// //   icon: {
// //     marginRight: 10,
// //   },
// //   input: {
// //     flex: 1,
// //     fontSize: 16,
// //     color: '#333',
// //     paddingVertical: 10,
// //   },
// //   toggleIcon: {
// //     padding: 5,
// //   },
// //   errorText: {
// //     color: 'red',
// //     fontSize: 12,
// //     marginTop: 5,
// //   },
// // });

// export default CustomLabtracaInputText;

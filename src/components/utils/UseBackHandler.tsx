import { useEffect, useCallback } from 'react';
import { BackHandler, Alert } from 'react-native';

const useBackHandler = (isRootScreen) => {
  const backAction = useCallback(() => {
    if (isRootScreen) {
      Alert.alert(
        'Exit',
        'Do you want to go back?',
        [
          { text: 'No', style: 'cancel' },
          { text: 'Yes', onPress: () => BackHandler.exitApp() },
        ],
        { cancelable: false }
      );
      return true; // Prevents the default back action
    }
    return false; // Allows default back action for other screens
  }, [isRootScreen]);

  useEffect(() => {
    const backHandler = BackHandler.addEventListener('hardwareBackPress', backAction);

    return () => {
      backHandler.remove();
      console.log('Cleaning up back handler');
    };
  }, [backAction]);

  return null;
};

export default useBackHandler;

// import { useEffect } from 'react';
// import { BackHandler, Alert } from 'react-native';

// const useBackHandler = (isRootScreen) => {
//   useEffect(() => {
//     const backAction = () => {
//       if (isRootScreen) {
//         console.log('Back button pressed on root screen');
//         Alert.alert(
//           'Exit',
//           'Do you want to go back?',
//           [
//             { text: 'No', style: 'cancel' },
//             { text: 'Yes', onPress: () => BackHandler.exitApp() },
//           ],
//           { cancelable: false }
//         );
//         return true; // Prevents the default back action
//       }
//       return false; // Allows default back action for other screens
//     };

//     const backHandler = BackHandler.addEventListener('hardwareBackPress', backAction);

//     return () => {
//       console.log('Cleaning up back handler');
//       backHandler.remove();
//     };
//   }, [isRootScreen]);
// };

// export default useBackHandler;


// import { useEffect } from 'react';
// import { BackHandler } from 'react-native';
// import { useNavigationState } from '@react-navigation/native';

// const useBackHandler = (isRootScreen) => {
//   useEffect(() => {
//     const backAction = () => {
//       if (isRootScreen) {
//         console.log('DDADA ::: ', isRootScreen);
//         // Custom back behavior (e.g., show an alert or prevent exit)
//         return true;  // Indicates that the back action has been handled
//       }
//       return false; // Let the navigation system handle the back action
//     };

//     const backHandler = BackHandler.addEventListener('hardwareBackPress', backAction);

//     return () => backHandler.remove();
//   }, [isRootScreen]);
// };

// export default useBackHandler;

// // // useBackHandler.js
// // import { useEffect } from 'react';
// // import { BackHandler, Alert } from 'react-native';

// // const useBackHandler = () => {
// //   useEffect(() => {
// //     // Function to handle the back button action
// //     const handleBackButton = () => {
// //       Alert.alert(
// //         'Exit',
// //         'Do you want to go back?',
// //         [
// //           { text: 'No', style: 'cancel' },
// //           { text: 'Yes', onPress: () => BackHandler.exitApp() },
// //         ],
// //         { cancelable: false }
// //       );
// //       return true; // Prevent default back action
// //     };

// //     // Add the back button event listener
// //     BackHandler.addEventListener('hardwareBackPress', handleBackButton);

// //     // Clean up the event listener on unmount
// //     return () => {
// //       BackHandler.removeEventListener('hardwareBackPress', handleBackButton);
// //     };
// //   }, []);
// // };

// // export default useBackHandler;

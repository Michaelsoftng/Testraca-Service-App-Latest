import AsyncStorage from "@react-native-async-storage/async-storage";
import { useEffect, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchUserDetails, clearUserDetails } from "../my-store/redux/userDetailsSlice";

export const useGetUserDetails = () => {
  const dispatch = useDispatch();
  const { userData, loading, error, patientId } = useSelector(
    (state) => state.userDetails_
  );

  const lastUserIdRef = useRef<string | null>(null);

  useEffect(() => {
    const loadUser = async () => {
      const storedId = await AsyncStorage.getItem("id_");

      // 🔴 User logged out
      if (!storedId) {
        lastUserIdRef.current = null;
        dispatch(clearUserDetails());
        return;
      }

      // 🟢 User changed
      if (storedId !== lastUserIdRef.current) {
        lastUserIdRef.current = storedId;
        dispatch(clearUserDetails()); // 💥 wipe old user
        dispatch(fetchUserDetails()); // 🔄 fetch new user
      }
    };

    loadUser();
  }, [dispatch]);

  const reloadUserDetails = () => {
    dispatch(fetchUserDetails());
  };

  return {
    userData,
    loadingUserDetails: loading,
    errorUserDetails: error,
    patientIdPay: patientId,
    reloadUserDetails,
  };
};



// import AsyncStorage from "@react-native-async-storage/async-storage";
// import { useEffect, useState } from "react";
// import { useDispatch, useSelector } from "react-redux";
// import { fetchUserDetails } from "../my-store/redux/userDetailsSlice";
// // import { fetchUserDetails } from "../my-store/redux/userDetailsSlice";

// export const useGetUserDetails = () => {
//   const dispatch = useDispatch();
//   const { userData, loading, error, doctorId } = useSelector(
//     (state) => state.userDetails_
//   );
//   const [storedId, setStoredId] = useState(null);

//   // Watch AsyncStorage ID changes
//   useEffect(() => {
//     const interval = setInterval(async () => {
//       const id = await AsyncStorage.getItem("id_");
//       // console.log('SDKDKDKDJKDJHDNHDHDHH WWWWWWW MMMMMMM UUUUUU :::: ', id);
//       if (id !== storedId) {
//         setStoredId(id);
//       }
//     }, 2000); // check every 2s (lightweight)

//     return () => clearInterval(interval);
//   }, [storedId]);

//   // Refetch whenever the ID changes
//   useEffect(() => {
//     if (storedId && !loading) {
//       dispatch(fetchUserDetails());
//     }
//   }, [dispatch, storedId]);

//   const reloadUserDetails = () => {
//     dispatch(fetchUserDetails());
//   };

//   return {
//     userData,
//     loadingUserDetails: loading,
//     errorUserDetails: error,
//     patientIdPay: doctorId,
//     reloadUserDetails,
//   };
// };

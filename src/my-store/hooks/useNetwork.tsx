// src/hooks/useNetwork.js
import NetInfo from "@react-native-community/netinfo";
import { useEffect, useState } from "react";

export function useNetwork(callbackOnline) {
  const [isConnected, setIsConnected] = useState(true);

  useEffect(() => {
    const unsubscribe = NetInfo.addEventListener(state => {
      if (state.isConnected && !isConnected) {
        callbackOnline();
      }
      setIsConnected(state.isConnected);
    });

    return () => unsubscribe();
  }, [isConnected, callbackOnline]);

  return isConnected;
}

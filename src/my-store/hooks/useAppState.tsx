// src/hooks/useAppState.js
import { useEffect, useState } from "react";
import { AppState } from "react-native";

export function useAppState(callback) {
  const [appState, setAppState] = useState(AppState.currentState);

  useEffect(() => {
    const subscription = AppState.addEventListener("change", nextAppState => {
      if (appState.match(/inactive|background/) && nextAppState === "active") {
        callback();
      }
      setAppState(nextAppState);
    });

    return () => subscription.remove();
  }, [appState, callback]);

  return appState;
}

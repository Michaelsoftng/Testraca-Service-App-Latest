import { useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useMutation } from '@apollo/client';
import { VERIFY_TOKEN_MUTATION } from './ApiSchema';

const useAuth = (navigation: any) => {
  const [token, setToken] = useState<string | null>(null);
  const [refreshToken, setRefreshToken] = useState<string | null>(null);
  const [patientId, setPatientId] = useState<string | null>(null);
  const [email_1, setEmail] = useState<string | null>(null);
  const [userType, setUserType] = useState<string | null>(null);
  // true while we are verifying the stored token – Splashscreen waits on this
  const [isVerifying, setIsVerifying] = useState(true);

  // Session expiry / invalid token — clears local auth state only.
  // Does NOT call unregisterFCMToken: the FCM device token belongs to the
  // device, not the session. Only an explicit user-initiated logout should
  // remove it from the server. On next login, registerFCMToken reassigns it.
  const clearToken = async () => {
    try {
      await Promise.allSettled([
        AsyncStorage.removeItem('userToken_'),
        AsyncStorage.removeItem('refreshToken_'),
        AsyncStorage.removeItem('userType_'),
        AsyncStorage.removeItem('id_'),
      ]);
    } finally {
      setToken(null);
      setRefreshToken(null);
      setPatientId(null);
      setUserType(null);
      setEmail(null);
      setIsVerifying(false);

      try {
        navigation.replace('onboarding_screen');
      } catch {
        navigation.navigate('onboarding_screen');
      }
    }
  };

  // Load persisted credentials on mount
  useEffect(() => {
    const fetchToken = async () => {
      try {
        const storedToken = await AsyncStorage.getItem('userToken_');
        const storedRefreshToken = await AsyncStorage.getItem('refreshToken_');
        const storedID = await AsyncStorage.getItem('id_');
        const userTy = await AsyncStorage.getItem('userType_');
        setToken(storedToken);
        setRefreshToken(storedRefreshToken);
        setPatientId(storedID);
        setUserType(userTy);
        // If there is no stored token, verification is done immediately
        if (!storedToken) {
          setIsVerifying(false);
        }
      } catch (err: any) {
        console.error('Error fetching token:', err.message);
        setIsVerifying(false);
      }
    };
    fetchToken();
  }, []);

  const [verifyToken] = useMutation(VERIFY_TOKEN_MUTATION);

  const verifyTokenFun = async () => {
    if (!token) {
      setIsVerifying(false);
      return;
    }
    setIsVerifying(true);
    try {
      const response = await Promise.race([
        verifyToken({ variables: { accessToken: token } }),
        new Promise<never>((_, reject) =>
          setTimeout(() => reject(new Error('VERIFY_TIMEOUT')), 8000)
        ),
      ]);
      const email = response.data?.verifyToken?.payload?.email;
      if (!email || email.trim() === '') {
        // Token exists but carries no valid email — force logout
        await clearToken();
        return;
      }
      setEmail(email);
    } catch (error: any) {
      // Network timeout/errors should not block startup indefinitely.
      const message = String(error?.message ?? '');
      const isNetworkIssue =
        message.includes('VERIFY_TIMEOUT') ||
        message.includes('fetch failed') ||
        message.includes('Network request failed');

      if (isNetworkIssue) {
        return;
      }

      // Token is invalid or expired — auto-logout so the user isn't stuck
      await clearToken();
      return;
    } finally {
      setIsVerifying(false);
    }
  };

  useEffect(() => {
    verifyTokenFun();
  }, [token]);

  return {
    token,
    refreshToken,
    patientId,
    email_1,
    userType,
    isVerifying,
    verifyTokenFun,
  };
};

export default useAuth;

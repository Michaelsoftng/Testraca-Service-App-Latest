import AsyncStorage from '@react-native-async-storage/async-storage';
import {USER_TOKEN_KEY, USER_RE_TOKEN_KEY} from '../../constants';

export const loadAuthToken = async () => {
  try {
    const jsonValue = await AsyncStorage.getItem(USER_TOKEN_KEY);
    return jsonValue != null ? JSON.parse(jsonValue) : null;
  } catch (error) {
    console.error('something went wrong with reading auth token');
  }
};
export const loadRefreshToken = async () => {
  try {
    const jsonValue = await AsyncStorage.getItem(USER_RE_TOKEN_KEY);
    return jsonValue != null ? JSON.parse(jsonValue) : null;
  } catch (error) {
    console.error('something went wrong with reading refresh token');
  }
};

export const saveAuthToken = async (token: object) => {
  try {
    const jsonValue = JSON.stringify(token);
    await AsyncStorage.setItem(USER_TOKEN_KEY, jsonValue);
  } catch (error) {
    console.error('something went wrong with storing auth token');
  }
};
export const saveRefreshToken = async (token: object) => {
  try {
    const jsonValue = JSON.stringify(token);
    await AsyncStorage.setItem(USER_RE_TOKEN_KEY, jsonValue);
  } catch (error) {
    console.error('something went wrong with storing refresh token');
  }
};

export const removeAuthToken = async () => {
  await AsyncStorage.removeItem(USER_TOKEN_KEY);
};
export const removeRefreshToken = async () => {
  await AsyncStorage.removeItem(USER_RE_TOKEN_KEY);
};

export const logoutUser = async () => {
  removeAuthToken();
  removeRefreshToken();
};

export const storeData = async (key: string, value: object) => {
  try {
    const jsonValue = JSON.stringify(value);
    await AsyncStorage.setItem(key, jsonValue);
  } catch (e) {
    // saving error
  }
};

export const getData = async (key: string) => {
  try {
    const jsonValue = await AsyncStorage.getItem(key);
    return jsonValue != null ? JSON.parse(jsonValue) : null;
  } catch (e) {
    // error reading value
  }
};

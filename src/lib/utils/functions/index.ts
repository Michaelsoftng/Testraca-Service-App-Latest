/**
 * @function addToCurrentTime To increment the current datetime by a value
 *
 * @param {number} endTime Additional number of seconds you want to add to the current time. The data type can only be a number value.
 * @return {*} A new date with the added number of seconds.
 */

import {Alert} from 'react-native';
import {format} from 'date-fns';

export const useAlert = () => {
  const showNativeAlert = (
    title: string,
    message: string,
    dismissable = false,
    acceptOption: any = null,
    declineOption: any = null,
    singleOption = false,
  ) => {
    const buttons: any[] = [];

    if (singleOption) {
      buttons.push({
        text: acceptOption?.label || 'OK',
        onPress: acceptOption?.action,
      });
    } else {
      if (declineOption) {
        buttons.push({
          text: declineOption?.label || 'Cancel',
          style: 'cancel',
          onPress: declineOption?.action,
        });
      }

      buttons.push({
        text: acceptOption?.label || 'OK',
        onPress: acceptOption?.action,
      });
    }

    Alert.alert(title || 'Notice', message || '', buttons, {
      cancelable: dismissable,
    });
  };

  const showAlert = (
    type: any,
    message: any,
    dismissable = false,
    acceptOption = null,
    declineOption = null,
    singleOption = false,
    children = null,
    duration = 5000,
  ) => {
    void children;
    void duration;
    showNativeAlert(
      String(type || 'Notice'),
      String(message || ''),
      dismissable,
      acceptOption,
      declineOption,
      singleOption,
    );
  };
  const hideAlert = () => {};
  return {showAlert, hideAlert};
};

export const useToast = () => {
  const showToast = (
    type = '',
    title = '',
    message = '',
    dismissable = false,
  ) => {
    void dismissable;
    const toastTitle = title || (type ? type.toUpperCase() : 'Notice');
    Alert.alert(String(toastTitle), String(message || ''));
  };
  const hideToast = () => {};
  return {showToast, hideToast};
};

export const addToCurrentTime = (endTime: number): Date => {
  const d = new Date();
  const mil = d.getTime();
  const newMillisec = mil + endTime;

  return new Date(newMillisec);
};

const currentYear = new Date().getFullYear();
const maxThrowBackYear = 1920;

export const months = [
  'January',
  'February',
  'March',
  'April',
  'May',
  'June',
  'July',
  'August',
  'September',
  'October',
  'November',
  'December',
];

export const years = (): number[] => {
  const year = [];
  for (let i = currentYear; i >= maxThrowBackYear; i - 1) {
    year.push(i);
  }

  return year;
};

export const isFloat = (n: number) => Number(n) === n && n % 1 !== 0;

export const sleep = (ms: number): Promise<void> => {
  return new Promise(resolve => setTimeout(resolve, ms));
};

export const formatDate = (dateString: string | number | Date | null) => {
  if (dateString === null) return '';
  const date = new Date(dateString);
  const day = date.getDate();
  const daySuffix =
    day % 10 === 1 && day !== 11
      ? 'st'
      : day % 10 === 2 && day !== 12
      ? 'nd'
      : day % 10 === 3 && day !== 13
      ? 'rd'
      : 'th';
  const formattedDate = format(date, 'EEE, do MMM, yyyy');
  return formattedDate.replace('do', `${day}${daySuffix}`);
};

export const formatPrice = (price: number | string) => {
  return new Intl.NumberFormat('en-NG', {
    style: 'currency',
    currency: 'NGN',
  }).format(price as unknown as number);
};

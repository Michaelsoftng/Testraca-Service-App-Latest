import {Platform, Dimensions} from 'react-native';

import {
  widthPercentageToDP as _wp,
  heightPercentageToDP as _hp,
} from 'react-native-responsive-screen';



export const wp = (percentage: string | number) => _wp(percentage);
export const hp = (percentage: string | number) => _hp(percentage);

export const {width, height} = Dimensions.get('window');

let guidelineWidth = 375;
if (Platform.OS === 'ios') {
  guidelineWidth = Platform.isPad ? 560 : 360;
}

let guidelineBaseHeight = 840;
if (Platform.OS === 'ios') {
  guidelineBaseHeight = Platform.isPad ? 840 : 640;
}

export const scale = (size: number) => (width / guidelineWidth) * size;
export const scaleVertical = (size: number) =>
  (height / guidelineBaseHeight) * size;
export const scaleHorizontal = (size: number) =>
  (width / guidelineBaseHeight) * size;

export const appFonts = {
  thinText: {
    fontFamily: 'GeneralSans-Extralight',
  },
  lightText: {
    fontFamily: 'GeneralSans-Light',
  },
  regularText: {
    fontFamily: 'GeneralSans-Regular',
  },
  mediumText: {
    fontFamily: 'GeneralSans-Medium',
  },
  semiBoldText: {
    fontFamily: 'GeneralSans-Semibold',
  },
  boldText: {
    fontFamily: 'GeneralSans-Bold',
  },
  h1: {fontSize: hp(26)},
  h2: {fontSize: hp(24)},
  h3: {fontSize: hp(20)},
  h4: {fontSize: hp(16)},
  h5: {fontSize: hp(14)},
  h6: {fontSize: hp(12)},
};
export const appColors = {
  primaryGreen: '#059669',
  primaryDarkBlue: '#0F1D40',
  black: '#000000',
  white: '#FFFFFF',
  gray: '#8C93A3',
  lightGray: '#CACDD5',
  lightError: '#FFE3D6',
  'black-50': '#0C0C0C80',
  'gray-30': '#C2C2C24D',
  'gray-35': '#EEEFF2',
  'gray-40': '#CACDD5',
  'gray-20': '#C2C2C233',
  'gray-50': '#525C76',
  'gray-55': '#F5F6F7',
  'gray-60': '#B2B7C2',
  background: '#F5F5F5',
  grayBorder: '#E2E4E8',
  darkBlue: '#071971',
  warn: '#FFD700',
  error: '#FF6347',
  info: '#87CEEB',
  success: '#10B981',
};

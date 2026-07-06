import React from 'react';
import {Pressable, StyleSheet, Platform} from 'react-native';
import BackSvg from '../../../assets/images/svg/back';
import {appColors, hp, wp} from '../../../lib/utils/scale';
import BackSSvg from '../../../assets/images/svg/backS';

interface BackBtnProp {
  navigation?: any;
  withStraigthLine?: boolean;
}

function BackBtn({navigation, withStraigthLine = false}: BackBtnProp) {
  return (
    <Pressable
      onPress={() => navigation && navigation?.goBack()}
      style={styles.backBtnWrapper}>
      {withStraigthLine ? <BackSSvg size={1.3} /> : <BackSvg size={1.3} />}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  backBtnWrapper: {
    borderWidth: 1,
    borderRadius: 6,
    borderColor: appColors['gray-40'],
    width: wp(14),
    height: Platform.OS === 'android' ? hp(7) : hp(6),
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
});

export default BackBtn;

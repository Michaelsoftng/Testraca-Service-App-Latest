import React from 'react';
import {StyleSheet, Text, View, Pressable} from 'react-native';
import {appColors, appFonts, hp, wp} from '../../../lib/utils/scale';
import ThunderSvg from '../../../assets/images/svg/thunder';
import SadFaceSvg from '../../../assets/images/svg/sad-face';

interface OnlineOfflineButtonProps {
  isOnline: boolean;
  onPress: () => void;
}

const OnlineOfflineButton = ({isOnline, onPress}: OnlineOfflineButtonProps) => {
  return (
    <Pressable
      onPress={() => onPress()}
      style={[
        styles.bannerContainer,
        isOnline
          ? styles.bannerContainerOfflineColor
          : styles.bannerContainerOnlineColor,
      ]}>
      <View style={styles.bannerContent}>
        <Text
          style={[
            styles.bannerText,
            isOnline
              ? styles.bannerTextOfflineColor
              : styles.bannerTextOnlineColor,
          ]}>
          {isOnline ? ' Go offline' : ' Go online'}
        </Text>
        {isOnline ? <SadFaceSvg /> : <ThunderSvg />}
      </View>
    </Pressable>
  );
};

const styles = StyleSheet.create({
  bannerContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 3,
    elevation: 1, // equivalent of boxShadow in React Native
    backgroundColor: '#FFE3D6',
    display: 'flex',
    width: wp(88),
    height: hp(8.5),
    padding: 22,
  },
  bannerContainerOnlineColor: {
    backgroundColor: appColors?.primaryGreen,
  },
  bannerContainerOfflineColor: {
    backgroundColor: '#FFE3D6',
  },
  bannerContent: {
    justifyContent: 'center',
    alignItems: 'center',
    display: 'flex',
    flexDirection: 'row',
    gap: 10,
  },
  bannerText: {
    fontFamily: appFonts.semiBoldText.fontFamily,
    fontSize: hp(2),
  },
  bannerTextOnlineColor: {
    color: appColors?.white,
  },
  bannerTextOfflineColor: {
    color: '#930F35',
  },
});

export default OnlineOfflineButton;

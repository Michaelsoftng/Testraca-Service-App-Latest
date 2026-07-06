import React from 'react';
import {View, Text, Pressable, StyleSheet} from 'react-native';
import {appColors, appFonts, hp} from '../../../lib/utils/scale';
import RightArrowSvg from '../../../assets/images/svg/right-arrow';

interface HelpAndSupportItemProps {
  icon: React.ReactNode;
  text: string;
  onPress: () => void;
  withRed?: boolean;
}

const HelpAndSupportItem = ({
  icon,
  text,
  onPress,
  withRed = false,
}: HelpAndSupportItemProps) => {
  return (
    <Pressable style={styles.singleInfoContainer} onPress={onPress}>
      <View style={styles.iconContainer}>
        <View
          style={[
            styles.iconBackground,
            {
              backgroundColor: withRed
                ? appColors.lightError
                : appColors['gray-55'],
            },
          ]}>
          {icon}
        </View>
        <View style={styles.textContainer}>
          <Text style={styles.text}>{text}</Text>
        </View>
      </View>
      <RightArrowSvg color="black" size={1.3} />
    </Pressable>
  );
};

const styles = StyleSheet.create({
  singleInfoContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: hp(1),
  },
  iconContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  iconBackground: {
    width: hp(7),
    height: hp(7),
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  textContainer: {
    marginLeft: hp(2),
  },
  text: {
    fontFamily: appFonts.semiBoldText.fontFamily,
    color: appColors.black,
  },
});

export default HelpAndSupportItem;

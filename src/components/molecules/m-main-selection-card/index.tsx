import React from 'react';
import {Pressable, StyleSheet, Text, View} from 'react-native';
import RightArrowSvg from '../../../assets/images/svg/right-arrow';
import {appColors, appFonts, hp, wp} from '../../../lib/utils/scale';

interface MainSelectionCardProps {
  id?: string;

  availability: string;
  price: string;
  setIsSelected?: () => void;
}

function MainSelectionCard({
  availability,
  price,
  setIsSelected,
}: MainSelectionCardProps) {
  return (
    <Pressable
      onPress={() => setIsSelected && setIsSelected()}
      style={styles.container}>
      <View style={{}}>
        <View style={styles.availabilityContainerStyle}>
          <Text style={styles.availabilityTextStyle}>{availability}</Text>
        </View>
        <Text style={styles.priceTextStyle}>{price}</Text>
      </View>
      <View style={{}}>
        <RightArrowSvg />
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  container: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderWidth: 0.3,
    borderColor: appColors.grayBorder,
    backgroundColor: appColors['gray-55'],
    borderRadius: 7,
    width: wp(88),
    paddingVertical: 15,
    paddingHorizontal: 15,
    marginBottom: 10,
  },
  availabilityContainerStyle: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 5,
    marginBottom: 5,
  },

  availabilityTextStyle: {
    fontSize: hp(1.5),
    color: appColors.gray,
    fontFamily: appFonts.regularText.fontFamily,
  },
  priceTextStyle: {
    fontSize: hp(1.8),
    fontFamily: appFonts.semiBoldText.fontFamily,
  },
  contentContainer: {
    flex: 1,
    alignItems: 'center',
  },
});

export default MainSelectionCard;

import * as React from 'react';
import {
  FlatList,
  ScrollView,
  View,
  StyleSheet,
  Image,
  Text,
} from 'react-native';
import RatingSvg from '../../../assets/images/svg/rating';
import {appColors, appFonts, hp} from '../../../lib/utils/scale';

function RatingComp() {
  return (
    <View style={styles.view1}>
      <View style={styles.view2}>
        <Text style={styles.ratingTextStyle}>Rating</Text>
      </View>
      <View style={styles.ratingStar}>
        <Text style={styles.view4}>4.80</Text>
        <RatingSvg />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  view1: {
    alignItems: 'stretch',
    display: 'flex',
    maxWidth: 92,
    flexDirection: 'column',
  },
  ratingTextStyle: {
    fontFamily: appFonts.mediumText.fontFamily,
    fontSize: hp(1.5),
    color: appColors?.['black-50'],
  },
  view2: {
    alignSelf: 'center',
    fontSize: 16,
  },
  view3: {
    alignItems: 'stretch',
    display: 'flex',
    justifyContent: 'space-between',
    gap: 2,
    fontSize: 32,
    color: 'var(--Text-Colour-Text-Highlight, #0F1D40)',
    fontWeight: '600',
  },
  view4: {
    fontFamily: appFonts.semiBoldText.fontFamily,
    fontSize: hp(4),
  },
  ratingStar: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
});

export default RatingComp;

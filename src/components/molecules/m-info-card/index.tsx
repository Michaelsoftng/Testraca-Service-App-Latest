import React from 'react';
import {View, StyleSheet, Image, Text} from 'react-native';
import InfoSvg from '../../../assets/images/svg/info';
import {hp} from '../../../lib/utils/scale';

const SampleCollectionNotice = ({text}: {text: string}) => {
  return (
    <View style={styles.noticeContainer}>
      <View style={styles.noticeContent}>
        <InfoSvg />
        <View style={styles.noticeTextContainer}>
          <Text style={styles.noticeText}>{text}</Text>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  noticeContainer: {
    justifyContent: 'center',
    alignItems: 'stretch',
    alignSelf: 'stretch',
    borderRadius: 3,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 1},
    shadowOpacity: 0.08,
    shadowRadius: 1,
    borderColor: '#1B4ACB',
    borderWidth: 1,
    backgroundColor: '#D3E5FE',
    display: 'flex',
    // maxWidth: 342,
    flexDirection: 'column',
    padding: 12,
  },
  noticeContent: {
    alignItems: 'stretch',
    display: 'flex',
    flexDirection: 'row',
    gap: 12,
  },

  noticeTextContainer: {
    flexGrow: 1,
    flexShrink: 1,
    fontFamily: 'General Sans, sans-serif',
  },
  noticeText: {
    color: '#1B4ACB',
    fontSize: hp(1.5),
    fontWeight: '400',
    paddingTop: 2,
  },
});

export default SampleCollectionNotice;

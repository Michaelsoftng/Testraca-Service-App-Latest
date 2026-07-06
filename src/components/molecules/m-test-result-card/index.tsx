import React from 'react';
import {View, Text, StyleSheet, Image} from 'react-native';
import {appColors, appFonts, hp, wp} from '../../../lib/utils/scale';

interface TestResultCardProps {
  testName: string;
  profilePic?: string | null;
  name: string;
  location: string;
  packageType: string;
}

const TestResultCard: React.FC<TestResultCardProps> = ({
  testName,
  profilePic,
  name,
  location,
  packageType,
}) => {
  return (
    <View
      style={{
        borderRadius: 10,
        backgroundColor: appColors['gray-55'],
        paddingHorizontal: hp(2),
        paddingVertical: hp(2),
        width: '100%',
        maxWidth: wp(100),
        borderWidth: 0.5,
        borderColor: appColors['gray-60'],
      }}>
      <View style={{paddingBottom: 10}}>
        <Text
          style={{
            fontFamily: appFonts?.semiBoldText.fontFamily,
            fontSize: hp(2.2),
            color: appColors.black,
          }}>
          {testName}
        </Text>
      </View>
      <View
        style={{
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent: 'space-between',
        }}>
        <View style={styles.imageAndNameStyle}>
          <Image
            resizeMode="contain"
            source={{
              uri: profilePic
                ? profilePic
                : `https://ui-avatars.com/api/?name=${name}+${name}&background=random&length=2&rounded=true&size=70`,
            }}
            style={styles.profilePic}
          />
          <View style={styles.headerTextContainer}>
            <Text style={styles.userName}>{name}</Text>
            <Text style={styles.location}>{location}</Text>
          </View>
        </View>
        <View style={styles.packageContainerInner}>
          <View style={styles.packageTypeContainer}>
            <Text style={styles.packageTypeText}>{packageType}</Text>
          </View>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  packageContainerInner: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingTop: 6,
  },
  packageTypeText: {
    color: '#fff',
    fontWeight: '500',
  },
  packageTypeContainer: {
    backgroundColor: '#0F1D40',
    padding: 4,
    borderRadius: 3,
  },
  imageAndNameStyle: {
    flexDirection: 'row',
  },
  profilePic: {
    width: wp(12),
    height: hp(6),
    borderRadius: 24,
    marginRight: 8,
    borderWidth: 1,
  },
  headerTextContainer: {
    justifyContent: 'center',
  },
  userName: {
    fontWeight: 'bold',
    fontSize: hp(2),
    color: appColors['gray-50'],
  },
  location: {
    fontSize: hp(1.4),
    color: appColors['gray-50'],
  },
});

export default TestResultCard;

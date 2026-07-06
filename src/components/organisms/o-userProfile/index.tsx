import React from 'react';
import {View, Text, Image, StyleSheet} from 'react-native';
import {appColors, appFonts, hp, wp} from '../../../lib/utils/scale';

interface UserProfileProps {
  photoUrl?: string;
  firstName?: string;
  lastName?: string;
  email?: string;
}

const UserProfile: React.FC<UserProfileProps> = ({
  photoUrl,
  firstName,
  lastName,
  email,
}) => {
  const defaultImageUrl = `https://ui-avatars.com/api/?name=${firstName}+${lastName}&background=08AC85&length=2&rounded=false&size=70`;

  return (
    <View style={styles.imageAndNameStyle}>
      <Image
        resizeMode="contain"
        source={{
          uri: photoUrl?.length! > 5 ? photoUrl : defaultImageUrl,
        }}
        style={styles.profilePic}
      />
      <View>
        <Text
          style={{
            fontFamily: appFonts?.semiBoldText?.fontFamily,
            fontSize: hp(2.4),
            color: appColors?.black,
          }}>
          {firstName} {lastName}
        </Text>
        <Text
          style={{
            fontFamily: appFonts?.regularText?.fontFamily,
            fontSize: hp(1.8),
            color: appColors?.black,
            textAlign: 'center',
            marginBottom: 12,
          }}>
          {email}
        </Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  imageAndNameStyle: {
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
  },
  profilePic: {
    width: hp(10),
    height: hp(10),
    borderRadius: 24,
    marginRight: 8,
    borderWidth: 1,
  },
});

export default UserProfile;

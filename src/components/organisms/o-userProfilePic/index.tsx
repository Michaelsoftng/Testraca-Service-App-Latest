import React from 'react';
import {View, Text, Image, StyleSheet} from 'react-native';
import {appColors, appFonts, hp, wp} from '../../../lib/utils/scale';

interface UserProfileProps {
  photoUrl?: string;
  firstName?: string;
  lastName?: string;
}

const UserProfilePicture: React.FC<UserProfileProps> = ({
  photoUrl,
  firstName,
  lastName,
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

export default UserProfilePicture;

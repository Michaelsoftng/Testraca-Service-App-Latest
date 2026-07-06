import {Image, StyleSheet, Text, View} from 'react-native';
import {appColors, appFonts, hp} from '../../../lib/utils/scale';
import ServiceDetail from '../m-service-card';

interface ServiceDetailProps {
  title: string;
  packageType: string;
  price: string;
}

interface SelectedUserProps {
  services: ServiceDetailProps[];
  profilePic: string | null;
  name: string;
  distance: string;
  time: number;
  patientAddress: string;
}

function SelectedUser({
  services,
  profilePic,
  name,
  distance,
  time,
  patientAddress,
}: SelectedUserProps) {
  let roundedTime: number | string = 0;
  if (time) {
    roundedTime = Number(time)?.toFixed(2);
  }
  return (
    <View style={styles.container}>
      <View style={styles.textContainer}>
        <View style={styles.largeTextContainer}>
          <Text style={styles.largeTextStyle}>{roundedTime} mins</Text>

          <Text style={styles.largeTextStyle}>{distance}Km</Text>
        </View>
        <Text style={styles.addressTextStyle}>{patientAddress}</Text>
      </View>
      <View style={styles.profileContainer}>
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
        </View>
      </View>
      {services.map((service, index) => (
        <ServiceDetail
          key={index}
          title={service.title}
          packageType={service.packageType}
          price={service.price}
        />
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: appColors.white,
    padding: hp(2),
    width: '100%',
  },
  textContainer: {},
  largeTextContainer: {
    display: 'flex',
    flexDirection: 'row',
  },
  largeTextStyle: {
    paddingRight: hp(3),
    fontFamily: appFonts.semiBoldText.fontFamily,
    color: appColors.black,
    fontSize: hp(3.5),
  },
  addressTextStyle: {
    fontFamily: appFonts.semiBoldText.fontFamily,
    color: appColors.gray,
    fontSize: hp(2),
    marginTop: hp(1),
  },
  profileContainer: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'flex-start',
    alignItems: 'center',
    marginTop: hp(2),
  },
  profilePic: {
    width: 48,
    height: 48,
    borderRadius: 24,
    marginRight: 8,
    borderWidth: 1,
  },
  headerTextContainer: {
    justifyContent: 'space-between',
  },
  userName: {
    fontFamily: appFonts.semiBoldText.fontFamily,
    fontSize: hp(2),
    color: appColors.black,
  },
});
export default SelectedUser;

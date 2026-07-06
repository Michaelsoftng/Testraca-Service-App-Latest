import {StyleSheet, Text, View} from 'react-native';
import {appColors, appFonts, hp} from '../../../lib/utils/scale';

interface ServiceDetailProps {
  title: string;
  // packageType: string;
  price: string;
}

const ServiceDetail = ({title, price}: ServiceDetailProps) => (
  <View style={styles.serviceContainer}>
    <Text style={styles.serviceTitle}>{title}</Text>
    <View style={styles.packageContainerList}>
      <View style={styles.packageContainer}>
        <Text style={[styles.packageType, styles.darkText]}>Price</Text>
        <Text style={styles.price}>
          {' '}
          {Number(price)?.toLocaleString('en-NG', {
            style: 'currency',
            currency: 'NGN',
          })}
        </Text>
      </View>
    </View>
  </View>
);

const styles = StyleSheet.create({
  serviceContainer: {
    marginTop: 12,
    padding: 12,
    backgroundColor: '#F5F6F7',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#E2E4E8',
  },
  lightText: {
    fontFamily: appFonts.regularText.fontFamily,
  },
  serviceTitle: {
    fontWeight: '600',
    fontSize: hp(2),
    paddingBottom: hp(1),
    color: appColors.primaryDarkBlue,
  },
  packageContainerList: {},
  packageContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: hp(0.4),
  },
  darkText: {
    color: appColors.primaryDarkBlue,
  },
  packageType: {
    color: '#525C76',
    fontWeight: '500',
  },
  price: {
    fontWeight: '600',
    color: '#0F1D40',
  },
});

export default ServiceDetail;

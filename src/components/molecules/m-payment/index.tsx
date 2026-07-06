import React from 'react';
import { View, Text, StyleSheet, Image, SafeAreaView } from 'react-native';
import { appFonts, hp } from '../../../lib/utils/scale';

interface PaymentContainerProps {
  paymentMethod: 'online' | 'office'; 
  status: 'Pending' | 'Successful';
}

export default function PaymentContainer({ paymentMethod, status }: PaymentContainerProps) {
  const statusColor = status === 'Pending' ? '#DB8C09' : 'green';
  const paymentText =
    paymentMethod === 'online' ? 'Payed online' : 'Payed in office';
  const displayStatus =
    paymentMethod === 'online'
      ? status === 'Pending'
        ? 'Pending'
        : 'Successful'
      : 'Successful';

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.flex}>
        <Text style={styles.bold}>{paymentText}</Text>
        <Text style={styles.bold}>NGN 30,000</Text>
      </View>
      <View style={styles.flex}>
        <Text style={[styles.status, { color: statusColor }]}>{displayStatus}</Text>
        <Text style={styles.date}>21/02. 9:35 AM</Text>
      </View>
      <View
        style={{
          borderRadius: 1,
          borderStyle: 'dashed',
          borderWidth: 1,
          borderColor: '#B2B7C2',
          marginVertical: 10,
        }}
      />
      <View style={styles.id}>
        <Text style={styles.idTitle}>Payment ref:</Text>
        <Text style={styles.idText}>NCKl4N0024564KGAJ14551dhjaa001</Text>
        <Image
          source={require('../../../assets/images/png/copy.png')}
          style={{ width: 12, height: 12, paddingHorizontal: 5 }}
        />
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#F5F6F7',
    borderWidth: 1,
    borderColor: '#E2E4E8',
    paddingHorizontal: 10,
    marginHorizontal: 20,
    borderRadius: 8,
    marginVertical: 5,
  },
  flex: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 8,
  },
  bold: {
    fontSize: hp(2.5),
    fontFamily: appFonts.boldText.fontFamily,
  },
  status: {
    fontSize: hp(1.5),
  },
  date: {
    color: '#8C93A3',
    fontSize: hp(1.5),
  },
  id: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    paddingVertical: 8,
  },
  idTitle: {
    fontSize: hp(1.3),
    fontFamily: appFonts.boldText.fontFamily,
  },
  idText: {
    fontSize: hp(1.3),
  },
});

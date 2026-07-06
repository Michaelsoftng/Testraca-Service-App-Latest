import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { appFonts, hp } from '../../../../lib/utils/scale';

const dummyData = [
  {
    title: 'COVID 19 Qualitative Prc throat swab',
    date: '16/02 09:45',
    client: 'Sarah Joe',
    numberOfPersons: 2,
    equipment: [
      { name: 'simple bottle', amount: 2 },
      { name: 'needles', amount: 2 },
      { name: 'Hand gloves', amount: 1 },
      { name: 'Bolt strips', amount: 1 },
    ],
  },
];

export default function AuditHistory() {
  return (
    <View>
      {dummyData.map((item, index) => (
        <View key={index} style={styles.container}>
            <View style={styles.flex}>
          <Text style={styles.header}>{item.title}</Text>
          <Text style={styles.date}>{item.date}</Text>
          </View>
          <View style={styles.flex}>
            <Text style={styles.lightText}>Client</Text>
            <Text style={styles.bold}>{item.client}</Text>
          </View>
          <View style={styles.flex}>
            <Text style={styles.lightText}>No. of persons</Text>
            <Text style={styles.bold}>{item.numberOfPersons}</Text>
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
          <View>
            <View style={styles.flex}>
              <Text style={styles.subText}>Equipment</Text>
              <Text style={styles.subText}>Amount</Text>
            </View>
            {item.equipment.map((equip, i) => (
              <View key={i} style={styles.flex}>
                <Text style={styles.lightText}>{equip.name}</Text>
                <Text style={styles.lightText}>{equip.amount}</Text>
              </View>
            ))}
          </View>
        </View>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#F5F6F7',
    borderColor: '#E2E4E8',
    borderWidth: 1,
    borderRadius: 8,
    margin: 10,
    paddingHorizontal: 10,
    paddingVertical: 5,

  },
  flex: {
    paddingVertical: 3,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  header: {
    fontSize: hp(1.6),
    fontFamily: appFonts.semiBoldText.fontFamily,
    paddingBottom: 2,
  },
  subText: {
    fontSize: hp(1.5),
    fontFamily: appFonts.boldText.fontFamily,
  },
  bold: {
    fontSize: hp(1.3),
    fontFamily: appFonts.boldText.fontFamily,
  },
  lightText: {
    color: '#525C76',
    fontSize: hp(1.5),
  },
  date: {
    fontSize: hp(1),
   fontWeight: '500'
  }
});

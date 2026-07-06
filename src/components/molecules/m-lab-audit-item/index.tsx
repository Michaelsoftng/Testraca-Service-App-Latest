import React from 'react';
import { Image, StyleSheet, Text, View } from 'react-native';

import { appColors, hp } from '../../../lib/utils/scale';

type Inventory = {
  name?: string;
  image?: string;
  description?: string;
  category?: string;
};

const LabAuditItem = ({ inventory }: { inventory?: Inventory }) => {
  return (
    <View style={styles.boxBackground}>
      <Image
        style={styles.image}
        source={
          inventory?.image
            ? { uri: inventory.image }
            : require('../../../assets/images/png/bottles.png')
        }
      />

      <View style={styles.textContainer}>
        <Text style={styles.title}>{inventory?.name ?? 'N/A'}</Text>
        <Text style={styles.descriptiveText}>
          {inventory?.description ?? inventory?.category ?? 'No description'}
        </Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  boxBackground: {
    flexDirection: 'row',
    paddingHorizontal: 15,
    paddingVertical: 10,
    alignItems: 'center',
    backgroundColor: appColors?.['gray-55'],
    borderRadius: 8,
    margin: 5,
    gap: 12,
  },
  image: {
    width: 50,
    height: 56,
    borderRadius: 4,
  },
  textContainer: {
    flex: 1,
    gap: 6,
  },
  title: {
    fontSize: hp(2),
    fontWeight: '600',
    color: '#121212',
  },
  descriptiveText: {
    fontSize: hp(1.5),
    color: appColors.gray,
  },
});

export default LabAuditItem;

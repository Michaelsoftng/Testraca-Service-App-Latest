import React from 'react';
import { View, Text, SafeAreaView, StyleSheet, TextInput, Image, TouchableOpacity } from 'react-native';
import BackBtn from '../../../components/atoms/a-back-btn';
import { appFonts, hp } from './../../../lib/utils/scale';
import AuditHistory from './../../../components/organisms/o-otoForm/o-auditHistory';

export default function AuditHistoryScreen(props: any) {
  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: '#FFFFFF' }}>
      {/* <View style={{ flexDirection: 'row', alignItems: 'center', padding: 10 }}>
        <BackBtn withStraigthLine navigation={props?.navigation} />
        <Text style={styles.title}>Audit history</Text>
      </View> */}
<View style={styles.searchBox}>
<View style={styles.searchContainer}>
        <TextInput
          style={styles.searchInput}
          placeholder="Search"
          placeholderTextColor="#B2B7C2"
          onChangeText={(text) => console.log(text)}
        />
        <View style={styles.searchIcon}>
          <Image
            source={require('../../../../assets/images/png/search.png')}
          />
        </View>
      </View>
      <TouchableOpacity>

    <Image source={require('../../../../assets/images/png/Button.png')} style={{width: 44}}/>
      </TouchableOpacity>
</View>

<View>
<AuditHistory />
<AuditHistory />
</View>
    
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  title: {
    flex: 1,
    textAlign: 'center',
    fontSize: hp(3),
    fontFamily: appFonts.semiBoldText.fontFamily,
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f0f0f0',
    paddingHorizontal: 15,
    paddingVertical: 10,
    marginHorizontal: 10,
    borderWidth: 1,
    borderColor: '#E2E4E8',
    minWidth: '80%',
  },
  searchInput: {
    flex: 1,
    fontSize: hp(2),
    fontFamily: appFonts.regularText.fontFamily,
    color: '#333',
  },
  searchIcon: {
    marginLeft: 10,
  },
  searchBox : {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 10,
    // marginVertical: 10,
   
  }
});

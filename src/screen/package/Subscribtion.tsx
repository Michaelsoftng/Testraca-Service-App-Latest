import { Dimensions, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import React, { useLayoutEffect, useState } from 'react'
import styles from '../../components/utils/styles'
import { SafeAreaView } from 'react-native-safe-area-context'
import { useNavigation } from '@react-navigation/native'
import SubscriptionForPackages from '../../components/SubscriptionForPackages'
import KeyboardAvoidingContainer from '../../components/utils/KeyboardAvoidingContainer'

const Subscribtion = ({route}) => {
    const navigation = useNavigation();
    const maxLength = 20;
    const { Data, data_tittle } = route.params;
    const [selection, setSelection] = useState(1);
    useLayoutEffect(() => {
        navigation.setOptions({
          title: data_tittle ? `${data_tittle.length > maxLength 
            ? `${data_tittle.substring(0, maxLength)}...` 
            : data_tittle}` : 'Could not fetch Subscription.',
        });
      }, [navigation, Data]);
    const renderContent = ()=> {
        switch (selection) {
            case 1:
                return <ScrollView 
                showsVerticalScrollIndicator={false}
                >
                    <View style={styles.sizeSpaceBottom}></View>
                    <View  >

                    <View style={[styles.card, styles.cardElevatedOrder, {width:Dimensions.get('window').width   - 2 * 20, backgroundColor:'#F5F6F7'}]}>
                <View style={{
                    backgroundColor:'#E2E4E8', 
                    width:53, 
                    height:23, 
                    gap:8, 
                    paddingTop:2, 
                    paddingLeft:8, 
                    paddingBottom:2, 
                    paddingRight:8, 
                    borderRadius:3,
                    }}>
                <Text style={{color:'#2C3857'}}>
                    {'BASIC'}
                </Text>                
                </View>
                <View style={{paddingTop:10,}}>
                <Text style={[styles.titleText, {fontSize:18, lineHeight:36, fontWeight:'800', }]}>NGN 3,500<Text style={[{color:'#525C76', fontSize:12, fontWeight:'600', lineHeight:30.2}]}>/month</Text></Text>
                </View>
                <View style={{paddingTop:10,}}>
<View>
    <Text style={[{color:'#0F1D40', fontSize:12, fontWeight:'600'}]}>
    This plans covers for your most basic needs and regular treatments
    </Text>
</View>
<View style={{paddingBottom:20,}}></View>
<View style={[{borderWidth:1, borderColor: '#CACDD5', borderRadius:4, backgroundColor:'#FFFFFF'}]}>

<TouchableOpacity style={styles.newUsers}
          onPress={()=>{
            navigation.navigate('sign_up')
          }}
          >
            <Text style={styles.newUser}>Subscribe</Text>
          </TouchableOpacity>

</View>
<View style={{paddingBottom:10,}}></View>
                    </View>
                    </View>
                    


                    {/* <SubscriptionForPackages /> */}
                    {/* <CustomFlatList data={data} data_type={'Active'} /> */}
                    </View>
{/* T\Second one */}
                    <View style={{paddingBottom:10}}></View>
                    <View  >

                    <View style={[styles.card, styles.cardElevatedOrder, {width:Dimensions.get('window').width   - 2 * 20, backgroundColor:'#F5F6F7'}]}>
                <View style={{
                    backgroundColor:'#0F1D40', 
                    width:180, 
                    height:23, 
                    justifyContent:'center',
                    gap:8, 
                    paddingTop:2, 
                    paddingLeft:8, 
                    paddingBottom:2, 
                    paddingRight:8, 
                    borderRadius:3,
                    }}>
                <Text style={{color:'#FFF'}}>
                    {'STANDARD RECOMMENED'}
                </Text>                
                </View>
                <View style={{paddingTop:10,}}>
                <Text style={[styles.titleText, {fontSize:18, lineHeight:36, fontWeight:'800', }]}>NGN 6,000<Text style={[{color:'#525C76', fontSize:12, fontWeight:'600', lineHeight:30.2}]}>/month</Text></Text>
                </View>
                <View style={{paddingTop:10,}}>
<View>
    <Text style={[{color:'#0F1D40', fontSize:12, fontWeight:'600'}]}>
    This plans covers for your most basic needs and regular treatments
    </Text>
</View>
<View style={{paddingBottom:20,}}></View>
<View style={[{borderWidth:0, borderColor: '#CACDD5', borderRadius:4, backgroundColor:'#059669'}]}>

<TouchableOpacity style={styles.newUsers}
          onPress={()=>{
            navigation.navigate('sign_up')
          }}
          >
            <Text style={{color:'#FFF'}}>Subscribe</Text>
          </TouchableOpacity>

</View>
<View style={{paddingBottom:10,}}></View>
                    </View>
                    </View>
                    


                    {/* <SubscriptionForPackages /> */}
                    {/* <CustomFlatList data={data} data_type={'Active'} /> */}
                    </View>

                    {/* Third one */}
                    <View style={{paddingBottom:10}}></View>
                    <View  >

                    <View style={[styles.card, styles.cardElevatedOrder, {width:Dimensions.get('window').width   - 2 * 20, backgroundColor:'#F5F6F7'}]}>
                <View style={{
                    backgroundColor:'#E2E4E8', 
                    width:83, 
                    height:23, 
                    gap:8, 
                    paddingTop:2, 
                    paddingLeft:8, 
                    paddingBottom:2, 
                    paddingRight:8, 
                    borderRadius:3,
                    }}>
                <Text style={{color:'#2C3857'}}>
                    {'PREMIUM'}
                </Text>                
                </View>
                <View style={{paddingTop:10,}}>
                <Text style={[styles.titleText, {fontSize:18, lineHeight:36, fontWeight:'800', }]}>NGN 8,000<Text style={[{color:'#525C76', fontSize:12, fontWeight:'600', lineHeight:30.2}]}>/month</Text></Text>
                </View>
                <View style={{paddingTop:10,}}>
<View>
    <Text style={[{color:'#0F1D40', fontSize:12, fontWeight:'600'}]}>
    This plans covers for your most basic needs and regular treatments
    </Text>
</View>
<View style={{paddingBottom:20,}}></View>
<View style={[{borderWidth:1, borderColor: '#CACDD5', borderRadius:4, backgroundColor:'#FFFFFF'}]}>

<TouchableOpacity style={styles.newUsers}
          onPress={()=>{
            navigation.navigate('sign_up')
          }}
          >
            <Text style={styles.newUser}>Subscribe</Text>
          </TouchableOpacity>

</View>
<View style={{paddingBottom:10,}}></View>
                    </View>
                    </View>
                    


                    {/* <SubscriptionForPackages /> */}
                    {/* <CustomFlatList data={data} data_type={'Active'} /> */}
                    </View>
                    <View style={{paddingTop:15,}}></View>
                </ScrollView>;
            case 2:
                return <Text style={styles.contentText}>Completed Tasks (8)</Text>;
            case 3:
                return 
                <View>
                <Text style={styles.contentText}>{data_tittle}</Text>;

                </View>
                
                
            default:
                return null;
        }
    };
  return (
    
    <KeyboardAvoidingContainer style={styles.containerBackGround}>    
            <View style={[styles.btnGroup, {paddingLeft:20, paddingRight:20, height:40}]}>
                <TouchableOpacity
                    style={[
                        styles.btn,
                        styles.firstBtn,  
                        selection === 1 ? { backgroundColor: "#6B7280" } : '#EEEFF2',
                        
                    ]}
                    onPress={() => setSelection(1)}>
                    <Text style={[styles.btnText, selection === 1 ? { color: "#0F1D40" } : '#8C93A3', {fontSize:14}, {fontWeight:'800'}]}>
                        Monthly
                    </Text>
                </TouchableOpacity>                
                <TouchableOpacity
                    style={[
                        styles.btn,
                        styles.lastBtn,  
                        selection === 3 ? { backgroundColor: "#6B7280" } : '#EEEFF2',
                    ]}
                    onPress={() => setSelection(3)}>
                    <Text style={[styles.btnText, selection === 3 ? { color: "#0F1D40" } : '#8C93A3', {fontSize:14}, {fontWeight:'800'}]}>
                        Annually
                    </Text>
                </TouchableOpacity>
            </View>

            {/* This will display the content based on the selected button */}
            <View style={styles.contentContainer}>
                {renderContent()}
            </View>
        {/* </SafeAreaView> */}
        </KeyboardAvoidingContainer>
  )
}

export default Subscribtion


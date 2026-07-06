import { useNavigation } from '@react-navigation/native'
import { Dimensions, StyleSheet, Text, View } from 'react-native'
import React, { useState } from 'react'
import { GestureHandlerRootView } from 'react-native-gesture-handler'
import KeyboardAvoidingContainer from '../../components/utils/KeyboardAvoidingContainer'
import { SafeAreaView } from 'react-native-safe-area-context'
import styles from '../../components/utils/styles'
import formatNaira from '../../components/FormatNaira'
import { PieChart } from 'react-native-gifted-charts'
import CustomAccountMenuCard from '../../components/CustomAccountMenuCard'
import ArrowRight from './../../assets/images/svg-icon/arrow-right.svg';
import Support from './../../assets/images/svg-icon/support.svg';
import PasswordSvg from './../../assets/images/svg-icon/password.svg';
import Audit from './../../assets/images/svg-icon/record.svg';
import PaymentRec from './../../assets/images/svg-icon/cash.svg';
import LogoutSvg from './../../assets/images/svg-icon/logout.svg';
import CardSvg from './../../assets/images/svg-icon/navigate.svg';
import CopySvg from './../../assets/images/svg-icon/copy.svg';
import CustomButton from '../../components/CustomButton'
import { MaterialIcons } from '@expo/vector-icons'
import CustomLabtracaInputText from '../../components/CustomLabtracaInputText'
import { TouchableOpacity } from '@gorhom/bottom-sheet'


const PaymentHistory = () => {
    const navigation = useNavigation();
    
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
    <KeyboardAvoidingContainer style={styles.containerBackGround}>
    <SafeAreaView style={styles.containerOrder}>

        <View style={[styles.card, {backgroundColor:'#F5F6F7', borderColor:'#E2E4E8', borderWidth:1,}]}>
            <View style={styles_.row1}>
                <View style={styles_.column}>
                        <Text style={[styles.titleText, {fontSize:20, color:'#0F1D40'}]}>Payed online</Text>
                </View>
                <View style={styles_.column1}>
                        <Text style={styles.titleFlatList}>{formatNaira(30000)}</Text>
                </View>
            </View>
            <View style={styles_.row1}>
                <View style={styles_.column}>
                        <Text style={[styles.titleText, {fontSize:12, color:'#DB8C09'}]}>Pending</Text>
                </View>
                <View style={styles_.column1}>
                        <Text style={styles_.timeText}>{"21/02 9:35AM"}</Text>
                </View>
            </View>
            
            <View style={styles.line}/>
            <View>
                <Text>Payment ref: <Text style={[styles_.timeText, {fontSize:10, fontWeight:'600', lineHeight:17}]}>NCKl4N0024564KGAJ14551dhjaa001</Text> <CopySvg width={10} height={10}/></Text>
            </View>

        </View>
        <View style={{paddingTop:5, paddingBottom:5}}/>
        <View style={[styles.card, {backgroundColor:'#F5F6F7', borderColor:'#E2E4E8', borderWidth:1,}]}>
            <View style={styles_.row1}>
                <View style={styles_.column}>
                        <Text style={[styles.titleText, {fontSize:20, color:'#0F1D40'}]}>Payed in office</Text>
                </View>
                <View style={styles_.column1}>
                        <Text style={styles.titleFlatList}>{formatNaira(30000)}</Text>
                </View>
            </View>
            <View style={styles_.row1}>
                <View style={styles_.column}>
                        <Text style={[styles.titleText, {fontSize:12, color:'#059669'}]}>Successful</Text>
                </View>
                <View style={styles_.column1}>
                        <Text style={styles_.timeText}>{"21/02 9:35AM"}</Text>
                </View>
            </View>
            
            <View style={styles.line}/>
            <View>
                <Text>Payment ref: <Text style={[styles_.timeText, {fontSize:10, fontWeight:'600', lineHeight:17}]}>NCKl4N0024564KGAJ14551dhjaa001</Text> <CopySvg width={10} height={10}/></Text>
            </View>

        </View>

        </SafeAreaView>
    </KeyboardAvoidingContainer>
    </GestureHandlerRootView>
  )
}

export default PaymentHistory;

const styles_ = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#f8f8f8',
  },
  scrollContainer: {
    paddingHorizontal: 10,
    alignItems: 'center',
  },
  chart: {
    alignSelf: 'center',
  },
  
  
  
  card: {
    backgroundColor: '#fff',
    borderRadius: 8,
    borderWidth:0,
    elevation: 1,
    marginVertical: 8,
    padding: 10,
  },
  cardSection: {
    marginBottom: 10,
  },
  acceptButton: {
    backgroundColor: '#059669',
    padding: 10,
    borderRadius: 5,
    alignItems: 'center',
  },
  buttonText: {
    color: '#fff',
    fontWeight: 'bold',
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  actionButton: {
    padding: 10,
    backgroundColor: '#2196F3',
    borderRadius: 5,
    flex: 0.48,
    alignItems: 'center',
  },
  actionText: {
    color: '#fff',
    fontWeight: 'bold',
  },
  detailsCard: {
    marginTop: 10,
    padding: 10,
    backgroundColor: '#f0f0f0',
    borderRadius: 5,
  },
  detailsText: {
    color: '#333',
  },

  timeText:{
    color:'#8C93A3',
    fontSize:13,
    fontWeight:'600',
    lineHeight:19.2,
  },
  column: {
    flex: 1,
    marginHorizontal: 5,
  },
  amountText: {
    color: '#fff',
    fontSize: 36,
    fontWeight: '700',
    marginBottom: 5,
  },
  commissionText: {
    color: '#fff',        
    fontSize: 12,
    fontWeight: '600',
  },
  rowTwo: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    width: '90%',
  },
  cardTwo: {
    backgroundColor: '#F5F6F7', 
    borderRadius: 10,
    paddingTop: 20,
    paddingBottom: 20,
    paddingLeft:10,
    width: '45%', 
    
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 5, 
  },
  largeText: {
    color: '#000000',
    fontSize: 28,
    fontWeight: '700',
    marginBottom: 10,
  },
  smallText: {
    color: '#8C93A3',
    fontSize: 12,
    fontWeight: '600',
  },
  cardInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#D3E5FE',
    borderColor: '#1B4ACB',
    borderWidth: 1,
    borderRadius: 4,
    padding: 10,
    marginVertical: 10,
    width:Dimensions.get('window').width  - 2 * 20
  },
  cardText: {
    color: '#1B4ACB',
    fontSize: 12,
    fontWeight:'400',
    flex: 1, 
  },
  checkboxContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 10,
    marginBottom: 20,
  },
  checkboxLabel: {
    marginLeft: 8,
    fontSize: 14,
    color: '#333',
  },
  card1: {
    width: '100%',
    padding: 20,
    borderRadius: 10,
    backgroundColor: '#F6F6F6',
    borderColor: '#E2E4E8',
    borderWidth: 1,
    elevation: 3,
    alignItems: 'center',
    justifyContent: 'center',
    marginVertical: 10,
  },
  uploadContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  uploadText: {
    fontSize: 16,
    color: '#888',
    marginLeft: 10,
  },
  backColor: {
    backgroundColor: '#F6F6F6',
  },
  labelText: {
    color: '#525C76',
    fontWeight: '800',
    fontSize: 14,
    lineHeight: 19.2,
    paddingBottom: 5,
  },
  row1: {
    flexDirection: 'row', 
    justifyContent: 'space-between', 
    width: '100%', 
  },
  selectedDuration: {
    backgroundColor: '#059669',
    color:'#fff'
},
  column1: {
    flex: 1, 
    alignItems: 'center', 
    marginHorizontal: 5, 
  },
  button: {
    padding: 10,
    backgroundColor: '#059669', 
    borderRadius: 5,
    justifyContent: 'center',
    alignItems: 'center',
    width: '100%', 
  },
  buttonPrev: {
    padding: 10,
    borderWidth:1.5,
    borderColor: '#059669', 
    borderRadius: 5,
    justifyContent: 'center',
    alignItems: 'center',
    width: '100%', 
  },
  buttonText1: {
    color: '#fff',
    fontSize: 16,
  },
  buttonTextPrev: {
    color: '#059669',
    fontSize: 16,
  },
});
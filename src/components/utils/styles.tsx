import { StyleSheet, StatusBar, Platform, Dimensions } from 'react-native';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    // padding: 5,
    backgroundColor: '#f8f8f8',
  },
  card: {
    backgroundColor: '#E2E4E8',
    borderRadius: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 5,
    elevation: 5,
    // marginVertical: 10,
    padding: 15,
  },
  cardAccount: {
    backgroundColor: '#FFFFFF',
    borderRadius: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 5,
    elevation: 5,
    // marginVertical: 10,
    padding: 35,
  },
  titleText: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
  },
  normalText: {
    fontSize: 16,
    color: '#555',
  },
  button: {
    backgroundColor: '#000000',
    padding: 10,
    borderRadius: 5,
    alignItems: 'center',
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
  text: {
    color: 'white',
    fontWeight: 'bold',
  },
  containerInputText: {
    padding: 5,
    borderRadius: 5,
  },
  inputText: {
    height: 40,
    borderColor: 'gray',
    borderWidth: 1,
    borderRadius: 5,
    paddingLeft: 10,
  },
  textLabel: {
    marginVertical: 5,
  },
  containerRadioButton: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 5,
  },
  labelRadioButton: {
    marginLeft: 10,
    // fontSize: 12,
  },
  listFlatList: {
    padding: 0,
  },
  itemFlatList: {
    // marginRight:200,
    // paddingRight: 5,
    marginVertical: 8,
    backgroundColor: '#E2E4E8',
    borderRadius: 10,
    // borderTopRightRadius:20,
    // width:Dimensions.get('window').width  - 2 * 30,
    alignItems:'stretch',
    // justifyContent:'center'

  },
  titleFlatList: {
    fontSize: 16,
    fontWeight:'800'
  },
  cardCustom: {
    backgroundColor: '#fff',
    borderRadius: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 5,
    elevation: 5, // Adds shadow effect on Android
    marginVertical: 10,
    overflow: 'hidden',
  },
  imageCustom: {
    width: '100%',
    height: 150,
  },
  textContainerCustom: {
    padding: 15,
  },
  titleCustom: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 5,
  },
  descriptionCustom: {
    fontSize: 14,
    color: 'gray',
  },
  containerCustomize: {
    flex: 1,
    borderRadius: 10,
    marginVertical: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 5,
    elevation: 5, // Adds shadow effect on Android
  },
  searchContainerSearch: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 3,
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderColor: '#E2E4E8',
    borderWidth: 1,
    marginVertical: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 1,
    elevation: 2, // Adds shadow on Android
  },
  iconSearch: {
    marginRight: 10,
  },
  inputSearch: {
    flex: 1,
    fontSize: 16,
    color: '#B2B7C2',
    paddingLeft:5
  },
  containerDropdown: {
    flex: 1,
    padding: 20,
  },
  dropdownDropdown: {
    backgroundColor: '#f0f0f0',
    borderColor: '#ccc',
    borderRadius: 10,
    paddingHorizontal: 10,
    height: 50,
  },
  dropdownContainerDropdown: {
    backgroundColor: '#fff',
    borderColor: '#ccc',
  },
  labelDropdown: {
    fontSize: 16,
    color: '#333',
  },
  arrowIconDropdown: {
    tintColor: '#333',
  },
  tickIconDropdown: {
    tintColor: 'green',
  },
  inputContainerDoubleIcons: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f0f0f0',
    borderRadius: 8,
    paddingHorizontal: 10,
    borderWidth: 1,
    borderColor: '#ccc',
    marginVertical: 10,
  },
  iconDoubleIcons: {
    marginRight: 10,
  },
  inputDoubleIcons: {
    flex: 1,
    fontSize: 16,
    color: '#333',
    paddingVertical: 10,
  },
  toggleIconDoubleIcons: {
    padding: 5,
  },
  keyboardAvoidingContainerStyle:{
    flex:1,
    backgroundColor:"#FFFFFF"
  },
  keyboardAvoidingContainerStyleContent:{
    padding:20,    
    paddingTop: Platform.OS === "android"?StatusBar.currentHeight-15:20,
    backgroundColor:"#FFFFFF",
  },
  labtracaBackColorButton:{
    backgroundColor:'#059669',
  },
  labtracaBackBorderTextButton:{
    color:'#059669',
    borderWidth:1,
    borderColor:'#000000',
    justifyContent:'center',
    alignItems:'center'
    
  },
  labtracaDisableBackGroundButton:{
    color:'#8247E5',
    backgroundColor:'#E2E4E8'
  },
  inputcontainer: {
    marginVertical: 10,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 5,
    paddingHorizontal: 10,
    borderWidth: 2,
  },
  inputIcon: {
    marginRight: 10,
    backgroundColor:'#FFFFFF',
  },
  inputInput: {
    flex: 1,
    fontSize: 16,
    fontWeight:'600',
    color: '#0F1D40',
    paddingVertical: 10,
    backgroundColor:'#FFFFFF'
  },
  inputToggleIcon: {
    padding: 5,
  },
  errorText: {
    color: 'grey',
    fontSize: 12,
    marginTop: 5,
  },
  labelText:{
    color:'#525C76',
    fontWeight:'800',
    fontSize:14,
    lineHeight:19.2,
    paddingBottom:5
  },
  labelButtonText:{
    color:'#059669',
    fontWeight:'800',
    fontSize:14,
    lineHeight:19.2,
    paddingBottom:5
  },
  labelEmpty:{

  },
  buttonWithLabtracaColor:{
    // marginRight:5,
    // marginLeft:5,
    // marginTop:10,
    // paddingTop:10,
    // paddingBottom:10,
    // backgroundColor:'#059669',
    borderRadius:4,
    borderWidth: 1,
    borderColor: '#059669'
  },
  containerBackGround: {
    alignContent:'center',
    // flex: 1,
    // // padding: 5,
    backgroundColor: '#FFFFFF',
  },
  containerBackGround_: {
    alignContent:'center',
    // flex: 1,
    // // padding: 5,
    backgroundColor: '#FFFFFF',
    padding:0,    
    // paddingTop: Platform.OS === "android"?StatusBar.currentHeight-15:20,
    // backgroundColor:"#FFFFFF",
  },
sizeSpaceBottom:{
  paddingBottom:20,
},
loginScreenButtonEnable:{
  // marginRight:5,
  // marginLeft:5,
  // marginTop:10,
  paddingTop:10,
  paddingBottom:10,
  backgroundColor:'#059669',
  borderRadius:4,
  borderWidth: 1,
  borderColor: '#fff'
},
loginTextEnable:{
    color:'#FFFFFF',
    textAlign:'center',
    fontSize:16,
    fontWeight:'800',
    paddingLeft : 10,
    paddingRight : 10,
    lineHeight:25.6
},
loginScreenButtonDisable:{
  // marginRight:5,
  // marginLeft:5,
  // marginTop:10,
  paddingTop:10,
  paddingBottom:10,
  backgroundColor:'#E2E4E8',
  borderRadius:4,
  borderWidth: 1,
  borderColor: '#fff'
},
loginTextDisable:{
    color:'#B2B7C2',
    textAlign:'center',
    fontSize:16,
    fontWeight:'800',
    paddingLeft : 10,
    paddingRight : 10,
    lineHeight:25.6
},

forgetPasswordText: {
  // margin: 10,
  paddingTop:30,
  paddingBottom:20,
  color: '#5C657D',
  textAlign: 'left',
  fontSize:14,
  fontWeight:'800'
},
centerText:{
  justifyContent:'center',
  textAlign:'center',
  color:'#525C76',
  fontWeight:'800',
  fontSize:16,
  // lineHeight:25.6,
  paddingBottom:10
},
newUsers:{
  justifyContent:'center',
    alignItems:'center'
},
newUser:{
  color:'#747C90',
justifyContent:'center',
  fontSize:14,
  fontWeight:'600',
  lineHeight:22.4
},
newUserGreen:{
  color:'#059669',
  fontSize:14,
  fontWeight:'600',
  lineHeight:22.4
},
containerBackGroundVerify: {
  flex: 1,
  justifyContent: 'center',
  alignItems: 'center',
  backgroundColor: '#FFF', // Adjust as needed
},
titleTextVerify: {  
  fontSize: 24,
  fontWeight: 'bold',
  marginBottom: 10,
  textAlign:'left',
  color:'#022920'
  
},
subtitleTextVerify: {
  fontSize: 16,
  marginBottom: 20,
  textAlign: 'left',
  paddingHorizontal:25
},
codeInputContainerVerify: {
  flexDirection: 'row',
  justifyContent: 'space-between',
  width: '80%',
  marginBottom: 20,
},
codeInputVerify: {
  width: 50,
  height: 50,
  borderWidth: 1,
  borderColor: '#ccc',
  borderRadius: 8,
  textAlign: 'center',
  fontSize: 24,
},
sizeSpaceBottomVerify: {
  marginBottom: 20, // Space between elements
},
forgetPasswordTextVerify: {
  fontSize: 14,
  color: 'tomato', // Adjust color as needed
  marginTop: 10,
},
loginTextEnableVerify: {
  color: '#FFF',
  fontSize: 18,
},

codeInputVerifyB: {
  borderWidth: 1,
  borderRadius: 4,
  padding: 10,
  textAlign: 'center',
  width: 300,
  height: 50,
  margin: 5,
  paddingTop:10,
  paddingBottom:10,
  backgroundColor:'#E2E4E8',
  // borderRadius:4,
  // borderWidth: 1,
  borderColor: '#fff'
},
codeInputeVerifyEnable:{
  paddingTop:10,
  paddingBottom:10,
  backgroundColor:'#059669',
  borderRadius:4,
  borderWidth: 1,
  borderColor: '#fff',
  textAlign: 'center',
  width: 300,
  height: 50,
  margin: 5,
},
titleTextVerifyForget: {
  fontSize: 24,
  fontWeight: 'bold',
  // Other existing styles
  textAlign: 'left', // Add this line to align to the left
},

/////Order css
containerOrder: {
  flex: 1,
  backgroundColor:'white'
},
btnGroup: {
  flexDirection: 'row',
  alignItems: "center",
  borderBottomWidth: 0,
  borderBottomColor: '#6B7280',
},
btn: {
  flex: 1,
  borderRightWidth: 0.0,
  borderLeftWidth: 0.0,
  borderColor: '#6B7280',
  paddingVertical: 12,
  borderRadius: 2, // Add border radius for all buttons
},
firstBtn: {
  borderTopLeftRadius: 5,  // Rounded top-left and bottom-left corners for the first button
  borderBottomLeftRadius: 5,
  paddingLeft:35,
  paddingRight:35,
},
lastBtn: {
  borderTopRightRadius: 5,  // Rounded top-right and bottom-right corners for the last button
  borderBottomRightRadius: 5,
  paddingLeft:35,
  paddingRight:35,
},
btnText: {
  textAlign: 'center',
  fontSize: 14,
},
contentContainer: {
  flex: 1,
  justifyContent: 'center',
  alignItems: 'center',
},
contentText: {
  fontSize: 18,
  color: '#333',
},
//FlatList for Order style
row: {
  flexDirection: 'row',
  justifyContent: 'space-between', // Push items to edges
  paddingHorizontal: 10,           // Add some horizontal padding
  // alignItems: 'center',            // Vertically center the text
  marginVertical: 5,              // Add vertical space

  
},
textLeft: {
  fontSize: 16,
  color: '#333',
},
textRight: {
  fontSize: 16,
  color: '#333',
},
borderContainerMin: {
  borderWidth: 1,          // Thickness of the border
  borderColor: '#8C93A3',  // Color of the border
  borderRadius: 5,         // Optional: Rounded corners for the border
  padding: 5,  
             // Optional: Add padding inside the View
  marginVertical: 5,       // Optional: Space above and below the View
},
containerFlat: {
  flex: 1,
  alignItems: 'center',  // Center FlatList horizontally
},
itemContent: {
  paddingHorizontal: 10,  // Padding left and right
},
////Order View card
headingTextOrder:{
  fontSize:24,
  fontWeight:"bold",
  paddingHorizontal:8
},
containerOrder_:{
      flex:1,
      // flexDirection:'row',
      padding:8,

},
cardOrder:{
  flex:1,
  justifyContent:'center',
  alignItems:'center',
  width:100,
  height:100,
  borderRadius:4,
  margin:8
},
cardElevatedOrder:{
  backgroundColor:'#FFFFFF',
  elevation:0,
  borderWidth:1,
  borderColor:'#EEEFF2',
  shadowOffset:{
      width:0, 
      height:0
  },
  // shadowColor:'#EF5354'
},
line: {
      width: '100%',          // Full width of the container
    height: 1,              // Thin line
    borderWidth: 1,         // Border width
    borderColor: '#CACDD5',    // Black color for the border (line)
    borderStyle: 'dashed',  // Dashed border style
    marginVertical: 10, 
      // width: '100%',          // Full width of the container
      // height: 1,              // Thin line
      // backgroundColor: '#000', // Black color for the line
      // marginVertical: 10,      // Space above and below the line
    },
    containerPackage: {
      flex: 1,
      padding: 20,
      justifyContent: 'center',
      backgroundColor: '#f0f0f0',  // Light background
    },

    ///////////////////
    containerProfile: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
      padding: 16,
      // backgroundColor: '#f0f0f0', // Optional background color
    },
    profileImageProfile: {
      width: 50,
      height: 50,
      borderRadius: 75, // Makes the image circular
      marginBottom: 16,
    },
    profileNameProfile: {
      fontSize: 24,
      fontWeight: 'bold',
      marginBottom: 8,
      color: '#333', // Optional text color
    },
    emailProfile: {
      fontSize: 12,
      color: '#666',
      marginBottom: 5,
    },
    cardAccountUser: {
      backgroundColor: '#FFFFFF',
      borderRadius: 10,
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.3,
      shadowRadius: 5,
      elevation: 5,
      // marginVertical: 10,
      padding: 35,
      width: Dimensions.get('window').width  - 2 * 20,
    },
    cardAccountRequest: {
      backgroundColor: '#FFFFFF',
      borderRadius: 10,
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.3,
      shadowRadius: 5,
      elevation: 5,
      // marginVertical: 10,
      padding: 5,
      // paddingRight:10,
      // width: Dimensions.get('window').width  - 2 * 20,
    },
    cardAccountRequestInner: {
      backgroundColor: '#F5F6F7',
      borderRadius: 10,
      borderColor: '#E2E4E8',
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.3,
      shadowRadius: 5,
      elevation: 5,
      marginVertical: 5,
      padding: 5,
      width: Dimensions.get('window').width - 2 * 36,
      overflow: 'hidden',
      

    },
    ///////////////////
    containerBackGroundEditProfile: {
      flex: 1,
      padding: 20,
      backgroundColor: '#fff',
  },
  containerProfileEditProfile: {
      alignItems: 'center',
      marginBottom: 20,
  },
  profileImageProfileEditProfile: {
      width: 100,
      height: 100,
      borderRadius: 50,
  },
  rowEditProfile: {
      flexDirection: 'row',
      justifyContent: 'space-between',
  },
  inputContainerEditProfile: {
      marginBottom: 12,
      
  },
  labelEditProfile: {
      fontSize: 16,
      fontWeight: '700',
      marginVertical: 8,
      lineHeight: 20.2,
      color: '#0F1D40',
  },
  inputEditProfile: {
      borderWidth: 2,
      borderColor: '#E2E4E8',
      height: 48,
      padding: 10,
      borderRadius: 5,      
      textAlign: 'center',
      fontSize: 16,
      fontWeight:'600',
      color: '#0F1D40',
      paddingVertical: 10,
      backgroundColor:'#FFFFFF'
      
  },
  errorTextEditProfile: {
      color: 'red',
      fontSize: 12,
  },
  sizeSpaceBottomEditProfile: {
      height: 20,
  },
  loginScreenButtonEnableEditProfile: {
      backgroundColor: '#10B981',
  },
  loginScreenButtonDisableEditProfile: {
      backgroundColor: '#C0C0C0',
  },
  loginTextEnableEditProfile: {
      color: '#fff',
  },
  loginTextDisableEditProfile: {
      color: '#808080',
  },
  // dropdown: {
  //   backgroundColor: '#f9f9f9',
  //   borderColor: '#ccc',
  // },
  // dropdownContainer: {
  //   backgroundColor: '#f9f9f9',
  // },
  containerBackGround_1: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    // Other styles...
  },
  dropdown: {
    height: 60,
    fontSize: 16,
    fontWeight:'600',
    color: '#0F1D40',
    borderColor: '#E2E4E8',
    borderWidth: 1,
    backgroundColor: '#fff',
    borderRadius: 8,
    paddingHorizontal: 10,

    // Add padding, margin, etc. as needed
  },
  dropdownContainer: {
    backgroundColor: '#fafafa',
    zIndex: 1000, // Ensure it's high enough
    // Other styles...
  },
  pickerContainer: {
    borderWidth: 2,
    borderRadius: 4,
    height:55,
    marginVertical: 5,
    overflow: 'hidden',
  },

  containerStyle:{
    backgroundColor:'#FFF'
  },
  textInputStyles:{
    height:48,
    color: 'black',
    fontSize:16,
    backgroundColor:'#F3F3F3'
  },
  spinnerTextStyle: {
    color: '#059669'
  },
  column_: {
    // flex: 1,
    // justifyContent: 'center',
    flex: 1,
    marginHorizontal: 5,
},
////////////////////////////////////////////////////////////////////Terms and Conditions
row1: {
  flexDirection: 'row',
  alignItems: 'center',
},
checkboxText: {
  fontSize: 12,
  fontWeight: '600',
  flex: 1,
},
linkText: {
  color: '#059669', // emerald-600
  textDecorationLine: 'underline',
},
modalOverlay: {
  flex: 1,
  backgroundColor: 'rgba(0,0,0,0.5)',
  justifyContent: 'center',
  padding: 20,
},
modalContent: {
  backgroundColor: '#fff',
  borderRadius: 10,
  padding: 16,
  maxHeight: '90%',
},
closeButton: {
  marginTop: 16,
  backgroundColor: '#059669',
  padding: 12,
  borderRadius: 8,
  alignItems: 'center',
},
closeButtonText: {
  color: '#fff',
  fontWeight: 'bold',
},
});

export default styles;

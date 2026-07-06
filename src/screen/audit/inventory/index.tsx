import React, {useEffect, useState} from 'react';
import {
  View,
  Text,
  TextInput,
  ScrollView,
  StyleSheet,
  SafeAreaView,
  Image,
  Pressable,
} from 'react-native';
import BackBtn from './../../../components/atoms/a-back-btn';
import {appColors, appFonts, hp, wp} from './../../../lib/utils/scale';
import SlideUpModal from './../../../hoc/slide-up-modal';
import CustomInput from './../../../components/molecules/m-controlled-input';
import {useForm} from 'react-hook-form';
// import {ROUTE_NAMES} from './../../../lib/constants';
import CloseSvg from './../../../assets/images/svg/close';
// import {useMutation, useQuery} from '@apollo/client';
// import {GetInventory} from '../../../../lib/graphql/Query';
// import {
//   InventoryConsumptionMutation,
//   InventoryConsumptionMutationVariables,
// } from '../../../../lib/types/generated/graphql';
// import {InventoryConsumption} from '../../../../lib/graphql/Mutation';

function UpdateScreen({route, navigation}: any) {
  // const {payload} = route.params;
  const [isFormModal, setIsFormModal] = useState(false);
  const [equipmentUsed, setEquipmentUsed] = useState([
    {item: 'Sample bottle', quantity: 1},
  ]);
  // Initialize useForm with default values from payload
  const {control, handleSubmit, reset, setValue} = useForm({
    defaultValues: {
      // clientName: `${payload.firstName} ${payload.lastName}`,
      // testName: payload.service.map(service => service.title).join(', '),
      numberOfPerson: 1,
    },
  });

  // useEffect(() => {
  //   // Pre-fill form with payload data
  //   setValue('clientName', `${payload.firstName} ${payload.lastName}`);
  //   setValue(
  //     'testName',
  //     payload.service.map(service => service.title).join(', '),
  //   );
  //   setValue('numberOfPerson', 1);
  // }, [payload]);

  const toggleFormModal = () => {
    setIsFormModal(!isFormModal);
    reset({});
  };

  const onAddEquipment = data => {
    setEquipmentUsed([...equipmentUsed, data]);
    toggleFormModal();
  };

  const onRemoveEquipment = index => {
    const copy = [...equipmentUsed];
    copy.splice(index, 1);
    setEquipmentUsed(copy);
  };

  // // const [updateInventory, {data, loading, error}] = useMutation<
  // //   InventoryConsumptionMutation,
  // //   InventoryConsumptionMutationVariables
  // // >(InventoryConsumption);

  // const onSubmit = async () => {
  //   const newInputs = equipmentUsed.map(equipment => ({
  //     clientName: payload.firstName + ' ' + payload.lastName,
  //     numberOfPerson: '1',
  //     testName: payload.service.map(service => service.title).join(', '),
  //     item: equipment.item,
  //     quantity: equipment.quantity,
  //   }));
  //   console.log('equipmentUsed', newInputs);

  //   try {
  //     const response = await updateInventory({
  //       variables: {inputs: newInputs},
  //     });
  //     if (response.data?.inventoryConsumption.errors) {
  //       console.error(
  //         'Mutation errors:',
  //         response.data.inventoryConsumption.errors,
  //       );
  //     } else {
  //       console.log('Mutation successful');
  //       // Navigate to audit history screen on successful submission
  //       navigation.navigate(ROUTE_NAMES.AUDIT_HISTORY);
  //     }
  //   } catch (error) {
  //     console.error('Error executing mutation:', error);
  //   } finally {
  //     // Navigation to audit history screen
  //     // navigation.navigate(ROUTE_NAMES.AUDIT_HISTORY);
  //   }
  // };

  return (
    <SafeAreaView style={{flex: 1, backgroundColor: '#FFFFFF'}}>
      <ScrollView>
        <View
          style={{
            flexDirection: 'row',
            padding: 10,
            alignItems: 'center',
            gap: 30,
          }}>
          <BackBtn withStraigthLine navigation={navigation} />
          <Text style={styles.title}>Update inventory</Text>
        </View>
        <View style={styles.formContainer}>
          <View>
            <View>
              <Text style={styles.inputText}>Enter client name</Text>
              <CustomInput
                name="clientName"
                styles={styles.input}
                placeholder="Enter client name"
                control={control}
              />
            </View>
            <View>
              <Text style={styles.inputText}>Test</Text>
              <CustomInput
                name="testName"
                styles={styles.input}
                placeholder="Enter test name"
                control={control}
              />
            </View>
          </View>
          <View>
            <Text style={styles.subTitle}>Add equipment's used</Text>
            {equipmentUsed.map((equipment, index) => (
              <View
                key={index}
                style={{flexDirection: 'row', justifyContent: 'space-between'}}>
                <Text style={styles.paragraph}>{equipment.item}</Text>
                <View style={{flexDirection: 'row', gap: 10}}>
                  <View
                    style={{alignItems: 'center', justifyContent: 'center'}}>
                    <Text
                      style={{
                        fontSize: hp(2),
                        textAlign: 'center',
                        alignItems: 'center',
                      }}>
                      {equipment.quantity}
                    </Text>
                  </View>
                  <Pressable onPress={() => onRemoveEquipment(index)}>
                    <Image
                      source={require('../../../../assets/images/png/delete.png')}
                      style={{width: 32, height: 30}}
                    />
                  </Pressable>
                </View>
              </View>
            ))}
            <View
              style={{
                borderRadius: 1,
                borderStyle: 'dashed',
                borderWidth: 1,
                borderColor: '#B2B7C2',
                marginVertical: 20,
              }}
            />
          </View>
          <View style={{paddingVertical: 20}}>
            <Pressable
              onPress={toggleFormModal}
              style={styles.addEquipmentContainer}>
              <Image
                source={require('../../../../assets/images/png/add.png')}
                style={{width: 32, height: 30}}
              />
              <Text style={styles.addEquipmentText}>Add equipment</Text>
            </Pressable>
          </View>

          <Pressable onPress={() => onSubmit()}>
            <View style={styles.button}>
              <Text style={styles.buttonText}>Submit</Text>
            </View>
          </Pressable>
        </View>
      </ScrollView>
      <SlideUpModal isModalVisible={isFormModal} toggleModal={toggleFormModal}>
        <View
          style={{
            height: hp(90),
            marginHorizontal: wp(0),
            paddingTop: hp(4),
            borderTopLeftRadius: 15,
            borderTopRightRadius: 15,
            backgroundColor: appColors.white,
          }}>
          <View style={styles.formBodyStyles}>
            <View
              style={{
                flexDirection: 'row',
                alignItems: 'center',
                justifyContent: 'flex-start',
                gap: 12,
                marginBottom: 22,
              }}>
              <Pressable
                onPress={toggleFormModal}
                style={{
                  padding: 8,
                  borderWidth: 0.8,
                  alignItems: 'center',
                  justifyContent: 'center',
                  borderRadius: 8,
                  borderColor: appColors['gray-50'],
                  width: wp(10),
                }}>
                <CloseSvg />
              </Pressable>
              <View
                style={{
                  width: wp(100) - wp(35),
                  justifyContent: 'center',
                  alignItems: 'center',
                }}>
                <Text
                  style={{
                    fontFamily: appFonts?.semiBoldText?.fontFamily,
                    color: appColors?.black,
                    fontSize: hp(2),
                  }}>
                  Add equipment
                </Text>
              </View>
            </View>
            <View style={styles.formInputContStyles}>
              <Text style={styles.formLableStyles}>Input equipment</Text>
              <CustomInput
                name="item"
                styles={styles.inputsStyle}
                placeholder="Sample bottle"
                control={control}
              />
            </View>
            <View style={styles.formInputContStyles}>
              <Text style={styles.formLableStyles}>Quantity</Text>
              <CustomInput
                name="quantity"
                styles={styles.inputsStyle}
                placeholder="Enter quantity used"
                control={control}
              />
            </View>
            <View>
              <Pressable
                style={[styles.submitBtnStyle]}
                onPress={handleSubmit(onAddEquipment)}>
                <Text style={[styles.submitBtnTextStyle]}>Add</Text>
              </Pressable>
            </View>
          </View>
        </View>
      </SlideUpModal>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  title: {
    justifyContent: 'center',
    textAlign: 'center',
    fontSize: hp(3),
    fontFamily: appFonts.semiBoldText.fontFamily,
  },
  formContainer: {
    paddingHorizontal: 20,
    paddingTop: 20,
  },
  inputText: {
    fontSize: hp(1.5),
    paddingVertical: 10,
  },
  input: {
    height: 40,
    borderColor: '#E2E4E8',
    borderRadius: 3,
    paddingHorizontal: 10,
  },
  subTitle: {
    fontSize: hp(2.5),
    fontFamily: appFonts.semiBoldText.fontFamily,
    paddingVertical: 10,
    marginTop: 20,
  },
  paragraph: {
    fontSize: hp(2),
    fontFamily: appFonts.semiBoldText.fontFamily,
  },
  addEquipmentContainer: {
    flexDirection: 'row',
    gap: 10,
    alignItems: 'center',
  },
  addEquipmentText: {
    fontSize: hp(2),
    fontFamily: appFonts.regularText.fontFamily,
  },
  button: {
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 3,
    paddingVertical: 15,
    paddingHorizontal: 10,
    backgroundColor: appColors.primaryGreen,
  },
  buttonText: {
    fontSize: hp(2),
    fontWeight: 'bold',
    color: appColors.white,
    textAlign: 'center',
  },
  formBodyStyles: {
    paddingHorizontal: 14,
  },
  formInputContStyles: {
    marginBottom: hp(3),
  },
  formLableStyles: {
    fontFamily: appFonts?.semiBoldText.fontFamily,
    fontSize: hp(1.6),
    color: appColors?.black,
    marginBottom: hp(0.5),
  },
  inputsStyle: {
    paddingVertical: hp(1.5),
    paddingLeft: hp(1),
    width: wp(100),
  },
  submitBtnStyle: {
    marginTop: hp(2),
    backgroundColor: appColors?.primaryGreen,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: hp(1.8),
    borderRadius: 3,
  },
  submitBtnTextStyle: {
    fontFamily: appFonts.semiBoldText.fontFamily,
    fontSize: hp(1.8),
    color: appColors?.white,
  },
});

export default UpdateScreen;

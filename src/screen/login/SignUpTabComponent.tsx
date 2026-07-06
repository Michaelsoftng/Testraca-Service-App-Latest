import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import KeyboardAvoidingContainer from '../../components/utils/KeyboardAvoidingContainer';
import styles_ from '../../components/utils/styles';
import Signup from './Signup';

const SignUpTabComponent = ({ navigation }) => {
  const [userTypes, setUserTypes] = useState('PHLEBOTOMIST');

  return (
    <KeyboardAvoidingContainer style={styles_.containerBackGround}>
      <View style={styles_.containerBackGround}>
        <View style={styles.container}>
          {/* Tab Header */}
          <Text style={styles.titleText}>Sign up</Text>

          <View style={styles.tabContainer}>
            <TouchableOpacity
              style={[
                styles.tab,
                userTypes === 'PHLEBOTOMIST' ? styles.activeTab : styles.inactiveTab,
              ]}
              onPress={() => {
                setUserTypes('PHLEBOTOMIST');
                navigation.navigate('Login', { userTypes: 'PHLEBOTOMIST' });
              }}
            >
              <Text
                style={[
                  styles.tabText,
                  userTypes === 'PHLEBOTOMIST' && styles.activeTabText,
                ]}
              >
                Phlebotomist
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[
                styles.tab,
                userTypes === 'DOCTOR' ? styles.activeTab : styles.inactiveTab,
              ]}
              onPress={() => {
                setUserTypes('DOCTOR');
                navigation.navigate('Login', { userTypes: 'DOCTOR' });
              }}
            >
              <Text
                style={[
                  styles.tabText,
                  userTypes === 'DOCTOR' && styles.activeTabText,
                ]}
              >
                Doctor
              </Text>
            </TouchableOpacity>
          </View>

          {/* Underline Separator */}
          <View style={styles.line} />

          {/* Signup Component */}
          <Signup userTypes={userTypes} />
        </View>
      </View>
    </KeyboardAvoidingContainer>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 20,
  },
  titleText: {
    fontSize: 25,
    fontWeight: '600',
    color: '#022920',
    lineHeight: 37,
    paddingLeft: 10,
    paddingBottom: 20,
  },
  tabContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    backgroundColor: '#E0E0E0',
    borderRadius: 10,
    marginBottom: 5,
  },
  tab: {
    flex: 1,
    paddingVertical: 15,
    alignItems: 'center',
    borderTopLeftRadius: 10,
    borderTopRightRadius: 10,
  },
  activeTab: {
    backgroundColor: '#059669',
  },
  inactiveTab: {
    backgroundColor: '#D3D3D3',
  },
  tabText: {
    color: '#000',
    fontSize: 16,
  },
  activeTabText: {
    color: '#fff',
    fontWeight: 'bold',
  },
  line: {
    width: '100%',
    height: 2,
    backgroundColor: '#059669',
  },
});

export default SignUpTabComponent;

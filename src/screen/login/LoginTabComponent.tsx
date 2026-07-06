import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import KeyboardAvoidingContainer from '../../components/utils/KeyboardAvoidingContainer';
import styles_ from '../../components/utils/styles';
import Login from './Login';
import { useNavigation } from '@react-navigation/native';

const LoginTabComponent = () => {
  const navigation = useNavigation();
  const [userTypes, setUserTypes] = useState('PHLEBOTOMIST');

  return (
    <KeyboardAvoidingContainer style={styles_.containerBackGround}>
      <View style={styles_.containerBackGround}>
        <View style={styles.container}>
          {/* Tab Header */}
          <Text style={styles.titleText}>Login</Text>

          {/* Tabs */}
          <View style={styles.tabContainer}>
            <TouchableOpacity
              style={[
                styles.tab,
                userTypes === 'PHLEBOTOMIST' ? styles.activeTab : null,
              ]}
              onPress={() => {
                setUserTypes('PHLEBOTOMIST'); // Ensure state updates
                navigation.navigate('Login', { userTypes: 'PHLEBOTOMIST' });
              }}
            >
              <Text
                style={[
                  styles.tabText,
                  userTypes === 'PHLEBOTOMIST' ? styles.activeTabText : null,
                ]}
              >
                Phlebotomist
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[
                styles.tab,
                userTypes === 'DOCTOR' ? styles.activeTab : null,
              ]}
              onPress={() => {
                setUserTypes('DOCTOR'); // Ensure state updates
                navigation.navigate('Login', { userTypes: 'DOCTOR' });
              }}
            >
              <Text
                style={[
                  styles.tabText,
                  userTypes === 'DOCTOR' ? styles.activeTabText : null,
                ]}
              >
                Doctor
              </Text>
            </TouchableOpacity>
          </View>

          {/* Separator Line */}
          <View style={styles.line} />

          {/* Login Component */}
          <Login userTypes={userTypes} />
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

export default LoginTabComponent;

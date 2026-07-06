import React, { useState } from 'react';
import { View, Text, Button, Alert, StyleSheet, ScrollView } from 'react-native';
import * as DocumentPicker from 'expo-document-picker';
import * as FileSystem from 'expo-file-system';
import RNPickerSelect from 'react-native-picker-select';
import Icon from 'react-native-vector-icons/MaterialIcons'; 
import Success from '../../../assets/images/svg-icon/successful';
import { useNavigation } from '@react-navigation/native';

const FileUploadCard = () => {
    const navigation = useNavigation();
  const [numFiles, setNumFiles] = useState(1); 
  const [files, setFiles] = useState([]);
  const [status, setStatus] = useState([]); 

  
  const pickFile = async (index) => {
    try {
      let result = await DocumentPicker.getDocumentAsync({
        type: ['application/pdf', 'application/msword', 'image/*'],
        copyToCacheDirectory: true,
      });

      if (result.type === 'success') {
        const fileSize = await FileSystem.getInfoAsync(result.uri);
        if (fileSize.size > 2 * 1024 * 1024) {
          Alert.alert('Error', 'File size exceeds 2MB!');
          return;
        }

        
        let updatedFiles = [...files];
        updatedFiles[index] = result;

        let updatedStatus = [...status];
        updatedStatus[index] = 'done'; 

        setFiles(updatedFiles);
        setStatus(updatedStatus);
      }
    } catch (error) {
      Alert.alert('Error', 'Failed to pick file');
      console.error(error);
    }
  };

  
  const renderFileUploadFields = () => {
    let fields = [];
    for (let i = 0; i < numFiles; i++) {
      fields.push(
        <View key={i} style={styles.fileUploadContainer}>
          <Text style={styles.fileLabel}>Test {i + 1}</Text>
          <Button title="Browse" onPress={() => pickFile(i)} />
          {files[i] && (
            <View style={styles.fileInfo}>
              <Text style={styles.fileName}>{files[i].name}</Text>
              <Success width={40} height={40} />
              {/* Indicate success */}
              {status[i] === 'done' && (
                <Text style={styles.doneText}>Done</Text>
              )}
            </View>
          )}
        </View>
      );
    }
    return fields;
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>Upload Files</Text>

      {/* Dropdown for selecting number of files */}
      <Text>How many test doy want us to review (Each is NGN 1000)</Text>
      <RNPickerSelect
        onValueChange={(value) => setNumFiles(value)}
        items={[
          { label: '1', value: 1 },
          { label: '2', value: 2 },
          { label: '3', value: 3 },
          { label: '4', value: 4 },
          { label: '5', value: 5 },
        ]}
        value={numFiles}
        style={pickerSelectStyles}
      />

      {/* Dynamic file upload fields */}
      {renderFileUploadFields()}

        <Text style={styles.fileLabel}>Total cost {numFiles * 1000}</Text>
      <View style={styles.buttonContainer}>
                    <Button title="Continue" color="#059669" onPress={() => { navigation.navigate('cabinet_page'); }} />
                </View>
      <View>
        <Text>
            Once done go to Payment
        </Text>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 20,
    backgroundColor: '#fff',
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
  },
  fileUploadContainer: {
    marginBottom: 15,
  },
  fileLabel: {
    fontSize: 16,
    marginBottom: 5,
  },
  fileInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 5,
  },
  fileName: {
    marginRight: 10,
    fontSize: 14,
    color: 'gray',
  },
  doneText: {
    marginLeft: 10,
    fontSize: 14,
    color: 'green', 
    fontWeight: 'bold',
  },
  buttonContainer: {
    marginTop: 20,
},
});

const pickerSelectStyles = {
  inputIOS: {
    fontSize: 16,
    paddingVertical: 12,
    paddingHorizontal: 10,
    borderWidth: 1,
    borderColor: 'gray',
    borderRadius: 4,
    color: 'black',
    paddingRight: 30,
    marginBottom: 20,
  },
  inputAndroid: {
    fontSize: 16,
    paddingHorizontal: 10,
    paddingVertical: 8,
    borderWidth: 1,
    borderColor: 'gray',
    borderRadius: 4,
    color: 'black',
    paddingRight: 30,
    marginBottom: 20,
  },

};

export default FileUploadCard;

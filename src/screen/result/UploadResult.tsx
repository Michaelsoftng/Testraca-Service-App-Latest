import * as DocumentPicker from 'expo-document-picker';
import { StyleSheet, Text, View } from 'react-native';
import React, { useState } from 'react';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { TouchableOpacity } from '@gorhom/bottom-sheet';
import { SafeAreaView } from 'react-native-safe-area-context';
import KeyboardAvoidingContainer from '../../components/utils/KeyboardAvoidingContainer';
import styles_ from '../../components/utils/styles';
import CustomLabtracaInputText from '../../components/CustomLabtracaInputText';
import Upload from './../../assets/images/svg-icon/bytesize_upload';
import CustomButton from '../../components/CustomButton';

const UploadResult = () => {
  const [uploadedFiles, setUploadedFiles] = useState([]);

  const handleFileSelection = async () => {
    try {
      const result = await DocumentPicker.getDocumentAsync();
      if (result.assets[0]?.name) {

        
            
            
            
            
            
            
            
        const newFile = {
          uri: result.assets[0]?.uri,
          name: result.assets[0]?.name,
          type: result.assets[0]?.mimeType,
        };
        setUploadedFiles((prevFiles) => [...prevFiles, newFile]);
      }
    } catch (error) {
      console.error('Error selecting document:', error);
    }
  };

  const handleFileRemoval = (index) => {
    setUploadedFiles((prevFiles) => prevFiles.filter((_, i) => i !== index));
  };

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <KeyboardAvoidingContainer style={styles_.containerBackGround}>
        <SafeAreaView style={styles_.containerOrder}>
          <View
            style={{
              backgroundColor: '#059669',
              width: 75,
              height: 23,
              gap: 8,
              paddingTop: 2,
              paddingLeft: 8,
              paddingBottom: 2,
              paddingRight: 8,
              borderRadius: 3,
            }}
          >
            <Text style={{ color: '#FFFFFF' }}>Patient 1</Text>
          </View>
          <Text style={[styles_.titleFlatList, { color: '#0F1D40', fontSize: 14, fontWeight: '700' }]}>
            {'COVID 19 Qualitive Pro throat swab'}
          </Text>

          <View style={{ paddingTop: 8, paddingBottom: 8 }} />
          <CustomLabtracaInputText
            title="For Sarah Joe"
            placeholder="Description"
            backStyle={styles.backColor}
            textArea={true}
          />
          <Text style={[styles.timeText, { fontSize: 11 }]}>
            Acceptable file types: .doc, .docx, .pdf, .jpg, and .png
          </Text>
          <TouchableOpacity
            style={[styles.card, styles.backColor]}
            onPress={handleFileSelection}
          >
            <View style={styles.uploadContainer}>
              <Upload width={20} height={15} />
              <Text style={styles.uploadText}>Upload Document</Text>
            </View>
          </TouchableOpacity>

          <View style={{ paddingTop: 8, paddingBottom: 8 }} />

          {/* Render uploaded files */}
          {uploadedFiles.length > 0 && (
            <View>
              {uploadedFiles.map((file, index) => (
                <View key={index} style={styles.fileRow}>
                  <Text style={styles.uploadText}>{file.name}</Text>
                  <TouchableOpacity
                    onPress={() => handleFileRemoval(index)}
                    style={styles.removeButton}
                  >
                    <Text style={styles.removeButtonText}>Remove</Text>
                  </TouchableOpacity>
                </View>
              ))}
            </View>
          )}
    <View style={{ paddingTop: 8, paddingBottom: 8 }} />

    <CustomButton
            backgroundColor={styles_.loginScreenButtonEnable}
            children={
              <Text style={styles_.loginTextEnable}>{'Send Result'}</Text>
            }
            
          />
        </SafeAreaView>
      </KeyboardAvoidingContainer>
    </GestureHandlerRootView>
  );
};

export default UploadResult;

const styles = StyleSheet.create({
  timeText: {
    color: '#8C93A3',
    fontSize: 13,
    fontWeight: '600',
    lineHeight: 19.2,
  },
  backColor: {
    backgroundColor: '#F6F6F6',
  },
  container: {
    flex: 1,
    padding: 20,
  },
  card: {
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
  fileRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#E2E4E8',
  },
  removeButton: {
    
    
    
    
  },
  removeButtonText: {
    color: '#FF6B6B',
    fontSize: 12,
  },
});















  
















  
























































































     











































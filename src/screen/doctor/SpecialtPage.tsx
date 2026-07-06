import React, { useState } from 'react';
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  StyleSheet,
} from 'react-native';
import CustomSearchInput from '../../components/CustomSearchInput';
import styles_ from '../../components/utils/styles';
import { useNavigation } from '@react-navigation/native';

const specialties = [
  'General Practice',
  'Pathology',
  'Family Medicine',
  'Internal Medicine',
  'Pediatrics',
  'Geriatrics',
  'Cardiology',
  'Endocrinology',
  'Gastroenterology',
  'Hematology',
  'Oncology',
  'Nephrology',
  'Rheumatology',
  'Infectious Disease',
  'Dermatology',
  'Allergy and Immunology',
  'Obstetrics',
  'Gynecology',
];

const SpecialtPage = () => {
    const navigation = useNavigation(); 
  const [searchText, setSearchText] = useState('');
  const [filteredSpecialties, setFilteredSpecialties] = useState(specialties);
  const [selectedSpecialty, setSelectedSpecialty] = useState(null);
  const [visibleCount, setVisibleCount] = useState(5);

  const handleSearch = (text) => {
    setSearchText(text);
    if (text.trim() === '') {
      setFilteredSpecialties(specialties);
    } else {
      const filtered = specialties.filter((item) =>
        item.toLowerCase().includes(text.toLowerCase())
      );
      setFilteredSpecialties(filtered);
    }
  };

  const renderSpecialtyItem = ({ item }) => (
    <TouchableOpacity
      style={[styles.card,    selectedSpecialty === item && {borderColor: '#059669'},]}
      onPress={() => setSelectedSpecialty(item)}
    >
          <View style={styles.radioContainer}>
        <View
          style={[
            styles.radio,
            selectedSpecialty === item && styles.radioSelected,
          ]}
        />
      </View>
      <Text style={styles.cardText}>{item}</Text>
    
    </TouchableOpacity>
  );

  return (
    <View style={styles_.containerBackGround}>
      <View style={[{ paddingLeft: 5, paddingRight: 5, paddingBottom: 8 }]}>
        <CustomSearchInput
          placeholder="Search"
          value={searchText}
          onChangeText={handleSearch}        
        />
      </View>
      <View style={styles.column}>
        <FlatList
          data={filteredSpecialties.slice(0, visibleCount)}
          renderItem={renderSpecialtyItem}
          keyExtractor={(item) => item}
          contentContainerStyle={styles.list}
        />
        {visibleCount < filteredSpecialties.length && (
          <View style={[{paddingBottom:20}]}>
                <TouchableOpacity
            style={styles.moreButton}
            onPress={() => setVisibleCount(visibleCount + 5)}
          >
            <Text style={styles.moreButtonText}>Show More</Text>
          </TouchableOpacity>
            </View>
        )}
      </View>
      <View style={styles.column}>
        <TouchableOpacity
          style={styles.button}
        //   consult_form

          onPress={() => { 
            if (selectedSpecialty) {
                alert(`Selected: ${selectedSpecialty}`);
                    navigation.navigate('consult_form', {selectedSpecialty});
              } else {
                alert('Please select a specialty before proceeding.');
              }
        
        }
            
            // alert(`Selected: ${selectedSpecialty || 'None'}`)
            // navigation.navigate('request_test', {
            //     testID, testName, currentAddress, latitude, 
            //     longitude, patientId, token, facilityId, facilityName, facilityType, price, distance
            //   });
        
        }
        >
          <Text style={styles.buttonText}>Next</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
    moreButtonText: {
        color: '#059669',
        fontSize: 14,
        fontWeight: '700',
    },
    moreButton: {
        borderRadius: 5,
        alignItems: 'center',
        marginTop: 10,
    },
    card: {
        flexDirection: 'row',
        alignItems: 'center', // Align items vertically
        padding: 10,
        marginBottom: 10,
        borderWidth: 1,
        borderColor: '#ccc',
        borderRadius: 5,
        backgroundColor: '#f9f9f9',
      },
      radioContainer: {
        width: 20,
        height: 20,
        borderRadius: 10,
        borderWidth: 1,
        borderColor: '#ccc',
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 10, // Adjust spacing between radio and text
      },
      radio: {
        width: 12,
        height: 12,
        borderRadius: 6,
        backgroundColor: '#fff',
      },
      radioSelected: {
        backgroundColor: '#059669',
      },
      cardText: {
        fontSize: 16,
        fontWeight:'600',
        color:'#3C3C3C',
      },
  column: {
    flex: 1,
    marginHorizontal: 5,
  },
  list: {
    paddingTop: 10,
  },
  button: {
    backgroundColor: '#059669',
    paddingVertical: 15,
    paddingHorizontal: 20,
    borderRadius: 5,
    alignItems: 'center',
    marginTop: 'auto',
  },
  buttonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
  },
  showMoreButton: {
    paddingVertical: 10,
    alignItems: 'center',
    backgroundColor: '#007BFF',
    borderRadius: 5,
    marginTop: 10,
  },
  showMoreText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 14,
  },
});

export default SpecialtPage;


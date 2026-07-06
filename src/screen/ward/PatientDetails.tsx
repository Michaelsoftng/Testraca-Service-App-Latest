import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, FlatList, ActivityIndicator } from 'react-native';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { GET_ALL_TEST } from '../../schema/ApiSchema';
import { URL_LINK } from '../../../config';

const PatientDetails = () => {
  const [token, setToken] = useState(null);
  const [refreshToken, setRefreshToken] = useState(null);
  const [patientId, setPatientId] = useState(null);
  const [data, setData] = useState([]);
  const [error, setError] = useState(null);
  const [limit] = useState(10); 
  const [offset, setOffset] = useState(0); 
  const [searchQuery, setSearchQuery] = useState(''); 
  const [isLoading, setIsLoading] = useState(false); 
  const [hasMore, setHasMore] = useState(true);

  
  useEffect(() => {
    const fetchToken = async () => {
      try {
        const storedToken = await AsyncStorage.getItem('userToken');
        const storedRefreshToken = await AsyncStorage.getItem('refreshToken');
        const storedID = await AsyncStorage.getItem('id');

        setToken(storedToken);
        setRefreshToken(storedRefreshToken);
        setPatientId(storedID);
      } catch (err) {
        console.error("Error fetching token:", err.message);
      }
    };
    fetchToken();
  }, []);

  
  const fetchData = async (newOffset = 0) => {
    if (token) {
      if (isLoading) return;
      setIsLoading(true);
      try {
        const response = await axios.post(
          URL_LINK,
          {
            query: GET_ALL_TEST,
            variables: {
              limit,
              offset: newOffset,
            },
          },
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        const fetchedData = response.data.data.getAllTest || [];

        setData((prevData) => [...prevData, ...fetchedData]);
        setHasMore(fetchedData.length === limit);
        setOffset(newOffset + limit); 
        console.log('Fetched Data:', fetchedData);
      } catch (err) {
        console.log('Error fetching data:', err.message);
        setError(err.message);
      } finally {
        setIsLoading(false);
      }
    }
  };

  
  useEffect(() => {
    fetchData(0); 
  }, [token]);

  const handleLoadMore = () => {
    if (!hasMore || isLoading) return;
    fetchData(offset);
  };

  
  const filteredData = data.filter((item) =>
    item.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <View style={[{ padding: 16 }, {paddingBottom:50,}]}>
      <TextInput
        placeholder="Search tests..."
        value={searchQuery}
        onChangeText={(text) => setSearchQuery(text)}
        style={{
          height: 40,
          borderColor: 'gray',
          borderWidth: 1,
          marginBottom: 16,
          paddingHorizontal: 8,
        }}
      />

      {filteredData.length > 0 ? (
        <FlatList
          data={filteredData}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <View style={{ padding: 8, borderBottomWidth: 1, borderColor: '#ddd' }}>
              <Text style={{ fontWeight: 'bold' }}>{item.name}</Text>
              <Text>Code: {item.code}</Text>
              <Text>Type: {item.testType}</Text>
              <Text>Group: {item.group}</Text>
              <Text>Description: {item.description || 'N/A'}</Text>
            </View>
          )}
          onEndReached={handleLoadMore}
          onEndReachedThreshold={0.4}
          ListFooterComponent={
            isLoading ? (
              <View style={{ paddingVertical: 12, alignItems: 'center' }}>
                <ActivityIndicator size="small" color="#059669" />
                <Text style={{ color: '#94a3b8', fontSize: 12, marginTop: 8 }}>Loading more records...</Text>
              </View>
            ) : null
          }
        />
      ) : (
        <Text>{error ? `Error: ${error}` : 'No data available'}</Text>
      )}
    </View>
  );
};

export default PatientDetails;























































































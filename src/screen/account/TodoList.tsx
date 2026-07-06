import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, TouchableOpacity, StyleSheet, Alert, Button } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

const STORAGE_KEY = '@todo_list';

const TodoList = ({ navigation }) => {
  const [todos, setTodos] = useState([]);

  // Load data when the component mounts
  useEffect(() => {
    const loadData = async () => {
        
      const storedTodos = await AsyncStorage.getItem(STORAGE_KEY);
      if (storedTodos) setTodos(JSON.parse(storedTodos));
    };
    loadData();
  }, []);

  // Save data whenever `todos` changes
  useEffect(() => {
    const saveData = async () => {
        console.info('YEAD:: ', todos); 
      await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(todos));
    };
    saveData();
  }, [todos]);

  const deleteTodo = (id) => {
    Alert.alert('Delete Todo', 'Are you sure you want to delete this task?', [
      { text: 'Cancel', style: 'cancel' },
      { text: 'Delete', onPress: () => setTodos(todos.filter(todo => todo.id !== id)) },
    ]);
  };

  return (
    <View style={styles.container}>
      <FlatList
        data={todos}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <View style={styles.todoItem}>
            <TouchableOpacity
              onPress={() => navigation.navigate('AddEditTodo', { todo: item, setTodos })}
            >
              <Text style={styles.todoText}>{item.title}</Text>
            </TouchableOpacity>
            <Button title="Delete" color="red" onPress={() => deleteTodo(item.id)} />
          </View>
        )}
      />
      <TouchableOpacity
        style={styles.addButton}
        onPress={() => navigation.navigate('AddEditTodo', { setTodos })}
      >
        <Text style={styles.addButtonText}>+</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20 },
  todoItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: 15,
    marginBottom: 10,
    backgroundColor: '#f0f0f0',
    borderRadius: 5,
  },
  todoText: { fontSize: 16 },
  addButton: {
    position: 'absolute',
    bottom: 20,
    right: 20,
    backgroundColor: '#6200ee',
    borderRadius: 50,
    width: 60,
    height: 60,
    justifyContent: 'center',
    alignItems: 'center',
  },
  addButtonText: { color: '#fff', fontSize: 24 },
});

export default TodoList;

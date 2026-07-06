import React, { useState } from 'react';
import { View, TextInput, Button, StyleSheet } from 'react-native';
// import { v4 as uuidv4 } from 'uuid';

const AddEditTodo = ({ route, navigation }) => {
  const { todo, setTodos } = route.params;
  const [title, setTitle] = useState(todo ? todo.title : '');

  const handleSave = () => {
    if (!title.trim()) {
      alert('Title cannot be empty');
      return;
    }

    if (todo) {
      // Update existing todo
      setTodos((prev) =>
        prev.map((t) => (t.id === todo.id ? { ...t, title } : t))
      );
    } else {
      // Add new todo
      // setTodos((prev) => [...prev, { id: uuidv4(), title }]);
    }
    navigation.goBack();
  };

  return (
    <View style={styles.container}>
      <TextInput
        style={styles.input}
        placeholder="Enter task title"
        value={title}
        onChangeText={setTitle}
      />
      <Button title="Save" onPress={handleSave} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, justifyContent: 'center' },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    padding: 10,
    marginBottom: 20,
    borderRadius: 5,
    fontSize: 16,
  },
});

export default AddEditTodo;

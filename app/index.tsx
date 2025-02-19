import React, { useState } from 'react';
import { Button, Card, Input, Text, XStack, YStack } from 'tamagui';
import { Check, Plus, Trash2 } from 'lucide-react-native';

interface Todo {
  id: string;
  text: string;
  completed: boolean;
}

export default function TodoScreen() {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [inputText, setInputText] = useState('');

  const addTodo = () => {
    if (inputText.trim().length === 0) return;
    
    const newTodo: Todo = {
      id: Date.now().toString(),
      text: inputText.trim(),
      completed: false
    };
    
    setTodos([newTodo, ...todos]);
    setInputText('');
  };

  const toggleTodo = (id: string) => {
    setTodos(todos.map(todo => 
      todo.id === id ? { ...todo, completed: !todo.completed } : todo
    ));
  };

  const deleteTodo = (id: string) => {
    setTodos(todos.filter(todo => todo.id !== id));
  };

  return (
    <YStack f={1} padding="$4" backgroundColor="$background">
      <XStack space="$2">
        <Input
          flex={1}
          placeholder="Neue Aufgabe hinzufügen..."
          value={inputText}
          onChangeText={setInputText}
          onSubmitEditing={addTodo}
        />
        <Button size="$4" circular onPress={addTodo}>
          <Plus size={20} color="white" />
        </Button>
      </XStack>

      <YStack marginTop="$4" space="$2">
        {todos.map(todo => (
          <Card key={todo.id} padding="$4">
            <XStack alignItems="center" space="$3">
              <Button
                variant={todo.completed ? undefined : "outlined"}
                backgroundColor={todo.completed ? "$blue10" : undefined}
                size="$3"
                circular
                onPress={() => toggleTodo(todo.id)}
              >
                {todo.completed && <Check size={16} color="white" />}
              </Button>
              <Text
                flex={1}
                textDecorationLine={todo.completed ? "line-through" : "none"}
                opacity={todo.completed ? 0.5 : 1}
              >
                {todo.text}
              </Text>
              <Button
                variant="outlined"
                backgroundColor="$red10"
                size="$3"
                circular
                onPress={() => deleteTodo(todo.id)}
              >
                <Trash2 size={16} color="white" />
              </Button>
            </XStack>
          </Card>
        ))}
        {todos.length === 0 && (
          <YStack paddingVertical="$10" alignItems="center">
            <Text color="$gray10">Keine Aufgaben vorhanden</Text>
          </YStack>
        )}
      </YStack>
    </YStack>
  );
}
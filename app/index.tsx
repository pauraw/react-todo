import React, { useState, useEffect } from 'react';
import { Button, Card, Input, Text, XStack, YStack } from 'tamagui';
import { Check, Plus, Trash2 } from 'lucide-react-native';
import { supabase } from '../lib/supabase';
import { ActivityIndicator } from 'react-native';
import { Auth } from '../components/Auth';
import { Session } from '@supabase/supabase-js';

interface Todo {
  id: string;
  text: string;
  completed: boolean;
  created_at: string;
}

export default function TodoScreen() {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [inputText, setInputText] = useState('');
  const [loading, setLoading] = useState(true);
  const [session, setSession] = useState<Session | null>(null);

  useEffect(() => {
    fetchTodos();
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
    });

    supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
    });
  }, []);

  async function fetchTodos() {
    try {
      const { data, error } = await supabase
        .from('todos')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setTodos(data || []);
    } catch (error) {
      console.error('Error fetching todos:', error);
    } finally {
      setLoading(false);
    }
  }

  async function addTodo() {
    if (inputText.trim().length === 0) return;
    
    try {
      const { data, error } = await supabase
        .from('todos')
        .insert([{ 
          text: inputText.trim(),
          user_id: session?.user.id 
        }])
        .select()
        .single();

      if (error) throw error;
      if (data) {
        setTodos([data, ...todos]);
        setInputText('');
      }
    } catch (error) {
      console.error('Error adding todo:', error);
      // Optional: Toast oder andere Fehlermeldung anzeigen
    }
  }

  async function toggleTodo(id: string) {
    const todo = todos.find(t => t.id === id);
    if (!todo) return;

    try {
      const { error } = await supabase
        .from('todos')
        .update({ completed: !todo.completed })
        .eq('id', id);

      if (error) throw error;
      setTodos(todos.map(t => 
        t.id === id ? { ...t, completed: !t.completed } : t
      ));
    } catch (error) {
      console.error('Error toggling todo:', error);
    }
  }

  async function deleteTodo(id: string) {
    try {
      const { error } = await supabase
        .from('todos')
        .delete()
        .eq('id', id);

      if (error) throw error;
      setTodos(todos.filter(t => t.id !== id));
    } catch (error) {
      console.error('Error deleting todo:', error);
    }
  }

  const hasText = inputText.trim().length > 0;

  if (loading) {
    return (
      <YStack f={1} justifyContent="center" alignItems="center">
        <ActivityIndicator size="large" color="$blue10" />
      </YStack>
    );
  }

  if (!session) {
    return <Auth />;
  }

  return (
    <YStack f={1} padding="$4" backgroundColor="$backgroundStrong">
      <Button 
        onPress={() => supabase.auth.signOut()}
        size="$3"
        alignSelf="flex-end"
        marginBottom="$4"
      >
        Logout
      </Button>
      <XStack space="$2" marginBottom="$4">
        <Input
          flex={1}
          size="$4"
          borderRadius="$10"
          placeholder="Neue Aufgabe hinzufügen..."
          value={inputText}
          onChangeText={setInputText}
          onSubmitEditing={addTodo}
          backgroundColor="$background"
        />
        <Button 
          size="$4" 
          circular 
          onPress={addTodo}
          backgroundColor={hasText ? "$blue10" : "$gray5"}
          pressStyle={{ 
            scale: hasText ? 0.95 : 1,
            backgroundColor: hasText ? "$blue9" : "$gray5" 
          }}
        >
          <Plus size={22} color={hasText ? "white" : "#999"} />
        </Button>
      </XStack>

      <YStack space="$2.5">
        {todos.map(todo => (
          <Card 
            key={todo.id} 
            padding="$4" 
            bordered
            elevate
            pressStyle={{ scale: 0.98 }}
            backgroundColor="$background"
          >
            <XStack alignItems="center" space="$3">
              <Button
                variant={todo.completed ? undefined : "outlined"}
                backgroundColor={todo.completed ? "$green10" : undefined}
                size="$3.5"
                circular
                onPress={() => toggleTodo(todo.id)}
                pressStyle={{ 
                  scale: 0.95,
                  backgroundColor: todo.completed ? "$green10" : undefined 
                }}
              >
                <Check 
                  size={18} 
                  color={todo.completed ? "white" : "$gray10"}
                />
              </Button>
              <Text
                flex={1}
                fontSize="$5"
                textDecorationLine={todo.completed ? "line-through" : "none"}
                opacity={todo.completed ? 0.5 : 1}
                color={todo.completed ? "$gray10" : "$color"}
                onPress={() => toggleTodo(todo.id)}
                pressStyle={{ opacity: 0.7 }}
              >
                {todo.text}
              </Text>
              <Button
                variant="outlined"
                backgroundColor="$red10"
                size="$3"
                circular
                onPress={() => deleteTodo(todo.id)}
                pressStyle={{ scale: 0.95 }}
              >
                <Trash2 size={16} color="white" />
              </Button>
            </XStack>
          </Card>
        ))}
        {todos.length === 0 && (
          <YStack paddingVertical="$10" alignItems="center">
            <Text color="$gray10" fontSize="$6">
              Keine Aufgaben vorhanden
            </Text>
          </YStack>
        )}
      </YStack>
    </YStack>
  );
}
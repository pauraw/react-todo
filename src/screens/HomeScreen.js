import React, { useState } from 'react';
import { View, Text, TextInput, Button, Switch, TouchableOpacity } from 'react-native';

const HomeScreen = () => {
  const [text, setText] = useState('');
  const [isEnabled, setIsEnabled] = useState(false);

  return (
    <View className="flex-1 items-center justify-center bg-white p-5">
      <Text className="text-xl font-bold mb-5">Willkommen bei meiner Expo App!</Text>
      
      {/* Standard Texteingabe */}
      <TextInput
        className="w-full h-10 border border-gray-300 rounded-md px-3 mb-3"
        value={text}
        onChangeText={setText}
        placeholder="Geben Sie Text ein..."
      />

      {/* Passwort Eingabe */}
      <TextInput
        className="w-full h-10 border border-gray-300 rounded-md px-3 mb-3"
        secureTextEntry
        placeholder="Passwort eingeben..."
      />

      {/* Standard Button */}
      <TouchableOpacity 
        className="w-full bg-blue-500 p-4 rounded-md mb-3"
        onPress={() => alert('Button geklickt!')}
      >
        <Text className="text-white text-center font-semibold">Custom Button</Text>
      </TouchableOpacity>

      {/* Toggle Switch */}
      <View className="flex-row items-center gap-2">
        <Text>Status: {isEnabled ? 'An' : 'Aus'}</Text>
        <Switch
          value={isEnabled}
          onValueChange={setIsEnabled}
        />
      </View>
    </View>
  );
};

export default HomeScreen;

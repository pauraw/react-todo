import { Slot } from 'expo-router';
import React from 'react';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { TamaguiProvider } from 'tamagui';
import { Stack } from 'expo-router';
import config from '../tamagui.config';

export default function RootLayout() {
  return (
    <TamaguiProvider config={config}>
      <SafeAreaProvider>
        <Stack
          screenOptions={{
            headerTitle: 'Meine Todos',
            headerTitleStyle: { fontSize: 18 },
            headerStyle: { backgroundColor: 'white' },
          }}
        >
          <Stack.Screen name="index" />
        </Stack>
        <StatusBar style="auto" />
      </SafeAreaProvider>
    </TamaguiProvider>
  );
}
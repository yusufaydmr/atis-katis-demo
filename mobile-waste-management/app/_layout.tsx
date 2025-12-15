import React from 'react';
import { Stack } from 'expo-router';
import { MockDataProvider } from '../context/MockDataContext';
import "../global.css";

export default function RootLayout() {
  return (
    <MockDataProvider>
      <Stack screenOptions={{ headerShown: false }}>
        <Stack.Screen name="index" />
        <Stack.Screen name="sender" />
        <Stack.Screen name="receiver" />
        <Stack.Screen name="admin" />
        <Stack.Screen name="security" />
      </Stack>
    </MockDataProvider>
  );
}

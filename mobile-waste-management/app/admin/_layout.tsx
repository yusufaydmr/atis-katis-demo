import React from 'react';
import { Stack } from 'expo-router';
import { TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';
import { ArrowLeft } from 'lucide-react-native';

export default function AdminLayout() {
  const router = useRouter();

  return (
    <Stack screenOptions={{
        headerShown: true,
        headerLeft: () => (
            <TouchableOpacity onPress={() => router.back()} className="mr-4">
                <ArrowLeft size={24} color="#000" />
            </TouchableOpacity>
        )
    }}>
      <Stack.Screen name="index" options={{ title: "Yönetici Paneli" }} />
    </Stack>
  );
}

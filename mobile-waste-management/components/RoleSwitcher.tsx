import React from 'react';
import { View, StyleSheet, Platform } from 'react-native';
import { Picker } from '@react-native-picker/picker';
import { useMockData } from '../context/MockDataContext';
import { Card, CardContent } from './ui/Card';
import { Text } from './ui/Text';
import { Role } from '../types';

export function RoleSwitcher() {
  const { role, loginAs, companies, currentCompanyId } = useMockData();

  // Filter companies based on role for sub-selection if needed,
  // but simpler logic: just select role first.

  const roles: { label: string; value: Role }[] = [
    { label: "Admin", value: "admin" },
    { label: "Gönderici (Sender)", value: "sender" },
    { label: "Alıcı (Receiver)", value: "receiver" },
    { label: "Güvenlik (Security)", value: "security" },
  ];

  return (
    <Card className="mb-4 bg-slate-50 border-slate-200">
      <CardContent className="pt-4">
        <Text className="text-sm font-medium text-slate-500 mb-2">Aktif Rol</Text>
        <View className="bg-white border border-gray-300 rounded-md overflow-hidden">
             <Picker
                selectedValue={role}
                onValueChange={(itemValue) => {
                    // If switching to sender/receiver, we might need to pick a company.
                    // For simplicity, auto-pick the first company of that role.
                    if (itemValue === 'sender') {
                        const comp = companies.find(c => c.role === 'sender');
                        loginAs(itemValue, comp?.id);
                    } else if (itemValue === 'receiver') {
                        const comp = companies.find(c => c.role === 'receiver');
                        loginAs(itemValue, comp?.id);
                    } else {
                        loginAs(itemValue);
                    }
                }}
            >
                {roles.map((r) => (
                    <Picker.Item key={r.value} label={r.label} value={r.value} />
                ))}
            </Picker>
        </View>

        {(role === 'sender' || role === 'receiver') && (
            <View className="mt-4">
                <Text className="text-sm font-medium text-slate-500 mb-2">Firma Seçimi</Text>
                <View className="bg-white border border-gray-300 rounded-md overflow-hidden">
                    <Picker
                        selectedValue={currentCompanyId}
                        onValueChange={(itemValue) => loginAs(role, itemValue || undefined)}
                    >
                         {companies
                            .filter(c => c.role === role)
                            .map(c => (
                                <Picker.Item key={c.id} label={c.name} value={c.id} />
                            ))}
                    </Picker>
                </View>
            </View>
        )}
      </CardContent>
    </Card>
  );
}

import React, { useEffect } from 'react';
import { View, ScrollView, SafeAreaView, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';
import { useMockData } from '../context/MockDataContext';
import { RoleSwitcher } from '../components/RoleSwitcher';
import { Button } from '../components/ui/Button';
import { Text } from '../components/ui/Text';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/Card';
import { Truck, Shield, Building2, LayoutDashboard, ArrowRight } from 'lucide-react-native';

export default function Index() {
  const { role } = useMockData();
  const router = useRouter();

  const navigateToRoleDashboard = () => {
    switch (role) {
      case 'sender':
        router.push('/sender');
        break;
      case 'receiver':
        router.push('/receiver');
        break;
      case 'security':
        router.push('/security');
        break;
      case 'admin':
        router.push('/admin');
        break;
    }
  };

  return (
    <SafeAreaView className="flex-1 bg-gray-50">
      <ScrollView className="flex-1 p-4">
        <View className="mb-8 mt-4">
          <Text className="text-3xl font-bold text-slate-900">Atık Yönetim Sistemi</Text>
          <Text className="text-slate-500 mt-2">Mobil Demo Uygulaması</Text>
        </View>

        <RoleSwitcher />

        <Card className="mt-6 border-blue-100 bg-blue-50/50">
          <CardHeader>
            <CardTitle className="text-blue-900">Hoşgeldiniz</CardTitle>
          </CardHeader>
          <CardContent>
            <Text className="text-blue-700 mb-4">
              Şu an <Text className="font-bold uppercase">{role}</Text> rolü ile giriş yapmış durumdasınız.
              İlgili paneli görüntülemek için aşağıdaki butonu kullanın.
            </Text>

            <Button onPress={navigateToRoleDashboard} className="w-full">
              <Text>Panele Git</Text>
              <ArrowRight size={18} color="white" className="ml-2" />
            </Button>
          </CardContent>
        </Card>

        <View className="mt-8">
            <Text className="text-sm font-semibold text-slate-400 mb-4 uppercase tracking-wider">Modüller</Text>
            <View className="flex-row flex-wrap justify-between gap-y-4">
                <ModuleCard
                    icon={Building2}
                    title="Gönderici"
                    desc="Atık kaydı ve transfer başlatma"
                    color="text-blue-600"
                    onPress={() => router.push('/sender')}
                />
                <ModuleCard
                    icon={Truck}
                    title="Alıcı"
                    desc="Kabul ve geri dönüşüm süreçleri"
                    color="text-green-600"
                    onPress={() => router.push('/receiver')}
                />
                <ModuleCard
                    icon={Shield}
                    title="Güvenlik"
                    desc="Araç giriş-çıkış kontrolleri"
                    color="text-red-600"
                    onPress={() => router.push('/security')}
                />
                 <ModuleCard
                    icon={LayoutDashboard}
                    title="Admin"
                    desc="Genel raporlama ve yönetim"
                    color="text-purple-600"
                    onPress={() => router.push('/admin')}
                />
            </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

function ModuleCard({ icon: Icon, title, desc, color, onPress }: any) {
    return (
        <TouchableOpacity
            className="w-[48%] bg-white p-4 rounded-xl border border-gray-100 shadow-sm"
            onPress={onPress}
        >
            <View className="mb-3 bg-gray-50 self-start p-2 rounded-lg">
                <Icon size={24} className={color} />
            </View>
            <Text className="font-bold text-gray-900 mb-1">{title}</Text>
            <Text className="text-xs text-gray-500 leading-5">{desc}</Text>
        </TouchableOpacity>
    )
}

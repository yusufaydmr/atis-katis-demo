import React, { useState } from 'react';
import { View, FlatList, Alert, ScrollView } from 'react-native';
import { useMockData } from '../../context/MockDataContext';
import { Card, CardContent } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { Text } from '../../components/ui/Text';
import { Badge } from '../../components/ui/Badge';
import { Truck, CheckCircle2, History } from 'lucide-react-native';

export default function ReceiverIndex() {
  const { shipments, role, currentCompanyId, updateShipmentStatus } = useMockData();
  const [activeTab, setActiveTab] = useState<'incoming' | 'history'>('incoming');

  // Filter shipments for this receiver
  const myShipments = shipments.filter(s => s.receiverId === currentCompanyId);

  const incomingShipments = myShipments.filter(s => ['SECURITY_PENDING', 'ON_WAY'].includes(s.status));
  const historyShipments = myShipments.filter(s => s.status === 'DELIVERED');

  const handleReceive = (id: string) => {
    Alert.alert(
      "Teslim Onayı",
      "Bu atık transferini teslim aldığınızı ve stoğa girdiğinizi onaylıyor musunuz?",
      [
        { text: "İptal", style: "cancel" },
        {
            text: "Evet, Teslim Al",
            onPress: () => updateShipmentStatus(id, "DELIVERED"),
            style: "default"
        }
      ]
    );
  };

  const renderShipmentItem = ({ item }: { item: any }) => (
    <Card className="mb-3 border-l-4 border-l-blue-600">
      <CardContent className="p-4">
        <View className="flex-row justify-between items-center mb-2">
            <Text className="font-bold text-gray-900 text-lg">{item.senderName}</Text>
            <Badge variant={item.status === 'ON_WAY' ? 'info' : 'warning'}>
                {item.status === 'ON_WAY' ? 'Yolda' : 'Güvenlik'}
            </Badge>
        </View>

        <View className="mb-3">
             <Text className="text-gray-600">{item.amount} kg - {item.wasteTypeId}</Text>
             <Text className="text-xs text-gray-400 mt-1">{new Date(item.createdAt).toLocaleString()}</Text>
        </View>

        {activeTab === 'incoming' && item.status === 'ON_WAY' && (
             <Button onPress={() => handleReceive(item.id)} className="w-full bg-green-600 active:bg-green-700">
                <CheckCircle2 size={18} color="white" className="mr-2" />
                <Text>Teslim Al</Text>
             </Button>
        )}
      </CardContent>
    </Card>
  );

  return (
    <View className="flex-1 bg-gray-50">
        <View className="flex-row p-2 bg-white border-b border-gray-200">
             <Button
                variant={activeTab === 'incoming' ? 'default' : 'ghost'}
                className="flex-1 mr-2"
                onPress={() => setActiveTab('incoming')}
            >
                <Truck size={18} color={activeTab === 'incoming' ? 'white' : 'black'} className="mr-2" />
                <Text>Yoldaki Araçlar</Text>
            </Button>
            <Button
                variant={activeTab === 'history' ? 'default' : 'ghost'}
                className="flex-1"
                onPress={() => setActiveTab('history')}
            >
                 <History size={18} color={activeTab === 'history' ? 'white' : 'black'} className="mr-2" />
                <Text>Geçmiş</Text>
            </Button>
        </View>

        <FlatList
            data={activeTab === 'incoming' ? incomingShipments : historyShipments}
            keyExtractor={item => item.id}
            renderItem={renderShipmentItem}
            contentContainerStyle={{ padding: 16 }}
            ListEmptyComponent={
                <View className="items-center justify-center py-10">
                    <Text className="text-gray-400">Kayıt bulunamadı.</Text>
                </View>
            }
        />
    </View>
  );
}

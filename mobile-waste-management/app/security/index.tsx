import React from 'react';
import { View, FlatList, Alert } from 'react-native';
import { useMockData } from '../../context/MockDataContext';
import { Card, CardContent } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { Text } from '../../components/ui/Text';
import { Badge } from '../../components/ui/Badge';
import { ShieldCheck, Truck, Clock } from 'lucide-react-native';

export default function SecurityIndex() {
  const { shipments, vehicles, updateShipmentStatus } = useMockData();

  // Security only cares about pending shipments or those entering/leaving
  // For this demo, let's focus on "SECURITY_PENDING" -> Approve to "ON_WAY"
  const pendingShipments = shipments.filter(s => s.status === 'SECURITY_PENDING');

  const handleApprove = (id: string) => {
    Alert.alert(
        "Çıkış Onayı",
        "Araç ve belge kontrolleri tamamlandı mı?",
        [
            { text: "Hayır", style: "cancel" },
            {
                text: "Evet, Onayla",
                onPress: () => updateShipmentStatus(id, "ON_WAY"),
                style: "default"
            }
        ]
    );
  };

  const renderItem = ({ item }: { item: any }) => {
    const vehicle = vehicles.find(v => v.id === item.vehicleId);

    return (
        <Card className="mb-4 border-l-4 border-l-orange-500">
            <CardContent className="p-4">
                <View className="flex-row justify-between items-start mb-3">
                    <View>
                        <Text className="font-bold text-lg text-gray-900">{item.senderName}</Text>
                        <Text className="text-sm text-gray-500">➜ {item.receiverName}</Text>
                    </View>
                     <Badge variant="warning">Kontrol Bekliyor</Badge>
                </View>

                <View className="bg-gray-50 p-3 rounded-md mb-4 border border-gray-100">
                     <View className="flex-row items-center mb-2">
                        <Truck size={16} className="text-gray-500 mr-2" />
                        <Text className="font-semibold text-gray-800">{vehicle?.plate}</Text>
                     </View>
                     <Text className="text-gray-600 text-sm ml-6">{vehicle?.driverName}</Text>
                     <Text className="text-gray-500 text-xs ml-6">{vehicle?.driverPhone}</Text>
                </View>

                <View className="flex-row justify-between items-center mb-4">
                    <View className="flex-row items-center">
                        <Clock size={14} className="text-gray-400 mr-1" />
                        <Text className="text-xs text-gray-400">{new Date(item.createdAt).toLocaleString()}</Text>
                    </View>
                    <Text className="font-medium text-gray-700">{item.amount} kg</Text>
                </View>

                <Button onPress={() => handleApprove(item.id)} className="w-full">
                    <ShieldCheck size={18} color="white" className="mr-2" />
                    <Text>Çıkış Onayı Ver</Text>
                </Button>
            </CardContent>
        </Card>
    );
  };

  return (
    <View className="flex-1 bg-gray-50 p-4">
        <Text className="text-lg font-bold mb-4 text-gray-800">Bekleyen Araçlar ({pendingShipments.length})</Text>
        <FlatList
            data={pendingShipments}
            keyExtractor={item => item.id}
            renderItem={renderItem}
            contentContainerStyle={{ paddingBottom: 20 }}
            ListEmptyComponent={
                <View className="items-center justify-center py-20">
                    <ShieldCheck size={48} className="text-gray-300 mb-4" />
                    <Text className="text-gray-500 text-center">Şu an onay bekleyen araç yok.</Text>
                </View>
            }
        />
    </View>
  );
}

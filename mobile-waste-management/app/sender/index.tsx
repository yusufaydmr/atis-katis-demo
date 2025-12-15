import React from 'react';
import { View, FlatList, ScrollView } from 'react-native';
import { useRouter } from 'expo-router';
import { useMockData } from '../../context/MockDataContext';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { Text } from '../../components/ui/Text';
import { Badge } from '../../components/ui/Badge';
import { Plus, TrendingUp, Truck, CheckCircle } from 'lucide-react-native';
import { BarChart } from 'react-native-gifted-charts';

export default function SenderIndex() {
  const { shipments, role, currentCompanyId } = useMockData();
  const router = useRouter();

  // Filter shipments for this sender
  const myShipments = shipments.filter(s => s.senderId === currentCompanyId);

  const stats = {
    total: myShipments.length,
    active: myShipments.filter(s => ['CREATED', 'SECURITY_PENDING', 'ON_WAY'].includes(s.status)).length,
    completed: myShipments.filter(s => s.status === 'DELIVERED').length
  };

  const chartData = [
    { value: 12, label: 'Ocak', frontColor: '#2563eb' },
    { value: 18, label: 'Şubat', frontColor: '#2563eb' },
    { value: 10, label: 'Mart', frontColor: '#2563eb' },
    { value: 25, label: 'Nisan', frontColor: '#2563eb' },
  ];

  const getStatusBadge = (status: string) => {
    switch(status) {
      case 'CREATED': return <Badge variant="secondary">Hazırlanıyor</Badge>;
      case 'SECURITY_PENDING': return <Badge variant="warning">Güvenlik</Badge>;
      case 'ON_WAY': return <Badge variant="info">Yolda</Badge>;
      case 'DELIVERED': return <Badge variant="success">Teslim Edildi</Badge>;
      default: return <Badge>Bilinmiyor</Badge>;
    }
  };

  return (
    <View className="flex-1 bg-gray-50">
      <ScrollView className="flex-1 p-4">
        {/* Stats */}
        <View className="flex-row gap-2 mb-6">
            <Card className="flex-1 bg-blue-50 border-blue-100">
                <CardContent className="p-3 items-center">
                    <Truck size={20} className="text-blue-600 mb-1" />
                    <Text className="text-2xl font-bold text-blue-900">{stats.active}</Text>
                    <Text className="text-xs text-blue-600">Aktif</Text>
                </CardContent>
            </Card>
            <Card className="flex-1 bg-green-50 border-green-100">
                <CardContent className="p-3 items-center">
                    <CheckCircle size={20} className="text-green-600 mb-1" />
                    <Text className="text-2xl font-bold text-green-900">{stats.completed}</Text>
                    <Text className="text-xs text-green-600">Tamamlanan</Text>
                </CardContent>
            </Card>
             <Card className="flex-1 bg-gray-50 border-gray-200">
                <CardContent className="p-3 items-center">
                    <TrendingUp size={20} className="text-gray-600 mb-1" />
                    <Text className="text-2xl font-bold text-gray-900">{stats.total}</Text>
                    <Text className="text-xs text-gray-600">Toplam</Text>
                </CardContent>
            </Card>
        </View>

        {/* Chart */}
        <Card className="mb-6">
            <CardHeader>
                <CardTitle><Text className="font-semibold text-lg">Aylık Atık Trendi</Text></CardTitle>
            </CardHeader>
            <CardContent className="items-center pb-2">
                 <BarChart
                    data={chartData}
                    barWidth={22}
                    noOfSections={3}
                    barBorderRadius={4}
                    frontColor="#2563eb"
                    yAxisThickness={0}
                    xAxisThickness={0}
                    height={150}
                    width={280}
                    initialSpacing={10}
                 />
            </CardContent>
        </Card>

        {/* Action Button */}
        <Button
            className="mb-6 flex-row"
            onPress={() => router.push('/sender/new-shipment')}
        >
            <Plus size={20} color="white" className="mr-2" />
            <Text className="text-white font-semibold">Yeni Atık Transferi</Text>
        </Button>

        {/* List */}
        <Text className="text-lg font-bold mb-4 text-gray-800">Son Transferler</Text>
        <View className="pb-10">
            {myShipments.length === 0 ? (
                <Text className="text-gray-500 text-center py-8">Henüz kayıt yok.</Text>
            ) : (
                myShipments.map((shipment) => (
                    <Card key={shipment.id} className="mb-3">
                        <CardContent className="p-4">
                            <View className="flex-row justify-between items-start mb-2">
                                <View>
                                    <Text className="font-bold text-gray-900">{shipment.receiverName}</Text>
                                    <Text className="text-xs text-gray-500">Alıcı Firma</Text>
                                </View>
                                {getStatusBadge(shipment.status)}
                            </View>

                            <View className="h-[1px] bg-gray-100 my-2" />

                            <View className="flex-row justify-between">
                                <View>
                                    <Text className="text-sm text-gray-700">{shipment.amount} kg</Text>
                                    <Text className="text-xs text-gray-400">Miktar</Text>
                                </View>
                                 <View>
                                    <Text className="text-sm text-gray-700">{new Date(shipment.createdAt).toLocaleDateString()}</Text>
                                    <Text className="text-xs text-gray-400">Tarih</Text>
                                </View>
                            </View>
                        </CardContent>
                    </Card>
                ))
            )}
        </View>
      </ScrollView>
    </View>
  );
}

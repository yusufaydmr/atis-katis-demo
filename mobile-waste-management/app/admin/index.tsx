import React from 'react';
import { View, ScrollView } from 'react-native';
import { useMockData } from '../../context/MockDataContext';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/Card';
import { Text } from '../../components/ui/Text';
import { PieChart } from 'react-native-gifted-charts';
import { TrendingUp, AlertTriangle, Droplets, CheckCircle } from 'lucide-react-native';

export default function AdminIndex() {
  const { shipments, wasteTypes } = useMockData();

  // Calculate Stats
  const totalWeight = shipments.reduce((sum, s) => sum + s.amount, 0);
  const activeShipments = shipments.filter(s => s.status !== 'DELIVERED').length;
  const riskShipments = shipments.filter(s => {
    // Mock risk calculation: finding shipments with "Tehlikeli Atık" (w1)
    const waste = wasteTypes.find(w => w.id === s.wasteTypeId);
    return waste?.name.includes('Tehlikeli');
  }).length;

  // Pie Chart Data
  const wasteDistribution = wasteTypes.map(type => {
      const count = shipments.filter(s => s.wasteTypeId === type.id).length;
      return {
          value: count,
          text: count.toString(), // For the label inside slice?
          label: type.name, // Custom label for legend
          color: getRandomColor(type.id)
      };
  }).filter(d => d.value > 0);

  // Helper to generate consistent colors
  function getRandomColor(id: string) {
      const colors = ['#3b82f6', '#ef4444', '#10b981', '#f59e0b', '#8b5cf6'];
      const index = parseInt(id.replace(/\D/g, '')) || 0;
      return colors[index % colors.length];
  }

  return (
    <View className="flex-1 bg-gray-50">
      <ScrollView className="flex-1 p-4">

        {/* 4'lü Grid Stats */}
        <View className="flex-row flex-wrap justify-between gap-y-4 mb-6">
            <StatCard
                title="Toplam Atık"
                value={`${totalWeight} kg`}
                icon={TrendingUp}
                color="text-blue-600"
                bg="bg-blue-50"
            />
            <StatCard
                title="Su Tasarrufu"
                value={`${(totalWeight * 0.4).toFixed(0)} L`}
                icon={Droplets}
                color="text-cyan-600"
                bg="bg-cyan-50"
            />
            <StatCard
                title="Aktif Transfer"
                value={activeShipments.toString()}
                icon={CheckCircle}
                color="text-green-600"
                bg="bg-green-50"
            />
             <StatCard
                title="Riskli Atık"
                value={riskShipments.toString()}
                icon={AlertTriangle}
                color="text-red-600"
                bg="bg-red-50"
            />
        </View>

        {/* Pie Chart */}
        <Card className="mb-6">
            <CardHeader>
                <CardTitle><Text className="font-semibold text-lg">Atık Türü Dağılımı</Text></CardTitle>
            </CardHeader>
            <CardContent className="items-center pb-6">
                 <PieChart
                    data={wasteDistribution}
                    donut
                    showText
                    textColor="white"
                    radius={100}
                    innerRadius={60}
                    textSize={14}
                    showTextBackground={false}
                    centerLabelComponent={() => {
                        return <Text className="text-2xl font-bold text-gray-800">{shipments.length}</Text>;
                    }}
                />

                {/* Legend */}
                <View className="flex-row flex-wrap justify-center mt-6 gap-3">
                    {wasteDistribution.map((item, index) => (
                        <View key={index} className="flex-row items-center">
                            <View style={{ width: 12, height: 12, borderRadius: 6, backgroundColor: item.color }} />
                            <Text className="text-xs text-gray-600 ml-1">{item.label}</Text>
                        </View>
                    ))}
                </View>
            </CardContent>
        </Card>

      </ScrollView>
    </View>
  );
}

function StatCard({ title, value, icon: Icon, color, bg }: any) {
    return (
        <Card className="w-[48%] border-none shadow-sm">
            <CardContent className={`p-4 rounded-xl ${bg} items-center justify-center`}>
                <Icon size={24} className={`${color} mb-2`} />
                <Text className={`text-2xl font-bold ${color}`}>{value}</Text>
                <Text className="text-xs text-gray-500">{title}</Text>
            </CardContent>
        </Card>
    );
}

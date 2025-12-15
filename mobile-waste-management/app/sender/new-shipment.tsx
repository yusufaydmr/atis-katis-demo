import React, { useState } from 'react';
import { View, ScrollView, Platform, Alert } from 'react-native';
import { useRouter } from 'expo-router';
import { Picker } from '@react-native-picker/picker';
import DateTimePicker from '@react-native-community/datetimepicker';
import * as Print from 'expo-print';
import { shareAsync } from 'expo-sharing';
import { useMockData } from '../../context/MockDataContext';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { Text } from '../../components/ui/Text';
import { Input } from '../../components/ui/Input';
import { Calendar, Printer, Check, Save } from 'lucide-react-native';
import { Shipment } from '../../types';

export default function NewShipment() {
  const router = useRouter();
  const { companies, wasteTypes, vehicles, currentCompanyId, addShipment } = useMockData();
  const [loading, setLoading] = useState(false);

  // Form State
  const [receiverId, setReceiverId] = useState("");
  const [wasteTypeId, setWasteTypeId] = useState("");
  const [amount, setAmount] = useState("");
  const [vehicleId, setVehicleId] = useState("");
  const [date, setDate] = useState(new Date());
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [docType, setDocType] = useState("motat"); // motat or irsaliye

  const handleSubmit = async () => {
    if (!receiverId || !wasteTypeId || !amount || !vehicleId) {
      Alert.alert("Hata", "Lütfen tüm alanları doldurun.");
      return;
    }

    setLoading(true);

    const receiver = companies.find(c => c.id === receiverId);
    const sender = companies.find(c => c.id === currentCompanyId);
    const waste = wasteTypes.find(w => w.id === wasteTypeId);
    const vehicle = vehicles.find(v => v.id === vehicleId);

    const newShipment: Shipment = {
      id: Math.random().toString(36).substr(2, 9),
      senderId: currentCompanyId!,
      senderName: sender?.name || "Bilinmeyen Gönderici",
      receiverId,
      receiverName: receiver?.name || "Bilinmeyen Alıcı",
      wasteTypeId,
      amount: Number(amount),
      vehicleId,
      status: "CREATED",
      createdAt: date.toISOString(),
    };

    // Simulate API call
    setTimeout(() => {
        addShipment(newShipment);
        setLoading(false);
        Alert.alert(
            "Başarılı",
            "Atık transfer kaydı oluşturuldu. Şimdi belgeyi yazdırabilirsiniz.",
            [
                { text: "Listeye Dön", onPress: () => router.back(), style: "cancel" },
                { text: "Yazdır", onPress: () => printDocument(newShipment, sender, receiver, waste, vehicle) }
            ]
        );
    }, 1000);
  };

  const printDocument = async (shipment: Shipment, sender: any, receiver: any, waste: any, vehicle: any) => {
    const html = `
      <html>
        <head>
          <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, minimum-scale=1.0, user-scalable=no" />
        </head>
        <body style="font-family: Helvetica Neue, sans-serif; padding: 20px;">
          <h1 style="text-align: center;">${docType === 'motat' ? 'MOTAT Taşıma Kaydı' : 'Sevk İrsaliyesi'}</h1>
          <hr />
          <div style="margin-top: 20px;">
            <h3>Gönderici Bilgileri</h3>
            <p><strong>Firma:</strong> ${sender?.name}</p>
            <p><strong>Tarih:</strong> ${new Date(shipment.createdAt).toLocaleDateString()}</p>
          </div>
          <div style="margin-top: 20px;">
            <h3>Alıcı Bilgileri</h3>
            <p><strong>Firma:</strong> ${receiver?.name}</p>
          </div>
          <div style="margin-top: 20px;">
            <h3>Atık & Taşıma Bilgileri</h3>
            <table style="width: 100%; border-collapse: collapse;">
              <tr style="background-color: #f3f4f6;">
                <th style="border: 1px solid #ddd; padding: 8px; text-align: left;">Atık Kodu</th>
                <td style="border: 1px solid #ddd; padding: 8px;">${waste?.code}</td>
              </tr>
              <tr>
                <th style="border: 1px solid #ddd; padding: 8px; text-align: left;">Atık Adı</th>
                <td style="border: 1px solid #ddd; padding: 8px;">${waste?.name}</td>
              </tr>
              <tr style="background-color: #f3f4f6;">
                <th style="border: 1px solid #ddd; padding: 8px; text-align: left;">Miktar</th>
                <td style="border: 1px solid #ddd; padding: 8px;">${shipment.amount} kg</td>
              </tr>
              <tr>
                <th style="border: 1px solid #ddd; padding: 8px; text-align: left;">Plaka</th>
                <td style="border: 1px solid #ddd; padding: 8px;">${vehicle?.plate}</td>
              </tr>
               <tr style="background-color: #f3f4f6;">
                <th style="border: 1px solid #ddd; padding: 8px; text-align: left;">Sürücü</th>
                <td style="border: 1px solid #ddd; padding: 8px;">${vehicle?.driverName}</td>
              </tr>
            </table>
          </div>
          <div style="margin-top: 40px; text-align: center; color: #666; font-size: 12px;">
            <p>Bu belge dijital olarak oluşturulmuştur. Islak imza gerektirmez.</p>
          </div>
        </body>
      </html>
    `;

    try {
        const { uri } = await Print.printToFileAsync({ html });
        await shareAsync(uri, { UTI: '.pdf', mimeType: 'application/pdf' });
    } catch (error) {
        console.error(error);
        Alert.alert("Hata", "Yazdırma işlemi sırasında bir hata oluştu.");
    }
  };

  return (
    <View className="flex-1 bg-gray-50">
      <ScrollView className="flex-1 p-4 pb-12">
        <Card className="mb-4">
            <CardContent className="pt-4">
                <Text className="text-sm font-medium text-gray-500 mb-2">Belge Tipi</Text>
                 <View className="border border-gray-200 rounded-md overflow-hidden bg-white">
                    <Picker
                        selectedValue={docType}
                        onValueChange={(itemValue) => setDocType(itemValue)}
                    >
                        <Picker.Item label="MOTAT Kaydı" value="motat" />
                        <Picker.Item label="Sevk İrsaliyesi" value="irsaliye" />
                    </Picker>
                </View>
            </CardContent>
        </Card>

        {/* Lojistik Bilgileri (Mavi) */}
        <Card className="mb-4 border-l-4 border-l-blue-500">
             <CardHeader>
                <CardTitle><Text className="text-blue-700 font-semibold">Lojistik Detayları</Text></CardTitle>
            </CardHeader>
            <CardContent>
                <View className="mb-4">
                    <Text className="text-sm font-medium text-gray-700 mb-1">Alıcı Firma</Text>
                    <View className="border border-gray-200 rounded-md overflow-hidden bg-white">
                        <Picker
                            selectedValue={receiverId}
                            onValueChange={(itemValue) => setReceiverId(itemValue)}
                        >
                             <Picker.Item label="Seçiniz..." value="" />
                            {companies
                                .filter(c => c.role === 'receiver')
                                .map(c => <Picker.Item key={c.id} label={c.name} value={c.id} />)
                            }
                        </Picker>
                    </View>
                </View>

                 <View>
                    <Text className="text-sm font-medium text-gray-700 mb-1">Sefer Tarihi</Text>
                    <Button
                        variant="outline"
                        className="justify-start"
                        onPress={() => setShowDatePicker(true)}
                    >
                         <Calendar size={18} color="#666" className="mr-2" />
                         <Text>{date.toLocaleDateString()}</Text>
                    </Button>
                    {showDatePicker && (
                        <DateTimePicker
                            value={date}
                            mode="date"
                            display="default"
                            onChange={(event, selectedDate) => {
                                setShowDatePicker(false);
                                if (selectedDate) setDate(selectedDate);
                            }}
                        />
                    )}
                </View>
            </CardContent>
        </Card>

         {/* Araç/Sefer Bilgileri (Kırmızı - Kritik) */}
         <Card className="mb-4 border-l-4 border-l-red-500">
             <CardHeader>
                <CardTitle><Text className="text-red-700 font-semibold">Araç Bilgileri</Text></CardTitle>
            </CardHeader>
            <CardContent>
                <View>
                    <Text className="text-sm font-medium text-gray-700 mb-1">Araç & Sürücü</Text>
                    <View className="border border-gray-200 rounded-md overflow-hidden bg-white">
                        <Picker
                            selectedValue={vehicleId}
                            onValueChange={(itemValue) => setVehicleId(itemValue)}
                        >
                            <Picker.Item label="Seçiniz..." value="" />
                            {vehicles.map(v => (
                                <Picker.Item key={v.id} label={`${v.plate} - ${v.driverName}`} value={v.id} />
                            ))}
                        </Picker>
                    </View>
                </View>
            </CardContent>
        </Card>

        {/* Atık Detay (Yeşil) */}
        <Card className="mb-8 border-l-4 border-l-green-500">
             <CardHeader>
                <CardTitle><Text className="text-green-700 font-semibold">Atık İçeriği</Text></CardTitle>
            </CardHeader>
            <CardContent>
                <View className="mb-4">
                    <Text className="text-sm font-medium text-gray-700 mb-1">Atık Kodu</Text>
                    <View className="border border-gray-200 rounded-md overflow-hidden bg-white">
                        <Picker
                            selectedValue={wasteTypeId}
                            onValueChange={(itemValue) => setWasteTypeId(itemValue)}
                        >
                            <Picker.Item label="Seçiniz..." value="" />
                            {wasteTypes.map(w => (
                                <Picker.Item key={w.id} label={`${w.code} - ${w.name}`} value={w.id} />
                            ))}
                        </Picker>
                    </View>
                </View>
                <View>
                     <Text className="text-sm font-medium text-gray-700 mb-1">Miktar (kg)</Text>
                     <Input
                        keyboardType="numeric"
                        placeholder="Örn: 500"
                        value={amount}
                        onChangeText={setAmount}
                     />
                </View>
            </CardContent>
        </Card>

        <Button onPress={handleSubmit} loading={loading} className="mb-10">
            <Save size={20} color="white" className="mr-2" />
            <Text className="text-white font-bold">Kaydı Oluştur</Text>
        </Button>
      </ScrollView>
    </View>
  );
}

"use client";

import { useMockData } from "@/context/MockDataContext";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { CheckCircle, Truck, Package, Clock } from "lucide-react";

export default function ReceiverPage() {
  const { role, shipments, vehicles, wasteTypes, updateShipmentStatus } = useMockData();

  // Sadece Receiver rolü
  if (role !== "receiver") {
    return <div className="p-10 text-center text-red-500 font-bold">Bu sayfaya sadece Alıcı Firmalar erişebilir.</div>;
  }

  // Listeleri ayır
  const incomingShipments = shipments.filter(s => s.status === "ON_WAY");
  const completedShipments = shipments.filter(s => s.status === "DELIVERED");

  // Teslim Alma Fonksiyonu
  const handleReceive = (id: string) => {
    if(confirm("Bu atık yükünü teslim aldığınızı ve miktarını doğruladığınızı onaylıyor musunuz?")) {
      updateShipmentStatus(id, "DELIVERED");
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <Package className="h-8 w-8 text-purple-600" />
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Atık Kabul Paneli</h2>
          <p className="text-gray-500">Tesisinize gelen atıkların takibi ve kabul işlemleri.</p>
        </div>
      </div>

      <Tabs defaultValue="incoming" className="w-full">
        <TabsList className="grid w-full grid-cols-2 max-w-[400px]">
          <TabsTrigger value="incoming">
            <Truck className="w-4 h-4 mr-2" />
            Yoldaki Araçlar 
            {incomingShipments.length > 0 && <Badge className="ml-2 bg-purple-600 hover:bg-purple-600">{incomingShipments.length}</Badge>}
          </TabsTrigger>
          <TabsTrigger value="history">
            <Clock className="w-4 h-4 mr-2" />
            Teslimat Geçmişi
          </TabsTrigger>
        </TabsList>

        {/* SEKME 1: YOLDAKİLER (GELEN KUTUSU) */}
        <TabsContent value="incoming">
          <Card className="border-t-4 border-t-purple-500">
            <CardHeader>
              <CardTitle>Beklenen Teslimatlar</CardTitle>
              <CardDescription>Tesisinize yönlendirilmiş ve yolda olan araçlar.</CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Gönderici Firma</TableHead>
                    <TableHead>Plaka</TableHead>
                    <TableHead>Atık Tipi</TableHead>
                    <TableHead>Miktar</TableHead>
                    <TableHead className="text-right">İşlem</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {incomingShipments.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={5} className="text-center h-32 text-gray-500">
                        Şu anda size gelmekte olan bir araç yok.
                      </TableCell>
                    </TableRow>
                  ) : (
                    incomingShipments.map((s) => {
                       const waste = wasteTypes.find(w => w.id === s.wasteTypeId);
                       const vehicle = vehicles.find(v => v.id === s.vehicleId);
                       return (
                        <TableRow key={s.id}>
                          <TableCell className="font-medium">{s.senderName}</TableCell>
                          <TableCell><Badge variant="outline">{vehicle?.plate}</Badge></TableCell>
                          <TableCell>{waste?.name}</TableCell>
                          <TableCell>{s.amount} kg</TableCell>
                          <TableCell className="text-right">
                            <Button size="sm" className="bg-purple-600 hover:bg-purple-700" onClick={() => handleReceive(s.id)}>
                              <CheckCircle className="w-4 h-4 mr-2" /> Teslim Al
                            </Button>
                          </TableCell>
                        </TableRow>
                       )
                    })
                  )}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        {/* SEKME 2: GEÇMİŞ (ARŞİV) */}
        <TabsContent value="history">
          <Card>
            <CardHeader>
              <CardTitle>Tamamlanan İşlemler</CardTitle>
              <CardDescription>Daha önce kabul ettiğiniz atık transferleri.</CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Tamamlanma Tarihi</TableHead>
                    <TableHead>Gönderici</TableHead>
                    <TableHead>Atık</TableHead>
                    <TableHead>Miktar</TableHead>
                    <TableHead>Durum</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {completedShipments.map((s) => {
                     const waste = wasteTypes.find(w => w.id === s.wasteTypeId);
                     return (
                      <TableRow key={s.id} className="opacity-75">
                        <TableCell>{new Date(s.createdAt).toLocaleDateString('tr-TR')}</TableCell>
                        <TableCell>{s.senderName}</TableCell>
                        <TableCell>{waste?.name}</TableCell>
                        <TableCell>{s.amount} kg</TableCell>
                        <TableCell>
                          <Badge variant="secondary" className="bg-gray-200 text-gray-700">Teslim Alındı</Badge>
                        </TableCell>
                      </TableRow>
                     )
                  })}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
"use client";

import { useState } from "react";
import { useMockData } from "@/context/MockDataContext";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { ShieldCheck, Truck, FileText, CheckCircle, AlertTriangle } from "lucide-react";
import { Shipment } from "../types";

export default function SecurityPage() {
  const { role, shipments, vehicles, wasteTypes, updateShipmentStatus } = useMockData();
  const [selectedShipment, setSelectedShipment] = useState<Shipment | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  // Sadece Security rolü
  if (role !== "security") {
    return <div className="p-10 text-center text-red-500 font-bold">Bu sayfaya sadece Güvenlik Birimi erişebilir.</div>;
  }

  // Sadece onayı bekleyenleri filtrele
  const pendingShipments = shipments.filter(s => s.status === "SECURITY_PENDING");

  const handleApprove = () => {
    if (selectedShipment) {
      // Statüyü YOLDA (ON_WAY) olarak güncelle
      updateShipmentStatus(selectedShipment.id, "ON_WAY");
      setIsDialogOpen(false);
      setSelectedShipment(null);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <ShieldCheck className="h-8 w-8 text-blue-600" />
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Güvenlik Kontrol Noktası</h2>
          <p className="text-gray-500">Saha çıkışı için onay bekleyen araçlar.</p>
        </div>
      </div>

      {pendingShipments.length === 0 ? (
        <div className="text-center py-12 bg-white rounded-lg border border-dashed">
          <CheckCircle className="mx-auto h-12 w-12 text-green-500 mb-3" />
          <h3 className="text-lg font-medium">Bekleyen Araç Yok</h3>
          <p className="text-gray-500">Şu an kapıda işlem bekleyen bir araç bulunmuyor.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {pendingShipments.map((shipment) => {
            const vehicle = vehicles.find(v => v.id === shipment.vehicleId);
            const waste = wasteTypes.find(w => w.id === shipment.wasteTypeId);

            return (
              <Card key={shipment.id} className="border-l-4 border-l-orange-500 shadow-md hover:shadow-lg transition-all">
                <CardHeader className="pb-2">
                  <div className="flex justify-between items-start">
                    <Badge variant="outline" className="bg-orange-50 text-orange-700 border-orange-200">
                      Onay Bekliyor
                    </Badge>
                    <span className="text-xs text-gray-400">{new Date(shipment.createdAt).toLocaleTimeString('tr-TR', {hour: '2-digit', minute:'2-digit'})}</span>
                  </div>
                  <CardTitle className="text-xl pt-2 flex items-center gap-2">
                    <Truck className="h-5 w-5 text-gray-600" />
                    {vehicle?.plate}
                  </CardTitle>
                </CardHeader>
                <CardContent className="text-sm space-y-2">
                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <p className="text-gray-500 text-xs">Şoför</p>
                      <p className="font-medium">{vehicle?.driverName}</p>
                    </div>
                    <div>
                      <p className="text-gray-500 text-xs">Miktar</p>
                      <p className="font-medium">{shipment.amount} kg</p>
                    </div>
                    <div className="col-span-2">
                       <p className="text-gray-500 text-xs">Atık Tipi</p>
                       <p className="font-medium truncate">{waste?.name}</p>
                    </div>
                    <div className="col-span-2">
                       <p className="text-gray-500 text-xs">Firma</p>
                       <p className="font-medium truncate">{shipment.senderName}</p>
                    </div>
                  </div>
                </CardContent>
                <CardFooter>
                  <Dialog open={isDialogOpen && selectedShipment?.id === shipment.id} onOpenChange={(open) => {
                      setIsDialogOpen(open);
                      if(open) setSelectedShipment(shipment);
                  }}>
                    <DialogTrigger asChild>
                      <Button className="w-full">Belgeyi İncele & Onayla</Button>
                    </DialogTrigger>
                    <DialogContent>
                      <DialogHeader>
                        <DialogTitle>Çıkış Onayı: {vehicle?.plate}</DialogTitle>
                        <DialogDescription>
                          Lütfen taşıma belgesini ve yükü kontrol ediniz.
                        </DialogDescription>
                      </DialogHeader>

                      <div className="py-4 space-y-4">
                        {/* Mock Belge Görüntüleme Alanı */}
                        <div className="bg-gray-100 p-8 rounded border-2 border-dashed flex flex-col items-center justify-center min-h-[200px]">
                          <FileText className="h-12 w-12 text-gray-400 mb-2" />
                          <p className="text-sm font-medium text-gray-600">Taşıma Belgesi Önizleme</p>
                          <p className="text-xs text-gray-400">(Mock: {shipment.documentUrl})</p>
                        </div>
                        
                        <div className="bg-yellow-50 p-3 rounded border border-yellow-200 flex gap-2">
                           <AlertTriangle className="h-5 w-5 text-yellow-600 shrink-0" />
                           <p className="text-xs text-yellow-700">
                             Dikkat: Tehlikeli atık taşıması yapılmaktadır. ADR levhalarının takılı olduğundan emin olun.
                           </p>
                        </div>
                      </div>

                      <DialogFooter>
                        <Button variant="secondary" onClick={() => setIsDialogOpen(false)}>İptal</Button>
                        <Button className="bg-green-600 hover:bg-green-700" onClick={handleApprove}>
                          <CheckCircle className="mr-2 h-4 w-4" />
                          Onayla ve Çıkış Ver
                        </Button>
                      </DialogFooter>
                    </DialogContent>
                  </Dialog>
                </CardFooter>
              </Card>
            );
          })}
        </div>
      )}
    </div>
  );
}
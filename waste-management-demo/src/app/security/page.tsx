"use client";

import { useState } from "react";
import { useMockData } from "@/context/MockDataContext";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { ShieldCheck, Truck, FileText, CheckCircle, Upload, ArrowRightLeft, Clock } from "lucide-react";
import { Input } from "@/components/ui/input";

export default function SecurityPage() {
  const { role, shipments, vehicles, wasteTypes, updateShipmentStatus } = useMockData();
  const [selectedShipment, setSelectedShipment] = useState<unknown>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [securityDoc, setSecurityDoc] = useState<File | null>(null);

  if (role !== "security") {
    return <div className="p-10 text-center text-red-500 font-bold">Bu sayfaya sadece Güvenlik Birimi erişebilir.</div>;
  }

  const pendingShipments = shipments.filter(s => s.status === "SECURITY_PENDING");

  const handleApprove = () => {
    if (selectedShipment && securityDoc) {
      updateShipmentStatus(selectedShipment.id, "ON_WAY");
      setIsDialogOpen(false);
      setSelectedShipment(null);
      setSecurityDoc(null);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <ShieldCheck className="h-8 w-8 text-blue-600" />
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Güvenlik Kontrol Noktası</h2>
          <p className="text-gray-500">Saha çıkışı için belge kontrolü ve fiziksel doğrulama.</p>
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
                    <Badge variant="outline" className="bg-orange-50 text-orange-700 border-orange-200">Çıkış Onayı Bekliyor</Badge>
                    <span className="text-xs text-gray-400">{new Date(shipment.createdAt).toLocaleTimeString('tr-TR', {hour: '2-digit', minute:'2-digit'})}</span>
                  </div>
                  <CardTitle className="text-xl pt-2 flex items-center gap-2">
                    <Truck className="h-5 w-5 text-gray-600" />
                    {vehicle?.plate}
                  </CardTitle>
                </CardHeader>
                <CardContent className="text-sm">
                   <p className="font-semibold text-gray-700">{waste?.name}</p>
                   <p className="text-gray-500 text-xs mt-1 italic">{shipment.senderName}</p>
                </CardContent>
                <CardFooter>
                  <Dialog open={isDialogOpen && selectedShipment?.id === shipment.id} onOpenChange={(open) => {
                      setIsDialogOpen(open);
                      if(open) setSelectedShipment(shipment);
                      if(!open) setSecurityDoc(null);
                  }}>
                    <DialogTrigger asChild>
                      <Button className="w-full bg-blue-600 hover:bg-blue-700 shadow-sm transition-colors">İncele ve Onay Ver</Button>
                    </DialogTrigger>
                    <DialogContent className="max-w-3xl">
                      <DialogHeader>
                        <DialogTitle className="flex items-center gap-2 text-blue-700">
                           <ShieldCheck className="h-6 w-6" />
                           Güvenlik ve Belge Doğrulama
                        </DialogTitle>
                        <DialogDescription>
                          Gönderici belgesini doğrulayın ve güvenlik kontrol nüshasını sisteme işleyin.
                        </DialogDescription>
                      </DialogHeader>

                      {/* ÜÇLÜ BELGE GÖRÜNÜMÜ */}
                      <div className="grid grid-cols-3 gap-4 py-6">
                        {/* 1. Gönderici (Read-only) */}
                        <div className="space-y-2">
                          <p className="text-[10px] font-bold text-gray-500 uppercase tracking-tighter text-center">1. GÖNDERİCİ BEYANI</p>
                          <div className="h-32 bg-slate-50 border rounded-lg flex flex-col items-center justify-center">
                            <FileText className="h-7 w-7 text-blue-400 mb-1" />
                            <Button variant="link" size="sm" className="text-[10px] h-auto p-0 text-blue-600">Görüntüle</Button>
                          </div>
                        </div>
                        
                        {/* 2. Güvenlik (Action) */}
                        <div className="space-y-2">
                          <p className="text-[10px] font-bold text-blue-600 uppercase tracking-tighter text-center italic">2. GÜVENLİK KAYDI*</p>
                          <div className={`h-32 border-2 border-dashed rounded-lg flex flex-col items-center justify-center transition-all ${securityDoc ? 'bg-green-50 border-green-500' : 'bg-blue-50/50 border-blue-200'}`}>
                            {securityDoc ? (
                               <>
                                <CheckCircle className="h-7 w-7 text-green-600 mb-1" />
                                <span className="text-[9px] text-green-700 font-medium px-2 truncate w-full text-center">{securityDoc.name}</span>
                                <Button variant="ghost" size="sm" className="text-[9px] h-auto p-0 mt-1 text-red-500" onClick={() => setSecurityDoc(null)}>Değiştir</Button>
                               </>
                            ) : (
                              <>
                                <Upload className="h-7 w-7 text-blue-400 mb-1" />
                                <label htmlFor="security-upload" className="text-[10px] text-blue-600 font-bold cursor-pointer hover:underline">BELGE YÜKLE</label>
                                <Input id="security-upload" type="file" className="hidden" onChange={(e) => e.target.files && setSecurityDoc(e.target.files[0])} />
                              </>
                            )}
                          </div>
                        </div>

                        {/* 3. Alıcı (Waiting) */}
                        <div className="space-y-2 opacity-50">
                          <p className="text-[10px] font-bold text-gray-400 uppercase tracking-tighter text-center">3. ALICI KABULÜ</p>
                          <div className="h-32 bg-gray-100 border border-gray-200 rounded-lg flex flex-col items-center justify-center grayscale">
                            <Clock className="h-7 w-7 text-gray-400 mb-1" />
                            <span className="text-[9px] text-gray-500 font-medium uppercase tracking-widest">Bekleniyor</span>
                          </div>
                        </div>
                      </div>

                      <div className="bg-blue-50 p-3 rounded-lg border border-blue-100 flex gap-3 items-center">
                         <ArrowRightLeft className="h-5 w-5 text-blue-500 shrink-0" />
                         <p className="text-[11px] text-blue-700 leading-tight">
                            Gönderici belgesi ile araç yükünün uyuştuğunu onaylıyorsunuz. Bu işlemden sonra araç <b>YOLDA</b> durumuna geçecektir.
                         </p>
                      </div>

                      <DialogFooter className="mt-4">
                        <Button variant="ghost" size="sm" onClick={() => setIsDialogOpen(false)}>İptal</Button>
                        <Button 
                          size="sm" 
                          className="bg-green-600 hover:bg-green-700 text-white" 
                          onClick={handleApprove}
                          disabled={!securityDoc}
                        >
                          <CheckCircle className="mr-2 h-4 w-4" />
                          Doğrula ve Çıkış Ver
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
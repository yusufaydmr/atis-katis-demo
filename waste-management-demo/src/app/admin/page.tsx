"use client";

import { useState } from "react";
import { useMockData } from "@/context/MockDataContext";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Trash2, Plus, FileBarChart, Truck, Database } from "lucide-react";
import { Vehicle, WasteType } from "../types";

export default function AdminPage() {
  const { vehicles, wasteTypes, shipments, role, addVehicle, removeVehicle, addWasteType, removeWasteType } = useMockData();
  
  // Modal (Dialog) Kontrol State'leri
  const [isVehicleDialogOpen, setIsVehicleDialogOpen] = useState(false);
  const [isWasteDialogOpen, setIsWasteDialogOpen] = useState(false);

  // Form State'leri
  const [newVehicle, setNewVehicle] = useState({ plate: "", driverName: "", driverPhone: "" });
  const [newWaste, setNewWaste] = useState({ code: "", name: "" });

  if (role !== "admin") {
    return <div className="p-10 text-center text-red-500 font-bold">Bu sayfaya erişim yetkiniz yok.</div>;
  }

  // Araç Ekleme İşlemi
  const handleAddVehicle = () => {
    if (newVehicle.plate && newVehicle.driverName) {
      const v: Vehicle = {
        id: Math.random().toString(36).substr(2, 9),
        ...newVehicle
      };
      addVehicle(v);
      setNewVehicle({ plate: "", driverName: "", driverPhone: "" }); // Formu temizle
      setIsVehicleDialogOpen(false); // Modalı kapat
    }
  };

  // Atık Ekleme İşlemi
  const handleAddWaste = () => {
    if (newWaste.code && newWaste.name) {
      const w: WasteType = {
        id: Math.random().toString(36).substr(2, 9),
        ...newWaste
      };
      addWasteType(w);
      setNewWaste({ code: "", name: "" });
      setIsWasteDialogOpen(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-1">
        <h2 className="text-3xl font-bold tracking-tight">Yönetim Paneli</h2>
        <p className="text-gray-500">Sistem verilerini yönetin ve genel raporları inceleyin.</p>
      </div>

      <Tabs defaultValue="reports" className="w-full">
        <TabsList className="grid w-full grid-cols-3 max-w-[600px]">
          <TabsTrigger value="reports"><FileBarChart className="w-4 h-4 mr-2"/> Raporlar</TabsTrigger>
          <TabsTrigger value="vehicles"><Truck className="w-4 h-4 mr-2"/> Araçlar</TabsTrigger>
          <TabsTrigger value="wastetypes"><Database className="w-4 h-4 mr-2"/> Atık Kodları</TabsTrigger>
        </TabsList>

        {/* --- SEKME 1: RAPORLAR (YENİ) --- */}
        <TabsContent value="reports">
           <Card className="border-t-4 border-t-blue-500">
             <CardHeader>
               <CardTitle>Genel Operasyon Raporu</CardTitle>
               <CardDescription>Sistemdeki tüm gönderimlerin anlık durumu ve detayları.</CardDescription>
             </CardHeader>
             <CardContent>
               <Table>
                 <TableHeader>
                   <TableRow>
                     <TableHead>Tarih</TableHead>
                     <TableHead>Gönderici</TableHead>
                     <TableHead>Alıcı</TableHead>
                     <TableHead>Plaka</TableHead>
                     <TableHead>Atık</TableHead>
                     <TableHead>Miktar</TableHead>
                     <TableHead>Durum</TableHead>
                   </TableRow>
                 </TableHeader>
                 <TableBody>
                   {shipments.map((s) => {
                     const waste = wasteTypes.find(w => w.id === s.wasteTypeId);
                     const vehicle = vehicles.find(v => v.id === s.vehicleId);
                     return (
                       <TableRow key={s.id}>
                         <TableCell className="text-xs">{new Date(s.createdAt).toLocaleDateString('tr-TR')}</TableCell>
                         <TableCell>{s.senderName}</TableCell>
                         <TableCell>{s.receiverName}</TableCell>
                         <TableCell className="font-mono text-xs">{vehicle?.plate || "Silinmiş Araç"}</TableCell>
                         <TableCell>{waste?.name || "Silinmiş Kod"}</TableCell>
                         <TableCell>{s.amount} kg</TableCell>
                         <TableCell>
                            <Badge variant={
                              s.status === 'DELIVERED' ? 'default' : 
                              s.status === 'ON_WAY' ? 'secondary' : 
                              'destructive'
                            }>
                              {s.status}
                            </Badge>
                         </TableCell>
                       </TableRow>
                     )
                   })}
                 </TableBody>
               </Table>
             </CardContent>
           </Card>
        </TabsContent>

        {/* --- SEKME 2: ARAÇ YÖNETİMİ --- */}
        <TabsContent value="vehicles">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <div>
                <CardTitle>Araç Listesi</CardTitle>
                <CardDescription>Kayıtlı lisanslı araçlar.</CardDescription>
              </div>
              
              {/* ARAÇ EKLEME MODALI */}
              <Dialog open={isVehicleDialogOpen} onOpenChange={setIsVehicleDialogOpen}>
                <DialogTrigger asChild>
                  <Button size="sm"><Plus className="w-4 h-4 mr-2"/> Yeni Araç Ekle</Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Yeni Araç Tanımla</DialogTitle>
                  </DialogHeader>
                  <div className="grid gap-4 py-4">
                    <div className="grid gap-2">
                      <Label>Plaka</Label>
                      <Input placeholder="34 XX 1234" value={newVehicle.plate} onChange={(e) => setNewVehicle({...newVehicle, plate: e.target.value})} />
                    </div>
                    <div className="grid gap-2">
                      <Label>Şoför Adı</Label>
                      <Input placeholder="Ad Soyad" value={newVehicle.driverName} onChange={(e) => setNewVehicle({...newVehicle, driverName: e.target.value})} />
                    </div>
                    <div className="grid gap-2">
                      <Label>Telefon</Label>
                      <Input placeholder="05XX..." value={newVehicle.driverPhone} onChange={(e) => setNewVehicle({...newVehicle, driverPhone: e.target.value})} />
                    </div>
                  </div>
                  <DialogFooter>
                    <Button onClick={handleAddVehicle}>Kaydet</Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Plaka</TableHead>
                    <TableHead>Şoför Adı</TableHead>
                    <TableHead>İletişim</TableHead>
                    <TableHead className="text-right">İşlem</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {vehicles.map((v) => (
                    <TableRow key={v.id}>
                      <TableCell className="font-medium">{v.plate}</TableCell>
                      <TableCell>{v.driverName}</TableCell>
                      <TableCell>{v.driverPhone}</TableCell>
                      <TableCell className="text-right">
                        <Button variant="ghost" size="icon" className="text-red-500 hover:text-red-700 hover:bg-red-50" onClick={() => removeVehicle(v.id)}>
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        {/* --- SEKME 3: ATIK TİPİ YÖNETİMİ --- */}
        <TabsContent value="wastetypes">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <div>
                <CardTitle>Atık Kodları</CardTitle>
                <CardDescription>Yönetmelik kodları.</CardDescription>
              </div>

              {/* ATIK EKLEME MODALI */}
              <Dialog open={isWasteDialogOpen} onOpenChange={setIsWasteDialogOpen}>
                <DialogTrigger asChild>
                  <Button size="sm"><Plus className="w-4 h-4 mr-2"/> Yeni Kod Ekle</Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Yeni Atık Kodu Tanımla</DialogTitle>
                  </DialogHeader>
                  <div className="grid gap-4 py-4">
                    <div className="grid gap-2">
                      <Label>Atık Kodu</Label>
                      <Input placeholder="Örn: 08 01 11" value={newWaste.code} onChange={(e) => setNewWaste({...newWaste, code: e.target.value})} />
                    </div>
                    <div className="grid gap-2">
                      <Label>Atık Tanımı</Label>
                      <Input placeholder="Atık adı..." value={newWaste.name} onChange={(e) => setNewWaste({...newWaste, name: e.target.value})} />
                    </div>
                  </div>
                  <DialogFooter>
                    <Button onClick={handleAddWaste}>Kaydet</Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Atık Kodu</TableHead>
                    <TableHead>Atık Adı</TableHead>
                    <TableHead className="text-right">İşlem</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {wasteTypes.map((w) => (
                    <TableRow key={w.id}>
                      <TableCell className="font-mono font-bold">{w.code}</TableCell>
                      <TableCell>{w.name}</TableCell>
                      <TableCell className="text-right">
                        <Button variant="ghost" size="icon" className="text-red-500 hover:text-red-700 hover:bg-red-50" onClick={() => removeWasteType(w.id)}>
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
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
// İkonlar güncellendi
import { Trash2, Plus, FileBarChart, Truck, Database, BarChart3, TrendingUp, Scale, AlertTriangle } from "lucide-react";
import { Vehicle, WasteType } from "../types";

export default function AdminPage() {
  // 'companies' buraya eklendi (Hata Çözümü #1)
  const { vehicles, wasteTypes, shipments, role, addVehicle, removeVehicle, addWasteType, removeWasteType, companies } = useMockData();
  
  // Modal (Dialog) Kontrol State'leri
  const [isVehicleDialogOpen, setIsVehicleDialogOpen] = useState(false);
  const [isWasteDialogOpen, setIsWasteDialogOpen] = useState(false);

  // Form State'leri
  const [newVehicle, setNewVehicle] = useState({ plate: "", driverName: "", driverPhone: "" });
  const [newWaste, setNewWaste] = useState({ code: "", name: "" });

  if (role !== "admin") {
    return <div className="p-10 text-center text-red-500 font-bold">Bu sayfaya erişim yetkiniz yok.</div>;
  }

  // İSTATİSTİK HESAPLAMALARI
  const totalWeight = shipments.reduce((acc, curr) => acc + curr.amount, 0);
  const activeShipmentsCount = shipments.filter(s => s.status !== 'DELIVERED').length;
  const hazardousWasteCount = shipments.filter(s => {
    const w = wasteTypes.find(wt => wt.id === s.wasteTypeId);
    return w?.code.startsWith("18") || w?.name.includes("Tehlikeli"); 
  }).length;

  // Araç Ekleme İşlemi
  const handleAddVehicle = () => {
    if (newVehicle.plate && newVehicle.driverName) {
      const v: Vehicle = {
        id: Math.random().toString(36).substr(2, 9),
        ...newVehicle
      };
      addVehicle(v);
      setNewVehicle({ plate: "", driverName: "", driverPhone: "" });
      setIsVehicleDialogOpen(false);
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

        {/* --- SEKME 1: RAPORLAR (GÜNCELLENDİ) --- */}
        <TabsContent value="reports" className="space-y-4">
          
          {/* ÖZET KARTLARI */}
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Toplam Taşıma</CardTitle>
                <Scale className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{totalWeight.toLocaleString()} kg</div>
                <p className="text-xs text-muted-foreground">Sistemdeki toplam atık hacmi</p>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Aktif Sevkiyat</CardTitle>
                <TrendingUp className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{activeShipmentsCount}</div>
                <p className="text-xs text-muted-foreground">Şu an işlemde olan araçlar</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Riskli Atık</CardTitle>
                <AlertTriangle className="h-4 w-4 text-red-500" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-red-600">{hazardousWasteCount}</div>
                <p className="text-xs text-muted-foreground">Özel işlem gerektiren</p>
              </CardContent>
            </Card>
          </div>

          {/* DETAYLI ANALİZ TABLOLARI */}
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
            
            {/* TABLO 1: FİRMA BAZLI ÖZET */}
            <Card className="col-span-4">
              <CardHeader>
                <CardTitle>Firma Performansı</CardTitle>
                <CardDescription>Hangi firma ne kadar atık gönderdi?</CardDescription>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Firma Adı</TableHead>
                      <TableHead className="text-right">Sefer Sayısı</TableHead>
                      <TableHead className="text-right">Toplam (kg)</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {/* Hata Çözümü #2 ve #3: 'companies' artık tanımlı olduğu için bu map çalışacak */}
                    {companies.filter(c => c.role === 'sender').map(company => {
                      const companyShipments = shipments.filter(s => s.senderId === company.id);
                      const total = companyShipments.reduce((acc, s) => acc + s.amount, 0);
                      return (
                        <TableRow key={company.id}>
                          <TableCell className="font-medium">{company.name}</TableCell>
                          <TableCell className="text-right">{companyShipments.length}</TableCell>
                          <TableCell className="text-right">{total.toLocaleString()}</TableCell>
                        </TableRow>
                      )
                    })}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>

            {/* TABLO 2: SON HAREKETLER */}
            <Card className="col-span-3">
              <CardHeader>
                <CardTitle>Son Hareketler</CardTitle>
                <CardDescription>Sistemdeki son 5 işlem</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {shipments.slice(0, 5).map((s) => {
                     const vehicle = vehicles.find(v => v.id === s.vehicleId);
                     return (
                       <div key={s.id} className="flex items-center gap-4 border-b pb-3 last:border-0 last:pb-0">
                         <div className="w-9 h-9 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 font-bold text-xs shrink-0">
                            {s.senderName.substring(0,2).toUpperCase()}
                         </div>
                         <div className="flex-1 space-y-1 min-w-0">
                           <p className="text-sm font-medium leading-none truncate">{s.senderName} ➔ {s.receiverName}</p>
                           <p className="text-xs text-muted-foreground truncate">{vehicle?.plate} • {s.amount}kg</p>
                         </div>
                         <Badge variant="outline" className="text-xs shrink-0">{s.status}</Badge>
                       </div>
                     )
                  })}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* --- SEKME 2: ARAÇ YÖNETİMİ --- */}
        <TabsContent value="vehicles">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <div>
                <CardTitle>Araç Listesi</CardTitle>
                <CardDescription>Kayıtlı lisanslı araçlar.</CardDescription>
              </div>
              
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
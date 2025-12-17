"use client";

import { useState } from "react";
import { useMockData } from "@/context/MockDataContext";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Trash2, Plus, FileBarChart, Truck, Database, TrendingUp, Scale, AlertTriangle, Droplets, Tractor, FileText } from "lucide-react";
import { Vehicle, WasteType } from "../types";

// Grafik Bileşeni
import { WasteDistributionChart } from "@/components/charts/WasteDistributionChart";

export default function AdminPage() {
  const { vehicles, wasteTypes, shipments, role, addVehicle, removeVehicle, addWasteType, removeWasteType, companies } = useMockData();
  
  const [isVehicleDialogOpen, setIsVehicleDialogOpen] = useState(false);
  const [isWasteDialogOpen, setIsWasteDialogOpen] = useState(false);

  const [newVehicle, setNewVehicle] = useState({ plate: "", driverName: "", driverPhone: "" });
  const [newWaste, setNewWaste] = useState({ code: "", name: "" });

  if (role !== "admin") {
    return <div className="p-10 text-center text-red-500 font-bold">Bu sayfaya erişim yetkiniz yok.</div>;
  }

  // --- İSTATİSTİK HESAPLAMALARI ---
  // 1. Toplam Atık (kg) - Sadece WASTE tipindekileri veya tipi olmayanları (eski kayıtlar) topla
  const totalWeight = shipments.filter(s => s.docType === 'WASTE' || !s.docType).reduce((acc, curr) => acc + curr.amount, 0);
  
  // 2. Aktif Sevkiyatlar
  const activeShipmentsCount = shipments.filter(s => s.status !== 'DELIVERED').length;
  
  // 3. Riskli Atık Sayısı
  const hazardousWasteCount = shipments.filter(s => {
    // Sadece atıklar için risk kontrolü yapılır
    if (s.docType && s.docType !== 'WASTE') return false;
    const w = wasteTypes.find(wt => wt.id === s.wasteTypeId);
    return w?.code.startsWith("18") || w?.name.includes("Tehlikeli"); 
  }).length;

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

  // Helper: Atık Kodu Getir
  const getWasteCode = (id: string) => wasteTypes.find(w => w.id === id)?.code || "-";

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

        {/* --- SEKME 1: RAPORLAR --- */}
        <TabsContent value="reports" className="space-y-4">
          
          {/* ÖZET KARTLARI */}
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Toplam Atık</CardTitle>
                <Scale className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{totalWeight.toLocaleString()} kg</div>
                <p className="text-xs text-muted-foreground">Genel atık hacmi</p>
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
            
            {/* 4. Kart boş kaldı, dilerseniz buraya 'Toplam Su' ekleyebiliriz */}
             <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Toplam Sefer</CardTitle>
                <Truck className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{shipments.length}</div>
                <p className="text-xs text-muted-foreground">Kayıtlı tüm transferler</p>
              </CardContent>
            </Card>
          </div>

          {/* DETAYLI ANALİZ TABLOLARI & GRAFİKLER */}
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
            
            {/* 1. GRAFİK: Atık Dağılımı (3 birim yer kaplar) */}
            <WasteDistributionChart shipments={shipments.filter(s => s.docType === 'WASTE' || !s.docType)} wasteTypes={wasteTypes} />

            {/* 2. YENİ SEKMELİ TABLO: OPERASYON HAREKETLERİ (4 birim yer kaplar - Grafiğin Yanı) */}
            <Card className="col-span-4">
              <CardHeader className="pb-2">
                <CardTitle>Operasyon Hareketleri</CardTitle>
                <CardDescription>Belge türüne göre son işlemler.</CardDescription>
              </CardHeader>
              <CardContent>
                {/* İÇ TABS */}
                <Tabs defaultValue="waste" className="w-full">
                    <TabsList className="grid w-full grid-cols-3 mb-4">
                        <TabsTrigger value="waste" className="text-xs"><FileText className="w-3 h-3 mr-1"/> Atık</TabsTrigger>
                        <TabsTrigger value="machine" className="text-xs"><Tractor className="w-3 h-3 mr-1"/> İş Makinası</TabsTrigger>
                        <TabsTrigger value="water" className="text-xs"><Droplets className="w-3 h-3 mr-1"/> Su Tankeri</TabsTrigger>
                    </TabsList>

                    {/* ATIK TABLOSU */}
                    <TabsContent value="waste">
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead className="w-[80px]">Kod</TableHead>
                                    <TableHead>Gönderen</TableHead>
                                    <TableHead>Plaka</TableHead>
                                    <TableHead className="text-right">Miktar</TableHead>
                                    <TableHead className="text-right">Durum</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {shipments.filter(s => s.docType === 'WASTE' || !s.docType).slice(0, 5).map(s => {
                                    const v = vehicles.find(veh => veh.id === s.vehicleId);
                                    return (
                                        <TableRow key={s.id}>
                                            <TableCell className="font-mono text-xs">{getWasteCode(s.wasteTypeId)}</TableCell>
                                            <TableCell className="text-xs font-medium">{s.senderName}</TableCell>
                                            <TableCell className="text-xs text-muted-foreground">{v?.plate || "-"}</TableCell>
                                            <TableCell className="text-right text-xs">{s.amount} kg</TableCell>
                                            <TableCell className="text-right">
                                                <Badge variant="outline" className="text-[10px] px-1 py-0">{s.status}</Badge>
                                            </TableCell>
                                        </TableRow>
                                    )
                                })}
                                {shipments.filter(s => s.docType === 'WASTE' || !s.docType).length === 0 && (
                                    <TableRow><TableCell colSpan={5} className="text-center text-xs py-4 text-gray-400">Kayıt yok</TableCell></TableRow>
                                )}
                            </TableBody>
                        </Table>
                    </TabsContent>

                    {/* İŞ MAKİNASI TABLOSU */}
                    <TabsContent value="machine">
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>Makine</TableHead>
                                    <TableHead>İş Tanımı</TableHead>
                                    <TableHead>Plaka</TableHead>
                                    <TableHead className="text-right">Süre</TableHead>
                                    <TableHead className="text-right">Durum</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {shipments.filter(s => s.docType === 'MACHINE').map(s => {
                                    const v = vehicles.find(veh => veh.id === s.vehicleId);
                                    return (
                                        <TableRow key={s.id}>
                                            <TableCell className="font-medium text-xs">{s.machineName}</TableCell>
                                            <TableCell className="text-xs text-muted-foreground">{s.workDescription}</TableCell>
                                            <TableCell className="text-xs font-mono">{v?.plate || "-"}</TableCell>
                                            <TableCell className="text-right text-xs font-bold">{s.workHours}</TableCell>
                                            <TableCell className="text-right">
                                                <Badge variant="outline" className="text-[10px] px-1 py-0">{s.status}</Badge>
                                            </TableCell>
                                        </TableRow>
                                    )
                                })}
                                {shipments.filter(s => s.docType === 'MACHINE').length === 0 && (
                                    <TableRow><TableCell colSpan={5} className="text-center text-xs py-4 text-gray-400">Kayıt yok</TableCell></TableRow>
                                )}
                            </TableBody>
                        </Table>
                    </TabsContent>

                    {/* SU TANKERİ TABLOSU */}
                    <TabsContent value="water">
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>Kaynak</TableHead>
                                    <TableHead>Değerler</TableHead>
                                    <TableHead>Plaka</TableHead>
                                    <TableHead className="text-right">Miktar</TableHead>
                                    <TableHead className="text-right">Durum</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {shipments.filter(s => s.docType === 'WATER').map(s => {
                                    const v = vehicles.find(veh => veh.id === s.vehicleId);
                                    return (
                                        <TableRow key={s.id}>
                                            <TableCell className="font-medium text-xs">{s.waterSource}</TableCell>
                                            <TableCell className="text-xs text-muted-foreground">pH:{s.phLevel} / Cl:{s.chlorineLevel}</TableCell>
                                            <TableCell className="text-xs font-mono">{v?.plate || "-"}</TableCell>
                                            <TableCell className="text-right text-xs font-bold text-cyan-600">{s.amount} Lt</TableCell>
                                            <TableCell className="text-right">
                                                <Badge variant="outline" className="text-[10px] px-1 py-0">{s.status}</Badge>
                                            </TableCell>
                                        </TableRow>
                                    )
                                })}
                                {shipments.filter(s => s.docType === 'WATER').length === 0 && (
                                    <TableRow><TableCell colSpan={5} className="text-center text-xs py-4 text-gray-400">Kayıt yok</TableCell></TableRow>
                                )}
                            </TableBody>
                        </Table>
                    </TabsContent>
                </Tabs>
              </CardContent>
            </Card>

            {/* 3. TABLO: FİRMA PERFORMANSI (7 birim - Tam satır) */}
            <Card className="col-span-7">
              <CardHeader>
                <CardTitle>Firma Performansı</CardTitle>
                <CardDescription>Hangi firma ne kadar atık gönderdi?</CardDescription>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Firma Adı</TableHead>
                      <TableHead className="text-right">Sefer</TableHead>
                      <TableHead className="text-right">Toplam (kg)</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {companies.filter(c => c.role === 'sender').map(company => {
                      const companyShipments = shipments.filter(s => s.senderId === company.id && (s.docType === 'WASTE' || !s.docType));
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
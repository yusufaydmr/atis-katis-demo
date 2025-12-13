"use client";

import { useState } from "react";
import { useMockData } from "@/context/MockDataContext";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Plus, FileText, Truck } from "lucide-react";
import { Shipment } from "../types";

export default function SenderPage() {
  const { role, currentCompanyId, shipments, vehicles, wasteTypes, companies, addShipment } = useMockData();
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  // Form State
  const [formData, setFormData] = useState({
    wasteTypeId: "",
    vehicleId: "",
    receiverId: "",
    amount: "",
  });

  // Sadece Sender rolü girebilir
  if (role !== "sender") {
    return <div className="p-10 text-center text-red-500 font-bold">Bu sayfaya sadece Gönderici Firmalar erişebilir.</div>;
  }

  // Alıcı firmaları filtrele (Dropdown için)
  const receivers = companies.filter(c => c.role === "receiver");

  // Yeni Kayıt Ekleme Fonksiyonu
  const handleSubmit = () => {
    if (!formData.wasteTypeId || !formData.vehicleId || !formData.receiverId || !formData.amount) {
      alert("Lütfen tüm alanları doldurunuz.");
      return;
    }

    const selectedReceiver = receivers.find(r => r.id === formData.receiverId);
    const selectedCompany = companies.find(c => c.id === currentCompanyId);

    const newShipment: Shipment = {
      id: Math.random().toString(36).substr(2, 9), // Rastgele ID
      senderId: currentCompanyId || "",
      receiverId: formData.receiverId,
      senderName: selectedCompany?.name || "Bilinmeyen Gönderici",
      receiverName: selectedReceiver?.name || "Bilinmeyen Alıcı",
      wasteTypeId: formData.wasteTypeId,
      vehicleId: formData.vehicleId,
      amount: Number(formData.amount),
      status: "SECURITY_PENDING", // İlk statü: Güvenlik Bekliyor
      createdAt: new Date().toISOString(),
      documentUrl: "/mock-docs/tasima-belgesi.pdf", // Mock belge linki
    };

    addShipment(newShipment);
    setIsDialogOpen(false); // Modalı kapat
    setFormData({ wasteTypeId: "", vehicleId: "", receiverId: "", amount: "" }); // Formu temizle
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Atık Gönderim Paneli</h2>
          <p className="text-gray-500">Geçmiş gönderimleriniz ve yeni talep oluşturma.</p>
        </div>

        {/* YENİ GÖNDERİM MODALI (DIALOG) */}
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button className="bg-green-600 hover:bg-green-700">
              <Plus className="mr-2 h-4 w-4" /> Yeni Atık Çıkışı
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
              <DialogTitle>Yeni Atık Taşıma Formu</DialogTitle>
              <DialogDescription>
                Lütfen atık, araç ve alıcı bilgilerini eksiksiz giriniz.
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              
              {/* Alıcı Seçimi */}
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="receiver" className="text-right">Alıcı</Label>
                <Select onValueChange={(val) => setFormData({...formData, receiverId: val})}>
                  <SelectTrigger className="col-span-3">
                    <SelectValue placeholder="Alıcı Firma Seçin" />
                  </SelectTrigger>
                  <SelectContent>
                    {receivers.map((r) => (
                      <SelectItem key={r.id} value={r.id}>{r.name}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Atık Tipi */}
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="waste" className="text-right">Atık Tipi</Label>
                <Select onValueChange={(val) => setFormData({...formData, wasteTypeId: val})}>
                  <SelectTrigger className="col-span-3">
                    <SelectValue placeholder="Atık Türü Seçin" />
                  </SelectTrigger>
                  <SelectContent>
                    {wasteTypes.map((w) => (
                      <SelectItem key={w.id} value={w.id}>{w.code} - {w.name}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Araç Seçimi */}
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="vehicle" className="text-right">Araç</Label>
                <Select onValueChange={(val) => setFormData({...formData, vehicleId: val})}>
                  <SelectTrigger className="col-span-3">
                    <SelectValue placeholder="Plaka Seçin" />
                  </SelectTrigger>
                  <SelectContent>
                    {vehicles.map((v) => (
                      <SelectItem key={v.id} value={v.id}>{v.plate} ({v.driverName})</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Miktar */}
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="amount" className="text-right">Miktar (kg)</Label>
                <Input
                  id="amount"
                  type="number"
                  className="col-span-3"
                  placeholder="Örn: 500"
                  onChange={(e) => setFormData({...formData, amount: e.target.value})}
                />
              </div>

              {/* Dosya Yükleme (Görsel) */}
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="file" className="text-right">Belge</Label>
                <div className="col-span-3 border-2 border-dashed rounded-md p-4 text-center text-sm text-gray-500 cursor-pointer hover:bg-gray-50">
                  <FileText className="mx-auto h-6 w-6 mb-1" />
                  Taşıma Belgesi Yükle
                </div>
              </div>
            </div>
            <DialogFooter>
              <Button type="submit" onClick={handleSubmit}>Kaydı Oluştur</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      {/* GEÇMİŞ GÖNDERİMLER TABLOSU */}
      <Card>
        <CardHeader>
          <CardTitle>Gönderim Listesi</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Tarih</TableHead>
                <TableHead>Alıcı Firma</TableHead>
                <TableHead>Atık Türü</TableHead>
                <TableHead>Plaka</TableHead>
                <TableHead>Miktar</TableHead>
                <TableHead>Durum</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {shipments.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={6} className="text-center h-24">Henüz gönderim kaydı bulunmamaktadır.</TableCell>
                </TableRow>
              ) : (
                shipments.map((s) => {
                  const waste = wasteTypes.find(w => w.id === s.wasteTypeId);
                  const vehicle = vehicles.find(v => v.id === s.vehicleId);
                  
                  return (
                    <TableRow key={s.id}>
                      <TableCell>{new Date(s.createdAt).toLocaleDateString('tr-TR')}</TableCell>
                      <TableCell>{s.receiverName}</TableCell>
                      <TableCell>{waste?.code} ({waste?.name})</TableCell>
                      <TableCell><div className="flex items-center gap-1"><Truck className="w-3 h-3"/> {vehicle?.plate}</div></TableCell>
                      <TableCell>{s.amount} kg</TableCell>
                      <TableCell>
                         {/* Duruma göre renk değiştiren Badge */}
                        <Badge variant={
                          s.status === 'DELIVERED' ? 'default' : 
                          s.status === 'ON_WAY' ? 'secondary' : 
                          'destructive' // Security Pending için kırmızı/turuncu ton
                        }>
                          {s.status === 'SECURITY_PENDING' && 'Güvenlik Bekliyor'}
                          {s.status === 'ON_WAY' && 'Yolda'}
                          {s.status === 'DELIVERED' && 'Teslim Edildi'}
                        </Badge>
                      </TableCell>
                    </TableRow>
                  );
                })
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
"use client";

import { useState } from "react";
import { useMockData } from "@/context/MockDataContext";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Plus, FileText, Truck, Building2, User } from "lucide-react";

export default function SenderPage() {
  const { shipments, addShipment } = useMockData();
  const [isNewOpen, setIsNewOpen] = useState(false);

  // Form State
  const [formData, setFormData] = useState({
    receiverName: "",
    carrierName: "",
    plateNumber: "",
    driverName: "",
    driverId: "", 
    wasteCode: "",
    wasteDescription: "",
    amount: "",
    unit: "kg",
    physicalState: "Kati",
    packagingType: "Dokme",
    hazardCode: "",
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSelectChange = (name: string, value: string) => {
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Otomatik alanları oluştur
    const newId = Math.random().toString(36).substring(2, 9);
    const newCode = `UATF-${Math.floor(100000 + Math.random() * 900000)}`;
    const now = new Date().toISOString();

    addShipment({
      id: newId,
      code: newCode,
      createdAt: now,
      updatedAt: now,
      senderId: "current-user",
      senderName: "Merkez Fabrika A.Ş.",
      receiverId: "rx-1",
      receiverName: formData.receiverName,
      carrierName: formData.carrierName,
      plateNumber: formData.plateNumber,
      driverName: formData.driverName,
      driverId: formData.driverId,
      wasteCode: formData.wasteCode,
      wasteDescription: formData.wasteDescription,
      amount: Number(formData.amount),
      unit: formData.unit as "kg" | "ton",
      physicalState: formData.physicalState,
      packagingType: formData.packagingType,
      hazardCode: formData.hazardCode,
      status: "olusturuldu",
    });
    setIsNewOpen(false);
    setFormData({
      receiverName: "",
      carrierName: "",
      plateNumber: "",
      driverName: "",
      driverId: "",
      wasteCode: "",
      wasteDescription: "",
      amount: "",
      unit: "kg",
      physicalState: "Kati",
      packagingType: "Dokme",
      hazardCode: "",
    });
  };

  // Excel Hücresi - Compact Tasarım
  const ExcelCell = ({ 
    label, 
    children, 
    className = "", 
    contentClass="",
    required = false
  }: { 
    label?: string, 
    children: React.ReactNode, 
    className?: string, 
    contentClass?: string,
    required?: boolean
  }) => (
    <div className={`bg-white flex flex-col justify-center px-3 py-1.5 border-r border-b border-gray-300 last:border-r-0 ${className}`}>
      {label && (
        <label className="text-[10px] font-bold text-gray-500 uppercase tracking-tight mb-0.5 whitespace-nowrap overflow-hidden text-ellipsis">
          {label} {required && <span className="text-red-500">*</span>}
        </label>
      )}
      <div className={`flex items-center ${contentClass}`}>
        {children}
      </div>
    </div>
  );

  // Input stilleri - Compact & Clean
  const inputClass = "border-0 focus-visible:ring-0 px-0 h-7 w-full bg-transparent text-sm placeholder:text-gray-300 text-gray-900 font-medium";

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold tracking-tight">Giden Atık Yönetimi</h1>
        <Dialog open={isNewOpen} onOpenChange={setIsNewOpen}>
          <DialogTrigger asChild>
            <Button className="bg-green-600 hover:bg-green-700 size-lg text-md px-6">
              <Plus className="mr-2 h-5 w-5" /> Yeni Taşıma Formu (UATF)
            </Button>
          </DialogTrigger>
          
          {/* GÜNCELLEME BURADA YAPILDI:
            sm:max-w-[90vw] -> Küçük ekran ve üzeri tüm ekranlarda genişliği %90 yap.
            Böylece varsayılan dar kutu (max-w-lg) iptal edilmiş olur.
          */}
          <DialogContent className="sm:max-w-[90vw] w-full p-0 overflow-hidden gap-0 bg-gray-100 shadow-2xl border border-gray-400">
            
            <DialogHeader className="px-4 py-3 bg-white border-b border-gray-300 flex flex-row items-center justify-between">
              <DialogTitle className="flex items-center gap-2 text-lg text-gray-800">
                 <FileText className="h-5 w-5 text-blue-600" />
                 ULUSAL ATIK TAŞIMA FORMU OLUŞTUR
              </DialogTitle>
            </DialogHeader>
            
            <form onSubmit={handleSubmit} className="p-4 bg-gray-200">
              
              {/* ANA ÇERÇEVE */}
              <div className="border border-gray-400 bg-white shadow-sm">
                
                {/* ÜST KISIM: A ve B Blokları (Yan Yana) */}
                <div className="flex w-full border-b border-gray-400">
                  
                  {/* --- BÖLÜM A: ÜRETİCİ & ALICI (%50 Genişlik) --- */}
                  <div className="w-1/2 border-r border-gray-400 flex flex-col">
                    <div className="bg-blue-50 px-3 py-1.5 border-b border-gray-300">
                      <span className="text-xs font-bold text-blue-900">A - ÜRETİCİ & ALICI BİLGİLERİ</span>
                    </div>
                    
                    <div className="grid grid-cols-2">
                       <ExcelCell label="Üretici Firma (Gönderen)" className="col-span-2">
                        <Input value="Merkez Fabrika A.Ş. (34-001)" disabled className={`${inputClass} text-gray-500`} />
                      </ExcelCell>
                      
                      <ExcelCell label="Alıcı Firma (Tesis)" required>
                        <Input 
                          name="receiverName" 
                          placeholder="Firma Adı" 
                          value={formData.receiverName} 
                          onChange={handleInputChange} 
                          className={inputClass} 
                        />
                      </ExcelCell>
                      
                      <ExcelCell label="Tesis Kodu">
                        <Input placeholder="Kod Giriniz" className={inputClass} />
                      </ExcelCell>
                    </div>
                  </div>

                  {/* --- BÖLÜM B: TAŞIYICI (%50 Genişlik) --- */}
                  <div className="w-1/2 flex flex-col">
                    <div className="bg-orange-50 px-3 py-1.5 border-b border-gray-300">
                      <span className="text-xs font-bold text-orange-900">B - TAŞIYICI FİRMA BİLGİLERİ</span>
                    </div>

                    <div className="grid grid-cols-3">
                       <ExcelCell label="Taşıyıcı Firma Ünvanı" className="col-span-3" required>
                        <Input 
                          name="carrierName"
                          placeholder="Lojistik Firması"
                          value={formData.carrierName}
                          onChange={handleInputChange}
                          className={inputClass}
                        />
                      </ExcelCell>

                      <ExcelCell label="Plaka" required>
                        <Input 
                          name="plateNumber"
                          placeholder="34 XX 000"
                          value={formData.plateNumber}
                          onChange={handleInputChange}
                          className={`${inputClass} font-mono font-bold uppercase`}
                        />
                      </ExcelCell>

                      <ExcelCell label="Sürücü Adı" required>
                        <Input 
                          name="driverName"
                          placeholder="Ad Soyad"
                          value={formData.driverName}
                          onChange={handleInputChange}
                          className={inputClass}
                        />
                      </ExcelCell>

                       <ExcelCell label="Sürücü TC">
                        <Input 
                          name="driverId"
                          placeholder="11 Haneli No"
                          maxLength={11}
                          value={formData.driverId}
                          onChange={handleInputChange}
                          className={`${inputClass} font-mono`}
                        />
                      </ExcelCell>
                    </div>
                  </div>
                </div>

                {/* --- BÖLÜM C: ATIK BİLGİLERİ (Tam Genişlik - FLEX YAPISI) --- */}
                <div className="w-full">
                   <div className="bg-green-50 px-3 py-1.5 border-b border-gray-300">
                    <span className="text-xs font-bold text-green-900">C - ATIK TANIMI VE MİKTAR BİLGİLERİ</span>
                  </div>
                  
                  {/* FLEX ROW: Yüzdelik paylaşımlar burada yapılır */}
                  <div className="flex w-full">
                    
                    {/* 1. Atık Kodu (%12) */}
                    <div className="w-[12%] border-r border-gray-300">
                       <ExcelCell label="Atık Kodu (EWC)" required className="border-none">
                         <Input 
                            name="wasteCode"
                            placeholder="08 01 11"
                            value={formData.wasteCode}
                            onChange={handleInputChange}
                            className={`${inputClass} font-bold text-center text-blue-700`}
                         />
                       </ExcelCell>
                    </div>

                    {/* 2. Atık Tanımı (%33) - EN GENİŞ ALAN */}
                    <div className="w-[33%] border-r border-gray-300">
                       <ExcelCell label="Atık Tanımı" className="border-none">
                         <Input 
                            name="wasteDescription"
                            placeholder="Atık içeriğini buraya giriniz..."
                            value={formData.wasteDescription}
                            onChange={handleInputChange}
                            className={inputClass}
                         />
                       </ExcelCell>
                    </div>

                    {/* 3. H Kodu (%8) */}
                    <div className="w-[8%] border-r border-gray-300">
                       <ExcelCell label="H Kodu" className="border-none text-center">
                         <Input 
                            name="hazardCode"
                            placeholder="H3"
                            value={formData.hazardCode}
                            onChange={handleInputChange}
                            className={`${inputClass} text-center`}
                         />
                       </ExcelCell>
                    </div>

                     {/* 4. Fiziksel Özellik (%15) */}
                    <div className="w-[15%] border-r border-gray-300">
                       <ExcelCell label="Fiziksel Özellik" className="border-none">
                          <Select onValueChange={(v) => handleSelectChange("physicalState", v)} value={formData.physicalState}>
                            <SelectTrigger className="border-0 p-0 h-7 focus:ring-0 shadow-none bg-transparent text-sm">
                              <SelectValue placeholder="Seç" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="Kati">Katı</SelectItem>
                              <SelectItem value="Sivi">Sıvı</SelectItem>
                              <SelectItem value="Camur">Çamur</SelectItem>
                            </SelectContent>
                          </Select>
                       </ExcelCell>
                    </div>

                     {/* 5. Ambalaj (%15) */}
                    <div className="w-[15%] border-r border-gray-300">
                       <ExcelCell label="Ambalaj Türü" className="border-none">
                          <Select onValueChange={(v) => handleSelectChange("packagingType", v)} value={formData.packagingType}>
                            <SelectTrigger className="border-0 p-0 h-7 focus:ring-0 shadow-none bg-transparent text-sm">
                              <SelectValue placeholder="Seç" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="Dokme">Dökme</SelectItem>
                              <SelectItem value="Varil">Varil</SelectItem>
                              <SelectItem value="IBC">IBC Tank</SelectItem>
                              <SelectItem value="Konteyner">Konteyner</SelectItem>
                            </SelectContent>
                          </Select>
                       </ExcelCell>
                    </div>

                     {/* 6. Miktar (%17) */}
                    <div className="w-[17%]">
                       <ExcelCell label="Miktar" required className="border-none bg-yellow-50/30" contentClass="gap-1">
                          <Input 
                            name="amount"
                            type="number"
                            placeholder="0.00"
                            value={formData.amount}
                            onChange={handleInputChange}
                            className={`${inputClass} text-right font-bold`}
                          />
                          <Select onValueChange={(v) => handleSelectChange("unit", v)} value={formData.unit}>
                            <SelectTrigger className="border border-gray-200 h-6 w-14 bg-white rounded-sm text-xs focus:ring-0 px-1">
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="kg">kg</SelectItem>
                              <SelectItem value="ton">ton</SelectItem>
                            </SelectContent>
                          </Select>
                       </ExcelCell>
                    </div>
                  </div>
                </div>
              </div>

              <div className="mt-4 flex items-center justify-end gap-3">
                 <Button variant="ghost" type="button" onClick={() => setIsNewOpen(false)}>İptal</Button>
                 <Button type="submit" className="bg-blue-600 hover:bg-blue-700 px-8">
                    <Truck className="mr-2 h-4 w-4" /> 
                    Kaydet
                 </Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Toplam Gönderim</CardTitle>
            <Truck className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{shipments.filter(s => s.senderId === 'current-user').length}</div>
            <p className="text-xs text-muted-foreground">Bu ay yapılan seferler</p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Son Gönderimler</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {shipments.filter(s => s.senderId === 'current-user').map((shipment) => (
              <div
                key={shipment.id}
                className="flex items-center justify-between p-4 border rounded-lg bg-card hover:bg-gray-50 transition-colors"
              >
                <div className="grid gap-1">
                  <div className="flex items-center gap-2">
                    <span className="font-semibold text-lg">{shipment.code}</span>
                    <Badge variant={shipment.status === 'teslim_edildi' ? 'default' : 'secondary'}>
                      {shipment.status.replace('_', ' ').toUpperCase()}
                    </Badge>
                  </div>
                  <div className="text-sm text-muted-foreground flex gap-6 mt-1">
                    <span className="flex items-center gap-1.5">
                      <Building2 className="h-4 w-4 text-gray-500" /> {shipment.receiverName}
                    </span>
                    <span className="flex items-center gap-1.5">
                      <User className="h-4 w-4 text-gray-500" /> {shipment.plateNumber}
                    </span>
                    <span className="font-medium text-gray-900 bg-gray-100 px-2 py-0.5 rounded">
                      {shipment.wasteCode}
                    </span>
                    <span>
                      {shipment.amount} {shipment.unit}
                    </span>
                  </div>
                </div>
                <div className="text-sm text-right text-muted-foreground">
                   <div>{new Date(shipment.createdAt).toLocaleDateString('tr-TR')}</div>
                   <div className="text-xs mt-1">{new Date(shipment.createdAt).toLocaleTimeString('tr-TR', {hour: '2-digit', minute:'2-digit'})}</div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
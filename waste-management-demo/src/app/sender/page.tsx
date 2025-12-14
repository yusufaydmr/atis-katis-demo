"use client"

import { useState } from "react"
import { useMockData } from "@/context/MockDataContext"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
} from "@/components/ui/dialog"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Input } from "@/components/ui/input"
import { Plus, Truck, FileText, Download, Filter, Tractor, Droplets } from "lucide-react"
import { cn } from "@/lib/utils"
import { Shipment } from "@/app/types"

// --- TİP TANIMLAMALARI ---
type DocType = 'WASTE' | 'MACHINE' | 'WATER';

// --- EXCEL HÜCRE BİLEŞENİ ---
const ExcelCell = ({ 
  label, 
  children, 
  className,
  headerClass = "bg-gray-50 text-gray-700" 
}: { 
  label: string; 
  children: React.ReactNode; 
  className?: string;
  headerClass?: string;
}) => (
  <div className={cn("flex flex-col h-full border-r border-gray-200 last:border-r-0 bg-white", className)}>
    {/* Başlık Kısmı */}
    <div className={cn("w-full px-3 py-1.5 text-[11px] font-bold uppercase tracking-wide border-b border-gray-100 flex-shrink-0", headerClass)}>
      {label}
    </div>
    {/* İçerik Kısmı */}
    <div className="flex-1 flex items-center px-3 relative min-h-[40px]">
      {children}
    </div>
  </div>
)

export default function SenderPage() {
  const { shipments, addShipment, companies, wasteTypes, vehicles, currentCompanyId } = useMockData()
  const [isNewShipmentOpen, setIsNewShipmentOpen] = useState(false)
  
  // Belge Tipi State'i
  const [docType, setDocType] = useState<DocType>('WASTE');

  // Form State
  const [formData, setFormData] = useState({
    receiverId: "",
    transporterId: "", 
    vehiclePlate: "",
    driverName: "",
    wasteCode: "",
    packagingType: "IBC",
    amount: "",
    plannedDate: new Date().toISOString().split('T')[0],
    // İş Makinası Ek Alanları
    machineName: "",
    workDescription: "",
    workHours: "",
    // Su Tankeri Ek Alanları
    waterSource: "",
    chlorineLevel: "",
    phLevel: ""
  })

  const selectedWaste = wasteTypes.find(w => w.code === formData.wasteCode)

  // GÜNCELLEME: isDraft parametresi eklendi
  const handleCreateShipment = (isDraft: boolean = false) => {
    // Validasyon: Eğer taslak değilse zorunlu alanları kontrol et
    if (!isDraft && (!formData.receiverId || !formData.amount)) {
        alert("Lütfen zorunlu alanları doldurunuz.");
        return;
    }

    const matchedVehicle = vehicles.find(v => v.plate === formData.vehiclePlate)
    const vehicleIdToUse = matchedVehicle ? matchedVehicle.id : (vehicles[0]?.id || "v1")
    
    // Basit atık ID atama
    let wasteTypeIdToUse = "w1"; 
    if (docType === 'WASTE' && selectedWaste) wasteTypeIdToUse = selectedWaste.id;

    const shipmentData: Shipment = {
      id: Math.random().toString(36).substr(2, 9).toUpperCase(),
      senderId: currentCompanyId || "1",
      receiverId: formData.receiverId,
      senderName: companies.find(c => c.id === (currentCompanyId || "1"))?.name || "Gönderen",
      receiverName: companies.find(c => c.id === formData.receiverId)?.name || "Alıcı",
      wasteTypeId: wasteTypeIdToUse, 
      amount: Number(formData.amount),
      vehicleId: vehicleIdToUse,
      // KRİTİK DÜZELTME: Eğer taslak değilse 'SECURITY_PENDING' olarak işaretle
      status: isDraft ? "CREATED" : "SECURITY_PENDING", 
      createdAt: new Date(formData.plannedDate).toISOString(),
    }

    addShipment(shipmentData)
    setIsNewShipmentOpen(false)
    
    // Formu Sıfırla
    setFormData({
      ...formData,
      amount: "",
      wasteCode: "",
      machineName: "",
      waterSource: ""
    })
  }

  // Yardımcı fonksiyonlar
  const getCompanyName = (id: string) => companies.find(c => c.id === id)?.name || id
  const getWasteCodeById = (id: string) => wasteTypes.find(w => w.id === id)?.code || id
  const getWasteNameById = (id: string) => wasteTypes.find(w => w.id === id)?.name || "-"
  
  const formatDate = (dateString: string) => {
    try {
        const d = new Date(dateString)
        return new Intl.DateTimeFormat('tr-TR', { day: '2-digit', month: '2-digit', year: 'numeric' }).format(d)
    } catch (e) {
        return dateString
    }
  }

  const getDocTypeConfig = () => {
    switch (docType) {
      case 'MACHINE': return { title: 'İş Makinası Takip Formu', icon: <Tractor className="h-5 w-5" /> };
      case 'WATER': return { title: 'İçme/Kullanma Suyu Takip Formu', icon: <Droplets className="h-5 w-5" /> };
      default: return { title: 'Atık Transfer Formu (U-ATOF)', icon: <FileText className="h-5 w-5" /> };
    }
  }

  const config = getDocTypeConfig();

  return (
    <div className="space-y-6">
      {/* İstatistikler */}
      <div className="grid gap-4 md:grid-cols-3">
        <Card className="shadow-sm border-l-4 border-l-blue-600">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Toplam Gönderim</CardTitle>
            <FileText className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{shipments.filter(s => s.senderId === currentCompanyId).length}</div>
            <p className="text-xs text-muted-foreground">Son 30 günde +12% artış</p>
          </CardContent>
        </Card>
        <Card className="shadow-sm border-l-4 border-l-yellow-500">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Bekleyen Onaylar</CardTitle>
            <Badge variant="secondary" className="bg-yellow-100 text-yellow-800 hover:bg-yellow-100">İşlemde</Badge>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{shipments.filter(s => s.senderId === currentCompanyId && s.status === "SECURITY_PENDING").length}</div>
            <p className="text-xs text-muted-foreground">Güvenlik onayı bekleniyor</p>
          </CardContent>
        </Card>
        <Card className="shadow-sm border-l-4 border-l-green-600">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Yoldaki Araçlar</CardTitle>
            <Truck className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{shipments.filter(s => s.senderId === currentCompanyId && s.status === "ON_WAY").length}</div>
            <p className="text-xs text-muted-foreground">Tahmini varış: 2 saat</p>
          </CardContent>
        </Card>
      </div>

      {/* Liste ve Buton */}
      <Card className="border shadow-md">
        <CardHeader className="flex flex-row items-center justify-between bg-gray-50/50 border-b py-4">
          <div>
            <CardTitle className="text-lg font-bold text-gray-800">Atık Transfer Listesi (U-ATOF)</CardTitle>
            <p className="text-xs text-gray-500 mt-1">Tesisinizden çıkan tüm atık transferlerinin detaylı dökümü.</p>
          </div>
          
          <div className="flex gap-2">
            <Button variant="outline" size="sm" className="bg-white">
              <Filter className="mr-2 h-4 w-4 text-gray-500" /> Filtrele
            </Button>
            <Button variant="outline" size="sm" className="bg-white">
              <Download className="mr-2 h-4 w-4 text-gray-500" /> Excel
            </Button>

            <Dialog open={isNewShipmentOpen} onOpenChange={setIsNewShipmentOpen}>
              <DialogTrigger asChild>
                <Button className="bg-blue-700 hover:bg-blue-800 text-white shadow-sm">
                  <Plus className="mr-2 h-4 w-4" /> Yeni Belge Oluştur
                </Button>
              </DialogTrigger>
              
              {/* Modal İçeriği */}
              <DialogContent className="sm:max-w-[90vw] p-0 gap-0 overflow-hidden bg-gray-50">
                <DialogHeader className="px-6 py-4 bg-white border-b border-gray-200">
                  <div className="flex justify-between items-center">
                    <div className="flex items-center gap-2">
                        {/* Başlık her zaman Mavi */}
                        <div className="p-2 rounded-lg bg-blue-50 text-blue-900">
                            {config.icon}
                        </div>
                        <div>
                            <DialogTitle className="text-xl text-blue-900">
                                {config.title}
                            </DialogTitle>
                            <p className="text-sm text-gray-500 mt-1">Lütfen ilgili alanları eksiksiz doldurunuz.</p>
                        </div>
                    </div>
                    
                    {/* BELGE TİPİ SEÇİCİSİ */}
                    <div className="flex items-center gap-2 bg-gray-100 p-1.5 rounded-md border border-gray-200">
                        <span className="text-xs font-bold text-gray-500 px-2 uppercase">Belge Tipi:</span>
                        <Select 
                            value={docType} 
                            onValueChange={(val: DocType) => setDocType(val)}
                        >
                            <SelectTrigger className="w-[200px] h-8 bg-white border-gray-300 text-xs font-bold shadow-sm">
                                <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="WASTE">🗑️ Atık Transfer Formu</SelectItem>
                                <SelectItem value="MACHINE">🚜 İş Makinası Takip</SelectItem>
                                <SelectItem value="WATER">💧 Su Tankeri Takip</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>
                  </div>
                </DialogHeader>

                <div className="p-6">
                  <div className="bg-white border border-gray-300 rounded-sm shadow-sm overflow-hidden flex flex-col">
                    
                    {/* ÜST BÖLÜM: YAN YANA MAVİ (Sol) VE KIRMIZI (Sağ) */}
                    <div className="flex flex-col lg:flex-row border-b border-gray-300">
                        
                        {/* SOL: MAVİ BÖLÜM (LOJİSTİK) - FİRMALAR */}
                        <div className="lg:w-[40%] flex flex-col border-b lg:border-b-0 lg:border-r border-gray-300">
                            <div className="h-16 border-b border-gray-200">
                                <ExcelCell label={docType === 'WATER' ? "KAYNAK (SİZ)" : "GÖNDEREN FİRMA"} headerClass="bg-blue-50 text-blue-700">
                                    <div className="text-sm font-medium text-gray-900 w-full truncate">
                                      {companies.find(c => c.id === currentCompanyId)?.name || "Firma Seçilmedi"}
                                    </div>
                                </ExcelCell>
                            </div>
                            <div className="h-16 border-b border-gray-200">
                                <ExcelCell label="TAŞIYICI FİRMA" headerClass="bg-blue-50 text-blue-700">
                                    <Select 
                                      value={formData.transporterId} 
                                      onValueChange={(val) => setFormData(s => ({ ...s, transporterId: val }))}
                                    >
                                    <SelectTrigger className="border-0 shadow-none focus:ring-0 px-0 h-full flex items-center text-sm font-medium text-gray-900 bg-transparent">
                                        <SelectValue placeholder="Seçiniz..." />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {companies.map(c => (
                                        <SelectItem key={c.id} value={c.id}>{c.name}</SelectItem>
                                        ))}
                                    </SelectContent>
                                    </Select>
                                </ExcelCell>
                            </div>
                            <div className="h-16">
                                <ExcelCell label={docType === 'WATER' ? "TESLİM YERİ" : "ALICI FİRMA"} headerClass="bg-blue-50 text-blue-700">
                                    <Select 
                                      value={formData.receiverId} 
                                      onValueChange={(val) => setFormData(s => ({ ...s, receiverId: val }))}
                                    >
                                    <SelectTrigger className="border-0 shadow-none focus:ring-0 px-0 h-full flex items-center text-sm font-medium text-gray-900 bg-transparent">
                                        <SelectValue placeholder="Seçiniz..." />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {companies.filter(c => c.role === "receiver").map(c => (
                                        <SelectItem key={c.id} value={c.id}>{c.name}</SelectItem>
                                        ))}
                                    </SelectContent>
                                    </Select>
                                </ExcelCell>
                            </div>
                        </div>

                        {/* SAĞ: KIRMIZI BÖLÜM (SEFER) - DETAYLAR (2x2 Grid) */}
                        <div className="lg:w-[60%] grid grid-cols-2 grid-rows-2">
                             <div className="h-24 border-b border-r border-gray-200">
                                <ExcelCell label="TARİH" headerClass="bg-red-50 text-red-700">
                                    <Input 
                                      type="date"
                                      value={formData.plannedDate}
                                      onChange={(e) => setFormData(s => ({ ...s, plannedDate: e.target.value }))}
                                      className="border-0 shadow-none focus-visible:ring-0 px-0 h-full text-gray-900 bg-transparent w-full font-medium"
                                    />
                                </ExcelCell>
                             </div>
                             <div className="h-24 border-b border-gray-200">
                                <ExcelCell label="ARAÇ PLAKASI" headerClass="bg-red-50 text-red-700">
                                    <Select 
                                      value={formData.vehiclePlate}
                                      onValueChange={(val) => {
                                          const vehicle = vehicles.find(v => v.plate === val)
                                          setFormData(s => ({ 
                                          ...s, 
                                          vehiclePlate: val,
                                          driverName: vehicle?.driverName || s.driverName 
                                          }))
                                      }}
                                    >
                                    <SelectTrigger className="border-0 shadow-none focus:ring-0 px-0 h-full flex items-center font-mono font-bold text-gray-900 bg-transparent text-lg">
                                        <SelectValue placeholder="PLAKA" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {vehicles.map(v => (
                                        <SelectItem key={v.id} value={v.plate}>{v.plate}</SelectItem>
                                        ))}
                                    </SelectContent>
                                    </Select>
                                </ExcelCell>
                             </div>
                             <div className="h-24 border-r border-gray-200">
                                <ExcelCell label="SÜRÜCÜ ADI SOYADI" headerClass="bg-red-50 text-red-700">
                                    <Input 
                                      placeholder="İsim Giriniz" 
                                      value={formData.driverName}
                                      onChange={(e) => setFormData(s => ({ ...s, driverName: e.target.value }))}
                                      className="border-0 shadow-none focus-visible:ring-0 px-0 h-full text-gray-900 placeholder:text-gray-300 font-medium"
                                    />
                                </ExcelCell>
                             </div>
                             <div className="h-24">
                                <ExcelCell label="TRANSFER TÜRÜ" headerClass="bg-red-50 text-red-700">
                                    <span className="text-gray-500 text-sm font-medium w-full flex items-center h-full">
                                        {docType === 'WASTE' ? "Tehlikeli / Tehlikesiz" : docType === 'MACHINE' ? "Nakliye / Lowbed" : "Tanker Transferi"}
                                    </span>
                                </ExcelCell>
                             </div>
                        </div>
                    </div>

                    {/* ALT BÖLÜM: YEŞİL (DİNAMİK İÇERİK - AMA RENK HEP YEŞİL) */}
                    <div className="flex w-full min-h-[80px]">
                      
                      {/* DURUM 1: ATIK FORMU */}
                      {docType === 'WASTE' && (
                        <>
                          <div className="w-[15%]">
                            <ExcelCell label="ATIK KODU" headerClass="bg-green-50 text-green-700">
                              <Select 
                                value={formData.wasteCode} 
                                onValueChange={(val) => setFormData(s => ({ ...s, wasteCode: val }))}
                              >
                                <SelectTrigger className="border-0 shadow-none focus:ring-0 px-0 h-full flex items-center font-mono font-bold text-gray-900 bg-transparent">
                                  <SelectValue placeholder="------" />
                                </SelectTrigger>
                                <SelectContent>
                                  {wasteTypes.map((w: any) => (
                                    <SelectItem key={w.code} value={w.code}>{w.code}</SelectItem>
                                  ))}
                                </SelectContent>
                              </Select>
                            </ExcelCell>
                          </div>
                          <div className="w-[30%]">
                            <ExcelCell label="ATIK TANIMI" headerClass="bg-green-50 text-green-700">
                              <div className="text-sm text-gray-700 py-1 leading-tight flex items-center h-full">
                                {selectedWaste ? selectedWaste.name : "..."}
                              </div>
                            </ExcelCell>
                          </div>
                          <div className="w-[20%]">
                            <ExcelCell label="AMBALAJ TÜRÜ" headerClass="bg-green-50 text-green-700">
                              <Select 
                                value={formData.packagingType} 
                                onValueChange={(val) => setFormData(s => ({ ...s, packagingType: val }))}
                              >
                                <SelectTrigger className="border-0 shadow-none focus:ring-0 px-0 h-full flex items-center font-medium text-gray-900 bg-transparent">
                                  <SelectValue placeholder="Seçiniz" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="IBC">IBC Tank</SelectItem>
                                    <SelectItem value="Varil">Varil (Metal)</SelectItem>
                                    <SelectItem value="Plastik">Plastik Bidon</SelectItem>
                                    <SelectItem value="Dökme">Dökme Yük</SelectItem>
                                </SelectContent>
                              </Select>
                            </ExcelCell>
                          </div>
                        </>
                      )}

                      {/* DURUM 2: İŞ MAKİNASI FORMU - RENK: YEŞİL (SABİTLENDİ) */}
                      {docType === 'MACHINE' && (
                        <>
                          <div className="w-[25%]">
                            <ExcelCell label="MAKİNE TANIMI" headerClass="bg-green-50 text-green-700">
                              <Input 
                                placeholder="Örn: Ekskavatör CAT 320"
                                value={formData.machineName}
                                onChange={(e) => setFormData(s => ({ ...s, machineName: e.target.value }))}
                                className="border-0 shadow-none focus-visible:ring-0 px-0 h-full font-medium text-gray-900"
                              />
                            </ExcelCell>
                          </div>
                          <div className="w-[25%]">
                            <ExcelCell label="YAPILAN İŞ" headerClass="bg-green-50 text-green-700">
                               <Input 
                                placeholder="Örn: Saha düzeltme"
                                value={formData.workDescription}
                                onChange={(e) => setFormData(s => ({ ...s, workDescription: e.target.value }))}
                                className="border-0 shadow-none focus-visible:ring-0 px-0 h-full text-gray-900"
                              />
                            </ExcelCell>
                          </div>
                          <div className="w-[15%]">
                            <ExcelCell label="ÇALIŞMA SAATİ" headerClass="bg-green-50 text-green-700">
                               <Input 
                                placeholder="00:00"
                                value={formData.workHours}
                                onChange={(e) => setFormData(s => ({ ...s, workHours: e.target.value }))}
                                className="border-0 shadow-none focus-visible:ring-0 px-0 h-full font-mono text-gray-900"
                              />
                            </ExcelCell>
                          </div>
                        </>
                      )}

                      {/* DURUM 3: SU TANKERİ FORMU - RENK: YEŞİL (SABİTLENDİ) */}
                      {docType === 'WATER' && (
                        <>
                           <div className="w-[25%]">
                            <ExcelCell label="SU KAYNAĞI" headerClass="bg-green-50 text-green-700">
                              <Input 
                                placeholder="Örn: Kuyu 2"
                                value={formData.waterSource}
                                onChange={(e) => setFormData(s => ({ ...s, waterSource: e.target.value }))}
                                className="border-0 shadow-none focus-visible:ring-0 px-0 h-full font-medium text-gray-900"
                              />
                            </ExcelCell>
                          </div>
                          <div className="w-[20%]">
                            <ExcelCell label="KLOR (ppm)" headerClass="bg-green-50 text-green-700">
                               <Input 
                                type="number"
                                placeholder="0.5"
                                value={formData.chlorineLevel}
                                onChange={(e) => setFormData(s => ({ ...s, chlorineLevel: e.target.value }))}
                                className="border-0 shadow-none focus-visible:ring-0 px-0 h-full font-mono text-gray-900"
                              />
                            </ExcelCell>
                          </div>
                          <div className="w-[20%]">
                            <ExcelCell label="pH DEĞERİ" headerClass="bg-green-50 text-green-700">
                               <Input 
                                type="number"
                                placeholder="7.2"
                                value={formData.phLevel}
                                onChange={(e) => setFormData(s => ({ ...s, phLevel: e.target.value }))}
                                className="border-0 shadow-none focus-visible:ring-0 px-0 h-full font-mono text-gray-900"
                              />
                            </ExcelCell>
                          </div>
                        </>
                      )}

                      {/* ORTAK ALANLAR (MİKTAR) - RENK: YEŞİL (SABİTLENDİ) */}
                      <div className="w-[20%]">
                        <ExcelCell label="MİKTAR" headerClass="bg-green-50 text-green-700">
                          <Input 
                            type="number"
                            placeholder="0.00" 
                            value={formData.amount}
                            onChange={(e) => setFormData(s => ({ ...s, amount: e.target.value }))}
                            className="border-0 shadow-none focus-visible:ring-0 px-0 h-full text-right font-bold text-lg text-gray-900 placeholder:text-gray-200"
                          />
                        </ExcelCell>
                      </div>
                      <div className="flex-1">
                        <ExcelCell label="BİRİM" headerClass="bg-green-50 text-green-700">
                           <span className="text-sm font-bold text-gray-900 flex items-center h-full">
                               {docType === 'MACHINE' ? "SAAT" : docType === 'WATER' ? "LT" : "KG"}
                           </span>
                        </ExcelCell>
                      </div>
                    </div>
                  </div>
                  
                  {/* Footer Bilgilendirme - Hep Mavi Tema */}
                  <div className="mt-4 flex items-start gap-2 text-xs text-gray-500">
                      <div className="w-4 h-4 mt-0.5 rounded-full bg-blue-600 flex items-center justify-center font-bold text-white">i</div>
                      <p>Seçilen belge tipine ({config.title}) göre form alanları güncellenmiştir. Kayıt sonrası ilgili birimlere otomatik bildirim gidecektir.</p>
                  </div>
                </div>

                <DialogFooter className="px-6 py-4 bg-gray-50 border-t border-gray-200 sm:justify-between">
                  {/* Taslak Butonu: 'true' gönderir -> Statü: CREATED */}
                  <Button variant="outline" onClick={() => setIsNewShipmentOpen(false)} className="border-gray-300 text-gray-700">
                    Vazgeç
                  </Button>
                  <div className="flex gap-2">
                      <Button 
                          variant="secondary" 
                          onClick={() => handleCreateShipment(true)} 
                          className="bg-white border border-gray-300 text-gray-700 hover:bg-gray-50"
                      >
                          Taslak Olarak Kaydet
                      </Button>
                      {/* Ana Buton: 'false' gönderir -> Statü: SECURITY_PENDING */}
                      <Button 
                          onClick={() => handleCreateShipment(false)} 
                          className="px-8 text-white hover:opacity-90 bg-blue-600 hover:bg-blue-700"
                      >
                          {docType === 'WASTE' ? 'Transferi Başlat' : 'Kayıt Oluştur'}
                      </Button>
                  </div>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </div>
        </CardHeader>
        
        {/* EXCEL TARZI TABLO ALANI */}
        <div className="overflow-x-auto">
            <Table className="border-collapse border-b border-gray-200">
              <TableHeader>
                <TableRow className="bg-gray-100 hover:bg-gray-100 border-b border-gray-300">
                  <TableHead className="h-9 border-r border-gray-300 text-gray-700 font-bold text-xs uppercase w-[100px]">Transfer ID</TableHead>
                  <TableHead className="h-9 border-r border-gray-300 text-gray-700 font-bold text-xs uppercase w-[100px]">Tarih</TableHead>
                  <TableHead className="h-9 border-r border-gray-300 text-gray-700 font-bold text-xs uppercase">Alıcı Firma</TableHead>
                  <TableHead className="h-9 border-r border-gray-300 text-gray-700 font-bold text-xs uppercase w-[120px]">Araç Plaka</TableHead>
                  <TableHead className="h-9 border-r border-gray-300 text-gray-700 font-bold text-xs uppercase">Sürücü</TableHead>
                  <TableHead className="h-9 border-r border-gray-300 text-gray-700 font-bold text-xs uppercase w-[100px]">Atık Kodu</TableHead>
                  <TableHead className="h-9 border-r border-gray-300 text-gray-700 font-bold text-xs uppercase">Atık Tanımı</TableHead>
                  <TableHead className="h-9 border-r border-gray-300 text-gray-700 font-bold text-xs uppercase text-right w-[100px]">Miktar</TableHead>
                  <TableHead className="h-9 text-gray-700 font-bold text-xs uppercase w-[120px] text-center">Durum</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {shipments.filter(s => s.senderId === currentCompanyId).map((shipment) => {
                   const vehicle = vehicles.find(v => v.id === shipment.vehicleId);
                   return (
                    <TableRow key={shipment.id} className="hover:bg-blue-50/50 border-b border-gray-200 text-xs">
                      <TableCell className="border-r border-gray-200 py-2 font-mono text-gray-500">
                        #{shipment.id.substring(0,6).toUpperCase()}
                      </TableCell>
                      <TableCell className="border-r border-gray-200 py-2 font-medium">
                        {formatDate(shipment.createdAt)}
                      </TableCell>
                      <TableCell className="border-r border-gray-200 py-2">
                        {getCompanyName(shipment.receiverId)}
                      </TableCell>
                      <TableCell className="border-r border-gray-200 py-2 font-mono font-semibold text-gray-700">
                        {vehicle?.plate || "-"}
                      </TableCell>
                      <TableCell className="border-r border-gray-200 py-2 text-gray-600">
                         {vehicle?.driverName || "-"}
                      </TableCell>
                      <TableCell className="border-r border-gray-200 py-2 font-mono text-blue-700 font-bold">
                        {getWasteCodeById(shipment.wasteTypeId)}
                      </TableCell>
                      <TableCell className="border-r border-gray-200 py-2 text-gray-600 truncate max-w-[150px]" title={getWasteNameById(shipment.wasteTypeId)}>
                        {getWasteNameById(shipment.wasteTypeId)}
                      </TableCell>
                      <TableCell className="border-r border-gray-200 py-2 text-right font-mono font-medium text-gray-900">
                        {shipment.amount.toLocaleString("tr-TR")}
                      </TableCell>
                      <TableCell className="py-2 text-center">
                        <Badge 
                          variant={
                            shipment.status === "DELIVERED" ? "default" : 
                            shipment.status === "ON_WAY" ? "secondary" : "outline"
                          }
                          className={cn(
                            "rounded-none px-2 py-0.5 text-[10px] font-normal w-full justify-center",
                            shipment.status === "DELIVERED" ? "bg-green-600 hover:bg-green-700 text-white" :
                            shipment.status === "ON_WAY" ? "bg-blue-100 text-blue-800 hover:bg-blue-200" :
                            shipment.status === "SECURITY_PENDING" ? "bg-yellow-100 text-yellow-800 border-yellow-300" : 
                            "bg-gray-100 text-gray-600 border-gray-300" // CREATED için gri
                          )}
                        >
                           {shipment.status === "DELIVERED" ? "TESLİM EDİLDİ" :
                           shipment.status === "ON_WAY" ? "YOLDA" :
                           shipment.status === "SECURITY_PENDING" ? "ONAY BEKLİYOR" : "TASLAK"}
                        </Badge>
                      </TableCell>
                    </TableRow>
                   )
                })}
              </TableBody>
            </Table>
        </div>
      </Card>
    </div>
  )
}
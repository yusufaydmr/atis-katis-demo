"use client"

import { useState } from "react"
import { useMockData } from "@/context/MockDataContext"
import { Shipment } from "@/app/types"
import { Tractor, Droplets, FileText, Filter, Download, Plus, ChevronRight, XCircle } from "lucide-react"

// UI Bileşenleri
import { Card, CardHeader, CardTitle, CardContent, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"

// Yardımcılar ve Modallar
import { cn, exportToCSV } from "@/lib/utils"
import { FilterDialog, FilterCriteria } from "@/components/FilterDialog"
import { SenderStats } from "./components/SenderStats"
import { NewShipmentDialog } from "./components/NewShipmentDialog"
import { PrintTemplate } from "./components/PrintTemplate"
import { ShipmentDetailDialog } from "./components/ShipmentDetailDialog"
import { MonthlyTrendChart } from "@/components/charts/MonthlyTrendChart"

export type DocType = 'WASTE' | 'MACHINE' | 'WATER';

export default function SenderPage() {
  // GÜNCELLEME: addVehicle fonksiyonunu context'ten çektik (Yeni plaka girilirse kaydetmek için)
  const { addShipment, addVehicle, companies, wasteTypes, vehicles, currentCompanyId, shipments } = useMockData()
  
  // State Yönetimi
  const [isNewShipmentOpen, setIsNewShipmentOpen] = useState(false)
  const [isDetailOpen, setIsDetailOpen] = useState(false)
  const [isFilterOpen, setIsFilterOpen] = useState(false)
  
  const [selectedShipment, setSelectedShipment] = useState<Shipment | null>(null)
  const [activeFilters, setActiveFilters] = useState<FilterCriteria | null>(null)
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
    
    // GÜNCELLEME: Transfer Türü (Tehlikeli/Tehlikesiz) eklendi
    transferType: "NON_HAZARDOUS", // 'HAZARDOUS' | 'NON_HAZARDOUS'

    machineName: "",
    workDescription: "",
    workHours: "",
    waterSource: "",
    chlorineLevel: "",
    phLevel: ""
  })

  const activeCompanyId = currentCompanyId || "comp_sender_1";
  const selectedWaste = wasteTypes.find(w => w.code === formData.wasteCode)

  // --- YARDIMCI FONKSİYONLAR ---
  const getCompanyName = (id: string) => companies.find(c => c.id === id)?.name || id
  const getWasteCodeById = (id: string) => wasteTypes.find(w => w.id === id)?.code || id
  const getWasteNameById = (id: string) => wasteTypes.find(w => w.id === id)?.name || "-"
  
  const formatDate = (dateString: string) => {
    try {
        const d = new Date(dateString)
        return new Intl.DateTimeFormat('tr-TR', { day: '2-digit', month: '2-digit', year: 'numeric' }).format(d)
    } catch { return dateString }
  }

  // --- KAYIT OLUŞTURMA ---
  const handleCreateShipment = (isDraft: boolean = false) => {
    if (!isDraft && (!formData.receiverId || !formData.amount)) {
        alert("Lütfen zorunlu alanları doldurunuz.");
        return;
    }

    // GÜNCELLEME: Plaka/Şoför Mantığı
    // Eğer girilen plaka listede varsa ID'sini al, yoksa yeni araç oluştur ve onun ID'sini kullan.
    let vehicleIdToUse = "";
    const existingVehicle = vehicles.find(v => v.plate === formData.vehiclePlate);

    if (existingVehicle) {
        vehicleIdToUse = existingVehicle.id;
    } else {
        // Sistemde olmayan bir plaka girildi, otomatik kaydedelim
        const newVehicleId = `v_auto_${Date.now()}`;
        addVehicle({
            id: newVehicleId,
            plate: formData.vehiclePlate || "PLAKASIZ",
            driverName: formData.driverName || "Bilinmiyor",
            driverPhone: "-"
        });
        vehicleIdToUse = newVehicleId;
    }
    
    let wasteTypeIdToUse = "w1"; 
    if (docType === 'WASTE' && selectedWaste) wasteTypeIdToUse = selectedWaste.id;

    const shipmentData: Shipment = {
      id: Math.random().toString(36).substr(2, 9).toUpperCase(),
      senderId: activeCompanyId,
      receiverId: formData.receiverId,
      senderName: companies.find(c => c.id === activeCompanyId)?.name || "Gönderen",
      receiverName: companies.find(c => c.id === formData.receiverId)?.name || "Alıcı",
      wasteTypeId: wasteTypeIdToUse, 
      amount: Number(formData.amount),
      vehicleId: vehicleIdToUse,
      status: isDraft ? "CREATED" : "SECURITY_PENDING", 
      createdAt: new Date(formData.plannedDate).toISOString(),
      
      docType: docType,
      machineName: formData.machineName,
      workDescription: formData.workDescription,
      workHours: formData.workHours,
      waterSource: formData.waterSource,
      phLevel: formData.phLevel,
      chlorineLevel: formData.chlorineLevel
      // Not: transferType verisi mock data yapısında yoksa sadece formda kalır, 
      // kaydetmek isterseniz Shipment tipine eklemeniz gerekir.
    }

    addShipment(shipmentData)
    setIsNewShipmentOpen(false)
    
    setFormData({
      ...formData,
      amount: "",
      wasteCode: "",
      machineName: "",
      waterSource: "",
      vehiclePlate: "",
      driverName: ""
    })
  }

  // --- TABLO İŞLEMLERİ ---
  const handleRowClick = (shipment: Shipment) => {
    setSelectedShipment(shipment);
    setIsDetailOpen(true);
  }

  const handlePrint = () => {
    window.print();
  }

  // --- FİLTRELEME MANTIĞI ---
  const isFiltersEmpty = (filters: FilterCriteria | null) => {
      if (!filters) return true;
      return !filters.startDate && !filters.endDate && (filters.status === "ALL" || filters.status === "") && (filters.wasteTypeId === "ALL");
  }

  const filteredShipments = shipments.filter(s => {
    if (s.senderId !== activeCompanyId) return false;
    
    // Filtreler
    if (!isFiltersEmpty(activeFilters)) {
        const itemDate = new Date(s.createdAt).getTime();
        if (activeFilters?.startDate && itemDate < new Date(activeFilters.startDate).getTime()) return false;
        if (activeFilters?.endDate) {
            const end = new Date(activeFilters.endDate);
            end.setHours(23, 59, 59);
            if (itemDate > end.getTime()) return false;
        }
        if (activeFilters?.status && activeFilters.status !== "ALL" && s.status !== activeFilters.status) return false;
        if (activeFilters?.wasteTypeId && activeFilters.wasteTypeId !== "ALL" && s.wasteTypeId !== activeFilters.wasteTypeId) return false;
    }
    return true;
  });

  const hasActiveFilters = !isFiltersEmpty(activeFilters);

  // --- EXCEL İNDİRME ---
  const handleDownloadExcel = () => {
    const excelData = filteredShipments.map(s => {
        const vehicle = vehicles.find(v => v.id === s.vehicleId);
        return {
            "Tip": s.docType || "WASTE",
            "Transfer ID": s.id.toUpperCase(),
            "Tarih": formatDate(s.createdAt),
            "Alıcı Firma": getCompanyName(s.receiverId),
            "Plaka": vehicle?.plate || "-",
            "İçerik": s.docType === 'MACHINE' ? s.machineName : s.docType === 'WATER' ? s.waterSource : getWasteCodeById(s.wasteTypeId),
            "Miktar": s.amount,
            "Birim": s.docType === 'WATER' ? 'Lt' : s.docType === 'MACHINE' ? 'Adet' : 'kg',
            "Durum": s.status
        };
    });
    exportToCSV(excelData, "Gonderim_Listesi");
  };

  // Konfigürasyon
  const getDocTypeConfig = () => {
    switch (docType) {
      case 'MACHINE': return { title: 'İŞ MAKİNASI SEVK İRSALİYESİ', code: 'FR-MK-01', icon: <Tractor className="h-5 w-5" /> };
      case 'WATER': return { title: 'İÇME/KULLANMA SUYU TAKİP FORMU', code: 'FR-SU-03', icon: <Droplets className="h-5 w-5" /> };
      default: return { title: 'ULUSAL ATIK TAŞIMA FORMU (U-ATOF)', code: 'FR-ATK-09', icon: <FileText className="h-5 w-5" /> };
    }
  }
  const config = getDocTypeConfig();

  return (
    <>
      <div className="space-y-6 print:hidden">
        {/* İstatistikler */}
        <SenderStats />

        {/* Grafik Alanı */}
        <div className="grid gap-4 md:grid-cols-1">
           <MonthlyTrendChart 
              data={shipments.filter(s => s.senderId === activeCompanyId)} 
           />
        </div>

        {/* --- YENİ SEKMELİ TABLO ALANI --- */}
        <Card className="border shadow-md">
          <CardHeader className="flex flex-row items-center justify-between bg-gray-50/50 border-b py-4">
            <div>
              <CardTitle className="text-lg font-bold text-gray-800">Transfer Listesi</CardTitle>
              <div className="flex items-center gap-2 mt-1">
                 <p className="text-xs text-gray-500">Tesisinizden çıkan tüm transferlerin detaylı dökümü.</p>
                 {hasActiveFilters && (
                     <Badge 
                        variant="secondary" 
                        className="text-[10px] h-5 bg-blue-100 text-blue-700 hover:bg-blue-200 gap-1 cursor-pointer select-none"
                        onClick={() => setActiveFilters(null)}
                     >
                        Filtreler Aktif 
                        <XCircle className="w-3 h-3" />
                     </Badge>
                 )}
              </div>
            </div>
            
            <div className="flex gap-2">
              <Button 
                variant={hasActiveFilters ? "default" : "outline"} 
                size="sm" 
                className={hasActiveFilters ? "bg-blue-600 hover:bg-blue-700" : "bg-white"}
                onClick={() => setIsFilterOpen(true)}
              >
                <Filter className="mr-2 h-4 w-4" /> {hasActiveFilters ? "Filtreyi Düzenle" : "Filtrele"}
              </Button>

              <Button variant="outline" size="sm" className="bg-white" onClick={handleDownloadExcel}>
                <Download className="mr-2 h-4 w-4 text-gray-500" /> Excel
              </Button>
              <Button onClick={() => setIsNewShipmentOpen(true)} className="bg-blue-700 hover:bg-blue-800 text-white shadow-sm">
                <Plus className="mr-2 h-4 w-4" /> Yeni Belge Oluştur
              </Button>
            </div>
          </CardHeader>
          
          <CardContent className="p-0">
            <Tabs defaultValue="waste" className="w-full">
                <div className="px-4 pt-4">
                    <TabsList className="grid w-full grid-cols-3 max-w-[400px]">
                        <TabsTrigger value="waste" className="text-xs"><FileText className="w-3 h-3 mr-1"/> Atık Transfer</TabsTrigger>
                        <TabsTrigger value="machine" className="text-xs"><Tractor className="w-3 h-3 mr-1"/> İş Makinası</TabsTrigger>
                        <TabsTrigger value="water" className="text-xs"><Droplets className="w-3 h-3 mr-1"/> Su Tankeri</TabsTrigger>
                    </TabsList>
                </div>

                {/* 1. ATIK TABLOSU */}
                <TabsContent value="waste" className="m-0">
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
                            <TableHead className="h-9 border-r border-gray-300 text-gray-700 font-bold text-xs uppercase text-right w-[100px]">Miktar (kg)</TableHead>
                            <TableHead className="h-9 text-gray-700 font-bold text-xs uppercase w-[120px] text-center">Durum</TableHead>
                            <TableHead className="w-[40px]"></TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {filteredShipments.filter(s => s.docType === 'WASTE' || !s.docType).map((shipment) => {
                                const vehicle = vehicles.find(v => v.id === shipment.vehicleId);
                                return (
                                <TableRow 
                                    key={shipment.id} 
                                    className="hover:bg-blue-50/50 border-b border-gray-200 text-xs cursor-pointer transition-colors group"
                                    onClick={() => handleRowClick(shipment)}
                                >
                                    <TableCell className="border-r border-gray-200 py-2 font-mono text-gray-500">#{shipment.id.substring(0,6).toUpperCase()}</TableCell>
                                    <TableCell className="border-r border-gray-200 py-2 font-medium">{formatDate(shipment.createdAt)}</TableCell>
                                    <TableCell className="border-r border-gray-200 py-2">{getCompanyName(shipment.receiverId)}</TableCell>
                                    <TableCell className="border-r border-gray-200 py-2 font-mono font-semibold text-gray-700">{vehicle?.plate || "-"}</TableCell>
                                    <TableCell className="border-r border-gray-200 py-2 text-gray-600">{vehicle?.driverName || "-"}</TableCell>
                                    <TableCell className="border-r border-gray-200 py-2 font-mono text-blue-700 font-bold">{getWasteCodeById(shipment.wasteTypeId)}</TableCell>
                                    <TableCell className="border-r border-gray-200 py-2 text-gray-600 truncate max-w-[150px]" title={getWasteNameById(shipment.wasteTypeId)}>{getWasteNameById(shipment.wasteTypeId)}</TableCell>
                                    <TableCell className="border-r border-gray-200 py-2 text-right font-mono font-medium text-gray-900">{shipment.amount.toLocaleString("tr-TR")}</TableCell>
                                    <TableCell className="py-2 text-center">
                                    <Badge 
                                        variant="outline"
                                        className={cn("rounded-none px-2 py-0.5 text-[10px] font-normal w-full justify-center",
                                        shipment.status === "DELIVERED" ? "bg-green-600 text-white" :
                                        shipment.status === "ON_WAY" ? "bg-blue-100 text-blue-800" :
                                        shipment.status === "SECURITY_PENDING" ? "bg-yellow-100 text-yellow-800 border-yellow-300" : 
                                        "bg-gray-100 text-gray-600 border-gray-300"
                                        )}
                                    >
                                        {shipment.status === "DELIVERED" ? "TESLİM EDİLDİ" :
                                        shipment.status === "ON_WAY" ? "YOLDA" :
                                        shipment.status === "SECURITY_PENDING" ? "ONAY BEKLİYOR" : "TASLAK"}
                                    </Badge>
                                    </TableCell>
                                    <TableCell>
                                        <ChevronRight className="w-4 h-4 text-gray-300 group-hover:text-blue-500" />
                                    </TableCell>
                                </TableRow>
                                )
                            })}
                            {filteredShipments.filter(s => s.docType === 'WASTE' || !s.docType).length === 0 && (
                                <TableRow><TableCell colSpan={10} className="text-center py-8 text-gray-500">Kayıt bulunamadı.</TableCell></TableRow>
                            )}
                        </TableBody>
                        </Table>
                    </div>
                </TabsContent>

                {/* 2. İŞ MAKİNASI TABLOSU */}
                <TabsContent value="machine" className="m-0">
                    <div className="overflow-x-auto">
                        <Table className="border-collapse border-b border-gray-200">
                        <TableHeader>
                            <TableRow className="bg-gray-100 hover:bg-gray-100 border-b border-gray-300">
                            <TableHead className="h-9 border-r border-gray-300 text-gray-700 font-bold text-xs uppercase w-[100px]">Transfer ID</TableHead>
                            <TableHead className="h-9 border-r border-gray-300 text-gray-700 font-bold text-xs uppercase w-[100px]">Tarih</TableHead>
                            <TableHead className="h-9 border-r border-gray-300 text-gray-700 font-bold text-xs uppercase">Alıcı Firma</TableHead>
                            <TableHead className="h-9 border-r border-gray-300 text-gray-700 font-bold text-xs uppercase w-[150px]">Makine</TableHead>
                            <TableHead className="h-9 border-r border-gray-300 text-gray-700 font-bold text-xs uppercase">İş Tanımı</TableHead>
                            <TableHead className="h-9 border-r border-gray-300 text-gray-700 font-bold text-xs uppercase w-[120px]">Plaka</TableHead>
                            <TableHead className="h-9 border-r border-gray-300 text-gray-700 font-bold text-xs uppercase text-right w-[100px]">Çalışma</TableHead>
                            <TableHead className="h-9 text-gray-700 font-bold text-xs uppercase w-[120px] text-center">Durum</TableHead>
                            <TableHead className="w-[40px]"></TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {filteredShipments.filter(s => s.docType === 'MACHINE').map((shipment) => {
                                const vehicle = vehicles.find(v => v.id === shipment.vehicleId);
                                return (
                                <TableRow 
                                    key={shipment.id} 
                                    className="hover:bg-blue-50/50 border-b border-gray-200 text-xs cursor-pointer transition-colors group"
                                    onClick={() => handleRowClick(shipment)}
                                >
                                    <TableCell className="border-r border-gray-200 py-2 font-mono text-gray-500">#{shipment.id.substring(0,6).toUpperCase()}</TableCell>
                                    <TableCell className="border-r border-gray-200 py-2 font-medium">{formatDate(shipment.createdAt)}</TableCell>
                                    <TableCell className="border-r border-gray-200 py-2">{getCompanyName(shipment.receiverId)}</TableCell>
                                    <TableCell className="border-r border-gray-200 py-2 font-bold text-gray-800">{shipment.machineName}</TableCell>
                                    <TableCell className="border-r border-gray-200 py-2 text-gray-600">{shipment.workDescription}</TableCell>
                                    <TableCell className="border-r border-gray-200 py-2 font-mono font-semibold text-gray-700">{vehicle?.plate || "-"}</TableCell>
                                    <TableCell className="border-r border-gray-200 py-2 text-right font-mono font-medium text-gray-900">{shipment.workHours}</TableCell>
                                    <TableCell className="py-2 text-center">
                                    <Badge 
                                        variant="outline"
                                        className={cn("rounded-none px-2 py-0.5 text-[10px] font-normal w-full justify-center",
                                        shipment.status === "DELIVERED" ? "bg-green-600 text-white" :
                                        shipment.status === "ON_WAY" ? "bg-blue-100 text-blue-800" :
                                        shipment.status === "SECURITY_PENDING" ? "bg-yellow-100 text-yellow-800 border-yellow-300" : 
                                        "bg-gray-100 text-gray-600 border-gray-300"
                                        )}
                                    >
                                        {shipment.status === "DELIVERED" ? "TESLİM EDİLDİ" :
                                        shipment.status === "ON_WAY" ? "YOLDA" :
                                        shipment.status === "SECURITY_PENDING" ? "ONAY BEKLİYOR" : "TASLAK"}
                                    </Badge>
                                    </TableCell>
                                    <TableCell>
                                        <ChevronRight className="w-4 h-4 text-gray-300 group-hover:text-blue-500" />
                                    </TableCell>
                                </TableRow>
                                )
                            })}
                            {filteredShipments.filter(s => s.docType === 'MACHINE').length === 0 && (
                                <TableRow><TableCell colSpan={9} className="text-center py-8 text-gray-500">Kayıt bulunamadı.</TableCell></TableRow>
                            )}
                        </TableBody>
                        </Table>
                    </div>
                </TabsContent>

                {/* 3. SU TANKERİ TABLOSU */}
                <TabsContent value="water" className="m-0">
                    <div className="overflow-x-auto">
                        <Table className="border-collapse border-b border-gray-200">
                        <TableHeader>
                            <TableRow className="bg-gray-100 hover:bg-gray-100 border-b border-gray-300">
                            <TableHead className="h-9 border-r border-gray-300 text-gray-700 font-bold text-xs uppercase w-[100px]">Transfer ID</TableHead>
                            <TableHead className="h-9 border-r border-gray-300 text-gray-700 font-bold text-xs uppercase w-[100px]">Tarih</TableHead>
                            <TableHead className="h-9 border-r border-gray-300 text-gray-700 font-bold text-xs uppercase">Teslim Yeri</TableHead>
                            <TableHead className="h-9 border-r border-gray-300 text-gray-700 font-bold text-xs uppercase w-[150px]">Su Kaynağı</TableHead>
                            <TableHead className="h-9 border-r border-gray-300 text-gray-700 font-bold text-xs uppercase">Değerler</TableHead>
                            <TableHead className="h-9 border-r border-gray-300 text-gray-700 font-bold text-xs uppercase w-[120px]">Plaka</TableHead>
                            <TableHead className="h-9 border-r border-gray-300 text-gray-700 font-bold text-xs uppercase text-right w-[100px]">Miktar (Lt)</TableHead>
                            <TableHead className="h-9 text-gray-700 font-bold text-xs uppercase w-[120px] text-center">Durum</TableHead>
                            <TableHead className="w-[40px]"></TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {filteredShipments.filter(s => s.docType === 'WATER').map((shipment) => {
                                const vehicle = vehicles.find(v => v.id === shipment.vehicleId);
                                return (
                                <TableRow 
                                    key={shipment.id} 
                                    className="hover:bg-blue-50/50 border-b border-gray-200 text-xs cursor-pointer transition-colors group"
                                    onClick={() => handleRowClick(shipment)}
                                >
                                    <TableCell className="border-r border-gray-200 py-2 font-mono text-gray-500">#{shipment.id.substring(0,6).toUpperCase()}</TableCell>
                                    <TableCell className="border-r border-gray-200 py-2 font-medium">{formatDate(shipment.createdAt)}</TableCell>
                                    <TableCell className="border-r border-gray-200 py-2">{getCompanyName(shipment.receiverId)}</TableCell>
                                    <TableCell className="border-r border-gray-200 py-2 font-bold text-cyan-800">{shipment.waterSource}</TableCell>
                                    <TableCell className="border-r border-gray-200 py-2 text-gray-600">pH: {shipment.phLevel} / Cl: {shipment.chlorineLevel}</TableCell>
                                    <TableCell className="border-r border-gray-200 py-2 font-mono font-semibold text-gray-700">{vehicle?.plate || "-"}</TableCell>
                                    <TableCell className="border-r border-gray-200 py-2 text-right font-mono font-medium text-cyan-700">{shipment.amount.toLocaleString("tr-TR")}</TableCell>
                                    <TableCell className="py-2 text-center">
                                    <Badge 
                                        variant="outline"
                                        className={cn("rounded-none px-2 py-0.5 text-[10px] font-normal w-full justify-center",
                                        shipment.status === "DELIVERED" ? "bg-green-600 text-white" :
                                        shipment.status === "ON_WAY" ? "bg-blue-100 text-blue-800" :
                                        shipment.status === "SECURITY_PENDING" ? "bg-yellow-100 text-yellow-800 border-yellow-300" : 
                                        "bg-gray-100 text-gray-600 border-gray-300"
                                        )}
                                    >
                                        {shipment.status === "DELIVERED" ? "TESLİM EDİLDİ" :
                                        shipment.status === "ON_WAY" ? "YOLDA" :
                                        shipment.status === "SECURITY_PENDING" ? "ONAY BEKLİYOR" : "TASLAK"}
                                    </Badge>
                                    </TableCell>
                                    <TableCell>
                                        <ChevronRight className="w-4 h-4 text-gray-300 group-hover:text-blue-500" />
                                    </TableCell>
                                </TableRow>
                                )
                            })}
                            {filteredShipments.filter(s => s.docType === 'WATER').length === 0 && (
                                <TableRow><TableCell colSpan={9} className="text-center py-8 text-gray-500">Kayıt bulunamadı.</TableCell></TableRow>
                            )}
                        </TableBody>
                        </Table>
                    </div>
                </TabsContent>
            </Tabs>
          </CardContent>
        </Card>

        {/* Modallar */}
        <NewShipmentDialog 
          open={isNewShipmentOpen}
          onOpenChange={setIsNewShipmentOpen}
          formData={formData}
          setFormData={setFormData}
          docType={docType}
          setDocType={setDocType}
          onSubmit={handleCreateShipment}
          onPrint={handlePrint}
          config={config}
          // YENİ: Datalist için araç listesini prop olarak geçmemiz gerekebilir
          // Ancak Dialog component bunu useMockData'dan çekebilir.
          // Props olarak geçmiyorsak, Dialog içindeki logic güncellenmeli.
        />

        <ShipmentDetailDialog 
            open={isDetailOpen}
            onOpenChange={setIsDetailOpen}
            shipment={selectedShipment}
        />

        <FilterDialog 
            open={isFilterOpen} 
            onOpenChange={setIsFilterOpen} 
            onApply={setActiveFilters} 
            wasteTypes={wasteTypes}
            showStatusFilter={true}
            initialFilters={activeFilters}
        />
      </div>

      {/* Yazdırma Şablonu (Gizli) */}
      <PrintTemplate 
        formData={formData} 
        docType={docType} 
        config={config} 
      />
    </>
  )
}
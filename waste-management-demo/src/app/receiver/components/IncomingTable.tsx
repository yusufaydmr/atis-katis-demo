"use client";

import { useState } from "react";
import { useMockData } from "@/context/MockDataContext";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Filter, Download, CheckCircle, XCircle, FileText, Eye, ArrowRightLeft, Upload, Info } from "lucide-react";
import { exportToCSV } from "@/lib/utils";
import { FilterDialog, FilterCriteria } from "@/components/FilterDialog"; 
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";

export function IncomingTable() {
  const { shipments, vehicles, wasteTypes, updateShipmentStatus, currentCompanyId } = useMockData();
  const activeReceiverId = currentCompanyId || "comp_receiver_1";

  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [activeFilters, setActiveFilters] = useState<FilterCriteria | null>(null);

  // Dialog ve Dosya State'leri
  const [isConfirmOpen, setIsConfirmOpen] = useState(false);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [receiverDoc, setReceiverDoc] = useState<File | null>(null);

  const getWasteCodeById = (id: string) => wasteTypes.find(w => w.id === id)?.code || id;
  const getWasteNameById = (id: string) => wasteTypes.find(w => w.id === id)?.name || "-";
  
  const formatDate = (dateString: string) => {
    try {
        const d = new Date(dateString)
        return new Intl.DateTimeFormat('tr-TR', { day: '2-digit', month: '2-digit', year: 'numeric' }).format(d)
    } catch { return dateString }
  }

  const isFiltersEmpty = (filters: FilterCriteria | null) => {
      if (!filters) return true;
      return !filters.startDate && !filters.endDate && (filters.wasteTypeId === "ALL");
  }

  const incomingShipments = shipments.filter(s => {
    if (s.receiverId !== activeReceiverId || s.status !== "ON_WAY") return false;
    if (isFiltersEmpty(activeFilters)) return true;
    const itemDate = new Date(s.createdAt).getTime();
    if (activeFilters?.startDate && itemDate < new Date(activeFilters.startDate).getTime()) return false;
    if (activeFilters?.endDate) {
        const end = new Date(activeFilters.endDate);
        end.setHours(23, 59, 59);
        if (itemDate > end.getTime()) return false;
    }
    if (activeFilters?.wasteTypeId && activeFilters.wasteTypeId !== "ALL" && s.wasteTypeId !== activeFilters.wasteTypeId) return false;
    return true;
  });

  const handleDownloadExcel = () => {
    const excelData = incomingShipments.map(s => {
        const vehicle = vehicles.find(v => v.id === s.vehicleId);
        return {
            "Transfer ID": s.id.toUpperCase(),
            "Tarih": formatDate(s.createdAt),
            "Gönderici Firma": s.senderName,
            "Plaka": vehicle?.plate || "-",
            "Sürücü": vehicle?.driverName || "-",
            "Atık Kodu": getWasteCodeById(s.wasteTypeId),
            "Atık Tanımı": getWasteNameById(s.wasteTypeId),
            "Miktar (KG)": s.amount,
            "Durum": "Yolda"
        };
    });
    exportToCSV(excelData, "Gelen_Arac_Listesi");
  };

  const handleOpenConfirm = (id: string) => {
    setSelectedId(id);
    setIsConfirmOpen(true);
    setReceiverDoc(null); // Her yeni açılışta temizle
  };

  const handleFinalAccept = () => {
    if (selectedId && receiverDoc) {
      updateShipmentStatus(selectedId, "DELIVERED");
      setIsConfirmOpen(false);
      setSelectedId(null);
      setReceiverDoc(null);
    }
  };

  const hasActiveFilters = !isFiltersEmpty(activeFilters);

  return (
    <Card className="border shadow-md">
      <CardHeader className="flex flex-row items-center justify-between bg-gray-50/50 border-b py-4">
          <div>
              <CardTitle className="text-lg font-bold text-gray-800">Beklenen Teslimatlar</CardTitle>
              <div className="flex items-center gap-2 mt-1">
                <p className="text-xs text-gray-500">Tesisinize yönlendirilmiş ve yolda olan araçlar.</p>
                {hasActiveFilters && (
                    <Badge variant="secondary" className="text-[10px] h-5 bg-purple-100 text-purple-700 hover:bg-purple-200 gap-1 cursor-pointer select-none" onClick={() => setActiveFilters(null)}>
                        Filtreler Aktif 
                        <XCircle className="w-3 h-3" />
                    </Badge>
                )}
              </div>
          </div>
          <div className="flex gap-2">
              <Button variant={hasActiveFilters ? "default" : "outline"} size="sm" className={hasActiveFilters ? "bg-purple-600 hover:bg-purple-700" : "bg-white"} onClick={() => setIsFilterOpen(true)}>
                  <Filter className="mr-2 h-4 w-4" /> Filtrele
              </Button>
              <Button variant="outline" size="sm" className="bg-white" onClick={handleDownloadExcel}>
                  <Download className="mr-2 h-4 w-4 text-gray-500" /> Excel
              </Button>
          </div>
      </CardHeader>
      
      <FilterDialog open={isFilterOpen} onOpenChange={setIsFilterOpen} onApply={setActiveFilters} wasteTypes={wasteTypes} showStatusFilter={false} initialFilters={activeFilters} />

      <div className="overflow-x-auto">
        <Table className="border-collapse border-b border-gray-200">
          <TableHeader>
            <TableRow className="bg-gray-100 hover:bg-gray-100 border-b border-gray-300">
              <TableHead className="h-9 border-r border-gray-300 text-gray-700 font-bold text-xs uppercase w-[100px]">Transfer ID</TableHead>
              <TableHead className="h-9 border-r border-gray-300 text-gray-700 font-bold text-xs uppercase w-[100px]">Tarih</TableHead>
              <TableHead className="h-9 border-r border-gray-300 text-gray-700 font-bold text-xs uppercase">Gönderici Firma</TableHead>
              <TableHead className="h-9 border-r border-gray-300 text-gray-700 font-bold text-xs uppercase w-[120px]">Araç Plaka</TableHead>
              <TableHead className="h-9 border-r border-gray-300 text-gray-700 font-bold text-xs uppercase w-[100px]">Atık Kodu</TableHead>
              <TableHead className="h-9 border-r border-gray-300 text-gray-700 font-bold text-xs uppercase text-right w-[100px]">Miktar</TableHead>
              <TableHead className="h-9 text-gray-700 font-bold text-xs uppercase w-[140px] text-center">İşlem</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {incomingShipments.length === 0 ? (
              <TableRow><TableCell colSpan={7} className="h-32 text-center text-gray-500">Beklenen araç yok.</TableCell></TableRow>
            ) : (
              incomingShipments.map((s) => {
                 const vehicle = vehicles.find(v => v.id === s.vehicleId);
                 return (
                  <TableRow key={s.id} className="hover:bg-purple-50/50 border-b border-gray-200 text-xs">
                    <TableCell className="border-r border-gray-200 py-2 font-mono text-gray-500">#{s.id.substring(0,6).toUpperCase()}</TableCell>
                    <TableCell className="border-r border-gray-200 py-2 font-medium">{formatDate(s.createdAt)}</TableCell>
                    <TableCell className="border-r border-gray-200 py-2">{s.senderName}</TableCell>
                    <TableCell className="border-r border-gray-200 py-2 font-mono font-semibold text-gray-700">{vehicle?.plate || "-"}</TableCell>
                    <TableCell className="border-r border-gray-200 py-2 font-mono text-purple-700 font-bold">{getWasteCodeById(s.wasteTypeId)}</TableCell>
                    <TableCell className="border-r border-gray-200 py-2 text-right font-mono font-medium text-gray-900">{s.amount.toLocaleString("tr-TR")}</TableCell>
                    <TableCell className="py-2 text-center">
                      <Button size="sm" className="h-6 text-[10px] bg-purple-600 hover:bg-purple-700 w-full" onClick={() => handleOpenConfirm(s.id)}>
                        <CheckCircle className="w-3 h-3 mr-1" /> KABUL İŞLEMİ
                      </Button>
                    </TableCell>
                  </TableRow>
                 )
              })
            )}
          </TableBody>
        </Table>
      </div>

      {/* ÜÇÜNCÜ BELGE EKLEMELİ KESİN KABUL DIALOGU */}
      <Dialog open={isConfirmOpen} onOpenChange={setIsConfirmOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 text-purple-700">
              <CheckCircle className="h-6 w-6" /> Kesin Kabul ve Belge Girişi
            </DialogTitle>
            <DialogDescription>
              Transfer sürecini tamamlamak için kendi kabul dökümanınızı yükleyin.
            </DialogDescription>
          </DialogHeader>

          <div className="grid grid-cols-3 gap-4 py-4">
            {/* 1. Gönderici (Read-only) */}
            <div className="space-y-2 text-center">
              <p className="text-[10px] font-bold text-gray-500 uppercase">Gönderici</p>
              <div className="h-24 bg-gray-50 border rounded-md flex flex-col items-center justify-center opacity-60">
                <FileText className="h-6 w-6 text-gray-400" />
                <span className="text-[9px] mt-1 text-gray-400 font-medium">İmzalı Form</span>
              </div>
            </div>
            
            {/* 2. Güvenlik (Read-only) */}
            <div className="space-y-2 text-center">
              <p className="text-[10px] font-bold text-blue-600 uppercase">Güvenlik</p>
              <div className="h-24 bg-blue-50/30 border border-blue-100 rounded-md flex flex-col items-center justify-center opacity-60">
                <Eye className="h-6 w-6 text-blue-400" />
                <span className="text-[9px] mt-1 text-blue-400 font-medium">Kapı Giriş Kaydı</span>
              </div>
            </div>

            {/* 3. ALICI (ACTION REQUIRED) */}
            <div className="space-y-2 text-center">
              <p className="text-[10px] font-bold text-purple-600 uppercase italic">Sizin Kaydınız*</p>
              <div className={`h-24 border-2 border-dashed rounded-md flex flex-col items-center justify-center transition-all ${receiverDoc ? 'bg-green-50 border-green-500' : 'bg-purple-50/50 border-purple-200'}`}>
                {receiverDoc ? (
                   <>
                    <CheckCircle className="h-6 w-6 text-green-600" />
                    <span className="text-[9px] mt-1 text-green-700 truncate w-full px-1">{receiverDoc.name}</span>
                   </>
                ) : (
                  <>
                    <Upload className="h-6 w-6 text-purple-400" />
                    <label htmlFor="receiver-upload" className="text-[9px] mt-1 text-purple-600 font-bold cursor-pointer hover:underline">DOSYA EKLE</label>
                    <input id="receiver-upload" type="file" className="hidden" onChange={(e) => e.target.files && setReceiverDoc(e.target.files[0])} />
                  </>
                )}
              </div>
            </div>
          </div>

          <div className="bg-slate-100 p-3 rounded flex gap-3 items-center">
            <Info className="h-4 w-4 text-slate-500 shrink-0" />
            <p className="text-[10px] text-slate-600 leading-tight">
              Süreçi tamamlamak için elinizdeki nüshayı tamamen doldurun ve sisteme yükleyiniz.
            </p>
          </div>

          <DialogFooter>
            <Button variant="ghost" size="sm" onClick={() => setIsConfirmOpen(false)}>İptal</Button>
            <Button size="sm" className="bg-purple-600 hover:bg-purple-700" onClick={handleFinalAccept} disabled={!receiverDoc}>
              Süreci Bitir ve Arşive Gönder
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </Card>
  );
}
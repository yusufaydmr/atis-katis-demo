"use client";

import { useState } from "react";
import { useMockData } from "@/context/MockDataContext";
import { Card, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Filter, Download, Plus, ChevronRight, XCircle } from "lucide-react";
import { cn, exportToCSV } from "@/lib/utils"; 
import { Shipment } from "@/app/types";
import { FilterDialog, FilterCriteria } from "@/components/FilterDialog";

interface ShipmentListProps {
  onNewClick: () => void;
  onRowClick: (shipment: Shipment) => void;
}

export function ShipmentList({ onNewClick, onRowClick }: ShipmentListProps) {
  const { shipments, currentCompanyId, companies, vehicles, wasteTypes } = useMockData();
  const activeCompanyId = currentCompanyId || "comp_sender_1";

  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [activeFilters, setActiveFilters] = useState<FilterCriteria | null>(null);

  const getCompanyName = (id: string) => companies.find(c => c.id === id)?.name || id;
  const getWasteCodeById = (id: string) => wasteTypes.find(w => w.id === id)?.code || id;
  const getWasteNameById = (id: string) => wasteTypes.find(w => w.id === id)?.name || "-";
  
  const formatDate = (dateString: string) => {
    try {
      const d = new Date(dateString);
      return new Intl.DateTimeFormat('tr-TR', { day: '2-digit', month: '2-digit', year: 'numeric' }).format(d);
    } catch { return dateString; }
  };

  const isFiltersEmpty = (filters: FilterCriteria | null) => {
      if (!filters) return true;
      return !filters.startDate && !filters.endDate && (filters.status === "ALL" || filters.status === "") && (filters.wasteTypeId === "ALL");
  }

  const filteredShipments = shipments.filter(s => {
    if (s.senderId !== activeCompanyId) return false;
    if (isFiltersEmpty(activeFilters)) return true; // Filtre yoksa hepsini göster

    const itemDate = new Date(s.createdAt).getTime();
    if (activeFilters?.startDate && itemDate < new Date(activeFilters.startDate).getTime()) return false;
    if (activeFilters?.endDate) {
        const end = new Date(activeFilters.endDate);
        end.setHours(23, 59, 59);
        if (itemDate > end.getTime()) return false;
    }
    if (activeFilters?.status && activeFilters.status !== "ALL" && s.status !== activeFilters.status) return false;
    if (activeFilters?.wasteTypeId && activeFilters.wasteTypeId !== "ALL" && s.wasteTypeId !== activeFilters.wasteTypeId) return false;

    return true;
  });

  const handleDownloadExcel = () => {
    const excelData = filteredShipments.map(s => {
        const vehicle = vehicles.find(v => v.id === s.vehicleId);
        return {
            "Transfer ID": s.id.toUpperCase(),
            "Tarih": formatDate(s.createdAt),
            "Alıcı Firma": getCompanyName(s.receiverId),
            "Plaka": vehicle?.plate || "-",
            "Atık Kodu": getWasteCodeById(s.wasteTypeId),
            "Miktar (KG)": s.amount,
            "Durum": s.status
        };
    });
    exportToCSV(excelData, "Gonderilen_Atik_Listesi");
  };

  const handleClearFilters = () => {
      setActiveFilters(null);
  }

  const hasActiveFilters = !isFiltersEmpty(activeFilters);

  return (
    <Card className="border shadow-md">
      <CardHeader className="flex flex-row items-center justify-between bg-gray-50/50 border-b py-4">
        <div>
          <CardTitle className="text-lg font-bold text-gray-800">Atık Transfer Listesi (U-ATOF)</CardTitle>
          <div className="flex items-center gap-2 mt-1">
             <p className="text-xs text-gray-500">Tesisinizden çıkan tüm atık transferlerinin detaylı dökümü.</p>
             {/* GÜNCELLEME: Badge tıklanabilir yapıldı */}
             {hasActiveFilters && (
                 <Badge 
                    variant="secondary" 
                    className="text-[10px] h-5 bg-blue-100 text-blue-700 hover:bg-blue-200 gap-1 cursor-pointer select-none"
                    onClick={handleClearFilters}
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
          <Button onClick={onNewClick} className="bg-blue-700 hover:bg-blue-800 text-white shadow-sm">
            <Plus className="mr-2 h-4 w-4" /> Yeni Belge Oluştur
          </Button>
        </div>
      </CardHeader>
      
      <FilterDialog 
        open={isFilterOpen} 
        onOpenChange={setIsFilterOpen} 
        onApply={setActiveFilters} 
        wasteTypes={wasteTypes}
        showStatusFilter={true}
        initialFilters={activeFilters} // GÜNCELLEME: Prop eklendi
      />

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
              <TableHead className="w-[40px]"></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredShipments.length === 0 ? (
              <TableRow>
                 <TableCell colSpan={10} className="h-24 text-center text-gray-500">
                    {hasActiveFilters ? "Filtreleme kriterlerine uygun kayıt bulunamadı." : "Kayıt bulunamadı."}
                 </TableCell>
              </TableRow>
            ) : (
              filteredShipments.map((shipment) => {
                 const vehicle = vehicles.find(v => v.id === shipment.vehicleId);
                 return (
                  <TableRow 
                    key={shipment.id} 
                    className="hover:bg-blue-50/50 border-b border-gray-200 text-xs cursor-pointer transition-colors group"
                    onClick={() => onRowClick(shipment)}
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
              })
            )}
          </TableBody>
        </Table>
      </div>
    </Card>
  );
}
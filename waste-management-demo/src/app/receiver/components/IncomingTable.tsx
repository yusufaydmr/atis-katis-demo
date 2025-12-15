"use client";

import { useMockData } from "@/context/MockDataContext";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Filter, Download, CheckCircle } from "lucide-react";
import { exportToCSV } from "@/lib/utils";

export function IncomingTable() {
  const { shipments, vehicles, wasteTypes, updateShipmentStatus, companies, currentCompanyId } = useMockData();
  const activeReceiverId = currentCompanyId || "comp_receiver_1";
  const incomingShipments = shipments.filter(s => s.receiverId === activeReceiverId && s.status === "ON_WAY");

  // Helperlar
  const getWasteCodeById = (id: string) => wasteTypes.find(w => w.id === id)?.code || id;
  const getWasteNameById = (id: string) => wasteTypes.find(w => w.id === id)?.name || "-";
  
  const formatDate = (dateString: string) => {
    try {
        const d = new Date(dateString)
        return new Intl.DateTimeFormat('tr-TR', { day: '2-digit', month: '2-digit', year: 'numeric' }).format(d)
    } catch { return dateString }
  }

  // --- EXCEL İNDİRME ---
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
            "Durum": "Yolda (Bekleniyor)"
        };
    });
    exportToCSV(excelData, "Gelen_Arac_Listesi");
  };

  const handleReceive = (id: string) => {
    if(confirm("Bu atık yükünü teslim aldığınızı ve miktarını doğruladığınızı onaylıyor musunuz?")) {
      updateShipmentStatus(id, "DELIVERED");
    }
  };

  return (
    <Card className="border shadow-md">
      <CardHeader className="flex flex-row items-center justify-between bg-gray-50/50 border-b py-4">
          <div>
              <CardTitle className="text-lg font-bold text-gray-800">Beklenen Teslimatlar</CardTitle>
              <p className="text-xs text-gray-500 mt-1">Tesisinize yönlendirilmiş ve yolda olan araçlar.</p>
          </div>
          <div className="flex gap-2">
              <Button variant="outline" size="sm" className="bg-white">
                  <Filter className="mr-2 h-4 w-4 text-gray-500" /> Filtrele
              </Button>
              {/* BUTON BAĞLANDI */}
              <Button variant="outline" size="sm" className="bg-white" onClick={handleDownloadExcel}>
                  <Download className="mr-2 h-4 w-4 text-gray-500" /> Excel
              </Button>
          </div>
      </CardHeader>
      
      <div className="overflow-x-auto">
        <Table className="border-collapse border-b border-gray-200">
          <TableHeader>
            <TableRow className="bg-gray-100 hover:bg-gray-100 border-b border-gray-300">
              <TableHead className="h-9 border-r border-gray-300 text-gray-700 font-bold text-xs uppercase w-[100px]">Transfer ID</TableHead>
              <TableHead className="h-9 border-r border-gray-300 text-gray-700 font-bold text-xs uppercase w-[100px]">Tarih</TableHead>
              <TableHead className="h-9 border-r border-gray-300 text-gray-700 font-bold text-xs uppercase">Gönderici Firma</TableHead>
              <TableHead className="h-9 border-r border-gray-300 text-gray-700 font-bold text-xs uppercase w-[120px]">Araç Plaka</TableHead>
              <TableHead className="h-9 border-r border-gray-300 text-gray-700 font-bold text-xs uppercase">Sürücü</TableHead>
              <TableHead className="h-9 border-r border-gray-300 text-gray-700 font-bold text-xs uppercase w-[100px]">Atık Kodu</TableHead>
              <TableHead className="h-9 border-r border-gray-300 text-gray-700 font-bold text-xs uppercase">Atık Tanımı</TableHead>
              <TableHead className="h-9 border-r border-gray-300 text-gray-700 font-bold text-xs uppercase text-right w-[100px]">Miktar</TableHead>
              <TableHead className="h-9 text-gray-700 font-bold text-xs uppercase w-[140px] text-center">İşlem</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {incomingShipments.length === 0 ? (
              <TableRow>
                <TableCell colSpan={9} className="h-32 text-center text-gray-500">
                  Şu anda size gelmekte olan bir araç yok.
                </TableCell>
              </TableRow>
            ) : (
              incomingShipments.map((s) => {
                 const vehicle = vehicles.find(v => v.id === s.vehicleId);
                 return (
                  <TableRow key={s.id} className="hover:bg-purple-50/50 border-b border-gray-200 text-xs">
                    <TableCell className="border-r border-gray-200 py-2 font-mono text-gray-500">#{s.id.substring(0,6).toUpperCase()}</TableCell>
                    <TableCell className="border-r border-gray-200 py-2 font-medium">{formatDate(s.createdAt)}</TableCell>
                    <TableCell className="border-r border-gray-200 py-2">{s.senderName}</TableCell>
                    <TableCell className="border-r border-gray-200 py-2 font-mono font-semibold text-gray-700">{vehicle?.plate || "-"}</TableCell>
                    <TableCell className="border-r border-gray-200 py-2 text-gray-600">{vehicle?.driverName || "-"}</TableCell>
                    <TableCell className="border-r border-gray-200 py-2 font-mono text-purple-700 font-bold">{getWasteCodeById(s.wasteTypeId)}</TableCell>
                    <TableCell className="border-r border-gray-200 py-2 text-gray-600 truncate max-w-[150px]" title={getWasteNameById(s.wasteTypeId)}>{getWasteNameById(s.wasteTypeId)}</TableCell>
                    <TableCell className="border-r border-gray-200 py-2 text-right font-mono font-medium text-gray-900">{s.amount.toLocaleString("tr-TR")}</TableCell>
                    <TableCell className="py-2 text-center">
                      <Button 
                          size="sm" 
                          className="h-6 text-[10px] bg-purple-600 hover:bg-purple-700 w-full" 
                          onClick={() => handleReceive(s.id)}
                      >
                        <CheckCircle className="w-3 h-3 mr-1" /> TESLİM AL
                      </Button>
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
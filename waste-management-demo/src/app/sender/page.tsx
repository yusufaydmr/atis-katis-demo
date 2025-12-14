"use client"

import { useState } from "react"
import { useMockData } from "@/context/MockDataContext"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
// Excel tarzı tablo için UI bileşenlerini kullanmaya devam ediyoruz ama stilleri özelleştireceğiz
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
import { Plus, Truck, FileText, Download, Filter } from "lucide-react"
import { cn } from "@/lib/utils"
import { Shipment } from "@/app/types"

// --- EXCEL HÜCRE BİLEŞENİ (Form İçin) ---
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
    <div className={cn("w-full px-3 py-1.5 text-[11px] font-bold uppercase tracking-wide border-b border-gray-100", headerClass)}>
      {label}
    </div>
    <div className="flex-1 flex items-center px-3 py-2">
      {children}
    </div>
  </div>
)

export default function SenderPage() {
  const { shipments, addShipment, companies, wasteTypes, vehicles, currentCompanyId } = useMockData()
  const [isNewShipmentOpen, setIsNewShipmentOpen] = useState(false)
  
  // Form State
  const [newShipment, setNewShipment] = useState({
    receiverId: "",
    transporterId: "", 
    vehiclePlate: "",
    driverName: "",
    wasteCode: "",
    amount: "",
    plannedDate: new Date().toISOString().split('T')[0],
  })

  const selectedWaste = wasteTypes.find(w => w.code === newShipment.wasteCode)

  const handleCreateShipment = () => {
    if (!newShipment.receiverId || !newShipment.wasteCode || !newShipment.amount) return

    const matchedVehicle = vehicles.find(v => v.plate === newShipment.vehiclePlate)
    const vehicleIdToUse = matchedVehicle ? matchedVehicle.id : (vehicles[0]?.id || "v1")
    const wasteTypeIdToUse = selectedWaste ? selectedWaste.id : (wasteTypes[0]?.id || "w1")

    const shipmentData: Shipment = {
      id: Math.random().toString(36).substr(2, 9).toUpperCase(),
      senderId: currentCompanyId || "1",
      receiverId: newShipment.receiverId,
      senderName: companies.find(c => c.id === (currentCompanyId || "1"))?.name || "Gönderen",
      receiverName: companies.find(c => c.id === newShipment.receiverId)?.name || "Alıcı",
      wasteTypeId: wasteTypeIdToUse,
      amount: Number(newShipment.amount),
      vehicleId: vehicleIdToUse,
      status: "CREATED",
      createdAt: new Date(newShipment.plannedDate).toISOString(),
    }

    addShipment(shipmentData)
    setIsNewShipmentOpen(false)
    
    setNewShipment({
      receiverId: "",
      transporterId: "",
      vehiclePlate: "",
      driverName: "",
      wasteCode: "",
      amount: "",
      plannedDate: new Date().toISOString().split('T')[0],
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
            <CardTitle className="text-lg font-bold text-gray-800">Atık Transfer Listesi</CardTitle>
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
                  <Plus className="mr-2 h-4 w-4" /> Yeni Transfer
                </Button>
              </DialogTrigger>
              
              {/* Modal İçeriği (Form aynı kaldı, sadece context'ten veri alıyor) */}
              <DialogContent className="sm:max-w-[90vw] p-0 gap-0 overflow-hidden bg-gray-50">
                <DialogHeader className="px-6 py-4 bg-white border-b border-gray-200">
                  <DialogTitle className="flex items-center gap-2 text-xl text-blue-900">
                    <FileText className="h-5 w-5" />
                    Yeni Atık Transfer Formu (U-ATOF)
                  </DialogTitle>
                  <p className="text-sm text-gray-500">Ulusal Atık Taşıma Formu standartlarına uygun çıkış kaydı.</p>
                </DialogHeader>

                <div className="p-6">
                  <div className="bg-white border border-gray-300 rounded-sm shadow-sm overflow-hidden">
                    {/* BÖLÜM A */}
                    <div className="grid grid-cols-3 border-b border-gray-300">
                      <ExcelCell label="GÖNDEREN FİRMA (SİZ)" headerClass="bg-blue-50 text-blue-700">
                        <div className="text-sm font-medium text-gray-900 pl-1">
                          {companies.find(c => c.id === currentCompanyId)?.name || "Firma Seçilmedi"}
                        </div>
                      </ExcelCell>
                      <ExcelCell label="TAŞIYICI FİRMA" headerClass="bg-blue-50 text-blue-700">
                        <Select 
                          value={newShipment.transporterId} 
                          onValueChange={(val) => setNewShipment(s => ({ ...s, transporterId: val }))}
                        >
                          <SelectTrigger className="border-0 shadow-none focus:ring-0 px-0 h-auto text-sm font-medium text-gray-900 bg-transparent">
                            <SelectValue placeholder="Seçiniz..." />
                          </SelectTrigger>
                          <SelectContent>
                            {companies.map(c => (
                              <SelectItem key={c.id} value={c.id}>{c.name}</SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </ExcelCell>
                      <ExcelCell label="ALICI FİRMA" headerClass="bg-blue-50 text-blue-700">
                        <Select 
                          value={newShipment.receiverId} 
                          onValueChange={(val) => setNewShipment(s => ({ ...s, receiverId: val }))}
                        >
                          <SelectTrigger className="border-0 shadow-none focus:ring-0 px-0 h-auto text-sm font-medium text-gray-900 bg-transparent">
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

                    {/* BÖLÜM B */}
                    <div className="grid grid-cols-4 border-b border-gray-300">
                      <ExcelCell label="PLANLANAN SEFER TARİHİ" headerClass="bg-red-50 text-red-700">
                        <Input 
                          type="date"
                          value={newShipment.plannedDate}
                          onChange={(e) => setNewShipment(s => ({ ...s, plannedDate: e.target.value }))}
                          className="border-0 shadow-none focus-visible:ring-0 px-0 h-auto text-gray-900 bg-transparent w-full font-medium"
                        />
                      </ExcelCell>
                      <ExcelCell label="ARAÇ PLAKASI" headerClass="bg-red-50 text-red-700">
                        <Select 
                          value={newShipment.vehiclePlate}
                          onValueChange={(val) => {
                            const vehicle = vehicles.find(v => v.plate === val)
                            setNewShipment(s => ({ 
                              ...s, 
                              vehiclePlate: val,
                              driverName: vehicle?.driverName || s.driverName 
                            }))
                          }}
                        >
                          <SelectTrigger className="border-0 shadow-none focus:ring-0 px-0 h-auto font-mono font-bold text-gray-900 bg-transparent">
                            <SelectValue placeholder="Araç Seçiniz" />
                          </SelectTrigger>
                          <SelectContent>
                            {vehicles.map(v => (
                              <SelectItem key={v.id} value={v.plate}>{v.plate}</SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </ExcelCell>
                      <ExcelCell label="SÜRÜCÜ ADI SOYADI" headerClass="bg-red-50 text-red-700">
                        <Input 
                          placeholder="İsim Giriniz" 
                          value={newShipment.driverName}
                          onChange={(e) => setNewShipment(s => ({ ...s, driverName: e.target.value }))}
                          className="border-0 shadow-none focus-visible:ring-0 px-0 h-auto text-gray-900 placeholder:text-gray-300"
                        />
                      </ExcelCell>
                      <ExcelCell label="SEFER TÜRÜ" headerClass="bg-red-50 text-red-700">
                         <span className="text-gray-400 text-sm italic">Tek Yön / Standart</span>
                      </ExcelCell>
                    </div>

                    {/* BÖLÜM C */}
                    <div className="flex w-full border-b border-gray-300 min-h-[70px]">
                      <div className="w-[15%]">
                        <ExcelCell label="ATIK KODU" headerClass="bg-green-50 text-green-700">
                          <Select 
                            value={newShipment.wasteCode} 
                            onValueChange={(val) => setNewShipment(s => ({ ...s, wasteCode: val }))}
                          >
                            <SelectTrigger className="border-0 shadow-none focus:ring-0 px-0 h-auto font-mono font-bold text-gray-900 bg-transparent">
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
                      <div className="w-[45%]">
                        <ExcelCell label="ATIK TANIMI" headerClass="bg-green-50 text-green-700">
                          <div className="text-sm text-gray-700 py-1">
                            {selectedWaste ? selectedWaste.name : "Atık kodu seçildiğinde otomatik gelir..."}
                          </div>
                        </ExcelCell>
                      </div>
                      <div className="w-[25%]">
                        <ExcelCell label="MİKTAR (NET)" headerClass="bg-green-50 text-green-700">
                          <Input 
                            type="number"
                            placeholder="0.00" 
                            value={newShipment.amount}
                            onChange={(e) => setNewShipment(s => ({ ...s, amount: e.target.value }))}
                            className="border-0 shadow-none focus-visible:ring-0 px-0 h-auto text-right font-bold text-lg text-gray-900 placeholder:text-gray-200"
                          />
                        </ExcelCell>
                      </div>
                      <div className="flex-1">
                        <ExcelCell label="BİRİM" headerClass="bg-green-50 text-green-700">
                           <span className="text-sm font-medium text-gray-900">KG</span>
                        </ExcelCell>
                      </div>
                    </div>
                  </div>
                  
                  <div className="mt-4 flex items-start gap-2 text-xs text-gray-500">
                      <div className="w-4 h-4 mt-0.5 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center font-bold">i</div>
                      <p>Kaydet butonuna bastığınızda alıcı ve taşıyıcı firmaya otomatik bildirim gönderilecektir.</p>
                  </div>
                </div>

                <DialogFooter className="px-6 py-4 bg-gray-50 border-t border-gray-200 sm:justify-between">
                  <Button variant="outline" onClick={() => setIsNewShipmentOpen(false)} className="border-gray-300 text-gray-700">
                    Vazgeç
                  </Button>
                  <div className="flex gap-2">
                      <Button variant="secondary" className="bg-white border border-gray-300 text-gray-700 hover:bg-gray-50">
                          Taslak Olarak Kaydet
                      </Button>
                      <Button onClick={handleCreateShipment} className="bg-blue-600 hover:bg-blue-700 px-8">
                          Transferi Başlat
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
                  <TableHead className="h-9 border-r border-gray-300 text-gray-700 font-bold text-xs uppercase text-right w-[100px]">Miktar (kg)</TableHead>
                  <TableHead className="h-9 text-gray-700 font-bold text-xs uppercase w-[120px] text-center">Durum</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {shipments.filter(s => s.senderId === currentCompanyId).map((shipment) => {
                   const vehicle = vehicles.find(v => v.id === shipment.vehicleId);
                   return (
                    <TableRow key={shipment.id} className="hover:bg-blue-50/50 border-b border-gray-200 text-xs">
                      {/* ID */}
                      <TableCell className="border-r border-gray-200 py-2 font-mono text-gray-500">
                        #{shipment.id.substring(0,6).toUpperCase()}
                      </TableCell>
                      
                      {/* Tarih */}
                      <TableCell className="border-r border-gray-200 py-2 font-medium">
                        {formatDate(shipment.createdAt)}
                      </TableCell>
                      
                      {/* Alıcı */}
                      <TableCell className="border-r border-gray-200 py-2">
                        {getCompanyName(shipment.receiverId)}
                      </TableCell>
                      
                      {/* Plaka */}
                      <TableCell className="border-r border-gray-200 py-2 font-mono font-semibold text-gray-700">
                        {vehicle?.plate || "-"}
                      </TableCell>

                      {/* Sürücü (YENİ SÜTUN) */}
                      <TableCell className="border-r border-gray-200 py-2 text-gray-600">
                         {vehicle?.driverName || "-"}
                      </TableCell>

                      {/* Atık Kodu */}
                      <TableCell className="border-r border-gray-200 py-2 font-mono text-blue-700 font-bold">
                        {getWasteCodeById(shipment.wasteTypeId)}
                      </TableCell>

                      {/* Atık Tanımı (YENİ SÜTUN) */}
                      <TableCell className="border-r border-gray-200 py-2 text-gray-600 truncate max-w-[150px]" title={getWasteNameById(shipment.wasteTypeId)}>
                        {getWasteNameById(shipment.wasteTypeId)}
                      </TableCell>

                      {/* Miktar */}
                      <TableCell className="border-r border-gray-200 py-2 text-right font-mono font-medium text-gray-900">
                        {shipment.amount.toLocaleString("tr-TR")}
                      </TableCell>

                      {/* Durum */}
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
                            "bg-yellow-50 text-yellow-800 border-yellow-300"
                          )}
                        >
                           {shipment.status === "DELIVERED" ? "TESLİM EDİLDİ" :
                           shipment.status === "ON_WAY" ? "YOLDA" :
                           shipment.status === "SECURITY_PENDING" ? "ONAY BEKLİYOR" : "OLUŞTURULDU"}
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
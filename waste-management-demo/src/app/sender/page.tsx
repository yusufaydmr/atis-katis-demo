"use client"

import { useState } from "react"
import { useMockData } from "@/context/MockDataContext"
import { Shipment } from "@/app/types"
import { Tractor, Droplets, FileText } from "lucide-react"

// Bileşenler
import { SenderStats } from "./components/SenderStats"
import { ShipmentList } from "./components/ShipmentList"
import { NewShipmentDialog } from "./components/NewShipmentDialog"
import { PrintTemplate } from "./components/PrintTemplate"
import { ShipmentDetailDialog } from "./components/ShipmentDetailDialog"
import { MonthlyTrendChart } from "@/components/charts/MonthlyTrendChart" // Grafik importu

export type DocType = 'WASTE' | 'MACHINE' | 'WATER';

export default function SenderPage() {
  // DÜZELTME: 'shipments' buraya eklendi
  const { addShipment, companies, wasteTypes, vehicles, currentCompanyId, shipments } = useMockData()
  
  // Modallar için State
  const [isNewShipmentOpen, setIsNewShipmentOpen] = useState(false)
  const [isDetailOpen, setIsDetailOpen] = useState(false)
  const [selectedShipment, setSelectedShipment] = useState<Shipment | null>(null)
  
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
    machineName: "",
    workDescription: "",
    workHours: "",
    waterSource: "",
    chlorineLevel: "",
    phLevel: ""
  })

  const selectedWaste = wasteTypes.find(w => w.code === formData.wasteCode)

  const handleCreateShipment = (isDraft: boolean = false) => {
    if (!isDraft && (!formData.receiverId || !formData.amount)) {
        alert("Lütfen zorunlu alanları doldurunuz.");
        return;
    }

    const matchedVehicle = vehicles.find(v => v.plate === formData.vehiclePlate)
    const vehicleIdToUse = matchedVehicle ? matchedVehicle.id : (vehicles[0]?.id || "v1")
    
    let wasteTypeIdToUse = "w1"; 
    if (docType === 'WASTE' && selectedWaste) wasteTypeIdToUse = selectedWaste.id;

    // Fix: currentCompanyId yoksa default kullan
    const activeCompanyId = currentCompanyId || "comp_sender_1";

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

  // Listeden satıra tıklandığında çalışacak
  const handleRowClick = (shipment: Shipment) => {
    setSelectedShipment(shipment);
    setIsDetailOpen(true);
  }

  const handlePrint = () => {
    window.print();
  }

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
              data={shipments.filter(s => s.senderId === (currentCompanyId || "comp_sender_1"))} 
           />
        </div>

        {/* Liste - onRowClick prop'u eklendi */}
        <ShipmentList 
            onNewClick={() => setIsNewShipmentOpen(true)} 
            onRowClick={handleRowClick}
        />

        {/* Yeni Kayıt Dialog */}
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
        />

        {/* Detay & Timeline Dialog */}
        <ShipmentDetailDialog 
            open={isDetailOpen}
            onOpenChange={setIsDetailOpen}
            shipment={selectedShipment}
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
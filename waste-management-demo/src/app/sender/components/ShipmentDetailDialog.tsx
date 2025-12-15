"use client";

import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Shipment } from "@/app/types";
import { useMockData } from "@/context/MockDataContext";
import { Check, Clock, Truck, ShieldCheck, MapPin } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";

interface ShipmentDetailDialogProps {
  shipment: Shipment | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function ShipmentDetailDialog({ shipment, open, onOpenChange }: ShipmentDetailDialogProps) {
  const { wasteTypes, vehicles, companies } = useMockData();

  if (!shipment) return null;

  const waste = wasteTypes.find(w => w.id === shipment.wasteTypeId);
  const vehicle = vehicles.find(v => v.id === shipment.vehicleId);
  const receiver = companies.find(c => c.id === shipment.receiverId);

  // --- TIMELINE MANTIĞI ---
  const steps = [
    { id: "CREATED", label: "Oluşturuldu", icon: <Clock className="w-4 h-4" /> },
    { id: "SECURITY_PENDING", label: "Güvenlik Onayı", icon: <ShieldCheck className="w-4 h-4" /> },
    { id: "ON_WAY", label: "Yolda", icon: <Truck className="w-4 h-4" /> },
    { id: "DELIVERED", label: "Teslim Edildi", icon: <MapPin className="w-4 h-4" /> },
  ];

  // Aktif adımın indexini bul
  const currentStepIndex = steps.findIndex(s => s.id === shipment.status);
  // Eğer status listede yoksa (örn: iptal) varsayılan 0
  const activeIndex = currentStepIndex === -1 ? 0 : currentStepIndex;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-3xl">
        <DialogHeader>
            <div className="flex justify-between items-start">
                <div>
                    <DialogTitle className="text-xl font-bold">Transfer Detayı</DialogTitle>
                    <p className="text-sm text-gray-500">ID: #{shipment.id.toUpperCase()}</p>
                </div>
                <div className="text-right">
                    <p className="text-sm font-medium">{new Date(shipment.createdAt).toLocaleDateString("tr-TR")}</p>
                    <p className="text-xs text-gray-400">{new Date(shipment.createdAt).toLocaleTimeString("tr-TR")}</p>
                </div>
            </div>
        </DialogHeader>

        {/* --- TIMELINE (GÖRSEL ZAMAN ÇİZELGESİ) --- */}
        <div className="py-6 px-2">
            <div className="relative flex items-center justify-between w-full">
                {/* Arka plan çizgisi */}
                <div className="absolute left-0 top-1/2 transform -translate-y-1/2 w-full h-1 bg-gray-200 -z-10" />
                
                {/* İlerleme çizgisi (Yeşil) */}
                <div 
                    className="absolute left-0 top-1/2 transform -translate-y-1/2 h-1 bg-green-500 -z-10 transition-all duration-500" 
                    style={{ width: `${(activeIndex / (steps.length - 1)) * 100}%` }}
                />

                {steps.map((step, index) => {
                    const isCompleted = index <= activeIndex;
                    const isCurrent = index === activeIndex;

                    return (
                        <div key={step.id} className="flex flex-col items-center gap-2 bg-white px-2">
                            <div className={cn(
                                "w-10 h-10 rounded-full flex items-center justify-center border-2 transition-all duration-300",
                                isCompleted ? "bg-green-100 border-green-500 text-green-600" : "bg-white border-gray-300 text-gray-300",
                                isCurrent && "ring-4 ring-green-100 scale-110"
                            )}>
                                {isCompleted ? (isCurrent ? step.icon : <Check className="w-5 h-5" />) : step.icon}
                            </div>
                            <span className={cn(
                                "text-xs font-medium whitespace-nowrap",
                                isCompleted ? "text-green-700" : "text-gray-400"
                            )}>
                                {step.label}
                            </span>
                        </div>
                    )
                })}
            </div>
        </div>

        {/* --- DETAY BİLGİLERİ --- */}
        <div className="grid grid-cols-2 gap-6 bg-gray-50 p-6 rounded-lg border border-gray-200 mt-2">
            <div className="space-y-4">
                <div className="space-y-1">
                    <span className="text-xs font-bold text-gray-400 uppercase">Alıcı Firma</span>
                    <p className="font-medium text-gray-900">{receiver?.name || "-"}</p>
                </div>
                <div className="space-y-1">
                    <span className="text-xs font-bold text-gray-400 uppercase">Araç Bilgisi</span>
                    <div className="flex items-center gap-2">
                        <Truck className="w-4 h-4 text-gray-500" />
                        <span className="font-mono font-bold text-gray-900">{vehicle?.plate}</span>
                    </div>
                    <p className="text-xs text-gray-500">{vehicle?.driverName}</p>
                </div>
            </div>

            <div className="space-y-4">
                 <div className="space-y-1">
                    <span className="text-xs font-bold text-gray-400 uppercase">Atık & Miktar</span>
                    <div className="flex items-center gap-2">
                        <span className="font-mono bg-blue-100 text-blue-700 px-2 py-0.5 rounded text-xs font-bold">{waste?.code}</span>
                        <span className="text-sm text-gray-700 truncate">{waste?.name}</span>
                    </div>
                    <p className="text-xl font-bold text-gray-900 mt-1">{shipment.amount.toLocaleString()} <span className="text-sm font-normal text-gray-500">kg</span></p>
                </div>
                 <div className="space-y-1">
                    <span className="text-xs font-bold text-gray-400 uppercase">Güncel Durum</span>
                    <p className="text-sm text-gray-700">
                        {shipment.status === "SECURITY_PENDING" && "Araç henüz tesisten çıkış yapmadı. Güvenlik biriminde kontrol bekliyor."}
                        {shipment.status === "ON_WAY" && "Araç tesisten çıkış yaptı ve alıcı firmaya doğru yolda."}
                        {shipment.status === "DELIVERED" && "Teslimat başarıyla tamamlandı."}
                        {shipment.status === "CREATED" && "Belge oluşturuldu, henüz işleme alınmadı."}
                    </p>
                </div>
            </div>
        </div>

        <div className="flex justify-end gap-2 mt-4">
             <Button variant="outline" onClick={() => onOpenChange(false)}>Kapat</Button>
             <Button>Yazdır</Button>
        </div>

      </DialogContent>
    </Dialog>
  );
}
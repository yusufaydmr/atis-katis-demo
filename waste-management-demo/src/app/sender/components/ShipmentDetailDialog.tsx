/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useState } from "react"; // Link kopyalama durumu için eklendi
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Shipment } from "@/app/types";
import { useMockData } from "@/context/MockDataContext";
import { Check, Clock, Truck, ShieldCheck, MapPin, Link, Copy, Send, CheckCircle2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";

interface ShipmentDetailDialogProps {
  shipment: Shipment | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function ShipmentDetailDialog({ shipment, open, onOpenChange }: ShipmentDetailDialogProps) {
  const { wasteTypes, vehicles, companies } = useMockData();
  const [copied, setCopied] = useState(false);

  if (!shipment) return null;

  const waste = wasteTypes.find(w => w.id === shipment.wasteTypeId);
  const vehicle = vehicles.find(v => v.id === shipment.vehicleId);
  const receiver = companies.find(c => c.id === shipment.receiverId);

  // Magic Link Oluşturma (Mock)
  const magicLink = `https://atis-katis.app/access/${shipment.id}`;

  const handleCopyLink = () => {
    navigator.clipboard.writeText(magicLink);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const steps = [
    { id: "CREATED", label: "Oluşturuldu", icon: <Clock className="w-4 h-4" /> },
    { id: "SECURITY_PENDING", label: "Güvenlik Onayı", icon: <ShieldCheck className="w-4 h-4" /> },
    { id: "ON_WAY", label: "Yolda", icon: <Truck className="w-4 h-4" /> },
    { id: "DELIVERED", label: "Teslim Edildi", icon: <MapPin className="w-4 h-4" /> },
  ];

  const currentStepIndex = steps.findIndex(s => s.id === shipment.status);
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

        {/* --- MAGIC LINK SECTION (YENİ) --- */}
        <div className="bg-blue-50 border border-blue-100 rounded-lg p-4 mt-2 mb-4">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-2">
              <div className="p-1.5 bg-blue-600 rounded-md">
                <Link className="w-4 h-4 text-white" />
              </div>
              <span className="text-sm font-bold text-blue-900 uppercase tracking-tight">Erişim Bağlantısı (Magic Link)</span>
            </div>
            <Badge variant="outline" className="bg-blue-100 text-blue-700 border-blue-200 text-[10px]">Harici Erişim Aktif</Badge>
          </div>
          <p className="text-[11px] text-blue-700 mb-3">Bu linki alıcıya veya ilgili birime göndererek, sisteme giriş yapmadan belgeyi doldurmasını sağlayabilirsiniz.</p>
          
          <div className="flex gap-2">
            <div className="flex-1 bg-white border border-blue-200 rounded-md px-3 py-2 text-xs font-mono text-blue-800 truncate flex items-center">
              {magicLink}
            </div>
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button size="sm" variant="secondary" className="bg-white border-blue-200 text-blue-700 hover:bg-blue-50 shrink-0" onClick={handleCopyLink}>
                    {copied ? <CheckCircle2 className="w-4 h-4 text-green-600" /> : <Copy className="w-4 h-4" />}
                  </Button>
                </TooltipTrigger>
                <TooltipContent>{copied ? "Kopyalandı!" : "Linki Kopyala"}</TooltipContent>
              </Tooltip>
            </TooltipProvider>

            <Button size="sm" className="bg-blue-600 hover:bg-blue-700 text-white gap-2">
              <Send className="w-4 h-4" />
              Paylaş
            </Button>
          </div>
        </div>

        {/* --- TIMELINE --- */}
        <div className="py-6 px-2">
          <div className="relative flex items-center justify-between w-full">
            <div className="absolute left-0 top-1/2 transform -translate-y-1/2 w-full h-1 bg-gray-200 -z-10" />
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
                  <span className={cn("text-xs font-medium", isCompleted ? "text-green-700" : "text-gray-400")}>{step.label}</span>
                </div>
              )
            })}
          </div>
        </div>

        {/* --- DETAY BİLGİLERİ --- */}
        <div className="grid grid-cols-2 gap-6 bg-gray-50 p-6 rounded-lg border border-gray-200">
           {/* ... Mevcut detay içeriğin ... */}
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
                <p className="text-[11px] text-gray-700 leading-tight">
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
          <Button variant="outline" className="border-blue-200 text-blue-700">
             Belgeyi Gör
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}

// Yardımcı Badge Bileşeni (shadcn içinde yoksa diye basit hali)
function Badge({ children, className, variant }: any) {
  return (
    <span className={cn("px-2 py-0.5 rounded-full border text-[10px] font-bold", className)}>
      {children}
    </span>
  );
}
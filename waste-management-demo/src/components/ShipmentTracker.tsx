import { Check, Truck, ShieldCheck, MapPin } from "lucide-react";
import { cn } from "@/lib/utils";
import { ShipmentStatus } from "@/app/types";

interface ShipmentTrackerProps {
  status: ShipmentStatus;
}

export function ShipmentTracker({ status }: ShipmentTrackerProps) {
  // Adımları ve sırasını tanımlayalım
  const steps = [
    { id: "CREATED", label: "Oluşturuldu", icon: MapPin },
    { id: "SECURITY_PENDING", label: "Güvenlik Kontrol", icon: ShieldCheck },
    { id: "ON_WAY", label: "Yolda", icon: Truck },
    { id: "DELIVERED", label: "Teslim Edildi", icon: Check },
  ];

  // Mevcut statünün indexini bulalım (İlerleme çubuğu için)
  const currentIndex = steps.findIndex((s) => s.id === status);

  return (
    <div className="w-full py-4">
      <div className="relative flex items-center justify-between w-full">
        {/* Arka plandaki gri çizgi */}
        <div className="absolute left-0 top-1/2 -translate-y-1/2 w-full h-1 bg-gray-200 -z-10" />
        
        {/* İlerleme çizgisi (Yeşil) */}
        <div 
          className="absolute left-0 top-1/2 -translate-y-1/2 h-1 bg-green-600 -z-10 transition-all duration-500"
          style={{ width: `${(currentIndex / (steps.length - 1)) * 100}%` }}
        />

        {steps.map((step, index) => {
          const isCompleted = index <= currentIndex;
          const isCurrent = index === currentIndex;
          
          return (
            <div key={step.id} className="flex flex-col items-center gap-2 bg-white px-2">
              <div
                className={cn(
                  "w-10 h-10 rounded-full flex items-center justify-center border-2 transition-all duration-300",
                  isCompleted ? "bg-green-600 border-green-600 text-white" : "bg-white border-gray-300 text-gray-300",
                  isCurrent && "ring-4 ring-green-100 scale-110"
                )}
              >
                <step.icon className="w-5 h-5" />
              </div>
              <span className={cn(
                "text-xs font-medium transition-colors",
                isCompleted ? "text-green-700" : "text-gray-400"
              )}>
                {step.label}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}
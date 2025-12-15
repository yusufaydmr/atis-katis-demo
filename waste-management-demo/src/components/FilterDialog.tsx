"use client";

import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { WasteType, ShipmentStatus } from "@/app/types";
import { X, Filter } from "lucide-react";

export interface FilterCriteria {
  startDate: string;
  endDate: string;
  status: ShipmentStatus | "ALL" | "";
  wasteTypeId: string | "ALL";
}

interface FilterDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onApply: (filters: FilterCriteria) => void;
  wasteTypes: WasteType[];
  initialFilters: FilterCriteria | null;
  showStatusFilter?: boolean; 
}

export function FilterDialog({ 
  open, 
  onOpenChange, 
  onApply, 
  wasteTypes,
  initialFilters,
  showStatusFilter = true 
}: FilterDialogProps) {
  
  const defaultFilters: FilterCriteria = { startDate: "", endDate: "", status: "ALL", wasteTypeId: "ALL" };
  const [filters, setFilters] = useState<FilterCriteria>(defaultFilters);

  useEffect(() => {
    if (open) {
      if (initialFilters) {
        setFilters(initialFilters);
      } else {
        setFilters(defaultFilters);
      }
    }
  }, [open, initialFilters]);

  const handleClear = () => {
    setFilters(defaultFilters);
    onApply(defaultFilters); // Temizle ve kapatma, sonuçları göster
    // İsteğe bağlı: onOpenChange(false); // Kullanıcı temizleyip kapatmak isterse
  };

  const handleApply = () => {
    onApply(filters);
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Filter className="w-5 h-5" />
            Detaylı Filtreleme
          </DialogTitle>
        </DialogHeader>
        
        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="grid gap-2">
              <Label>Başlangıç Tarihi</Label>
              <Input type="date" value={filters.startDate} onChange={(e) => setFilters({...filters, startDate: e.target.value})} />
            </div>
            <div className="grid gap-2">
              <Label>Bitiş Tarihi</Label>
              <Input type="date" value={filters.endDate} onChange={(e) => setFilters({...filters, endDate: e.target.value})} />
            </div>
          </div>

          {showStatusFilter && (
            <div className="grid gap-2">
              <Label>Transfer Durumu</Label>
              <Select value={filters.status} onValueChange={(val: any) => setFilters({...filters, status: val})}>
                <SelectTrigger><SelectValue placeholder="Tümü" /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="ALL">Tümü</SelectItem>
                  <SelectItem value="CREATED">Taslak / Oluşturuldu</SelectItem>
                  <SelectItem value="SECURITY_PENDING">Güvenlik Onayı Bekleyen</SelectItem>
                  <SelectItem value="ON_WAY">Yolda</SelectItem>
                  <SelectItem value="DELIVERED">Teslim Edildi</SelectItem>
                </SelectContent>
              </Select>
            </div>
          )}

          <div className="grid gap-2">
            <Label>Atık Türü</Label>
            <Select value={filters.wasteTypeId} onValueChange={(val) => setFilters({...filters, wasteTypeId: val})}>
              <SelectTrigger><SelectValue placeholder="Tümü" /></SelectTrigger>
              <SelectContent>
                <SelectItem value="ALL">Tümü</SelectItem>
                {wasteTypes.map((w) => (<SelectItem key={w.id} value={w.id}>{w.code} - {w.name}</SelectItem>))}
              </SelectContent>
            </Select>
          </div>
        </div>

        <DialogFooter className="flex justify-between sm:justify-between">
          <Button variant="ghost" onClick={handleClear} className="text-red-500 hover:text-red-700 hover:bg-red-50">
            <X className="w-4 h-4 mr-2" /> Temizle
          </Button>
          <Button onClick={handleApply}>Sonuçları Göster</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
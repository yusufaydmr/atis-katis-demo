"use client";

import React, { createContext, useContext, useState, ReactNode } from "react";
import { Role, Shipment, Vehicle, WasteType, ShipmentStatus, Company } from "../app/types";
import { initialShipments, initialVehicles, initialWasteTypes, initialCompanies } from "../app/data/mockData";
import { toast } from "sonner";

interface MockDataContextType {
  role: Role;
  currentCompanyId: string | null;
  companies: Company[];
  loginAs: (role: Role, companyId?: string) => void;

  shipments: Shipment[];
  vehicles: Vehicle[];
  wasteTypes: WasteType[];
  
  // İşlem Fonksiyonları
  addShipment: (shipment: Shipment) => void;
  updateShipmentStatus: (id: string, status: ShipmentStatus) => void;
  
  // Master Data Yönetimi (Yeni Eklenenler)
  addVehicle: (vehicle: Vehicle) => void;
  removeVehicle: (id: string) => void;
  addWasteType: (waste: WasteType) => void;
  removeWasteType: (id: string) => void;
}

const MockDataContext = createContext<MockDataContextType | undefined>(undefined);

export const MockDataProvider = ({ children }: { children: ReactNode }) => {
  const [role, setRole] = useState<Role>("admin");
  const [currentCompanyId, setCurrentCompanyId] = useState<string | null>(null);
  
  const [allShipments, setAllShipments] = useState<Shipment[]>(initialShipments);
  const [vehicles, setVehicles] = useState<Vehicle[]>(initialVehicles);
  const [wasteTypes, setWasteTypes] = useState<WasteType[]>(initialWasteTypes);
  const [companies] = useState<Company[]>(initialCompanies);

  const loginAs = (newRole: Role, companyId?: string) => {
    setRole(newRole);
    setCurrentCompanyId(companyId || null);
  };

  const getFilteredShipments = () => {
    if (role === "admin" || role === "security") return allShipments;
    if (role === "sender") return allShipments.filter(s => s.senderId === currentCompanyId);
    if (role === "receiver") return allShipments.filter(s => s.receiverId === currentCompanyId);
    return [];
  };

  const addShipment = (shipment: Shipment) => {
    setAllShipments((prev) => [shipment, ...prev]);
    toast.success("Yeni atık kaydı başarıyla oluşturuldu!", {
      description: "Güvenlik birimine bildirim gönderildi."
    });
  };

  const updateShipmentStatus = (id: string, status: ShipmentStatus) => {
    setAllShipments((prev) => prev.map((s) => (s.id === id ? { ...s, status } : s)));

    if (status === "ON_WAY") {
      toast.info("Araç çıkışına onay verildi.", { description: "Sürücü yola çıktı." });
    } else if (status === "DELIVERED") {
      toast.success("Teslimat tamamlandı!", { description: "Stok kayıtları güncellendi." });
    }
  };

  const addVehicle = (vehicle: Vehicle) => {
    setVehicles((prev) => [...prev, vehicle]);

    toast.success("Yeni araç sisteme eklendi.");
  };

  const removeVehicle = (id: string) => {
    setVehicles((prev) => prev.filter((v) => v.id !== id));

    toast.error("Araç kaydı silindi.");
  };

  const addWasteType = (waste: WasteType) => {
    setWasteTypes((prev) => [...prev, waste]);

    toast.success("Yeni atık kodu tanımlandı.");
  };

  const removeWasteType = (id: string) => {
    setWasteTypes((prev) => prev.filter((w) => w.id !== id));

    toast.error("Atık kodu silindi.");
  };

  return (
    <MockDataContext.Provider
      value={{
        role,
        currentCompanyId,
        companies,
        loginAs,
        shipments: getFilteredShipments(),
        vehicles,
        wasteTypes,
        addShipment,
        updateShipmentStatus,
        addVehicle,
        removeVehicle,
        addWasteType,
        removeWasteType,
      }}
    >
      {children}
    </MockDataContext.Provider>
  );
};

export const useMockData = () => {
  const context = useContext(MockDataContext);
  if (!context) {
    throw new Error("useMockData must be used within a MockDataProvider");
  }
  return context;
};
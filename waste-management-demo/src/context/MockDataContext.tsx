"use client";

import React, { createContext, useContext, useState, ReactNode } from "react";
import { Role, Shipment, Vehicle, WasteType, ShipmentStatus, Company } from "../app/types";
import { initialShipments, initialVehicles, initialWasteTypes, initialCompanies } from "../app/data/mockData";

interface MockDataContextType {
  role: Role;
  currentCompanyId: string | null; // Giriş yapmış firma ID'si
  companies: Company[];
  
  // Rol değiştirme fonksiyonunu güncelliyoruz
  loginAs: (role: Role, companyId?: string) => void;

  shipments: Shipment[]; // Bu artık FİLTRELENMİŞ liste olacak
  vehicles: Vehicle[];
  wasteTypes: WasteType[];
  
  addShipment: (shipment: Shipment) => void;
  updateShipmentStatus: (id: string, status: ShipmentStatus) => void;
}

const MockDataContext = createContext<MockDataContextType | undefined>(undefined);

export const MockDataProvider = ({ children }: { children: ReactNode }) => {
  const [role, setRole] = useState<Role>("admin");
  const [currentCompanyId, setCurrentCompanyId] = useState<string | null>(null);
  
  const [allShipments, setAllShipments] = useState<Shipment[]>(initialShipments); // Ham veri
  const [vehicles, setVehicles] = useState<Vehicle[]>(initialVehicles);
  const [wasteTypes, setWasteTypes] = useState<WasteType[]>(initialWasteTypes);
  const [companies] = useState<Company[]>(initialCompanies);

  // Rol değiştirme mantığı
  const loginAs = (newRole: Role, companyId?: string) => {
    setRole(newRole);
    setCurrentCompanyId(companyId || null);
  };

  // VERİ İZOLASYONU: Mevcut role göre veriyi filtrele
  const getFilteredShipments = () => {
    if (role === "admin" || role === "security") {
      return allShipments; // Her şeyi görür
    }
    if (role === "sender") {
      return allShipments.filter(s => s.senderId === currentCompanyId); // Sadece kendi gönderdikleri
    }
    if (role === "receiver") {
      return allShipments.filter(s => s.receiverId === currentCompanyId); // Sadece kendine gelenler
    }
    return [];
  };

  const addShipment = (shipment: Shipment) => {
    setAllShipments((prev) => [shipment, ...prev]);
  };

  const updateShipmentStatus = (id: string, status: ShipmentStatus) => {
    setAllShipments((prev) =>
      prev.map((s) => (s.id === id ? { ...s, status } : s))
    );
  };

  return (
    <MockDataContext.Provider
      value={{
        role,
        currentCompanyId,
        companies,
        loginAs,
        shipments: getFilteredShipments(), // Sayfalar bunu kullanacak
        vehicles,
        wasteTypes,
        addShipment,
        updateShipmentStatus,
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
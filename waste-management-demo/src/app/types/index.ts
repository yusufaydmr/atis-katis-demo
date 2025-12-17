export type Role = 'sender' | 'receiver' | 'transporter' | 'admin' | 'security';
export type ShipmentStatus = 'CREATED' | 'SECURITY_PENDING' | 'ON_WAY' | 'DELIVERED' | 'CANCELLED';

// YENİ: Doküman Tipi Tanımı
export type DocType = 'WASTE' | 'MACHINE' | 'WATER';

export interface Shipment {
  id: string;
  senderId: string;
  receiverId: string;
  senderName: string;
  receiverName: string;
  wasteTypeId: string;
  amount: number;
  vehicleId: string;
  status: ShipmentStatus;
  createdAt: string;
  
  docType?: DocType; 

  // İŞ MAKİNASI
  machineName?: string;
  workDescription?: string;
  workHours?: string;

  // SU
  waterSource?: string;
  phLevel?: string;
  chlorineLevel?: string;
}

export interface Company {
  id: string;
  name: string;
  role: Role;
}

export interface User {
  id: string;
  name: string;
  role: Role;
  companyId: string;
}

export interface Vehicle {
  id: string;
  plate: string;
  driverName: string;
  driverPhone: string;
}

export interface WasteType {
  id: string;
  code: string;
  name: string;
}
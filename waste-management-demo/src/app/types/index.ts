export type Role = 'admin' | 'sender' | 'security' | 'receiver';

export type ShipmentStatus = 'CREATED' | 'SECURITY_PENDING' | 'ON_WAY' | 'DELIVERED';

export interface Vehicle {
  id: string;
  plate: string;
  driverName: string;
  driverPhone: string;
}

export interface WasteType {
  id: string;
  name: string;
  code: string; // Örn: 08 01 11
}

export interface Shipment {
  id: string;
  senderName: string; // Gönderici Firma Adı
  receiverName: string; // Alıcı Firma Adı
  wasteTypeId: string;
  amount: number; // kg/ton
  vehicleId: string;
  documentUrl?: string; // Mock URL
  status: ShipmentStatus;
  createdAt: string;
}
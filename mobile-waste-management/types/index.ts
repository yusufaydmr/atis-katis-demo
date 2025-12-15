
export type Role = 'admin' | 'sender' | 'security' | 'receiver';

export type ShipmentStatus = 'CREATED' | 'SECURITY_PENDING' | 'ON_WAY' | 'DELIVERED';

export interface Company {
  id: string;
  name: string;
  role: Role; // Bu firmanın tipi ne? (Sadece sender veya receiver olabilir)
}

export interface Vehicle {
  id: string;
  plate: string;
  driverName: string;
  driverPhone: string;
}

export interface WasteType {
  id: string;
  name: string;
  code: string;
}

export interface Shipment {
  id: string;
  senderId: string;   // Hangi firma gönderdi?
  receiverId: string; // Kime gidiyor?
  senderName: string; // Görüntüleme kolaylığı için (Join yapmamak adına)
  receiverName: string;
  wasteTypeId: string;
  amount: number;
  vehicleId: string;
  documentUrl?: string;
  status: ShipmentStatus;
  createdAt: string;
}
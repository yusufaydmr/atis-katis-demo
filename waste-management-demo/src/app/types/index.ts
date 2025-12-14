export type UserRole = 'sender' | 'receiver' | 'carrier' | 'admin' | 'security';

export type ShipmentStatus = 
  | 'olusturuldu' // Created
  | 'tasimada'    // In Transit
  | 'teslim_edildi' // Delivered
  | 'onaylandi'   // Approved
  | 'reddedildi'; // Rejected

export interface Shipment {
  id: string;
  code: string; // Transfer Kodu (UATF No)
  
  // Gönderici Bilgileri
  senderId: string;
  senderName: string;
  
  // Alıcı Bilgileri
  receiverId: string;
  receiverName: string;
  
  // Taşıyıcı Bilgileri
  carrierName: string;
  plateNumber: string;
  driverName: string;
  driverId?: string; // Sürücü TC
  
  // Atık Bilgileri
  wasteCode: string; // EWC Kodu
  wasteDescription?: string; // Atık Tanımı
  amount: number;
  unit: 'kg' | 'ton';
  physicalState?: string; // Fiziksel Özellik (Katı, Sıvı vs.)
  packagingType?: string; // Ambalaj Türü (Varil, IBC vs.)
  hazardCode?: string; // H Kodu
  
  status: ShipmentStatus;
  createdAt: string;
  updatedAt: string;
  estimatedArrival?: string;
  actualArrival?: string;
}
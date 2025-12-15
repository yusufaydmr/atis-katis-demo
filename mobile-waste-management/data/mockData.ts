import { Company, Shipment, Vehicle, WasteType } from "../types";

// Firmalarımızı Tanımlayalım
export const initialCompanies: Company[] = [
  { id: "comp_sender_1", name: "Alfa Kimya (Gönderici)", role: "sender" },
  { id: "comp_sender_2", name: "Beta İlaç (Gönderici)", role: "sender" },
  { id: "comp_receiver_1", name: "Omega Geri Dönüşüm (Alıcı)", role: "receiver" },
  { id: "comp_receiver_2", name: "Delta Enerji (Alıcı)", role: "receiver" },
];

export const initialVehicles: Vehicle[] = [
  { id: "v1", plate: "34 KL 1234", driverName: "Ahmet Yılmaz", driverPhone: "0532 100 20 30" },
  { id: "v2", plate: "06 AB 9876", driverName: "Mehmet Demir", driverPhone: "0555 900 80 70" },
  { id: "v3", plate: "35 EGE 3535", driverName: "Ayşe Çelik", driverPhone: "0500 123 45 67" },
];

export const initialWasteTypes: WasteType[] = [
  { id: "w1", name: "Tehlikeli Atık", code: "18 01 03" },
  { id: "w2", name: "Ambalaj Atığı", code: "15 01 01" },
  { id: "w3", name: "Atık Yağ", code: "13 02 08" },
];

export const initialShipments: Shipment[] = [
  {
    id: "s1",
    senderId: "comp_sender_1", // Alfa Kimya
    receiverId: "comp_receiver_1", // Omega Dönüşüm
    senderName: "Alfa Kimya",
    receiverName: "Omega Geri Dönüşüm",
    wasteTypeId: "w1",
    amount: 500,
    vehicleId: "v1",
    status: "DELIVERED",
    createdAt: "2023-10-25T10:00:00Z",
  },
  {
    id: "s2",
    senderId: "comp_sender_1", // Alfa Kimya
    receiverId: "comp_receiver_2", // Delta Enerji
    senderName: "Alfa Kimya",
    receiverName: "Delta Enerji",
    wasteTypeId: "w2",
    amount: 1200,
    vehicleId: "v2",
    status: "SECURITY_PENDING",
    createdAt: "2023-10-26T09:30:00Z",
  },
  {
    id: "s3",
    senderId: "comp_sender_2", // Beta İlaç (Diğer firma görmemeli)
    receiverId: "comp_receiver_1",
    senderName: "Beta İlaç",
    receiverName: "Omega Geri Dönüşüm",
    wasteTypeId: "w3",
    amount: 300,
    vehicleId: "v3",
    status: "ON_WAY",
    createdAt: "2023-10-27T14:00:00Z",
  },
];
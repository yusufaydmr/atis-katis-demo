import { Company, Shipment, Vehicle, WasteType } from "../types";

export const initialCompanies: Company[] = [
  { id: "comp_sender_1", name: "Alfa Kimya (Gönderici)", role: "sender" },
  { id: "comp_sender_2", name: "Beta İlaç (Gönderici)", role: "sender" },
  { id: "comp_receiver_1", name: "Omega Geri Dönüşüm (Alıcı)", role: "receiver" },
  { id: "comp_receiver_2", name: "Delta Enerji (Alıcı)", role: "receiver" },
  { id: "comp_transporter_1", name: "Hızlı Lojistik", role: "transporter" },
  { id: "admin_corp", name: "Sistem Yönetimi", role: "admin" },
  { id: "sec_corp", name: "Güvenlik Birimi", role: "security" },
];

export const initialVehicles: Vehicle[] = [
  { id: "v1", plate: "34 KL 1234", driverName: "Ahmet Yılmaz", driverPhone: "0532 100 20 30" },
  { id: "v2", plate: "06 AB 9876", driverName: "Mehmet Demir", driverPhone: "0555 900 80 70" },
  { id: "v3", plate: "35 EGE 3535", driverName: "Ayşe Çelik", driverPhone: "0500 123 45 67" },
  { id: "v4", plate: "16 HM 8888", driverName: "Fatma Kaya", driverPhone: "0544 333 22 11" },
];

export const initialWasteTypes: WasteType[] = [
  { id: "w1", name: "Tehlikeli Atık", code: "18 01 03" },
  { id: "w2", name: "Atık Yağ", code: "13 02 08" },
  { id: "w3", name: "Kağıt/Karton", code: "20 01 01" },
  { id: "w4", name: "Plastik", code: "15 01 02" },
];

export const initialShipments: Shipment[] = [
  {
    id: "TRF-2024001",
    senderId: "comp_sender_1",
    receiverId: "comp_receiver_1",
    senderName: "Alfa Kimya (Gönderici)",
    receiverName: "Omega Geri Dönüşüm (Alıcı)",
    wasteTypeId: "w1",
    amount: 1250,
    vehicleId: "v1",
    status: "DELIVERED",
    createdAt: "2023-10-15T09:30:00Z",
    docType: "WASTE"
  },
  {
    id: "TRF-2024002",
    senderId: "comp_sender_1",
    receiverId: "comp_receiver_1",
    senderName: "Alfa Kimya (Gönderici)",
    receiverName: "Omega Geri Dönüşüm (Alıcı)",
    wasteTypeId: "w2",
    amount: 450,
    vehicleId: "v2",
    status: "ON_WAY",
    createdAt: "2023-10-25T14:15:00Z",
    docType: "WASTE"
  },
  {
    id: "TRF-2024003",
    senderId: "comp_sender_2",
    receiverId: "comp_receiver_1",
    senderName: "Beta İlaç (Gönderici)",
    receiverName: "Omega Geri Dönüşüm (Alıcı)",
    wasteTypeId: "w3",
    amount: 3200,
    vehicleId: "v3",
    status: "SECURITY_PENDING",
    createdAt: "2023-10-26T08:45:00Z",
    docType: "WASTE"
  },

  // --- İŞ MAKİNASI ---
  {
    id: "MK-2024001",
    senderId: "comp_sender_1",
    receiverId: "comp_receiver_1",
    senderName: "Alfa Kimya (Gönderici)",
    receiverName: "Omega Geri Dönüşüm (Alıcı)",
    wasteTypeId: "w1", // Teknik zorunluluktan w1 seçildi
    amount: 1, 
    vehicleId: "v1",
    status: "ON_WAY",
    createdAt: "2023-10-26T10:00:00Z",
    docType: "MACHINE",
    machineName: "CAT 320 Ekskavatör",
    workDescription: "Saha Düzeltme",
    workHours: "48 Saat"
  },
  {
    id: "MK-2024002",
    senderId: "comp_sender_2",
    receiverId: "comp_receiver_1",
    senderName: "Beta İlaç (Gönderici)",
    receiverName: "Omega Geri Dönüşüm (Alıcı)",
    wasteTypeId: "w1",
    amount: 1,
    vehicleId: "v3",
    status: "DELIVERED",
    createdAt: "2023-10-24T11:00:00Z",
    docType: "MACHINE",
    machineName: "JCB Bekoloder",
    workDescription: "Kanal Kazısı",
    workHours: "12 Saat"
  },

  // --- SU TANKERİ ---
  {
    id: "SU-2024001",
    senderId: "comp_sender_1",
    receiverId: "comp_receiver_1",
    senderName: "Alfa Kimya (Gönderici)",
    receiverName: "Omega Geri Dönüşüm (Alıcı)",
    wasteTypeId: "w1",
    amount: 15000,
    vehicleId: "v2",
    status: "SECURITY_PENDING",
    createdAt: "2023-10-26T12:30:00Z",
    docType: "WATER",
    waterSource: "Kuyu-4 (Analizli)",
    phLevel: "7.4",
    chlorineLevel: "0.4"
  },
  {
    id: "SU-2024002",
    senderId: "comp_sender_2",
    receiverId: "comp_receiver_1",
    senderName: "Beta İlaç (Gönderici)",
    receiverName: "Omega Geri Dönüşüm (Alıcı)",
    wasteTypeId: "w1",
    amount: 8000,
    vehicleId: "v4",
    status: "DELIVERED",
    createdAt: "2023-10-23T09:00:00Z",
    docType: "WATER",
    waterSource: "Şebeke Dolum",
    phLevel: "7.1",
    chlorineLevel: "0.6"
  }
];
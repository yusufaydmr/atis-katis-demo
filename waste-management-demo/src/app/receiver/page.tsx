"use client";

import { useMockData } from "@/context/MockDataContext";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Truck, Package, Clock } from "lucide-react";

// Yeni Modüler Bileşenler
import { IncomingTable } from "./components/IncomingTable";
import { HistoryTable } from "./components/HistoryTable";

export default function ReceiverPage() {
  const { role, shipments, currentCompanyId } = useMockData();

  const activeReceiverId = currentCompanyId || "comp_receiver_1";

  // Sayaç için basit hesaplama (Tüm lojistik sadece burada hesaplanıyor)
  const incomingCount = shipments.filter(s => s.receiverId === activeReceiverId && s.status === "ON_WAY").length;

  // Erişim Kontrolü
  if (role !== "receiver" && role !== "admin") {
    return <div className="p-10 text-center text-red-500 font-bold">Bu sayfaya sadece Alıcı Firmalar erişebilir.</div>;
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-3">
        <Package className="h-8 w-8 text-purple-600" />
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Atık Kabul Paneli</h2>
          <p className="text-gray-500">Tesisinize gelen atıkların takibi ve kabul işlemleri.</p>
        </div>
      </div>

      {/* Tabs & İçerik */}
      <Tabs defaultValue="incoming" className="w-full">
        <TabsList className="grid w-full grid-cols-2 max-w-[400px] mb-4">
          <TabsTrigger value="incoming">
            <Truck className="w-4 h-4 mr-2" />
            Yoldaki Araçlar 
            {incomingCount > 0 && <Badge className="ml-2 bg-purple-600 hover:bg-purple-700">{incomingCount}</Badge>}
          </TabsTrigger>
          <TabsTrigger value="history">
            <Clock className="w-4 h-4 mr-2" />
            Teslimat Geçmişi
          </TabsTrigger>
        </TabsList>

        <TabsContent value="incoming">
          <IncomingTable />
        </TabsContent>

        <TabsContent value="history">
          <HistoryTable />
        </TabsContent>
      </Tabs>
    </div>
  );
}
"use client";

import { useMockData } from "@/context/MockDataContext";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { FileText, Truck } from "lucide-react";

export function SenderStats() {
  const { shipments, currentCompanyId } = useMockData();

  // DÜZELTME: Eğer currentCompanyId null ise varsayılan olarak 'comp_sender_1' kullan
  // Bu sayede sayfa yenilense bile demo verileri görünmeye devam eder.
  const activeCompanyId = currentCompanyId || "comp_sender_1";

  // Hesaplamalar
  const myShipments = shipments.filter(s => s.senderId === activeCompanyId);
  const total = myShipments.length;
  const pending = myShipments.filter(s => s.status === "SECURITY_PENDING").length;
  const onWay = myShipments.filter(s => s.status === "ON_WAY").length;

  return (
    <div className="grid gap-4 md:grid-cols-3">
      <Card className="shadow-sm border-l-4 border-l-blue-600">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Toplam Gönderim</CardTitle>
          <FileText className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{total}</div>
          <p className="text-xs text-muted-foreground">Son 30 günde +12% artış</p>
        </CardContent>
      </Card>
      
      <Card className="shadow-sm border-l-4 border-l-yellow-500">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Bekleyen Onaylar</CardTitle>
          <Badge variant="secondary" className="bg-yellow-100 text-yellow-800 hover:bg-yellow-100">İşlemde</Badge>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{pending}</div>
          <p className="text-xs text-muted-foreground">Güvenlik onayı bekleniyor</p>
        </CardContent>
      </Card>
      
      <Card className="shadow-sm border-l-4 border-l-green-600">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Yoldaki Araçlar</CardTitle>
          <Truck className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{onWay}</div>
          <p className="text-xs text-muted-foreground">Tahmini varış: 2 saat</p>
        </CardContent>
      </Card>
    </div>
  );
}
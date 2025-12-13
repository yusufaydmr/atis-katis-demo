"use client";

import { useMockData } from "@/context/MockDataContext";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";

export default function AdminPage() {
  const { vehicles, wasteTypes, role } = useMockData();

  // Basit bir güvenlik kontrolü (Rol admin değilse uyar)
  if (role !== "admin") {
    return <div className="p-10 text-center text-red-500 font-bold">Bu sayfaya erişim yetkiniz yok.</div>;
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-bold tracking-tight">Yönetim Paneli</h2>
        <p className="text-gray-500">Sistemdeki temel verileri (Master Data) buradan görüntüleyebilirsiniz.</p>
      </div>

      <Tabs defaultValue="vehicles" className="w-full">
        <TabsList className="grid w-full grid-cols-2 max-w-[400px]">
          <TabsTrigger value="vehicles">Araçlar & Şoförler</TabsTrigger>
          <TabsTrigger value="wastetypes">Atık Kodları</TabsTrigger>
        </TabsList>

        {/* ARAÇLAR SEKMESİ */}
        <TabsContent value="vehicles">
          <Card>
            <CardHeader>
              <CardTitle>Araç Listesi</CardTitle>
              <CardDescription>Sisteme tanımlı lisanslı araçlar ve şoför bilgileri.</CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Plaka</TableHead>
                    <TableHead>Şoför Adı</TableHead>
                    <TableHead>İletişim</TableHead>
                    <TableHead>Durum</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {vehicles.map((v) => (
                    <TableRow key={v.id}>
                      <TableCell className="font-medium">{v.plate}</TableCell>
                      <TableCell>{v.driverName}</TableCell>
                      <TableCell>{v.driverPhone}</TableCell>
                      <TableCell><Badge variant="outline" className="text-green-600 border-green-200">Aktif</Badge></TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        {/* ATIK TİPLERİ SEKMESİ */}
        <TabsContent value="wastetypes">
          <Card>
            <CardHeader>
              <CardTitle>Atık Kodları</CardTitle>
              <CardDescription>Yönetmeliklere uygun atık kodları listesi.</CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Atık Kodu</TableHead>
                    <TableHead>Atık Adı</TableHead>
                    <TableHead>Risk Seviyesi</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {wasteTypes.map((w) => (
                    <TableRow key={w.id}>
                      <TableCell className="font-mono font-bold">{w.code}</TableCell>
                      <TableCell>{w.name}</TableCell>
                      <TableCell>
                        <Badge variant={w.code.startsWith('18') ? "destructive" : "secondary"}>
                          {w.code.startsWith('18') ? 'Yüksek Risk' : 'Normal'}
                        </Badge>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
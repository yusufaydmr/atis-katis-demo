"use client";

import { useMockData } from "@/context/MockDataContext";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { ArrowRight, ShieldCheck, Truck, Recycle, Settings } from "lucide-react"; // İkonlar

export default function Home() {
  const { role, currentCompanyId, companies } = useMockData();

  // Seçili firmanın adını bulalım
  const currentCompanyName = companies.find(c => c.id === currentCompanyId)?.name;

  return (
    <div className="space-y-8">
      {/* Karşılama Alanı */}
      <section className="flex flex-col gap-2">
        <h1 className="text-3xl font-bold tracking-tight text-gray-900">
          Hoş Geldiniz, {role === 'admin' ? 'Yönetici' : role === 'security' ? 'Güvenlik Amiri' : currentCompanyName}
        </h1>
        <p className="text-gray-500">
          Atık yönetim sistemi panelindesiniz. Rolünüze uygun işlemleri aşağıdan seçebilirsiniz.
        </p>
      </section>

      {/* Rol Bazlı Yönlendirme Kartları */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        
        {/* ADMIN KARTI */}
        {role === "admin" && (
          <Card className="hover:shadow-lg transition-shadow border-l-4 border-l-blue-500">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Settings className="h-5 w-5 text-blue-500" />
                Yönetim Paneli
              </CardTitle>
              <CardDescription>Ana veri yönetimi ve tanımlamalar</CardDescription>
            </CardHeader>
            <CardContent>
              <Link href="/admin">
                <Button className="w-full">Yönetime Git <ArrowRight className="ml-2 h-4 w-4" /></Button>
              </Link>
            </CardContent>
          </Card>
        )}

        {/* GÖNDERİCİ (SENDER) KARTI */}
        {role === "sender" && (
          <Card className="hover:shadow-lg transition-shadow border-l-4 border-l-green-500">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Truck className="h-5 w-5 text-green-500" />
                Atık Gönderimi
              </CardTitle>
              <CardDescription>Yeni atık çıkışı yap veya geçmişi izle</CardDescription>
            </CardHeader>
            <CardContent>
              <Link href="/sender">
                <Button className="w-full bg-green-600 hover:bg-green-700">İşlemlere Başla <ArrowRight className="ml-2 h-4 w-4" /></Button>
              </Link>
            </CardContent>
          </Card>
        )}

        {/* GÜVENLİK (SECURITY) KARTI */}
        {role === "security" && (
          <Card className="hover:shadow-lg transition-shadow border-l-4 border-l-red-500">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <ShieldCheck className="h-5 w-5 text-red-500" />
                Güvenlik Kontrol
              </CardTitle>
              <CardDescription>Araç giriş-çıkış onayı ver</CardDescription>
            </CardHeader>
            <CardContent>
              <Link href="/security">
                <Button className="w-full variant-destructive">Kontrol Ekranı <ArrowRight className="ml-2 h-4 w-4" /></Button>
              </Link>
            </CardContent>
          </Card>
        )}

        {/* ALICI (RECEIVER) KARTI */}
        {role === "receiver" && (
          <Card className="hover:shadow-lg transition-shadow border-l-4 border-l-purple-500">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Recycle className="h-5 w-5 text-purple-500" />
                Atık Kabul
              </CardTitle>
              <CardDescription>Gelen atıkları onayla ve teslim al</CardDescription>
            </CardHeader>
            <CardContent>
              <Link href="/receiver">
                <Button className="w-full bg-purple-600 hover:bg-purple-700">Kabul Ekranı <ArrowRight className="ml-2 h-4 w-4" /></Button>
              </Link>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}
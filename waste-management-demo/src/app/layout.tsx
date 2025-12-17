import type { Metadata } from "next";
import { Inter } from "next/font/google"; // DEĞİŞİKLİK: Google Font kullanıldı
import "./globals.css";
import { MockDataProvider } from "@/context/MockDataContext";
import { RoleSwitcher } from "@/components/RoleSwitcher";
import { NotificationCenter } from "@/components/NotificationCenter";
import { Toaster } from "@/components/ui/sonner"; 
import { Recycle } from "lucide-react";

// DEĞİŞİKLİK: Local font tanımları kaldırıldı, yerine Inter eklendi
const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Atık Yönetim Sistemi",
  description: "Ulusal Atık Taşıma Formu (U-ATOF) Yönetim Paneli",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="tr">
      {/* DEĞİŞİKLİK: body className güncellendi */}
      <body className={`${inter.className} antialiased bg-gray-50 min-h-screen text-gray-900`}>
        <MockDataProvider>
          
          {/* ÜST NAVBAR */}
          <nav className="sticky top-0 z-40 border-b bg-white/80 backdrop-blur-md px-6 py-3 flex justify-between items-center shadow-sm">
            
            {/* SOL: LOGO */}
            <div className="flex items-center gap-2">
              <div className="bg-gradient-to-br from-green-500 to-green-700 text-white p-2 rounded-lg shadow-lg">
                <Recycle className="w-5 h-5" />
              </div>
              <div className="leading-none">
                <h1 className="font-bold text-lg text-gray-800 tracking-tight"><span className="text-green-600">ATIK YÖNETİM SİSTEMİ</span></h1>
                <p className="text-[10px] text-gray-500 font-medium tracking-wide">ATIK YÖNETİM SİSTEMİ</p>
              </div>
            </div>

            {/* SAĞ: BİLDİRİM & ROL & PROFİL */}
            <div className="flex items-center gap-3">
               
               {/* BİLDİRİM MERKEZİ */}
               <NotificationCenter />
               
               <div className="h-6 w-px bg-gray-200 mx-1"></div> {/* Dikey ayraç */}
               
               <RoleSwitcher />
            </div>

          </nav>

          {/* ANA İÇERİK */}
          <main className="container mx-auto py-8 px-4 md:px-6">
            {children}
          </main>

          <Toaster position="top-right" richColors closeButton />
        </MockDataProvider>
      </body>
    </html>
  );
}
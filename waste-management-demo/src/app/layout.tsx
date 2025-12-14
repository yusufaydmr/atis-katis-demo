import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { MockDataProvider } from "@/context/MockDataContext";
import { RoleSwitcher } from "@/components/RoleSwitcher";
import { Toaster } from "sonner"; // Bildirim bileşeni

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Atık Yönetim Sistemi Demo",
  description: "Next.js Demo Projesi",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="tr">
      <body className={`${inter.className} bg-gray-50 min-h-screen`}>
        <MockDataProvider>
          {/* Üst Navbar */}
          <nav className="border-b bg-white px-6 py-4 flex justify-between items-center shadow-sm">
            <h1 className="text-xl font-bold text-green-700">♻️ Atık Yönetim Sistemi</h1>
            <RoleSwitcher />
          </nav>

          {/* Sayfa İçeriği */}
          <main className="p-6 max-w-7xl mx-auto">
            {children}
          </main>
          
          {/* Bildirim Bileşeni - Güncellendi */}
          {/* closeButton prop'u eklendi, böylece kapatma ikonu görünür olacak */}
          <Toaster position="top-right" richColors closeButton />
        </MockDataProvider>
      </body>
    </html>
  );
}
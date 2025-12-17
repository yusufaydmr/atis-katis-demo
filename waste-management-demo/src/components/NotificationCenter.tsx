"use client";

import { useState } from "react";
import { Bell, CheckCircle2, AlertTriangle, Truck, Info, X } from "lucide-react";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area"; // Eğer ScrollArea yoksa div kullanacağız

// Mock Bildirim Verileri
const initialNotifications = [
  { 
    id: 1, 
    title: "Transfer Başladı", 
    message: "34 KL 1234 plakalı araç tesisinizden çıkış yaptı.", 
    time: "2 dk önce", 
    type: "info",
    read: false 
  },
  { 
    id: 2, 
    title: "Güvenlik Onayı", 
    message: "Alfa Kimya - Atık yükü güvenlik tarafından onaylandı.", 
    time: "15 dk önce", 
    type: "success",
    read: false 
  },
  { 
    id: 3, 
    title: "Limit Uyarısı", 
    message: "Tehlikeli atık deposu doluluk oranı %85'e ulaştı.", 
    time: "1 saat önce", 
    type: "warning",
    read: true 
  },
  { 
    id: 4, 
    title: "Sistem Bakımı", 
    message: "Gece 03:00 - 05:00 arası planlı bakım yapılacaktır.", 
    time: "3 saat önce", 
    type: "system",
    read: true 
  }
];

export function NotificationCenter() {
  const [notifications, setNotifications] = useState(initialNotifications);
  const unreadCount = notifications.filter(n => !n.read).length;

  const markAsRead = () => {
    setNotifications(notifications.map(n => ({ ...n, read: true })));
  };

  const getIcon = (type: string) => {
    switch(type) {
        case 'success': return <CheckCircle2 className="w-4 h-4 text-green-600" />;
        case 'warning': return <AlertTriangle className="w-4 h-4 text-orange-600" />;
        case 'info': return <Truck className="w-4 h-4 text-blue-600" />;
        default: return <Info className="w-4 h-4 text-gray-600" />;
    }
  };

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button variant="ghost" size="icon" className="relative text-gray-500 hover:text-blue-700 hover:bg-blue-50 transition-colors">
          <Bell className="w-5 h-5" />
          {unreadCount > 0 && (
            <span className="absolute top-2 right-2 w-2 h-2 bg-red-500 rounded-full animate-pulse ring-2 ring-white" />
          )}
        </Button>
      </PopoverTrigger>
      
      <PopoverContent className="w-80 p-0 shadow-xl border-gray-200" align="end">
        {/* Header */}
        <div className="flex items-center justify-between px-4 py-3 border-b bg-gray-50/50">
            <h4 className="font-semibold text-sm text-gray-800">Bildirimler</h4>
            {unreadCount > 0 && (
                <Badge variant="secondary" className="bg-blue-100 text-blue-700 hover:bg-blue-200 text-[10px] h-5 cursor-pointer" onClick={markAsRead}>
                    Tümünü Okundu Say
                </Badge>
            )}
        </div>

        {/* Liste */}
        <div className="max-h-[300px] overflow-y-auto">
            {notifications.length === 0 ? (
                <div className="p-8 text-center text-gray-500 text-xs">Hiç bildiriminiz yok.</div>
            ) : (
                <div className="divide-y divide-gray-100">
                    {notifications.map((notif) => (
                        <div key={notif.id} className={`flex gap-3 p-3 hover:bg-gray-50 transition-colors cursor-pointer ${!notif.read ? 'bg-blue-50/30' : ''}`}>
                            <div className={`mt-1 p-1.5 rounded-full h-fit shrink-0 ${!notif.read ? 'bg-white shadow-sm ring-1 ring-gray-100' : 'bg-gray-100'}`}>
                                {getIcon(notif.type)}
                            </div>
                            <div className="flex-1 space-y-1">
                                <div className="flex justify-between items-start">
                                    <p className={`text-xs font-medium ${!notif.read ? 'text-gray-900' : 'text-gray-600'}`}>{notif.title}</p>
                                    <span className="text-[10px] text-gray-400 whitespace-nowrap ml-2">{notif.time}</span>
                                </div>
                                <p className="text-[11px] text-gray-500 leading-snug line-clamp-2">
                                    {notif.message}
                                </p>
                            </div>
                            {!notif.read && (
                                <div className="w-1.5 h-1.5 rounded-full bg-blue-500 mt-2 shrink-0" />
                            )}
                        </div>
                    ))}
                </div>
            )}
        </div>

        {/* Footer */}
        <div className="p-2 border-t bg-gray-50/50 text-center">
            <Button variant="ghost" className="text-[10px] h-6 text-gray-500 hover:text-blue-600 w-full">
                Geçmiş Bildirimleri Gör
            </Button>
        </div>
      </PopoverContent>
    </Popover>
  );
}
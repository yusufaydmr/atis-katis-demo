"use client";

import { useMockData } from "@/context/MockDataContext";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";

export function RoleSwitcher() {
  const { role, companies, loginAs, currentCompanyId } = useMockData();

  // Seçim yapıldığında çalışacak fonksiyon
  const handleValueChange = (value: string) => {
    if (value === "admin") return loginAs("admin");
    if (value === "security") return loginAs("security");
    
    // Firma seçildiyse ID'den firmayı bul
    const selectedCompany = companies.find(c => c.id === value);
    if (selectedCompany) {
      loginAs(selectedCompany.role, selectedCompany.id);
    }
  };

  // Dropdown'da görünecek mevcut değer
  const getCurrentValue = () => {
    if (role === "admin" || role === "security") return role;
    return currentCompanyId || "";
  };

  return (
    <div className="flex items-center gap-3 bg-white p-2 rounded-lg border shadow-sm">
      <div className="flex flex-col items-end">
        <span className="text-xs text-gray-400">Aktif Kullanıcı</span>
        <Badge variant={role === "admin" ? "default" : "secondary"}>
          {role.toUpperCase()}
        </Badge>
      </div>

      <Select value={getCurrentValue()} onValueChange={handleValueChange}>
        <SelectTrigger className="w-[220px]">
          <SelectValue placeholder="Rol Değiştir" />
        </SelectTrigger>
        <SelectContent>
          <SelectGroup>
            <SelectLabel>Yönetim & Güvenlik</SelectLabel>
            <SelectItem value="admin">👨‍💼 Yönetici (Admin)</SelectItem>
            <SelectItem value="security">👮 Güvenlik Birimi</SelectItem>
          </SelectGroup>

          <SelectGroup>
            <SelectLabel>Gönderici Firmalar</SelectLabel>
            {companies.filter(c => c.role === "sender").map(comp => (
               <SelectItem key={comp.id} value={comp.id}>🏭 {comp.name}</SelectItem>
            ))}
          </SelectGroup>

          <SelectGroup>
            <SelectLabel>Alıcı Firmalar</SelectLabel>
            {companies.filter(c => c.role === "receiver").map(comp => (
               <SelectItem key={comp.id} value={comp.id}>♻️ {comp.name}</SelectItem>
            ))}
          </SelectGroup>
        </SelectContent>
      </Select>
    </div>
  );
}
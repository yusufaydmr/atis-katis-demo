import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}
export function exportToCSV(data: any[], filename: string) {
  // 1. Veri kontrolü
  if (!data || data.length === 0) {
    alert("Dışa aktarılacak veri bulunamadı.");
    return;
  }

  // 2. BOM (Byte Order Mark) ekle - Türkçe karakter sorunu için
  const BOM = "\uFEFF";

  // 3. Başlıkları (Header) al
  const headers = Object.keys(data[0]);
  
  // 4. CSV İçeriğini oluştur
  const csvContent = [
    headers.join(";"), // Excel için ayırıcı olarak noktalı virgül (;) daha güvenlidir
    ...data.map(row => 
      headers.map(fieldName => {
        const value = row[fieldName];
        // Metin içinde noktalı virgül veya yeni satır varsa temizle/tırnak içine al
        const stringValue = String(value ?? "").replace(/"/g, '""'); 
        return `"${stringValue}"`; 
      }).join(";")
    )
  ].join("\n");

  // 5. Dosyayı Blob olarak oluştur ve indir
  const blob = new Blob([BOM + csvContent], { type: "text/csv;charset=utf-8;" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.setAttribute("href", url);
  link.setAttribute("download", `${filename}_${new Date().toISOString().slice(0,10)}.csv`);
  link.style.visibility = "hidden";
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}
"use client";

import { useMockData } from "@/context/MockDataContext";
import { DocType } from "../page";

interface PrintTemplateProps {
  formData: any;
  docType: DocType;
  config: { title: string; code: string };
}

export function PrintTemplate({ formData, docType, config }: PrintTemplateProps) {
  const { companies, currentCompanyId, wasteTypes } = useMockData();

  const selectedWaste = wasteTypes.find(w => w.code === formData.wasteCode);
  
  const formatDate = (dateString: string) => {
    try {
        const d = new Date(dateString)
        return new Intl.DateTimeFormat('tr-TR', { day: '2-digit', month: '2-digit', year: 'numeric' }).format(d)
    } catch { return dateString }
  }

  return (
    <div className="hidden print:block absolute top-0 left-0 w-full h-full bg-white p-8 z-[9999]">
       {/* Başlık Alanı */}
       <div className="flex justify-between items-center border-b-2 border-black pb-4 mb-6">
           <div className="flex flex-col">
               <h1 className="text-2xl font-bold text-black uppercase">{config.title}</h1>
               <span className="text-sm text-gray-600">Doküman No: {config.code} / Rev: 02</span>
           </div>
           <div className="text-right">
               <div className="font-bold text-xl">{new Date().toLocaleDateString('tr-TR')}</div>
               <div className="text-xs text-gray-500">Oluşturulma Zamanı</div>
           </div>
       </div>

       {/* Form Grid */}
       <div className="border-2 border-black">
           {/* Satır 1 */}
           <div className="flex border-b border-black h-24">
               <div className="w-1/3 border-r border-black p-2">
                   <div className="text-[10px] font-bold uppercase text-gray-500">Gönderen Firma</div>
                   <div className="font-bold text-lg mt-2">{companies.find(c => c.id === currentCompanyId)?.name || "—"}</div>
               </div>
               <div className="w-1/3 border-r border-black p-2">
                   <div className="text-[10px] font-bold uppercase text-gray-500">Taşıyıcı Firma</div>
                   <div className="font-medium text-lg mt-2">{companies.find(c => c.id === formData.transporterId)?.name || "—"}</div>
               </div>
               <div className="w-1/3 p-2">
                   <div className="text-[10px] font-bold uppercase text-gray-500">Alıcı Firma</div>
                   <div className="font-medium text-lg mt-2">{companies.find(c => c.id === formData.receiverId)?.name || "—"}</div>
               </div>
           </div>

           {/* Satır 2 */}
           <div className="flex border-b border-black h-24">
               <div className="w-1/4 border-r border-black p-2">
                   <div className="text-[10px] font-bold uppercase text-gray-500">Sefer Tarihi</div>
                   <div className="font-bold text-lg mt-2">{formData.plannedDate ? formatDate(formData.plannedDate) : "—"}</div>
               </div>
               <div className="w-1/4 border-r border-black p-2">
                   <div className="text-[10px] font-bold uppercase text-gray-500">Araç Plakası</div>
                   <div className="font-mono font-bold text-xl mt-2">{formData.vehiclePlate || "—"}</div>
               </div>
               <div className="w-1/4 border-r border-black p-2">
                   <div className="text-[10px] font-bold uppercase text-gray-500">Sürücü</div>
                   <div className="font-medium text-lg mt-2">{formData.driverName || "—"}</div>
               </div>
               <div className="w-1/4 p-2">
                   <div className="text-[10px] font-bold uppercase text-gray-500">Belge Tipi</div>
                   <div className="font-medium mt-2">{docType}</div>
               </div>
           </div>

           {/* Satır 3: İçerik */}
           <div className="flex h-32">
                <div className="w-full p-4">
                    <div className="text-[10px] font-bold uppercase text-gray-500 mb-2">Taşınan Malzeme / Yük Detayı</div>
                    {docType === 'WASTE' && (
                        <div className="flex justify-between items-center text-xl">
                            <span className="font-mono font-bold">{formData.wasteCode} - {selectedWaste?.name}</span>
                            <span className="font-bold border px-4 py-1 border-black rounded">{formData.amount} KG</span>
                        </div>
                    )}
                    {docType === 'MACHINE' && (
                        <div className="flex justify-between items-center text-xl">
                            <span className="font-bold">{formData.machineName} ({formData.workDescription})</span>
                            <span className="font-bold">{formData.workHours} SAAT</span>
                        </div>
                    )}
                    {docType === 'WATER' && (
                        <div className="flex justify-between items-center text-xl">
                            <span className="font-bold">{formData.waterSource} (pH: {formData.phLevel})</span>
                            <span className="font-bold">{formData.amount} LT</span>
                        </div>
                    )}
                    <div className="mt-4 text-xs text-gray-400 italic">
                        * Bu belge dijital olarak oluşturulmuştur. Islak imza gerektirir.
                    </div>
                </div>
           </div>
       </div>

       {/* İmzalar */}
       <div className="flex justify-between mt-12 gap-8">
            <div className="w-1/3 border-t-2 border-black pt-2 text-center">
                <div className="font-bold text-sm">GÖNDEREN YETKİLİSİ</div>
                <div className="text-xs text-gray-500 mt-1">Ad Soyad / İmza / Kaşe</div>
                <div className="h-20 mt-4 bg-gray-50 border border-gray-200"></div>
            </div>
            <div className="w-1/3 border-t-2 border-black pt-2 text-center">
                <div className="font-bold text-sm">TAŞIYICI / SÜRÜCÜ</div>
                <div className="text-xs text-gray-500 mt-1">Ad Soyad / İmza</div>
                <div className="h-20 mt-4 bg-gray-50 border border-gray-200"></div>
            </div>
            <div className="w-1/3 border-t-2 border-black pt-2 text-center">
                <div className="font-bold text-sm">ALICI FİRMA YETKİLİSİ</div>
                <div className="text-xs text-gray-500 mt-1">Ad Soyad / İmza / Kaşe</div>
                <div className="h-20 mt-4 bg-gray-50 border border-gray-200"></div>
            </div>
       </div>

       {/* Footer */}
       <div className="absolute bottom-8 left-0 w-full text-center text-xs text-gray-400">
           Atık Yönetim Sistemi v0.1.0 • Bu belge resmi evrak niteliği taşır.
       </div>
    </div>
  );
}
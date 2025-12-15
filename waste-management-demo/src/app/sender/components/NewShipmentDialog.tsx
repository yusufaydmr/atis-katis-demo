"use client";

import { useMockData } from "@/context/MockDataContext";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tractor, Droplets, FileText, Printer } from "lucide-react";
import { ExcelCell } from "./ExcelCell";
import { DocType } from "../page";

interface NewShipmentDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  formData: any;
  setFormData: (data: any) => void;
  docType: DocType;
  setDocType: (type: DocType) => void;
  onSubmit: (isDraft: boolean) => void;
  onPrint: () => void;
  config: { title: string; icon: React.ReactNode };
}

export function NewShipmentDialog({
  open, onOpenChange, formData, setFormData, docType, setDocType, onSubmit, onPrint, config
}: NewShipmentDialogProps) {
  const { companies, currentCompanyId, vehicles, wasteTypes } = useMockData();
  const selectedWaste = wasteTypes.find(w => w.code === formData.wasteCode);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[90vw] p-0 gap-0 overflow-hidden bg-gray-50">
        <DialogHeader className="px-6 py-4 bg-white border-b border-gray-200">
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-2">
                <div className="p-2 rounded-lg bg-blue-50 text-blue-900">
                    {config.icon}
                </div>
                <div>
                    <DialogTitle className="text-xl text-blue-900">{config.title}</DialogTitle>
                    <p className="text-sm text-gray-500 mt-1">Lütfen ilgili alanları eksiksiz doldurunuz.</p>
                </div>
            </div>
            
            <div className="flex items-center gap-2 bg-gray-100 p-1.5 rounded-md border border-gray-200">
                <span className="text-xs font-bold text-gray-500 px-2 uppercase">Belge Tipi:</span>
                <Select value={docType} onValueChange={(val: DocType) => setDocType(val)}>
                    <SelectTrigger className="w-[200px] h-8 bg-white border-gray-300 text-xs font-bold shadow-sm"><SelectValue /></SelectTrigger>
                    <SelectContent>
                        <SelectItem value="WASTE">🗑️ Atık Transfer Formu</SelectItem>
                        <SelectItem value="MACHINE">🚜 İş Makinası Takip</SelectItem>
                        <SelectItem value="WATER">💧 Su Tankeri Takip</SelectItem>
                    </SelectContent>
                </Select>
            </div>
          </div>
        </DialogHeader>

        <div className="p-6">
          <div className="bg-white border border-gray-300 rounded-sm shadow-sm overflow-hidden flex flex-col">
            {/* Mavi ve Kırmızı Bölümler */}
            <div className="flex flex-col lg:flex-row border-b border-gray-300">
                {/* Sol Taraf */}
                <div className="lg:w-[40%] flex flex-col border-b lg:border-b-0 lg:border-r border-gray-300">
                    <div className="h-16 border-b border-gray-200">
                        <ExcelCell label={docType === 'WATER' ? "KAYNAK (SİZ)" : "GÖNDEREN FİRMA"} headerClass="bg-blue-50 text-blue-700">
                            <div className="text-sm font-medium text-gray-900 w-full truncate">{companies.find(c => c.id === currentCompanyId)?.name || "Firma Seçilmedi"}</div>
                        </ExcelCell>
                    </div>
                    <div className="h-16 border-b border-gray-200">
                        <ExcelCell label="TAŞIYICI FİRMA" headerClass="bg-blue-50 text-blue-700">
                            <Select value={formData.transporterId} onValueChange={(val) => setFormData({...formData, transporterId: val})}>
                            <SelectTrigger className="border-0 shadow-none focus:ring-0 px-0 h-full flex items-center text-sm font-medium text-gray-900 bg-transparent"><SelectValue placeholder="Seçiniz..." /></SelectTrigger>
                            <SelectContent>{companies.map(c => (<SelectItem key={c.id} value={c.id}>{c.name}</SelectItem>))}</SelectContent>
                            </Select>
                        </ExcelCell>
                    </div>
                    <div className="h-16">
                        <ExcelCell label={docType === 'WATER' ? "TESLİM YERİ" : "ALICI FİRMA"} headerClass="bg-blue-50 text-blue-700">
                            <Select value={formData.receiverId} onValueChange={(val) => setFormData({...formData, receiverId: val})}>
                            <SelectTrigger className="border-0 shadow-none focus:ring-0 px-0 h-full flex items-center text-sm font-medium text-gray-900 bg-transparent"><SelectValue placeholder="Seçiniz..." /></SelectTrigger>
                            <SelectContent>{companies.filter(c => c.role === "receiver").map(c => (<SelectItem key={c.id} value={c.id}>{c.name}</SelectItem>))}</SelectContent>
                            </Select>
                        </ExcelCell>
                    </div>
                </div>

                {/* Sağ Taraf (Kırmızı) */}
                <div className="lg:w-[60%] grid grid-cols-2 grid-rows-2">
                        <div className="h-24 border-b border-r border-gray-200">
                        <ExcelCell label="TARİH" headerClass="bg-red-50 text-red-700">
                            <Input type="date" value={formData.plannedDate} onChange={(e) => setFormData({...formData, plannedDate: e.target.value})} className="border-0 shadow-none focus-visible:ring-0 px-0 h-full text-gray-900 bg-transparent w-full font-medium" />
                        </ExcelCell>
                        </div>
                        <div className="h-24 border-b border-gray-200">
                        <ExcelCell label="ARAÇ PLAKASI" headerClass="bg-red-50 text-red-700">
                            <Select value={formData.vehiclePlate} onValueChange={(val) => {
                                const vehicle = vehicles.find(v => v.plate === val)
                                setFormData({...formData, vehiclePlate: val, driverName: vehicle?.driverName || formData.driverName })
                            }}>
                            <SelectTrigger className="border-0 shadow-none focus:ring-0 px-0 h-full flex items-center font-mono font-bold text-gray-900 bg-transparent text-lg"><SelectValue placeholder="PLAKA" /></SelectTrigger>
                            <SelectContent>{vehicles.map(v => (<SelectItem key={v.id} value={v.plate}>{v.plate}</SelectItem>))}</SelectContent>
                            </Select>
                        </ExcelCell>
                        </div>
                        <div className="h-24 border-r border-gray-200">
                        <ExcelCell label="SÜRÜCÜ ADI SOYADI" headerClass="bg-red-50 text-red-700">
                            <Input placeholder="İsim Giriniz" value={formData.driverName} onChange={(e) => setFormData({...formData, driverName: e.target.value})} className="border-0 shadow-none focus-visible:ring-0 px-0 h-full text-gray-900 placeholder:text-gray-300 font-medium" />
                        </ExcelCell>
                        </div>
                        <div className="h-24">
                        <ExcelCell label="TRANSFER TÜRÜ" headerClass="bg-red-50 text-red-700">
                            <span className="text-gray-500 text-sm font-medium w-full flex items-center h-full">
                                {docType === 'WASTE' ? "Tehlikeli / Tehlikesiz" : docType === 'MACHINE' ? "Nakliye / Lowbed" : "Tanker Transferi"}
                            </span>
                        </ExcelCell>
                        </div>
                </div>
            </div>

            {/* Yeşil Bölüm (Dinamik) */}
            <div className="flex w-full min-h-[80px]">
                {docType === 'WASTE' && (
                <>
                    <div className="w-[15%]">
                    <ExcelCell label="ATIK KODU" headerClass="bg-green-50 text-green-700">
                        <Select value={formData.wasteCode} onValueChange={(val) => setFormData({...formData, wasteCode: val})}>
                        <SelectTrigger className="border-0 shadow-none focus:ring-0 px-0 h-full flex items-center font-mono font-bold text-gray-900 bg-transparent"><SelectValue placeholder="------" /></SelectTrigger>
                        <SelectContent>{wasteTypes.map((w: any) => (<SelectItem key={w.code} value={w.code}>{w.code}</SelectItem>))}</SelectContent>
                        </Select>
                    </ExcelCell>
                    </div>
                    <div className="w-[30%]">
                    <ExcelCell label="ATIK TANIMI" headerClass="bg-green-50 text-green-700">
                        <div className="text-sm text-gray-700 py-1 leading-tight flex items-center h-full">{selectedWaste ? selectedWaste.name : "..."}</div>
                    </ExcelCell>
                    </div>
                    <div className="w-[20%]">
                    <ExcelCell label="AMBALAJ TÜRÜ" headerClass="bg-green-50 text-green-700">
                        <Select value={formData.packagingType} onValueChange={(val) => setFormData({...formData, packagingType: val})}>
                        <SelectTrigger className="border-0 shadow-none focus:ring-0 px-0 h-full flex items-center font-medium text-gray-900 bg-transparent"><SelectValue placeholder="Seçiniz" /></SelectTrigger>
                        <SelectContent><SelectItem value="IBC">IBC Tank</SelectItem><SelectItem value="Varil">Varil</SelectItem><SelectItem value="Plastik">Plastik Bidon</SelectItem><SelectItem value="Dökme">Dökme</SelectItem></SelectContent>
                        </Select>
                    </ExcelCell>
                    </div>
                </>
                )}
                {docType === 'MACHINE' && (
                <>
                    <div className="w-[25%]">
                    <ExcelCell label="MAKİNE TANIMI" headerClass="bg-green-50 text-green-700">
                        <Input placeholder="Örn: CAT 320" value={formData.machineName} onChange={(e) => setFormData({...formData, machineName: e.target.value})} className="border-0 shadow-none focus-visible:ring-0 px-0 h-full font-medium text-gray-900" />
                    </ExcelCell>
                    </div>
                    <div className="w-[25%]">
                    <ExcelCell label="YAPILAN İŞ" headerClass="bg-green-50 text-green-700">
                        <Input placeholder="Örn: Saha düzeltme" value={formData.workDescription} onChange={(e) => setFormData({...formData, workDescription: e.target.value})} className="border-0 shadow-none focus-visible:ring-0 px-0 h-full text-gray-900" />
                    </ExcelCell>
                    </div>
                    <div className="w-[15%]">
                    <ExcelCell label="ÇALIŞMA SAATİ" headerClass="bg-green-50 text-green-700">
                        <Input placeholder="00:00" value={formData.workHours} onChange={(e) => setFormData({...formData, workHours: e.target.value})} className="border-0 shadow-none focus-visible:ring-0 px-0 h-full font-mono text-gray-900" />
                    </ExcelCell>
                    </div>
                </>
                )}
                {docType === 'WATER' && (
                <>
                    <div className="w-[25%]">
                    <ExcelCell label="SU KAYNAĞI" headerClass="bg-green-50 text-green-700">
                        <Input placeholder="Örn: Kuyu 2" value={formData.waterSource} onChange={(e) => setFormData({...formData, waterSource: e.target.value})} className="border-0 shadow-none focus-visible:ring-0 px-0 h-full font-medium text-gray-900" />
                    </ExcelCell>
                    </div>
                    <div className="w-[20%]">
                    <ExcelCell label="KLOR (ppm)" headerClass="bg-green-50 text-green-700">
                        <Input type="number" placeholder="0.5" value={formData.chlorineLevel} onChange={(e) => setFormData({...formData, chlorineLevel: e.target.value})} className="border-0 shadow-none focus-visible:ring-0 px-0 h-full font-mono text-gray-900" />
                    </ExcelCell>
                    </div>
                    <div className="w-[20%]">
                    <ExcelCell label="pH DEĞERİ" headerClass="bg-green-50 text-green-700">
                        <Input type="number" placeholder="7.2" value={formData.phLevel} onChange={(e) => setFormData({...formData, phLevel: e.target.value})} className="border-0 shadow-none focus-visible:ring-0 px-0 h-full font-mono text-gray-900" />
                    </ExcelCell>
                    </div>
                </>
                )}

                <div className="w-[20%]">
                <ExcelCell label="MİKTAR" headerClass="bg-green-50 text-green-700">
                    <Input type="number" placeholder="0.00" value={formData.amount} onChange={(e) => setFormData({...formData, amount: e.target.value})} className="border-0 shadow-none focus-visible:ring-0 px-0 h-full text-right font-bold text-lg text-gray-900" />
                </ExcelCell>
                </div>
                <div className="flex-1">
                <ExcelCell label="BİRİM" headerClass="bg-green-50 text-green-700">
                    <span className="text-sm font-bold text-gray-900 flex items-center h-full">
                        {docType === 'MACHINE' ? "SAAT" : docType === 'WATER' ? "LT" : "KG"}
                    </span>
                </ExcelCell>
                </div>
            </div>
          </div>
          
          <div className="mt-4 flex items-start gap-2 text-xs text-gray-500">
              <div className="w-4 h-4 mt-0.5 rounded-full bg-blue-600 flex items-center justify-center font-bold text-white">i</div>
              <p>Kayıt sonrası ilgili birimlere otomatik bildirim gidecektir.</p>
          </div>
        </div>

        <DialogFooter className="px-6 py-4 bg-gray-50 border-t border-gray-200 sm:justify-between">
          <div className="flex gap-2">
             <Button variant="outline" onClick={() => onOpenChange(false)} className="border-gray-300 text-gray-700">Vazgeç</Button>
             <Button variant="outline" onClick={onPrint} className="border-blue-200 text-blue-700 bg-blue-50 hover:bg-blue-100">
                <Printer className="w-4 h-4 mr-2" /> Yazdır
             </Button>
          </div>
          
          <div className="flex gap-2">
              <Button variant="secondary" onClick={() => onSubmit(true)} className="bg-white border border-gray-300 text-gray-700 hover:bg-gray-50">
                  Taslak Olarak Kaydet
              </Button>
              <Button onClick={() => onSubmit(false)} className="px-8 text-white hover:opacity-90 bg-blue-600 hover:bg-blue-700">
                  {docType === 'WASTE' ? 'Transferi Başlat' : 'Kayıt Oluştur'}
              </Button>
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
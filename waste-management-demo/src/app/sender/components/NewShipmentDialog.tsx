/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useState } from "react";
import { useMockData } from "@/context/MockDataContext";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tractor, Droplets, FileText, Printer, Upload, CheckCircle2, X, AlertTriangle, CheckCircle } from "lucide-react";
import { ExcelCell } from "./ExcelCell";
import { DocType } from "../page";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";

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
  
  // Belge yükleme state'i
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setUploadedFile(e.target.files[0]);
    }
  };

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
            <div className="flex flex-col lg:flex-row border-b border-gray-300">
                {/* Sol Taraf (Mavi Bölüm) */}
                <div className="lg:w-[35%] flex flex-col border-b lg:border-b-0 lg:border-r border-gray-300">
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

                {/* Orta Taraf (Kırmızı Bölüm - Form Bilgileri) */}
                <div className="lg:w-[40%] grid grid-cols-2 grid-rows-2 border-r border-gray-300">
                        <div className="h-24 border-b border-r border-gray-200">
                          <ExcelCell label="TARİH" headerClass="bg-red-50 text-red-700">
                              <Input type="date" value={formData.plannedDate} onChange={(e) => setFormData({...formData, plannedDate: e.target.value})} className="border-0 shadow-none focus-visible:ring-0 px-0 h-full text-gray-900 bg-transparent w-full font-medium" />
                          </ExcelCell>
                        </div>
                        
                        {/* GÜNCELLEME: YAZILABİLİR ARAÇ PLAKASI (DATALIST) */}
                        <div className="h-24 border-b border-gray-200 relative">
                          <ExcelCell label="ARAÇ PLAKASI" headerClass="bg-red-50 text-red-700">
                              <Input 
                                list="vehicle-list" 
                                className="border-0 shadow-none focus-visible:ring-0 px-0 h-full flex items-center font-mono font-bold text-gray-900 bg-transparent text-lg uppercase placeholder:text-gray-300"
                                placeholder="PLAKA" 
                                value={formData.vehiclePlate} 
                                onChange={(e) => {
                                   // Eğer listeden seçilirse otomatik şoförü doldur
                                   const val = e.target.value.toUpperCase();
                                   const vehicle = vehicles.find(v => v.plate === val);
                                   setFormData({
                                      ...formData, 
                                      vehiclePlate: val, 
                                      driverName: vehicle?.driverName || formData.driverName 
                                   });
                                }} 
                              />
                              <datalist id="vehicle-list">
                                {vehicles.map(v => (
                                  <option key={v.id} value={v.plate}>{v.driverName}</option>
                                ))}
                              </datalist>
                          </ExcelCell>
                        </div>
                        
                        {/* GÜNCELLEME: YAZILABİLİR SÜRÜCÜ ADI (DATALIST) */}
                        <div className="h-24 border-r border-gray-200 text-xs">
                          <ExcelCell label="SÜRÜCÜ ADI SOYADI" headerClass="bg-red-50 text-red-700">
                              <Input 
                                list="driver-list" 
                                placeholder="İsim Giriniz" 
                                value={formData.driverName} 
                                onChange={(e) => setFormData({...formData, driverName: e.target.value})} 
                                className="border-0 shadow-none focus-visible:ring-0 px-0 h-full text-gray-900 placeholder:text-gray-300 font-medium" 
                              />
                               <datalist id="driver-list">
                                {vehicles.map(v => (
                                  <option key={v.id} value={v.driverName}>{v.plate}</option>
                                ))}
                              </datalist>
                          </ExcelCell>
                        </div>
                        
                        {/* GÜNCELLEME: TRANSFER TÜRÜ RADYO BUTONLARI */}
                        <div className="h-24">
                          <ExcelCell label="TRANSFER TÜRÜ" headerClass="bg-red-50 text-red-700">
                             {docType === 'WASTE' ? (
                                <RadioGroup 
                                    value={formData.transferType || "NON_HAZARDOUS"} 
                                    onValueChange={(val) => setFormData({...formData, transferType: val})}
                                    className="flex flex-col justify-center h-full gap-1.5 w-full"
                                >
                                    <div className="flex items-center space-x-2">
                                        <RadioGroupItem value="HAZARDOUS" id="r1" className="text-red-600 border-red-400 w-3.5 h-3.5" />
                                        <Label htmlFor="r1" className="cursor-pointer flex items-center gap-1 text-[10px] font-bold text-red-700">
                                            <AlertTriangle className="w-3 h-3" /> Tehlikeli
                                        </Label>
                                    </div>
                                    <div className="flex items-center space-x-2">
                                        <RadioGroupItem value="NON_HAZARDOUS" id="r2" className="text-green-600 border-green-400 w-3.5 h-3.5" />
                                        <Label htmlFor="r2" className="cursor-pointer flex items-center gap-1 text-[10px] font-bold text-green-700">
                                            <CheckCircle className="w-3 h-3" /> Tehlikesiz
                                        </Label>
                                    </div>
                                </RadioGroup>
                             ) : (
                                <span className="text-gray-500 text-xs font-medium w-full flex items-center h-full">
                                    {docType === 'MACHINE' ? "Nakliye / Lowbed" : "Tanker Transferi"}
                                </span>
                             )}
                          </ExcelCell>
                        </div>
                </div>

                {/* Sağ Taraf (Belge Yükleme Alanı) */}
                <div className="lg:w-[25%] bg-gray-50/50 flex flex-col">
                <ExcelCell label="BEYAN / BELGE YÜKLE" headerClass="bg-orange-50 text-orange-700">
                    <div className="flex flex-col items-center justify-center h-full w-full py-2 min-h-[80px]">
                    {uploadedFile ? (
                        <div className="flex flex-col items-center justify-center gap-1 text-center">
                        <CheckCircle2 className="h-8 w-8 text-green-600" />
                        <span className="text-[10px] font-medium text-green-800 truncate max-w-[120px] block">
                            {uploadedFile.name}
                        </span>
                        <button 
                            onClick={() => setUploadedFile(null)} 
                            className="text-[9px] text-red-500 flex items-center justify-center gap-0.5 hover:underline mt-1"
                        >
                            <X className="h-3 w-3" /> Kaldır
                        </button>
                        </div>
                    ) : (
                        <div className="relative group cursor-pointer flex flex-col items-center justify-center w-full h-full text-center">
                        <Upload className="h-8 w-8 text-orange-400 group-hover:text-orange-600 transition-colors" />
                        <span className="text-[10px] text-orange-600 font-bold mt-1 uppercase">Dosya Seç</span>
                        <Input 
                            type="file" 
                            className="absolute inset-0 opacity-0 cursor-pointer w-full h-full" 
                            onChange={handleFileChange}
                            accept=".pdf,.jpg,.jpeg,.png"
                        />
                        </div>
                    )}
                    </div>
                </ExcelCell>
                </div>
            </div>

            {/* Yeşil Bölüm (Dinamik - Alt Satır) */}
            <div className="flex w-full min-h-[80px]">
                {docType === 'WASTE' && (
                <>
                    <div className="w-[15%] border-r border-gray-200">
                    <ExcelCell label="ATIK KODU" headerClass="bg-green-50 text-green-700">
                        <Select value={formData.wasteCode} onValueChange={(val) => setFormData({...formData, wasteCode: val})}>
                        <SelectTrigger className="border-0 shadow-none focus:ring-0 px-0 h-full flex items-center font-mono font-bold text-gray-900 bg-transparent"><SelectValue placeholder="------" /></SelectTrigger>
                        <SelectContent>{wasteTypes.map((w: any) => (<SelectItem key={w.code} value={w.code}>{w.code}</SelectItem>))}</SelectContent>
                        </Select>
                    </ExcelCell>
                    </div>
                    <div className="w-[30%] border-r border-gray-200">
                    <ExcelCell label="ATIK TANIMI" headerClass="bg-green-50 text-green-700">
                        <div className="text-[11px] text-gray-700 py-1 leading-tight flex items-center h-full font-medium">{selectedWaste ? selectedWaste.name : "..."}</div>
                    </ExcelCell>
                    </div>
                    <div className="w-[20%] border-r border-gray-200">
                    <ExcelCell label="AMBALAJ TÜRÜ" headerClass="bg-green-50 text-green-700">
                        <Select value={formData.packagingType} onValueChange={(val) => setFormData({...formData, packagingType: val})}>
                        <SelectTrigger className="border-0 shadow-none focus:ring-0 px-0 h-full flex items-center font-medium text-gray-900 bg-transparent text-xs"><SelectValue placeholder="Seçiniz" /></SelectTrigger>
                        <SelectContent><SelectItem value="IBC">IBC Tank</SelectItem><SelectItem value="Varil">Varil</SelectItem><SelectItem value="Plastik">Plastik Bidon</SelectItem><SelectItem value="Dökme">Dökme</SelectItem></SelectContent>
                        </Select>
                    </ExcelCell>
                    </div>
                </>
                )}
                
                {docType === 'MACHINE' && (
                  <>
                     <div className="w-[45%] border-r border-gray-200">
                       <ExcelCell label="İŞ MAKİNASI" headerClass="bg-green-50 text-green-700">
                         <Input placeholder="Örn: CAT 320 Ekskavatör" value={formData.machineName} onChange={(e) => setFormData({...formData, machineName: e.target.value})} className="border-0 h-full font-medium" />
                       </ExcelCell>
                     </div>
                     <div className="w-[20%] border-r border-gray-200">
                       <ExcelCell label="YAPILAN İŞ" headerClass="bg-green-50 text-green-700">
                         <Input placeholder="Saha Düzenleme" value={formData.workDescription} onChange={(e) => setFormData({...formData, workDescription: e.target.value})} className="border-0 h-full text-xs" />
                       </ExcelCell>
                     </div>
                  </>
                )}

                {docType === 'WATER' && (
                  <>
                     <div className="w-[25%] border-r border-gray-200">
                       <ExcelCell label="KAYNAK" headerClass="bg-green-50 text-green-700">
                         <Input placeholder="Kuyu-3" value={formData.waterSource} onChange={(e) => setFormData({...formData, waterSource: e.target.value})} className="border-0 h-full font-medium" />
                       </ExcelCell>
                     </div>
                     <div className="w-[20%] border-r border-gray-200">
                       <ExcelCell label="KLOR (ppm)" headerClass="bg-green-50 text-green-700">
                         <Input placeholder="0.5" value={formData.chlorineLevel} onChange={(e) => setFormData({...formData, chlorineLevel: e.target.value})} className="border-0 h-full text-center" />
                       </ExcelCell>
                     </div>
                     <div className="w-[20%] border-r border-gray-200">
                       <ExcelCell label="pH" headerClass="bg-green-50 text-green-700">
                         <Input placeholder="7.2" value={formData.phLevel} onChange={(e) => setFormData({...formData, phLevel: e.target.value})} className="border-0 h-full text-center" />
                       </ExcelCell>
                     </div>
                  </>
                )}
                
                <div className="w-[20%] border-r border-gray-200">
                <ExcelCell label="MİKTAR" headerClass="bg-green-50 text-green-700">
                    <Input 
                      type="number" 
                      placeholder="0.00" 
                      value={docType === 'MACHINE' ? formData.workHours : formData.amount} 
                      onChange={(e) => {
                          const val = e.target.value;
                          setFormData({...formData, amount: val, workHours: val})
                      }} 
                      className="border-0 shadow-none focus-visible:ring-0 px-0 h-full text-right font-bold text-lg text-gray-900" 
                    />
                </ExcelCell>
                </div>
                <div className="flex-1">
                <ExcelCell label="BİRİM" headerClass="bg-green-50 text-green-700">
                    <span className="text-sm font-bold text-gray-900 flex items-center justify-center h-full w-full">
                        {docType === 'MACHINE' ? "SAAT" : docType === 'WATER' ? "LT" : "KG"}
                    </span>
                </ExcelCell>
                </div>
            </div>
          </div>
          
          <div className="mt-4 flex items-start gap-2 text-[11px] text-gray-500">
              <div className="w-4 h-4 mt-0.5 rounded-full bg-orange-600 flex items-center justify-center font-bold text-white shrink-0">!</div>
              <p>Belge yüklemesi yapılması, <b>Güvenlik</b> ve <b>Alıcı</b> birimlerinin doğruluğu teyit etmesi için zorunludur.</p>
          </div>
        </div>

        <DialogFooter className="px-6 py-4 bg-gray-50 border-t border-gray-200 sm:justify-between">
          <div className="flex gap-2">
             <Button variant="outline" onClick={() => onOpenChange(false)} className="border-gray-300 text-gray-700 h-9 text-xs font-bold">Vazgeç</Button>
             <Button variant="outline" onClick={onPrint} className="border-blue-200 text-blue-700 bg-blue-50 hover:bg-blue-100 h-9 text-xs font-bold">
                <Printer className="w-4 h-4 mr-2" /> Yazdır
             </Button>
          </div>
          
          <div className="flex gap-2">
              <Button variant="secondary" onClick={() => onSubmit(true)} className="bg-white border border-gray-300 text-gray-700 hover:bg-gray-50 h-9 text-xs font-bold">
                  Taslak Olarak Kaydet
              </Button>
              <Button 
                onClick={() => onSubmit(false)} 
                className="px-8 text-white h-9 text-xs font-bold shadow-lg transition-all bg-blue-600 hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
                disabled={!uploadedFile && !formData.isDraft}
              >
                  {docType === 'WASTE' ? 'Transferi Başlat' : 'Kayıt Oluştur'}
              </Button>
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
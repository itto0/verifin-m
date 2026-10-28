import React, { useState } from 'react';
import { ArrowLeft } from 'lucide-react';
import { ApplicationCase } from '../../types';
import { validateIndonesianNIK } from '../../utils/nikValidator';

interface OCRResultScreenProps {
  currentCase: ApplicationCase;
  sampleType: 'clean' | 'tampered';
  onBackToCamera: () => void;
  onConfirmForm: (formData: Record<string, string>) => void;
}

export function OCRResultScreen({
  currentCase,
  sampleType,
  onBackToCamera,
  onConfirmForm,
}: OCRResultScreenProps) {
  const isClean = sampleType === 'clean';

  const [formData, setFormData] = useState({
    nik: isClean ? '3273051408890002' : '3174025206920005',
    nama: isClean ? 'BUDI SANTOSO' : 'SITI RAHMAWATI',
    tempatTglLahir: isClean ? 'BANDUNG, 14-08-1989' : 'JAKARTA, 12-06-1992',
    jenisKelamin: isClean ? 'LAKI-LAKI' : 'PEREMPUAN',
    alamat: isClean ? 'JL. BUAH BATU NO. 142' : 'JL. RS FATMAWATI NO. 88',
    rtRw: isClean ? '003/007' : '005/002',
    pekerjaan: isClean ? 'KARYAWAN SWASTA' : 'WIRASWASTA',
  });

  const confidenceScores: Record<string, number> = isClean
    ? {
        nik: 99,
        nama: 98,
        tempatTglLahir: 98,
        jenisKelamin: 99,
        alamat: 96,
        rtRw: 95,
        pekerjaan: 96,
      }
    : {
        nik: 68,
        nama: 94,
        tempatTglLahir: 78,
        jenisKelamin: 98,
        alamat: 82,
        rtRw: 89,
        pekerjaan: 85,
      };

  const nikValidation = validateIndonesianNIK(formData.nik);
  const lowConfidenceCount = Object.values(confidenceScores).filter((s) => s < 90).length;

  const handleChange = (field: string, val: string) => {
    setFormData((prev) => ({ ...prev, [field]: val }));
  };

  return (
    <div className="flex-1 bg-[#FFFFFF] p-5 flex flex-col justify-between space-y-4">
      {/* Top Header */}
      <div className="flex items-center justify-between pb-3 border-b border-[#E5E5E3]">
        <div className="flex items-center gap-2">
          <button
            onClick={onBackToCamera}
            className="w-8 h-8 rounded-lg flex items-center justify-center text-[#1A1A1A] hover:bg-[#F7F7F5] border border-[#E5E5E3] transition-colors"
            aria-label="Kembali ke kamera"
          >
            <ArrowLeft className="w-4 h-4" />
          </button>
          <div>
            <h2 className="text-sm font-semibold text-[#1A1A1A]">Hasil OCR dokumen</h2>
            <div className="text-xs text-[#6B6B6B]">{currentCase.id}</div>
          </div>
        </div>

        <button
          onClick={onBackToCamera}
          className="text-xs text-[#2563EB] hover:underline"
        >
          Foto ulang
        </button>
      </div>

      {/* Clean, quiet notice for low confidence fields */}
      {lowConfidenceCount > 0 ? (
        <div className="text-xs text-[#1A1A1A] p-3 rounded-lg border border-[#FDE68A] bg-[#FFFBEB]">
          <div className="font-medium text-[#D97706] mb-0.5">
            {lowConfidenceCount} field dengan confidence rendah (&lt;90%)
          </div>
          <div className="text-[#6B6B6B] text-[11px] leading-relaxed">
            Field berlatar kuning terdeteksi memiliki ketidakpastian. Harap periksa dan koreksi data secara manual.
          </div>
        </div>
      ) : (
        <div className="text-xs text-[#6B6B6B] flex items-center gap-2">
          <span>Hasil ekstraksi otomatis terverifikasi</span>
          <span>·</span>
          <span>Akurasi rata-rata: 97%</span>
        </div>
      )}

      {/* Auto-filled form inputs */}
      <div className="space-y-3.5 flex-1 overflow-y-auto pr-0.5">
        {/* NIK Input */}
        <div>
          <div className="flex justify-between items-center text-xs mb-1">
            <label className="text-[#1A1A1A] font-medium">Nomor Induk Kependudukan (NIK)</label>
            <span className={`text-[11px] ${confidenceScores.nik < 90 ? 'text-[#D97706] font-medium' : 'text-[#6B6B6B]'}`}>
              {confidenceScores.nik}% confidence
            </span>
          </div>
          <input
            type="text"
            value={formData.nik}
            onChange={(e) => handleChange('nik', e.target.value)}
            maxLength={16}
            className={`w-full px-3 py-2 text-sm rounded-lg border transition-colors focus:outline-hidden ${
              confidenceScores.nik < 90
                ? 'bg-[#FFFBEB] border-[#FDE68A] text-[#1A1A1A] focus:border-[#D97706]'
                : 'bg-white border-[#E5E5E3] text-[#1A1A1A] focus:border-[#2563EB]'
            }`}
          />
          {confidenceScores.nik < 90 && (
            <div className="text-[11px] text-[#D97706] mt-1">
              Ketidaksesuaian font terdeteksi pada baris angka NIK.
            </div>
          )}
        </div>

        {/* NIK Validation unboxed text */}
        <div className="text-[11px] text-[#6B6B6B] py-1 border-y border-[#E5E5E3] flex flex-wrap gap-x-3 gap-y-1">
          <span>Wilayah: {nikValidation.provinceName}</span>
          <span>·</span>
          <span>Tgl lahir: {nikValidation.birthDate || '-'}</span>
          <span>·</span>
          <span>Gender: {nikValidation.gender}</span>
        </div>

        {/* Nama Lengkap */}
        <div>
          <div className="flex justify-between items-center text-xs mb-1">
            <label className="text-[#1A1A1A] font-medium">Nama lengkap</label>
            <span className="text-[11px] text-[#6B6B6B]">{confidenceScores.nama}% confidence</span>
          </div>
          <input
            type="text"
            value={formData.nama}
            onChange={(e) => handleChange('nama', e.target.value)}
            className="w-full px-3 py-2 text-sm rounded-lg border border-[#E5E5E3] bg-white text-[#1A1A1A] focus:border-[#2563EB] focus:outline-hidden"
          />
        </div>

        {/* Tempat Tanggal Lahir */}
        <div>
          <div className="flex justify-between items-center text-xs mb-1">
            <label className="text-[#1A1A1A] font-medium">Tempat, tanggal lahir</label>
            <span className={`text-[11px] ${confidenceScores.tempatTglLahir < 90 ? 'text-[#D97706] font-medium' : 'text-[#6B6B6B]'}`}>
              {confidenceScores.tempatTglLahir}% confidence
            </span>
          </div>
          <input
            type="text"
            value={formData.tempatTglLahir}
            onChange={(e) => handleChange('tempatTglLahir', e.target.value)}
            className={`w-full px-3 py-2 text-sm rounded-lg border transition-colors focus:outline-hidden ${
              confidenceScores.tempatTglLahir < 90
                ? 'bg-[#FFFBEB] border-[#FDE68A] text-[#1A1A1A] focus:border-[#D97706]'
                : 'bg-white border-[#E5E5E3] text-[#1A1A1A] focus:border-[#2563EB]'
            }`}
          />
        </div>

        {/* Alamat KTP */}
        <div>
          <div className="flex justify-between items-center text-xs mb-1">
            <label className="text-[#1A1A1A] font-medium">Alamat KTP</label>
            <span className={`text-[11px] ${confidenceScores.alamat < 90 ? 'text-[#D97706] font-medium' : 'text-[#6B6B6B]'}`}>
              {confidenceScores.alamat}% confidence
            </span>
          </div>
          <input
            type="text"
            value={formData.alamat}
            onChange={(e) => handleChange('alamat', e.target.value)}
            className={`w-full px-3 py-2 text-sm rounded-lg border transition-colors focus:outline-hidden ${
              confidenceScores.alamat < 90
                ? 'bg-[#FFFBEB] border-[#FDE68A] text-[#1A1A1A] focus:border-[#D97706]'
                : 'bg-white border-[#E5E5E3] text-[#1A1A1A] focus:border-[#2563EB]'
            }`}
          />
        </div>

        {/* RT/RW and Pekerjaan */}
        <div className="grid grid-cols-2 gap-3">
          <div>
            <div className="flex justify-between items-center text-xs mb-1">
              <label className="text-[#1A1A1A] font-medium">RT / RW</label>
              <span className="text-[11px] text-[#6B6B6B]">{confidenceScores.rtRw}%</span>
            </div>
            <input
              type="text"
              value={formData.rtRw}
              onChange={(e) => handleChange('rtRw', e.target.value)}
              className={`w-full px-3 py-2 text-sm rounded-lg border transition-colors focus:outline-hidden ${
                confidenceScores.rtRw < 90 ? 'bg-[#FFFBEB] border-[#FDE68A]' : 'bg-white border-[#E5E5E3]'
              }`}
            />
          </div>
          <div>
            <div className="flex justify-between items-center text-xs mb-1">
              <label className="text-[#1A1A1A] font-medium">Pekerjaan</label>
              <span className="text-[11px] text-[#6B6B6B]">{confidenceScores.pekerjaan}%</span>
            </div>
            <input
              type="text"
              value={formData.pekerjaan}
              onChange={(e) => handleChange('pekerjaan', e.target.value)}
              className={`w-full px-3 py-2 text-sm rounded-lg border transition-colors focus:outline-hidden ${
                confidenceScores.pekerjaan < 90 ? 'bg-[#FFFBEB] border-[#FDE68A]' : 'bg-white border-[#E5E5E3]'
              }`}
            />
          </div>
        </div>
      </div>

      {/* Actions */}
      <div className="pt-3 border-t border-[#E5E5E3] flex gap-3">
        <button
          onClick={onBackToCamera}
          className="flex-1 py-2.5 px-4 border border-[#E5E5E3] text-[#1A1A1A] hover:bg-[#F7F7F5] rounded-lg text-sm font-medium transition-colors"
        >
          Foto ulang
        </button>
        <button
          onClick={() => onConfirmForm(formData)}
          className="flex-1 py-2.5 px-4 bg-[#2563EB] hover:bg-blue-700 text-white rounded-lg text-sm font-medium transition-colors"
        >
          Konfirmasi & simpan
        </button>
      </div>
    </div>
  );
}

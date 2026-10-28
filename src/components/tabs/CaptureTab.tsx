import React, { useState } from 'react';
import { ApplicationCase, DocumentScan } from '../../types';
import { validateIndonesianNIK } from '../../utils/nikValidator';
import { AuthenticEKTPGraphic, TamperedEKTPGraphic, KartuKeluargaGraphic, STNKGraphic } from '../common/DocumentGraphics';

interface CaptureTabProps {
  currentCase: ApplicationCase;
  onUpdateCaseScan: (scannedDoc: DocumentScan) => void;
}

export function CaptureTab({ currentCase }: CaptureTabProps) {
  const [selectedDocIndex, setSelectedDocIndex] = useState(0);
  const [isScanningActive, setIsScanningActive] = useState(false);
  const [customNikInput, setCustomNikInput] = useState(currentCase.nik);

  const activeDoc = currentCase.documentScans[selectedDocIndex] || currentCase.documentScans[0];
  const nikAnalysis = validateIndonesianNIK(customNikInput || currentCase.nik);

  const handleSimulateScan = () => {
    setIsScanningActive(true);
    setTimeout(() => {
      setIsScanningActive(false);
    }, 600);
  };

  return (
    <div className="p-4 space-y-4">
      {/* Header case summary */}
      <div className="flex justify-between items-center text-xs pb-2 border-b border-[#E5E5E3]">
        <div>
          <span className="text-[#6B6B6B]">Kasus aktif: </span>
          <span className="font-semibold text-[#1A1A1A]">{currentCase.applicantName}</span>
          <span className="text-[#6B6B6B] ml-1">({currentCase.id})</span>
        </div>
        <button
          onClick={handleSimulateScan}
          disabled={isScanningActive}
          className="px-2.5 py-1 text-xs border border-[#E5E5E3] rounded-md text-[#1A1A1A] hover:bg-[#F7F7F5] transition-colors"
        >
          {isScanningActive ? 'Memindai...' : 'Ulangi OCR'}
        </button>
      </div>

      {/* Document Selector - clean text buttons */}
      <div className="flex items-center gap-1.5 overflow-x-auto pb-1 text-xs">
        {currentCase.documentScans.map((doc, idx) => (
          <button
            key={doc.id}
            onClick={() => {
              setSelectedDocIndex(idx);
              if (doc.fields.nik) {
                setCustomNikInput(doc.fields.nik.value);
              }
            }}
            className={`px-3 py-1.5 rounded-md transition-colors whitespace-nowrap ${
              selectedDocIndex === idx
                ? 'bg-[#1A1A1A] text-white font-medium'
                : 'text-[#6B6B6B] hover:text-[#1A1A1A] border border-[#E5E5E3]'
            }`}
          >
            {doc.title}
          </button>
        ))}
      </div>

      {/* Document Graphic Container */}
      <div className="border border-[#E5E5E3] rounded-xl p-4 bg-white space-y-3">
        <div className="flex justify-between items-center text-xs">
          <span className="font-medium text-[#1A1A1A]">Citra dokumen</span>
          <span className="text-[#6B6B6B]">{activeDoc?.scanDate}</span>
        </div>

        <div>
          {activeDoc?.imageThumbnail === 'ktp_budi_santoso' && <AuthenticEKTPGraphic />}
          {activeDoc?.imageThumbnail === 'ktp_siti_tampered' && <TamperedEKTPGraphic />}
          {activeDoc?.imageThumbnail === 'kk_budi_santoso' && <KartuKeluargaGraphic />}
          {activeDoc?.imageThumbnail === 'slip_gaji_budi' && <STNKGraphic />}
          {!['ktp_budi_santoso', 'ktp_siti_tampered', 'kk_budi_santoso', 'slip_gaji_budi'].includes(activeDoc?.imageThumbnail || '') && (
            <AuthenticEKTPGraphic />
          )}
        </div>

        {/* Quality check unboxed text */}
        <div className="text-[11px] text-[#6B6B6B] pt-2 border-t border-[#E5E5E3] flex justify-between">
          <span>Kualitas citra: {activeDoc?.qualityCheck.lightingScore}%</span>
          <span>·</span>
          <span>Fokus: {activeDoc?.qualityCheck.isBlur ? 'Buram' : 'Tajam'}</span>
          <span>·</span>
          <span>Silau: {activeDoc?.qualityCheck.isGlare ? 'Ada' : 'Tidak ada'}</span>
        </div>
      </div>

      {/* Tamper Detection Summary */}
      <div className="border border-[#E5E5E3] rounded-xl p-4 bg-white space-y-2 text-xs">
        <div className="flex justify-between items-center">
          <span className="font-semibold text-[#1A1A1A]">Analisis integritas fisik</span>
          <span className={`font-medium ${activeDoc?.tamperResult.isTampered ? 'text-[#DC2626]' : 'text-[#16A34A]'}`}>
            {activeDoc?.tamperResult.isTampered ? 'Indikasi manipulasi' : 'Asli'}
          </span>
        </div>

        <div className="space-y-1.5 text-[11px] text-[#6B6B6B]">
          {Object.entries(activeDoc?.tamperResult.checks || {}).map(([key, check]) => (
            <div key={key} className="flex justify-between py-0.5 border-b border-[#E5E5E3] last:border-0">
              <span className="text-[#1A1A1A]">
                {key === 'screenRecapture' && 'Deteksi foto layar (moiré)'}
                {key === 'fontInconsistency' && 'Konsistensi font NIK'}
                {key === 'photoSubstitution' && 'Tempelan foto'}
                {key === 'copyArtifacts' && 'Artefak fotokopi'}
              </span>
              <span className={check.detected ? 'text-[#DC2626] font-medium' : 'text-[#16A34A]'}>
                {check.detected ? 'Terdeteksi' : 'Lolos'}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* NIK Structure Verification */}
      <div className="border border-[#E5E5E3] rounded-xl p-4 bg-white space-y-2 text-xs">
        <div className="flex justify-between items-center">
          <span className="font-semibold text-[#1A1A1A]">Validasi NIK Dukcapil</span>
          <span className={nikAnalysis.isValid ? 'text-[#16A34A] font-medium' : 'text-[#DC2626] font-medium'}>
            {nikAnalysis.isValid ? 'Valid' : 'Format salah'}
          </span>
        </div>

        <div className="text-[11px] text-[#6B6B6B] space-y-1 pt-1 border-t border-[#E5E5E3]">
          <div className="flex justify-between">
            <span>Provinsi / Kota:</span>
            <span className="text-[#1A1A1A]">{nikAnalysis.provinceName} / {nikAnalysis.regencyName}</span>
          </div>
          <div className="flex justify-between">
            <span>Tanggal lahir / Gender:</span>
            <span className="text-[#1A1A1A]">{nikAnalysis.birthDate || '-'} ({nikAnalysis.gender})</span>
          </div>
        </div>
      </div>

      {/* OCR Fields List with <90% Yellow Field Rule */}
      <div className="border border-[#E5E5E3] rounded-xl p-4 bg-white space-y-2 text-xs">
        <div className="flex justify-between items-center">
          <span className="font-semibold text-[#1A1A1A]">Data field hasil OCR</span>
          <span className="text-[11px] text-[#6B6B6B]">Kuning = confidence &lt; 90%</span>
        </div>

        <div className="space-y-1.5 pt-1">
          {Object.entries(activeDoc?.fields || {}).map(([key, field]) => {
            const isLow = field.confidence < 90;
            return (
              <div
                key={key}
                className={`p-2 rounded-lg border text-xs flex justify-between items-center ${
                  isLow ? 'bg-[#FFFBEB] border-[#FDE68A]' : 'bg-white border-[#E5E5E3]'
                }`}
              >
                <div>
                  <div className="text-[10px] text-[#6B6B6B]">{field.label}</div>
                  <div className="font-medium text-[#1A1A1A]">{field.value}</div>
                </div>
                <span className={`text-[11px] ${isLow ? 'text-[#D97706] font-medium' : 'text-[#6B6B6B]'}`}>
                  {field.confidence}%
                </span>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

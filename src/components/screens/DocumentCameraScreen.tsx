import React, { useState } from 'react';
import { ArrowLeft, Camera } from 'lucide-react';
import { ApplicationCase } from '../../types';
import { AuthenticEKTPGraphic, TamperedEKTPGraphic, KartuKeluargaGraphic, STNKGraphic } from '../common/DocumentGraphics';

interface DocumentCameraScreenProps {
  currentCase: ApplicationCase;
  onBack: () => void;
  onProceedToOCR: (sampleType: 'clean' | 'tampered') => void;
}

export function DocumentCameraScreen({
  currentCase,
  onBack,
  onProceedToOCR,
}: DocumentCameraScreenProps) {
  const [docType, setDocType] = useState<'ktp' | 'kk' | 'stnk'>('ktp');
  const [selectedSample, setSelectedSample] = useState<'clean' | 'tampered'>('clean');
  const [isCapturing, setIsCapturing] = useState(false);

  const handleCapture = () => {
    setIsCapturing(true);
    setTimeout(() => {
      setIsCapturing(false);
      onProceedToOCR(selectedSample);
    }, 400);
  };

  return (
    <div className="flex-1 bg-[#1A1A1A] text-white flex flex-col justify-between select-none">
      {/* Top Bar */}
      <div className="px-4 py-3 flex items-center justify-between border-b border-white/10">
        <button
          onClick={onBack}
          className="w-8 h-8 rounded-lg flex items-center justify-center text-white/80 hover:text-white hover:bg-white/10 transition-colors"
          aria-label="Kembali"
        >
          <ArrowLeft className="w-4 h-4" />
        </button>

        <div className="text-center">
          <div className="text-xs font-medium text-white">Scan dokumen</div>
          <div className="text-[11px] text-white/50">{currentCase.applicantName}</div>
        </div>

        <div className="w-8" />
      </div>

      {/* Viewfinder Area */}
      <div className="flex-1 px-6 py-4 flex flex-col items-center justify-center space-y-4">
        <div className="text-xs text-white/70 text-center">
          Posisikan e-KTP di dalam batas bingkai
        </div>

        {/* Clean, minimalist framing box */}
        <div className="w-full max-w-[320px] aspect-[85.6/53.98] relative rounded-lg border border-white/40 p-1 flex items-center justify-center">
          {/* Subtle corner ticks */}
          <div className="absolute top-0 left-0 w-3 h-3 border-t-2 border-l-2 border-white" />
          <div className="absolute top-0 right-0 w-3 h-3 border-t-2 border-r-2 border-white" />
          <div className="absolute bottom-0 left-0 w-3 h-3 border-b-2 border-l-2 border-white" />
          <div className="absolute bottom-0 right-0 w-3 h-3 border-b-2 border-r-2 border-white" />

          {/* Document Graphic */}
          <div className="w-full h-full opacity-90">
            {docType === 'ktp' && (
              selectedSample === 'clean' ? <AuthenticEKTPGraphic /> : <TamperedEKTPGraphic />
            )}
            {docType === 'kk' && <KartuKeluargaGraphic />}
            {docType === 'stnk' && <STNKGraphic />}
          </div>

          {/* Flash */}
          {isCapturing && (
            <div className="absolute inset-0 bg-white/80 rounded-lg animate-pulse" />
          )}
        </div>

        {/* Quality indicator as clean text with dots (Zero-Pill) */}
        <div className="text-[11px] text-white/50 flex items-center gap-2">
          <span>Fokus stabil</span>
          <span>·</span>
          <span>Bebas silau</span>
          <span>·</span>
          <span>4 Sudut pas</span>
        </div>
      </div>

      {/* Controls Bar */}
      <div className="p-4 bg-black/40 border-t border-white/10 space-y-4">
        {/* Document type selection */}
        <div className="flex justify-center gap-2 text-xs">
          <button
            onClick={() => setDocType('ktp')}
            className={`px-3 py-1.5 rounded-md transition-colors ${
              docType === 'ktp' ? 'bg-white text-[#1A1A1A] font-medium' : 'text-white/60 hover:text-white'
            }`}
          >
            e-KTP
          </button>
          <button
            onClick={() => setDocType('kk')}
            className={`px-3 py-1.5 rounded-md transition-colors ${
              docType === 'kk' ? 'bg-white text-[#1A1A1A] font-medium' : 'text-white/60 hover:text-white'
            }`}
          >
            Kartu Keluarga
          </button>
          <button
            onClick={() => setDocType('stnk')}
            className={`px-3 py-1.5 rounded-md transition-colors ${
              docType === 'stnk' ? 'bg-white text-[#1A1A1A] font-medium' : 'text-white/60 hover:text-white'
            }`}
          >
            STNK
          </button>
        </div>

        {/* Clean test switcher */}
        <div className="flex items-center justify-between text-xs text-white/60 px-2">
          <span>Kondisi sampel:</span>
          <div className="flex gap-2">
            <button
              onClick={() => setSelectedSample('clean')}
              className={`text-xs ${selectedSample === 'clean' ? 'text-white font-medium underline' : 'text-white/50 hover:text-white'}`}
            >
              Asli
            </button>
            <span>/</span>
            <button
              onClick={() => setSelectedSample('tampered')}
              className={`text-xs ${selectedSample === 'tampered' ? 'text-white font-medium underline' : 'text-white/50 hover:text-white'}`}
            >
              Foto layar
            </button>
          </div>
        </div>

        {/* Minimalist Shutter */}
        <div className="flex justify-center pb-2">
          <button
            onClick={handleCapture}
            disabled={isCapturing}
            className="w-14 h-14 rounded-full border-2 border-white flex items-center justify-center hover:opacity-90 active:scale-95 transition-all"
            aria-label="Ambil foto"
          >
            <div className="w-11 h-11 rounded-full bg-white" />
          </button>
        </div>
      </div>
    </div>
  );
}

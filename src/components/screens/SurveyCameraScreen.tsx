import React, { useState } from 'react';
import { ArrowLeft } from 'lucide-react';
import { ApplicationCase, SurveyPhoto } from '../../types';
import { HouseSurveyGraphic } from '../common/DocumentGraphics';

interface SurveyCameraScreenProps {
  currentCase: ApplicationCase;
  onBack: () => void;
  onPhotoCaptured: (photo: SurveyPhoto) => void;
  onProceedToSummary: () => void;
}

export function SurveyCameraScreen({
  currentCase,
  onBack,
  onPhotoCaptured,
  onProceedToSummary,
}: SurveyCameraScreenProps) {
  const [distanceMeters, setDistanceMeters] = useState(currentCase.distanceToApplicantMeters);
  const [isMockDetected, setIsMockDetected] = useState(currentCase.isMockLocationActive);
  const [category, setCategory] = useState<'house_front' | 'meter_electric' | 'street_view' | 'vehicle_unit'>('house_front');
  const [isCapturing, setIsCapturing] = useState(false);
  const [capturedCount, setCapturedCount] = useState(currentCase.surveyPhotos.length);

  const geofenceStatus = distanceMeters <= 200 ? 'valid' : distanceMeters <= 1000 ? 'warning' : 'danger';

  const categoryLabels: Record<string, string> = {
    house_front: 'Rumah tampak depan',
    meter_electric: 'Meteran listrik PLN',
    street_view: 'Jalan lingkungan',
    vehicle_unit: 'Unit kendaraan',
  };

  const handleCapture = () => {
    setIsCapturing(true);
    setTimeout(() => {
      setIsCapturing(false);
      setCapturedCount((prev) => prev + 1);

      const now = new Date();
      const timeStr = now.toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' }) + ' WIB';
      const dateStr = now.toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' });

      const newPhoto: SurveyPhoto = {
        id: `surv-live-${Date.now()}`,
        category,
        categoryLabel: categoryLabels[category],
        capturedAt: `${dateStr} · ${timeStr}`,
        imageThumbnail: 'house_buah_batu',
        location: {
          latitude: currentCase.registeredCoordinate.latitude + (distanceMeters / 111000),
          longitude: currentCase.registeredCoordinate.longitude,
          accuracyMeters: isMockDetected ? 28.5 : 3.8,
          address: currentCase.registeredAddress,
          timestamp: new Date().toISOString(),
        },
        watermarkText: `BAF · LAT: ${currentCase.registeredCoordinate.latitude.toFixed(5)} · ${dateStr} ${timeStr}`,
        isMockLocationDetected: isMockDetected,
        deviceIntegrityPassed: !isMockDetected,
      };

      onPhotoCaptured(newPhoto);
    }, 400);
  };

  return (
    <div className="flex-1 bg-[#1A1A1A] text-white flex flex-col justify-between select-none">
      {/* Top Header */}
      <div className="px-4 py-3 border-b border-white/10 flex items-center justify-between">
        <button
          onClick={onBack}
          className="w-8 h-8 rounded-lg flex items-center justify-center text-white/80 hover:text-white hover:bg-white/10 transition-colors"
          aria-label="Kembali"
        >
          <ArrowLeft className="w-4 h-4" />
        </button>

        <div className="text-center">
          <div className="text-xs font-medium text-white">Kamera survei fisik</div>
          <div className="text-[11px] text-white/50">{currentCase.applicantName}</div>
        </div>

        <button
          onClick={onProceedToSummary}
          className="text-xs text-white/90 hover:text-white underline font-medium"
        >
          Selesai ({capturedCount})
        </button>
      </div>

      {/* Viewfinder area with quiet metadata */}
      <div className="flex-1 px-4 py-3 flex flex-col items-center justify-center space-y-3">
        {/* Real coordinates & distance overlay banner */}
        <div className="w-full max-w-[340px] text-xs py-2 px-3 rounded-lg bg-black/60 border border-white/10 text-white/90 space-y-1">
          <div className="flex justify-between items-center text-[11px]">
            <span>Koordinat:</span>
            <span className="text-white/80">
              {(currentCase.registeredCoordinate.latitude + (distanceMeters / 111000)).toFixed(5)}, {currentCase.registeredCoordinate.longitude.toFixed(5)}
            </span>
          </div>

          <div className="flex justify-between items-center text-[11px]">
            <span>Jarak ke alamat:</span>
            <span className={`font-medium ${
              geofenceStatus === 'valid' ? 'text-[#16A34A]' : geofenceStatus === 'warning' ? 'text-[#D97706]' : 'text-[#DC2626]'
            }`}>
              {distanceMeters} m ({geofenceStatus === 'valid' ? '&lt;200 m' : geofenceStatus === 'warning' ? '200 m - 1 km' : '&gt;1 km'})
            </span>
          </div>

          {isMockDetected && (
            <div className="text-[11px] text-[#DC2626] font-medium pt-0.5 border-t border-white/10">
              Peringatan: Mock location terdeteksi pada perangkat
            </div>
          )}
        </div>

        {/* Viewfinder preview */}
        <div className="w-full max-w-[340px] relative rounded-lg overflow-hidden border border-white/20">
          <HouseSurveyGraphic
            isMock={isMockDetected}
            lat={currentCase.registeredCoordinate.latitude + (distanceMeters / 111000)}
            lng={currentCase.registeredCoordinate.longitude}
            address={currentCase.registeredAddress}
          />

          {isCapturing && (
            <div className="absolute inset-0 bg-white/70 animate-pulse" />
          )}
        </div>

        {/* Minimal simulation controls */}
        <div className="w-full max-w-[340px] flex items-center justify-between text-xs text-white/50 px-1">
          <span>Simulasi jarak:</span>
          <div className="flex gap-2">
            <button
              onClick={() => setDistanceMeters(85)}
              className={`text-xs ${distanceMeters === 85 ? 'text-white font-medium underline' : 'text-white/50 hover:text-white'}`}
            >
              85m
            </button>
            <span>/</span>
            <button
              onClick={() => setDistanceMeters(480)}
              className={`text-xs ${distanceMeters === 480 ? 'text-white font-medium underline' : 'text-white/50 hover:text-white'}`}
            >
              480m
            </button>
            <span>/</span>
            <button
              onClick={() => setDistanceMeters(1840)}
              className={`text-xs ${distanceMeters === 1840 ? 'text-white font-medium underline' : 'text-white/50 hover:text-white'}`}
            >
              1.8km
            </button>
          </div>
        </div>
      </div>

      {/* Bottom Category Selector & Shutter */}
      <div className="p-4 bg-black/40 border-t border-white/10 space-y-4">
        {/* Category buttons */}
        <div className="flex gap-1.5 overflow-x-auto pb-1 text-xs justify-center">
          <button
            onClick={() => setCategory('house_front')}
            className={`px-3 py-1 rounded-md transition-colors whitespace-nowrap ${
              category === 'house_front' ? 'bg-white text-[#1A1A1A] font-medium' : 'text-white/60 hover:text-white'
            }`}
          >
            Rumah depan
          </button>
          <button
            onClick={() => setCategory('meter_electric')}
            className={`px-3 py-1 rounded-md transition-colors whitespace-nowrap ${
              category === 'meter_electric' ? 'bg-white text-[#1A1A1A] font-medium' : 'text-white/60 hover:text-white'
            }`}
          >
            Meteran listrik
          </button>
          <button
            onClick={() => setCategory('street_view')}
            className={`px-3 py-1 rounded-md transition-colors whitespace-nowrap ${
              category === 'street_view' ? 'bg-white text-[#1A1A1A] font-medium' : 'text-white/60 hover:text-white'
            }`}
          >
            Lingkungan
          </button>
          <button
            onClick={() => setCategory('vehicle_unit')}
            className={`px-3 py-1 rounded-md transition-colors whitespace-nowrap ${
              category === 'vehicle_unit' ? 'bg-white text-[#1A1A1A] font-medium' : 'text-white/60 hover:text-white'
            }`}
          >
            Unit BAF
          </button>
        </div>

        {/* Minimalist Shutter */}
        <div className="flex justify-center pb-2">
          <button
            onClick={handleCapture}
            disabled={isCapturing}
            className="w-14 h-14 rounded-full border-2 border-white flex items-center justify-center hover:opacity-90 active:scale-95 transition-all"
            aria-label="Ambil foto survei"
          >
            <div className="w-11 h-11 rounded-full bg-white" />
          </button>
        </div>
      </div>
    </div>
  );
}

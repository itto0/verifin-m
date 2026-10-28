import React, { useState } from 'react';
import { Camera } from 'lucide-react';
import { ApplicationCase, SurveyPhoto } from '../../types';
import { HouseSurveyGraphic } from '../common/DocumentGraphics';

interface SurveyTabProps {
  currentCase: ApplicationCase;
  onAddSurveyPhoto: (photo: SurveyPhoto) => void;
}

export function SurveyTab({ currentCase, onAddSurveyPhoto }: SurveyTabProps) {
  const [distanceMeters, setDistanceMeters] = useState(currentCase.distanceToApplicantMeters);
  const [isMockDetected, setIsMockDetected] = useState(currentCase.isMockLocationActive);
  const [activePhotoCategory, setActivePhotoCategory] = useState<'house_front' | 'street_view' | 'meter_electric' | 'vehicle_unit'>('house_front');
  const [checklistState, setChecklistState] = useState(
    currentCase.surveyChecklist.reduce((acc, item) => {
      acc[item.id] = item.answer || 'yes';
      return acc;
    }, {} as Record<string, 'yes' | 'no' | 'unverified'>)
  );
  const [isCapturing, setIsCapturing] = useState(false);

  const geofenceStatus = distanceMeters <= 200 ? 'valid' : distanceMeters <= 1000 ? 'warning' : 'danger';

  const handleCapturePhoto = () => {
    setIsCapturing(true);
    setTimeout(() => {
      const now = new Date();
      const timeStr = now.toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' }) + ' WIB';
      const dateStr = now.toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' });

      const newPhoto: SurveyPhoto = {
        id: `surv-live-${Date.now()}`,
        category: activePhotoCategory,
        categoryLabel:
          activePhotoCategory === 'house_front'
            ? 'Rumah tampak depan'
            : activePhotoCategory === 'meter_electric'
            ? 'Meteran listrik PLN'
            : activePhotoCategory === 'street_view'
            ? 'Jalan lingkungan'
            : 'Unit kendaraan',
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

      onAddSurveyPhoto(newPhoto);
      setIsCapturing(false);
    }, 400);
  };

  return (
    <div className="p-4 space-y-4">
      {/* Surveyor Info Header */}
      <div className="flex justify-between items-center text-xs pb-2 border-b border-[#E5E5E3]">
        <div>
          <div className="text-[#6B6B6B]">Surveyor: <span className="text-[#1A1A1A] font-medium">{currentCase.assignedSurveyor}</span></div>
          <div className="text-[11px] text-[#6B6B6B] truncate">{currentCase.registeredAddress}</div>
        </div>
      </div>

      {/* Geofence & Location Distance Telemetry Card */}
      <div className="border border-[#E5E5E3] rounded-xl p-4 bg-white space-y-3">
        <div className="flex justify-between items-center text-xs">
          <span className="font-semibold text-[#1A1A1A]">Pemeriksaan radius lokasi</span>
          <span className={`font-medium ${
            geofenceStatus === 'valid' ? 'text-[#16A34A]' : geofenceStatus === 'warning' ? 'text-[#D97706]' : 'text-[#DC2626]'
          }`}>
            {geofenceStatus === 'valid' ? 'Radius valid (<200m)' : geofenceStatus === 'warning' ? 'Peringatan (200m-1km)' : 'Di luar radius (>1km)'}
          </span>
        </div>

        <div className="text-2xl font-semibold text-[#1A1A1A]">
          {distanceMeters} <span className="text-sm font-normal text-[#6B6B6B]">meter ke alamat</span>
        </div>

        {/* Distance simulation quick controls */}
        <div className="pt-2 border-t border-[#E5E5E3] flex items-center justify-between text-xs text-[#6B6B6B]">
          <span>Uji jarak:</span>
          <div className="flex gap-2">
            <button
              onClick={() => setDistanceMeters(85)}
              className={`text-xs ${distanceMeters === 85 ? 'text-[#1A1A1A] font-semibold underline' : 'text-[#6B6B6B] hover:text-[#1A1A1A]'}`}
            >
              85m
            </button>
            <span>·</span>
            <button
              onClick={() => setDistanceMeters(480)}
              className={`text-xs ${distanceMeters === 480 ? 'text-[#1A1A1A] font-semibold underline' : 'text-[#6B6B6B] hover:text-[#1A1A1A]'}`}
            >
              480m
            </button>
            <span>·</span>
            <button
              onClick={() => setDistanceMeters(1840)}
              className={`text-xs ${distanceMeters === 1840 ? 'text-[#1A1A1A] font-semibold underline' : 'text-[#6B6B6B] hover:text-[#1A1A1A]'}`}
            >
              1.8km
            </button>
          </div>
        </div>
      </div>

      {/* Mock Location Status */}
      <div className="border border-[#E5E5E3] rounded-xl p-4 bg-white space-y-2 text-xs">
        <div className="flex justify-between items-center">
          <span className="font-semibold text-[#1A1A1A]">Integritas GPS perangkat</span>
          <button
            onClick={() => setIsMockDetected(!isMockDetected)}
            className="text-xs text-[#2563EB] hover:underline"
          >
            {isMockDetected ? 'Simulasi: Aktif (Mock)' : 'Simulasi: Normal'}
          </button>
        </div>

        <div className="text-[11px] text-[#6B6B6B] space-y-1">
          <div className="flex justify-between">
            <span>Location.isMock:</span>
            <span className={isMockDetected ? 'text-[#DC2626] font-medium' : 'text-[#16A34A]'}>
              {isMockDetected ? 'Terdeteksi software tiruan' : 'False (normal)'}
            </span>
          </div>
        </div>
      </div>

      {/* Camera Capture Section */}
      <div className="border border-[#E5E5E3] rounded-xl p-4 bg-white space-y-3">
        <div className="flex justify-between items-center text-xs">
          <span className="font-semibold text-[#1A1A1A]">Foto survei lapangan</span>
          <span className="text-[#6B6B6B]">Kamera in-app</span>
        </div>

        {/* Category buttons */}
        <div className="grid grid-cols-2 gap-1.5 text-xs">
          <button
            onClick={() => setActivePhotoCategory('house_front')}
            className={`p-2 rounded-lg border text-left truncate transition-colors ${
              activePhotoCategory === 'house_front'
                ? 'bg-[#1A1A1A] text-white border-[#1A1A1A]'
                : 'bg-white text-[#1A1A1A] border-[#E5E5E3] hover:bg-[#F7F7F5]'
            }`}
          >
            Rumah tampak depan
          </button>
          <button
            onClick={() => setActivePhotoCategory('meter_electric')}
            className={`p-2 rounded-lg border text-left truncate transition-colors ${
              activePhotoCategory === 'meter_electric'
                ? 'bg-[#1A1A1A] text-white border-[#1A1A1A]'
                : 'bg-white text-[#1A1A1A] border-[#E5E5E3] hover:bg-[#F7F7F5]'
            }`}
          >
            Meteran listrik
          </button>
        </div>

        <HouseSurveyGraphic
          isMock={isMockDetected}
          lat={currentCase.registeredCoordinate.latitude + (distanceMeters / 111000)}
          lng={currentCase.registeredCoordinate.longitude}
          address={currentCase.registeredAddress}
        />

        <button
          onClick={handleCapturePhoto}
          disabled={isCapturing}
          className="w-full py-2.5 bg-[#2563EB] hover:bg-blue-700 text-white font-medium rounded-lg text-xs flex items-center justify-center gap-2 transition-colors"
        >
          <Camera className="w-4 h-4" />
          <span>{isCapturing ? 'Menyimpan...' : 'Ambil foto & simpan watermark'}</span>
        </button>
      </div>

      {/* Checklist */}
      <div className="border border-[#E5E5E3] rounded-xl p-4 bg-white space-y-3">
        <div className="text-xs font-semibold text-[#1A1A1A]">Checklist verifikasi fisik</div>
        <div className="space-y-2">
          {currentCase.surveyChecklist.map((item) => (
            <div key={item.id} className="p-2.5 rounded-lg border border-[#E5E5E3] text-xs space-y-1.5">
              <div className="text-[#1A1A1A] font-medium leading-snug">{item.question}</div>
              <div className="flex gap-2 pt-1">
                <button
                  onClick={() => setChecklistState(prev => ({ ...prev, [item.id]: 'yes' }))}
                  className={`flex-1 py-1 rounded text-xs transition-colors ${
                    checklistState[item.id] === 'yes'
                      ? 'bg-[#1A1A1A] text-white font-medium'
                      : 'border border-[#E5E5E3] text-[#6B6B6B]'
                  }`}
                >
                  Sesuai
                </button>
                <button
                  onClick={() => setChecklistState(prev => ({ ...prev, [item.id]: 'no' }))}
                  className={`flex-1 py-1 rounded text-xs transition-colors ${
                    checklistState[item.id] === 'no'
                      ? 'bg-[#DC2626] text-white font-medium'
                      : 'border border-[#E5E5E3] text-[#6B6B6B]'
                  }`}
                >
                  Tidak sesuai
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

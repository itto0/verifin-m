import React, { useState } from 'react';
import { ArrowLeft } from 'lucide-react';
import { ApplicationCase } from '../../types';

interface SurveySummaryScreenProps {
  currentCase: ApplicationCase;
  onBackToCamera: () => void;
  onSubmitSurvey: (notes: string) => void;
  onReturnToTasks: () => void;
}

export function SurveySummaryScreen({
  currentCase,
  onBackToCamera,
  onSubmitSurvey,
  onReturnToTasks,
}: SurveySummaryScreenProps) {
  const [surveyNotes, setSurveyNotes] = useState(
    currentCase.reviewerNotes || 'Rumah sesuai alamat pendaftaran. Pemohon dapat ditemui langsung di lokasi.'
  );
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmittedSuccess, setIsSubmittedSuccess] = useState(false);
  const [isAttested, setIsAttested] = useState(true);

  const photos = currentCase.surveyPhotos;
  const isDistanceValid = currentCase.distanceToApplicantMeters <= 200;

  const handleSubmit = () => {
    setIsSubmitting(true);
    setTimeout(() => {
      setIsSubmitting(false);
      setIsSubmittedSuccess(true);
      onSubmitSurvey(surveyNotes);
    }, 600);
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
            <h2 className="text-sm font-semibold text-[#1A1A1A]">Ringkasan survei</h2>
            <div className="text-xs text-[#6B6B6B]">{currentCase.id}</div>
          </div>
        </div>

        <button
          onClick={onBackToCamera}
          className="text-xs text-[#2563EB] hover:underline"
        >
          Tambah foto
        </button>
      </div>

      {/* Main Content Area */}
      <div className="space-y-4 flex-1 overflow-y-auto pr-0.5">
        {/* Applicant summary card */}
        <div className="border border-[#E5E5E3] rounded-xl p-4 bg-[#FFFFFF] space-y-2">
          <div>
            <div className="text-xs text-[#6B6B6B]">Pemohon</div>
            <div className="font-semibold text-base text-[#1A1A1A]">{currentCase.applicantName}</div>
          </div>

          <div className="text-xs text-[#6B6B6B] space-y-1 pt-1 border-t border-[#E5E5E3]">
            <div>Unit: <span className="text-[#1A1A1A] font-medium">{currentCase.vehicleModel}</span></div>
            <div>Alamat: <span className="text-[#1A1A1A]">{currentCase.registeredAddress}</span></div>
          </div>
        </div>

        {/* Telemetry compliance unboxed text */}
        <div className="border border-[#E5E5E3] rounded-xl p-4 bg-[#F7F7F5] space-y-2">
          <div className="text-xs font-semibold text-[#1A1A1A]">Validasi lokasi & GPS</div>
          <div className="text-xs text-[#6B6B6B] space-y-1">
            <div className="flex justify-between">
              <span>Jarak ke alamat:</span>
              <span className={`font-medium ${isDistanceValid ? 'text-[#16A34A]' : 'text-[#D97706]'}`}>
                {currentCase.distanceToApplicantMeters} meter ({isDistanceValid ? 'dalam radius 200m' : 'di luar radius'})
              </span>
            </div>
            <div className="flex justify-between">
              <span>Status mock GPS:</span>
              <span className={currentCase.isMockLocationActive ? 'text-[#DC2626] font-medium' : 'text-[#16A34A]'}>
                {currentCase.isMockLocationActive ? 'Terdeteksi palsu' : 'Normal'}
              </span>
            </div>
          </div>
        </div>

        {/* Captured photos list */}
        <div className="border border-[#E5E5E3] rounded-xl p-4 bg-[#FFFFFF] space-y-3">
          <div className="flex justify-between items-center text-xs">
            <span className="font-semibold text-[#1A1A1A]">Foto survei ({photos.length})</span>
            <span className="text-[#6B6B6B]">Watermark tersimpan</span>
          </div>

          <div className="space-y-2">
            {photos.map((photo) => (
              <div
                key={photo.id}
                className="p-2.5 rounded-lg border border-[#E5E5E3] bg-[#F7F7F5] text-xs flex justify-between items-center"
              >
                <div>
                  <div className="font-medium text-[#1A1A1A]">{photo.categoryLabel}</div>
                  <div className="text-[11px] text-[#6B6B6B]">{photo.capturedAt}</div>
                </div>
                <span className="text-[11px] text-[#16A34A]">Tersimpan</span>
              </div>
            ))}
          </div>
        </div>

        {/* Checklist summary */}
        <div className="border border-[#E5E5E3] rounded-xl p-4 bg-[#FFFFFF] space-y-2 text-xs">
          <div className="font-semibold text-[#1A1A1A]">Pemeriksaan fisik</div>
          <div className="space-y-1.5 text-[#6B6B6B]">
            {currentCase.surveyChecklist.map((item) => (
              <div key={item.id} className="flex justify-between items-center py-1 border-b border-[#E5E5E3] last:border-0">
                <span className="text-[#1A1A1A] pr-2">{item.question}</span>
                <span className="text-[#16A34A] shrink-0 font-medium">Sesuai</span>
              </div>
            ))}
          </div>
        </div>

        {/* Notes */}
        <div>
          <label className="text-xs text-[#6B6B6B] block mb-1">
            Catatan lapangan
          </label>
          <textarea
            value={surveyNotes}
            onChange={(e) => setSurveyNotes(e.target.value)}
            rows={2}
            className="w-full text-xs p-3 bg-white border border-[#E5E5E3] rounded-lg focus:border-[#2563EB] focus:outline-hidden text-[#1A1A1A]"
          />
        </div>

        {/* Attestation */}
        <label className="flex items-start gap-2 text-xs text-[#6B6B6B] cursor-pointer">
          <input
            type="checkbox"
            checked={isAttested}
            onChange={(e) => setIsAttested(e.target.checked)}
            className="mt-0.5 rounded border-[#E5E5E3] text-[#2563EB]"
          />
          <span>
            Data dan foto diambil langsung di lokasi fisik konsumen tanpa manipulasi lokasi.
          </span>
        </label>
      </div>

      {/* Submit Button */}
      <div className="pt-3 border-t border-[#E5E5E3]">
        <button
          onClick={handleSubmit}
          disabled={isSubmitting || !isAttested}
          className={`w-full py-2.5 rounded-lg text-sm font-medium transition-colors ${
            !isAttested
              ? 'bg-[#E5E5E3] text-[#6B6B6B] cursor-not-allowed'
              : 'bg-[#2563EB] hover:bg-blue-700 text-white'
          }`}
        >
          {isSubmitting ? 'Mengirim...' : 'Kirim hasil survei'}
        </button>
      </div>

      {/* Success Modal Confirmation */}
      {isSubmittedSuccess && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl p-6 max-w-sm w-full space-y-4 border border-[#E5E5E3]">
            <div>
              <h3 className="text-base font-semibold text-[#1A1A1A]">Survei berhasil dikirim</h3>
              <p className="text-xs text-[#6B6B6B] mt-1">
                Data survei fisik telah masuk ke sistem VeriFin untuk diproses verifikator.
              </p>
            </div>

            <div className="p-3 bg-[#F7F7F5] rounded-lg border border-[#E5E5E3] text-xs space-y-1">
              <div className="flex justify-between text-[#6B6B6B]">
                <span>No. Referensi:</span>
                <span className="text-[#1A1A1A] font-medium">BAF-SRV-8891</span>
              </div>
              <div className="flex justify-between text-[#6B6B6B]">
                <span>Waktu pengiriman:</span>
                <span className="text-[#1A1A1A]">28 Okt 2026</span>
              </div>
            </div>

            <button
              onClick={() => {
                setIsSubmittedSuccess(false);
                onReturnToTasks();
              }}
              className="w-full py-2 bg-[#1A1A1A] text-white rounded-lg text-xs font-medium hover:bg-black transition-colors"
            >
              Kembali ke daftar tugas
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

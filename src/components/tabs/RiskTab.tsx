import React, { useState } from 'react';
import { ApplicationCase } from '../../types';

interface RiskTabProps {
  currentCase: ApplicationCase;
  onUpdateDecision: (caseId: string, decision: 'approved' | 'rejected' | 're_survey', notes: string) => void;
}

export function RiskTab({ currentCase, onUpdateDecision }: RiskTabProps) {
  const [notes, setNotes] = useState(currentCase.reviewerNotes || '');
  const [decisionFeedback, setDecisionFeedback] = useState<string | null>(null);

  const scorecard = currentCase.riskScorecard;
  const isRed = scorecard.status === 'red';
  const isYellow = scorecard.status === 'yellow';

  const handleDecision = (decision: 'approved' | 'rejected' | 're_survey') => {
    onUpdateDecision(currentCase.id, decision, notes);
    setDecisionFeedback(
      decision === 'approved'
        ? 'Pengajuan disetujui untuk proses LOS.'
        : decision === 'rejected'
        ? 'Pengajuan ditolak (indikasi anomali/fraud).'
        : 'Perintah survei ulang berhasil diterbitkan.'
    );
    setTimeout(() => {
      setDecisionFeedback(null);
    }, 2500);
  };

  return (
    <div className="p-4 space-y-4">
      {/* Case Header */}
      <div className="flex justify-between items-center text-xs pb-2 border-b border-[#E5E5E3]">
        <div>
          <div className="font-semibold text-sm text-[#1A1A1A]">{currentCase.applicantName}</div>
          <div className="text-[#6B6B6B]">{currentCase.vehicleModel} · {currentCase.branch}</div>
        </div>
        <div className="text-right">
          <div className="text-[#6B6B6B]">{currentCase.id}</div>
          <div className="text-[#1A1A1A] font-medium">Rp {currentCase.financingAmount.toLocaleString('id-ID')}</div>
        </div>
      </div>

      {decisionFeedback && (
        <div className="p-3 bg-[#1A1A1A] text-white rounded-lg text-xs font-medium">
          {decisionFeedback}
        </div>
      )}

      {/* VeriFin Scorecard Overview Card */}
      <div className="border border-[#E5E5E3] rounded-xl p-4 bg-white space-y-2">
        <div className="flex justify-between items-baseline">
          <div>
            <div className="text-xs text-[#6B6B6B]">Skor risiko terpadu</div>
            <div className="text-3xl font-semibold text-[#1A1A1A] mt-0.5">
              {scorecard.totalScore} <span className="text-sm font-normal text-[#6B6B6B]">/ 100</span>
            </div>
          </div>

          <div className="text-right text-xs">
            <span
              className={`font-semibold ${
                isRed ? 'text-[#DC2626]' : isYellow ? 'text-[#D97706]' : 'text-[#16A34A]'
              }`}
            >
              {isRed && 'Risiko tinggi (70-100)'}
              {isYellow && 'Tinjauan khusus (40-69)'}
              {!isRed && !isYellow && 'Risiko rendah (0-39)'}
            </span>
          </div>
        </div>

        <p className="text-xs text-[#6B6B6B] pt-1 border-t border-[#E5E5E3]">
          {isRed
            ? 'Terdeteksi anomali pada keabsahan dokumen e-KTP dan radius lokasi survei.'
            : isYellow
            ? 'Perbedaan terdeteksi antara domisili fisik dan alamat KTP.'
            : 'Seluruh parameter berada dalam ambang batas wajar tanpa anomali.'}
        </p>
      </div>

      {/* 4-Component Risk Weight Breakdown */}
      <div className="border border-[#E5E5E3] rounded-xl p-4 bg-white space-y-3 text-xs">
        <div className="font-semibold text-[#1A1A1A]">Komponen penilaian risiko</div>

        <div className="space-y-3 pt-1">
          {/* e-KTP */}
          <div className="space-y-1">
            <div className="flex justify-between text-[#6B6B6B]">
              <span className="text-[#1A1A1A]">e-KTP & NIK (bobot 30)</span>
              <span>{scorecard.breakdown.eKtpScore} / 30</span>
            </div>
            <div className="w-full bg-[#E5E5E3] h-1.5 rounded-full overflow-hidden">
              <div
                className={`h-full ${scorecard.breakdown.eKtpScore > 15 ? 'bg-[#DC2626]' : 'bg-[#1A1A1A]'}`}
                style={{ width: `${(scorecard.breakdown.eKtpScore / 30) * 100}%` }}
              />
            </div>
          </div>

          {/* Lokasi */}
          <div className="space-y-1">
            <div className="flex justify-between text-[#6B6B6B]">
              <span className="text-[#1A1A1A]">Lokasi & GPS (bobot 30)</span>
              <span>{scorecard.breakdown.locationScore} / 30</span>
            </div>
            <div className="w-full bg-[#E5E5E3] h-1.5 rounded-full overflow-hidden">
              <div
                className={`h-full ${scorecard.breakdown.locationScore > 15 ? 'bg-[#DC2626]' : 'bg-[#1A1A1A]'}`}
                style={{ width: `${(scorecard.breakdown.locationScore / 30) * 100}%` }}
              />
            </div>
          </div>

          {/* Suara */}
          <div className="space-y-1">
            <div className="flex justify-between text-[#6B6B6B]">
              <span className="text-[#1A1A1A]">Tele-verifikasi (bobot 25)</span>
              <span>{scorecard.breakdown.voiceScore} / 25</span>
            </div>
            <div className="w-full bg-[#E5E5E3] h-1.5 rounded-full overflow-hidden">
              <div
                className="h-full bg-[#1A1A1A]"
                style={{ width: `${(scorecard.breakdown.voiceScore / 25) * 100}%` }}
              />
            </div>
          </div>

          {/* Dokumen */}
          <div className="space-y-1">
            <div className="flex justify-between text-[#6B6B6B]">
              <span className="text-[#1A1A1A]">Kelengkapan dokumen (bobot 15)</span>
              <span>{scorecard.breakdown.docScore} / 15</span>
            </div>
            <div className="w-full bg-[#E5E5E3] h-1.5 rounded-full overflow-hidden">
              <div
                className="h-full bg-[#1A1A1A]"
                style={{ width: `${(scorecard.breakdown.docScore / 15) * 100}%` }}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Flag reasons - clean unboxed list */}
      <div className="border border-[#E5E5E3] rounded-xl p-4 bg-white space-y-2 text-xs">
        <div className="font-semibold text-[#1A1A1A]">Catatan indikator risiko</div>
        <div className="space-y-2 pt-1">
          {scorecard.flags.map((flag, idx) => (
            <div key={idx} className="border-b border-[#E5E5E3] pb-2 last:border-0 last:pb-0">
              <div className="flex justify-between items-center mb-0.5">
                <span className="font-medium text-[#1A1A1A]">{flag.category}</span>
                <span className={`text-[11px] ${flag.severity === 'danger' ? 'text-[#DC2626]' : 'text-[#6B6B6B]'}`}>
                  {flag.severity}
                </span>
              </div>
              <p className="text-[#6B6B6B] text-[11px] leading-relaxed">{flag.reason}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Reviewer decisions */}
      <div className="border border-[#E5E5E3] rounded-xl p-4 bg-white space-y-3 text-xs">
        <div className="font-semibold text-[#1A1A1A]">Putusan verifikator</div>

        <div>
          <label className="text-[11px] text-[#6B6B6B] block mb-1">Catatan verifikator:</label>
          <textarea
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            rows={2}
            className="w-full text-xs p-2.5 bg-white border border-[#E5E5E3] rounded-lg focus:border-[#2563EB] focus:outline-hidden"
            placeholder="Alasan keputusan..."
          />
        </div>

        <div className="flex gap-2">
          <button
            onClick={() => handleDecision('approved')}
            className="flex-1 py-2 bg-[#16A34A] hover:bg-green-700 text-white rounded-lg font-medium text-xs transition-colors"
          >
            Setujui
          </button>
          <button
            onClick={() => handleDecision('re_survey')}
            className="flex-1 py-2 border border-[#E5E5E3] hover:bg-[#F7F7F5] text-[#1A1A1A] rounded-lg font-medium text-xs transition-colors"
          >
            Survei ulang
          </button>
          <button
            onClick={() => handleDecision('rejected')}
            className="flex-1 py-2 bg-[#DC2626] hover:bg-red-700 text-white rounded-lg font-medium text-xs transition-colors"
          >
            Tolak
          </button>
        </div>
      </div>
    </div>
  );
}

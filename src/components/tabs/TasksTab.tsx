import React, { useState } from 'react';
import { Search } from 'lucide-react';
import { ApplicationCase } from '../../types';

interface TasksTabProps {
  cases: ApplicationCase[];
  selectedCaseId: string;
  onSelectCase: (caseItem: ApplicationCase) => void;
  onNavigateToTab: (tab: 'capture' | 'survey' | 'risk') => void;
}

export function TasksTab({
  cases,
  selectedCaseId,
  onSelectCase,
  onNavigateToTab,
}: TasksTabProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [filterStatus, setFilterStatus] = useState<'all' | 'pending' | 'verified' | 'danger'>('all');

  const filteredCases = cases.filter((c) => {
    const query = searchQuery.toLowerCase();
    const matchQuery =
      c.applicantName.toLowerCase().includes(query) ||
      c.nik.includes(query) ||
      c.id.toLowerCase().includes(query) ||
      c.vehicleModel.toLowerCase().includes(query);

    if (!matchQuery) return false;

    if (filterStatus === 'pending') {
      return c.currentStatus === 'survey_pending' || c.currentStatus === 'document_scanned';
    }
    if (filterStatus === 'verified') {
      return c.currentStatus === 'verified' || c.decision === 'approved';
    }
    if (filterStatus === 'danger') {
      return c.riskScorecard.status === 'red' || c.isMockLocationActive;
    }
    return true;
  });

  return (
    <div className="p-4 space-y-4">
      {/* Search Input */}
      <div className="space-y-2">
        <div className="relative">
          <Search className="w-4 h-4 text-[#6B6B6B] absolute left-3 top-3" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Cari pemohon, NIK, atau nomor aplikasi..."
            className="w-full pl-9 pr-3 py-2 text-xs bg-white border border-[#E5E5E3] rounded-lg focus:border-[#2563EB] focus:outline-hidden"
          />
        </div>

        {/* Clean segmented filter */}
        <div className="flex items-center gap-1 border-b border-[#E5E5E3] pb-2 text-xs overflow-x-auto">
          <button
            onClick={() => setFilterStatus('all')}
            className={`px-2.5 py-1 rounded-md transition-colors ${
              filterStatus === 'all'
                ? 'bg-[#1A1A1A] text-white font-medium'
                : 'text-[#6B6B6B] hover:text-[#1A1A1A]'
            }`}
          >
            Semua ({cases.length})
          </button>
          <button
            onClick={() => setFilterStatus('pending')}
            className={`px-2.5 py-1 rounded-md transition-colors ${
              filterStatus === 'pending'
                ? 'bg-[#1A1A1A] text-white font-medium'
                : 'text-[#6B6B6B] hover:text-[#1A1A1A]'
            }`}
          >
            Perlu survei
          </button>
          <button
            onClick={() => setFilterStatus('danger')}
            className={`px-2.5 py-1 rounded-md transition-colors ${
              filterStatus === 'danger'
                ? 'bg-[#DC2626] text-white font-medium'
                : 'text-[#6B6B6B] hover:text-[#DC2626]'
            }`}
          >
            Flag anomali
          </button>
          <button
            onClick={() => setFilterStatus('verified')}
            className={`px-2.5 py-1 rounded-md transition-colors ${
              filterStatus === 'verified'
                ? 'bg-[#1A1A1A] text-white font-medium'
                : 'text-[#6B6B6B] hover:text-[#1A1A1A]'
            }`}
          >
            Selesai
          </button>
        </div>
      </div>

      {/* Case cards list - clean, zero-pill */}
      <div className="space-y-3">
        {filteredCases.map((caseItem) => {
          const isSelected = caseItem.id === selectedCaseId;
          const isRed = caseItem.riskScorecard.status === 'red';
          const isYellow = caseItem.riskScorecard.status === 'yellow';

          return (
            <div
              key={caseItem.id}
              onClick={() => onSelectCase(caseItem)}
              className={`border rounded-xl p-4 bg-white transition-colors cursor-pointer ${
                isSelected ? 'border-[#2563EB]' : 'border-[#E5E5E3] hover:border-slate-300'
              }`}
            >
              <div className="flex justify-between items-start gap-2 mb-1.5">
                <div>
                  <div className="text-xs text-[#6B6B6B]">{caseItem.id}</div>
                  <h3 className="font-semibold text-sm text-[#1A1A1A]">
                    {caseItem.applicantName}
                  </h3>
                </div>

                {/* Score as clean unboxed text */}
                <div className="text-right text-xs">
                  <span
                    className={`font-semibold ${
                      isRed ? 'text-[#DC2626]' : isYellow ? 'text-[#D97706]' : 'text-[#16A34A]'
                    }`}
                  >
                    Skor: {caseItem.riskScorecard.totalScore}/100
                  </span>
                </div>
              </div>

              {/* Vehicle & unboxed metadata */}
              <div className="text-xs text-[#6B6B6B] space-y-1 mb-3">
                <div className="text-[#1A1A1A] font-medium">{caseItem.vehicleModel}</div>
                <div className="truncate">{caseItem.registeredAddress}</div>
                <div className="text-[11px] flex items-center gap-2 pt-0.5">
                  <span>Jarak: {caseItem.distanceToApplicantMeters} m</span>
                  <span>·</span>
                  <span>SLA: {caseItem.slaDeadline}</span>
                  {caseItem.isMockLocationActive && (
                    <>
                      <span>·</span>
                      <span className="text-[#DC2626]">Mock GPS terdeteksi</span>
                    </>
                  )}
                </div>
              </div>

              {/* Action row */}
              <div className="flex items-center justify-between pt-2 border-t border-[#E5E5E3] text-xs">
                <span className="text-[#6B6B6B]">
                  {caseItem.documentScans.length} dokumen · {caseItem.surveyPhotos.length} foto
                </span>

                <div className="flex items-center gap-2">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      onSelectCase(caseItem);
                      onNavigateToTab('capture');
                    }}
                    className="px-2.5 py-1 text-xs border border-[#E5E5E3] rounded-md text-[#1A1A1A] hover:bg-[#F7F7F5] transition-colors"
                  >
                    Scan
                  </button>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      onSelectCase(caseItem);
                      onNavigateToTab('survey');
                    }}
                    className="px-2.5 py-1 text-xs border border-[#E5E5E3] rounded-md text-[#1A1A1A] hover:bg-[#F7F7F5] transition-colors"
                  >
                    Survei
                  </button>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      onSelectCase(caseItem);
                      onNavigateToTab('risk');
                    }}
                    className="px-2.5 py-1 text-xs bg-[#1A1A1A] text-white rounded-md hover:bg-black transition-colors"
                  >
                    Detail
                  </button>
                </div>
              </div>
            </div>
          );
        })}

        {filteredCases.length === 0 && (
          <div className="text-center py-8 text-xs text-[#6B6B6B]">
            Tidak ada pengajuan yang sesuai.
          </div>
        )}
      </div>
    </div>
  );
}

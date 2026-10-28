import React from 'react';
import { ArrowLeft } from 'lucide-react';

interface TopHeaderProps {
  onBack?: () => void;
  hasBack?: boolean;
}

export function TopHeader({
  onBack,
  hasBack = false,
}: TopHeaderProps) {
  return (
    <header className="sticky top-0 z-30 bg-[#FFFFFF] border-b border-[#E5E5E3] px-5 py-4 min-h-[72px] flex items-center justify-between select-none">
      <div className="flex items-center gap-3 min-w-0">
        {hasBack && (
          <button
            onClick={onBack}
            className="w-9 h-9 rounded-lg flex items-center justify-center text-[#1A1A1A] hover:bg-[#F7F7F5] border border-[#E5E5E3] transition-colors shrink-0 mr-0.5"
            aria-label="Kembali"
          >
            <ArrowLeft className="w-4.5 h-4.5" />
          </button>
        )}

        {/* Larger, higher-profile BAF logo and brand mark */}
        <div className="flex items-center gap-3.5">
          <img
            src="https://cdn-jk01.kabaroto.com/media/6f/4d/b9/6f4db95441531a1b78f188073be60248_800x450.jpeg"
            alt="Bussan Auto Finance"
            referrerPolicy="no-referrer"
            className="h-11 w-auto object-contain shrink-0"
          />
          <div className="flex flex-col justify-center border-l border-[#E5E5E3] pl-3">
            <span className="font-semibold text-base text-[#1A1A1A] tracking-tight leading-tight">
              VeriFin
            </span>
            <span className="text-[11px] text-[#6B6B6B] leading-none mt-0.5">
              Field Verification
            </span>
          </div>
        </div>
      </div>
    </header>
  );
}

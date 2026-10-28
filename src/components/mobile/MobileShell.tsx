import React from 'react';
import { UserRole } from '../../types';

export type FlowScreen =
  | 'login'
  | 'tasks'
  | 'scan_camera'
  | 'ocr_result'
  | 'survey_camera'
  | 'survey_summary'
  | 'risk_detail';

interface MobileShellProps {
  children: React.ReactNode;
  activeRole: UserRole;
  onRoleChange: (role: UserRole) => void;
  activeScreen: FlowScreen;
  onNavigateScreen: (screen: FlowScreen) => void;
  onSelectScenario: (scenarioIndex: number) => void;
  activeScenarioIndex: number;
}

export function MobileShell({
  children,
  activeRole,
  onRoleChange,
  activeScreen,
  onNavigateScreen,
  onSelectScenario,
  activeScenarioIndex,
}: MobileShellProps) {
  const screens: Array<{ key: FlowScreen; label: string }> = [
    { key: 'login', label: 'Login' },
    { key: 'tasks', label: 'Daftar tugas' },
    { key: 'scan_camera', label: 'Scan dokumen' },
    { key: 'ocr_result', label: 'Hasil OCR' },
    { key: 'survey_camera', label: 'Kamera survei' },
    { key: 'survey_summary', label: 'Ringkasan & kirim' },
  ];

  return (
    <div className="min-h-screen bg-[#F7F7F5] flex flex-col items-center">
      {/* Quiet top navigation bar for testing screens */}
      <header className="w-full bg-[#FFFFFF] border-b border-[#E5E5E3] px-6 py-3 flex flex-wrap items-center justify-between gap-4 text-sm select-none">
        <div className="flex items-center gap-6">
          <div className="flex items-center gap-2.5">
            <img
              src="https://cdn-jk01.kabaroto.com/media/6f/4d/b9/6f4db95441531a1b78f188073be60248_800x450.jpeg"
              alt="Bussan Auto Finance"
              referrerPolicy="no-referrer"
              className="h-7 w-auto object-contain"
            />
            <span className="font-semibold text-[#1A1A1A] tracking-tight">VeriFin</span>
          </div>

          {/* Clean text screen navigation */}
          <nav className="hidden md:flex items-center gap-1 border-l border-[#E5E5E3] pl-6">
            {screens.map((s, idx) => (
              <button
                key={s.key}
                onClick={() => onNavigateScreen(s.key)}
                className={`px-3 py-1.5 text-xs rounded-md transition-colors ${
                  activeScreen === s.key
                    ? 'bg-[#1A1A1A] text-white font-medium'
                    : 'text-[#6B6B6B] hover:text-[#1A1A1A] hover:bg-[#F7F7F5]'
                }`}
              >
                {idx + 1}. {s.label}
              </button>
            ))}
          </nav>
        </div>

        {/* Scenario switcher */}
        <div className="flex items-center gap-2 text-xs">
          <span className="text-[#6B6B6B] mr-1 hidden sm:inline">Data uji:</span>
          <button
            onClick={() => onSelectScenario(0)}
            className={`px-2.5 py-1 rounded-md border text-xs transition-colors ${
              activeScenarioIndex === 0
                ? 'border-[#1A1A1A] bg-[#1A1A1A] text-white font-medium'
                : 'border-[#E5E5E3] bg-white text-[#6B6B6B] hover:text-[#1A1A1A]'
            }`}
          >
            Budi (valid)
          </button>
          <button
            onClick={() => onSelectScenario(1)}
            className={`px-2.5 py-1 rounded-md border text-xs transition-colors ${
              activeScenarioIndex === 1
                ? 'border-[#1A1A1A] bg-[#1A1A1A] text-white font-medium'
                : 'border-[#E5E5E3] bg-white text-[#6B6B6B] hover:text-[#1A1A1A]'
            }`}
          >
            Siti (anomali)
          </button>
        </div>
      </header>

      {/* Main mobile viewport canvas: Clean, unadorned, crisp border */}
      <div className="w-full max-w-[430px] min-h-[calc(100vh-57px)] bg-[#FFFFFF] border-x border-[#E5E5E3] flex flex-col">
        {children}
      </div>
    </div>
  );
}

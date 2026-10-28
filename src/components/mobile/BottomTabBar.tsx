import React from 'react';
import { ClipboardList, Camera, Navigation, RefreshCw, ShieldAlert } from 'lucide-react';

export type TabKey = 'tasks' | 'capture' | 'survey' | 'sync' | 'risk';

interface BottomTabBarProps {
  activeTab: TabKey;
  onSelectTab: (tab: TabKey) => void;
  pendingSyncCount: number;
}

export function BottomTabBar({
  activeTab,
  onSelectTab,
  pendingSyncCount,
}: BottomTabBarProps) {
  const tabs = [
    { key: 'tasks' as TabKey, label: 'Tugas', icon: ClipboardList },
    { key: 'capture' as TabKey, label: 'Scan', icon: Camera },
    { key: 'survey' as TabKey, label: 'Survei', icon: Navigation },
    { key: 'sync' as TabKey, label: 'Sinkron', icon: RefreshCw, count: pendingSyncCount },
    { key: 'risk' as TabKey, label: 'Risiko', icon: ShieldAlert },
  ];

  return (
    <nav className="sticky bottom-0 z-30 bg-[#FFFFFF] border-t border-[#E5E5E3] px-2 select-none">
      <div className="grid grid-cols-5 items-center max-w-md mx-auto">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.key;

          return (
            <button
              key={tab.key}
              onClick={() => onSelectTab(tab.key)}
              className={`flex flex-col items-center justify-center min-h-[52px] py-1 transition-colors ${
                isActive ? 'text-[#2563EB]' : 'text-[#6B6B6B] hover:text-[#1A1A1A]'
              }`}
            >
              <div className="relative">
                <Icon className={`w-5 h-5 ${isActive ? 'stroke-[2.2]' : 'stroke-[1.75]'}`} />
                {Boolean(tab.count && tab.count > 0) && (
                  <span className="absolute -top-1 -right-2 bg-[#1A1A1A] text-white text-[9px] font-semibold w-4 h-4 rounded-full flex items-center justify-center">
                    {tab.count}
                  </span>
                )}
              </div>
              <span className={`text-[11px] mt-0.5 tracking-tight ${isActive ? 'font-medium text-[#2563EB]' : 'text-[#6B6B6B]'}`}>
                {tab.label}
              </span>
            </button>
          );
        })}
      </div>
    </nav>
  );
}

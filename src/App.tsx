import React, { useState } from 'react';
import { ApplicationCase, NetworkState, OfflineSyncQueueItem, SurveyPhoto, UserRole } from './types';
import { INITIAL_CASES, INITIAL_SYNC_QUEUE } from './data/mockData';
import { MobileShell, FlowScreen } from './components/mobile/MobileShell';
import { TopHeader } from './components/mobile/TopHeader';
import { BottomTabBar, TabKey } from './components/mobile/BottomTabBar';
import { LoginScreen } from './components/screens/LoginScreen';
import { DocumentCameraScreen } from './components/screens/DocumentCameraScreen';
import { OCRResultScreen } from './components/screens/OCRResultScreen';
import { SurveyCameraScreen } from './components/screens/SurveyCameraScreen';
import { SurveySummaryScreen } from './components/screens/SurveySummaryScreen';
import { TasksTab } from './components/tabs/TasksTab';
import { CaptureTab } from './components/tabs/CaptureTab';
import { SurveyTab } from './components/tabs/SurveyTab';
import { SyncTab } from './components/tabs/SyncTab';
import { RiskTab } from './components/tabs/RiskTab';

export default function App() {
  const [cases, setCases] = useState<ApplicationCase[]>(INITIAL_CASES);
  const [activeCaseIndex, setActiveCaseIndex] = useState(0);
  const [activeScreen, setActiveScreen] = useState<FlowScreen>('tasks');
  const [activeTab, setActiveTab] = useState<TabKey>('tasks');
  const [activeRole, setActiveRole] = useState<UserRole>('sales');
  const [userName, setUserName] = useState('Deni Setiawan');
  const [userBranch, setUserBranch] = useState('Cabang Bandung Soekarno-Hatta');
  const [networkState, setNetworkState] = useState<NetworkState>('online');
  const [syncQueue, setSyncQueue] = useState<OfflineSyncQueueItem[]>(INITIAL_SYNC_QUEUE);
  const [ocrSampleType, setOcrSampleType] = useState<'clean' | 'tampered'>('clean');

  const currentCase = cases[activeCaseIndex] || cases[0];

  const handleToggleNetwork = () => {
    setNetworkState((prev) => {
      if (prev === 'online') return 'poor';
      if (prev === 'poor') return 'offline';
      return 'online';
    });
  };

  const handleLogin = (role: UserRole, name: string, branch: string) => {
    setActiveRole(role);
    setUserName(name);
    setUserBranch(branch);
    setActiveScreen('tasks');
    setActiveTab('tasks');
  };

  const handleLogout = () => {
    setActiveScreen('login');
  };

  const handleSelectCase = (caseItem: ApplicationCase) => {
    const idx = cases.findIndex((c) => c.id === caseItem.id);
    if (idx !== -1) {
      setActiveCaseIndex(idx);
    }
  };

  const handleSelectScenario = (scenarioIndex: number) => {
    if (scenarioIndex >= 0 && scenarioIndex < cases.length) {
      setActiveCaseIndex(scenarioIndex);
      if (scenarioIndex === 1) {
        setOcrSampleType('tampered');
      } else {
        setOcrSampleType('clean');
      }
    }
  };

  const handleAddSurveyPhoto = (photo: SurveyPhoto) => {
    setCases((prev) =>
      prev.map((c) => {
        if (c.id === currentCase.id) {
          return {
            ...c,
            surveyPhotos: [photo, ...c.surveyPhotos],
          };
        }
        return c;
      })
    );

    const queueItem: OfflineSyncQueueItem = {
      id: `sync-${Date.now()}`,
      caseId: currentCase.id,
      type: 'photo_upload',
      description: `Foto ${photo.categoryLabel}`,
      fileSizeBytes: 1420000,
      timestamp: photo.capturedAt,
      status: networkState === 'offline' ? 'queued' : 'synced',
      retryCount: 0,
    };

    setSyncQueue((prev) => [queueItem, ...prev]);
  };

  const handleSyncAll = () => {
    setSyncQueue((prev) =>
      prev.map((item) => ({
        ...item,
        status: 'synced',
      }))
    );
  };

  const handleUpdateDecision = (
    caseId: string,
    decision: 'approved' | 'rejected' | 're_survey',
    notes: string
  ) => {
    setCases((prev) =>
      prev.map((c) => {
        if (c.id === caseId) {
          return {
            ...c,
            decision,
            reviewerNotes: notes,
            currentStatus: decision === 'approved' ? 'verified' : decision === 'rejected' ? 'rejected' : 're_survey',
          };
        }
        return c;
      })
    );
  };

  const pendingSyncCount = syncQueue.filter(
    (q) => q.status === 'queued' || q.status === 'failed'
  ).length;


  return (
    <MobileShell
      activeRole={activeRole}
      onRoleChange={setActiveRole}
      activeScreen={activeScreen}
      onNavigateScreen={setActiveScreen}
      onSelectScenario={handleSelectScenario}
      activeScenarioIndex={activeCaseIndex}
    >
      {/* 1. Login */}
      {activeScreen === 'login' ? (
        <LoginScreen onLogin={handleLogin} />
      ) : activeScreen === 'scan_camera' ? (
        /* 3. Scan dokumen dengan panduan bingkai */
        <DocumentCameraScreen
          currentCase={currentCase}
          onBack={() => setActiveScreen('tasks')}
          onProceedToOCR={(sample) => {
            setOcrSampleType(sample);
            setActiveScreen('ocr_result');
          }}
        />
      ) : activeScreen === 'ocr_result' ? (
        /* 4. Hasil OCR & auto-fill form */
        <OCRResultScreen
          currentCase={currentCase}
          sampleType={ocrSampleType}
          onBackToCamera={() => setActiveScreen('scan_camera')}
          onConfirmForm={() => {
            setActiveScreen('tasks');
            setActiveTab('tasks');
          }}
        />
      ) : activeScreen === 'survey_camera' ? (
        /* 5. Kamera survei dengan overlay koordinat + jarak */
        <SurveyCameraScreen
          currentCase={currentCase}
          onBack={() => setActiveScreen('tasks')}
          onPhotoCaptured={handleAddSurveyPhoto}
          onProceedToSummary={() => setActiveScreen('survey_summary')}
        />
      ) : activeScreen === 'survey_summary' ? (
        /* 6. Ringkasan survei & kirim */
        <SurveySummaryScreen
          currentCase={currentCase}
          onBackToCamera={() => setActiveScreen('survey_camera')}
          onSubmitSurvey={(notes) => {
            handleUpdateDecision(currentCase.id, 'approved', notes);
          }}
          onReturnToTasks={() => {
            setActiveScreen('tasks');
            setActiveTab('tasks');
          }}
        />
      ) : (
        /* 2. Daftar tugas & workspace */
        <div className="flex-1 flex flex-col justify-between">
          <TopHeader
            hasBack={activeTab !== 'tasks'}
            onBack={() => setActiveTab('tasks')}
          />

          <main className="flex-1 overflow-y-auto">
            {activeTab === 'tasks' && (
              <div className="space-y-3">
                {/* Officer info row - minimal, no colored pill boxes */}
                <div className="mx-4 mt-3 pb-2 border-b border-[#E5E5E3] flex justify-between items-center text-xs">
                  <div>
                    <div className="font-medium text-[#1A1A1A]">{userName}</div>
                    <div className="text-[11px] text-[#6B6B6B]">{userBranch}</div>
                  </div>

                  <div className="flex gap-2">
                    <button
                      onClick={() => setActiveScreen('scan_camera')}
                      className="px-2.5 py-1 text-xs border border-[#E5E5E3] rounded-md text-[#1A1A1A] hover:bg-[#F7F7F5] transition-colors"
                    >
                      Scan e-KTP
                    </button>
                    <button
                      onClick={() => setActiveScreen('survey_camera')}
                      className="px-2.5 py-1 text-xs bg-[#2563EB] text-white rounded-md hover:bg-blue-700 transition-colors"
                    >
                      Survei GPS
                    </button>
                  </div>
                </div>

                <TasksTab
                  cases={cases}
                  selectedCaseId={currentCase.id}
                  onSelectCase={handleSelectCase}
                  onNavigateToTab={(tab) => {
                    if (tab === 'capture') {
                      setActiveScreen('scan_camera');
                    } else if (tab === 'survey') {
                      setActiveScreen('survey_camera');
                    } else {
                      setActiveTab(tab);
                    }
                  }}
                />
              </div>
            )}

            {activeTab === 'capture' && (
              <CaptureTab
                currentCase={currentCase}
                onUpdateCaseScan={() => {}}
              />
            )}

            {activeTab === 'survey' && (
              <SurveyTab
                currentCase={currentCase}
                onAddSurveyPhoto={handleAddSurveyPhoto}
              />
            )}

            {activeTab === 'sync' && (
              <SyncTab
                syncQueue={syncQueue}
                networkState={networkState}
                onToggleNetwork={handleToggleNetwork}
                onSyncAll={handleSyncAll}
              />
            )}

            {activeTab === 'risk' && (
              <RiskTab
                currentCase={currentCase}
                onUpdateDecision={handleUpdateDecision}
              />
            )}
          </main>

          <BottomTabBar
            activeTab={activeTab}
            onSelectTab={setActiveTab}
            pendingSyncCount={pendingSyncCount}
          />
        </div>
      )}
    </MobileShell>
  );
}

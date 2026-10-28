import React, { useState } from 'react';
import { NetworkState, OfflineSyncQueueItem } from '../../types';

interface SyncTabProps {
  syncQueue: OfflineSyncQueueItem[];
  networkState: NetworkState;
  onToggleNetwork: () => void;
  onSyncAll: () => void;
}

export function SyncTab({
  syncQueue,
  networkState,
  onToggleNetwork,
  onSyncAll,
}: SyncTabProps) {
  const [isSyncing, setIsSyncing] = useState(false);

  const pendingItems = syncQueue.filter((item) => item.status === 'queued' || item.status === 'failed');

  const handleTriggerSync = () => {
    if (networkState === 'offline') return;
    setIsSyncing(true);
    setTimeout(() => {
      onSyncAll();
      setIsSyncing(false);
    }, 800);
  };

  return (
    <div className="p-4 space-y-4">
      {/* Network status card */}
      <div className="border border-[#E5E5E3] rounded-xl p-4 bg-white space-y-2 text-xs">
        <div className="flex justify-between items-center">
          <span className="font-semibold text-[#1A1A1A]">Status sinkronisasi offline</span>
          <button
            onClick={onToggleNetwork}
            className="text-xs text-[#2563EB] hover:underline"
          >
            Ubah koneksi
          </button>
        </div>

        <div className="text-[#6B6B6B] text-[11px] leading-relaxed">
          Koneksi saat ini: <span className="font-medium text-[#1A1A1A] capitalize">{networkState}</span>.
          {networkState === 'offline'
            ? ' Foto dan data tersimpan pada penyimpanan lokal perangkat (SQLite) dan akan diunggah otomatis saat terhubung kembali.'
            : ' Perangkat siap mengirim antrian data ke server pusat.'}
        </div>

        <button
          onClick={handleTriggerSync}
          disabled={isSyncing || networkState === 'offline' || pendingItems.length === 0}
          className={`w-full py-2.5 rounded-lg text-xs font-medium transition-colors ${
            networkState === 'offline' || pendingItems.length === 0
              ? 'bg-[#E5E5E3] text-[#6B6B6B] cursor-not-allowed'
              : 'bg-[#2563EB] hover:bg-blue-700 text-white'
          }`}
        >
          {isSyncing
            ? 'Menyinkronkan...'
            : pendingItems.length === 0
            ? 'Semua data telah sinkron'
            : `Sinkronkan ${pendingItems.length} berkas`}
        </button>
      </div>

      {/* Storage info unboxed */}
      <div className="text-xs text-[#6B6B6B] px-1 flex justify-between">
        <span>Penyimpanan lokal: 4.8 MB</span>
        <span>·</span>
        <span>Antrian: {pendingItems.length} berkas</span>
        <span>·</span>
        <span>Tersedia: 34 GB</span>
      </div>

      {/* Queue items list */}
      <div className="border border-[#E5E5E3] rounded-xl p-4 bg-white space-y-3 text-xs">
        <div className="font-semibold text-[#1A1A1A]">Daftar antrian upload ({syncQueue.length})</div>

        <div className="space-y-2">
          {syncQueue.map((item) => {
            const isDone = item.status === 'synced';
            return (
              <div
                key={item.id}
                className="p-2.5 rounded-lg border border-[#E5E5E3] bg-[#F7F7F5] flex justify-between items-center text-xs"
              >
                <div>
                  <div className="font-medium text-[#1A1A1A]">{item.description}</div>
                  <div className="text-[11px] text-[#6B6B6B]">
                    {item.caseId} · {item.timestamp}
                  </div>
                </div>

                <span className={`text-[11px] font-medium ${isDone ? 'text-[#16A34A]' : 'text-[#D97706]'}`}>
                  {isDone ? 'Sinkron' : 'Antrian'}
                </span>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

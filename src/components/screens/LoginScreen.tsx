import React, { useState } from 'react';
import { UserRole } from '../../types';

interface LoginScreenProps {
  onLogin: (role: UserRole, username: string, branch: string) => void;
}

export function LoginScreen({ onLogin }: LoginScreenProps) {
  const [selectedRole, setSelectedRole] = useState<UserRole>('sales');
  const [userId, setUserId] = useState('BAF-SLS-094');
  const [password, setPassword] = useState('••••••••');
  const [branch, setBranch] = useState('Cabang Bandung Soekarno-Hatta');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleRoleSelect = (role: UserRole) => {
    setSelectedRole(role);
    if (role === 'sales') {
      setUserId('BAF-SLS-094');
    } else {
      setUserId('BAF-SRV-212');
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setTimeout(() => {
      setIsSubmitting(false);
      const name = selectedRole === 'sales' ? 'Deni Setiawan' : 'Rizky Pratama';
      onLogin(selectedRole, name, branch);
    }, 400);
  };

  return (
    <div className="flex-1 bg-[#FFFFFF] p-6 flex flex-col justify-between">
      <div className="space-y-6 pt-4">
        {/* Simple brand heading with official BAF logo */}
        <div className="space-y-3">
          <img
            src="https://cdn-jk01.kabaroto.com/media/6f/4d/b9/6f4db95441531a1b78f188073be60248_800x450.jpeg"
            alt="Bussan Auto Finance"
            referrerPolicy="no-referrer"
            className="h-12 w-auto object-contain"
          />
          <div>
            <div className="text-xl font-semibold text-[#1A1A1A] tracking-tight">VeriFin</div>
            <div className="text-xs text-[#6B6B6B] mt-0.5">Bussan Auto Finance · Akses Lapangan</div>
          </div>
        </div>

        {/* Clean segmented control */}
        <div className="flex rounded-lg border border-[#E5E5E3] p-1 bg-[#F7F7F5]">
          <button
            type="button"
            onClick={() => handleRoleSelect('sales')}
            className={`flex-1 py-1.5 text-xs font-medium rounded-md transition-colors ${
              selectedRole === 'sales'
                ? 'bg-white text-[#1A1A1A] border border-[#E5E5E3]'
                : 'text-[#6B6B6B] hover:text-[#1A1A1A]'
            }`}
          >
            Sales
          </button>
          <button
            type="button"
            onClick={() => handleRoleSelect('surveyor')}
            className={`flex-1 py-1.5 text-xs font-medium rounded-md transition-colors ${
              selectedRole === 'surveyor'
                ? 'bg-white text-[#1A1A1A] border border-[#E5E5E3]'
                : 'text-[#6B6B6B] hover:text-[#1A1A1A]'
            }`}
          >
            Surveyor
          </button>
        </div>

        {/* Form fields */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="text-xs text-[#6B6B6B] block mb-1">
              ID Pegawai / NIP
            </label>
            <input
              type="text"
              value={userId}
              onChange={(e) => setUserId(e.target.value)}
              required
              className="w-full px-3 py-2 text-sm bg-white border border-[#E5E5E3] rounded-lg focus:border-[#2563EB] focus:outline-hidden"
            />
          </div>

          <div>
            <label className="text-xs text-[#6B6B6B] block mb-1">
              Kata Sandi / PIN
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="w-full px-3 py-2 text-sm bg-white border border-[#E5E5E3] rounded-lg focus:border-[#2563EB] focus:outline-hidden"
            />
          </div>

          <div>
            <label className="text-xs text-[#6B6B6B] block mb-1">
              Kantor Cabang
            </label>
            <select
              value={branch}
              onChange={(e) => setBranch(e.target.value)}
              aria-label="Pilih kantor cabang"
              className="w-full px-3 py-2 text-sm bg-white border border-[#E5E5E3] rounded-lg focus:border-[#2563EB] focus:outline-hidden text-[#1A1A1A]"
            >
              <option value="Cabang Bandung Soekarno-Hatta">Cabang Bandung Soekarno-Hatta</option>
              <option value="Cabang Jakarta Selatan Fatmawati">Cabang Jakarta Selatan Fatmawati</option>
              <option value="Cabang Bekasi Barat Ahmad Yani">Cabang Bekasi Barat Ahmad Yani</option>
            </select>
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full py-2.5 bg-[#2563EB] hover:bg-blue-700 text-white rounded-lg text-sm font-medium transition-colors pt-2"
          >
            {isSubmitting ? 'Memproses...' : 'Masuk'}
          </button>
        </form>
      </div>

      {/* Quick login bypass */}
      <div className="pt-6 border-t border-[#E5E5E3] space-y-2">
        <div className="text-xs text-[#6B6B6B]">Akun demo:</div>
        <div className="flex gap-2">
          <button
            type="button"
            onClick={() => onLogin('sales', 'Deni Setiawan', branch)}
            className="flex-1 py-1.5 px-2 border border-[#E5E5E3] rounded-lg text-xs text-[#1A1A1A] hover:bg-[#F7F7F5] transition-colors"
          >
            Deni (Sales)
          </button>
          <button
            type="button"
            onClick={() => onLogin('surveyor', 'Rizky Pratama', branch)}
            className="flex-1 py-1.5 px-2 border border-[#E5E5E3] rounded-lg text-xs text-[#1A1A1A] hover:bg-[#F7F7F5] transition-colors"
          >
            Rizky (Surveyor)
          </button>
        </div>
      </div>
    </div>
  );
}

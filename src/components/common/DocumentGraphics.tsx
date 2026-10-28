import React from 'react';

export function AuthenticEKTPGraphic() {
  return (
    <div className="w-full aspect-[85.6/53.98] rounded-lg border border-[#E5E5E3] bg-[#F7F7F5] p-3 text-[10px] font-sans select-none flex flex-col justify-between">
      <div className="text-center pb-1 border-b border-[#E5E5E3]">
        <div className="font-semibold text-[11px] text-[#1A1A1A]">PROVINSI JAWA BARAT</div>
        <div className="text-[10px] text-[#6B6B6B]">KOTA BANDUNG</div>
      </div>

      <div className="flex justify-between items-start gap-2 pt-1 text-[9px] text-[#1A1A1A] leading-tight">
        <div className="space-y-0.5 flex-1">
          <div className="font-semibold text-[11px] text-[#1A1A1A] mb-1">
            NIK: 3273051408890002
          </div>
          <div><span className="text-[#6B6B6B]">Nama:</span> BUDI SANTOSO</div>
          <div><span className="text-[#6B6B6B]">Tempat/Tgl Lahir:</span> BANDUNG, 14-08-1989</div>
          <div><span className="text-[#6B6B6B]">Jenis Kelamin:</span> LAKI-LAKI</div>
          <div><span className="text-[#6B6B6B]">Alamat:</span> JL. BUAH BATU NO. 142</div>
          <div><span className="text-[#6B6B6B]">RT/RW:</span> 003 / 007 · TURANGGA</div>
          <div><span className="text-[#6B6B6B]">Kecamatan:</span> LENGKONG</div>
          <div><span className="text-[#6B6B6B]">Pekerjaan:</span> KARYAWAN SWASTA</div>
        </div>

        <div className="w-16 h-20 bg-slate-200 border border-[#E5E5E3] rounded flex flex-col items-center justify-end overflow-hidden shrink-0">
          <div className="w-7 h-7 rounded-full bg-slate-400 mb-1" />
          <div className="w-11 h-7 rounded-t-full bg-slate-500" />
        </div>
      </div>

      <div className="text-[8px] text-[#6B6B6B] pt-1 border-t border-[#E5E5E3] flex justify-between">
        <span>Berlaku hingga: Seumur hidup</span>
        <span>KOTA BANDUNG</span>
      </div>
    </div>
  );
}

export function TamperedEKTPGraphic() {
  return (
    <div className="w-full aspect-[85.6/53.98] rounded-lg border border-amber-300 bg-amber-50/40 p-3 text-[10px] font-sans select-none flex flex-col justify-between">
      <div className="text-center pb-1 border-b border-[#E5E5E3]">
        <div className="font-semibold text-[11px] text-[#1A1A1A]">PROVINSI DKI JAKARTA</div>
        <div className="text-[10px] text-[#6B6B6B]">KOTA JAKARTA SELATAN</div>
      </div>

      <div className="flex justify-between items-start gap-2 pt-1 text-[9px] text-[#1A1A1A] leading-tight">
        <div className="space-y-0.5 flex-1">
          <div className="font-semibold text-[11px] text-[#D97706] mb-1">
            NIK: 3174025206920005
          </div>
          <div><span className="text-[#6B6B6B]">Nama:</span> SITI RAHMAWATI</div>
          <div><span className="text-[#6B6B6B]">Tempat/Tgl Lahir:</span> JAKARTA, 12-06-1992</div>
          <div><span className="text-[#6B6B6B]">Jenis Kelamin:</span> PEREMPUAN</div>
          <div><span className="text-[#6B6B6B]">Alamat:</span> JL. RS FATMAWATI NO. 88</div>
          <div><span className="text-[#6B6B6B]">RT/RW:</span> 005 / 002 · CILANDAK BARAT</div>
          <div><span className="text-[#6B6B6B]">Kecamatan:</span> CILANDAK</div>
          <div><span className="text-[#6B6B6B]">Pekerjaan:</span> WIRASWASTA</div>
        </div>

        <div className="w-16 h-20 bg-slate-200 border border-amber-300 rounded flex flex-col items-center justify-end overflow-hidden shrink-0">
          <div className="w-7 h-7 rounded-full bg-slate-400 mb-1" />
          <div className="w-11 h-7 rounded-t-full bg-slate-500" />
        </div>
      </div>

      <div className="text-[8px] text-[#D97706] pt-1 border-t border-amber-200 flex justify-between">
        <span>Indikasi foto ulang layar</span>
        <span>KOTA JAKARTA SELATAN</span>
      </div>
    </div>
  );
}

export function KartuKeluargaGraphic() {
  return (
    <div className="w-full aspect-[85.6/53.98] rounded-lg border border-[#E5E5E3] bg-[#FFFFFF] p-3 text-[9px] select-none flex flex-col justify-between">
      <div className="text-center pb-1 border-b border-[#E5E5E3]">
        <div className="font-semibold text-[10px] text-[#1A1A1A]">KARTU KELUARGA</div>
        <div className="text-[9px] text-[#6B6B6B]">No. 3273052109150004</div>
      </div>

      <div className="grid grid-cols-2 gap-1 text-[8px] text-[#1A1A1A]">
        <div><span className="text-[#6B6B6B]">Kepala Keluarga:</span> BUDI SANTOSO</div>
        <div><span className="text-[#6B6B6B]">Alamat:</span> JL. BUAH BATU NO. 142</div>
        <div><span className="text-[#6B6B6B]">RT/RW:</span> 003 / 007</div>
        <div><span className="text-[#6B6B6B]">Kecamatan:</span> LENGKONG</div>
      </div>

      <div className="border border-[#E5E5E3] rounded overflow-hidden text-[8px]">
        <div className="grid grid-cols-3 bg-[#F7F7F5] p-1 font-medium text-[#1A1A1A]">
          <span>Nama</span>
          <span>NIK</span>
          <span>Hubungan</span>
        </div>
        <div className="grid grid-cols-3 p-1 border-t border-[#E5E5E3] text-[#6B6B6B]">
          <span className="text-[#1A1A1A]">BUDI SANTOSO</span>
          <span>3273051408890002</span>
          <span>KEPALA</span>
        </div>
      </div>
    </div>
  );
}

export function STNKGraphic() {
  return (
    <div className="w-full aspect-[85.6/53.98] rounded-lg border border-[#E5E5E3] bg-[#FFFFFF] p-3 text-[9px] select-none flex flex-col justify-between">
      <div className="flex justify-between items-center pb-1 border-b border-[#E5E5E3]">
        <div className="font-semibold text-[10px] text-[#1A1A1A]">SURAT TANDA NOMOR KENDARAAN</div>
        <span className="font-semibold text-[#1A1A1A]">D 4821 BAF</span>
      </div>

      <div className="grid grid-cols-2 gap-1 text-[8px] text-[#1A1A1A]">
        <div><span className="text-[#6B6B6B]">Pemilik:</span> BUDI SANTOSO</div>
        <div><span className="text-[#6B6B6B]">Merk:</span> YAMAHA NMAX 155</div>
        <div><span className="text-[#6B6B6B]">Tahun:</span> 2026</div>
        <div><span className="text-[#6B6B6B]">No. Rangka:</span> MH3SG5210PJ892110</div>
      </div>

      <div className="text-[8px] text-[#6B6B6B] pt-1 border-t border-[#E5E5E3] flex justify-between">
        <span>Masa berlaku: 15-08-2031</span>
        <span>Polda Jabar</span>
      </div>
    </div>
  );
}

export function HouseSurveyGraphic({
  address = 'Jl. Buah Batu No. 142, Kota Bandung',
  lat = -6.93819,
  lng = 107.62552,
  timestamp = '27 Okt 2026 · 11:15 WIB',
}: {
  isMock?: boolean;
  address?: string;
  lat?: number;
  lng?: number;
  timestamp?: string;
}) {
  return (
    <div className="w-full aspect-[4/3] rounded-lg border border-[#E5E5E3] bg-[#F7F7F5] relative overflow-hidden flex flex-col justify-between p-3 select-none">
      {/* Clean architectural facade illustration */}
      <svg className="absolute inset-0 w-full h-full object-cover opacity-60" viewBox="0 0 400 300" preserveAspectRatio="none">
        <rect width="400" height="300" fill="#f1f5f9" />
        <rect y="210" width="400" height="90" fill="#e2e8f0" />
        <rect x="90" y="110" width="220" height="100" fill="#ffffff" stroke="#cbd5e1" strokeWidth="1.5" />
        <polygon points="70,110 200,45 330,110" fill="#94a3b8" />
        <rect x="180" y="145" width="40" height="65" fill="#475569" />
        <rect x="115" y="145" width="40" height="35" fill="#cbd5e1" />
        <rect x="245" y="145" width="40" height="35" fill="#cbd5e1" />
      </svg>

      {/* Subtle, standard metadata stamp */}
      <div className="relative z-10 text-[9px] text-[#6B6B6B]">
        BAF Field Camera
      </div>

      <div className="relative z-10 bg-white/90 border border-[#E5E5E3] p-2 rounded text-[9px] text-[#1A1A1A] space-y-0.5">
        <div className="truncate">{address}</div>
        <div className="flex justify-between text-[#6B6B6B] text-[8px]">
          <span>{lat.toFixed(5)}, {lng.toFixed(5)}</span>
          <span>{timestamp}</span>
        </div>
      </div>
    </div>
  );
}

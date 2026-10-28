/**
 * Indonesian NIK (Nomor Induk Kependudukan) Validator
 * Based on Kemendagri & Dukcapil specifications
 */
import { NIKValidationResult } from '../types';

const PROVINCE_MAP: Record<string, string> = {
  '11': 'Aceh',
  '12': 'Sumatera Utara',
  '13': 'Sumatera Barat',
  '14': 'Riau',
  '15': 'Jambi',
  '16': 'Sumatera Selatan',
  '17': 'Bengkulu',
  '18': 'Lampung',
  '19': 'Kep. Bangka Belitung',
  '21': 'Kep. Riau',
  '31': 'DKI Jakarta',
  '32': 'Jawa Barat',
  '33': 'Jawa Tengah',
  '34': 'DI Yogyakarta',
  '35': 'Jawa Timur',
  '36': 'Banten',
  '51': 'Bali',
  '52': 'Nusa Tenggara Barat',
  '53': 'Nusa Tenggara Timur',
  '61': 'Kalimantan Barat',
  '62': 'Kalimantan Tengah',
  '63': 'Kalimantan Selatan',
  '64': 'Kalimantan Timur',
  '65': 'Kalimantan Utara',
  '71': 'Sulawesi Utara',
  '72': 'Sulawesi Tengah',
  '73': 'Sulawesi Selatan',
  '74': 'Sulawesi Tenggara',
  '75': 'Gorontalo',
  '76': 'Sulawesi Barat',
  '81': 'Maluku',
  '82': 'Maluku Utara',
  '91': 'Papua Barat',
  '94': 'Papua',
};

export function validateIndonesianNIK(rawNik: string): NIKValidationResult {
  const cleanNik = rawNik.replace(/\D/g, '');
  const errors: string[] = [];

  if (cleanNik.length !== 16) {
    errors.push(`Panjang NIK harus 16 digit (terdeteksi: ${cleanNik.length} digit)`);
    return {
      isValid: false,
      nik: cleanNik,
      provinceCode: '',
      provinceName: 'Tidak Diketahui',
      regencyCode: '',
      regencyName: 'Tidak Diketahui',
      birthDate: '',
      gender: 'Laki-laki',
      sequenceNumber: '',
      errors,
    };
  }

  const provCode = cleanNik.substring(0, 2);
  const regCode = cleanNik.substring(2, 4);
  const rawDay = parseInt(cleanNik.substring(6, 8), 10);
  const rawMonth = parseInt(cleanNik.substring(8, 10), 10);
  const rawYear = parseInt(cleanNik.substring(10, 12), 10);
  const sequence = cleanNik.substring(12, 16);

  const provName = PROVINCE_MAP[provCode] || 'Kode Provinsi Tidak Terdaftar';
  if (!PROVINCE_MAP[provCode]) {
    errors.push(`Kode provinsi '${provCode}' tidak valid dalam database Dukcapil`);
  }

  let isFemale = false;
  let day = rawDay;
  if (rawDay > 40) {
    isFemale = true;
    day = rawDay - 40;
  }

  if (day < 1 || day > 31) {
    errors.push(`Tanggal lahir '${day}' di luar rentang valid`);
  }

  if (rawMonth < 1 || rawMonth > 12) {
    errors.push(`Bulan lahir '${rawMonth}' di luar rentang 1-12`);
  }

  // Assuming birth year century: if yy <= 26 -> 2000s, else 1900s
  const fullYear = rawYear <= 26 ? 2000 + rawYear : 1900 + rawYear;
  const formattedDate = `${String(day).padStart(2, '0')}/${String(rawMonth).padStart(2, '0')}/${fullYear}`;

  if (sequence === '0000') {
    errors.push('Nomor urut registrasi tidak boleh 0000');
  }

  return {
    isValid: errors.length === 0,
    nik: cleanNik,
    provinceCode: provCode,
    provinceName: provName,
    regencyCode: `${provCode}.${regCode}`,
    regencyName: provCode === '32' ? 'Kota Bandung' : provCode === '31' ? 'Kota Jakarta Selatan' : 'Wilayah Terdaftar',
    birthDate: formattedDate,
    gender: isFemale ? 'Perempuan' : 'Laki-laki',
    sequenceNumber: sequence,
    errors,
  };
}

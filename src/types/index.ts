/**
 * VeriFin BAF Mobile App - Domain Types
 * Based on PRD & Arsitektur v0.3 for Bussan Auto Finance (BAF)
 */

export type UserRole = 'sales' | 'surveyor' | 'reviewer';

export type NetworkState = 'online' | 'offline' | 'poor';

export interface NIKValidationResult {
  isValid: boolean;
  nik: string;
  provinceCode: string;
  provinceName: string;
  regencyCode: string;
  regencyName: string;
  birthDate: string;
  gender: 'Laki-laki' | 'Perempuan';
  sequenceNumber: string;
  errors: string[];
}

export interface DocumentField {
  label: string;
  value: string;
  confidence: number; // 0 to 100. If < 90, flagged with warning
  isValid?: boolean;
}

export interface TamperDetection {
  isTampered: boolean;
  score: number; // 0 (clean) to 100 (heavily manipulated)
  checks: {
    screenRecapture: { detected: boolean; confidence: number; detail: string };
    fontInconsistency: { detected: boolean; confidence: number; detail: string };
    photoSubstitution: { detected: boolean; confidence: number; detail: string };
    copyArtifacts: { detected: boolean; confidence: number; detail: string };
  };
}

export interface DocumentScan {
  id: string;
  docType: 'ktp' | 'kk' | 'npwp' | 'stnk' | 'bpkb' | 'slip_gaji';
  title: string;
  scanDate: string;
  imageThumbnail: string;
  fields: Record<string, DocumentField>;
  tamperResult: TamperDetection;
  qualityCheck: {
    isBlur: boolean;
    isGlare: boolean;
    isCropped: boolean;
    lightingScore: number; // 0-100
  };
}

export type GeofenceZone = 'valid' | 'warning' | 'danger'; // <200m = valid (green), 200m-1km = warning (yellow), >1km = danger (red)

export interface GeoLocationPoint {
  latitude: number;
  longitude: number;
  accuracyMeters: number;
  address: string;
  timestamp: string;
}

export interface SurveyPhoto {
  id: string;
  category: 'house_front' | 'street_view' | 'meter_electric' | 'vehicle_unit' | 'neighbor_check';
  categoryLabel: string;
  capturedAt: string;
  imageThumbnail: string;
  location: GeoLocationPoint;
  watermarkText: string;
  isMockLocationDetected: boolean;
  deviceIntegrityPassed: boolean;
}

export interface SurveyInspectionItem {
  id: string;
  question: string;
  category: 'residence' | 'vehicle' | 'employment';
  answer?: 'yes' | 'no' | 'unverified';
  note?: string;
}

export interface RiskScorecard {
  totalScore: number; // 0 - 100
  status: 'green' | 'yellow' | 'red';
  breakdown: {
    eKtpScore: number;    // Max 30 weight
    locationScore: number;// Max 30 weight
    voiceScore: number;   // Max 25 weight
    docScore: number;     // Max 15 weight
  };
  flags: Array<{
    category: 'e-KTP' | 'Lokasi' | 'Suara' | 'Dokumen';
    severity: 'info' | 'warning' | 'danger';
    reason: string;
  }>;
}

export interface ApplicationCase {
  id: string; // e.g. BAF-2026-BDG-0421
  applicantName: string;
  nik: string;
  phone: string;
  branch: string; // e.g. Cabang Bandung Soekarno-Hatta
  financingType: 'Motor Baru Yamaha' | 'Motor Bekas' | 'Dana Tunai (BAF Pra Dana)' | 'Elektronik & Gadget';
  vehicleModel: string; // e.g. Yamaha NMAX 155 Connected / ABS
  financingAmount: number; // in IDR
  tenorMonths: number;
  monthlyInstallment: number;
  registeredAddress: string;
  registeredCoordinate: { latitude: number; longitude: number };
  currentStatus: 'draft' | 'document_scanned' | 'survey_pending' | 'survey_completed' | 'verified' | 'rejected' | 're_survey';
  salesOfficer: string;
  assignedSurveyor: string;
  slaDeadline: string;
  documentScans: DocumentScan[];
  surveyPhotos: SurveyPhoto[];
  surveyChecklist: SurveyInspectionItem[];
  currentSurveyorLocation?: GeoLocationPoint;
  distanceToApplicantMeters: number;
  geofenceZone: GeofenceZone;
  isMockLocationActive: boolean;
  riskScorecard: RiskScorecard;
  reviewerNotes?: string;
  decision?: 'approved' | 'rejected' | 're_survey';
}

export interface OfflineSyncQueueItem {
  id: string;
  caseId: string;
  type: 'photo_upload' | 'ocr_sync' | 'checklist_sync' | 'case_submit';
  description: string;
  fileSizeBytes: number;
  timestamp: string;
  status: 'queued' | 'uploading' | 'synced' | 'failed';
  retryCount: number;
}

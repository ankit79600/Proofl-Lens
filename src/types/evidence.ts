export type EvidenceStatus = 'registered' | 'verified' | 'modified' | 'flagged';

export interface FileMetadata {
  name: string;
  size: number;
  type: string;
  lastModified: number;
  dimensions?: string;
  algorithm: string;
}

export interface EvidenceRecord {
  proofId: string;
  status: EvidenceStatus;
  fileHash: string;
  registeredAt: string;
  fileName: string;
  fileSize: number;
  fileType: string;
  previewUrl?: string;
  metadata: FileMetadata;
  notes?: string;
  verificationCount: number;
}

export interface RegisterEvidenceResponse {
  proofId: string;
  status: 'registered';
  fileHash: string;
  timestamp: string;
  evidence: EvidenceRecord;
}

export interface VerifyEvidenceResponse {
  proofId: string;
  verified: boolean;
  message: string;
  originalHash: string;
  submittedHash: string;
  registrationDate: string;
  verificationDate: string;
  verificationStatus: 'MATCH' | 'MODIFIED' | 'NOT_FOUND';
  originalFileName?: string;
  submittedFileName?: string;
}

export interface DashboardStats {
  totalRegistered: number;
  totalVerified: number;
  verificationFailures: number;
  integrityRate: number; // e.g. 96.4%
}

export type ActiveTab = 'landing' | 'register' | 'verify' | 'certificate' | 'dashboard';

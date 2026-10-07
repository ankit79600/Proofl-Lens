import { 
  EvidenceRecord, 
  RegisterEvidenceResponse, 
  VerifyEvidenceResponse, 
  DashboardStats 
} from '../types/evidence';
import { 
  calculateFileSha256, 
  generateProofId, 
  getImageDimensions 
} from '../utils/crypto';

const STORAGE_KEY = 'prooflens_evidence_records_v1';
const STATS_KEY = 'prooflens_stats_v1';

/**
 * Seed initial sample records for realistic presentation
 */
const INITIAL_RECORDS: EvidenceRecord[] = [
  {
    proofId: 'PXL-A7K2M9',
    status: 'registered',
    fileHash: 'a83f9d1c2e5b740d164f89025e1a3bc8917e4d2938fbb2a514d3e870196a4c21',
    registeredAt: '2026-10-05T20:14:00.000Z',
    fileName: 'surveillance_feed_cam04_20261005.png',
    fileSize: 3145728, // 3 MB
    fileType: 'image/png',
    metadata: {
      name: 'surveillance_feed_cam04_20261005.png',
      size: 3145728,
      type: 'image/png',
      lastModified: 1728159240000,
      dimensions: '3840 x 2160 (4K)',
      algorithm: 'SHA-256 (NIST FIPS 180-4)'
    },
    verificationCount: 4
  },
  {
    proofId: 'PXL-8F92Q1',
    status: 'registered',
    fileHash: 'e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855',
    registeredAt: '2026-10-04T14:22:15.000Z',
    fileName: 'vehicle_damage_inspection_092.jpg',
    fileSize: 1845200,
    fileType: 'image/jpeg',
    metadata: {
      name: 'vehicle_damage_inspection_092.jpg',
      size: 1845200,
      type: 'image/jpeg',
      lastModified: 1728051735000,
      dimensions: '2048 x 1536',
      algorithm: 'SHA-256 (NIST FIPS 180-4)'
    },
    verificationCount: 2
  },
  {
    proofId: 'PXL-3N48X0',
    status: 'registered',
    fileHash: '6b86b273ff34fce19d6b804eff5a3f5747ada4eaa22f1d49c01e52ddb7875b4b',
    registeredAt: '2026-10-03T09:40:50.000Z',
    fileName: 'contract_signature_notary_seal.png',
    fileSize: 840500,
    fileType: 'image/png',
    metadata: {
      name: 'contract_signature_notary_seal.png',
      size: 840500,
      type: 'image/png',
      lastModified: 1727948450000,
      dimensions: '1920 x 1080',
      algorithm: 'SHA-256 (NIST FIPS 180-4)'
    },
    verificationCount: 6
  }
];

function getStoredRecords(): EvidenceRecord[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(INITIAL_RECORDS));
      return INITIAL_RECORDS;
    }
    return JSON.parse(raw);
  } catch {
    return INITIAL_RECORDS;
  }
}

function saveStoredRecords(records: EvidenceRecord[]): void {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(records));
  } catch (err) {
    console.error('Failed to persist evidence records', err);
  }
}

function getStoredStats(): { totalVerified: number; verificationFailures: number } {
  try {
    const raw = localStorage.getItem(STATS_KEY);
    if (!raw) {
      const initial = { totalVerified: 12, verificationFailures: 2 };
      localStorage.setItem(STATS_KEY, JSON.stringify(initial));
      return initial;
    }
    return JSON.parse(raw);
  } catch {
    return { totalVerified: 12, verificationFailures: 2 };
  }
}

function incrementStats(verified: boolean): void {
  const stats = getStoredStats();
  if (verified) {
    stats.totalVerified += 1;
  } else {
    stats.totalVerified += 1;
    stats.verificationFailures += 1;
  }
  try {
    localStorage.setItem(STATS_KEY, JSON.stringify(stats));
  } catch {
    // Ignore storage quota
  }
}

/**
 * SERVICE: registerEvidence
 * Registers evidence by computing digital fingerprint and generating cryptographic proof.
 * Ready for drop-in POST /api/evidence migration.
 */
export async function registerEvidence(
  file: File,
  onProgress?: (step: string, percent: number) => void
): Promise<RegisterEvidenceResponse> {
  // Simulate progressive network & cryptographic steps
  if (onProgress) {
    onProgress('Analyzing evidence integrity & headers...', 25);
    await new Promise((r) => setTimeout(r, 650));
    
    onProgress('Generating digital fingerprint (SHA-256 cryptographic digest)...', 60);
    await new Promise((r) => setTimeout(r, 750));
    
    onProgress('Registering immutable evidence record...', 90);
    await new Promise((r) => setTimeout(r, 600));
  } else {
    await new Promise((r) => setTimeout(r, 1200));
  }

  // Calculate genuine cryptographic hash
  const fileHash = await calculateFileSha256(file);
  const proofId = generateProofId();
  const timestamp = new Date().toISOString();
  
  // Extract dimensions
  const dims = await getImageDimensions(file);
  const dimensionsStr = dims.width > 0 ? `${dims.width} x ${dims.height}` : undefined;

  // Create preview URL (data URL or blob)
  let previewUrl: string | undefined;
  try {
    previewUrl = URL.createObjectURL(file);
  } catch {
    // preview unavailable
  }

  const record: EvidenceRecord = {
    proofId,
    status: 'registered',
    fileHash,
    registeredAt: timestamp,
    fileName: file.name,
    fileSize: file.size,
    fileType: file.type || 'image/png',
    previewUrl,
    metadata: {
      name: file.name,
      size: file.size,
      type: file.type || 'image/png',
      lastModified: file.lastModified,
      dimensions: dimensionsStr,
      algorithm: 'SHA-256 (NIST FIPS 180-4)'
    },
    verificationCount: 0
  };

  // Persist locally for prototype continuity
  const records = getStoredRecords();
  records.unshift(record);
  saveStoredRecords(records);

  if (onProgress) {
    onProgress('Evidence registered successfully', 100);
  }

  return {
    proofId,
    status: 'registered',
    fileHash,
    timestamp,
    evidence: record
  };
}

/**
 * SERVICE: verifyEvidence
 * Verifies submitted file against existing registered Proof ID.
 * Ready for drop-in POST /api/verify migration.
 */
export async function verifyEvidence(
  proofId: string, 
  file: File,
  onProgress?: (step: string, percent: number) => void
): Promise<VerifyEvidenceResponse> {
  const cleanId = proofId.trim().toUpperCase();

  if (onProgress) {
    onProgress('Querying evidence registry...', 30);
    await new Promise((r) => setTimeout(r, 500));
    
    onProgress('Computing submitted file digital fingerprint...', 65);
    await new Promise((r) => setTimeout(r, 700));
    
    onProgress('Comparing cryptographic digests...', 90);
    await new Promise((r) => setTimeout(r, 500));
  } else {
    await new Promise((r) => setTimeout(r, 1200));
  }

  const records = getStoredRecords();
  const existingRecord = records.find(r => r.proofId.toUpperCase() === cleanId);
  const submittedHash = await calculateFileSha256(file);
  const now = new Date().toISOString();

  // If proof ID not found in registry
  if (!existingRecord) {
    incrementStats(false);
    return {
      proofId: cleanId,
      verified: false,
      message: `Proof ID "${cleanId}" was not found in the evidence registry.`,
      originalHash: 'NOT_FOUND',
      submittedHash,
      registrationDate: 'N/A',
      verificationDate: now,
      verificationStatus: 'NOT_FOUND',
      submittedFileName: file.name
    };
  }

  // Update verification count
  existingRecord.verificationCount = (existingRecord.verificationCount || 0) + 1;
  saveStoredRecords(records);

  const hashesMatch = existingRecord.fileHash.toLowerCase() === submittedHash.toLowerCase();
  incrementStats(hashesMatch);

  if (hashesMatch) {
    return {
      proofId: existingRecord.proofId,
      verified: true,
      message: 'Evidence matches the original registered file.',
      originalHash: existingRecord.fileHash,
      submittedHash,
      registrationDate: existingRecord.registeredAt,
      verificationDate: now,
      verificationStatus: 'MATCH',
      originalFileName: existingRecord.fileName,
      submittedFileName: file.name
    };
  } else {
    return {
      proofId: existingRecord.proofId,
      verified: false,
      message: 'Evidence has been modified.',
      originalHash: existingRecord.fileHash,
      submittedHash,
      registrationDate: existingRecord.registeredAt,
      verificationDate: now,
      verificationStatus: 'MODIFIED',
      originalFileName: existingRecord.fileName,
      submittedFileName: file.name
    };
  }
}

/**
 * SERVICE: getEvidence
 * Retrieves registered evidence record by Proof ID
 */
export async function getEvidence(proofId: string): Promise<EvidenceRecord | null> {
  await new Promise((r) => setTimeout(r, 300));
  const records = getStoredRecords();
  const match = records.find(r => r.proofId.toUpperCase() === proofId.trim().toUpperCase());
  return match || null;
}

/**
 * SERVICE: getRecentEvidence
 * Retrieves recent evidence records
 */
export async function getRecentEvidence(): Promise<EvidenceRecord[]> {
  await new Promise((r) => setTimeout(r, 300));
  return getStoredRecords();
}

/**
 * SERVICE: getDashboardStats
 * Retrieves summarized operational metrics
 */
export async function getDashboardStats(): Promise<DashboardStats> {
  await new Promise((r) => setTimeout(r, 300));
  const records = getStoredRecords();
  const { totalVerified, verificationFailures } = getStoredStats();

  const totalRegistered = records.length;
  const successfulVerifications = Math.max(0, totalVerified - verificationFailures);
  const integrityRate = totalVerified > 0 
    ? Math.round((successfulVerifications / totalVerified) * 1000) / 10 
    : 100;

  return {
    totalRegistered,
    totalVerified,
    verificationFailures,
    integrityRate
  };
}

/**
 * SERVICE: resetDemoData
 * Allows resetting demo data in case user wants fresh testing state
 */
export function resetDemoData(): void {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(INITIAL_RECORDS));
  localStorage.setItem(STATS_KEY, JSON.stringify({ totalVerified: 14, verificationFailures: 2 }));
}

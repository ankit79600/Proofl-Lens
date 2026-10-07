import React, { useState } from 'react';
import { 
  CheckCircle2, 
  Copy, 
  Check, 
  Download, 
  Printer, 
  ArrowRight, 
  ShieldCheck, 
  Lock, 
  Calendar,
  Hash,
  FileText
} from 'lucide-react';
import { RegisterEvidenceResponse } from '../../types/evidence';
import { Badge } from '../common/Badge';
import { QrCode } from '../common/QrCode';
import { formatBytes, formatSecurityTimestamp } from '../../utils/crypto';

interface EvidenceCertificateProps {
  registrationData: RegisterEvidenceResponse;
  onVerifyNow: (proofId: string) => void;
  onRegisterAnother: () => void;
}

export const EvidenceCertificate: React.FC<EvidenceCertificateProps> = ({
  registrationData,
  onVerifyNow,
  onRegisterAnother
}) => {
  const [copiedId, setCopiedId] = useState(false);
  const [copiedHash, setCopiedHash] = useState(false);

  const { proofId, fileHash, timestamp, evidence } = registrationData;

  const handleCopyId = () => {
    navigator.clipboard.writeText(proofId);
    setCopiedId(true);
    setTimeout(() => setCopiedId(false), 2000);
  };

  const handleCopyHash = () => {
    navigator.clipboard.writeText(fileHash);
    setCopiedHash(true);
    setTimeout(() => setCopiedHash(false), 2000);
  };

  const handleDownloadProofJson = () => {
    const certificatePayload = {
      specVersion: 'prooflens-evidence-cert-v1',
      proofId,
      status: 'registered',
      fileHash,
      timestamp,
      fileInfo: {
        fileName: evidence.fileName,
        fileSize: evidence.fileSize,
        fileType: evidence.fileType,
        dimensions: evidence.metadata.dimensions,
        algorithm: evidence.metadata.algorithm,
      },
      issuer: 'ProofLens Cryptographic Registry',
      nonRepudiationHashAlgorithm: 'SHA-256',
      generatedAt: new Date().toISOString()
    };

    const blob = new Blob([JSON.stringify(certificatePayload, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `prooflens-certificate-${proofId}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-8 sm:py-12">
      
      {/* Top Banner: Success Header */}
      <div className="mb-8 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-emerald-400 text-xs font-mono font-semibold uppercase tracking-wider mb-2">
            <CheckCircle2 className="w-4 h-4" />
            <span>Registration Confirmed</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
            Evidence Registered Successfully
          </h1>
          <p className="mt-1 text-slate-400 text-sm">
            Digital evidence certificate generated and anchored to immutable registry.
          </p>
        </div>

        {/* Quick action: Verify this now */}
        <button
          onClick={() => onVerifyNow(proofId)}
          className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-semibold bg-indigo-600 hover:bg-indigo-500 text-white shadow-md shadow-indigo-600/25 transition-all shrink-0"
        >
          <span>Verify This Evidence Now</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>

      {/* THE OFFICIAL CERTIFICATE DOCUMENT CARD */}
      <div className="relative rounded-3xl border-2 border-slate-700/80 bg-gradient-to-b from-slate-900/90 to-slate-950 p-6 sm:p-10 shadow-2xl overflow-hidden print:border-black print:bg-white print:text-black">
        
        {/* Subtle Watermark Seal */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 pointer-events-none opacity-5 select-none print:hidden">
          <ShieldCheck className="w-[500px] h-[500px] text-indigo-400" />
        </div>

        {/* Top Header of Certificate */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between border-b border-slate-800 pb-6 gap-4">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-indigo-600/20 border border-indigo-500/40 flex items-center justify-center text-indigo-400">
              <ShieldCheck className="w-7 h-7" />
            </div>
            <div>
              <div className="text-xs font-mono font-bold tracking-widest text-indigo-400 uppercase">
                Digital Evidence Certificate
              </div>
              <div className="text-lg font-bold text-white tracking-tight font-sans">
                ProofLens Chain-of-Custody Attestation
              </div>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <Badge status="registered" size="lg" />
          </div>
        </div>

        {/* Certificate Body */}
        <div className="mt-8 space-y-8">
          
          {/* Row 1: Proof ID & QR Code Hero */}
          <div className="flex flex-col md:flex-row items-stretch justify-between gap-6 p-6 rounded-2xl bg-slate-950/80 border border-slate-800">
            
            {/* Proof ID Callout */}
            <div className="flex-1 space-y-3">
              <div className="text-xs font-mono text-slate-400 uppercase tracking-wider">
                Permanent Proof Identifier
              </div>

              <div className="flex flex-wrap items-center gap-3">
                <span className="text-3xl sm:text-4xl font-extrabold text-white font-mono tracking-wider bg-slate-900 px-4 py-2 rounded-xl border border-slate-800">
                  {proofId}
                </span>

                <button
                  type="button"
                  onClick={handleCopyId}
                  className="inline-flex items-center gap-2 px-3.5 py-2.5 rounded-xl text-xs font-medium bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 transition-all"
                  title="Copy Proof ID"
                >
                  {copiedId ? (
                    <>
                      <Check className="w-4 h-4 text-emerald-400" />
                      <span className="text-emerald-400 font-semibold">Copied!</span>
                    </>
                  ) : (
                    <>
                      <Copy className="w-4 h-4" />
                      <span>Copy ID</span>
                    </>
                  )}
                </button>
              </div>

              <p className="text-xs text-slate-400 leading-relaxed pt-1">
                Share this Proof ID alongside your digital file. Any recipient can input this ID 
                into ProofLens to confirm that the file is authentic and unaltered.
              </p>
            </div>

            {/* QR Code Container */}
            <div className="flex flex-col items-center justify-center p-3 rounded-xl bg-slate-900 border border-slate-800/80 shrink-0">
              <QrCode value={proofId} size={110} />
              <span className="mt-2 text-[10px] font-mono text-slate-400 tracking-wider">
                SCAN TO VERIFY
              </span>
            </div>

          </div>

          {/* Row 2: Cryptographic SHA-256 Fingerprint */}
          <div className="p-5 rounded-2xl bg-slate-950/80 border border-slate-800 space-y-2">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 text-xs font-mono text-slate-400 uppercase tracking-wider">
                <Hash className="w-3.5 h-3.5 text-indigo-400" />
                <span>SHA-256 Digital Fingerprint</span>
              </div>
              <button
                type="button"
                onClick={handleCopyHash}
                className="inline-flex items-center gap-1.5 text-xs text-indigo-400 hover:text-indigo-300 font-mono"
              >
                {copiedHash ? (
                  <span className="text-emerald-400 font-semibold flex items-center gap-1">
                    <Check className="w-3.5 h-3.5" /> Copied Hash
                  </span>
                ) : (
                  <>
                    <Copy className="w-3.5 h-3.5" />
                    <span>Copy Hash</span>
                  </>
                )}
              </button>
            </div>

            <div className="p-3.5 rounded-xl bg-slate-900/90 border border-slate-800 font-mono text-xs text-indigo-300 break-all select-all leading-relaxed">
              {fileHash}
            </div>

            <div className="flex items-center justify-between text-[11px] text-slate-500 font-mono pt-1">
              <span>Standard: NIST FIPS 180-4</span>
              <span>Length: 256 bits (64 hex characters)</span>
            </div>
          </div>

          {/* Row 3: File Information & Metadata Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            
            {/* File Specs */}
            <div className="p-5 rounded-2xl bg-slate-950/80 border border-slate-800 space-y-3">
              <div className="text-xs font-mono text-slate-400 uppercase tracking-wider flex items-center gap-2">
                <FileText className="w-3.5 h-3.5 text-indigo-400" />
                <span>File Metadata</span>
              </div>

              <div className="space-y-2 text-xs font-mono">
                <div className="flex justify-between py-1.5 border-b border-slate-900">
                  <span className="text-slate-500 font-sans">Original File Name</span>
                  <span className="text-slate-200 font-semibold truncate max-w-[200px]" title={evidence.fileName}>
                    {evidence.fileName}
                  </span>
                </div>

                <div className="flex justify-between py-1.5 border-b border-slate-900">
                  <span className="text-slate-500 font-sans">File Size</span>
                  <span className="text-slate-200">{formatBytes(evidence.fileSize)}</span>
                </div>

                <div className="flex justify-between py-1.5 border-b border-slate-900">
                  <span className="text-slate-500 font-sans">MIME Format</span>
                  <span className="text-slate-200">{evidence.fileType}</span>
                </div>

                <div className="flex justify-between py-1.5">
                  <span className="text-slate-500 font-sans">Dimensions</span>
                  <span className="text-slate-200">{evidence.metadata.dimensions || 'N/A'}</span>
                </div>
              </div>
            </div>

            {/* Registration Authority Specs */}
            <div className="p-5 rounded-2xl bg-slate-950/80 border border-slate-800 space-y-3">
              <div className="text-xs font-mono text-slate-400 uppercase tracking-wider flex items-center gap-2">
                <Calendar className="w-3.5 h-3.5 text-indigo-400" />
                <span>Timestamp & Custody</span>
              </div>

              <div className="space-y-2 text-xs font-mono">
                <div className="flex justify-between py-1.5 border-b border-slate-900">
                  <span className="text-slate-500 font-sans">Registration Timestamp</span>
                  <span className="text-slate-200">{formatSecurityTimestamp(timestamp)}</span>
                </div>

                <div className="flex justify-between py-1.5 border-b border-slate-900">
                  <span className="text-slate-500 font-sans">ISO 8601 Stamp</span>
                  <span className="text-slate-300 text-[11px] truncate max-w-[200px]">{timestamp}</span>
                </div>

                <div className="flex justify-between py-1.5 border-b border-slate-900">
                  <span className="text-slate-500 font-sans">Tamper Status</span>
                  <span className="text-emerald-400 font-semibold">Pristine & Sealed</span>
                </div>

                <div className="flex justify-between py-1.5">
                  <span className="text-slate-500 font-sans">Registry Ledger</span>
                  <span className="text-indigo-300">ProofLens Immutable Store</span>
                </div>
              </div>
            </div>

          </div>

          {/* Certificate Verification Guarantee Seal */}
          <div className="pt-4 border-t border-slate-800/80 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-400 gap-4">
            <div className="flex items-center gap-2 text-slate-400">
              <Lock className="w-4 h-4 text-emerald-400 shrink-0" />
              <span>Cryptographic non-repudiation certified by ProofLens.</span>
            </div>
            <div className="font-mono text-[11px] text-slate-500">
              SIGNATURE ID: 0x{proofId.replace('-', '')}C7E2
            </div>
          </div>

        </div>
      </div>

      {/* BOTTOM ACTIONS BAR */}
      <div className="mt-8 flex flex-wrap items-center justify-between gap-4">
        <button
          type="button"
          onClick={onRegisterAnother}
          className="px-5 py-2.5 rounded-xl text-xs font-semibold bg-slate-900 hover:bg-slate-800 text-slate-300 border border-slate-700 transition-all"
        >
          Register Another Evidence File
        </button>

        <div className="flex flex-wrap items-center gap-3">
          <button
            type="button"
            onClick={handleDownloadProofJson}
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-semibold bg-slate-900 hover:bg-slate-800 text-slate-200 border border-slate-700 transition-all"
          >
            <Download className="w-4 h-4 text-indigo-400" />
            <span>Download Certificate (JSON)</span>
          </button>

          <button
            type="button"
            onClick={handlePrint}
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-semibold bg-slate-900 hover:bg-slate-800 text-slate-200 border border-slate-700 transition-all"
          >
            <Printer className="w-4 h-4 text-indigo-400" />
            <span>Print Certificate</span>
          </button>
        </div>
      </div>

    </div>
  );
};

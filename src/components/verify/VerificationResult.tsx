import React, { useEffect } from 'react';
import { 
  CheckCircle2, 
  XCircle, 
  AlertTriangle, 
  ShieldCheck, 
  ShieldAlert, 
  Copy, 
  Check, 
  RotateCcw, 
  Download, 
  Hash
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { VerifyEvidenceResponse } from '../../types/evidence';
import { formatSecurityTimestamp } from '../../utils/crypto';

interface VerificationResultProps {
  result: VerifyEvidenceResponse;
  onReset: () => void;
  onNavigateToRegister: () => void;
}

export const VerificationResult: React.FC<VerificationResultProps> = ({
  result,
  onReset,
  onNavigateToRegister
}) => {
  const [copiedOriginalHash, setCopiedOriginalHash] = React.useState(false);
  const [copiedSubmittedHash, setCopiedSubmittedHash] = React.useState(false);

  const isMatch = result.verified && result.verificationStatus === 'MATCH';
  const isModified = !result.verified && result.verificationStatus === 'MODIFIED';
  const isNotFound = result.verificationStatus === 'NOT_FOUND';

  // Trigger celebration confetti on authentic match
  useEffect(() => {
    if (isMatch) {
      confetti({
        particleCount: 80,
        spread: 70,
        origin: { y: 0.6 },
        colors: ['#10b981', '#3b82f6', '#6366f1']
      });
    }
  }, [isMatch]);

  const handleCopyOriginalHash = () => {
    navigator.clipboard.writeText(result.originalHash);
    setCopiedOriginalHash(true);
    setTimeout(() => setCopiedOriginalHash(false), 2000);
  };

  const handleCopySubmittedHash = () => {
    navigator.clipboard.writeText(result.submittedHash);
    setCopiedSubmittedHash(true);
    setTimeout(() => setCopiedSubmittedHash(false), 2000);
  };

  const handleDownloadAuditReport = () => {
    const report = {
      auditReportType: 'prooflens-forensic-verification-v1',
      proofId: result.proofId,
      status: result.verificationStatus,
      verified: result.verified,
      message: result.message,
      originalHash: result.originalHash,
      submittedHash: result.submittedHash,
      registrationDate: result.registrationDate,
      verificationDate: result.verificationDate,
      submittedFileName: result.submittedFileName,
      originalFileName: result.originalFileName,
      verdict: isMatch ? 'AUTHENTIC_UNMODIFIED' : isModified ? 'TAMPERED_OR_CORRUPT' : 'UNREGISTERED_RECORD',
      generatedAt: new Date().toISOString()
    };

    const blob = new Blob([JSON.stringify(report, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `prooflens-verification-${result.proofId}-${result.verificationStatus.toLowerCase()}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-300">
      
      {/* 1. PROMINENT VERIFICATION STATUS HERO BANNER */}
      {isMatch && (
        <div className="rounded-3xl border-2 border-emerald-500/40 bg-gradient-to-b from-emerald-950/40 via-slate-900 to-slate-950 p-6 sm:p-10 shadow-2xl relative overflow-hidden">
          <div className="absolute top-0 right-0 w-96 h-96 bg-emerald-500/10 blur-3xl rounded-full pointer-events-none" />
          
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-5">
            <div className="w-16 h-16 rounded-2xl bg-emerald-500/20 border border-emerald-500/40 flex items-center justify-center text-emerald-400 shrink-0 shadow-lg shadow-emerald-500/20">
              <CheckCircle2 className="w-10 h-10" />
            </div>

            <div className="space-y-1">
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 text-xs font-mono font-bold tracking-wider">
                <ShieldCheck className="w-3.5 h-3.5" />
                <span>INTEGRITY VERIFIED</span>
              </div>
              <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
                ✓ Evidence Verified
              </h2>
              <p className="text-base sm:text-lg text-emerald-200/90 font-medium pt-1">
                The uploaded file matches the originally registered evidence.
              </p>
            </div>
          </div>
        </div>
      )}

      {isModified && (
        <div className="rounded-3xl border-2 border-rose-500/40 bg-gradient-to-b from-rose-950/40 via-slate-900 to-slate-950 p-6 sm:p-10 shadow-2xl relative overflow-hidden">
          <div className="absolute top-0 right-0 w-96 h-96 bg-rose-500/10 blur-3xl rounded-full pointer-events-none" />
          
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-5">
            <div className="w-16 h-16 rounded-2xl bg-rose-500/20 border border-rose-500/40 flex items-center justify-center text-rose-400 shrink-0 shadow-lg shadow-rose-500/20">
              <XCircle className="w-10 h-10" />
            </div>

            <div className="space-y-1">
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-rose-500/20 text-rose-300 border border-rose-500/30 text-xs font-mono font-bold tracking-wider">
                <ShieldAlert className="w-3.5 h-3.5" />
                <span>TAMPER DETECTED</span>
              </div>
              <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
                ✕ Evidence Modified
              </h2>
              <p className="text-base sm:text-lg text-rose-200/90 font-medium pt-1">
                The uploaded file does not match the originally registered evidence.
              </p>
            </div>
          </div>
        </div>
      )}

      {isNotFound && (
        <div className="rounded-3xl border-2 border-amber-500/40 bg-gradient-to-b from-amber-950/40 via-slate-900 to-slate-950 p-6 sm:p-10 shadow-2xl relative overflow-hidden">
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-5">
            <div className="w-16 h-16 rounded-2xl bg-amber-500/20 border border-amber-500/40 flex items-center justify-center text-amber-400 shrink-0">
              <AlertTriangle className="w-10 h-10" />
            </div>

            <div className="space-y-1">
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/30 text-xs font-mono font-bold tracking-wider">
                <span>REGISTRY NOTICE</span>
              </div>
              <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
                Proof ID Not Found
              </h2>
              <p className="text-base text-amber-200/90 font-medium pt-1">
                {result.message}
              </p>
            </div>
          </div>
        </div>
      )}

      {/* 2. CRYPTOGRAPHIC COMPARISON DETAILS */}
      <div className="rounded-2xl border border-slate-800 bg-slate-900/60 p-6 sm:p-8 space-y-6">
        
        {/* Header row with Proof ID & Status */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between pb-4 border-b border-slate-800 gap-3">
          <div>
            <div className="text-xs font-mono text-slate-400 uppercase tracking-wider">
              Verification Proof Target
            </div>
            <div className="text-2xl font-bold font-mono text-white tracking-wider">
              {result.proofId}
            </div>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-xs text-slate-400">Status:</span>
            <span className={`px-3 py-1 rounded-full text-xs font-mono font-semibold border ${
              isMatch
                ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30'
                : isModified
                ? 'bg-rose-500/10 text-rose-400 border-rose-500/30'
                : 'bg-amber-500/10 text-amber-400 border-amber-500/30'
            }`}>
              {result.verificationStatus}
            </span>
          </div>
        </div>

        {/* SIDE-BY-SIDE HASH COMPARISON */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <span className="text-xs font-mono font-semibold text-slate-300 uppercase tracking-wider flex items-center gap-2">
              <Hash className="w-4 h-4 text-indigo-400" />
              <span>SHA-256 Digest Comparison</span>
            </span>
            <span className="text-xs font-mono text-slate-500">
              {isMatch ? 'Zero-Bit Variance (Identical)' : isModified ? 'Cryptographic Divergence Detected' : 'No Original Record'}
            </span>
          </div>

          {/* Original Hash */}
          <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-2">
            <div className="flex items-center justify-between text-xs font-mono">
              <span className="text-slate-400 font-sans font-medium">Original Registered Fingerprint</span>
              {result.originalHash !== 'NOT_FOUND' && (
                <button
                  type="button"
                  onClick={handleCopyOriginalHash}
                  className="text-indigo-400 hover:text-indigo-300 inline-flex items-center gap-1"
                >
                  {copiedOriginalHash ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                  <span>{copiedOriginalHash ? 'Copied' : 'Copy'}</span>
                </button>
              )}
            </div>
            <div className={`font-mono text-xs break-all leading-relaxed ${
              isMatch ? 'text-emerald-300' : isModified ? 'text-indigo-300' : 'text-slate-500 italic'
            }`}>
              {result.originalHash}
            </div>
          </div>

          {/* Submitted Hash */}
          <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-2">
            <div className="flex items-center justify-between text-xs font-mono">
              <span className="text-slate-400 font-sans font-medium">Submitted File Fingerprint</span>
              <button
                type="button"
                onClick={handleCopySubmittedHash}
                className="text-indigo-400 hover:text-indigo-300 inline-flex items-center gap-1"
              >
                {copiedSubmittedHash ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copiedSubmittedHash ? 'Copied' : 'Copy'}</span>
              </button>
            </div>
            <div className={`font-mono text-xs break-all leading-relaxed ${
              isMatch ? 'text-emerald-300' : isModified ? 'text-rose-400 font-semibold' : 'text-slate-300'
            }`}>
              {result.submittedHash}
            </div>
          </div>

        </div>

        {/* METADATA GRID */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 pt-2 text-xs font-mono">
          <div className="p-3.5 rounded-xl bg-slate-950 border border-slate-800">
            <div className="text-slate-500 font-sans text-[11px] mb-1">Registration Date</div>
            <div className="text-slate-200">
              {result.registrationDate !== 'N/A' ? formatSecurityTimestamp(result.registrationDate) : 'N/A'}
            </div>
          </div>

          <div className="p-3.5 rounded-xl bg-slate-950 border border-slate-800">
            <div className="text-slate-500 font-sans text-[11px] mb-1">Verification Date</div>
            <div className="text-slate-200">
              {formatSecurityTimestamp(result.verificationDate)}
            </div>
          </div>

          <div className="p-3.5 rounded-xl bg-slate-950 border border-slate-800">
            <div className="text-slate-500 font-sans text-[11px] mb-1">Submitted File</div>
            <div className="text-slate-200 truncate" title={result.submittedFileName}>
              {result.submittedFileName || 'Evidence Image'}
            </div>
          </div>

          <div className="p-3.5 rounded-xl bg-slate-950 border border-slate-800">
            <div className="text-slate-500 font-sans text-[11px] mb-1">Algorithm Standard</div>
            <div className="text-indigo-400">SHA-256 (NIST)</div>
          </div>
        </div>

        {/* EXPLANATORY FORENSIC CALLOUT */}
        {isModified && (
          <div className="p-4 rounded-xl bg-rose-950/20 border border-rose-900/40 text-xs text-rose-300/90 leading-relaxed space-y-2">
            <div className="font-semibold text-rose-300 flex items-center gap-1.5">
              <ShieldAlert className="w-4 h-4 text-rose-400" />
              <span>Forensic Divergence Explanation</span>
            </div>
            <p>
              Under SHA-256 cryptographic standards, if even a single byte or pixel had been preserved identically, 
              the resulting hash would match. The mismatch indicates that this image was modified, compressed with 
              different quantization tables, edited, re-exported, or replaced by another file.
            </p>
          </div>
        )}

        {isNotFound && (
          <div className="p-4 rounded-xl bg-amber-950/20 border border-amber-900/40 text-xs text-amber-300/90 leading-relaxed flex items-center justify-between">
            <span>
              This Proof ID has not been registered in the local evidence registry yet. Would you like to register this image as an initial record?
            </span>
            <button
              onClick={onNavigateToRegister}
              className="ml-3 px-3 py-1.5 rounded-lg bg-amber-500/20 text-amber-200 hover:bg-amber-500/30 border border-amber-500/40 shrink-0 font-medium"
            >
              Register It Now
            </button>
          </div>
        )}

      </div>

      {/* 3. ACTIONS FOOTER */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <button
          type="button"
          onClick={onReset}
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs font-semibold bg-slate-900 hover:bg-slate-800 text-slate-300 border border-slate-700 transition-all"
        >
          <RotateCcw className="w-4 h-4 text-indigo-400" />
          <span>Verify Another File</span>
        </button>

        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={handleDownloadAuditReport}
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-semibold bg-slate-900 hover:bg-slate-800 text-slate-200 border border-slate-700 transition-all"
          >
            <Download className="w-4 h-4 text-indigo-400" />
            <span>Download Audit Report (JSON)</span>
          </button>
        </div>
      </div>

    </div>
  );
};

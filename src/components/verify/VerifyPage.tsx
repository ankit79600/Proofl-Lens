import React, { useState, useRef, ChangeEvent, DragEvent, useEffect } from 'react';
import { 
  Search, 
  UploadCloud, 
  Image as ImageIcon, 
  X, 
  ShieldCheck, 
  AlertCircle, 
  ArrowRight,
  Sliders
} from 'lucide-react';
import { VerifyEvidenceResponse, EvidenceRecord } from '../../types/evidence';
import { verifyEvidence, getRecentEvidence } from '../../services/evidence';
import { formatBytes } from '../../utils/crypto';
import { VerificationResult } from './VerificationResult';

interface VerifyPageProps {
  initialProofId?: string;
  onNavigateToRegister: () => void;
}

export const VerifyPage: React.FC<VerifyPageProps> = ({ 
  initialProofId = '', 
  onNavigateToRegister 
}) => {
  const [proofId, setProofId] = useState<string>(initialProofId);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [isDragging, setIsDragging] = useState<boolean>(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  // Recent proof suggestions
  const [recentRecords, setRecentRecords] = useState<EvidenceRecord[]>([]);

  // Processing state
  const [isProcessing, setIsProcessing] = useState<boolean>(false);
  const [currentStep, setCurrentStep] = useState<string>('');

  // Result state
  const [verificationResult, setVerificationResult] = useState<VerifyEvidenceResponse | null>(null);

  const fileInputRef = useRef<HTMLInputElement>(null);

  // Load available recent Proof IDs for convenience
  useEffect(() => {
    getRecentEvidence().then((records) => {
      setRecentRecords(records.slice(0, 4));
    });
  }, []);

  // Sync initialProofId if it changes
  useEffect(() => {
    if (initialProofId) {
      setProofId(initialProofId);
    }
  }, [initialProofId]);

  const processFile = async (file: File) => {
    setErrorMsg(null);
    if (!file.type.startsWith('image/')) {
      setErrorMsg('Please select a valid image file to verify.');
      return;
    }

    setSelectedFile(file);
    const url = URL.createObjectURL(file);
    setPreviewUrl(url);
  };

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      processFile(e.target.files[0]);
    }
  };

  const handleDragOver = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      processFile(e.dataTransfer.files[0]);
    }
  };

  const handleRemoveImage = () => {
    setSelectedFile(null);
    if (previewUrl) {
      URL.revokeObjectURL(previewUrl);
      setPreviewUrl(null);
    }
    setErrorMsg(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleVerify = async () => {
    if (!proofId.trim()) {
      setErrorMsg('Please enter a valid Proof ID to verify.');
      return;
    }
    if (!selectedFile) {
      setErrorMsg('Please upload the image you want to verify against this Proof ID.');
      return;
    }

    setErrorMsg(null);
    setIsProcessing(true);
    setCurrentStep('Querying evidence registry...');

    try {
      const response = await verifyEvidence(proofId.trim(), selectedFile, (step) => {
        setCurrentStep(step);
      });

      setIsProcessing(false);
      setVerificationResult(response);
    } catch (err) {
      setIsProcessing(false);
      setErrorMsg('An error occurred during verification. Please try again.');
      console.error(err);
    }
  };

  const handleResetVerification = () => {
    setVerificationResult(null);
    setErrorMsg(null);
  };

  // Helper for 1-click test simulation:
  const handleQuickTestTamper = async () => {
    // Creates a dummy altered blob for instant testing of the MODIFIED state
    const canvas = document.createElement('canvas');
    canvas.width = 100;
    canvas.height = 100;
    const ctx = canvas.getContext('2d');
    if (ctx) {
      ctx.fillStyle = 'red';
      ctx.fillRect(0, 0, 100, 100);
      ctx.fillStyle = 'black';
      ctx.fillText('MODIFIED', 10, 50);
    }
    canvas.toBlob((blob) => {
      if (blob) {
        const dummyFile = new File([blob], 'modified_sample_evidence.png', { type: 'image/png' });
        processFile(dummyFile);
        if (!proofId) {
          setProofId('PXL-A7K2M9');
        }
      }
    });
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-8 sm:py-12">
      
      {/* If Result is present, show VerificationResult */}
      {verificationResult ? (
        <VerificationResult
          result={verificationResult}
          onReset={handleResetVerification}
          onNavigateToRegister={onNavigateToRegister}
        />
      ) : (
        /* VERIFY FORM FLOW */
        <div className="space-y-8">
          
          {/* Header */}
          <div>
            <div className="flex items-center gap-2 text-indigo-400 text-xs font-mono font-semibold uppercase tracking-wider mb-2">
              <Search className="w-4 h-4" />
              <span>Evidence Verification Protocol</span>
            </div>
            <h1 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
              Verify Digital Evidence
            </h1>
            <p className="mt-2 text-slate-400 text-sm max-w-2xl leading-relaxed">
              Compare any digital image against its original registered Proof ID. ProofLens performs 
              a byte-level cryptographic match to determine if the evidence is pristine or modified.
            </p>
          </div>

          {/* Form Container */}
          <div className="rounded-2xl border border-slate-800 bg-slate-900/60 p-6 sm:p-8 backdrop-blur-sm space-y-6">
            
            {/* Error banner */}
            {errorMsg && (
              <div className="p-4 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-300 text-sm flex items-center gap-3">
                <AlertCircle className="w-5 h-5 text-rose-400 shrink-0" />
                <span>{errorMsg}</span>
              </div>
            )}

            {/* STEP 1: PROOF ID INPUT */}
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <label className="block text-xs font-semibold text-slate-200 uppercase tracking-wider font-mono">
                  1. Enter Proof ID
                </label>
                <span className="text-[11px] text-slate-500 font-mono">Format: PXL-XXXXXX</span>
              </div>

              <div className="relative">
                <input
                  type="text"
                  value={proofId}
                  onChange={(e) => setProofId(e.target.value.toUpperCase())}
                  placeholder="e.g. PXL-A7K2M9"
                  className="w-full px-4 py-3 rounded-xl bg-slate-950 border border-slate-800 text-white font-mono text-base tracking-wider placeholder-slate-600 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-all uppercase"
                />
                {proofId && (
                  <button
                    type="button"
                    onClick={() => setProofId('')}
                    className="absolute right-3 top-3 text-slate-500 hover:text-slate-300 p-1"
                  >
                    <X className="w-4 h-4" />
                  </button>
                )}
              </div>

              {/* Quick Select Suggestion Chips */}
              {recentRecords.length > 0 && (
                <div className="flex flex-wrap items-center gap-2 pt-1 text-xs">
                  <span className="text-slate-400 text-[11px]">Select sample Proof ID:</span>
                  {recentRecords.map((rec) => (
                    <button
                      key={rec.proofId}
                      type="button"
                      onClick={() => setProofId(rec.proofId)}
                      className={`px-2.5 py-1 rounded-lg font-mono text-xs border transition-all ${
                        proofId === rec.proofId
                          ? 'bg-indigo-600 text-white border-indigo-500'
                          : 'bg-slate-950 text-indigo-300 border-slate-800 hover:border-slate-700 hover:text-white'
                      }`}
                    >
                      {rec.proofId}
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* STEP 2: UPLOAD IMAGE TO VERIFY */}
            <div className="space-y-3 pt-2">
              <label className="block text-xs font-semibold text-slate-200 uppercase tracking-wider font-mono">
                2. Upload Questioned Evidence Image
              </label>

              {!selectedFile ? (
                <div
                  onDragOver={handleDragOver}
                  onDragLeave={handleDragLeave}
                  onDrop={handleDrop}
                  onClick={() => fileInputRef.current?.click()}
                  className={`border-2 border-dashed rounded-2xl p-8 sm:p-12 text-center cursor-pointer transition-all ${
                    isDragging
                      ? 'border-indigo-400 bg-indigo-500/10 scale-[1.005]'
                      : 'border-slate-700/80 bg-slate-950/60 hover:border-indigo-500/50 hover:bg-slate-900/40'
                  }`}
                >
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={handleFileChange}
                  />

                  <div className="w-14 h-14 mx-auto mb-3 rounded-2xl bg-indigo-600/15 border border-indigo-500/30 flex items-center justify-center text-indigo-400">
                    <UploadCloud className="w-7 h-7" />
                  </div>

                  <h3 className="text-base font-bold text-white mb-1">
                    Drag and drop file to test verification
                  </h3>
                  <p className="text-xs text-slate-400">
                    or click to select the image file from disk
                  </p>
                </div>
              ) : (
                /* Selected File Preview Box */
                <div className="flex flex-col sm:flex-row items-center justify-between gap-4 p-4 rounded-xl bg-slate-950 border border-slate-800">
                  <div className="flex items-center gap-4 w-full sm:w-auto">
                    <div className="w-16 h-16 rounded-lg bg-slate-900 border border-slate-800 overflow-hidden flex items-center justify-center shrink-0">
                      {previewUrl ? (
                        <img
                          src={previewUrl}
                          alt="Verification Preview"
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <ImageIcon className="w-6 h-6 text-slate-600" />
                      )}
                    </div>

                    <div className="overflow-hidden">
                      <div className="text-sm font-bold text-white truncate max-w-[240px] sm:max-w-xs">
                        {selectedFile.name}
                      </div>
                      <div className="text-xs font-mono text-slate-400 mt-0.5">
                        {formatBytes(selectedFile.size)} • {selectedFile.type || 'image'}
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 w-full sm:w-auto justify-end">
                    <button
                      type="button"
                      onClick={() => fileInputRef.current?.click()}
                      className="text-xs text-indigo-400 hover:text-indigo-300 font-medium px-2 py-1 rounded"
                    >
                      Change
                    </button>
                    <button
                      type="button"
                      onClick={handleRemoveImage}
                      className="p-1 text-slate-400 hover:text-rose-400 transition-colors"
                      title="Remove image"
                    >
                      <X className="w-5 h-5" />
                    </button>
                    <input
                      ref={fileInputRef}
                      type="file"
                      accept="image/*"
                      className="hidden"
                      onChange={handleFileChange}
                    />
                  </div>
                </div>
              )}
            </div>

            {/* Quick Demo Assist helper */}
            <div className="p-3.5 rounded-xl bg-slate-950 border border-slate-800/80 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-xs">
              <span className="text-slate-400">
                Want to test the <span className="text-rose-400 font-semibold">✕ Evidence Modified</span> alert flow quickly?
              </span>
              <button
                type="button"
                onClick={handleQuickTestTamper}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-900 hover:bg-slate-800 text-rose-300 border border-rose-500/30 font-medium shrink-0"
              >
                <Sliders className="w-3.5 h-3.5" />
                <span>Simulate Altered File</span>
              </button>
            </div>

            {/* SUBMIT BUTTON */}
            <div className="pt-4 border-t border-slate-800 flex justify-end">
              <button
                type="button"
                onClick={handleVerify}
                disabled={isProcessing || !proofId.trim() || !selectedFile}
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2.5 px-7 py-3.5 rounded-xl text-sm font-semibold bg-indigo-600 hover:bg-indigo-500 text-white shadow-lg shadow-indigo-600/30 transition-all hover:scale-[1.01] active:scale-[0.99] disabled:opacity-40 disabled:hover:scale-100"
              >
                <ShieldCheck className="w-4 h-4" />
                <span>Verify Evidence</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>

          </div>

          {/* Verification Processing Modal */}
          {isProcessing && (
            <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/85 backdrop-blur-md px-4">
              <div className="max-w-md w-full rounded-2xl border border-indigo-500/30 bg-slate-900 p-8 shadow-2xl text-center space-y-6 animate-in fade-in zoom-in-95 duration-200">
                
                <div className="relative w-20 h-20 mx-auto">
                  <div className="absolute inset-0 rounded-full border-4 border-indigo-500/20 border-t-indigo-500 animate-spin" />
                  <div className="absolute inset-0 flex items-center justify-center text-indigo-400">
                    <Search className="w-8 h-8 animate-pulse" />
                  </div>
                </div>

                <div>
                  <h3 className="text-xl font-bold text-white">
                    {currentStep}
                  </h3>
                  <p className="mt-1 text-xs text-slate-400 font-mono">
                    Querying Proof ID: {proofId}
                  </p>
                </div>

                <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 text-xs font-mono text-slate-400">
                  Target Algorithm: SHA-256 (256-bit Digest Match)
                </div>
              </div>
            </div>
          )}

        </div>
      )}

    </div>
  );
};

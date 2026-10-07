import React, { useState, useRef, ChangeEvent, DragEvent } from 'react';
import { 
  UploadCloud, 
  Image as ImageIcon, 
  X, 
  ShieldCheck, 
  Cpu, 
  Lock, 
  CheckCircle2, 
  AlertCircle,
  RefreshCw,
  ArrowRight
} from 'lucide-react';
import { RegisterEvidenceResponse } from '../../types/evidence';
import { registerEvidence } from '../../services/evidence';
import { formatBytes, getImageDimensions } from '../../utils/crypto';

interface RegisterPageProps {
  onRegistrationSuccess: (response: RegisterEvidenceResponse) => void;
  onCancel?: () => void;
}

export const RegisterPage: React.FC<RegisterPageProps> = ({ 
  onRegistrationSuccess,
  onCancel 
}) => {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [dimensions, setDimensions] = useState<{ width: number; height: number } | null>(null);
  const [isDragging, setIsDragging] = useState<boolean>(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  // Custody note / title
  const [caseTitle, setCaseTitle] = useState<string>('');
  const [custodyNotes, setCustodyNotes] = useState<string>('');

  // Processing state
  const [isProcessing, setIsProcessing] = useState<boolean>(false);
  const [currentStep, setCurrentStep] = useState<string>('');
  const [progressPercent, setProgressPercent] = useState<number>(0);

  const fileInputRef = useRef<HTMLInputElement>(null);

  const processFile = async (file: File) => {
    setErrorMsg(null);
    if (!file.type.startsWith('image/')) {
      setErrorMsg('Please select a valid image file (PNG, JPG, WEBP, etc.)');
      return;
    }

    setSelectedFile(file);

    // Create preview
    const url = URL.createObjectURL(file);
    setPreviewUrl(url);

    // Extract dimensions
    try {
      const dims = await getImageDimensions(file);
      setDimensions(dims);
    } catch {
      setDimensions(null);
    }
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
    setDimensions(null);
    setErrorMsg(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleRegister = async () => {
    if (!selectedFile) return;

    setIsProcessing(true);
    setProgressPercent(10);
    setCurrentStep('Analyzing evidence...');

    try {
      const response = await registerEvidence(selectedFile, (stepText, percent) => {
        setCurrentStep(stepText);
        setProgressPercent(percent);
      });

      // Brief delay to allow 100% completion state to be appreciated
      setTimeout(() => {
        setIsProcessing(false);
        onRegistrationSuccess(response);
      }, 400);
    } catch (err) {
      setIsProcessing(false);
      setErrorMsg('Failed to register evidence. Please try again.');
      console.error(err);
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-8 sm:py-12">
      
      {/* Page Title & Context */}
      <div className="mb-8">
        <div className="flex items-center gap-2 text-indigo-400 text-xs font-mono font-semibold uppercase tracking-wider mb-2">
          <ShieldCheck className="w-4 h-4" />
          <span>Evidence Ingestion Protocol</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
          Register New Digital Evidence
        </h1>
        <p className="mt-2 text-slate-400 text-sm max-w-2xl leading-relaxed">
          Upload an original evidentiary image to calculate its immutable cryptographic fingerprint 
          and anchor it to the ProofLens verification registry.
        </p>
      </div>

      {/* Main Registration Card */}
      <div className="rounded-2xl border border-slate-800 bg-slate-900/60 p-6 sm:p-8 backdrop-blur-sm relative overflow-hidden">
        
        {/* Error notification */}
        {errorMsg && (
          <div className="mb-6 p-4 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-300 text-sm flex items-center gap-3">
            <AlertCircle className="w-5 h-5 text-rose-400 shrink-0" />
            <span>{errorMsg}</span>
          </div>
        )}

        {/* STEP A: DROPZONE OR PREVIEW */}
        {!selectedFile ? (
          <div
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
            onClick={() => fileInputRef.current?.click()}
            className={`border-2 border-dashed rounded-2xl p-8 sm:p-14 text-center cursor-pointer transition-all ${
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

            <div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-indigo-600/15 border border-indigo-500/30 flex items-center justify-center text-indigo-400">
              <UploadCloud className="w-8 h-8" />
            </div>

            <h3 className="text-lg font-bold text-white mb-1">
              Drag and drop evidence image here
            </h3>
            <p className="text-sm text-slate-400 mb-4">
              or <span className="text-indigo-400 font-semibold underline underline-offset-2">browse files</span> from your secure workstation
            </p>

            <div className="inline-flex items-center gap-3 px-3 py-1.5 rounded-full bg-slate-900 border border-slate-800 text-[11px] text-slate-400 font-mono">
              <span>PNG, JPG, WEBP, TIFF</span>
              <span>•</span>
              <span>Max recommended 50MB</span>
            </div>
          </div>
        ) : (
          /* PREVIEW STATE */
          <div className="space-y-6">
            <div className="flex flex-col md:flex-row gap-6 p-5 rounded-2xl bg-slate-950 border border-slate-800">
              
              {/* Image Preview Container */}
              <div className="relative w-full md:w-64 h-56 rounded-xl overflow-hidden bg-slate-900 border border-slate-800/80 shrink-0 flex items-center justify-center group">
                {previewUrl ? (
                  <img
                    src={previewUrl}
                    alt="Evidence Preview"
                    className="w-full h-full object-contain"
                  />
                ) : (
                  <ImageIcon className="w-10 h-10 text-slate-600" />
                )}
                
                <div className="absolute top-2 right-2 flex items-center gap-1.5">
                  <span className="px-2 py-0.5 rounded text-[10px] font-mono font-semibold bg-slate-950/80 text-emerald-400 border border-emerald-500/30 backdrop-blur-sm">
                    RAW FILE
                  </span>
                </div>
              </div>

              {/* File Information Details */}
              <div className="flex-1 flex flex-col justify-between space-y-4">
                <div>
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <div className="text-xs font-mono text-slate-400 uppercase tracking-wider mb-1">
                        Selected File
                      </div>
                      <h3 className="text-lg font-bold text-white break-all leading-tight">
                        {selectedFile.name}
                      </h3>
                    </div>

                    <button
                      type="button"
                      onClick={handleRemoveImage}
                      className="p-1.5 rounded-lg text-slate-400 hover:text-rose-400 hover:bg-slate-900 transition-all"
                      title="Remove image"
                    >
                      <X className="w-5 h-5" />
                    </button>
                  </div>

                  {/* Metadata chips */}
                  <div className="mt-4 grid grid-cols-2 sm:grid-cols-3 gap-2.5 text-xs font-mono">
                    <div className="p-2.5 rounded-lg bg-slate-900/90 border border-slate-800">
                      <div className="text-slate-500 text-[10px] font-sans">FILE SIZE</div>
                      <div className="text-slate-200 font-semibold">{formatBytes(selectedFile.size)}</div>
                    </div>

                    <div className="p-2.5 rounded-lg bg-slate-900/90 border border-slate-800">
                      <div className="text-slate-500 text-[10px] font-sans">MIME TYPE</div>
                      <div className="text-slate-200 font-semibold truncate">{selectedFile.type || 'image/raw'}</div>
                    </div>

                    <div className="p-2.5 rounded-lg bg-slate-900/90 border border-slate-800 col-span-2 sm:col-span-1">
                      <div className="text-slate-500 text-[10px] font-sans">DIMENSIONS</div>
                      <div className="text-slate-200 font-semibold">
                        {dimensions && dimensions.width > 0 ? `${dimensions.width} × ${dimensions.height}` : 'Calculating...'}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Change file CTA */}
                <div className="flex items-center gap-3 pt-2">
                  <button
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    className="inline-flex items-center gap-1.5 text-xs text-indigo-400 hover:text-indigo-300 font-medium"
                  >
                    <RefreshCw className="w-3.5 h-3.5" />
                    <span>Change Image</span>
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
            </div>

            {/* Optional Case Metadata Inputs */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                  Evidence Label / Reference (Optional)
                </label>
                <input
                  type="text"
                  value={caseTitle}
                  onChange={(e) => setCaseTitle(e.target.value)}
                  placeholder="e.g. Incident Scene #4 - North Entrance"
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500 transition-colors"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                  Custody Officer / Source Note (Optional)
                </label>
                <input
                  type="text"
                  value={custodyNotes}
                  onChange={(e) => setCustodyNotes(e.target.value)}
                  placeholder="e.g. Ingested from Field Camera SD #02"
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500 transition-colors"
                />
              </div>
            </div>

            {/* Security Notice */}
            <div className="p-3.5 rounded-xl bg-indigo-950/30 border border-indigo-900/40 text-xs text-indigo-300 flex items-center gap-3">
              <Lock className="w-4 h-4 text-indigo-400 shrink-0" />
              <span>
                Your file is processed client-side. The resulting cryptographic SHA-256 fingerprint will be immutable and permanently queryable.
              </span>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row items-center justify-end gap-3 pt-4 border-t border-slate-800">
              {onCancel && (
                <button
                  type="button"
                  onClick={onCancel}
                  className="w-full sm:w-auto px-5 py-2.5 rounded-xl text-xs font-semibold text-slate-400 hover:text-white hover:bg-slate-800 transition-all"
                >
                  Cancel
                </button>
              )}

              <button
                type="button"
                onClick={handleRegister}
                disabled={isProcessing}
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl text-sm font-semibold bg-indigo-600 hover:bg-indigo-500 text-white shadow-lg shadow-indigo-600/30 transition-all hover:scale-[1.01] active:scale-[0.99] disabled:opacity-50"
              >
                <ShieldCheck className="w-4 h-4" />
                <span>Register Evidence</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>

          </div>
        )}

      </div>

      {/* 3. ANALYSIS / PROCESSING MODAL OVERLAY */}
      {isProcessing && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/85 backdrop-blur-md px-4">
          <div className="max-w-md w-full rounded-2xl border border-indigo-500/30 bg-slate-900 p-8 shadow-2xl text-center space-y-6 animate-in fade-in zoom-in-95 duration-200">
            
            {/* Spinning Shield Indicator */}
            <div className="relative w-20 h-20 mx-auto">
              <div className="absolute inset-0 rounded-full border-4 border-indigo-500/20 border-t-indigo-500 animate-spin" />
              <div className="absolute inset-0 flex items-center justify-center text-indigo-400">
                <Cpu className="w-8 h-8 animate-pulse" />
              </div>
            </div>

            <div>
              <h3 className="text-xl font-bold text-white">
                {currentStep}
              </h3>
              <p className="mt-1 text-xs text-slate-400 font-mono">
                Running cryptographic verification pipeline
              </p>
            </div>

            {/* Stepped Checklist Progress */}
            <div className="space-y-2.5 text-left text-xs">
              
              <div className="flex items-center justify-between p-2.5 rounded-lg bg-slate-950/80 border border-slate-800">
                <div className="flex items-center gap-2">
                  {progressPercent >= 25 ? (
                    <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                  ) : (
                    <div className="w-4 h-4 rounded-full border-2 border-slate-600 animate-pulse" />
                  )}
                  <span className={progressPercent >= 25 ? 'text-slate-200 font-medium' : 'text-slate-500'}>
                    Analyzing evidence structure
                  </span>
                </div>
                <span className="font-mono text-[10px] text-slate-500">EXIF / Headers</span>
              </div>

              <div className="flex items-center justify-between p-2.5 rounded-lg bg-slate-950/80 border border-slate-800">
                <div className="flex items-center gap-2">
                  {progressPercent >= 60 ? (
                    <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                  ) : (
                    <div className="w-4 h-4 rounded-full border-2 border-slate-600 animate-pulse" />
                  )}
                  <span className={progressPercent >= 60 ? 'text-slate-200 font-medium' : 'text-slate-500'}>
                    Generating digital fingerprint
                  </span>
                </div>
                <span className="font-mono text-[10px] text-slate-500">SHA-256 Digest</span>
              </div>

              <div className="flex items-center justify-between p-2.5 rounded-lg bg-slate-950/80 border border-slate-800">
                <div className="flex items-center gap-2">
                  {progressPercent >= 90 ? (
                    <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                  ) : (
                    <div className="w-4 h-4 rounded-full border-2 border-slate-600 animate-pulse" />
                  )}
                  <span className={progressPercent >= 90 ? 'text-slate-200 font-medium' : 'text-slate-500'}>
                    Registering evidence record
                  </span>
                </div>
                <span className="font-mono text-[10px] text-slate-500">Immutable Ledger</span>
              </div>

            </div>

            {/* Progress Bar */}
            <div className="space-y-1.5">
              <div className="w-full bg-slate-800 rounded-full h-2 overflow-hidden">
                <div 
                  className="bg-gradient-to-r from-indigo-500 to-blue-500 h-full rounded-full transition-all duration-300"
                  style={{ width: `${progressPercent}%` }}
                />
              </div>
              <div className="flex justify-between text-[11px] font-mono text-slate-400">
                <span>Cryptographic Digesting</span>
                <span>{progressPercent}%</span>
              </div>
            </div>

          </div>
        </div>
      )}

    </div>
  );
};

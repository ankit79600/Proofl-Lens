import React from 'react';
import { 
  ShieldCheck, 
  UploadCloud, 
  Search, 
  ArrowRight, 
  Lock, 
  CheckCircle2, 
  AlertTriangle,
  Scale,
  Camera,
  Cpu
} from 'lucide-react';
import { ActiveTab } from '../../types/evidence';

interface LandingPageProps {
  onNavigate: (tab: ActiveTab) => void;
  onSelectSampleProof?: (proofId: string) => void;
}

export const LandingPage: React.FC<LandingPageProps> = ({ 
  onNavigate,
  onSelectSampleProof
}) => {
  return (
    <div className="flex flex-col gap-20 pb-16">
      
      {/* HERO SECTION */}
      <section className="relative pt-12 lg:pt-20 overflow-hidden">
        {/* Subtle background glow */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[700px] h-[350px] bg-indigo-600/15 blur-[120px] rounded-full pointer-events-none" />
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center">
          
          {/* Trust Pill */}
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-slate-900/90 border border-indigo-500/30 text-indigo-300 text-xs font-medium mb-6 shadow-sm">
            <ShieldCheck className="w-4 h-4 text-indigo-400" />
            <span>Tamper-Evident Cryptographic Chain of Custody</span>
          </div>

          {/* Main Title */}
          <h1 className="text-4xl sm:text-6xl lg:text-7xl font-extrabold tracking-tight text-white max-w-4xl mx-auto leading-[1.1]">
            Digital Evidence You Can <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 via-blue-400 to-teal-300">Mathematically Prove</span>.
          </h1>

          {/* Subtitle */}
          <p className="mt-6 text-lg sm:text-xl text-slate-300 max-w-2xl mx-auto leading-relaxed">
            ProofLens generates an immutable cryptographic fingerprint for any digital image. 
            Guarantee non-repudiation and verify whether evidence remains pristine or has been tampered with down to a single pixel.
          </p>

          {/* Primary CTA Buttons */}
          <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-4">
            <button
              onClick={() => onNavigate('register')}
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2.5 px-6 py-3.5 rounded-xl text-sm font-semibold bg-indigo-600 hover:bg-indigo-500 text-white shadow-lg shadow-indigo-600/30 transition-all hover:scale-[1.02] active:scale-[0.98]"
            >
              <UploadCloud className="w-5 h-5" />
              <span>Register Evidence</span>
              <ArrowRight className="w-4 h-4" />
            </button>

            <button
              onClick={() => onNavigate('verify')}
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2.5 px-6 py-3.5 rounded-xl text-sm font-semibold bg-slate-900 hover:bg-slate-800 text-slate-200 border border-slate-700 hover:border-slate-600 shadow-sm transition-all"
            >
              <Search className="w-5 h-5 text-indigo-400" />
              <span>Verify Evidence</span>
            </button>
          </div>

          {/* Quick interactive sample badge */}
          <div className="mt-6 flex items-center justify-center gap-2 text-xs text-slate-400">
            <span>Want to test an existing record?</span>
            <button
              onClick={() => {
                if (onSelectSampleProof) {
                  onSelectSampleProof('PXL-A7K2M9');
                } else {
                  onNavigate('verify');
                }
              }}
              className="font-mono text-indigo-400 hover:text-indigo-300 underline underline-offset-4 font-semibold"
            >
              Verify PXL-A7K2M9
            </button>
          </div>

          {/* Visual Trust Card Preview */}
          <div className="mt-14 max-w-4xl mx-auto">
            <div className="rounded-2xl border border-slate-800 bg-slate-900/60 p-2 shadow-2xl backdrop-blur-sm">
              <div className="rounded-xl border border-slate-800/80 bg-slate-950 p-6 text-left">
                
                {/* Header preview row */}
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between pb-5 border-b border-slate-800/80 gap-3">
                  <div className="flex items-center gap-3">
                    <div className="w-3 h-3 rounded-full bg-emerald-500 animate-pulse" />
                    <div>
                      <div className="text-xs font-mono text-slate-400">LEDGER RECORD #PXL-A7K2M9</div>
                      <div className="text-sm font-semibold text-white">surveillance_feed_cam04.png</div>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="px-2.5 py-1 rounded-full text-xs font-semibold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 flex items-center gap-1.5">
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      Original Unaltered
                    </span>
                    <span className="font-mono text-xs text-slate-500">2026-10-05 UTC</span>
                  </div>
                </div>

                {/* Body Hash comparison preview */}
                <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-4 text-xs font-mono">
                  <div className="p-3 rounded-lg bg-slate-900/90 border border-slate-800">
                    <div className="text-slate-400 text-[11px] font-sans mb-1 font-medium">Registered Cryptographic Hash (SHA-256)</div>
                    <div className="text-indigo-300 truncate font-mono">
                      a83f9d1c2e5b740d164f89025e1a3bc8917e4d2938fbb2a514d3e870196a4c21
                    </div>
                  </div>

                  <div className="p-3 rounded-lg bg-emerald-950/20 border border-emerald-900/40">
                    <div className="text-emerald-400 text-[11px] font-sans mb-1 font-medium">Verification State (Zero-Diff)</div>
                    <div className="text-emerald-300 flex items-center justify-between">
                      <span className="font-sans font-semibold">100% Byte-for-Byte Match</span>
                      <span className="text-[10px] bg-emerald-500/20 px-1.5 py-0.5 rounded text-emerald-300">0 Bits Diverged</span>
                    </div>
                  </div>
                </div>

              </div>
            </div>
          </div>

        </div>
      </section>

      {/* SECTION 2: WHY DIGITAL EVIDENCE NEEDS VERIFICATION */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-14">
          <h2 className="text-xs font-bold tracking-widest text-indigo-400 uppercase font-mono mb-3">
            The Digital Trust Crisis
          </h2>
          <h3 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
            Why Images Alone Can No Longer Be Trusted
          </h3>
          <p className="mt-3 text-slate-400 text-sm sm:text-base leading-relaxed">
            In an era of generative AI, automated editing, and metadata scrubbing, raw media files cannot prove their own authenticity without independent cryptographic anchoring.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          
          {/* Card 1 */}
          <div className="rounded-2xl border border-slate-800 bg-slate-900/40 p-6 flex flex-col justify-between hover:border-slate-700 transition-all">
            <div>
              <div className="w-12 h-12 rounded-xl bg-rose-500/10 border border-rose-500/20 flex items-center justify-center text-rose-400 mb-5">
                <AlertTriangle className="w-6 h-6" />
              </div>
              <h4 className="text-lg font-bold text-white mb-2">
                Invisible AI & Pixel Manipulation
              </h4>
              <p className="text-slate-400 text-sm leading-relaxed">
                Generative inpainting and synthetic filters can alter weapon possession, vehicle plates, or facial identities with zero visible compression artifacts.
              </p>
            </div>
            <div className="mt-6 pt-4 border-t border-slate-800/80 text-xs text-rose-300/80 flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-rose-400" />
              <span>Pixel alterations undetected by eye</span>
            </div>
          </div>

          {/* Card 2 */}
          <div className="rounded-2xl border border-slate-800 bg-slate-900/40 p-6 flex flex-col justify-between hover:border-slate-700 transition-all">
            <div>
              <div className="w-12 h-12 rounded-xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-400 mb-5">
                <Camera className="w-6 h-6" />
              </div>
              <h4 className="text-lg font-bold text-white mb-2">
                Unreliable EXIF Metadata
              </h4>
              <p className="text-slate-400 text-sm leading-relaxed">
                Standard image headers (timestamps, GPS, device serials) are plain text. Anyone can modify timestamps with standard tools, rendering raw EXIF legally fragile.
              </p>
            </div>
            <div className="mt-6 pt-4 border-t border-slate-800/80 text-xs text-amber-300/80 flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-amber-400" />
              <span>Timestamps can be spoofed in seconds</span>
            </div>
          </div>

          {/* Card 3 */}
          <div className="rounded-2xl border border-slate-800 bg-slate-900/40 p-6 flex flex-col justify-between hover:border-slate-700 transition-all">
            <div>
              <div className="w-12 h-12 rounded-xl bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center text-indigo-400 mb-5">
                <Scale className="w-6 h-6" />
              </div>
              <h4 className="text-lg font-bold text-white mb-2">
                Chain of Custody Disputes
              </h4>
              <p className="text-slate-400 text-sm leading-relaxed">
                In courtrooms, insurance claims, and corporate audits, digital assets face strict scrutiny. ProofLens offers undeniable mathematical non-repudiation.
              </p>
            </div>
            <div className="mt-6 pt-4 border-t border-slate-800/80 text-xs text-indigo-300/80 flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-indigo-400" />
              <span>Admissible forensic verification</span>
            </div>
          </div>

        </div>
      </section>

      {/* SECTION 3: HOW PROOFLENS WORKS (3 SIMPLE STEPS) */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-14">
          <h2 className="text-xs font-bold tracking-widest text-indigo-400 uppercase font-mono mb-3">
            Workflow Architecture
          </h2>
          <h3 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
            How ProofLens Works
          </h3>
          <p className="mt-3 text-slate-400 text-sm sm:text-base">
            A frictionless three-stage protocol designed for certainty and speed.
          </p>
        </div>

        {/* 3 Step Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 relative">
          
          {/* Step 1 */}
          <div className="relative rounded-2xl border border-slate-800 bg-gradient-to-b from-slate-900/70 to-slate-950 p-7 flex flex-col">
            <div className="flex items-center justify-between mb-6">
              <span className="w-10 h-10 rounded-xl bg-indigo-600/20 border border-indigo-500/30 text-indigo-400 font-mono font-bold flex items-center justify-center text-sm">
                01
              </span>
              <span className="text-[11px] font-mono text-slate-500 uppercase tracking-wider">Step 1</span>
            </div>

            <h4 className="text-xl font-bold text-white mb-2 flex items-center gap-2">
              <UploadCloud className="w-5 h-5 text-indigo-400" />
              Upload Evidence
            </h4>
            <p className="text-slate-400 text-sm leading-relaxed mb-6">
              Drag and drop any original image. ProofLens immediately calculates its cryptographic SHA-256 fingerprint in the browser, keeping your sensitive image private.
            </p>

            <div className="mt-auto p-3 rounded-xl bg-slate-950 border border-slate-800/80 text-xs font-mono text-slate-400 flex items-center justify-between">
              <span>Input: Raw File</span>
              <span className="text-indigo-400">→ Client Digest</span>
            </div>
          </div>

          {/* Step 2 */}
          <div className="relative rounded-2xl border border-indigo-500/30 bg-gradient-to-b from-slate-900/90 to-slate-950 p-7 flex flex-col shadow-lg shadow-indigo-500/5">
            <div className="flex items-center justify-between mb-6">
              <span className="w-10 h-10 rounded-xl bg-indigo-600 text-white font-mono font-bold flex items-center justify-center text-sm shadow-md">
                02
              </span>
              <span className="text-[11px] font-mono text-indigo-400 uppercase tracking-wider font-semibold">Core Step</span>
            </div>

            <h4 className="text-xl font-bold text-white mb-2 flex items-center gap-2">
              <Lock className="w-5 h-5 text-indigo-400" />
              Register & Anchor
            </h4>
            <p className="text-slate-400 text-sm leading-relaxed mb-6">
              The cryptographic fingerprint is anchored with an immutable timestamp and assigned a globally unique Proof ID (e.g. <span className="text-white font-mono font-semibold">PXL-A7K2M9</span>) and verification certificate.
            </p>

            <div className="mt-auto p-3 rounded-xl bg-slate-950 border border-slate-800/80 text-xs font-mono text-slate-400 flex items-center justify-between">
              <span>Output: Proof ID</span>
              <span className="text-emerald-400">→ Certificate</span>
            </div>
          </div>

          {/* Step 3 */}
          <div className="relative rounded-2xl border border-slate-800 bg-gradient-to-b from-slate-900/70 to-slate-950 p-7 flex flex-col">
            <div className="flex items-center justify-between mb-6">
              <span className="w-10 h-10 rounded-xl bg-indigo-600/20 border border-indigo-500/30 text-indigo-400 font-mono font-bold flex items-center justify-center text-sm">
                03
              </span>
              <span className="text-[11px] font-mono text-slate-500 uppercase tracking-wider">Step 3</span>
            </div>

            <h4 className="text-xl font-bold text-white mb-2 flex items-center gap-2">
              <Search className="w-5 h-5 text-indigo-400" />
              Verify Anytime
            </h4>
            <p className="text-slate-400 text-sm leading-relaxed mb-6">
              Later, any auditor or counter-party uploads a suspect image and enters the Proof ID. ProofLens compares digests and instantly confirms whether it is verified or modified.
            </p>

            <div className="mt-auto p-3 rounded-xl bg-slate-950 border border-slate-800/80 text-xs font-mono text-slate-400 flex items-center justify-between">
              <span>Verification</span>
              <span className="text-emerald-400">✓ or ✕ Tamper Alert</span>
            </div>
          </div>

        </div>
      </section>

      {/* SECTION 4: SECURITY GUARANTEES */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="rounded-3xl border border-slate-800 bg-gradient-to-r from-slate-900 via-indigo-950/30 to-slate-900 p-8 sm:p-12">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
            <div>
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-300 text-xs font-semibold mb-4">
                <Cpu className="w-3.5 h-3.5" />
                Mathematical Guarantee
              </div>
              <h3 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight leading-snug">
                The Avalanche Effect: Even One Bit Shift Triggers Instant Detection
              </h3>
              <p className="mt-4 text-slate-300 text-sm leading-relaxed">
                Under cryptographic hash standard NIST FIPS 180-4, altering even a single pixel in an image produces a completely divergent 256-bit hash. 
                There is zero possibility of silent modification going unnoticed.
              </p>
              
              <div className="mt-6 flex flex-wrap gap-4 text-xs font-mono">
                <div className="flex items-center gap-2 text-slate-300">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                  <span>Collision-Resistant</span>
                </div>
                <div className="flex items-center gap-2 text-slate-300">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                  <span>Zero-Knowledge Privacy</span>
                </div>
                <div className="flex items-center gap-2 text-slate-300">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                  <span>Portable Certificates</span>
                </div>
              </div>
            </div>

            {/* Quick Interactive Callout */}
            <div className="p-6 rounded-2xl bg-slate-950/80 border border-slate-800 space-y-4">
              <div className="text-xs font-semibold text-slate-300 uppercase tracking-wider font-mono">
                Ready to try ProofLens?
              </div>
              <p className="text-xs text-slate-400 leading-relaxed">
                Test the end-to-end evidence workflow right now. Upload your own image or inspect existing verified sample records in the dashboard.
              </p>
              <div className="flex flex-col sm:flex-row gap-3 pt-2">
                <button
                  onClick={() => onNavigate('register')}
                  className="flex-1 py-2.5 px-4 rounded-xl text-xs font-semibold bg-indigo-600 hover:bg-indigo-500 text-white text-center transition-all"
                >
                  Register New Evidence
                </button>
                <button
                  onClick={() => onNavigate('dashboard')}
                  className="flex-1 py-2.5 px-4 rounded-xl text-xs font-semibold bg-slate-900 hover:bg-slate-800 text-slate-200 border border-slate-700 text-center transition-all"
                >
                  View Evidence Ledger
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

    </div>
  );
};

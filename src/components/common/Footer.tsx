import React from 'react';
import { ShieldCheck, Lock, Cpu, FileCheck } from 'lucide-react';

export const Footer: React.FC = () => {
  return (
    <footer className="border-t border-slate-800/80 bg-slate-950 mt-auto py-10 text-xs text-slate-400">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 pb-8 border-b border-slate-900">
          
          {/* Col 1: Platform Info */}
          <div className="md:col-span-2 space-y-3">
            <div className="flex items-center gap-2 text-white font-bold text-sm">
              <ShieldCheck className="w-4 h-4 text-indigo-400" />
              <span>ProofLens Digital Evidence Custody</span>
            </div>
            <p className="text-slate-400 text-xs max-w-md leading-relaxed">
              ProofLens provides tamper-evident cryptographic fingerprinting and verification for digital media. 
              Built to establish incontestable chain-of-custody for journalism, legal discovery, insurance forensics, 
              and enterprise compliance.
            </p>
            <div className="flex flex-wrap gap-2 pt-2">
              <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded bg-slate-900 border border-slate-800 text-[11px] text-slate-300 font-mono">
                <Lock className="w-3 h-3 text-emerald-400" />
                SHA-256 FIPS 180-4
              </span>
              <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded bg-slate-900 border border-slate-800 text-[11px] text-slate-300 font-mono">
                <FileCheck className="w-3 h-3 text-indigo-400" />
                Immutable Digests
              </span>
              <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded bg-slate-900 border border-slate-800 text-[11px] text-slate-300 font-mono">
                <Cpu className="w-3 h-3 text-blue-400" />
                Client-Side Hashing
              </span>
            </div>
          </div>

          {/* Col 2: System Architecture */}
          <div>
            <h4 className="text-slate-200 font-semibold mb-3">Service Layer</h4>
            <ul className="space-y-2 text-slate-400">
              <li className="flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                <span>Isolated Frontend Service</span>
              </li>
              <li className="flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-blue-400" />
                <span>Mock Service Layer active</span>
              </li>
              <li className="flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-indigo-400" />
                <span>Ready for Backend Integration</span>
              </li>
            </ul>
          </div>

          {/* Col 3: Specifications */}
          <div>
            <h4 className="text-slate-200 font-semibold mb-3">API Target Contract</h4>
            <div className="space-y-1.5 font-mono text-[11px] text-slate-400">
              <div className="p-1.5 rounded bg-slate-900 border border-slate-800/80">
                <span className="text-emerald-400 font-bold">POST</span> /api/evidence
              </div>
              <div className="p-1.5 rounded bg-slate-900 border border-slate-800/80">
                <span className="text-blue-400 font-bold">POST</span> /api/verify
              </div>
              <div className="p-1.5 rounded bg-slate-900 border border-slate-800/80">
                <span className="text-indigo-400 font-bold">GET</span> /api/evidence/:id
              </div>
            </div>
          </div>

        </div>

        {/* Bottom copyright & disclaimer */}
        <div className="pt-6 flex flex-col sm:flex-row items-center justify-between gap-4 text-[11px] text-slate-500">
          <p>© {new Date().getFullYear()} ProofLens Technologies. All evidence records cryptographically verifiable.</p>
          <div className="flex items-center gap-4">
            <span className="flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-emerald-400" />
              <span>Evidence Ledger Online</span>
            </span>
            <span>•</span>
            <span>Zero-Knowledge Fingerprinting</span>
          </div>
        </div>
      </div>
    </footer>
  );
};

import React, { useState, useEffect } from 'react';
import { 
  ShieldCheck, 
  ShieldAlert, 
  Database, 
  Search, 
  PlusCircle, 
  CheckCircle, 
  Copy, 
  Check, 
  FileText, 
  RotateCcw,
  Percent
} from 'lucide-react';
import { EvidenceRecord, DashboardStats, ActiveTab, RegisterEvidenceResponse } from '../../types/evidence';
import { getDashboardStats, getRecentEvidence, resetDemoData } from '../../services/evidence';
import { formatBytes, formatSecurityTimestamp } from '../../utils/crypto';
import { Badge } from '../common/Badge';

interface DashboardPageProps {
  onNavigate: (tab: ActiveTab) => void;
  onVerifyProof: (proofId: string) => void;
  onViewCertificate: (evidence: RegisterEvidenceResponse) => void;
}

export const DashboardPage: React.FC<DashboardPageProps> = ({
  onNavigate,
  onVerifyProof,
  onViewCertificate
}) => {
  const [stats, setStats] = useState<DashboardStats>({
    totalRegistered: 0,
    totalVerified: 0,
    verificationFailures: 0,
    integrityRate: 100,
  });

  const [records, setRecords] = useState<EvidenceRecord[]>([]);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const loadData = async () => {
    const [fetchedStats, fetchedRecords] = await Promise.all([
      getDashboardStats(),
      getRecentEvidence()
    ]);
    setStats(fetchedStats);
    setRecords(fetchedRecords);
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleCopyId = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    navigator.clipboard.writeText(id);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const handleResetData = () => {
    if (confirm('Reset demo evidence records back to initial mock state?')) {
      resetDemoData();
      loadData();
    }
  };

  // Filter records
  const filteredRecords = records.filter((r) => {
    const q = searchQuery.toLowerCase();
    return (
      r.proofId.toLowerCase().includes(q) ||
      r.fileName.toLowerCase().includes(q) ||
      r.fileHash.toLowerCase().includes(q)
    );
  });

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 space-y-10">
      
      {/* Top Header & Quick Actions */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-indigo-400 text-xs font-mono font-semibold uppercase tracking-wider mb-2">
            <Database className="w-4 h-4" />
            <span>Digital Evidence Registry</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
            Evidence Dashboard
          </h1>
          <p className="mt-1 text-slate-400 text-sm">
            Monitor registered evidence custody, verification integrity, and tamper alerts.
          </p>
        </div>

        {/* Quick Action Buttons */}
        <div className="flex flex-wrap items-center gap-3">
          <button
            onClick={() => onNavigate('register')}
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-semibold bg-indigo-600 hover:bg-indigo-500 text-white shadow-md shadow-indigo-600/20 transition-all hover:scale-[1.02]"
          >
            <PlusCircle className="w-4 h-4" />
            <span>Register Evidence</span>
          </button>

          <button
            onClick={() => onNavigate('verify')}
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-semibold bg-slate-900 hover:bg-slate-800 text-slate-200 border border-slate-700 transition-all"
          >
            <CheckCircle className="w-4 h-4 text-indigo-400" />
            <span>Verify Evidence</span>
          </button>
        </div>
      </div>

      {/* METRIC CARDS */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        
        {/* Card 1: Total Registered */}
        <div className="rounded-2xl border border-slate-800 bg-slate-900/60 p-6 flex flex-col justify-between">
          <div className="flex items-center justify-between text-slate-400 mb-4">
            <span className="text-xs font-semibold uppercase tracking-wider font-mono">Total Evidence</span>
            <div className="w-9 h-9 rounded-xl bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center text-indigo-400">
              <Database className="w-5 h-5" />
            </div>
          </div>
          <div>
            <div className="text-3xl font-extrabold text-white font-mono">
              {stats.totalRegistered}
            </div>
            <div className="text-xs text-slate-400 mt-1 flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
              <span>Immutable cryptographic records</span>
            </div>
          </div>
        </div>

        {/* Card 2: Total Verified */}
        <div className="rounded-2xl border border-slate-800 bg-slate-900/60 p-6 flex flex-col justify-between">
          <div className="flex items-center justify-between text-slate-400 mb-4">
            <span className="text-xs font-semibold uppercase tracking-wider font-mono">Total Verified</span>
            <div className="w-9 h-9 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400">
              <ShieldCheck className="w-5 h-5" />
            </div>
          </div>
          <div>
            <div className="text-3xl font-extrabold text-white font-mono">
              {stats.totalVerified}
            </div>
            <div className="text-xs text-slate-400 mt-1 flex items-center gap-1.5">
              <span className="text-emerald-400 font-semibold">{stats.totalVerified - stats.verificationFailures} matched</span>
              <span>across audit checks</span>
            </div>
          </div>
        </div>

        {/* Card 3: Verification Failures */}
        <div className="rounded-2xl border border-slate-800 bg-slate-900/60 p-6 flex flex-col justify-between">
          <div className="flex items-center justify-between text-slate-400 mb-4">
            <span className="text-xs font-semibold uppercase tracking-wider font-mono">Verification Failures</span>
            <div className="w-9 h-9 rounded-xl bg-rose-500/10 border border-rose-500/20 flex items-center justify-center text-rose-400">
              <ShieldAlert className="w-5 h-5" />
            </div>
          </div>
          <div>
            <div className="text-3xl font-extrabold text-white font-mono">
              {stats.verificationFailures}
            </div>
            <div className="text-xs text-rose-400/90 mt-1 flex items-center gap-1.5">
              <span>Tamper attempts / altered files detected</span>
            </div>
          </div>
        </div>

        {/* Card 4: Integrity Rate */}
        <div className="rounded-2xl border border-slate-800 bg-slate-900/60 p-6 flex flex-col justify-between">
          <div className="flex items-center justify-between text-slate-400 mb-4">
            <span className="text-xs font-semibold uppercase tracking-wider font-mono">Integrity Rate</span>
            <div className="w-9 h-9 rounded-xl bg-blue-500/10 border border-blue-500/20 flex items-center justify-center text-blue-400">
              <Percent className="w-5 h-5" />
            </div>
          </div>
          <div>
            <div className="text-3xl font-extrabold text-white font-mono">
              {stats.integrityRate}%
            </div>
            <div className="text-xs text-slate-400 mt-1 flex items-center gap-1.5">
              <span>Authentic match ratio</span>
            </div>
          </div>
        </div>

      </div>

      {/* RECENT EVIDENCE LEDGER TABLE */}
      <div className="rounded-2xl border border-slate-800 bg-slate-900/60 overflow-hidden backdrop-blur-sm">
        
        {/* Table Top Toolbar */}
        <div className="p-5 border-b border-slate-800 flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4">
          <div>
            <h2 className="text-lg font-bold text-white flex items-center gap-2">
              <FileText className="w-5 h-5 text-indigo-400" />
              <span>Recent Evidence Records</span>
            </h2>
            <p className="text-xs text-slate-400 mt-0.5">
              Full chain-of-custody registry with cryptographic Proof IDs
            </p>
          </div>

          <div className="flex items-center gap-3">
            {/* Search Input */}
            <div className="relative flex-1 sm:w-64">
              <Search className="w-4 h-4 text-slate-500 absolute left-3 top-2.5" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search ID, file name, hash..."
                className="w-full pl-9 pr-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500 transition-colors"
              />
            </div>

            <button
              onClick={handleResetData}
              title="Reset Demo Records"
              className="p-2 rounded-xl bg-slate-950 text-slate-400 hover:text-white border border-slate-800 transition-colors"
            >
              <RotateCcw className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Table Content */}
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-950/80 text-slate-400 font-mono text-[11px] uppercase tracking-wider border-b border-slate-800">
              <tr>
                <th className="px-5 py-3.5">Proof ID</th>
                <th className="px-5 py-3.5">Evidence File</th>
                <th className="px-5 py-3.5">Size</th>
                <th className="px-5 py-3.5">Registration Timestamp</th>
                <th className="px-5 py-3.5">Status</th>
                <th className="px-5 py-3.5 text-right">Actions</th>
              </tr>
            </thead>

            <tbody className="divide-y divide-slate-800/60 font-sans">
              {filteredRecords.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-5 py-12 text-center text-slate-500">
                    No evidence records matching your search query.
                  </td>
                </tr>
              ) : (
                filteredRecords.map((record) => (
                  <tr 
                    key={record.proofId} 
                    className="hover:bg-slate-800/40 transition-colors group cursor-pointer"
                    onClick={() => {
                      onViewCertificate({
                        proofId: record.proofId,
                        status: 'registered',
                        fileHash: record.fileHash,
                        timestamp: record.registeredAt,
                        evidence: record
                      });
                    }}
                  >
                    
                    {/* Proof ID Column */}
                    <td className="px-5 py-4 font-mono font-bold text-white whitespace-nowrap">
                      <div className="flex items-center gap-2">
                        <span className="text-indigo-400 hover:underline">{record.proofId}</span>
                        <button
                          type="button"
                          onClick={(e) => handleCopyId(record.proofId, e)}
                          className="text-slate-500 hover:text-slate-300 opacity-0 group-hover:opacity-100 transition-opacity"
                          title="Copy Proof ID"
                        >
                          {copiedId === record.proofId ? (
                            <Check className="w-3.5 h-3.5 text-emerald-400" />
                          ) : (
                            <Copy className="w-3.5 h-3.5" />
                          )}
                        </button>
                      </div>
                    </td>

                    {/* Evidence File Name & Hash snippet */}
                    <td className="px-5 py-4">
                      <div className="font-semibold text-slate-200 max-w-[220px] truncate" title={record.fileName}>
                        {record.fileName}
                      </div>
                      <div className="font-mono text-[10px] text-slate-500 truncate max-w-[220px]" title={record.fileHash}>
                        {record.fileHash}
                      </div>
                    </td>

                    {/* Size */}
                    <td className="px-5 py-4 font-mono text-slate-400 whitespace-nowrap">
                      {formatBytes(record.fileSize)}
                    </td>

                    {/* Timestamp */}
                    <td className="px-5 py-4 font-mono text-slate-400 whitespace-nowrap">
                      {formatSecurityTimestamp(record.registeredAt)}
                    </td>

                    {/* Status Badge */}
                    <td className="px-5 py-4 whitespace-nowrap">
                      <Badge status={record.status} size="sm" />
                    </td>

                    {/* Actions */}
                    <td className="px-5 py-4 text-right whitespace-nowrap">
                      <div className="flex items-center justify-end gap-2" onClick={(e) => e.stopPropagation()}>
                        <button
                          type="button"
                          onClick={() => onVerifyProof(record.proofId)}
                          className="px-2.5 py-1 rounded-lg bg-indigo-600/20 hover:bg-indigo-600/30 text-indigo-300 border border-indigo-500/30 font-medium transition-all"
                        >
                          Verify
                        </button>

                        <button
                          type="button"
                          onClick={() => {
                            onViewCertificate({
                              proofId: record.proofId,
                              status: 'registered',
                              fileHash: record.fileHash,
                              timestamp: record.registeredAt,
                              evidence: record
                            });
                          }}
                          className="px-2.5 py-1 rounded-lg bg-slate-900 hover:bg-slate-800 text-slate-300 border border-slate-700 font-medium transition-all"
                        >
                          Certificate
                        </button>
                      </div>
                    </td>

                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

      </div>

    </div>
  );
};

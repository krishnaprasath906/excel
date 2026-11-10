'use client';

import React from 'react';
import Link from 'next/link';
import {
  Trash2,
  Download,
  FileSpreadsheet,
  CheckCircle2,
  ShieldCheck,
  ExternalLink,
} from 'lucide-react';
import { downloadSampleExcel } from '@/excel/sampleDataGenerator';

interface HeaderProps {
  fileName?: string;
  totalRecords?: number;
  selectedPersonReg?: string;
  onClearData: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  fileName,
  totalRecords = 0,
  selectedPersonReg,
  onClearData,
}) => {
  return (
    <header className="h-16 border-b border-slate-800 bg-slate-900/80 backdrop-blur-md px-6 flex items-center justify-between sticky top-0 z-20">
      {/* Status Badges */}
      <div className="flex items-center gap-3">
        {fileName ? (
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-slate-800 border border-slate-700 text-xs">
            <FileSpreadsheet className="w-3.5 h-3.5 text-emerald-400" />
            <span className="text-slate-300 font-medium truncate max-w-[180px]">{fileName}</span>
            <span className="text-[10px] px-1.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 font-semibold">
              {totalRecords} rows
            </span>
          </div>
        ) : (
          <div className="flex items-center gap-2 text-xs text-slate-400">
            <span className="w-2 h-2 rounded-full bg-amber-400 animate-pulse"></span>
            No Excel file loaded
          </div>
        )}

        {selectedPersonReg && (
          <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-indigo-950/60 border border-indigo-700/60 text-xs text-indigo-200">
            <CheckCircle2 className="w-3.5 h-3.5 text-indigo-400" />
            <span>Reg:</span>
            <span className="font-mono font-bold text-white">{selectedPersonReg}</span>
          </div>
        )}
      </div>

      {/* Action Buttons */}
      <div className="flex items-center gap-3">
        <button
          onClick={() => downloadSampleExcel()}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 border border-slate-700 text-xs font-medium text-slate-200 transition-colors shadow-sm"
          title="Download ready-to-test sample Excel file with 17 realistic fields"
        >
          <Download className="w-3.5 h-3.5 text-indigo-400" />
          <span>Sample Excel</span>
        </button>

        <Link
          href="/demo-form"
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-emerald-600/20 hover:bg-emerald-600/30 border border-emerald-500/40 text-xs font-medium text-emerald-300 transition-colors"
        >
          <ExternalLink className="w-3.5 h-3.5 text-emerald-400" />
          <span>Open Demo Form</span>
        </Link>

        <button
          onClick={onClearData}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-rose-950/40 hover:bg-rose-900/60 border border-rose-800/40 text-xs font-medium text-rose-300 transition-colors"
          title="Clear uploaded spreadsheet data and session records from browser memory"
        >
          <Trash2 className="w-3.5 h-3.5 text-rose-400" />
          <span>Clear All Data</span>
        </button>
      </div>
    </header>
  );
};

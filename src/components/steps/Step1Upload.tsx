'use client';

import React, { useState, useRef } from 'react';
import {
  UploadCloud,
  FileSpreadsheet,
  CheckCircle2,
  AlertCircle,
  FileCheck,
  Columns,
  Hash,
  Download,
  Sparkles,
  ArrowRight,
} from 'lucide-react';
import { ExcelParseResult } from '@/types';
import { parseExcelFile } from '@/excel/excelParser';
import { downloadSampleExcel, SAMPLE_DATASET } from '@/excel/sampleDataGenerator';

interface Step1UploadProps {
  excelData: ExcelParseResult | null;
  onExcelParsed: (result: ExcelParseResult) => void;
  onNextStep: () => void;
}

export const Step1Upload: React.FC<Step1UploadProps> = ({
  excelData,
  onExcelParsed,
  onNextStep,
}) => {
  const [isDragging, setIsDragging] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFile = async (file: File) => {
    setError(null);
    if (!file.name.match(/\.(xlsx|xls)$/i)) {
      setError('Please upload a valid Excel file (.xlsx or .xls).');
      return;
    }

    setIsLoading(true);
    try {
      const result = await parseExcelFile(file);
      onExcelParsed(result);
    } catch (err: any) {
      setError(err?.message || 'Failed to parse Excel file.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      handleFile(e.dataTransfer.files[0]);
    }
  };

  const loadDemoDataDirectly = () => {
    setError(null);
    const columns = Object.keys(SAMPLE_DATASET[0]);
    const mockResult: ExcelParseResult = {
      fileName: 'Sample_17_Fields_Records.xlsx',
      fileSize: 14850,
      totalRows: SAMPLE_DATASET.length,
      columns,
      regNumberColumn: 'Registration Number',
      data: SAMPLE_DATASET,
      timestamp: Date.now(),
    };
    onExcelParsed(mockResult);
  };

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Step Header */}
      <div className="flex items-start justify-between">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="w-6 h-6 rounded-full bg-indigo-600 text-white text-xs font-bold flex items-center justify-center">
              1
            </span>
            <h2 className="text-xl font-bold text-white tracking-tight">Upload Excel File</h2>
          </div>
          <p className="text-sm text-slate-400">
            Select or drag your .xlsx or .xls document containing candidate/employee records.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => downloadSampleExcel()}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 border border-slate-700 text-xs font-medium text-slate-300 transition-colors shadow-sm"
          >
            <Download className="w-3.5 h-3.5 text-indigo-400" />
            <span>Download Sample .xlsx</span>
          </button>
          <button
            onClick={loadDemoDataDirectly}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-xs font-semibold text-white transition-colors shadow-md shadow-indigo-600/30"
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>Load Instant 17-Field Demo</span>
          </button>
        </div>
      </div>

      {/* Error Banner */}
      {error && (
        <div className="p-4 rounded-xl bg-rose-950/40 border border-rose-800/60 text-rose-200 flex items-start gap-3">
          <AlertCircle className="w-5 h-5 text-rose-400 shrink-0 mt-0.5" />
          <div className="text-sm">
            <p className="font-semibold text-rose-100">Upload Error</p>
            <p className="text-xs text-rose-300 mt-0.5">{error}</p>
          </div>
        </div>
      )}

      {/* Drag & Drop Upload Zone */}
      <div
        onDragOver={(e) => {
          e.preventDefault();
          setIsDragging(true);
        }}
        onDragLeave={() => setIsDragging(false)}
        onDrop={handleDrop}
        onClick={() => fileInputRef.current?.click()}
        className={`relative border-2 border-dashed rounded-2xl p-8 text-center cursor-pointer transition-all duration-200 ${
          isDragging
            ? 'border-indigo-500 bg-indigo-950/30 scale-[1.01]'
            : 'border-slate-800 hover:border-slate-700 bg-slate-900/40 hover:bg-slate-900/60'
        }`}
      >
        <input
          ref={fileInputRef}
          type="file"
          accept=".xlsx, .xls"
          className="hidden"
          onChange={(e) => {
            if (e.target.files && e.target.files[0]) {
              handleFile(e.target.files[0]);
            }
          }}
        />

        <div className="flex flex-col items-center justify-center space-y-4">
          <div className="w-16 h-16 rounded-2xl bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center text-indigo-400 shadow-inner">
            {isLoading ? (
              <div className="w-8 h-8 border-3 border-indigo-400 border-t-transparent rounded-full animate-spin"></div>
            ) : (
              <UploadCloud className="w-8 h-8" />
            )}
          </div>

          <div>
            <p className="text-base font-semibold text-white">
              {isLoading ? 'Parsing Excel File...' : 'Drop your Excel spreadsheet here'}
            </p>
            <p className="text-xs text-slate-400 mt-1">
              Supports <span className="font-mono text-indigo-400">.xlsx</span> and{' '}
              <span className="font-mono text-indigo-400">.xls</span> (processed 100% locally via SheetJS)
            </p>
          </div>

          <button
            type="button"
            className="px-4 py-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-xs font-semibold text-slate-200 border border-slate-700 transition-colors shadow-sm"
          >
            Browse Computer
          </button>
        </div>
      </div>

      {/* Success Summary View when parsed */}
      {excelData && (
        <div className="p-6 rounded-2xl bg-slate-900/80 border border-slate-800 space-y-5 animate-slide-up">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-emerald-500/20 border border-emerald-500/30 flex items-center justify-center text-emerald-400">
                <FileCheck className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-base font-bold text-white flex items-center gap-2">
                  <span>Excel uploaded successfully</span>
                  <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                </h3>
                <p className="text-xs text-slate-400 font-mono">{excelData.fileName}</p>
              </div>
            </div>

            <button
              onClick={onNextStep}
              className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-sm font-semibold transition-all shadow-lg shadow-indigo-600/30 group"
            >
              <span>Proceed to Find Person</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
            </button>
          </div>

          {/* Stats Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="p-4 rounded-xl bg-slate-950/60 border border-slate-800/80">
              <div className="flex items-center gap-2 text-slate-400 text-xs mb-1">
                <Hash className="w-4 h-4 text-emerald-400" />
                <span>Total Records</span>
              </div>
              <p className="text-2xl font-bold text-white font-mono">{excelData.totalRows}</p>
            </div>

            <div className="p-4 rounded-xl bg-slate-950/60 border border-slate-800/80">
              <div className="flex items-center gap-2 text-slate-400 text-xs mb-1">
                <Columns className="w-4 h-4 text-indigo-400" />
                <span>Detected Columns</span>
              </div>
              <p className="text-2xl font-bold text-white font-mono">{excelData.columns.length}</p>
            </div>

            <div className="p-4 rounded-xl bg-slate-950/60 border border-slate-800/80">
              <div className="flex items-center gap-2 text-slate-400 text-xs mb-1">
                <FileSpreadsheet className="w-4 h-4 text-cyan-400" />
                <span>Primary Search Key</span>
              </div>
              <p className="text-sm font-bold text-indigo-300 font-mono truncate">
                {excelData.regNumberColumn}
              </p>
            </div>
          </div>

          {/* Detected Column Names Pill List */}
          <div>
            <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2.5">
              Detected Column Headers ({excelData.columns.length})
            </p>
            <div className="flex flex-wrap gap-2 max-h-36 overflow-y-auto p-1">
              {excelData.columns.map((col, idx) => {
                const isReg = col === excelData.regNumberColumn;
                return (
                  <span
                    key={idx}
                    className={`text-xs px-2.5 py-1 rounded-lg font-medium ${
                      isReg
                        ? 'bg-indigo-500/20 text-indigo-300 border border-indigo-500/40 font-semibold'
                        : 'bg-slate-800 text-slate-300 border border-slate-700/80'
                    }`}
                  >
                    {isReg && '★ '}
                    {col}
                  </span>
                );
              })}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

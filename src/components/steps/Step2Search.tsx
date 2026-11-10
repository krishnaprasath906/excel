'use client';

import React, { useState, useMemo } from 'react';
import {
  UserSearch,
  Search,
  AlertCircle,
  Sparkles,
  ArrowRight,
  CheckCircle2,
  ChevronLeft,
  ChevronRight,
  Filter,
  X,
  Users,
} from 'lucide-react';
import { ExcelParseResult, PersonRecord } from '@/types';
import { searchPersonByRegistrationNumber } from '@/excel/excelParser';

interface Step2SearchProps {
  excelData: ExcelParseResult | null;
  selectedPerson: PersonRecord | null;
  onPersonFound: (person: PersonRecord) => void;
  onNextStep: () => void;
  onPrevStep: () => void;
}

export const Step2Search: React.FC<Step2SearchProps> = ({
  excelData,
  selectedPerson,
  onPersonFound,
  onNextStep,
  onPrevStep,
}) => {
  const [regInput, setRegInput] = useState(selectedPerson?.regNumber || '');
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [quickFilter, setQuickFilter] = useState('');
  const [quickPage, setQuickPage] = useState(0);

  const PILLS_PER_PAGE = 15;

  const handleSearch = (customQuery?: string) => {
    const query = (customQuery !== undefined ? customQuery : regInput).trim();
    setErrorMessage(null);

    if (!excelData) {
      setErrorMessage('Please upload an Excel spreadsheet first.');
      return;
    }

    if (!query) {
      setErrorMessage('Please enter a Registration Number or Candidate Name.');
      return;
    }

    const found = searchPersonByRegistrationNumber(excelData, query);

    if (found) {
      onPersonFound(found);
      setRegInput(found.regNumber);
    } else {
      setErrorMessage(`Candidate with Registration Number or Name "${query}" not found.`);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleSearch();
    }
  };

  // Extract all candidates from loaded sheet
  const allCandidates = useMemo(() => {
    if (!excelData?.data) return [];
    const regCol = excelData.regNumberColumn;
    const nameCol = excelData.columns.find((c) => {
      const n = c.toLowerCase().trim();
      return n.includes('name') || n === 'candidate' || n === 'student' || n === 'person';
    });
    return excelData.data
      .map((row, idx) => ({
        index: idx + 1,
        reg: String(row[regCol] || '').trim(),
        name: nameCol ? String(row[nameCol] || '').trim() : '',
      }))
      .filter((c) => c.reg.length > 0);
  }, [excelData]);

  // Filtered quick suggestions
  const filteredCandidates = useMemo(() => {
    if (!quickFilter.trim()) return allCandidates;
    const q = quickFilter.toLowerCase().trim();
    return allCandidates.filter(
      (c) => c.reg.toLowerCase().includes(q) || c.name.toLowerCase().includes(q)
    );
  }, [allCandidates, quickFilter]);

  const totalPages = Math.ceil(filteredCandidates.length / PILLS_PER_PAGE) || 1;
  const currentPills = useMemo(() => {
    const start = quickPage * PILLS_PER_PAGE;
    return filteredCandidates.slice(start, start + PILLS_PER_PAGE);
  }, [filteredCandidates, quickPage]);

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Step Header */}
      <div>
        <div className="flex items-center gap-2 mb-1">
          <span className="w-6 h-6 rounded-full bg-indigo-600 text-white text-xs font-bold flex items-center justify-center">
            2
          </span>
          <h2 className="text-xl font-bold text-white tracking-tight">Enter Registration Number</h2>
        </div>
        <p className="text-sm text-slate-400">
          Search the uploaded Excel records by primary identifier or candidate name to retrieve all corresponding details.
        </p>
      </div>

      {/* Error Alert */}
      {errorMessage && (
        <div className="p-4 rounded-xl bg-rose-950/40 border border-rose-800/60 text-rose-200 flex items-start gap-3 animate-shake">
          <AlertCircle className="w-5 h-5 text-rose-400 shrink-0 mt-0.5" />
          <div>
            <p className="font-semibold text-rose-100">Lookup Notice</p>
            <p className="text-xs text-rose-300 mt-0.5">{errorMessage}</p>
          </div>
        </div>
      )}

      {/* Prominent Search Card */}
      <div className="p-8 rounded-2xl bg-slate-900/80 border border-slate-800 space-y-6 shadow-xl">
        <div>
          <label
            htmlFor="registration-search-input"
            className="block text-xs font-semibold uppercase tracking-wider text-slate-300 mb-2"
          >
            Registration Number or Candidate Name <span className="text-indigo-400">*</span>
          </label>

          <div className="flex flex-col sm:flex-row gap-3">
            <div className="relative flex-1">
              <Search className="w-5 h-5 absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                id="registration-search-input"
                type="text"
                value={regInput}
                onChange={(e) => setRegInput(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="Enter Registration Number or Name (e.g. 866458 or M.Aashritha)"
                className="w-full pl-12 pr-4 py-3.5 rounded-xl bg-slate-950 border border-slate-700 text-white text-base placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 font-mono tracking-wide"
              />
            </div>

            <button
              id="find-person-button"
              onClick={() => handleSearch()}
              className="flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-semibold text-sm transition-all shadow-lg shadow-indigo-600/30 shrink-0"
            >
              <UserSearch className="w-4 h-4" />
              <span>Find Person</span>
            </button>
          </div>
        </div>

        {/* Quick Suggestion Pills for ALL 2,000 Records */}
        {allCandidates.length > 0 && (
          <div className="pt-3 border-t border-slate-800/80 space-y-3">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2.5">
              <div className="flex items-center gap-2">
                <p className="text-xs font-semibold text-slate-300 flex items-center gap-1.5">
                  <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                  <span>Quick Picks:</span>
                </p>
                <span className="text-[10px] px-2 py-0.5 rounded-full bg-slate-800 text-slate-400 font-mono border border-slate-700">
                  {filteredCandidates.length === allCandidates.length
                    ? `${allCandidates.length.toLocaleString()} total`
                    : `${filteredCandidates.length} of ${allCandidates.length.toLocaleString()}`}
                </span>
              </div>

              <div className="flex items-center gap-2 flex-wrap">
                {/* Filter */}
                <div className="relative">
                  <Filter className="w-3 h-3 absolute left-2.5 top-1/2 -translate-y-1/2 text-slate-400" />
                  <input
                    type="text"
                    value={quickFilter}
                    onChange={(e) => {
                      setQuickFilter(e.target.value);
                      setQuickPage(0);
                    }}
                    placeholder="Filter names or reg #..."
                    className="pl-7 pr-6 py-1 rounded-lg bg-slate-950 border border-slate-700 text-xs text-slate-200 placeholder:text-slate-500 focus:outline-none focus:ring-1 focus:ring-indigo-500 w-40 font-sans"
                  />
                  {quickFilter && (
                    <button
                      onClick={() => setQuickFilter('')}
                      className="absolute right-2 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  )}
                </div>

                {/* Pagination */}
                {totalPages > 1 && (
                  <div className="flex items-center gap-1 bg-slate-950 px-1.5 py-0.5 rounded-lg border border-slate-800">
                    <button
                      type="button"
                      onClick={() => setQuickPage((p) => Math.max(0, p - 1))}
                      disabled={quickPage === 0}
                      className="p-1 rounded text-slate-400 hover:text-white disabled:opacity-30"
                    >
                      <ChevronLeft className="w-3.5 h-3.5" />
                    </button>
                    <span className="text-[10px] font-mono text-slate-400 px-1">
                      {quickPage + 1}/{totalPages}
                    </span>
                    <button
                      type="button"
                      onClick={() => setQuickPage((p) => Math.min(totalPages - 1, p + 1))}
                      disabled={quickPage >= totalPages - 1}
                      className="p-1 rounded text-slate-400 hover:text-white disabled:opacity-30"
                    >
                      <ChevronRight className="w-3.5 h-3.5" />
                    </button>
                  </div>
                )}
              </div>
            </div>

            <div className="flex flex-wrap gap-2">
              {currentPills.map((item) => {
                const isSelected = selectedPerson?.regNumber === item.reg;
                return (
                  <button
                    key={item.reg}
                    onClick={() => {
                      setRegInput(item.reg);
                      handleSearch(item.reg);
                    }}
                    className={`px-3 py-1.5 rounded-lg text-xs font-mono transition-all flex items-center gap-1.5 border shadow-sm ${
                      isSelected
                        ? 'bg-indigo-600 text-white border-indigo-500 shadow-indigo-600/30'
                        : 'bg-slate-800 hover:bg-slate-700 text-slate-300 border-slate-700 hover:text-white'
                    }`}
                  >
                    <span className="font-bold text-indigo-300">{item.reg}</span>
                    {item.name && <span className="text-slate-400 font-sans">({item.name})</span>}
                  </button>
                );
              })}
            </div>
          </div>
        )}
      </div>

      {/* Selected Person Card Confirmation */}
      {selectedPerson && (
        <div className="p-6 rounded-2xl bg-indigo-950/40 border border-indigo-700/50 flex flex-col sm:flex-row items-center justify-between gap-4 animate-fade-in shadow-xl">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-indigo-500/20 text-indigo-300 flex items-center justify-center font-bold">
              <CheckCircle2 className="w-5 h-5" />
            </div>
            <div>
              <p className="text-xs text-indigo-300 font-semibold uppercase tracking-wider">Candidate Selected</p>
              <h3 className="text-base font-bold text-white">
                {selectedPerson.fullName || 'Candidate Record'}{' '}
                <span className="text-indigo-300 font-mono text-sm">({selectedPerson.regNumber})</span>
              </h3>
            </div>
          </div>

          <button
            onClick={onNextStep}
            className="flex items-center gap-2 px-6 py-3 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-semibold text-sm transition-all shadow-lg shadow-indigo-600/30 group shrink-0"
          >
            <span>Confirm & View Profile</span>
            <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
          </button>
        </div>
      )}
    </div>
  );
};

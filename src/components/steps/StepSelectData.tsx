'use client';

import React, { useState, useRef, useMemo } from 'react';
import {
  UploadCloud,
  FileSpreadsheet,
  CheckCircle2,
  AlertCircle,
  FileCheck,
  Search,
  UserSearch,
  Sparkles,
  ArrowRight,
  User,
  Mail,
  Phone,
  MapPin,
  Briefcase,
  GraduationCap,
  Calendar,
  Building2,
  Heart,
  Activity,
  Download,
  RefreshCw,
  ChevronLeft,
  ChevronRight,
  Filter,
  X,
  Users,
  Grid,
  Check,
  ExternalLink,
} from 'lucide-react';
import { ExcelParseResult, PersonRecord } from '@/types';
import { parseExcelFile, searchPersonByRegistrationNumber } from '@/excel/excelParser';
import {
  downloadSampleExcel,
  SAMPLE_DATASET,
  generate2000SampleDataset,
} from '@/excel/sampleDataGenerator';

interface StepSelectDataProps {
  excelData: ExcelParseResult | null;
  selectedPerson: PersonRecord | null;
  onExcelParsed: (result: ExcelParseResult) => void;
  onPersonFound: (person: PersonRecord) => void;
  onNextStep: () => void;
  onResetFile?: () => void;
  quickPage?: number;
  onQuickPageChange?: (page: number) => void;
  quickFilter?: string;
  onQuickFilterChange?: (filter: string) => void;
  isScrollableMode?: boolean;
  onScrollableModeChange?: (scrollable: boolean) => void;
}

interface CandidateItem {
  index: number;
  reg: string;
  name: string;
  email?: string;
  city?: string;
  degree?: string;
  institute?: string;
  row: Record<string, any>;
}

export const StepSelectData: React.FC<StepSelectDataProps> = ({
  excelData,
  selectedPerson,
  onExcelParsed,
  onPersonFound,
  onNextStep,
  onResetFile,
  quickPage: propQuickPage,
  onQuickPageChange,
  quickFilter: propQuickFilter,
  onQuickFilterChange,
  isScrollableMode: propScrollableMode,
  onScrollableModeChange,
}) => {
  const [isDragging, setIsDragging] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [regInput, setRegInput] = useState(selectedPerson?.regNumber || '');
  const [searchError, setSearchError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Quick picks controls (persists across step navigation)
  const [localQuickPage, setLocalQuickPage] = useState<number>(() => {
    if (typeof window !== 'undefined') {
      const saved = sessionStorage.getItem('excel_autofill_quick_page');
      return saved !== null ? parseInt(saved, 10) || 0 : 0;
    }
    return 0;
  });

  const quickPage = propQuickPage !== undefined ? propQuickPage : localQuickPage;
  const setQuickPage = (updater: number | ((prev: number) => number)) => {
    const nextPage = typeof updater === 'function' ? updater(quickPage) : updater;
    if (typeof window !== 'undefined') {
      sessionStorage.setItem('excel_autofill_quick_page', String(nextPage));
    }
    if (onQuickPageChange) {
      onQuickPageChange(nextPage);
    } else {
      setLocalQuickPage(nextPage);
    }
  };

  const [localQuickFilter, setLocalQuickFilter] = useState('');
  const quickFilter = propQuickFilter !== undefined ? propQuickFilter : localQuickFilter;
  const setQuickFilter = (val: string) => {
    if (onQuickFilterChange) {
      onQuickFilterChange(val);
    } else {
      setLocalQuickFilter(val);
    }
  };

  const [localScrollableMode, setLocalScrollableMode] = useState(false);
  const isScrollableMode =
    propScrollableMode !== undefined ? propScrollableMode : localScrollableMode;
  const setIsScrollableMode = (val: boolean | ((prev: boolean) => boolean)) => {
    const nextVal = typeof val === 'function' ? val(isScrollableMode) : val;
    if (onScrollableModeChange) {
      onScrollableModeChange(nextVal);
    } else {
      setLocalScrollableMode(nextVal);
    }
  };

  const [isSearchFocused, setIsSearchFocused] = useState(false);

  // Modal directory controls
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalSearch, setModalSearch] = useState('');
  const [modalLetter, setModalLetter] = useState('ALL');
  const [modalPage, setModalPage] = useState(0);

  const PILLS_PER_PAGE = 15;
  const MODAL_PAGE_SIZE = 24;

  const handleFile = async (file: File) => {
    setError(null);
    setSearchError(null);
    if (!file.name.match(/\.(xlsx|xls)$/i)) {
      setError('Please upload a valid Excel file (.xlsx or .xls).');
      return;
    }

    setIsLoading(true);
    try {
      const result = await parseExcelFile(file);
      onExcelParsed(result);

      // Auto-select first person if available
      if (result.data.length > 0) {
        const firstReg = String(result.data[0][result.regNumberColumn] || '');
        if (firstReg) {
          const person = searchPersonByRegistrationNumber(result, firstReg);
          if (person) {
            onPersonFound(person);
            setRegInput(person.regNumber);
          }
        }
      }
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
    setSearchError(null);
    // Load full 2,000 dataset for instant high-volume testing
    const dataset = generate2000SampleDataset();
    const columns = Object.keys(dataset[0]);
    const mockResult: ExcelParseResult = {
      fileName: 'Sample_17_Fields_2000_Records.xlsx',
      fileSize: 185000,
      totalRows: dataset.length,
      columns,
      regNumberColumn: 'Registration Number',
      data: dataset,
      timestamp: Date.now(),
    };
    onExcelParsed(mockResult);

    // Auto-select the first candidate (Krishna Prasad or M.Aashritha)
    const person =
      searchPersonByRegistrationNumber(mockResult, '866458') ||
      searchPersonByRegistrationNumber(mockResult, '697294');
    if (person) {
      onPersonFound(person);
      setRegInput(person.regNumber);
    }
  };

  const handleSearch = (customQuery?: string) => {
    const query = (customQuery !== undefined ? customQuery : regInput).trim();
    setSearchError(null);

    if (!excelData) {
      setSearchError('Please upload an Excel spreadsheet first.');
      return;
    }

    if (!query) {
      setSearchError('Please enter a Registration Number or Candidate Name.');
      return;
    }

    const found = searchPersonByRegistrationNumber(excelData, query);
    if (found) {
      onPersonFound(found);
      setRegInput(found.regNumber);
    } else {
      setSearchError(`Candidate with Registration Number or Name "${query}" not found.`);
    }
  };

  const selectCandidate = (regNumber: string) => {
    setRegInput(regNumber);
    handleSearch(regNumber);
    setIsSearchFocused(false);
    setIsModalOpen(false);
  };

  const getFieldIcon = (key: string) => {
    const k = key.toLowerCase();
    if (k.includes('email') || k.includes('mail')) return Mail;
    if (k.includes('phone') || k.includes('mobile')) return Phone;
    if (k.includes('city') || k.includes('region') || k.includes('address') || k.includes('location'))
      return MapPin;
    if (k.includes('degree') || k.includes('institute') || k.includes('stream') || k.includes('education'))
      return GraduationCap;
    if (k.includes('company') || k.includes('work') || k.includes('experience') || k.includes('joining'))
      return Briefcase;
    if (k.includes('age') || k.includes('date')) return Calendar;
    if (k.includes('blood')) return Heart;
    if (k.includes('weight') || k.includes('height')) return Activity;
    if (k.includes('institute') || k.includes('college')) return Building2;
    return User;
  };

  // Extract all candidates from loaded sheet for quick picks
  const allCandidates: CandidateItem[] = useMemo(() => {
    if (!excelData?.data) return [];
    const regCol = excelData.regNumberColumn;
    const nameCol = excelData.columns.find((c) => {
      const n = c.toLowerCase().trim();
      return (
        n.includes('name') ||
        n === 'candidate' ||
        n === 'student' ||
        n === 'person'
      );
    });
    const emailCol = excelData.columns.find(
      (c) => c.toLowerCase().includes('email') || c.toLowerCase().includes('mail')
    );
    const cityCol = excelData.columns.find((c) => c.toLowerCase().includes('city'));
    const degreeCol = excelData.columns.find((c) => c.toLowerCase().includes('degree'));
    const instCol = excelData.columns.find(
      (c) => c.toLowerCase().includes('institute') || c.toLowerCase().includes('college')
    );

    return excelData.data
      .map((row, idx) => ({
        index: idx + 1,
        reg: String(row[regCol] || '').trim(),
        name: nameCol ? String(row[nameCol] || '').trim() : '',
        email: emailCol ? String(row[emailCol] || '').trim() : undefined,
        city: cityCol ? String(row[cityCol] || '').trim() : undefined,
        degree: degreeCol ? String(row[degreeCol] || '').trim() : undefined,
        institute: instCol ? String(row[instCol] || '').trim() : undefined,
        row,
      }))
      .filter((c) => c.reg.length > 0);
  }, [excelData]);

  // Live filter for quick picks bar
  const filteredQuickCandidates = useMemo(() => {
    if (!quickFilter.trim()) return allCandidates;
    const q = quickFilter.toLowerCase().trim();
    return allCandidates.filter(
      (c) => c.reg.toLowerCase().includes(q) || c.name.toLowerCase().includes(q)
    );
  }, [allCandidates, quickFilter]);

  const totalQuickPages = Math.ceil(filteredQuickCandidates.length / PILLS_PER_PAGE) || 1;
  const currentQuickPills = useMemo(() => {
    if (isScrollableMode) {
      return filteredQuickCandidates.slice(0, 300);
    }
    const start = quickPage * PILLS_PER_PAGE;
    return filteredQuickCandidates.slice(start, start + PILLS_PER_PAGE);
  }, [filteredQuickCandidates, quickPage, isScrollableMode]);

  // Instant autocomplete suggestions when typing in search input
  const searchSuggestions = useMemo(() => {
    if (!regInput.trim() || !excelData) return [];
    const q = regInput.toLowerCase().trim();
    return allCandidates
      .filter((c) => c.reg.toLowerCase().includes(q) || c.name.toLowerCase().includes(q))
      .slice(0, 8);
  }, [allCandidates, regInput, excelData]);

  // Modal directory filtering
  const modalCandidates = useMemo(() => {
    let list = allCandidates;
    if (modalLetter !== 'ALL') {
      list = list.filter((c) => (c.name || c.reg).toUpperCase().startsWith(modalLetter));
    }
    if (modalSearch.trim()) {
      const q = modalSearch.toLowerCase().trim();
      list = list.filter(
        (c) =>
          c.reg.toLowerCase().includes(q) ||
          c.name.toLowerCase().includes(q) ||
          (c.city && c.city.toLowerCase().includes(q)) ||
          (c.institute && c.institute.toLowerCase().includes(q))
      );
    }
    return list;
  }, [allCandidates, modalSearch, modalLetter]);

  const modalTotalPages = Math.ceil(modalCandidates.length / MODAL_PAGE_SIZE) || 1;
  const currentModalItems = useMemo(() => {
    const start = modalPage * MODAL_PAGE_SIZE;
    return modalCandidates.slice(start, start + MODAL_PAGE_SIZE);
  }, [modalCandidates, modalPage]);

  const rawEntries = selectedPerson ? Object.entries(selectedPerson.rawDetails) : [];

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header & Quick Action Row */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="w-6 h-6 rounded-full bg-indigo-600 text-white text-xs font-bold flex items-center justify-center">
              1
            </span>
            <h2 className="text-xl font-bold text-white tracking-tight">Select Candidate Record</h2>
          </div>
          <p className="text-sm text-slate-400">
            Upload candidate spreadsheet or choose a record to automatically prepare form data.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => downloadSampleExcel()}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 border border-slate-700 text-xs font-medium text-slate-300 transition-colors shadow-sm"
          >
            <Download className="w-3.5 h-3.5 text-indigo-400" />
            <span>Sample Excel</span>
          </button>
          {!excelData && (
            <button
              onClick={loadDemoDataDirectly}
              className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-xs font-semibold text-white transition-colors shadow-md shadow-indigo-600/30"
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>Load 2,000 Records Demo</span>
            </button>
          )}
        </div>
      </div>

      {/* Upload Error Banner */}
      {error && (
        <div className="p-4 rounded-xl bg-rose-950/40 border border-rose-800/60 text-rose-200 flex items-start gap-3">
          <AlertCircle className="w-5 h-5 text-rose-400 shrink-0 mt-0.5" />
          <div className="text-sm">
            <p className="font-semibold text-rose-100">Upload Notice</p>
            <p className="text-xs text-rose-300 mt-0.5">{error}</p>
          </div>
        </div>
      )}

      {/* Upload or Active File Banner */}
      {!excelData ? (
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

          <div className="flex flex-col items-center justify-center space-y-3">
            <div className="w-14 h-14 rounded-2xl bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center text-indigo-400 shadow-inner">
              {isLoading ? (
                <div className="w-6 h-6 border-2 border-indigo-400 border-t-transparent rounded-full animate-spin"></div>
              ) : (
                <UploadCloud className="w-7 h-7" />
              )}
            </div>

            <div>
              <p className="text-sm font-semibold text-white">
                Drag & drop candidate spreadsheet here, or{' '}
                <span className="text-indigo-400 hover:underline">browse files</span>
              </p>
              <p className="text-xs text-slate-400 mt-1">Supports XLSX, XLS (up to 50,000 rows)</p>
            </div>
          </div>
        </div>
      ) : (
        <div className="p-4 rounded-xl bg-slate-900 border border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 flex items-center justify-center shrink-0">
              <FileSpreadsheet className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-sm font-bold text-white">{excelData.fileName}</span>
                <span className="px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 text-[10px] font-mono border border-emerald-500/20">
                  {excelData.totalRows.toLocaleString()} rows
                </span>
              </div>
              <p className="text-xs text-slate-400">
                Key column detected:{' '}
                <strong className="text-indigo-300 font-mono">{excelData.regNumberColumn}</strong> &bull;{' '}
                {excelData.columns.length} attributes
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => {
                if (fileInputRef.current) fileInputRef.current.value = '';
                fileInputRef.current?.click();
              }}
              className="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-xs font-medium text-slate-200 transition-colors border border-slate-700"
            >
              Replace Sheet
            </button>
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
          </div>
        </div>
      )}

      {/* Candidate Record Finder & Picker */}
      {excelData && (
        <div className="p-6 rounded-2xl bg-slate-900/80 border border-slate-800 space-y-4 shadow-xl">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
            <label
              htmlFor="reg-search-input"
              className="text-xs font-semibold uppercase tracking-wider text-slate-300 flex items-center gap-1.5"
            >
              <UserSearch className="w-3.5 h-3.5 text-indigo-400" />
              <span>Select Candidate by Registration Number or Name</span>
            </label>

            {/* Quick Candidate Dropdown */}
            <div className="flex items-center gap-2">
              <span className="text-xs text-slate-400">Jump to Record:</span>
              <select
                value={selectedPerson?.regNumber || ''}
                onChange={(e) => {
                  if (e.target.value) {
                    selectCandidate(e.target.value);
                  }
                }}
                className="px-3 py-1.5 rounded-lg bg-slate-950 border border-slate-700 text-xs text-white focus:outline-none focus:ring-1 focus:ring-indigo-500 font-mono max-w-xs"
              >
                <option value="">-- Choose from all {allCandidates.length.toLocaleString()} --</option>
                {allCandidates.map((c) => (
                  <option key={c.reg} value={c.reg}>
                    {c.reg} {c.name ? `— ${c.name}` : ''} (#{c.index})
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Search Box with Autocomplete Dropdown */}
          <div className="relative">
            <div className="flex flex-col sm:flex-row gap-3">
              <div className="relative flex-1">
                <Search className="w-5 h-5 absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
                <input
                  id="reg-search-input"
                  type="text"
                  value={regInput}
                  onChange={(e) => {
                    setRegInput(e.target.value);
                    setIsSearchFocused(true);
                  }}
                  onFocus={() => setIsSearchFocused(true)}
                  onBlur={() => setTimeout(() => setIsSearchFocused(false), 250)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      e.preventDefault();
                      setIsSearchFocused(false);
                      handleSearch();
                    }
                  }}
                  placeholder="Enter Registration Number or Name (e.g. 866458 or M.Aashritha)"
                  className="w-full pl-12 pr-10 py-3 rounded-xl bg-slate-950 border border-slate-700 text-white text-sm placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 font-mono"
                />
                {regInput && (
                  <button
                    type="button"
                    onClick={() => {
                      setRegInput('');
                      setIsSearchFocused(false);
                    }}
                    className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white"
                  >
                    <X className="w-4 h-4" />
                  </button>
                )}
              </div>

              <button
                onClick={() => handleSearch()}
                className="flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-semibold text-sm transition-all shadow-lg shadow-indigo-600/30 shrink-0"
              >
                <UserSearch className="w-4 h-4" />
                <span>Find Record</span>
              </button>
            </div>

            {/* Autocomplete Dropdown */}
            {isSearchFocused && searchSuggestions.length > 0 && (
              <div className="absolute left-0 right-0 sm:right-36 top-full mt-1.5 z-50 bg-slate-900 border border-slate-700 rounded-xl shadow-2xl overflow-hidden divide-y divide-slate-800 animate-fade-in max-h-72 overflow-y-auto">
                <div className="px-3 py-1.5 bg-slate-950 text-[10px] uppercase font-bold text-slate-400 flex justify-between items-center">
                  <span>Matching Candidates ({searchSuggestions.length})</span>
                  <span className="font-mono text-indigo-400">Click to Select</span>
                </div>
                {searchSuggestions.map((item) => (
                  <button
                    key={item.reg}
                    type="button"
                    onMouseDown={() => selectCandidate(item.reg)}
                    className="w-full px-4 py-2.5 text-left hover:bg-indigo-950/40 flex items-center justify-between group transition-colors"
                  >
                    <div className="flex items-center gap-3">
                      <span className="font-mono font-bold text-xs text-indigo-400 bg-indigo-500/10 px-2 py-0.5 rounded border border-indigo-500/20">
                        {item.reg}
                      </span>
                      <span className="text-xs font-semibold text-white group-hover:text-indigo-300">
                        {item.name || 'Candidate'}
                      </span>
                    </div>
                    {item.city && (
                      <span className="text-[11px] text-slate-400 font-sans">
                        {item.city} {item.degree ? `• ${item.degree}` : ''}
                      </span>
                    )}
                  </button>
                ))}
              </div>
            )}
          </div>

          {searchError && (
            <p className="text-xs text-rose-400 font-medium flex items-center gap-1.5">
              <AlertCircle className="w-3.5 h-3.5 shrink-0" />
              <span>{searchError}</span>
            </p>
          )}

          {/* Enhanced Quick Picks for ALL 2,000 Records */}
          {allCandidates.length > 0 && (
            <div className="pt-3 border-t border-slate-800 space-y-2.5">
              {/* Quick Picks Controls Toolbar */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2.5">
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="text-[11px] font-semibold text-slate-300 flex items-center gap-1.5">
                    <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                    <span>Quick Picks:</span>
                  </span>
                  <span className="text-[10px] px-2 py-0.5 rounded-full bg-slate-800 text-slate-400 font-mono border border-slate-700">
                    {filteredQuickCandidates.length === allCandidates.length
                      ? `${allCandidates.length.toLocaleString()} total`
                      : `${filteredQuickCandidates.length} of ${allCandidates.length.toLocaleString()}`}
                  </span>
                </div>

                <div className="flex items-center gap-2 flex-wrap">
                  {/* Inline filter for quick picks */}
                  <div className="relative">
                    <Filter className="w-3 h-3 absolute left-2.5 top-1/2 -translate-y-1/2 text-slate-400" />
                    <input
                      type="text"
                      value={quickFilter}
                      onChange={(e) => {
                        setQuickFilter(e.target.value);
                        setQuickPage(0);
                      }}
                      placeholder="Filter picks (e.g. Srinivas)..."
                      className="pl-7 pr-6 py-1 rounded-lg bg-slate-950 border border-slate-700 text-xs text-slate-200 placeholder:text-slate-500 focus:outline-none focus:ring-1 focus:ring-indigo-500 w-44 font-sans"
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

                  {/* Mode Toggle: Scroll vs Paginated */}
                  <button
                    type="button"
                    onClick={() => setIsScrollableMode(!isScrollableMode)}
                    className="px-2 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-[11px] text-slate-300 border border-slate-700 flex items-center gap-1 transition-colors"
                    title={isScrollableMode ? 'Switch to Paged View' : 'Switch to Scrollable View'}
                  >
                    <Grid className="w-3 h-3 text-indigo-400" />
                    <span>{isScrollableMode ? 'Paged' : 'Expand'}</span>
                  </button>

                  {/* Pagination Controls */}
                  {!isScrollableMode && totalQuickPages > 1 && (
                    <div className="flex items-center gap-1 bg-slate-950 px-1.5 py-0.5 rounded-lg border border-slate-800">
                      <button
                        type="button"
                        onClick={() => setQuickPage((p) => Math.max(0, p - 1))}
                        disabled={quickPage === 0}
                        className="p-1 rounded text-slate-400 hover:text-white disabled:opacity-30 disabled:hover:text-slate-400"
                      >
                        <ChevronLeft className="w-3.5 h-3.5" />
                      </button>
                      <span className="text-[10px] font-mono text-slate-400 px-1">
                        {quickPage + 1}/{totalQuickPages}
                      </span>
                      <button
                        type="button"
                        onClick={() => setQuickPage((p) => Math.min(totalQuickPages - 1, p + 1))}
                        disabled={quickPage >= totalQuickPages - 1}
                        className="p-1 rounded text-slate-400 hover:text-white disabled:opacity-30 disabled:hover:text-slate-400"
                      >
                        <ChevronRight className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  )}

                  {/* Directory Modal Trigger */}
                  <button
                    type="button"
                    onClick={() => setIsModalOpen(true)}
                    className="flex items-center gap-1 px-2.5 py-1 rounded-lg bg-indigo-600/20 hover:bg-indigo-600/30 text-indigo-300 border border-indigo-500/30 text-xs font-semibold transition-colors"
                  >
                    <Users className="w-3 h-3" />
                    <span>Browse All ({allCandidates.length.toLocaleString()})</span>
                  </button>
                </div>
              </div>

              {/* The Quick Pick Pills */}
              <div
                className={`flex flex-wrap gap-2 transition-all ${
                  isScrollableMode
                    ? 'max-h-56 overflow-y-auto pr-1 p-2 rounded-xl bg-slate-950/40 border border-slate-800/80'
                    : ''
                }`}
              >
                {currentQuickPills.length > 0 ? (
                  currentQuickPills.map((item) => {
                    const isSelected = selectedPerson?.regNumber === item.reg;
                    return (
                      <button
                        key={item.reg}
                        type="button"
                        onClick={() => selectCandidate(item.reg)}
                        className={`px-2.5 py-1 rounded-lg text-xs font-mono transition-all flex items-center gap-1.5 border shadow-sm ${
                          isSelected
                            ? 'bg-indigo-600 text-white border-indigo-500 shadow-indigo-600/30 ring-1 ring-indigo-400'
                            : 'bg-slate-800 hover:bg-slate-700 text-slate-300 border-slate-700 hover:border-slate-600'
                        }`}
                      >
                        <span className="font-bold">{item.reg}</span>
                        {item.name && (
                          <span className="text-[11px] opacity-80 font-sans">({item.name})</span>
                        )}
                      </button>
                    );
                  })
                ) : (
                  <p className="text-xs text-slate-500 italic py-1">
                    No candidates match &quot;{quickFilter}&quot;.
                  </p>
                )}
              </div>
            </div>
          )}
        </div>
      )}

      {/* Selected Person Details & Proceed Banner */}
      {selectedPerson && (
        <div className="p-6 rounded-2xl bg-slate-900/80 border border-slate-800 space-y-5 animate-slide-up shadow-xl">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-800">
            <div className="flex items-center gap-3.5">
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-indigo-500 to-cyan-500 flex items-center justify-center text-white text-xl font-bold shadow-md shadow-indigo-500/20 shrink-0">
                {(selectedPerson.fullName || selectedPerson.regNumber).charAt(0).toUpperCase()}
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="text-base font-bold text-white">
                    {selectedPerson.fullName || 'Candidate Record'}
                  </h3>
                  <span className="px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 text-[10px] font-bold">
                    ✓ Active Record
                  </span>
                </div>
                <p className="text-xs text-slate-400 font-mono mt-0.5">
                  Reg No: <strong className="text-indigo-300">{selectedPerson.regNumber}</strong> &bull;{' '}
                  {rawEntries.length} attributes ready
                </p>
              </div>
            </div>

            <button
              id="proceed-to-mapping-button"
              onClick={onNextStep}
              className="flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-sm font-semibold transition-all shadow-lg shadow-indigo-600/30 group shrink-0"
            >
              <span>Proceed to Target & Mapping</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
            </button>
          </div>

          {/* Dynamic Attributes Grid */}
          <div>
            <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-3">
              Candidate Attributes & Values ({rawEntries.length})
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2.5">
              {rawEntries.map(([colName, val], idx) => {
                const Icon = getFieldIcon(colName);
                const valStr = val !== null && val !== undefined ? String(val) : '—';
                const isReg = colName.toLowerCase().includes('registration');

                return (
                  <div
                    key={idx}
                    className={`p-3 rounded-xl border text-xs transition-all ${
                      isReg
                        ? 'bg-indigo-950/30 border-indigo-700/50'
                        : 'bg-slate-950/60 border-slate-800/80 hover:border-slate-700'
                    }`}
                  >
                    <div className="flex items-center gap-1.5 text-slate-400 mb-1">
                      <Icon className="w-3.5 h-3.5 text-indigo-400 shrink-0" />
                      <span className="font-semibold text-slate-300 truncate" title={colName}>
                        {colName}
                      </span>
                    </div>
                    <p
                      className={`font-mono truncate ${
                        valStr === '—'
                          ? 'text-slate-600 italic'
                          : isReg
                          ? 'text-indigo-300 font-bold'
                          : 'text-white'
                      }`}
                      title={valStr}
                    >
                      {valStr}
                    </p>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* Directory Modal for ALL 2,000 Records */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 animate-fade-in">
          <div className="bg-slate-900 border border-slate-700 rounded-2xl w-full max-w-4xl max-h-[88vh] flex flex-col shadow-2xl overflow-hidden">
            {/* Modal Header */}
            <div className="p-5 border-b border-slate-800 flex items-center justify-between gap-4 bg-slate-950/50">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-indigo-600/20 border border-indigo-500/30 text-indigo-400 flex items-center justify-center">
                  <Users className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-white flex items-center gap-2">
                    <span>Full Candidate Directory</span>
                    <span className="text-xs px-2 py-0.5 rounded-full bg-indigo-500/20 text-indigo-300 font-mono">
                      {allCandidates.length.toLocaleString()} Records
                    </span>
                  </h3>
                  <p className="text-xs text-slate-400">
                    Click any candidate to instantly select and load their 17 attributes.
                  </p>
                </div>
              </div>

              <button
                type="button"
                onClick={() => setIsModalOpen(false)}
                className="w-8 h-8 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white flex items-center justify-center transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Search and Alphabet Filter Bar */}
            <div className="p-4 bg-slate-900 border-b border-slate-800 space-y-3">
              <div className="relative">
                <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                <input
                  type="text"
                  value={modalSearch}
                  onChange={(e) => {
                    setModalSearch(e.target.value);
                    setModalPage(0);
                  }}
                  placeholder="Search 2,000 candidates by Name, Registration Number, City, Degree..."
                  className="w-full pl-10 pr-9 py-2 rounded-xl bg-slate-950 border border-slate-700 text-white text-xs placeholder:text-slate-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
                />
                {modalSearch && (
                  <button
                    onClick={() => setModalSearch('')}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white"
                  >
                    <X className="w-3.5 h-3.5" />
                  </button>
                )}
              </div>

              {/* Alphabet Row */}
              <div className="flex items-center gap-1 overflow-x-auto pb-1 scrollbar-none text-[11px]">
                <button
                  type="button"
                  onClick={() => {
                    setModalLetter('ALL');
                    setModalPage(0);
                  }}
                  className={`px-2 py-0.5 rounded font-bold transition-colors ${
                    modalLetter === 'ALL'
                      ? 'bg-indigo-600 text-white'
                      : 'text-slate-400 hover:text-white hover:bg-slate-800'
                  }`}
                >
                  ALL
                </button>
                {Array.from({ length: 26 }, (_, i) => String.fromCharCode(65 + i)).map((char) => (
                  <button
                    key={char}
                    type="button"
                    onClick={() => {
                      setModalLetter(char);
                      setModalPage(0);
                    }}
                    className={`px-1.5 py-0.5 rounded font-mono transition-colors ${
                      modalLetter === char
                        ? 'bg-indigo-600 text-white'
                        : 'text-slate-400 hover:text-white hover:bg-slate-800'
                    }`}
                  >
                    {char}
                  </button>
                ))}
              </div>
            </div>

            {/* Modal Candidates Grid */}
            <div className="p-4 overflow-y-auto flex-1 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2.5">
              {currentModalItems.length > 0 ? (
                currentModalItems.map((item) => {
                  const isSelected = selectedPerson?.regNumber === item.reg;
                  return (
                    <button
                      key={item.reg}
                      type="button"
                      onClick={() => selectCandidate(item.reg)}
                      className={`p-3 rounded-xl border text-left transition-all flex flex-col justify-between group ${
                        isSelected
                          ? 'bg-indigo-950/60 border-indigo-500 shadow-md ring-1 ring-indigo-400'
                          : 'bg-slate-950/50 border-slate-800 hover:border-slate-700 hover:bg-slate-800/40'
                      }`}
                    >
                      <div className="flex items-start justify-between gap-2 mb-1.5">
                        <span className="font-mono text-xs font-bold text-indigo-400 bg-indigo-500/10 px-2 py-0.5 rounded border border-indigo-500/20">
                          {item.reg}
                        </span>
                        <span className="text-[10px] text-slate-500 font-mono">#{item.index}</span>
                      </div>

                      <div className="space-y-0.5">
                        <h4 className="text-xs font-bold text-white group-hover:text-indigo-300 truncate">
                          {item.name || 'Unnamed Candidate'}
                        </h4>
                        {item.degree && (
                          <p className="text-[10px] text-slate-400 truncate">{item.degree}</p>
                        )}
                        {item.city && (
                          <p className="text-[10px] text-slate-500 flex items-center gap-1 truncate">
                            <MapPin className="w-2.5 h-2.5 text-slate-400" />
                            <span>{item.city}</span>
                          </p>
                        )}
                      </div>

                      <div className="mt-2 pt-1.5 border-t border-slate-800/60 flex items-center justify-between text-[10px]">
                        <span className="text-slate-400">Click to Select</span>
                        {isSelected && (
                          <span className="text-emerald-400 font-bold flex items-center gap-0.5">
                            <Check className="w-3 h-3" /> Selected
                          </span>
                        )}
                      </div>
                    </button>
                  );
                })
              ) : (
                <div className="col-span-full py-12 text-center text-slate-500 text-xs">
                  No candidates match your directory filter.
                </div>
              )}
            </div>

            {/* Modal Pagination Footer */}
            <div className="p-4 bg-slate-950 border-t border-slate-800 flex items-center justify-between gap-3 text-xs">
              <span className="text-slate-400 font-mono text-[11px]">
                Showing {Math.min(modalCandidates.length, modalPage * MODAL_PAGE_SIZE + 1)}-
                {Math.min(modalCandidates.length, (modalPage + 1) * MODAL_PAGE_SIZE)} of{' '}
                {modalCandidates.length.toLocaleString()} candidates
              </span>

              {modalTotalPages > 1 && (
                <div className="flex items-center gap-1.5">
                  <button
                    type="button"
                    onClick={() => setModalPage((p) => Math.max(0, p - 1))}
                    disabled={modalPage === 0}
                    className="px-2.5 py-1 rounded bg-slate-800 hover:bg-slate-700 text-slate-300 disabled:opacity-30 disabled:hover:bg-slate-800 text-xs"
                  >
                    Previous
                  </button>
                  <span className="font-mono text-slate-300 px-2 text-[11px]">
                    {modalPage + 1} / {modalTotalPages}
                  </span>
                  <button
                    type="button"
                    onClick={() => setModalPage((p) => Math.min(modalTotalPages - 1, p + 1))}
                    disabled={modalPage >= modalTotalPages - 1}
                    className="px-2.5 py-1 rounded bg-slate-800 hover:bg-slate-700 text-slate-300 disabled:opacity-30 disabled:hover:bg-slate-800 text-xs"
                  >
                    Next
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

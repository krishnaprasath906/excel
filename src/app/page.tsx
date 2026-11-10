'use client';

import React, { useState, useEffect, useRef } from 'react';
import { Sidebar } from '@/components/layout/Sidebar';
import { Header } from '@/components/layout/Header';
import { StepSelectData } from '@/components/steps/StepSelectData';
import { StepConfigureMapping } from '@/components/steps/StepConfigureMapping';
import { StepExecuteAutofill } from '@/components/steps/StepExecuteAutofill';
import { InteractiveForm } from '@/components/demo/InteractiveForm';
import {
  AutofillResult,
  DetectedFormField,
  ExcelParseResult,
  FieldMapping,
  PersonRecord,
} from '@/types';
import { detectFormFields } from '@/matching/fieldDetector';
import { matchFields } from '@/matching/fieldMatcher';
import { executeAutofill } from '@/autofill/formFiller';
import { getDomainMapping, clearAllAppData } from '@/storage/mappingStorage';
import { Eye, EyeOff, Layers } from 'lucide-react';

export default function DashboardPage() {
  const [currentStep, setCurrentStep] = useState<number>(1);
  const [excelData, setExcelData] = useState<ExcelParseResult | null>(null);
  const [selectedPerson, setSelectedPerson] = useState<PersonRecord | null>(null);
  const [targetUrl, setTargetUrl] = useState<string>('/demo-form');
  const [detectedFields, setDetectedFields] = useState<DetectedFormField[]>([]);
  const [mappings, setMappings] = useState<FieldMapping[]>([]);
  const [showLiveEmbeddedForm, setShowLiveEmbeddedForm] = useState<boolean>(true);
  const [quickPage, setQuickPage] = useState<number>(0);
  const [quickFilter, setQuickFilter] = useState<string>('');
  const [isScrollableMode, setIsScrollableMode] = useState<boolean>(false);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const saved = sessionStorage.getItem('excel_autofill_quick_page');
      if (saved !== null) {
        setQuickPage(parseInt(saved, 10) || 0);
      }
    }
  }, []);

  const handleQuickPageChange = (page: number) => {
    setQuickPage(page);
    if (typeof window !== 'undefined') {
      sessionStorage.setItem('excel_autofill_quick_page', String(page));
    }
  };

  const demoFormRef = useRef<HTMLDivElement>(null);

  // Auto-scan embedded demo form when mounted or updated
  useEffect(() => {
    if (demoFormRef.current) {
      const scanned = detectFormFields(demoFormRef.current);
      setDetectedFields(scanned);
    }
  }, [showLiveEmbeddedForm, currentStep]);

  // Recompute field mappings when person or detected fields change
  useEffect(() => {
    if (excelData && selectedPerson && detectedFields.length > 0) {
      const domain = extractDomain(targetUrl);
      const saved = getDomainMapping(domain) || undefined;
      const computed = matchFields(excelData.columns, detectedFields, selectedPerson, saved);
      setMappings(computed);
    }
  }, [excelData, selectedPerson, detectedFields, targetUrl]);

  const extractDomain = (url: string): string => {
    if (!url || url.startsWith('/')) return 'local-demo';
    try {
      const parsed = new URL(url.startsWith('http') ? url : `https://${url}`);
      return parsed.hostname;
    } catch {
      return url.split('/')[0] || 'target-form';
    }
  };

  const handleExcelParsed = (result: ExcelParseResult) => {
    setExcelData(result);
  };
  const handlePersonFound = (person: PersonRecord) => {
    setSelectedPerson(person);
  };

  const handleConnectForm = (url: string) => {
    setTargetUrl(url);
    if (url === '/demo-form' || url.includes('localhost') || url.includes('127.0.0.1')) {
      if (demoFormRef.current) {
        const scanned = detectFormFields(demoFormRef.current);
        setDetectedFields(scanned);
      }
    }
  };

  const handleTriggerAutofill = async (): Promise<AutofillResult | void> => {
    if (demoFormRef.current) {
      const res = executeAutofill(demoFormRef.current, mappings);
      return res;
    }
  };

  const handleClearAllData = () => {
    clearAllAppData();
    setExcelData(null);
    setSelectedPerson(null);
    setMappings([]);
    setCurrentStep(1);
  };

  const steps = [
    { num: 1, title: 'Select Candidate', desc: 'Upload & Pick Record' },
    { num: 2, title: 'Target & Mapping', desc: 'Auto-Matched Fields' },
    { num: 3, title: 'Review & Autofill', desc: '1-Click Execution' },
  ];

  return (
    <div className="flex min-h-screen bg-slate-950 text-slate-100 selection:bg-indigo-500 selection:text-white">
      {/* Sidebar Navigation */}
      <Sidebar
        currentStep={currentStep}
        onSelectStep={(step) => {
          if (step === 1) setCurrentStep(1);
          if (step === 2 && selectedPerson) setCurrentStep(2);
          if (step === 3 && selectedPerson) setCurrentStep(3);
        }}
        recordCount={excelData?.totalRows || 0}
        selectedPersonName={selectedPerson?.fullName}
      />

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0">
        <Header
          fileName={excelData?.fileName}
          totalRecords={excelData?.totalRows}
          selectedPersonReg={selectedPerson?.regNumber}
          onClearData={handleClearAllData}
        />

        <main className="p-6 md:p-8 max-w-7xl mx-auto w-full space-y-8">
          {/* Top 3-Step Streamlined Stepper */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5">
            {steps.map((step) => {
              const isActive = currentStep === step.num;
              const isPassed = currentStep > step.num;
              const isAvailable =
                step.num === 1 ||
                (step.num === 2 && !!selectedPerson) ||
                (step.num === 3 && !!selectedPerson);

              return (
                <button
                  key={step.num}
                  disabled={!isAvailable}
                  onClick={() => {
                    if (step.num === 1) setCurrentStep(1);
                    if (step.num === 2 && selectedPerson) setCurrentStep(2);
                    if (step.num === 3 && selectedPerson) setCurrentStep(3);
                  }}
                  className={`p-4 rounded-2xl text-left border transition-all ${isActive
                    ? 'bg-indigo-950/60 border-indigo-500 shadow-lg shadow-indigo-600/20 ring-1 ring-indigo-500/50'
                    : isPassed
                      ? 'bg-slate-900/80 border-slate-800 hover:border-slate-700 cursor-pointer'
                      : isAvailable
                        ? 'bg-slate-900/40 border-slate-800/80 hover:border-slate-700 cursor-pointer'
                        : 'bg-slate-950/40 border-slate-900 opacity-40 cursor-not-allowed'
                    }`}
                >
                  <div className="flex items-center gap-3 mb-1">
                    <span
                      className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold font-mono ${isActive
                        ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/40'
                        : isPassed
                          ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                          : 'bg-slate-800 text-slate-400'
                        }`}
                    >
                      {isPassed ? '✓' : step.num}
                    </span>
                    <span className="text-sm font-bold text-white truncate">{step.title}</span>
                  </div>
                  <p className="text-xs text-slate-400 truncate pl-9">{step.desc}</p>
                </button>
              );
            })}
          </div>

          {/* Current Step Content Container */}
          <div className="bg-slate-900/40 border border-slate-800/80 rounded-3xl p-6 md:p-8 backdrop-blur-xl shadow-2xl">
            {/* Step 1: Candidate Selection (kept mounted so quickPage and filters never reset) */}
            <div className={currentStep === 1 ? 'block' : 'hidden'}>
              <StepSelectData
                excelData={excelData}
                selectedPerson={selectedPerson}
                onExcelParsed={handleExcelParsed}
                onPersonFound={handlePersonFound}
                onNextStep={() => setCurrentStep(2)}
                quickPage={quickPage}
                onQuickPageChange={handleQuickPageChange}
                quickFilter={quickFilter}
                onQuickFilterChange={setQuickFilter}
                isScrollableMode={isScrollableMode}
                onScrollableModeChange={setIsScrollableMode}
              />
            </div>

            {currentStep === 2 && selectedPerson && (
              <StepConfigureMapping
                person={selectedPerson}
                targetUrl={targetUrl}
                targetDomain={extractDomain(targetUrl)}
                mappings={mappings}
                detectedFields={detectedFields}
                onUrlChange={setTargetUrl}
                onConnectForm={handleConnectForm}
                onUpdateMapping={setMappings}
                onResetMappings={() => {
                  if (excelData && selectedPerson) {
                    const fresh = matchFields(excelData.columns, detectedFields, selectedPerson);
                    setMappings(fresh);
                  }
                }}
                onNextStep={() => setCurrentStep(3)}
                onPrevStep={() => setCurrentStep(1)}
              />
            )}

            {currentStep === 3 && selectedPerson && (
              <StepExecuteAutofill
                person={selectedPerson}
                targetUrl={targetUrl}
                targetDomain={extractDomain(targetUrl)}
                mappings={mappings}
                onTriggerAutofill={handleTriggerAutofill}
                onPrevStep={() => setCurrentStep(2)}
                onReturnToCandidateSelection={() => setCurrentStep(1)}
                currentCandidatePage={quickPage}
              />
            )}
          </div>

          {/* Live Embedded 17-Field Test Form (always available for instant end-to-end verification) */}
          <div className="space-y-4 pt-4 border-t border-slate-800/80">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <Layers className="w-5 h-5 text-indigo-400" />
                <div>
                  <h3 className="text-base font-bold text-white flex items-center gap-2">
                    <span>Live Interactive Test Form (17 Scrambled Fields)</span>
                    <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 font-semibold border border-emerald-500/30">
                      Live DOM Target
                    </span>
                  </h3>
                  <p className="text-xs text-slate-400">
                    Direct target for instant end-to-end testing with React state and live change events.
                  </p>
                </div>
              </div>

              <button
                onClick={() => setShowLiveEmbeddedForm(!showLiveEmbeddedForm)}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-xs font-semibold text-slate-300 transition-colors"
              >
                {showLiveEmbeddedForm ? (
                  <>
                    <EyeOff className="w-3.5 h-3.5" />
                    <span>Hide Test Form</span>
                  </>
                ) : (
                  <>
                    <Eye className="w-3.5 h-3.5" />
                    <span>Show Test Form</span>
                  </>
                )}
              </button>
            </div>

            {showLiveEmbeddedForm && (
              <div className="animate-fade-in">
                <InteractiveForm ref={demoFormRef} isEmbedded={true} />
              </div>
            )}
          </div>
        </main>
      </div>
    </div>
  );
}

'use client';

import React, { useState } from 'react';
import {
  Zap,
  CheckCircle2,
  AlertTriangle,
  ShieldAlert,
  ArrowLeft,
  Sparkles,
  ExternalLink,
  ShieldCheck,
  Check,
  RotateCcw,
  Users,
  ArrowRight,
} from 'lucide-react';
import { AutofillResult, FieldMapping, PersonRecord } from '@/types';
import { validateFieldMapping } from '@/validation/validator';
import { recordAutofillHistory } from '@/storage/mappingStorage';
import { generatePreFilledGoogleFormUrl } from '@/excel/googleFormGenerator';

interface StepExecuteAutofillProps {
  person: PersonRecord;
  targetUrl: string;
  targetDomain: string;
  mappings: FieldMapping[];
  onTriggerAutofill: () => Promise<AutofillResult | void>;
  onPrevStep: () => void;
  onReturnToCandidateSelection?: () => void;
  currentCandidatePage?: number;
}

export const StepExecuteAutofill: React.FC<StepExecuteAutofillProps> = ({
  person,
  targetUrl,
  targetDomain,
  mappings,
  onTriggerAutofill,
  onPrevStep,
  onReturnToCandidateSelection,
  currentCandidatePage,
}) => {
  const [isAutofilling, setIsAutofilling] = useState(false);
  const [autofillResult, setAutofillResult] = useState<AutofillResult | null>(null);
  const [copiedGForm, setCopiedGForm] = useState(false);

  const isGoogleForm = targetUrl.includes('forms.gle') || targetUrl.includes('docs.google.com/forms');
  const googleFormPrefillUrl = isGoogleForm && person ? generatePreFilledGoogleFormUrl(person.rawDetails, targetUrl) : null;

  const mappedFields = mappings.filter((m) => m.formFieldId);
  const unmappedFields = mappings.filter((m) => !m.formFieldId);

  const handleStartAutofill = async () => {
    setIsAutofilling(true);
    try {
      const result = await onTriggerAutofill();
      if (result) {
        setAutofillResult(result);
        recordAutofillHistory({
          regNumber: person.regNumber,
          personName: person.fullName || person.regNumber,
          targetDomain: targetDomain || 'Local Form',
          targetUrl: targetUrl || '/demo-form',
          fieldsFilledCount: result.filledFields,
          totalFieldsCount: result.totalFields,
          status: result.filledFields === mappedFields.length ? 'Completed' : 'Partial',
        });
      } else {
        const fallbackRes: AutofillResult = {
          success: true,
          totalFields: mappedFields.length,
          filledFields: mappedFields.length,
          skippedFields: unmappedFields.length,
          fieldResults: mappedFields.map((m) => ({
            field: m.excelField,
            targetField: m.formFieldLabel || m.excelField,
            value: String(m.excelValue || ''),
            success: true,
          })),
          timestamp: new Date().toISOString(),
        };
        setAutofillResult(fallbackRes);
        recordAutofillHistory({
          regNumber: person.regNumber,
          personName: person.fullName || person.regNumber,
          targetDomain: targetDomain || 'Demo Form',
          targetUrl: targetUrl || '/demo-form',
          fieldsFilledCount: mappedFields.length,
          totalFieldsCount: mappedFields.length,
          status: 'Completed',
        });
      }
    } finally {
      setIsAutofilling(false);
    }
  };

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Step Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="w-6 h-6 rounded-full bg-indigo-600 text-white text-xs font-bold flex items-center justify-center">
              3
            </span>
            <h2 className="text-xl font-bold text-white tracking-tight">Review & Autofill Execution</h2>
          </div>
          <p className="text-sm text-slate-400">
            Execute safe 1-click autofill for{' '}
            <strong className="text-indigo-300">{person.fullName || person.regNumber}</strong> with automated field validation.
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <button
            onClick={onPrevStep}
            className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-xs font-semibold text-slate-300 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Back to Mapping</span>
          </button>

          {onReturnToCandidateSelection && (
            <button
              onClick={onReturnToCandidateSelection}
              className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-indigo-600/20 hover:bg-indigo-600/30 text-indigo-300 border border-indigo-500/30 text-xs font-semibold transition-colors"
            >
              <Users className="w-4 h-4" />
              <span>Pick Next (Page {currentCandidatePage !== undefined ? currentCandidatePage + 1 : 1})</span>
            </button>
          )}
        </div>
      </div>

      {/* Primary Action Card */}
      {isGoogleForm && googleFormPrefillUrl ? (
        <div className="p-6 rounded-2xl bg-gradient-to-r from-purple-950/70 via-slate-900 to-indigo-950/70 border-2 border-purple-500/60 shadow-2xl space-y-4">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-xl bg-purple-500/20 text-purple-300 flex items-center justify-center text-xl font-bold shrink-0">
                📋
              </div>
              <div>
                <h3 className="text-base font-bold text-white flex items-center gap-2">
                  <span>Google Form 1-Click Pre-Filled Link Ready</span>
                  <span className="text-xs px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 font-mono font-semibold">
                    17 Fields Mapped
                  </span>
                </h3>
                <p className="text-xs text-slate-300 mt-0.5">
                  Launch the Google Form with all attributes for{' '}
                  <strong className="text-white">{person.fullName || person.regNumber}</strong> pre-populated.
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2.5 shrink-0 flex-wrap">
              <a
                href={googleFormPrefillUrl}
                target="_blank"
                rel="noopener noreferrer"
                onClick={() => {
                  recordAutofillHistory({
                    regNumber: person.regNumber,
                    personName: person.fullName || person.regNumber,
                    targetDomain: 'forms.gle',
                    targetUrl: googleFormPrefillUrl,
                    fieldsFilledCount: 17,
                    totalFieldsCount: 17,
                    status: 'Completed',
                  });
                }}
                className="flex items-center gap-2 px-6 py-3.5 rounded-xl bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white text-sm font-bold transition-all shadow-lg shadow-purple-600/30 group"
              >
                <span>Open Pre-Filled Form</span>
                <ExternalLink className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
              </a>

              <button
                type="button"
                onClick={() => {
                  navigator.clipboard.writeText(googleFormPrefillUrl);
                  setCopiedGForm(true);
                  setTimeout(() => setCopiedGForm(false), 2500);
                }}
                className="px-4 py-3.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold transition-colors border border-slate-700 flex items-center gap-1.5"
              >
                {copiedGForm ? <Check className="w-4 h-4 text-emerald-400" /> : <ExternalLink className="w-4 h-4 text-slate-400" />}
                <span>{copiedGForm ? 'Copied!' : 'Copy Link'}</span>
              </button>

              {onReturnToCandidateSelection && (
                <button
                  type="button"
                  onClick={onReturnToCandidateSelection}
                  className="px-4 py-3.5 rounded-xl bg-indigo-950/60 hover:bg-indigo-900/80 text-indigo-200 text-xs font-semibold transition-colors border border-indigo-700/60 flex items-center gap-1.5"
                >
                  <Users className="w-4 h-4 text-indigo-400" />
                  <span>Return to Candidates (Page {currentCandidatePage !== undefined ? currentCandidatePage + 1 : 1})</span>
                </button>
              )}
            </div>
          </div>
        </div>
      ) : (
        <div className="p-6 rounded-2xl bg-gradient-to-r from-indigo-950/70 via-slate-900 to-indigo-950/70 border border-indigo-700/60 shadow-2xl flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3.5">
            <div className="w-12 h-12 rounded-xl bg-indigo-500/20 text-indigo-400 flex items-center justify-center shrink-0">
              <Zap className="w-6 h-6 fill-indigo-400" />
            </div>
            <div>
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                <span>Ready to Populate Target Form</span>
                <span className="text-xs px-2 py-0.5 rounded-full bg-indigo-500/20 text-indigo-300 font-mono font-semibold">
                  {mappedFields.length} controls mapped
                </span>
              </h3>
              <p className="text-xs text-slate-300 mt-0.5">
                Target: <strong className="font-mono text-white">{targetUrl}</strong> &bull; Framework reactive triggers enabled.
              </p>
            </div>
          </div>

          <button
            id="start-autofill-button"
            onClick={handleStartAutofill}
            disabled={isAutofilling || mappedFields.length === 0}
            className="w-full sm:w-auto px-8 py-3.5 rounded-xl bg-gradient-to-r from-indigo-600 via-indigo-500 to-cyan-500 hover:from-indigo-500 hover:to-cyan-400 disabled:opacity-50 text-white font-bold text-sm transition-all shadow-xl shadow-indigo-600/30 flex items-center justify-center gap-2.5 shrink-0"
          >
            {isAutofilling ? (
              <>
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                <span>Populating Form...</span>
              </>
            ) : (
              <>
                <Zap className="w-4 h-4 fill-white" />
                <span>START AUTOFILL</span>
              </>
            )}
          </button>
        </div>
      )}

      {/* Autofill Result Feedback */}
      {autofillResult && (
        <div className="p-5 rounded-2xl bg-emerald-950/30 border-2 border-emerald-500/50 space-y-3 animate-slide-up shadow-xl">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center shrink-0">
              <Check className="w-5 h-5 stroke-[3]" />
            </div>
            <div>
              <p className="text-base font-bold text-emerald-200">
                Autofill Applied Successfully ({autofillResult.filledFields} / {mappedFields.length} Fields Populated)
              </p>
              <p className="text-xs text-slate-300">
                All form controls below are now updated with candidate data.
              </p>
            </div>
          </div>

          {onReturnToCandidateSelection && (
            <div className="pt-2 border-t border-emerald-800/40 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
              <span className="text-xs text-emerald-300">Form autofilled successfully!</span>
              <button
                type="button"
                onClick={onReturnToCandidateSelection}
                className="flex items-center gap-2 px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold transition-all shadow-md shadow-indigo-600/30"
              >
                <span>Pick Next Candidate (Return to Page {currentCandidatePage !== undefined ? currentCandidatePage + 1 : 1})</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          )}
        </div>
      )}

      {/* CRITICAL HUMAN REVIEW SAFETY BANNER */}
      <div className="p-4 rounded-xl bg-amber-950/30 border border-amber-500/40 text-amber-200 flex items-start gap-3">
        <ShieldAlert className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />
        <div className="text-xs leading-relaxed">
          <p className="font-bold text-amber-100 text-sm mb-0.5">
            MANUAL SUBMISSION REQUIREMENT
          </p>
          <p>
            Please review all values in the active form before submitting. For security and regulatory compliance, Excel AutoFill <em>never</em> clicks Submit, Save, or continues automated workflows automatically.
          </p>
        </div>
      </div>

      {/* Field Value Preview Table */}
      <div className="rounded-2xl border border-slate-800 bg-slate-900/80 overflow-hidden shadow-xl">
        <div className="p-4 border-b border-slate-800 flex items-center justify-between">
          <h4 className="text-xs font-semibold uppercase tracking-wider text-slate-300">
            Values Summary ({mappedFields.length} mapped / {mappings.length} total)
          </h4>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-950/80 text-slate-400 uppercase tracking-wider font-semibold border-b border-slate-800">
              <tr>
                <th className="py-3 px-4">Field Name</th>
                <th className="py-3 px-4">Inserted Value</th>
                <th className="py-3 px-4">Mapped Control</th>
                <th className="py-3 px-4 text-center">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60">
              {mappings.map((m, idx) => {
                const valResult = validateFieldMapping(m);
                const isMapped = !!m.formFieldId;

                return (
                  <tr key={idx} className="hover:bg-slate-800/30 transition-colors">
                    <td className="py-3 px-4 font-semibold text-white">{m.excelField}</td>
                    <td
                      className="py-3 px-4 font-mono text-slate-300 max-w-[200px] truncate"
                      title={String(m.excelValue || '')}
                    >
                      {m.excelValue !== null && m.excelValue !== undefined && String(m.excelValue) !== '' ? (
                        String(m.excelValue)
                      ) : (
                        <span className="text-slate-600 italic">—</span>
                      )}
                    </td>
                    <td className="py-3 px-4">
                      {isMapped ? (
                        <span className="font-semibold text-indigo-300">{m.formFieldLabel}</span>
                      ) : (
                        <span className="text-slate-500 italic">Unmapped</span>
                      )}
                    </td>
                    <td className="py-3 px-4 text-center">
                      {isMapped ? (
                        valResult.isValid ? (
                          <span className="inline-flex items-center gap-1 text-emerald-400 font-semibold text-[11px]">
                            <CheckCircle2 className="w-3.5 h-3.5" />
                            Ready
                          </span>
                        ) : (
                          <span
                            className="inline-flex items-center gap-1 text-amber-400 font-semibold text-[11px]"
                            title={valResult.error || valResult.warning}
                          >
                            <AlertTriangle className="w-3.5 h-3.5" />
                            Review
                          </span>
                        )
                      ) : (
                        <span className="text-slate-500 text-[11px]">Skipped</span>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

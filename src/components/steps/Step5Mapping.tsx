'use client';

import React, { useState } from 'react';
import {
  CheckCircle2,
  AlertTriangle,
  HelpCircle,
  BookmarkCheck,
  RotateCcw,
  ArrowRight,
  ArrowLeft,
  SlidersHorizontal,
  Sparkles,
  Info,
} from 'lucide-react';
import { DetectedFormField, FieldMapping, PersonRecord } from '@/types';
import { saveDomainMapping } from '@/storage/mappingStorage';

interface Step5MappingProps {
  person: PersonRecord;
  targetDomain: string;
  mappings: FieldMapping[];
  detectedFields: DetectedFormField[];
  onUpdateMapping: (updated: FieldMapping[]) => void;
  onResetMappings: () => void;
  onNextStep: () => void;
  onPrevStep: () => void;
}

export const Step5Mapping: React.FC<Step5MappingProps> = ({
  person,
  targetDomain,
  mappings,
  detectedFields,
  onUpdateMapping,
  onResetMappings,
  onNextStep,
  onPrevStep,
}) => {
  const [activeEditingField, setActiveEditingField] = useState<string | null>(null);
  const [saveToast, setSaveToast] = useState(false);

  const highConfidenceCount = mappings.filter((m) => m.confidence >= 90).length;
  const reviewCount = mappings.filter((m) => m.confidence >= 75 && m.confidence < 90).length;
  const manualCount = mappings.filter((m) => m.confidence < 75 && m.formFieldId).length;
  const unmappedCount = mappings.filter((m) => !m.formFieldId).length;

  const handleManualFieldChange = (excelField: string, targetFormFieldId: string) => {
    const updated = mappings.map((m) => {
      if (m.excelField !== excelField) return m;

      if (targetFormFieldId === '__unmap__') {
        return {
          ...m,
          formFieldId: null,
          formFieldLabel: null,
          formFieldSelector: null,
          formFieldType: null,
          confidence: 0,
          confidenceLevel: 'none' as const,
          status: 'unmapped' as const,
          validationMessage: 'Manually unmapped',
          isCustomOverride: true,
        };
      }

      const target = detectedFields.find((f) => f.id === targetFormFieldId);
      if (!target) return m;

      return {
        ...m,
        formFieldId: target.id,
        formFieldLabel: target.label || target.name,
        formFieldSelector: target.selector,
        formFieldType: target.type,
        confidence: 100,
        confidenceLevel: 'high' as const,
        status: 'matched' as const,
        validationMessage: 'Manually assigned by user',
        isCustomOverride: true,
      };
    });

    onUpdateMapping(updated);
    setActiveEditingField(null);
  };

  const handleSaveDomainPreferences = () => {
    const mapObj: Record<string, string> = {};
    mappings.forEach((m) => {
      if (m.formFieldId) {
        mapObj[m.excelField] = m.formFieldId;
      }
    });

    saveDomainMapping(targetDomain, mapObj);
    setSaveToast(true);
    setTimeout(() => setSaveToast(false), 3000);
  };

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Step Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="w-6 h-6 rounded-full bg-indigo-600 text-white text-xs font-bold flex items-center justify-center">
              5
            </span>
            <h2 className="text-xl font-bold text-white tracking-tight">Automatic Field Mapping</h2>
          </div>
          <p className="text-sm text-slate-400">
            Intelligent heuristic matching connects Excel column data to corresponding form fields with confidence scoring.
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <button
            onClick={onPrevStep}
            className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-xs font-semibold text-slate-300 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Back</span>
          </button>
          <button
            id="proceed-to-preview-btn"
            onClick={onNextStep}
            className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-sm font-semibold transition-all shadow-lg shadow-indigo-600/30 group"
          >
            <span>Preview Autofill</span>
            <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
          </button>
        </div>
      </div>

      {/* Stats and Domain Actions */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <div className="p-3.5 rounded-xl bg-slate-900/80 border border-slate-800">
          <div className="flex items-center justify-between text-xs text-slate-400 mb-1">
            <span>High Confidence</span>
            <span className="w-2 h-2 rounded-full bg-emerald-400"></span>
          </div>
          <p className="text-xl font-mono font-bold text-emerald-400">{highConfidenceCount}</p>
        </div>

        <div className="p-3.5 rounded-xl bg-slate-900/80 border border-slate-800">
          <div className="flex items-center justify-between text-xs text-slate-400 mb-1">
            <span>Review Needed</span>
            <span className="w-2 h-2 rounded-full bg-amber-400"></span>
          </div>
          <p className="text-xl font-mono font-bold text-amber-400">{reviewCount}</p>
        </div>

        <div className="p-3.5 rounded-xl bg-slate-900/80 border border-slate-800">
          <div className="flex items-center justify-between text-xs text-slate-400 mb-1">
            <span>Manual Override</span>
            <span className="w-2 h-2 rounded-full bg-indigo-400"></span>
          </div>
          <p className="text-xl font-mono font-bold text-indigo-400">{manualCount}</p>
        </div>

        <div className="p-3.5 rounded-xl bg-slate-900/80 border border-slate-800">
          <div className="flex items-center justify-between text-xs text-slate-400 mb-1">
            <span>Unmapped</span>
            <span className="w-2 h-2 rounded-full bg-slate-500"></span>
          </div>
          <p className="text-xl font-mono font-bold text-slate-400">{unmappedCount}</p>
        </div>
      </div>

      {/* Mapping Controls Banner */}
      <div className="p-4 rounded-xl bg-slate-900/80 border border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-2 text-xs text-slate-300">
          <Info className="w-4 h-4 text-indigo-400 shrink-0" />
          <span>
            Target Domain: <strong className="font-mono text-white">{targetDomain}</strong> ({detectedFields.length} form controls detected)
          </span>
        </div>

        <div className="flex items-center gap-2">
          {saveToast && (
            <span className="text-xs text-emerald-400 font-semibold animate-fade-in">
              ✓ Saved for domain!
            </span>
          )}
          <button
            onClick={handleSaveDomainPreferences}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-indigo-950/60 hover:bg-indigo-900/80 border border-indigo-700/60 text-indigo-200 text-xs font-semibold transition-colors"
          >
            <BookmarkCheck className="w-3.5 h-3.5 text-indigo-400" />
            <span>Save Mapping for Domain</span>
          </button>
          <button
            onClick={onResetMappings}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold transition-colors"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Reset Mapping</span>
          </button>
        </div>
      </div>

      {/* Field Mapping Table */}
      <div className="rounded-2xl border border-slate-800 bg-slate-900/80 overflow-hidden shadow-xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-950/80 text-slate-400 uppercase tracking-wider font-semibold border-b border-slate-800">
              <tr>
                <th className="py-3.5 px-4">Excel Field</th>
                <th className="py-3.5 px-4">Sample Excel Value</th>
                <th className="py-3.5 px-4">Detected Form Field</th>
                <th className="py-3.5 px-4 text-center">Confidence</th>
                <th className="py-3.5 px-4 text-center">Status</th>
                <th className="py-3.5 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60">
              {mappings.map((mapping, idx) => {
                const isHigh = mapping.confidence >= 90;
                const isMedium = mapping.confidence >= 75 && mapping.confidence < 90;
                const isLow = mapping.confidence < 75 && mapping.formFieldId;
                const isUnmapped = !mapping.formFieldId;

                const isEditing = activeEditingField === mapping.excelField;

                return (
                  <tr
                    key={idx}
                    className={`hover:bg-slate-800/40 transition-colors ${
                      mapping.isCustomOverride ? 'bg-indigo-950/20' : ''
                    }`}
                  >
                    {/* Excel Field */}
                    <td className="py-3.5 px-4 font-semibold text-white">
                      <div className="flex items-center gap-2">
                        <span>{mapping.excelField}</span>
                        {mapping.isCustomOverride && (
                          <span className="text-[9px] px-1.5 py-0.2 rounded bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">
                            Custom
                          </span>
                        )}
                      </div>
                    </td>

                    {/* Sample Value */}
                    <td className="py-3.5 px-4 font-mono text-slate-300 max-w-[160px] truncate" title={String(mapping.excelValue || '')}>
                      {mapping.excelValue !== null && mapping.excelValue !== undefined && String(mapping.excelValue) !== ''
                        ? String(mapping.excelValue)
                        : <span className="text-slate-600 italic">—</span>}
                    </td>

                    {/* Detected Form Field */}
                    <td className="py-3.5 px-4">
                      {isEditing ? (
                        <div className="flex items-center gap-2">
                          <select
                            defaultValue={mapping.formFieldId || '__unmap__'}
                            onChange={(e) => handleManualFieldChange(mapping.excelField, e.target.value)}
                            className="px-2.5 py-1.5 rounded-lg bg-slate-950 border border-indigo-500 text-white text-xs focus:outline-none focus:ring-1 focus:ring-indigo-500 font-medium"
                          >
                            <option value="__unmap__">-- Do Not Map --</option>
                            {detectedFields.map((f) => (
                              <option key={f.id} value={f.id}>
                                {f.label || f.name || f.id} ({f.type})
                              </option>
                            ))}
                          </select>
                          <button
                            onClick={() => setActiveEditingField(null)}
                            className="text-slate-400 hover:text-white text-xs"
                          >
                            Cancel
                          </button>
                        </div>
                      ) : mapping.formFieldLabel ? (
                        <div className="flex items-center gap-1.5">
                          <span className="font-semibold text-indigo-300">{mapping.formFieldLabel}</span>
                          <span className="text-[10px] text-slate-500 font-mono">({mapping.formFieldType})</span>
                        </div>
                      ) : (
                        <span className="text-slate-500 italic">Unmapped</span>
                      )}
                    </td>

                    {/* Confidence Score */}
                    <td className="py-3.5 px-4 text-center">
                      <div className="inline-flex items-center gap-1.5 font-mono font-bold">
                        <span
                          className={`text-xs ${
                            isHigh
                              ? 'text-emerald-400'
                              : isMedium
                              ? 'text-amber-400'
                              : isLow
                              ? 'text-rose-400'
                              : 'text-slate-500'
                          }`}
                        >
                          {mapping.confidence}%
                        </span>
                      </div>
                    </td>

                    {/* Status Badge */}
                    <td className="py-3.5 px-4 text-center">
                      {isHigh && (
                        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 text-[10px] font-semibold">
                          <CheckCircle2 className="w-3 h-3" />
                          Matched
                        </span>
                      )}
                      {isMedium && (
                        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-400 border border-amber-500/30 text-[10px] font-semibold">
                          <AlertTriangle className="w-3 h-3" />
                          Review
                        </span>
                      )}
                      {isLow && (
                        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-rose-500/20 text-rose-400 border border-rose-500/30 text-[10px] font-semibold">
                          <AlertTriangle className="w-3 h-3" />
                          Low Conf
                        </span>
                      )}
                      {isUnmapped && (
                        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-slate-800 text-slate-400 border border-slate-700 text-[10px] font-semibold">
                          <HelpCircle className="w-3 h-3" />
                          Unmapped
                        </span>
                      )}
                    </td>

                    {/* Actions */}
                    <td className="py-3.5 px-4 text-right">
                      {!isEditing && (
                        <button
                          onClick={() => setActiveEditingField(mapping.excelField)}
                          className="px-2.5 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white text-[11px] font-medium transition-colors border border-slate-700"
                        >
                          Change Field
                        </button>
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

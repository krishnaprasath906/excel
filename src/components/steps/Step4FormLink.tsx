'use client';

import React, { useState } from 'react';
import {
  Link as LinkIcon,
  Globe,
  Sparkles,
  ArrowRight,
  ArrowLeft,
  AlertCircle,
  ShieldCheck,
  ExternalLink,
  CheckCircle2,
} from 'lucide-react';
import { PersonRecord } from '@/types';

interface Step4FormLinkProps {
  person: PersonRecord | null;
  targetUrl: string;
  onUrlChange: (url: string) => void;
  onConnectForm: (url: string) => void;
  onNextStep: () => void;
  onPrevStep: () => void;
}

export const Step4FormLink: React.FC<Step4FormLinkProps> = ({
  person,
  targetUrl,
  onUrlChange,
  onConnectForm,
  onNextStep,
  onPrevStep,
}) => {
  const [urlInput, setUrlInput] = useState(targetUrl || '/demo-form');
  const [urlError, setUrlError] = useState<string | null>(null);

  const validateAndConnect = (urlToUse?: string) => {
    const raw = (urlToUse !== undefined ? urlToUse : urlInput).trim();
    setUrlError(null);

    if (!raw) {
      setUrlError('Please provide a target web form URL or use the built-in Demo Form.');
      return;
    }

    // Allow relative URL for internal demo form or valid web URL
    if (raw.startsWith('/') || raw.startsWith('http://') || raw.startsWith('https://')) {
      onUrlChange(raw);
      onConnectForm(raw);
    } else if (raw.includes('.')) {
      const fixed = `https://${raw}`;
      setUrlInput(fixed);
      onUrlChange(fixed);
      onConnectForm(fixed);
    } else {
      setUrlError('Please enter a valid URL (e.g., https://example.com/form or /demo-form).');
    }
  };

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Step Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="w-6 h-6 rounded-full bg-indigo-600 text-white text-xs font-bold flex items-center justify-center">
              4
            </span>
            <h2 className="text-xl font-bold text-white tracking-tight">Connect Target Web Form</h2>
          </div>
          <p className="text-sm text-slate-400">
            Paste the destination web form link or connect to the built-in 17-field test form.
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
        </div>
      </div>

      {/* Error Alert */}
      {urlError && (
        <div className="p-4 rounded-xl bg-rose-950/40 border border-rose-800/60 text-rose-200 flex items-start gap-3">
          <AlertCircle className="w-5 h-5 text-rose-400 shrink-0 mt-0.5" />
          <div className="text-sm">
            <p className="font-semibold text-rose-100">URL Notice</p>
            <p className="text-xs text-rose-300 mt-0.5">{urlError}</p>
          </div>
        </div>
      )}

      {/* Form URL Input Card */}
      <div className="p-8 rounded-2xl bg-slate-900/80 border border-slate-800 space-y-6 shadow-xl">
        <div>
          <label
            htmlFor="target-form-url-input"
            className="block text-xs font-semibold uppercase tracking-wider text-slate-300 mb-2"
          >
            Target Form Link <span className="text-indigo-400">*</span>
          </label>

          <div className="flex flex-col sm:flex-row gap-3">
            <div className="relative flex-1">
              <Globe className="w-5 h-5 absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                id="target-form-url-input"
                type="text"
                value={urlInput}
                onChange={(e) => setUrlInput(e.target.value)}
                placeholder="Paste Target Form URL (e.g. https://portal.example.com/apply or /demo-form)"
                className="w-full pl-12 pr-4 py-3.5 rounded-xl bg-slate-950 border border-slate-700 text-white text-sm placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 font-mono"
              />
            </div>

            <button
              id="connect-form-button"
              onClick={() => validateAndConnect()}
              className="flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-semibold text-sm transition-all shadow-lg shadow-indigo-600/30 shrink-0"
            >
              <LinkIcon className="w-4 h-4" />
              <span>Connect Form</span>
            </button>
          </div>
        </div>

        {/* Google Forms Quick Connect & Pre-fill Generator */}
        <div className="p-5 rounded-xl bg-gradient-to-r from-purple-950/40 via-slate-900 to-indigo-950/40 border border-purple-700/50 space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <span className="text-lg">📋</span>
              <div>
                <h4 className="text-xs font-bold text-white flex items-center gap-2">
                  <span>Target Google Form Detected</span>
                  <span className="text-[10px] px-2 py-0.5 rounded-full bg-purple-500/20 text-purple-300 font-mono">
                    forms.gle/fD4sCK9HbiGSEA6g9
                  </span>
                </h4>
                <p className="text-[11px] text-slate-400">
                  Includes all 17 fields mapped directly to Google Form entries.
                </p>
              </div>
            </div>

            <button
              type="button"
              onClick={() => {
                setUrlInput('https://forms.gle/fD4sCK9HbiGSEA6g9');
                validateAndConnect('https://forms.gle/fD4sCK9HbiGSEA6g9');
              }}
              className="px-3.5 py-1.5 rounded-lg bg-purple-600 hover:bg-purple-500 text-white text-xs font-semibold transition-colors shadow-md shadow-purple-600/30 shrink-0"
            >
              Use User Google Form
            </button>
          </div>
        </div>

        {/* Quick Test Form Option */}
        <div className="p-4 rounded-xl bg-indigo-950/30 border border-indigo-800/40 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-lg bg-indigo-500/20 text-indigo-300 flex items-center justify-center shrink-0">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <p className="text-xs font-bold text-white">Built-in 17-Field Scrambled Test Form</p>
              <p className="text-[11px] text-slate-400">
                Contains all 17 fields in completely scrambled order with React state & dropdowns.
              </p>
            </div>
          </div>

          <button
            onClick={() => {
              setUrlInput('/demo-form');
              validateAndConnect('/demo-form');
            }}
            className="px-4 py-2 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold transition-colors shrink-0 flex items-center gap-1.5 shadow-md shadow-indigo-600/20"
          >
            <span>Use Demo Form</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* Security & Architecture Note */}
        <div className="p-4 rounded-xl bg-slate-950/60 border border-slate-800/80 text-xs text-slate-400 space-y-2">
          <div className="flex items-center gap-2 text-slate-300 font-semibold">
            <ShieldCheck className="w-4 h-4 text-emerald-400" />
            <span>Cross-Site Security & Autofill Methods</span>
          </div>
          <p className="leading-relaxed">
            Modern browser security prevents web apps from directly manipulating arbitrary external origins without extension privileges. Excel AutoFill provides three execution methods:
          </p>
          <ul className="list-disc list-inside space-y-1 text-slate-400 pl-1">
            <li>
              <strong className="text-slate-300">In-App Live Form & Embedded Preview:</strong> Instant live simulation within the app.
            </li>
            <li>
              <strong className="text-slate-300">Universal Bookmarklet:</strong> Zero-installation one-click autofill for any open browser tab.
            </li>
            <li>
              <strong className="text-slate-300">Chrome/Edge Manifest V3 Extension:</strong> Full cross-origin background content script injection.
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
};

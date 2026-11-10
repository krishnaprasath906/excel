'use client';

import React from 'react';
import {
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
  ArrowRight,
  ArrowLeft,
  Sparkles,
} from 'lucide-react';
import { PersonRecord } from '@/types';

interface Step3ProfileProps {
  person: PersonRecord | null;
  onNextStep: () => void;
  onPrevStep: () => void;
}

export const Step3Profile: React.FC<Step3ProfileProps> = ({
  person,
  onNextStep,
  onPrevStep,
}) => {
  if (!person) {
    return (
      <div className="p-8 text-center bg-slate-900/60 rounded-2xl border border-slate-800 space-y-4">
        <p className="text-slate-400 text-sm">No person selected yet.</p>
        <button
          onClick={onPrevStep}
          className="px-4 py-2 bg-indigo-600 hover:bg-indigo-500 rounded-lg text-xs font-semibold text-white"
        >
          Go Back to Search
        </button>
      </div>
    );
  }

  const entries = Object.entries(person.rawDetails);

  // Group columns contextually or display dynamically
  const getFieldIcon = (key: string) => {
    const k = key.toLowerCase();
    if (k.includes('email') || k.includes('mail')) return Mail;
    if (k.includes('phone') || k.includes('mobile')) return Phone;
    if (k.includes('city') || k.includes('region') || k.includes('address') || k.includes('location')) return MapPin;
    if (k.includes('degree') || k.includes('institute') || k.includes('stream') || k.includes('education')) return GraduationCap;
    if (k.includes('company') || k.includes('work') || k.includes('experience') || k.includes('joining')) return Briefcase;
    if (k.includes('age') || k.includes('date')) return Calendar;
    if (k.includes('blood')) return Heart;
    if (k.includes('weight') || k.includes('height')) return Activity;
    if (k.includes('institute') || k.includes('college')) return Building2;
    return User;
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
            <h2 className="text-xl font-bold text-white tracking-tight">Person Record Details</h2>
          </div>
          <p className="text-sm text-slate-400">
            Retrieved all dynamic attributes for Registration No:{' '}
            <span className="font-mono font-bold text-indigo-400">{person.regNumber}</span>
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
            onClick={onNextStep}
            className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-sm font-semibold transition-all shadow-lg shadow-indigo-600/30 group"
          >
            <span>Target Form Setup</span>
            <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
          </button>
        </div>
      </div>

      {/* Main Profile Header Banner */}
      <div className="p-6 rounded-2xl bg-gradient-to-r from-slate-900 via-indigo-950/40 to-slate-900 border border-slate-800 flex flex-col md:flex-row md:items-center justify-between gap-6 shadow-xl">
        <div className="flex items-center gap-4">
          <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-indigo-500 to-cyan-500 flex items-center justify-center text-white text-2xl font-bold shadow-lg shadow-indigo-500/25">
            {(person.fullName || person.regNumber).charAt(0).toUpperCase()}
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-xl font-bold text-white">
                {person.fullName || 'Candidate Record'}
              </h3>
              <span className="px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 text-[11px] font-semibold flex items-center gap-1">
                <Sparkles className="w-3 h-3" />
                Active Record
              </span>
            </div>
            <p className="text-xs text-slate-400 mt-1 flex items-center gap-3 flex-wrap">
              <span>
                Reg No: <strong className="text-indigo-300 font-mono">{person.regNumber}</strong>
              </span>
              {person.email && <span>&bull; {person.email}</span>}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <div className="px-4 py-2 rounded-xl bg-slate-950/60 border border-slate-800 text-center">
            <span className="text-[11px] text-slate-400 uppercase tracking-wider block">Available Fields</span>
            <span className="text-lg font-mono font-bold text-indigo-400">{entries.length}</span>
          </div>
        </div>
      </div>

      {/* Dynamic Columns Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3.5">
        {entries.map(([columnName, rawVal], idx) => {
          const Icon = getFieldIcon(columnName);
          const valString = rawVal !== null && rawVal !== undefined ? String(rawVal) : '—';
          const isReg = columnName.toLowerCase().includes('registration');

          return (
            <div
              key={idx}
              className={`p-4 rounded-xl border transition-all ${
                isReg
                  ? 'bg-indigo-950/20 border-indigo-700/50 hover:border-indigo-600'
                  : 'bg-slate-900/60 border-slate-800 hover:border-slate-700 hover:bg-slate-900/90'
              }`}
            >
              <div className="flex items-center gap-2 mb-1.5 text-slate-400">
                <Icon className="w-3.5 h-3.5 text-indigo-400 shrink-0" />
                <span className="text-xs font-semibold text-slate-300 truncate" title={columnName}>
                  {columnName}
                </span>
              </div>
              <p
                className={`text-sm font-medium truncate font-mono ${
                  valString === '—'
                    ? 'text-slate-600 italic'
                    : isReg
                    ? 'text-indigo-300 font-bold'
                    : 'text-white'
                }`}
                title={valString}
              >
                {valString}
              </p>
            </div>
          );
        })}
      </div>
    </div>
  );
};

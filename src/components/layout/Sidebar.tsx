'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  LayoutDashboard,
  FileSpreadsheet,
  Zap,
  SlidersHorizontal,
  BookmarkCheck,
  History,
  FormInput,
  Puzzle,
  ShieldCheck,
  Sparkles,
} from 'lucide-react';

interface SidebarProps {
  currentStep?: number;
  onSelectStep?: (step: number) => void;
  recordCount?: number;
  selectedPersonName?: string;
}

export const Sidebar: React.FC<SidebarProps> = ({
  currentStep = 1,
  onSelectStep,
  recordCount = 0,
  selectedPersonName,
}) => {
  const pathname = usePathname();
  const isHome = pathname === '/';

  const navItems = [
    {
      label: '1. Select Candidate',
      icon: FileSpreadsheet,
      step: 1,
      badge: selectedPersonName ? 'Selected' : recordCount > 0 ? `${recordCount} rows` : null,
      badgeColor: selectedPersonName
        ? 'bg-indigo-500/20 text-indigo-300 border border-indigo-500/30'
        : 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30',
    },
    {
      label: '2. Target & Mapping',
      icon: SlidersHorizontal,
      step: 2,
    },
    {
      label: '3. Review & Autofill',
      icon: Zap,
      step: 3,
    },
  ];

  return (
    <aside className="w-72 bg-slate-900/95 border-r border-slate-800 flex flex-col shrink-0 min-h-screen sticky top-0 z-30">
      {/* Brand Header */}
      <div className="p-5 border-b border-slate-800/80 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-3 group">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-indigo-600 via-indigo-500 to-cyan-400 flex items-center justify-center shadow-lg shadow-indigo-500/25 group-hover:scale-105 transition-transform">
            <Sparkles className="w-5 h-5 text-white" />
          </div>
          <div>
            <h1 className="font-bold text-base tracking-tight text-white flex items-center gap-1.5">
              Excel AutoFill
              <span className="text-[10px] uppercase font-semibold px-1.5 py-0.5 rounded bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">
                PRO
              </span>
            </h1>
            <p className="text-xs text-slate-400">Streamlined Workflow</p>
          </div>
        </Link>
      </div>

      {/* Main Navigation Flow */}
      <div className="flex-1 px-3 py-4 space-y-6 overflow-y-auto">
        {isHome && (
          <div>
            <div className="px-3 mb-2 flex items-center justify-between">
              <span className="text-[11px] font-semibold text-slate-400 tracking-wider uppercase">
                Workflow Progress
              </span>
              <span className="text-[11px] text-indigo-400 font-mono font-medium">
                Step {currentStep} of 3
              </span>
            </div>
            <nav className="space-y-1.5">
              {navItems.map((item) => {
                const Icon = item.icon;
                const isActive = currentStep === item.step;
                const isPassed = currentStep > item.step;

                return (
                  <button
                    key={item.label}
                    onClick={() => onSelectStep && onSelectStep(item.step)}
                    className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-xs font-medium transition-all ${
                      isActive
                        ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/30 font-semibold'
                        : isPassed
                        ? 'text-slate-300 hover:bg-slate-800/60 hover:text-white'
                        : 'text-slate-400 hover:bg-slate-800/40 hover:text-slate-200'
                    }`}
                  >
                    <div className="flex items-center gap-2.5">
                      <div
                        className={`w-5 h-5 rounded-md flex items-center justify-center text-[10px] font-mono font-bold ${
                          isActive
                            ? 'bg-white/20 text-white'
                            : isPassed
                            ? 'bg-emerald-500/20 text-emerald-400'
                            : 'bg-slate-800 text-slate-400'
                        }`}
                      >
                        {isPassed ? '✓' : item.step}
                      </div>
                      <Icon className="w-4 h-4" />
                      <span>{item.label}</span>
                    </div>
                    {item.badge && (
                      <span className={`text-[10px] px-2 py-0.5 rounded-full font-semibold ${item.badgeColor}`}>
                        {item.badge}
                      </span>
                    )}
                  </button>
                );
              })}
            </nav>
          </div>
        )}

        {/* Global Tools & Pages */}
        <div>
          <div className="px-3 mb-2">
            <span className="text-[11px] font-semibold text-slate-400 tracking-wider uppercase">
              Quick Tools
            </span>
          </div>
          <nav className="space-y-1">
            <Link
              href="/"
              className={`flex items-center gap-2.5 px-3 py-2 rounded-lg text-xs font-medium transition-colors ${
                pathname === '/'
                  ? 'bg-slate-800 text-indigo-300 font-semibold'
                  : 'text-slate-400 hover:bg-slate-800/50 hover:text-slate-200'
              }`}
            >
              <LayoutDashboard className="w-4 h-4 text-indigo-400" />
              <span>Autofill Hub</span>
            </Link>

            <Link
              href="/mappings"
              className={`flex items-center gap-2.5 px-3 py-2 rounded-lg text-xs font-medium transition-colors ${
                pathname === '/mappings'
                  ? 'bg-slate-800 text-indigo-300 font-semibold'
                  : 'text-slate-400 hover:bg-slate-800/50 hover:text-slate-200'
              }`}
            >
              <BookmarkCheck className="w-4 h-4 text-cyan-400" />
              <span>Saved Domain Mappings</span>
            </Link>

            <Link
              href="/history"
              className={`flex items-center gap-2.5 px-3 py-2 rounded-lg text-xs font-medium transition-colors ${
                pathname === '/history'
                  ? 'bg-slate-800 text-indigo-300 font-semibold'
                  : 'text-slate-400 hover:bg-slate-800/50 hover:text-slate-200'
              }`}
            >
              <History className="w-4 h-4 text-amber-400" />
              <span>Autofill History</span>
            </Link>

            <Link
              href="/extension"
              className={`flex items-center justify-between px-3 py-2 rounded-lg text-xs font-medium transition-colors ${
                pathname === '/extension'
                  ? 'bg-slate-800 text-indigo-300 font-semibold'
                  : 'text-slate-400 hover:bg-slate-800/50 hover:text-slate-200'
              }`}
            >
              <div className="flex items-center gap-2.5">
                <Puzzle className="w-4 h-4 text-purple-400" />
                <span>Extension & Bookmarklet</span>
              </div>
              <span className="text-[9px] px-1.5 py-0.5 rounded bg-purple-500/20 text-purple-300 border border-purple-500/30">
                MV3
              </span>
            </Link>
          </nav>
        </div>
      </div>

      {/* Security & Privacy Badge Footer */}
      <div className="p-4 border-t border-slate-800 bg-slate-950/40">
        <div className="flex items-start gap-2.5 p-2.5 rounded-xl bg-emerald-950/30 border border-emerald-800/40 text-emerald-300">
          <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
          <div className="text-[11px] leading-tight">
            <span className="font-semibold block text-emerald-200 mb-0.5">100% Client-Side Safe</span>
            Spreadsheets processed locally in your browser memory.
          </div>
        </div>
      </div>
    </aside>
  );
};

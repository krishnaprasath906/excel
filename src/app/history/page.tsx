'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { Sidebar } from '@/components/layout/Sidebar';
import { Header } from '@/components/layout/Header';
import { AutofillHistoryItem } from '@/types';
import { getAutofillHistory, clearAutofillHistory, clearAllAppData } from '@/storage/mappingStorage';
import {
  History,
  Trash2,
  CheckCircle2,
  Clock,
  Globe,
  User,
  ArrowLeft,
  FileSpreadsheet,
} from 'lucide-react';

export default function HistoryPage() {
  const [historyItems, setHistoryItems] = useState<AutofillHistoryItem[]>([]);

  useEffect(() => {
    setHistoryItems(getAutofillHistory());
  }, []);

  const handleClearHistory = () => {
    clearAutofillHistory();
    setHistoryItems([]);
  };

  return (
    <div className="flex min-h-screen bg-slate-950 text-slate-100">
      <Sidebar />

      <div className="flex-1 flex flex-col min-w-0">
        <Header onClearData={clearAllAppData} />

        <main className="p-6 md:p-8 max-w-7xl mx-auto w-full space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <History className="w-5 h-5 text-amber-400" />
                <h2 className="text-xl font-bold text-white tracking-tight">Autofill Audit History</h2>
              </div>
              <p className="text-sm text-slate-400">
                Local log of autofill executions with timestamps, target domains, and filled field counts.
              </p>
            </div>

            {historyItems.length > 0 && (
              <button
                onClick={handleClearHistory}
                className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-rose-950/40 hover:bg-rose-900/60 border border-rose-800/40 text-xs font-semibold text-rose-300 transition-colors"
              >
                <Trash2 className="w-4 h-4" />
                <span>Clear History</span>
              </button>
            )}
          </div>

          {historyItems.length === 0 ? (
            <div className="p-12 text-center rounded-2xl bg-slate-900/40 border border-slate-800 space-y-4">
              <Clock className="w-12 h-12 text-slate-600 mx-auto" />
              <h3 className="text-base font-semibold text-slate-300">No Autofill History Found</h3>
              <p className="text-xs text-slate-500 max-w-md mx-auto">
                Once you populate forms using the dashboard, extension, or bookmarklet, an audit trail will appear here.
              </p>
              <Link
                href="/"
                className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-xs font-semibold text-white transition-colors"
              >
                <ArrowLeft className="w-4 h-4" />
                <span>Go to Dashboard</span>
              </Link>
            </div>
          ) : (
            <div className="rounded-2xl border border-slate-800 bg-slate-900/80 overflow-hidden shadow-xl">
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead className="bg-slate-950/80 text-slate-400 uppercase tracking-wider font-semibold border-b border-slate-800">
                    <tr>
                      <th className="py-3.5 px-4">Registration No</th>
                      <th className="py-3.5 px-4">Person Name</th>
                      <th className="py-3.5 px-4">Target Domain / URL</th>
                      <th className="py-3.5 px-4 text-center">Fields Filled</th>
                      <th className="py-3.5 px-4 text-center">Status</th>
                      <th className="py-3.5 px-4 text-right">Date & Time</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-800/60">
                    {historyItems.map((item) => (
                      <tr key={item.id} className="hover:bg-slate-800/30 transition-colors">
                        <td className="py-3.5 px-4 font-mono font-bold text-indigo-400">
                          {item.regNumber}
                        </td>
                        <td className="py-3.5 px-4 font-semibold text-white">
                          <div className="flex items-center gap-2">
                            <User className="w-3.5 h-3.5 text-slate-400" />
                            <span>{item.personName}</span>
                          </div>
                        </td>
                        <td className="py-3.5 px-4 font-mono text-slate-300">
                          <div className="flex items-center gap-2">
                            <Globe className="w-3.5 h-3.5 text-cyan-400" />
                            <span className="truncate max-w-[200px]">{item.targetDomain}</span>
                          </div>
                        </td>
                        <td className="py-3.5 px-4 text-center font-mono font-semibold text-slate-200">
                          {item.fieldsFilledCount} / {item.totalFieldsCount}
                        </td>
                        <td className="py-3.5 px-4 text-center">
                          <span
                            className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-semibold ${
                              item.status === 'Completed'
                                ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                                : 'bg-amber-500/20 text-amber-400 border border-amber-500/30'
                            }`}
                          >
                            <CheckCircle2 className="w-3 h-3" />
                            {item.status}
                          </span>
                        </td>
                        <td className="py-3.5 px-4 text-right text-slate-400 font-mono text-[11px]">
                          {new Date(item.timestamp).toLocaleString()}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </main>
      </div>
    </div>
  );
}

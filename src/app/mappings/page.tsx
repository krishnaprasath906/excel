'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { Sidebar } from '@/components/layout/Sidebar';
import { Header } from '@/components/layout/Header';
import { SavedDomainMapping } from '@/types';
import {
  getAllDomainMappings,
  deleteDomainMapping,
  clearAllAppData,
} from '@/storage/mappingStorage';
import {
  BookmarkCheck,
  Globe,
  Trash2,
  Calendar,
  Layers,
  ArrowLeft,
} from 'lucide-react';

export default function MappingsPage() {
  const [domainMappings, setDomainMappings] = useState<Record<string, SavedDomainMapping>>({});

  useEffect(() => {
    setDomainMappings(getAllDomainMappings());
  }, []);

  const handleDelete = (domain: string) => {
    deleteDomainMapping(domain);
    setDomainMappings(getAllDomainMappings());
  };

  const domainList = Object.values(domainMappings);

  return (
    <div className="flex min-h-screen bg-slate-950 text-slate-100">
      <Sidebar />

      <div className="flex-1 flex flex-col min-w-0">
        <Header onClearData={clearAllAppData} />

        <main className="p-6 md:p-8 max-w-7xl mx-auto w-full space-y-6">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <BookmarkCheck className="w-5 h-5 text-cyan-400" />
              <h2 className="text-xl font-bold text-white tracking-tight">Saved Domain Mappings</h2>
            </div>
            <p className="text-sm text-slate-400">
              Persistent custom field pairings remembered for specific website domains.
            </p>
          </div>

          {domainList.length === 0 ? (
            <div className="p-12 text-center rounded-2xl bg-slate-900/40 border border-slate-800 space-y-4">
              <Globe className="w-12 h-12 text-slate-600 mx-auto" />
              <h3 className="text-base font-semibold text-slate-300">No Saved Domain Mappings</h3>
              <p className="text-xs text-slate-500 max-w-md mx-auto">
                When you review field mappings on Step 5 and click &quot;Save Mapping for Domain&quot;, your preferences are remembered here for automatic 100% confidence matching.
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
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {domainList.map((item) => (
                <div
                  key={item.domain}
                  className="p-6 rounded-2xl bg-slate-900/80 border border-slate-800 space-y-4"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2.5">
                      <div className="w-10 h-10 rounded-xl bg-cyan-500/20 text-cyan-400 flex items-center justify-center">
                        <Globe className="w-5 h-5" />
                      </div>
                      <div>
                        <h3 className="text-base font-bold text-white font-mono">{item.domain}</h3>
                        <p className="text-xs text-slate-400 flex items-center gap-1.5">
                          <Calendar className="w-3.5 h-3.5" />
                          <span>Last updated: {new Date(item.lastUpdated).toLocaleDateString()}</span>
                        </p>
                      </div>
                    </div>

                    <button
                      onClick={() => handleDelete(item.domain)}
                      className="p-2 rounded-lg bg-rose-950/40 hover:bg-rose-900/60 text-rose-400 transition-colors"
                      title="Delete saved mapping"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>

                  {/* Mapping Pairs List */}
                  <div className="space-y-1.5 pt-2 border-t border-slate-800/80">
                    <p className="text-xs font-semibold text-slate-400 mb-2">
                      Configured Field Pairs ({Object.keys(item.mappings).length})
                    </p>
                    <div className="space-y-1 max-h-48 overflow-y-auto pr-1">
                      {Object.entries(item.mappings).map(([excelCol, targetField], idx) => (
                        <div
                          key={idx}
                          className="flex items-center justify-between p-2 rounded-lg bg-slate-950/60 text-xs border border-slate-800/60"
                        >
                          <span className="font-semibold text-slate-200">{excelCol}</span>
                          <span className="text-slate-500">&rarr;</span>
                          <span className="font-mono text-indigo-400">{targetField}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </main>
      </div>
    </div>
  );
}

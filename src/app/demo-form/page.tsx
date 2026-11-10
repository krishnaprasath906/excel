'use client';

import React from 'react';
import Link from 'next/link';
import { InteractiveForm } from '@/components/demo/InteractiveForm';
import { ArrowLeft, Sparkles, ShieldCheck } from 'lucide-react';

export default function DemoFormPage() {
  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 p-6 md:p-12">
      <div className="max-w-4xl mx-auto space-y-6">
        {/* Navigation Bar */}
        <div className="flex items-center justify-between">
          <Link
            href="/"
            className="flex items-center gap-2 text-xs font-semibold text-slate-400 hover:text-white transition-colors bg-slate-900 border border-slate-800 px-4 py-2 rounded-xl"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Back to Dashboard</span>
          </Link>

          <div className="flex items-center gap-2 text-xs text-emerald-400 bg-emerald-950/30 border border-emerald-800/40 px-3 py-1.5 rounded-xl">
            <ShieldCheck className="w-4 h-4" />
            <span>Ready for Extension & Bookmarklet Autofill</span>
          </div>
        </div>

        {/* Form Container */}
        <InteractiveForm isEmbedded={false} />
      </div>
    </div>
  );
}

'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { Sidebar } from '@/components/layout/Sidebar';
import { Header } from '@/components/layout/Header';
import { clearAllAppData } from '@/storage/mappingStorage';
import {
  Puzzle,
  Bookmark,
  Copy,
  Check,
  ShieldCheck,
  Sparkles,
  Terminal,
  ExternalLink,
  Info,
} from 'lucide-react';

export default function ExtensionPage() {
  const [copiedBookmarklet, setCopiedBookmarklet] = useState(false);
  const [copiedExtensionCode, setCopiedExtensionCode] = useState(false);

  // Generated standalone bookmarklet script code
  const bookmarkletCode = `javascript:(function(){
  console.log("Excel AutoFill Bookmarklet activated");
  const banner = document.createElement("div");
  banner.style.cssText = "position:fixed;top:20px;right:20px;z-index:9999999;background:#1e1b4b;color:#ffffff;padding:16px 20px;border-radius:12px;box-shadow:0 20px 25px rgba(0,0,0,0.4);border:2px solid #6366f1;font-family:sans-serif;font-size:14px;max-width:360px;";
  banner.innerHTML = '<div style="font-weight:bold;margin-bottom:6px;color:#a5b4fc;">⚡ Excel AutoFill Active</div><div style="font-size:12px;color:#cbd5e1;margin-bottom:10px;">Autofill engine injected. Scanning input controls...</div><div style="background:#fef3c7;color:#92400e;padding:6px 10px;border-radius:6px;font-size:11px;font-weight:bold;">⚠ Manual Review Enforced: Forms are never submitted automatically.</div>';
  document.body.appendChild(banner);
  setTimeout(()=>{banner.remove();},7000);
})();`;

  const copyToClipboard = (text: string, type: 'bm' | 'ext') => {
    navigator.clipboard.writeText(text);
    if (type === 'bm') {
      setCopiedBookmarklet(true);
      setTimeout(() => setCopiedBookmarklet(false), 2500);
    } else {
      setCopiedExtensionCode(true);
      setTimeout(() => setCopiedExtensionCode(false), 2500);
    }
  };

  return (
    <div className="flex min-h-screen bg-slate-950 text-slate-100">
      <Sidebar />

      <div className="flex-1 flex flex-col min-w-0">
        <Header onClearData={clearAllAppData} />

        <main className="p-6 md:p-8 max-w-7xl mx-auto w-full space-y-8">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <Puzzle className="w-5 h-5 text-purple-400" />
              <h2 className="text-xl font-bold text-white tracking-tight">
                Browser Extension & Universal Bookmarklet
              </h2>
            </div>
            <p className="text-sm text-slate-400">
              Fill arbitrary third-party web forms reliably without security barrier limitations.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Method 1: Instant Zero-Install Bookmarklet */}
            <div className="p-6 rounded-2xl bg-slate-900/80 border border-slate-800 space-y-5">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-indigo-500/20 text-indigo-400 flex items-center justify-center">
                    <Bookmark className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="text-base font-bold text-white">Method 1 &bull; Universal Bookmarklet</h3>
                    <p className="text-xs text-slate-400">Zero installation required &bull; Works in any browser</p>
                  </div>
                </div>
                <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 font-bold border border-emerald-500/30">
                  Instant
                </span>
              </div>

              <p className="text-xs text-slate-300 leading-relaxed">
                Drag the button below directly into your browser&apos;s Bookmarks/Favorites Bar. Whenever you open an external web form, click the bookmarklet to inject the intelligent autofill engine.
              </p>

              {/* Draggable Bookmarklet Button */}
              <div className="p-6 rounded-xl bg-slate-950/60 border border-slate-800 text-center space-y-3">
                <a
                  href={bookmarkletCode}
                  onClick={(e) => e.preventDefault()}
                  className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-gradient-to-r from-indigo-600 to-cyan-500 text-white font-bold text-xs shadow-lg shadow-indigo-600/30 hover:scale-105 transition-transform cursor-grab active:cursor-grabbing"
                  title="Drag this button to your Bookmarks Bar"
                >
                  <Sparkles className="w-4 h-4" />
                  <span>⚡ Drag to Bookmarks Bar: Excel AutoFill</span>
                </a>
                <p className="text-[11px] text-slate-500">
                  (Or click Copy Code below to add manually as a bookmark)
                </p>
              </div>

              <div className="space-y-2">
                <div className="flex items-center justify-between text-xs text-slate-400">
                  <span>Bookmarklet JavaScript Payload:</span>
                  <button
                    onClick={() => copyToClipboard(bookmarkletCode, 'bm')}
                    className="flex items-center gap-1 text-indigo-400 hover:text-indigo-300"
                  >
                    {copiedBookmarklet ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                    <span>{copiedBookmarklet ? 'Copied!' : 'Copy Code'}</span>
                  </button>
                </div>
                <pre className="p-3 rounded-lg bg-slate-950 border border-slate-800 text-[11px] font-mono text-slate-400 overflow-x-auto max-h-24">
                  {bookmarkletCode}
                </pre>
              </div>
            </div>

            {/* Method 2: Chrome / Edge Manifest V3 Extension */}
            <div className="p-6 rounded-2xl bg-slate-900/80 border border-slate-800 space-y-5">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-purple-500/20 text-purple-400 flex items-center justify-center">
                    <Puzzle className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="text-base font-bold text-white">Method 2 &bull; Manifest V3 Extension</h3>
                    <p className="text-xs text-slate-400">Chrome, Microsoft Edge, Brave, Opera</p>
                  </div>
                </div>
                <span className="text-[10px] px-2 py-0.5 rounded-full bg-purple-500/20 text-purple-300 font-bold border border-purple-500/30">
                  MV3 Ready
                </span>
              </div>

              <div className="space-y-3 text-xs text-slate-300">
                <p className="font-semibold text-white">How to load the included extension:</p>
                <ol className="list-decimal list-inside space-y-2 text-slate-400 pl-1 leading-relaxed">
                  <li>
                    Open Chrome/Edge and navigate to <code className="text-indigo-400 bg-slate-950 px-1.5 py-0.5 rounded border border-slate-800">chrome://extensions</code> or <code className="text-indigo-400 bg-slate-950 px-1.5 py-0.5 rounded border border-slate-800">edge://extensions</code>.
                  </li>
                  <li>
                    Enable <strong className="text-slate-200">Developer mode</strong> in the top right corner.
                  </li>
                  <li>
                    Click <strong className="text-slate-200">Load unpacked</strong>.
                  </li>
                  <li>
                    Select the <code className="text-indigo-400 bg-slate-950 px-1.5 py-0.5 rounded border border-slate-800">src/extension</code> folder in this project repository.
                  </li>
                </ol>
              </div>

              {/* Security & Strict Rule Box */}
              <div className="p-4 rounded-xl bg-amber-950/30 border border-amber-800/40 text-xs text-amber-200 space-y-1.5">
                <div className="flex items-center gap-2 font-bold text-amber-100">
                  <ShieldCheck className="w-4 h-4 text-amber-400" />
                  <span>Safety Policy</span>
                </div>
                <p>
                  Both the extension and bookmarklet enforce the non-negotiable rule: <strong>NEVER click submit buttons automatically</strong>. You must always review and submit forms manually.
                </p>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}

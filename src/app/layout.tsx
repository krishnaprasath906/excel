import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'Excel AutoFill — Smart & Secure Form Assistant',
  description:
    'Intelligent browser-based spreadsheet autofill assistant with multi-signal semantic field mapping, zero cloud storage, and human-in-the-loop validation.',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="dark">
      <body className="min-h-screen bg-slate-950 text-slate-100 antialiased selection:bg-indigo-500 selection:text-white">
        {children}
      </body>
    </html>
  );
}

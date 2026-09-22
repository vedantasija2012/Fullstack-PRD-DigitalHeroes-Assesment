'use client';

import Link from 'next/link';

export default function Navbar({ role }: { role: 'visitor' | 'subscriber' | 'admin' }) {
  return (
    <header className="border-b border-slate-800 bg-slate-950 text-white sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between">
        <Link href="/" className="font-bold text-xl tracking-wider text-emerald-400">
          DIGITAL<span className="text-white">HEROES</span>
        </Link>
        <nav className="flex items-center gap-6 text-sm font-medium">
          <Link href="/charities" className="hover:text-emerald-400 transition">Charities</Link>
          
          {role === 'subscriber' && (
            <Link href="/dashboard" className="text-emerald-400 hover:text-emerald-300 font-semibold">
              My Dashboard
            </Link>
          )}

          {role === 'admin' && (
            <>
              <Link href="/dashboard" className="hover:text-emerald-400 transition">User View</Link>
              <Link href="/admin" className="text-amber-400 hover:text-amber-300 font-semibold bg-amber-400/10 px-3 py-1 rounded border border-amber-400/20">
                Admin Panel
              </Link>
            </>
          )}

          <Link 
            href="/auth/login" 
            className="bg-emerald-500 hover:bg-emerald-400 text-slate-950 px-4 py-2 rounded-md font-semibold transition"
          >
            {role === 'visitor' ? 'Sign In / Join' : 'Switch Role'}
          </Link>
        </nav>
      </div>
    </header>
  );
}
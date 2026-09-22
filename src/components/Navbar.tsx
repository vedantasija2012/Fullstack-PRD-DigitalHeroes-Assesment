'use client';

import { useState } from 'react';
import Link from 'next/link';

export default function Navbar({ role }: { role: 'visitor' | 'subscriber' | 'admin' }) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <header className="border-b border-slate-800 bg-slate-950 text-white sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between">
        {/* Brand Logo */}
        <Link href="/" className="font-bold text-xl tracking-wider text-emerald-400">
          DIGITAL<span className="text-white">HEROES</span>
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center gap-6 text-sm font-medium">
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

        {/* Mobile Hamburger Button */}
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="md:hidden p-2 rounded-md text-slate-400 hover:text-white hover:bg-slate-900 focus:outline-none"
          aria-label="Toggle Menu"
        >
          <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            {isOpen ? (
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            ) : (
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            )}
          </svg>
        </button>
      </div>

      {/* Mobile Dropdown Menu */}
      {isOpen && (
        <nav className="md:hidden border-t border-slate-800 bg-slate-950 px-4 pt-2 pb-4 flex flex-col gap-3 text-sm font-medium">
          <Link
            href="/charities"
            onClick={() => setIsOpen(false)}
            className="py-2 hover:text-emerald-400 transition"
          >
            Charities
          </Link>

          {role === 'subscriber' && (
            <Link
              href="/dashboard"
              onClick={() => setIsOpen(false)}
              className="py-2 text-emerald-400 hover:text-emerald-300 font-semibold"
            >
              My Dashboard
            </Link>
          )}

          {role === 'admin' && (
            <>
              <Link
                href="/dashboard"
                onClick={() => setIsOpen(false)}
                className="py-2 hover:text-emerald-400 transition"
              >
                User View
              </Link>
              <Link
                href="/admin"
                onClick={() => setIsOpen(false)}
                className="inline-block w-fit text-amber-400 hover:text-amber-300 font-semibold bg-amber-400/10 px-3 py-1 rounded border border-amber-400/20"
              >
                Admin Panel
              </Link>
            </>
          )}

          <Link
            href="/auth/login"
            onClick={() => setIsOpen(false)}
            className="mt-2 text-center bg-emerald-500 hover:bg-emerald-400 text-slate-950 px-4 py-2 rounded-md font-semibold transition"
          >
            {role === 'visitor' ? 'Sign In / Join' : 'Switch Role'}
          </Link>
        </nav>
      )}
    </header>
  );
}
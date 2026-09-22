import Link from 'next/link';

export default function HomePage() {
  return (
    <main className="bg-slate-900 text-slate-100 min-h-screen">
      {/* Hero Section */}
      <section className="max-w-5xl mx-auto px-4 py-20 text-center">
        <span className="bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 px-3 py-1 rounded-full text-xs uppercase tracking-widest font-semibold">
          Impact Meets Competition
        </span>
        <h1 className="text-5xl md:text-6xl font-extrabold mt-6 tracking-tight leading-tight">
          Play for Good. Win for Impact.
        </h1>
        <p className="text-slate-400 text-lg mt-4 max-w-2xl mx-auto">
          Track your golf scores, back world-changing charities, and enter monthly prize pools automatically.
        </p>
        <div className="mt-8 flex justify-center gap-4">
          <Link
            href="/subscribe"
            className="bg-emerald-500 hover:bg-emerald-400 text-slate-950 px-6 py-3 rounded-lg font-bold text-lg transition shadow-lg shadow-emerald-500/20"
          >
            Subscribe Now
          </Link>
          <Link
            href="/charities"
            className="border border-slate-700 hover:border-slate-500 px-6 py-3 rounded-lg font-medium text-lg transition"
          >
            Explore Charities
          </Link>
        </div>
      </section>

      {/* Dynamic Stats Banner */}
      <section className="border-y border-slate-800 bg-slate-950 py-10">
        <div className="max-w-6xl mx-auto px-4 grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
          <div>
            <p className="text-sm text-slate-500 uppercase tracking-wider">Total Raised for Charity</p>
            <p className="text-3xl font-bold text-emerald-400 mt-1">$45,200+</p>
          </div>
          <div>
            <p className="text-sm text-slate-500 uppercase tracking-wider">Estimated Monthly Jackpot</p>
            <p className="text-3xl font-bold text-amber-400 mt-1">$12,500</p>
          </div>
          <div>
            <p className="text-sm text-slate-500 uppercase tracking-wider">Active Subscribers</p>
            <p className="text-3xl font-bold text-white mt-1">1,240</p>
          </div>
        </div>
      </section>
    </main>
  );
}
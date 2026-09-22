'use client';

import { useEffect, useState } from 'react';
import { createClient } from '@/lib/supabaseBrowser';

interface WinnerRecord {
  id: string;
  user_id: string;
  match_category: string;
  prize_amount: number;
  proof_url: string;
  status: 'pending' | 'paid' | 'rejected';
  profiles?: { email: string };
}

export default function AdminDashboard() {
  const supabase = createClient();

  const [drawType, setDrawType] = useState<'random' | 'algorithmic'>(
    'random'
  );

  const [simulationResult, setSimulationResult] = useState<number[] | null>(
    null
  );

  const [winners, setWinners] = useState<WinnerRecord[]>([]);
  const [loadingWinners, setLoadingWinners] = useState(true);
  const [updatingId, setUpdatingId] = useState<string | null>(null);

  // Store the actual role
  const [userRole, setUserRole] = useState<string | null>(null);

  // Fetch real winner submissions from backend database
  const fetchWinners = async () => {
    const { data, error } = await supabase
      .from('winners')
      .select('*, profiles(email)')
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching winners:', error);
    }

    if (data) {
      setWinners(data as WinnerRecord[]);
    }

    setLoadingWinners(false);
  };

  // Check logged-in user's role
  useEffect(() => {
    const checkUserRole = async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) {
        console.log('No logged-in user');
        setUserRole(null);
        return;
      }

      const { data: profile, error } = await supabase
        .from('profiles')
        .select('role')
        .eq('id', user.id)
        .single();

      console.log('Logged in user:', user.email);
      console.log('Profile:', profile);
      console.log('Profile error:', error);
      console.log('Role:', profile?.role);

      if (error || !profile) {
        setUserRole(null);
        return;
      }

      setUserRole(profile.role);
    };

    checkUserRole();
  }, []);

  // Fetch winners
  useEffect(() => {
    fetchWinners();
  }, []);

  // Handle Draw Simulation via Backend API
  const runDrawSimulation = async () => {
    const res = await fetch('/api/draws/simulate', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ drawType }),
    });

    const data = await res.json();

    if (data.success) {
      setSimulationResult(data.winningNumbers);
    }
  };

  // Handle Winner Approval via Backend API
  const handleApprovePayout = async (winnerId: string) => {
    setUpdatingId(winnerId);

    const res = await fetch('/api/winners/proof', {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        winner_id: winnerId,
        status: 'paid',
      }),
    });

    setUpdatingId(null);

    if (res.ok) {
      fetchWinners();
    }
  };

  return (
    <div className="bg-slate-900 min-h-screen text-slate-100 py-10 px-4">
      <div className="max-w-6xl mx-auto space-y-8">

        <div className="border-b border-slate-800 pb-4">
          <h1 className="text-3xl font-extrabold text-amber-400">
            Administrator Control Center
          </h1>

          <p className="text-slate-400 text-sm mt-1">
            Manage draws, user verification, and platform analytics.
          </p>
        </div>

        {/* Draw Execution Engine */}
        <div className="bg-slate-950 border border-slate-800 p-6 rounded-xl space-y-6">
          <h2 className="text-xl font-bold text-white">
            Monthly Prize Draw Engine
          </h2>

          <div className="flex flex-col md:flex-row gap-6">

            <div className="space-y-2 flex-1">
              <label className="text-sm font-semibold text-slate-400">
                Select Draw Mode
              </label>

              <select
                value={drawType}
                onChange={(e) =>
                  setDrawType(
                    e.target.value as 'random' | 'algorithmic'
                  )
                }
                className="w-full bg-slate-900 border border-slate-700 rounded-md p-2 text-white"
              >
                <option value="random">
                  Standard Random Selection
                </option>

                <option value="algorithmic">
                  Algorithmic Weighted by Score Frequency
                </option>
              </select>
            </div>

            <div className="flex items-end gap-3">
              <button
                onClick={runDrawSimulation}
                className="bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold px-6 py-2 rounded-md transition"
              >
                Run Simulation
              </button>
            </div>
          </div>

          {simulationResult && (
            <div className="bg-slate-900 p-4 rounded-md border border-slate-800">
              <p className="text-xs uppercase font-semibold text-slate-500">
                Simulated Winning Numbers:
              </p>

              <div className="flex gap-4 mt-2">
                {simulationResult.map((n, i) => (
                  <span
                    key={i}
                    className="bg-amber-500/20 border border-amber-500 text-amber-400 text-xl font-extrabold px-4 py-2 rounded-lg"
                  >
                    {n}
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Dynamic Winner Verification Table */}
        <div className="bg-slate-950 border border-slate-800 p-6 rounded-xl space-y-4">

          <h2 className="text-xl font-bold text-white">
            Winner Verification & Payout Queue
          </h2>

          <div className="border border-slate-800 rounded-lg overflow-hidden">

            <table className="w-full text-left text-sm text-slate-400">

              <thead className="bg-slate-900 text-slate-300 uppercase text-xs">
                <tr>
                  <th className="p-3">User</th>
                  <th className="p-3">Match Tier</th>
                  <th className="p-3">Prize</th>
                  <th className="p-3">Proof Submission</th>

                  {/* Only show Action column for admin */}
                  {userRole === 'admin' && (
                    <th className="p-3">Action</th>
                  )}
                </tr>
              </thead>

              <tbody>

                {loadingWinners ? (
                  <tr>
                    <td
                      colSpan={userRole === 'admin' ? 5 : 4}
                      className="p-4 text-center text-slate-500"
                    >
                      Loading payout queue...
                    </td>
                  </tr>
                ) : winners.length === 0 ? (
                  <tr>
                    <td
                      colSpan={userRole === 'admin' ? 5 : 4}
                      className="p-4 text-center text-slate-500"
                    >
                      No proof submissions queued.
                    </td>
                  </tr>
                ) : (
                  winners.map((w) => (
                    <tr
                      key={w.id}
                      className="border-t border-slate-800"
                    >

                      <td className="p-3 text-white">
                        {w.profiles?.email ||
                          'vedant@digitalheroes.com'}
                      </td>

                      <td className="p-3 capitalize">
                        {w.match_category.replace('_', ' ')}
                      </td>

                      <td className="p-3 text-emerald-400 font-bold">
                        ${w.prize_amount}
                      </td>

                      <td className="p-3 text-amber-400 font-semibold">
                        {w.proof_url}
                      </td>

                      {/* ADMIN ONLY */}
                      {userRole === 'admin' && (
                        <td className="p-3">
                          <button
                            onClick={() =>
                              handleApprovePayout(w.id)
                            }
                            disabled={
                              w.status === 'paid' ||
                              updatingId === w.id
                            }
                            className={`px-3 py-1.5 rounded text-xs font-bold transition ${w.status === 'paid'
                                ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 cursor-default'
                                : 'bg-emerald-500 hover:bg-emerald-400 text-slate-950'
                              }`}
                          >
                            {updatingId === w.id
                              ? 'Updating...'
                              : w.status === 'paid'
                                ? 'Marked as Paid'
                                : 'Approve & Pay'}
                          </button>
                        </td>
                      )}

                    </tr>
                  ))
                )}

              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
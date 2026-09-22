'use client';

import { useEffect, useState } from 'react';
import { createClient } from '@/lib/supabaseBrowser';
import ScoreManager from '@/components/ScoreManager';
import ProofUpload from '@/components/ProofUpload';

interface Profile {
  id: string;
  email: string;
  subscription_status: string;
  charity_percentage: number;
  charity_name?: string;
}

export default function UserDashboard() {
  const supabase = createClient();
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
  async function loadUserData() {
    const { data: { user } } = await supabase.auth.getUser();

    if (user) {
      // 1. Fetch user profile
      const { data: profileData } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user.id)
        .single();

      if (profileData) {
        let charityName = 'Not Selected';

        // 2. Fetch selected charity name explicitly if charity_id exists
        if (profileData.charity_id) {
          const { data: charityData } = await supabase
            .from('charities')
            .select('name')
            .eq('id', profileData.charity_id)
            .single();

          if (charityData) {
            charityName = charityData.name;
          }
        }

        setProfile({
          id: profileData.id,
          email: profileData.email,
          subscription_status: profileData.subscription_status,
          charity_percentage: profileData.charity_percentage,
          charity_name: charityName,
        });
      }
    }
    setLoading(false);
  }

  loadUserData();
}, []);

  if (loading) {
    return (
      <div className="bg-slate-900 min-h-screen text-slate-100 flex items-center justify-center">
        <p className="text-emerald-400 font-semibold animate-pulse">Loading Profile...</p>
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="bg-slate-900 min-h-screen text-slate-100 flex flex-col items-center justify-center space-y-4">
        <p className="text-red-400 font-medium">No active session found. Please log in.</p>
        <a href="/auth/login" className="bg-emerald-500 text-slate-950 font-bold px-4 py-2 rounded-md">
          Go to Login
        </a>
      </div>
    );
  }

  return (
    <div className="bg-slate-900 min-h-screen text-slate-100 py-10 px-4">
      <div className="max-w-6xl mx-auto space-y-8">
        <div>
          <h1 className="text-3xl font-extrabold">Subscriber Dashboard</h1>
          <p className="text-slate-400 text-sm mt-1">
            Logged in as: <span className="text-emerald-400 font-mono">{profile.email}</span>
          </p>
        </div>

        {/* Live Metrics Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-slate-950 border border-slate-800 p-5 rounded-xl">
            <span className="text-xs text-slate-500 uppercase font-semibold">Subscription Status</span>
            <div className="flex items-center justify-between mt-2">
              <span className="text-2xl font-bold text-emerald-400 capitalize">{profile.subscription_status}</span>
              <span className="text-xs bg-emerald-500/20 text-emerald-400 px-2 py-1 rounded">Verified</span>
            </div>
          </div>

          <div className="bg-slate-950 border border-slate-800 p-5 rounded-xl">
            <span className="text-xs text-slate-500 uppercase font-semibold">Selected Charity</span>
            <p className="text-xl font-bold text-white mt-1">{profile.charity_name}</p>
            <p className="text-xs text-slate-400 mt-1">
              Contribution: <span className="text-emerald-400 font-bold">{profile.charity_percentage}%</span>
            </p>
          </div>

          <div className="bg-slate-950 border border-slate-800 p-5 rounded-xl">
            <span className="text-xs text-slate-500 uppercase font-semibold">Draw Status</span>
            <p className="text-xl font-bold text-amber-400 mt-1">Eligible</p>
            <p className="text-xs text-slate-400 mt-1">
              Pool Share Tier: <span className="text-white font-bold">5-Match Jackpot</span>
            </p>
          </div>
        </div>

        {/* Dynamic Score Manager & Winner Verification */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            <ScoreManager userId={profile.id} />
          </div>
          <div>
            <ProofUpload userId={profile.id} />
          </div>
        </div>
      </div>
    </div>
  );
}
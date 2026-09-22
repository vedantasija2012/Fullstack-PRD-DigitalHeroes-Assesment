'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { createClient } from '@/lib/supabaseBrowser';

interface Charity {
  id: string;
  name: string;
  description: string;
  featured: boolean;
}

export default function CharitiesPage() {
  const router = useRouter();
  const supabase = createClient();

  const [charities, setCharities] = useState<Charity[]>([]);
  const [selectedCharityId, setSelectedCharityId] = useState<string | null>(null);
  const [userId, setUserId] = useState<string | null>(null);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);
  const [updatingId, setUpdatingId] = useState<string | null>(null);
  const [message, setMessage] = useState('');

  useEffect(() => {
    async function fetchData() {
      // 1. Get current logged-in user
      const { data: { user } } = await supabase.auth.getUser();

      if (user) {
        setUserId(user.id);

        // 2. Fetch current selected charity ID for this user
        const { data: profileData } = await supabase
          .from('profiles')
          .select('charity_id')
          .eq('id', user.id)
          .single();

        if (profileData?.charity_id) {
          setSelectedCharityId(profileData.charity_id);
        }
      }

      // 3. Fetch list of all charities
      const { data: charityData } = await supabase.from('charities').select('*');
      if (charityData) setCharities(charityData);

      setLoading(false);
    }

    fetchData();
  }, []);

  const handleSelectCharity = async (charityId: string, charityName: string) => {
    if (!userId) {
      setMessage('Please sign in to select a charity.');
      return;
    }

    setUpdatingId(charityId);
    setMessage('');

    // Update database row
    const { error } = await supabase
      .from('profiles')
      .update({ charity_id: charityId })
      .eq('id', userId);

    setUpdatingId(null);

    if (error) {
      setMessage(`Failed to update: ${error.message}`);
    } else {
      setSelectedCharityId(charityId);
      setMessage(`Selected "${charityName}" as your primary cause!`);
      // Invalidate Next.js cache so Dashboard fetches fresh DB data
      router.refresh();
    }
  };

  const filtered = charities.filter((c) =>
    c.name.toLowerCase().includes(search.toLowerCase()) ||
    c.description?.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="bg-slate-900 min-h-screen text-slate-100 py-10 px-4">
      <div className="max-w-6xl mx-auto space-y-8">
        <div>
          <h1 className="text-4xl font-extrabold tracking-tight">Charity Directory</h1>
          <p className="text-slate-400 mt-2">Every subscription contributes at least 10% directly to your chosen cause[cite: 3].</p>
        </div>

        {message && (
          <div className={`p-4 rounded-lg font-medium text-sm ${message.includes('Failed') ? 'bg-red-500/10 text-red-400 border border-red-500/20' : 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'}`}>
            {message}
          </div>
        )}

        <input
          type="text"
          placeholder="Search charities by name or cause..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full bg-slate-950 border border-slate-800 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-emerald-500"
        />

        {loading ? (
          <p className="text-slate-500 font-medium">Loading charities from backend...</p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {filtered.map((charity) => {
              const isSelected = selectedCharityId === charity.id;
              const isUpdating = updatingId === charity.id;

              return (
                <div 
                  key={charity.id} 
                  className={`bg-slate-950 border p-6 rounded-xl flex flex-col justify-between space-y-4 transition ${
                    isSelected ? 'border-emerald-500 ring-1 ring-emerald-500/50' : 'border-slate-800'
                  }`}
                >
                  <div>
                    <div className="flex justify-between items-center">
                      {charity.featured && (
                        <span className="text-xs bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 px-2 py-0.5 rounded uppercase font-semibold">
                          Featured
                        </span>
                      )}
                      {isSelected && (
                        <span className="text-xs bg-emerald-500 text-slate-950 px-2 py-0.5 rounded font-bold uppercase">
                          Selected
                        </span>
                      )}
                    </div>
                    <h3 className="text-xl font-bold text-white mt-2">{charity.name}</h3>
                    <p className="text-slate-400 text-sm mt-2">{charity.description}</p>
                  </div>

                  <button
                    onClick={() => handleSelectCharity(charity.id, charity.name)}
                    disabled={isSelected || isUpdating}
                    className={`w-full font-medium py-2 rounded-md text-sm transition ${
                      isSelected
                        ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 cursor-default'
                        : 'bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold'
                    }`}
                  >
                    {isUpdating ? 'Updating...' : isSelected ? 'Currently Selected' : 'Select as My Charity'}
                  </button>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
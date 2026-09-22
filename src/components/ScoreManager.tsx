'use client';

import { useState, useEffect } from 'react';
import { createClient } from '@/lib/supabaseBrowser';

interface GolfScore {
  id: string;
  score: number;
  entry_date: string;
}

export default function ScoreManager({ userId }: { userId: string }) {
  const supabase = createClient();
  const [scores, setScores] = useState<GolfScore[]>([]);
  const [scoreInput, setScoreInput] = useState<number | ''>('');
  const [dateInput, setDateInput] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  // Fetch Scores from Supabase (Latest 5 in reverse chronological order)
  const fetchScores = async () => {
    const { data, error } = await supabase
      .from('golf_scores')
      .select('*')
      .eq('user_id', userId)
      .order('entry_date', { ascending: false })
      .limit(5);

    if (error) setError(error.message);
    else if (data) setScores(data);
  };

  useEffect(() => {
    if (userId) fetchScores();
  }, [userId]);

  const handleAddScore = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!scoreInput || scoreInput < 1 || scoreInput > 45) {
      setError('Score must be in Stableford format (between 1 and 45).');
      return;
    }

    if (!dateInput) {
      setError('Please select a valid date.');
      return;
    }

    setLoading(true);

    const { error: insertError } = await supabase
      .from('golf_scores')
      .insert({
        user_id: userId,
        score: Number(scoreInput),
        entry_date: dateInput,
      });

    setLoading(false);

    if (insertError) {
      setError(insertError.message.includes('unique') 
        ? 'Only one score is permitted per date.' 
        : insertError.message);
    } else {
      setScoreInput('');
      setDateInput('');
      fetchScores(); // Refresh list to view automatic rolling score update
    }
  };

  return (
    <div className="bg-slate-900 border border-slate-800 p-6 rounded-xl space-y-6">
      <h2 className="text-xl font-bold text-white">Your Recent Golf Scores (Max 5)</h2>
      
      {error && <p className="text-red-400 text-sm font-medium">{error}</p>}

      <form onSubmit={handleAddScore} className="flex flex-col md:flex-row gap-4">
        <input
          type="number"
          min="1"
          max="45"
          placeholder="Score (1-45)"
          value={scoreInput}
          onChange={(e) => setScoreInput(e.target.value ? Number(e.target.value) : '')}
          className="bg-slate-950 border border-slate-700 px-4 py-2 rounded-md text-white flex-1"
        />
        <input
          type="date"
          value={dateInput}
          onChange={(e) => setDateInput(e.target.value)}
          className="bg-slate-950 border border-slate-700 px-4 py-2 rounded-md text-white flex-1"
        />
        <button
          type="submit"
          disabled={loading}
          className="bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold px-6 py-2 rounded-md transition disabled:opacity-50"
        >
          {loading ? 'Saving...' : 'Add Score'}
        </button>
      </form>

      {/* Scores Display */}
      <div className="space-y-2">
        {scores.length === 0 ? (
          <p className="text-slate-500 text-sm">No scores submitted yet.</p>
        ) : (
          scores.map((s) => (
            <div key={s.id} className="flex justify-between items-center bg-slate-950 p-3 rounded border border-slate-800">
              <span className="text-slate-400">{s.entry_date}</span>
              <span className="text-emerald-400 font-bold text-lg">{s.score} pts</span>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
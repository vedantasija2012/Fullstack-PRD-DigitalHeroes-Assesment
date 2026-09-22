'use client';

import { useState } from 'react';

export default function ProofUpload({ userId }: { userId: string }) {
  const [file, setFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);
  const [status, setStatus] = useState<string>('pending');
  const [message, setMessage] = useState('');

  const handleUpload = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!file) return;

    setUploading(true);
    setMessage('');

    try {
      // 1. Send metadata to backend API
      const res = await fetch('/api/winners/proof', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          user_id: userId,
          proof_url: file.name,
          match_category: '5_match',
          prize_amount: 5000,
        }),
      });

      const data = await res.json();

      if (res.ok) {
        setStatus('pending');
        setMessage('Proof submitted successfully! Awaiting admin review.');
      } else {
        setMessage(`Error: ${data.error}`);
      }
    } catch (err: any) {
      setMessage(`Upload failed: ${err.message}`);
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="bg-slate-950 border border-slate-800 p-6 rounded-xl space-y-4">
      <h3 className="text-lg font-bold text-white">Winner Verification Proof</h3>
      <p className="text-sm text-slate-400">
        Upload a screenshot or photo of your official golf score platform to claim your prize[cite: 3].
      </p>

      {message && (
        <p className={`text-xs font-medium ${message.startsWith('Error') || message.startsWith('Upload') ? 'text-red-400' : 'text-emerald-400'}`}>
          {message}
        </p>
      )}

      <form onSubmit={handleUpload} className="space-y-4">
        <input
          type="file"
          accept="image/*"
          onChange={(e) => setFile(e.target.files?.[0] || null)}
          className="block w-full text-sm text-slate-400 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-slate-800 file:text-emerald-400 hover:file:bg-slate-700"
        />
        <button
          type="submit"
          disabled={!file || uploading}
          className="w-full bg-emerald-500 disabled:opacity-50 hover:bg-emerald-400 text-slate-950 font-bold px-4 py-2.5 rounded-md transition text-sm"
        >
          {uploading ? 'Submitting to API...' : 'Submit Proof'}
        </button>
      </form>

      <div className="text-xs uppercase font-semibold text-slate-400">
        Current State: <span className="text-amber-400">{status}</span>
      </div>
    </div>
  );
}
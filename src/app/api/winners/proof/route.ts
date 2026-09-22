import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabaseBrowser';

export async function POST(request: Request) {
  try {
    const supabase = createClient();
    const { user_id, draw_id, proof_url, match_category, prize_amount } = await request.json();

    if (!user_id || !proof_url) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    // Insert or update winner submission status in Supabase
    const { data, error } = await supabase
      .from('winners')
      .upsert({
        user_id,
        draw_id,
        proof_url,
        match_category: match_category || '5_match',
        prize_amount: prize_amount || 1000,
        status: 'pending',
      })
      .select()
      .single();

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ success: true, winnerRecord: data });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

// Admin payout verification handler (PRD Section 11)
export async function PATCH(request: Request) {
  try {
    const supabase = createClient();
    const { winner_id, status } = await request.json(); // status: 'paid' | 'rejected'

    const { data, error } = await supabase
      .from('winners')
      .update({ status })
      .eq('id', winner_id)
      .select()
      .single();

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ success: true, updatedWinner: data });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
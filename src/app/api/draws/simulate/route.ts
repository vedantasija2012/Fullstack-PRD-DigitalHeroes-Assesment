import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabaseBrowser';

export async function POST(request: Request) {
  try {
    const supabase = createClient();
    const { drawType } = await request.json(); // 'random' or 'algorithmic'

    // 1. Fetch total active subscribers to calculate prize pool
    const { count: subscriberCount, error: countError } = await supabase
      .from('profiles')
      .select('*', { count: 'exact', head: true })
      .eq('subscription_status', 'active');

    if (countError) {
      return NextResponse.json({ error: countError.message }, { status: 500 });
    }

    // Standard subscription fee pool base (e.g., $50 per active user)
    const baseSubscriptionFee = 50;
    const totalPool = (subscriberCount || 10) * baseSubscriptionFee * 0.5; // 50% allocated to pool

    // 2. Calculate Tier Breakdown (PRD Section 07)
    const jackpot5Match = totalPool * 0.40;
    const pool4Match = totalPool * 0.35;
    const pool3Match = totalPool * 0.25;

    // 3. Generate Winning Numbers (1 - 45 range)
    let winningNumbers: number[] = [];
    
    if (drawType === 'algorithmic') {
      // Fetch score frequencies to weight the draw algorithmically
      const { data: scores } = await supabase.from('golf_scores').select('score');
      if (scores && scores.length > 0) {
        // Algorithmic mode: pick numbers that appear in active user scores
        const scoreFrequency = scores.map((s) => s.score);
        winningNumbers = Array.from({ length: 5 }, () =>
          scoreFrequency[Math.floor(Math.random() * scoreFrequency.length)]
        );
      } else {
        winningNumbers = generateRandomNumbers();
      }
    } else {
      // Standard random lottery logic
      winningNumbers = generateRandomNumbers();
    }

    return NextResponse.json({
      success: true,
      drawType,
      winningNumbers,
      analytics: {
        activeSubscribers: subscriberCount || 10,
        totalPool,
        tierBreakdown: {
          match5Jackpot: jackpot5Match,
          match4Pool: pool4Match,
          match3Pool: pool3Match,
        },
      },
    });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

function generateRandomNumbers(): number[] {
  const nums = new Set<number>();
  while (nums.size < 5) {
    nums.add(Math.floor(Math.random() * 45) + 1);
  }
  return Array.from(nums);
}
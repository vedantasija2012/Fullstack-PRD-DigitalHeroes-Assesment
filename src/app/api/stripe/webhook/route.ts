import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabaseBrowser';

export async function POST(request: Request) {
  try {
    const supabase = createClient();
    const body = await request.json();

    // Stripe Event Handlers
    const eventType = body.type;
    const session = body.data?.object;

    if (eventType === 'checkout.session.completed' || eventType === 'customer.subscription.created') {
      const customerEmail = session.customer_details?.email || session.email;

      if (customerEmail) {
        // Automatically set subscriber status to active in Supabase DB
        await supabase
          .from('profiles')
          .update({ subscription_status: 'active' })
          .eq('email', customerEmail);
      }
    } else if (eventType === 'customer.subscription.deleted') {
      const customerEmail = session.customer_details?.email;

      if (customerEmail) {
        // Cancel subscription status
        await supabase
          .from('profiles')
          .update({ subscription_status: 'canceled' })
          .eq('email', customerEmail);
      }
    }

    return NextResponse.json({ received: true });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 400 });
  }
}
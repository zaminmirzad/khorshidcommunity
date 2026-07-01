import { redirect } from 'next/navigation';
import Stripe from 'stripe';
import { createClient, createAdminClient } from '@/lib/supabase/server';
import MembershipClient from './MembershipClient';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);

type Props = { searchParams: Promise<{ payment?: string; session_id?: string; portal?: string }> };

export default async function MembershipPage({ searchParams }: Props) {
  const { payment, session_id, portal } = await searchParams;

  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect('/sign-in');

  const { data: member } = await supabase
    .from('members')
    .select('id, subscription_exempt')
    .eq('user_id', user.id)
    .single();

  if (!member) redirect('/sign-in');

  const admin = createAdminClient();

  const [
    { data: myAssignments },
    { data: payments },
    { data: subFee },
    { data: rawSub },
  ] = await Promise.all([
    admin
      .from('fee_assignments')
      .select('id, note, assigned_at, label, paid, fees(*)')
      .eq('member_id', member.id),
    supabase
      .from('payments')
      .select('id, product_id, stripe_price_id, description, amount, currency, status, paid_at')
      .eq('member_id', member.id)
      .eq('status', 'paid')
      .order('paid_at', { ascending: false }),
    admin
      .from('fees')
      .select('id, name, description, amount, currency, stripe_price_id')
      .eq('is_subscription', true)
      .eq('active', true)
      .limit(1)
      .maybeSingle(),
    admin
      .from('member_subscriptions')
      .select('stripe_subscription_id, status, current_period_end, cancel_at_period_end, cancel_at, cancelled_at')
      .eq('member_id', member.id)
      .order('created_at', { ascending: false })
      .limit(1)
      .maybeSingle(),
  ]);

  // On portal return, sync directly from Stripe so the page is always accurate
  // regardless of webhook timing.
  let mySub = rawSub;
  if (portal === 'return' && rawSub?.stripe_subscription_id) {
    try {
      const stripeSub = await stripe.subscriptions.retrieve(rawSub.stripe_subscription_id);
      const item = stripeSub.items.data[0];
      const synced = {
        status: stripeSub.status,
        cancel_at: stripeSub.cancel_at ? new Date(stripeSub.cancel_at * 1000).toISOString() : null,
        cancel_at_period_end: stripeSub.cancel_at_period_end,
        current_period_end: item ? new Date(item.current_period_end * 1000).toISOString() : rawSub.current_period_end,
        cancelled_at: stripeSub.status === 'canceled'
          ? (stripeSub.canceled_at ? new Date(stripeSub.canceled_at * 1000).toISOString() : new Date().toISOString())
          : null,
      };
      // Persist to DB so webhook doesn't need to race
      await admin
        .from('member_subscriptions')
        .update(synced)
        .eq('stripe_subscription_id', rawSub.stripe_subscription_id);
      mySub = { ...rawSub, ...synced };
    } catch {}
  }

  type FeeRecord = { id: string; name: string; description: string | null; amount: number; currency: string; stripe_price_id: string; active: boolean };
  type AssignmentRow = { id: string; note: string | null; assigned_at: string; label: string | null; paid: boolean; fees: FeeRecord };
  type PaymentRow = { id: string; product_id: string | null; stripe_price_id: string | null; description: string; amount: number; currency: string; status: string; paid_at: string };

  const paymentList = (payments ?? []) as PaymentRow[];

  const allProducts = ((myAssignments ?? []) as unknown as AssignmentRow[])
    .filter((a) => !a.paid && a.fees?.id && a.fees?.active !== false)
    .map((a) => ({
      ...a.fees,
      note: a.note,
      label: a.label,
      assignmentId: a.id,
      source: 'assigned' as const,
    }));

  const hasFees = allProducts.length > 0 || paymentList.length > 0;

  return (
    <MembershipClient
      products={allProducts}
      hasFees={hasFees}
      payments={paymentList}
      paymentStatus={payment}
      sessionId={session_id}
      portalReturn={portal === 'return'}
      subscriptionExempt={member.subscription_exempt ?? false}
      subscriptionFee={subFee ?? null}
      subscription={mySub ?? null}
    />
  );
}

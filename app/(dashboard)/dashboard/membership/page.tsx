import { redirect } from 'next/navigation';
import { createClient, createAdminClient } from '@/lib/supabase/server';
import MembershipClient from './MembershipClient';

type Props = { searchParams: Promise<{ payment?: string; session_id?: string }> };

export default async function MembershipPage({ searchParams }: Props) {
  const { payment, session_id } = await searchParams;

  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect('/sign-in');

  const { data: member } = await supabase
    .from('members')
    .select('id')
    .eq('user_id', user.id)
    .single();

  if (!member) redirect('/sign-in');

  const admin = createAdminClient();

  const [{ data: myAssignments }, { data: payments }] = await Promise.all([
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
  ]);

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
    />
  );
}

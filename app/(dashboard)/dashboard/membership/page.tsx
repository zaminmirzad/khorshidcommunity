import { redirect } from 'next/navigation';
import { createClient } from '@/lib/supabase/server';
import MembershipClient from './MembershipClient';

type Props = { searchParams: Promise<{ payment?: string }> };

export default async function MembershipPage({ searchParams }: Props) {
  const { payment } = await searchParams;

  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect('/sign-in');

  const { data: member } = await supabase
    .from('members')
    .select('id')
    .eq('user_id', user.id)
    .single();

  if (!member) redirect('/sign-in');

  const [{ data: publicProducts }, { data: assignedProducts }, { data: payments }] = await Promise.all([
    supabase.from('products').select('*').eq('active', true).eq('is_public', true).order('created_at'),
    supabase
      .from('member_products')
      .select('note, assigned_at, products(*)')
      .eq('member_id', member.id),
    supabase.from('payments').select('stripe_price_id, product_id, status').eq('member_id', member.id).eq('status', 'paid'),
  ]);

  type AssignedRow = { note: string | null; assigned_at: string; products: Record<string, unknown> };

  const assignedProductsList = (assignedProducts ?? []).map((a) => {
    const row = a as unknown as AssignedRow;
    return { ...(row.products), note: row.note, assigned_at: row.assigned_at };
  });

  const allProducts = [
    ...assignedProductsList.map((p) => ({ ...p, source: 'assigned' as const })),
    ...(publicProducts ?? [])
      .filter((p) => !assignedProductsList.some((a) => (a as Record<string, unknown>).id === p.id))
      .map((p) => ({ ...p, source: 'public' as const })),
  ];

  const paidProductIds = new Set((payments ?? []).map((p: { product_id: string | null }) => p.product_id).filter(Boolean));

  return (
    <MembershipClient
      products={allProducts}
      paidProductIds={Array.from(paidProductIds) as string[]}
      paymentStatus={payment}
    />
  );
}

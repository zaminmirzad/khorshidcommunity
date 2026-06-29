import { redirect } from 'next/navigation';
import { createClient } from '@/lib/supabase/server';
import AdminShell from './AdminShell';

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const supabase = await createClient();

  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect('/sign-in');

  const { data: member } = await supabase
    .from('members')
    .select('full_name, role')
    .eq('user_id', user.id)
    .single();

  if (!member || member.role !== 'admin') redirect('/dashboard');

  const [{ count: pendingCount }, { count: unreadMessages }] = await Promise.all([
    supabase.from('membership_requests').select('*', { count: 'exact', head: true }).eq('status', 'pending'),
    supabase.from('contact_submissions').select('*', { count: 'exact', head: true }).eq('status', 'unread'),
  ]);

  return (
    <AdminShell memberName={member.full_name} pendingCount={pendingCount ?? 0} unreadMessages={unreadMessages ?? 0}>
      {children}
    </AdminShell>
  );
}

import { redirect } from 'next/navigation';
import { createClient } from '@/lib/supabase/server';
import DashboardShell from './DashboardShell';

export default async function DashboardLayout({ children }: { children: React.ReactNode }) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) redirect('/sign-in');

  const { data: member } = await supabase
    .from('members')
    .select('id, full_name, role, joined_at')
    .eq('user_id', user.id)
    .single();

  if (!member) redirect('/sign-in');

  const [{ count: totalAnnouncements }, { count: readAnnouncements }] = await Promise.all([
    supabase.from('announcements').select('*', { count: 'exact', head: true }).eq('active', true),
    supabase.from('announcement_reads').select('*', { count: 'exact', head: true }).eq('member_id', member.id),
  ]);

  const unreadAnnouncements = Math.max(0, (totalAnnouncements ?? 0) - (readAnnouncements ?? 0));

  return (
    <DashboardShell
      memberName={member.full_name}
      joinedAt={member.joined_at}
      isAdmin={member.role === 'admin'}
      unreadAnnouncements={unreadAnnouncements}
    >
      {children}
    </DashboardShell>
  );
}

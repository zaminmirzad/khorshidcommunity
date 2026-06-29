import { redirect } from 'next/navigation';
import { createClient } from '@/lib/supabase/server';
import DashboardShell from './DashboardShell';

export default async function DashboardLayout({ children }: { children: React.ReactNode }) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) redirect('/sign-in');

  const { data: member } = await supabase
    .from('members')
    .select('full_name, role, joined_at')
    .eq('user_id', user.id)
    .single();

  if (!member) redirect('/sign-in');

  return (
    <DashboardShell
      memberName={member.full_name}
      joinedAt={member.joined_at}
      isAdmin={member.role === 'admin'}
    >
      {children}
    </DashboardShell>
  );
}

import { redirect } from 'next/navigation';
import { createClient } from '@/lib/supabase/server';
import EventsClient from './EventsClient';

export default async function EventsPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect('/sign-in');

  const { data: member } = await supabase.from('members').select('id').eq('user_id', user.id).single();
  if (!member) redirect('/sign-in');

  const [{ data: events }, { data: registrations }] = await Promise.all([
    supabase
      .from('events')
      .select('*, registrations:event_registrations(count)')
      .eq('active', true)
      .order('date', { ascending: true }),
    supabase
      .from('event_registrations')
      .select('event_id, status')
      .eq('member_id', member.id),
  ]);

  const registrationMap = Object.fromEntries(
    (registrations ?? []).map((r) => [r.event_id, r.status])
  );

  return <EventsClient events={events ?? []} registrationMap={registrationMap} memberId={member.id} />;
}

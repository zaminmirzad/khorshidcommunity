import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';

export async function POST(request: Request) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: 'Unauthorized.' }, { status: 401 });

  const { eventId } = await request.json();
  if (!eventId) return NextResponse.json({ error: 'Missing eventId.' }, { status: 400 });

  const { data: member } = await supabase.from('members').select('id').eq('user_id', user.id).single();
  if (!member) return NextResponse.json({ error: 'Member not found.' }, { status: 404 });

  const { data: event } = await supabase
    .from('events')
    .select('id, capacity')
    .eq('id', eventId)
    .eq('active', true)
    .single();
  if (!event) return NextResponse.json({ error: 'Event not found.' }, { status: 404 });

  if (event.capacity) {
    const { count } = await supabase
      .from('event_registrations')
      .select('*', { count: 'exact', head: true })
      .eq('event_id', eventId)
      .eq('status', 'registered');
    if ((count ?? 0) >= event.capacity) {
      return NextResponse.json({ error: 'Event is full.' }, { status: 409 });
    }
  }

  const { error } = await supabase.from('event_registrations').upsert(
    { event_id: eventId, member_id: member.id, status: 'registered' },
    { onConflict: 'event_id,member_id' }
  );
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ ok: true });
}

export async function DELETE(request: Request) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: 'Unauthorized.' }, { status: 401 });

  const { eventId } = await request.json();
  const { data: member } = await supabase.from('members').select('id').eq('user_id', user.id).single();
  if (!member) return NextResponse.json({ error: 'Member not found.' }, { status: 404 });

  const { error } = await supabase
    .from('event_registrations')
    .update({ status: 'cancelled' })
    .eq('event_id', eventId)
    .eq('member_id', member.id);
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ ok: true });
}

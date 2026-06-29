import { NextResponse } from 'next/server';
import { Resend } from 'resend';
import { createClient, createAdminClient } from '@/lib/supabase/server';

async function verifyAdmin() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return null;
  const { data: member } = await supabase.from('members').select('id, role').eq('user_id', user.id).single();
  if (!member || member.role !== 'admin') return null;
  return member.id;
}

export async function GET() {
  const adminId = await verifyAdmin();
  if (!adminId) return NextResponse.json({ error: 'Forbidden.' }, { status: 403 });

  const admin = createAdminClient();
  const { data } = await admin
    .from('newsletter_sends')
    .select('*')
    .order('sent_at', { ascending: false })
    .limit(20);

  return NextResponse.json(data ?? []);
}

export async function POST(request: Request) {
  const adminId = await verifyAdmin();
  if (!adminId) return NextResponse.json({ error: 'Forbidden.' }, { status: 403 });

  const { subject, body, audience } = await request.json();
  if (!subject?.trim() || !body?.trim()) {
    return NextResponse.json({ error: 'Subject and message are required.' }, { status: 400 });
  }

  const admin = createAdminClient();

  let emailQuery = admin.from('members').select('email, full_name');
  if (audience === 'paid') {
    const { data: paidMembers } = await admin
      .from('payments')
      .select('member_id')
      .eq('status', 'paid');
    const paidIds = [...new Set((paidMembers ?? []).map((p: { member_id: string }) => p.member_id))];
    emailQuery = emailQuery.in('id', paidIds);
  }

  const { data: members, error: membersError } = await emailQuery;
  if (membersError) return NextResponse.json({ error: membersError.message }, { status: 500 });

  const recipients = members ?? [];
  if (recipients.length === 0) {
    return NextResponse.json({ error: 'No recipients found.' }, { status: 400 });
  }

  if (!process.env.RESEND_API_KEY) {
    return NextResponse.json({ error: 'Email service not configured.' }, { status: 503 });
  }

  const resend = new Resend(process.env.RESEND_API_KEY);
  const fromEmail = 'KhorshidCommunity <onboarding@resend.dev>';

  const htmlBody = `
    <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; padding: 32px 24px; color: #1a1a1a;">
      <div style="margin-bottom: 32px;">
        <span style="font-size: 18px; font-weight: 700; color: #1e293b;">Khorshid Community</span>
      </div>
      <div style="white-space: pre-wrap; line-height: 1.7; font-size: 15px; color: #374151;">${body.replace(/</g, '&lt;').replace(/>/g, '&gt;')}</div>
      <div style="margin-top: 40px; padding-top: 24px; border-top: 1px solid #e5e7eb; font-size: 12px; color: #9ca3af;">
        You received this because you are a member of Khorshid Community San Diego.
      </div>
    </div>
  `;

  // Resend batch limit is 100 per call — chunk recipients
  const CHUNK = 100;
  for (let i = 0; i < recipients.length; i += CHUNK) {
    const chunk = recipients.slice(i, i + CHUNK);
    const emails = chunk.map((m: { email: string; full_name: string }) => ({
      from: fromEmail,
      to: m.email,
      subject,
      html: htmlBody,
    }));
    const { error } = await resend.batch.send(emails);
    if (error) return NextResponse.json({ error: `Send failed: ${error.message}` }, { status: 500 });
  }

  await admin.from('newsletter_sends').insert({
    subject,
    body,
    audience: audience ?? 'all',
    recipient_count: recipients.length,
    sent_by: adminId,
  });

  return NextResponse.json({ ok: true, recipient_count: recipients.length });
}

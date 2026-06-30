import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);
const ADMIN_EMAIL = 'mirzadzamin@gmail.com';
const FROM_EMAIL = 'noreply@khorshidcommunity.com';

export async function POST(request: Request) {
  const body = await request.json();
  const { fullName, email, phone, message } = body;

  if (!fullName?.trim() || !email?.trim()) {
    return NextResponse.json({ error: 'Name and email are required.' }, { status: 400 });
  }

  const supabase = await createClient();

  const { error: dbError } = await supabase
    .from('membership_requests')
    .insert({ full_name: fullName.trim(), email: email.trim(), phone: phone?.trim() || null, message: message?.trim() || null });

  if (dbError) {
    console.error('membership_requests insert error:', dbError);
    return NextResponse.json({ error: 'Failed to save request.' }, { status: 500 });
  }

  // Emails are best-effort — sandbox limitations mean these may only deliver to the Resend account email
  try {
    await resend.emails.send({
      from: FROM_EMAIL,
      to: email.trim(),
      subject: 'We received your membership request — Khorshid Community',
      html: `
        <div style="font-family:system-ui,sans-serif;max-width:560px;margin:0 auto;color:#1e2030">
          <div style="background:#17254a;padding:32px 40px;border-radius:16px 16px 0 0">
            <h1 style="color:#fbbf24;font-size:22px;margin:0;font-weight:600">Khorshid Community</h1>
          </div>
          <div style="background:#ffffff;padding:40px;border:1px solid #e5e7eb;border-top:none;border-radius:0 0 16px 16px">
            <h2 style="font-size:20px;font-weight:600;margin:0 0 12px">Hi ${fullName},</h2>
            <p style="color:#6b7280;line-height:1.6;margin:0 0 20px">
              Thank you for your interest in joining Khorshid Community. We have received your membership request and our team will review it shortly.
            </p>
            <p style="color:#6b7280;line-height:1.6;margin:0 0 20px">
              Once approved, you will receive a separate email with a link to complete your registration.
            </p>
            <p style="color:#9ca3af;font-size:13px;margin:32px 0 0">
              Questions? Contact us at <a href="mailto:${ADMIN_EMAIL}" style="color:#f59e0b">${ADMIN_EMAIL}</a>
            </p>
          </div>
        </div>
      `,
    });

    await resend.emails.send({
      from: FROM_EMAIL,
      to: ADMIN_EMAIL,
      subject: `New membership request from ${fullName}`,
      html: `
        <div style="font-family:system-ui,sans-serif;max-width:560px;margin:0 auto;color:#1e2030">
          <div style="background:#17254a;padding:32px 40px;border-radius:16px 16px 0 0">
            <h1 style="color:#fbbf24;font-size:22px;margin:0;font-weight:600">New Membership Request</h1>
          </div>
          <div style="background:#ffffff;padding:40px;border:1px solid #e5e7eb;border-top:none;border-radius:0 0 16px 16px">
            <table style="width:100%;border-collapse:collapse">
              <tr><td style="padding:8px 0;color:#6b7280;width:120px">Name</td><td style="padding:8px 0;font-weight:600">${fullName}</td></tr>
              <tr><td style="padding:8px 0;color:#6b7280">Email</td><td style="padding:8px 0"><a href="mailto:${email}" style="color:#f59e0b">${email}</a></td></tr>
              <tr><td style="padding:8px 0;color:#6b7280">Phone</td><td style="padding:8px 0">${phone || '—'}</td></tr>
              <tr><td style="padding:8px 0;color:#6b7280;vertical-align:top">Message</td><td style="padding:8px 0">${message || '—'}</td></tr>
            </table>
            <p style="color:#9ca3af;font-size:13px;margin:28px 0 0">Review this request in your admin panel.</p>
          </div>
        </div>
      `,
    });
  } catch (emailErr) {
    console.error('Email send failed (non-blocking):', emailErr);
  }

  return NextResponse.json({ ok: true });
}

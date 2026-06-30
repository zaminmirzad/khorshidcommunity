import { Resend } from 'resend';
import { NextResponse } from 'next/server';
import { EmailTemplate } from '@/app/components/EmailTemplate';

const MAX_FIELD_LENGTH = 500;
const MAX_MESSAGE_LENGTH = 5000;

export async function POST(request: Request) {
  if (!process.env.RESEND_API_KEY) {
    console.error('RESEND_API_KEY is not configured');
    return NextResponse.json({ error: 'Email service is not configured.' }, { status: 503 });
  }

  const resend = new Resend(process.env.RESEND_API_KEY);

  try {
    const body = await request.json();
    const { name, email, phone, subject, message } = body;

    if (!name || !email || !subject || !message) {
      return NextResponse.json({ error: 'Please fill in all required fields.' }, { status: 400 });
    }

    if (
      name.length > MAX_FIELD_LENGTH ||
      email.length > MAX_FIELD_LENGTH ||
      subject.length > MAX_FIELD_LENGTH ||
      (phone && phone.length > MAX_FIELD_LENGTH) ||
      message.length > MAX_MESSAGE_LENGTH
    ) {
      return NextResponse.json({ error: 'One or more fields exceed the maximum allowed length.' }, { status: 400 });
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return NextResponse.json({ error: 'Invalid email address.' }, { status: 400 });
    }

    const { error } = await resend.emails.send({
      from: 'KhorshidCommunity <noreply@khorshidcommunity.com>',
      to: ['mesutmirzaie@gmail.com'],
      subject: `📧 Contact Form: ${subject}`,
      react: EmailTemplate({ name, email, phone, subject, message }),
      replyTo: email,
    });

    if (error) {
      console.error('Resend error:', error);
      return NextResponse.json({ error: 'Failed to send message. Please try again.' }, { status: 500 });
    }

    // Save to DB non-blocking
    try {
      const { createAdminClient } = await import('@/lib/supabase/server');
      const admin = createAdminClient();
      await admin.from('contact_submissions').insert({ name, email, phone: phone ?? null, subject, message });
    } catch (e) {
      console.error('Failed to save contact submission:', e);
    }

    return NextResponse.json({ message: 'Message sent successfully! We will get back to you soon.' }, { status: 200 });
  } catch (err) {
    console.error('Contact route error:', err);
    return NextResponse.json({ error: 'Something went wrong. Please try again later.' }, { status: 500 });
  }
}

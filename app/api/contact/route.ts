// app/api/contact/route.ts
import { Resend } from 'resend';
import { NextResponse } from 'next/server';
import { EmailTemplate } from '@/app/components/EmailTemplate';

const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST(request: Request) {
  try {
    const { name, email, phone, subject, message } = await request.json();

    // Validate required fields
    if (!name || !email || !subject || !message) {
      return NextResponse.json(
        { error: 'Please fill in all required fields' },
        { status: 400 }
      );
    }

    // Send email using Resend with React template
    const { data, error } = await resend.emails.send({
      from: 'KhorshidCommunity <onboarding@resend.dev>',
      to: ['info@khorshidcommunity.org'],
      subject: `📧 Contact Form: ${subject}`,
      react: EmailTemplate({ name, email, phone, subject, message }),
      replyTo: email,
    });

    if (error) {
      console.error('Resend error:', error);
      return NextResponse.json(
        { error: 'Failed to send message. Please try again.' },
        { status: 500 }
      );
    }

    return NextResponse.json(
      { message: 'Message sent successfully! We will get back to you soon.' },
      { status: 200 }
    );
  } catch (error) {
    console.error('Error:', error);
    return NextResponse.json(
      { error: 'Something went wrong. Please try again later.' },
      { status: 500 }
    );
  }
}
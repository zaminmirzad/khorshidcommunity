import { NextResponse } from 'next/server';
import { createClient, createAdminClient } from '@/lib/supabase/server';

async function verifyAdmin() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return null;
  const { data: member } = await supabase.from('members').select('role').eq('user_id', user.id).single();
  return member?.role === 'admin' ? true : null;
}

export async function GET() {
  const admin = createAdminClient();
  const { data } = await admin.from('team_members').select('*').order('sort_order').order('created_at');
  return NextResponse.json(data ?? []);
}

export async function POST(request: Request) {
  if (!await verifyAdmin()) return NextResponse.json({ error: 'Forbidden.' }, { status: 403 });

  const formData = await request.formData();
  const file = formData.get('file') as File | null;
  const name = formData.get('name') as string;
  const titleEn = formData.get('title_en') as string;
  if (!name || !titleEn) return NextResponse.json({ error: 'Name and title are required.' }, { status: 400 });

  const admin = createAdminClient();
  let photoUrl: string | null = null;
  let storagePath: string | null = null;

  if (file && file.size > 0) {
    const ext = file.name.split('.').pop();
    storagePath = `${Date.now()}-${Math.random().toString(36).slice(2)}.${ext}`;
    const bytes = await file.arrayBuffer();
    const { error: uploadError } = await admin.storage.from('team').upload(storagePath, bytes, { contentType: file.type });
    if (uploadError) return NextResponse.json({ error: uploadError.message }, { status: 500 });
    photoUrl = admin.storage.from('team').getPublicUrl(storagePath).data.publicUrl;
  }

  const { data, error } = await admin.from('team_members').insert({
    name,
    title_en: titleEn,
    title_fa: formData.get('title_fa') as string || null,
    bio_en: formData.get('bio_en') as string || null,
    bio_fa: formData.get('bio_fa') as string || null,
    is_president: formData.get('is_president') === 'true',
    photo_url: photoUrl,
    storage_path: storagePath,
  }).select().single();

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json(data);
}

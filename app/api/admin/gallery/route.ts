import { NextResponse } from 'next/server';
import { createClient, createAdminClient } from '@/lib/supabase/server';

async function verifyAdmin() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return null;
  const { data: member } = await supabase.from('members').select('role').eq('user_id', user.id).single();
  if (!member || member.role !== 'admin') return null;
  return user.id;
}

export async function GET() {
  const adminId = await verifyAdmin();
  if (!adminId) return NextResponse.json({ error: 'Forbidden.' }, { status: 403 });

  const admin = createAdminClient();
  const { data, error } = await admin
    .from('gallery_items')
    .select('*')
    .order('sort_order', { ascending: true })
    .order('created_at', { ascending: false });

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json(data);
}

export async function POST(request: Request) {
  const adminId = await verifyAdmin();
  if (!adminId) return NextResponse.json({ error: 'Forbidden.' }, { status: 403 });

  const formData = await request.formData();
  const file = formData.get('file') as File | null;
  const title = formData.get('title') as string;
  const description = formData.get('description') as string | null;
  const dateLabel = formData.get('date_label') as string | null;
  const location = formData.get('location') as string | null;
  const category = (formData.get('category') as string) || 'events';

  if (!file || !title) return NextResponse.json({ error: 'File and title are required.' }, { status: 400 });

  const admin = createAdminClient();

  const ext = file.name.split('.').pop();
  const storagePath = `${Date.now()}-${Math.random().toString(36).slice(2)}.${ext}`;
  const bytes = await file.arrayBuffer();

  const { error: uploadError } = await admin.storage
    .from('gallery')
    .upload(storagePath, bytes, { contentType: file.type, upsert: false });

  if (uploadError) return NextResponse.json({ error: uploadError.message }, { status: 500 });

  const { data: { publicUrl } } = admin.storage.from('gallery').getPublicUrl(storagePath);

  const { data, error } = await admin.from('gallery_items').insert({
    url: publicUrl,
    storage_path: storagePath,
    title,
    description: description || null,
    date_label: dateLabel || null,
    location: location || null,
    category,
  }).select().single();

  if (error) {
    await admin.storage.from('gallery').remove([storagePath]);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json(data);
}

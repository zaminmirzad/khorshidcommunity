import { createClient } from '@/lib/supabase/server';
import GalleryClient from './GalleryClient';

export type GalleryItem = {
  id: string;
  url: string;
  title: string;
  description: string | null;
  date_label: string | null;
  location: string | null;
  category: string;
};

export default async function GalleryPage() {
  const supabase = await createClient();
  const { data } = await supabase
    .from('gallery_items')
    .select('id, url, title, description, date_label, location, category')
    .eq('active', true)
    .order('sort_order', { ascending: true })
    .order('created_at', { ascending: false });

  return <GalleryClient dbImages={data ?? []} />;
}

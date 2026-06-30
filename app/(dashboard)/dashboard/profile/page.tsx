import { redirect } from 'next/navigation';
import { createClient } from '@/lib/supabase/server';
import ProfileForm from './ProfileForm';

export default async function ProfilePage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect('/sign-in');

  const { data: member } = await supabase
    .from('members')
    .select('full_name, phone, joined_at')
    .eq('user_id', user.id)
    .single();

  if (!member) redirect('/sign-in');

  const joinedYear = new Date(member.joined_at).getFullYear();

  return (
    <div className="space-y-6">
      <div>
        <span className="inline-flex items-center gap-2 text-[10px] font-semibold uppercase tracking-[0.2em] text-gray-400 dark:text-gray-500 mb-2">
          <span className="w-4 h-px bg-accent" />Account
        </span>
        <h1 className="font-display font-light text-3xl sm:text-4xl text-gray-900 dark:text-white">
          My <em className="italic text-brand-900 dark:text-brand-300">Profile</em>
        </h1>
      </div>

      <ProfileForm
        fullName={member.full_name}
        email={user.email ?? ''}
        phone={member.phone ?? ''}
        joinedYear={joinedYear}
      />
    </div>
  );
}

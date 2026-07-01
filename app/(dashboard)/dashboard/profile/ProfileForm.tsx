'use client';
import { useRef, useState } from 'react';
import Image from 'next/image';
import { createClient } from '@/lib/supabase/client';

type Props = {
  fullName: string;
  email: string;
  phone: string;
  joinedYear: number;
  avatarUrl: string | null;
  userId: string;
};

const MAX_SIZE = 5 * 1024 * 1024; // 5 MB

export default function ProfileForm({ fullName, email, phone, joinedYear, avatarUrl, userId }: Props) {
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState('');
  const [saving, setSaving] = useState(false);
  const [name, setName] = useState(fullName);
  const [phoneVal, setPhoneVal] = useState(phone);

  const [avatar, setAvatar] = useState<string | null>(avatarUrl);
  const [avatarLoading, setAvatarLoading] = useState(false);
  const [avatarError, setAvatarError] = useState('');
  const fileRef = useRef<HTMLInputElement>(null);

  const initial = (name || fullName)[0]?.toUpperCase() ?? 'M';

  async function handleAvatarChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      setAvatarError('Please select an image file.');
      return;
    }
    if (file.size > MAX_SIZE) {
      setAvatarError('Image must be under 5 MB.');
      return;
    }

    setAvatarLoading(true);
    setAvatarError('');

    const supabase = createClient();
    const path = `${userId}/avatar`;

    const { error: uploadError } = await supabase.storage
      .from('avatars')
      .upload(path, file, { upsert: true, contentType: file.type });

    if (uploadError) {
      setAvatarError('Upload failed. Please try again.');
      setAvatarLoading(false);
      return;
    }

    const { data: { publicUrl } } = supabase.storage.from('avatars').getPublicUrl(path);
    const urlWithBust = `${publicUrl}?t=${Date.now()}`;

    const { error: dbError } = await supabase
      .from('members')
      .update({ avatar_url: publicUrl })
      .eq('user_id', userId);

    if (dbError) {
      setAvatarError('Saved image but failed to update profile.');
    } else {
      setAvatar(urlWithBust);
    }

    setAvatarLoading(false);
    if (fileRef.current) fileRef.current.value = '';
  }

  async function handleAvatarDelete() {
    setAvatarLoading(true);
    setAvatarError('');

    const supabase = createClient();
    const path = `${userId}/avatar`;

    await supabase.storage.from('avatars').remove([path]);

    const { error: dbError } = await supabase
      .from('members')
      .update({ avatar_url: null })
      .eq('user_id', userId);

    if (dbError) {
      setAvatarError('Failed to remove profile picture.');
    } else {
      setAvatar(null);
    }

    setAvatarLoading(false);
  }

  async function handleSave(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    setError('');
    const supabase = createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) { setError('Not authenticated.'); setSaving(false); return; }
    const { error: err } = await supabase
      .from('members')
      .update({ full_name: name.trim(), phone: phoneVal.trim() || null, updated_at: new Date().toISOString() })
      .eq('user_id', user.id);
    setSaving(false);
    if (err) { setError('Failed to save. Please try again.'); return; }
    setSaved(true);
    setTimeout(() => setSaved(false), 2500);
  }

  return (
    <div className="grid lg:grid-cols-3 gap-6">
      <div className="lg:col-span-1 space-y-4">
        <div className="bg-white dark:bg-gray-900 rounded-lg border border-gray-100 dark:border-gray-800 shadow-sm p-6 text-center">
          {/* Avatar */}
          <div className="relative inline-block mb-4">
            <div className="w-24 h-24 rounded-lg bg-gradient-to-br from-brand-700 to-brand-900 border-4 border-white dark:border-gray-800 shadow-lg flex items-center justify-center mx-auto overflow-hidden">
              {avatar ? (
                <Image src={avatar} alt={name || fullName} fill className="object-cover" sizes="96px" />
              ) : (
                <span className="font-display text-4xl font-light text-accent">{initial}</span>
              )}
              {avatarLoading && (
                <div className="absolute inset-0 bg-black/40 flex items-center justify-center rounded-lg">
                  <svg className="w-6 h-6 text-white animate-spin" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
                  </svg>
                </div>
              )}
            </div>

            {/* Upload button overlay */}
            {!avatarLoading && (
              <button
                type="button"
                onClick={() => fileRef.current?.click()}
                className="absolute -bottom-2 -right-2 w-8 h-8 rounded-full bg-accent hover:bg-accent-hover text-brand-950 flex items-center justify-center shadow-md transition-all"
                title="Change photo"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
              </button>
            )}
          </div>

          <input
            ref={fileRef}
            type="file"
            accept="image/*"
            className="hidden"
            onChange={handleAvatarChange}
          />

          {avatarError && <p className="text-xs text-red-500 mb-3">{avatarError}</p>}

          <h2 className="font-semibold text-gray-900 dark:text-white text-lg leading-none mb-0.5">{name || fullName}</h2>
          <p className="text-gray-400 dark:text-gray-500 text-sm mb-4">{email}</p>

          <div className="flex flex-col items-center gap-2">
            <div className="inline-flex items-center gap-1.5 bg-green-50 dark:bg-green-950/40 text-green-700 dark:text-green-400 text-xs font-semibold px-3 py-1 rounded-full">
              <span className="w-1.5 h-1.5 rounded-full bg-green-500" />Active Member
            </div>
            {avatar && !avatarLoading && (
              <button
                type="button"
                onClick={handleAvatarDelete}
                className="text-xs text-gray-400 dark:text-gray-500 hover:text-red-500 dark:hover:text-red-400 transition-colors"
              >
                Remove photo
              </button>
            )}
          </div>
        </div>

        <div className="bg-white dark:bg-gray-900 rounded-lg border border-gray-100 dark:border-gray-800 shadow-sm p-6 space-y-4">
          <h3 className="font-semibold text-gray-900 dark:text-white text-sm">Membership Details</h3>
          {[
            { label: 'Member Since', value: String(joinedYear) },
            { label: 'Membership Type', value: 'Community Member' },
          ].map((d) => (
            <div key={d.label} className="flex items-center justify-between">
              <span className="text-xs text-gray-400 dark:text-gray-500">{d.label}</span>
              <span className="text-xs font-semibold text-gray-700 dark:text-gray-200">{d.value}</span>
            </div>
          ))}
        </div>
      </div>

      <div className="lg:col-span-2 space-y-4">
        <div className="bg-white dark:bg-gray-900 rounded-lg border border-gray-100 dark:border-gray-800 shadow-sm overflow-hidden">
          <div className="px-6 py-5 border-b border-gray-50 dark:border-gray-800">
            <h3 className="font-semibold text-gray-900 dark:text-white">Personal Information</h3>
            <p className="text-xs text-gray-400 dark:text-gray-500 mt-0.5">Update your name and phone number.</p>
          </div>
          <form onSubmit={handleSave} className="p-6 space-y-4">
            <div>
              <label className="block text-[11px] font-semibold uppercase tracking-[0.1em] text-gray-400 dark:text-gray-500 mb-2">Full Name</label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
                className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-md text-gray-900 dark:text-white text-sm focus:outline-none focus:bg-white dark:focus:bg-gray-800 focus:ring-2 focus:ring-accent/30 focus:border-accent/50 transition-all duration-200 placeholder:text-gray-400 dark:placeholder:text-gray-500"
              />
            </div>

            <div>
              <label className="block text-[11px] font-semibold uppercase tracking-[0.1em] text-gray-400 dark:text-gray-500 mb-2">Email Address</label>
              <input
                type="email"
                value={email}
                disabled
                className="w-full px-4 py-3 bg-gray-100 dark:bg-gray-800/50 border border-gray-200 dark:border-gray-700 rounded-md text-gray-400 dark:text-gray-500 text-sm cursor-not-allowed"
              />
              <p className="text-[11px] text-gray-400 dark:text-gray-500 mt-1">Email cannot be changed after account creation.</p>
            </div>

            <div>
              <label className="block text-[11px] font-semibold uppercase tracking-[0.1em] text-gray-400 dark:text-gray-500 mb-2">Phone Number <span className="normal-case text-gray-300 dark:text-gray-600 font-normal tracking-normal">optional</span></label>
              <input
                type="tel"
                value={phoneVal}
                onChange={(e) => setPhoneVal(e.target.value)}
                placeholder="+1 (619) 555-0000"
                className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-md text-gray-900 dark:text-white text-sm focus:outline-none focus:bg-white dark:focus:bg-gray-800 focus:ring-2 focus:ring-accent/30 focus:border-accent/50 transition-all duration-200 placeholder:text-gray-400 dark:placeholder:text-gray-500"
              />
            </div>

            {error && <p className="text-sm text-red-500">{error}</p>}

            <div className="flex items-center justify-between pt-2">
              {saved && (
                <span className="flex items-center gap-1.5 text-green-600 dark:text-green-400 text-sm font-medium">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>
                  Changes saved
                </span>
              )}
              {!saved && <div />}
              <button
                type="submit"
                disabled={saving}
                className="bg-accent hover:bg-accent-hover disabled:opacity-60 text-brand-950 font-semibold px-6 py-2.5 rounded-md text-sm transition-all duration-200 shadow-[0_4px_12px_rgba(251,191,36,0.25)] hover:shadow-[0_4px_18px_rgba(251,191,36,0.4)]"
              >
                {saving ? 'Saving…' : 'Save Changes'}
              </button>
            </div>
          </form>
        </div>

      </div>
    </div>
  );
}

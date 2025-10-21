import React, { useState } from 'react';
import { Input } from '../components/Input';
import { Button } from '../components/Button';
import { TextArea } from '../components/TextArea';
import { api } from '../api/client';
import { useAuth } from '../context/AuthContext';

const SettingsPage: React.FC = () => {
  const { user, login, token } = useAuth();
  const [bio, setBio] = useState(user?.bio || '');
  const [email, setEmail] = useState(user?.email || '');
  const [status, setStatus] = useState('');

  const updateProfile = async () => {
    const response = await api.patch('/profile', { fullName: user?.full_name, bio });
    if (user && token) {
      login(token, { ...user, bio: response.data.bio });
    }
    setStatus('Profile updated');
  };

  const updateAccount = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const form = new FormData(event.currentTarget);
    await api.patch('/settings/account', {
      email,
      currentPassword: form.get('currentPassword'),
      newPassword: form.get('newPassword'),
    });
    if (user && token) {
      login(token, { ...user, email });
    }
    setStatus('Account updated');
  };

  const updatePreferences = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const form = new FormData(event.currentTarget);
    await api.patch('/settings/preferences', {
      emailLikes: Boolean(form.get('emailLikes')),
      emailComments: Boolean(form.get('emailComments')),
      emailSummary: Boolean(form.get('emailSummary')),
      profileVisibility: form.get('profileVisibility'),
      hideFromFeed: Boolean(form.get('hideFromFeed')),
    });
    setStatus('Preferences updated');
  };

  return (
    <div className="space-y-10">
      <div>
        <h1 className="text-3xl font-bold text-white">Settings</h1>
        <p className="text-gray-300">Own your presence. Tune your notifications. Stay in control.</p>
        {status && <p className="mt-3 text-green-300">{status}</p>}
      </div>

      <section className="bg-slate-800 border border-slate-700 rounded-2xl p-6 space-y-4">
        <h2 className="text-xl font-semibold text-white">Profile</h2>
        <TextArea label="Bio" value={bio} onChange={(event) => setBio(event.target.value)} rows={4} />
        <Button onClick={updateProfile} className="w-full md:w-auto">
          Save Profile
        </Button>
      </section>

      <section className="bg-slate-800 border border-slate-700 rounded-2xl p-6 space-y-4">
        <h2 className="text-xl font-semibold text-white">Account</h2>
        <form onSubmit={updateAccount} className="space-y-4">
          <Input label="Email" value={email} onChange={(event) => setEmail(event.target.value)} />
          <Input label="Current Password" name="currentPassword" type="password" />
          <Input label="New Password" name="newPassword" type="password" />
          <Button type="submit" className="w-full md:w-auto">
            Update Account
          </Button>
        </form>
      </section>

      <section className="bg-slate-800 border border-slate-700 rounded-2xl p-6 space-y-4">
        <h2 className="text-xl font-semibold text-white">Notifications & Privacy</h2>
        <form onSubmit={updatePreferences} className="space-y-4">
          <label className="flex items-center gap-2 text-sm text-gray-300">
            <input type="checkbox" name="emailLikes" defaultChecked /> Email me when someone hearts my act
          </label>
          <label className="flex items-center gap-2 text-sm text-gray-300">
            <input type="checkbox" name="emailComments" defaultChecked /> Email me when someone comments
          </label>
          <label className="flex items-center gap-2 text-sm text-gray-300">
            <input type="checkbox" name="emailSummary" defaultChecked /> Weekly kindness summary
          </label>
          <label className="flex items-center gap-2 text-sm text-gray-300">
            <input type="checkbox" name="hideFromFeed" /> Hide my acts from community feed
          </label>
          <label className="block space-y-2">
            <span className="text-sm text-gray-300 uppercase tracking-wide">Profile visibility</span>
            <select
              name="profileVisibility"
              className="w-full rounded-lg bg-slate-900 border border-slate-700 px-4 py-3 text-white"
              defaultValue="public"
            >
              <option value="public">Public</option>
              <option value="community">Community</option>
              <option value="private">Private</option>
            </select>
          </label>
          <Button type="submit" className="w-full md:w-auto">
            Save Preferences
          </Button>
        </form>
      </section>
    </div>
  );
};

export default SettingsPage;

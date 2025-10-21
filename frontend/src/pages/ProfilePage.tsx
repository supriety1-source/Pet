import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { api } from '../api/client';
import { ActCard, Act } from '../components/ActCard';

interface ProfileData {
  user: {
    id: string;
    username: string;
    full_name?: string;
    bio?: string;
    created_at: string;
    avatar_url?: string;
  };
  stats: {
    total_credits: number;
    total_acts_verified: number;
    current_streak: number;
    longest_streak: number;
    service_leader_tier?: string;
  } | null;
  acts: Act[];
}

const ProfilePage: React.FC = () => {
  const { username } = useParams();
  const [data, setData] = useState<ProfileData | null>(null);

  useEffect(() => {
    const load = async () => {
      const response = await api.get(`/profile/${username}`);
      setData(response.data);
    };
    load();
  }, [username]);

  if (!data) {
    return <p className="text-purple-200">Loading profile…</p>;
  }

  return (
    <div className="space-y-8">
      <div className="bg-slate-800 border border-slate-700 rounded-2xl p-8 flex flex-col md:flex-row md:items-center md:justify-between gap-6">
        <div className="flex items-center gap-4">
          <div className="w-20 h-20 rounded-full bg-purple-500 flex items-center justify-center text-3xl font-bold">
            {data.user.username.charAt(0).toUpperCase()}
          </div>
          <div>
            <h1 className="text-3xl font-bold text-white">{data.user.full_name || data.user.username}</h1>
            <p className="text-gray-400">@{data.user.username}</p>
            <p className="text-sm text-gray-300 max-w-xl mt-2">{data.user.bio || 'No bio yet.'}</p>
          </div>
        </div>
        {data.stats?.service_leader_tier && (
          <div className="bg-purple-500/20 border border-purple-400/40 rounded-xl px-4 py-2 text-purple-100">
            Service Leader — {data.stats.service_leader_tier.toUpperCase()}
          </div>
        )}
      </div>

      <div className="grid md:grid-cols-4 gap-6">
        <div className="bg-slate-800 border border-slate-700 rounded-xl p-5">
          <p className="text-sm text-gray-300 uppercase">Total Credits</p>
          <p className="text-2xl font-semibold text-purple-200">{data.stats?.total_credits ?? 0}</p>
        </div>
        <div className="bg-slate-800 border border-slate-700 rounded-xl p-5">
          <p className="text-sm text-gray-300 uppercase">Verified Acts</p>
          <p className="text-2xl font-semibold text-purple-200">{data.stats?.total_acts_verified ?? 0}</p>
        </div>
        <div className="bg-slate-800 border border-slate-700 rounded-xl p-5">
          <p className="text-sm text-gray-300 uppercase">Current Streak</p>
          <p className="text-2xl font-semibold text-purple-200">{data.stats?.current_streak ?? 0} days</p>
        </div>
        <div className="bg-slate-800 border border-slate-700 rounded-xl p-5">
          <p className="text-sm text-gray-300 uppercase">Longest Streak</p>
          <p className="text-2xl font-semibold text-purple-200">{data.stats?.longest_streak ?? 0} days</p>
        </div>
      </div>

      <section className="space-y-4">
        <h2 className="text-2xl font-semibold text-white">Verified Acts</h2>
        <div className="space-y-4">
          {data.acts.map((act) => (
            <ActCard key={act.id} act={act} />
          ))}
          {data.acts.length === 0 && <p className="text-gray-400">No verified acts yet. Stay tuned.</p>}
        </div>
      </section>
    </div>
  );
};

export default ProfilePage;

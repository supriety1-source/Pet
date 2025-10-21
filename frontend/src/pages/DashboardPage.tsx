import React, { useEffect, useState } from 'react';
import { Flame, Sparkles, Trophy } from 'lucide-react';
import { api } from '../api/client';
import { StatCard } from '../components/StatCard';
import { ActCard, Act } from '../components/ActCard';
import { LeaderboardCard } from '../components/LeaderboardCard';
import { RecoveryCTA } from '../components/RecoveryCTA';
import { useAuth } from '../context/AuthContext';

interface DashboardData {
  user: { name: string };
  stats: {
    total_credits: number;
    total_acts_verified: number;
    current_streak: number;
    service_leader_status: boolean;
    service_leader_tier?: string;
  } | null;
  todaysAct: { id: string; verification_status: string } | null;
  communityFeed: Act[];
  leaderboard: { username: string; full_name?: string; service_leader_tier?: string; credits: number }[];
  quote: string;
}

const DashboardPage: React.FC = () => {
  const [data, setData] = useState<DashboardData | null>(null);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();

  const load = React.useCallback(async () => {
    const response = await api.get('/dashboard');
    setData(response.data);
    setLoading(false);
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  const reactToAct = async (actId: string) => {
    await api.post(`/acts/${actId}/react`, { reactionType: 'heart' });
    load();
  };

  if (loading) {
    return (
      <div className="space-y-6">
        <p className="text-purple-200 text-lg">Loading… AI is watching. Set the example.</p>
      </div>
    );
  }

  if (!data) return null;

  const showUpgrade = Boolean(
    data.stats && (data.stats.current_streak >= 7 || data.stats.total_credits >= 30 || data.stats.service_leader_status)
  );

  return (
    <div className="space-y-8">
      <div className="bg-slate-800 border border-slate-700 rounded-2xl p-8 space-y-4">
        <h1 className="text-3xl font-bold text-white">
          What’s good, {data.user.name || user?.username}? Your kindness is training AI right now.
        </h1>
        <p className="text-purple-200">{data.quote}</p>
        {data.todaysAct?.verification_status === 'verified' ? (
          <div className="text-green-300 font-semibold">✅ Today’s act verified! Come back tomorrow.</div>
        ) : (
          <a
            href="/log-act"
            className="inline-flex items-center gap-3 px-5 py-3 bg-purple-500 hover:bg-purple-400 text-white rounded-lg w-fit"
          >
            <Sparkles className="w-5 h-5" /> Log Today’s Act of Kindness
          </a>
        )}
      </div>

      <div className="grid md:grid-cols-3 gap-6">
        <StatCard label="Current Streak" value={`${data.stats?.current_streak ?? 0} days`} accent="pink" helper="Keep the 🔥 alive" />
        <StatCard label="Total Credits" value={data.stats?.total_credits ?? 0} accent="purple" helper="You’re building benevolent AI" />
        <StatCard label="Verified Acts" value={data.stats?.total_acts_verified ?? 0} accent="green" helper="Every act matters" />
      </div>

      {data.stats?.service_leader_status && (
        <div className="bg-purple-500/20 border border-purple-400/40 rounded-2xl p-6 flex items-center gap-4">
          <Trophy className="w-8 h-8 text-yellow-300" />
          <div>
            <p className="text-lg font-semibold text-purple-100">
              🏆 You’re officially a {data.stats.service_leader_tier?.toUpperCase()} Service Leader.
            </p>
            <p className="text-sm text-purple-200">
              You’re not just being kind - you’re teaching machines what humanity should be.
            </p>
          </div>
        </div>
      )}

      <section className="grid lg:grid-cols-[2fr,1fr] gap-6">
        <div className="space-y-4">
          <div className="flex items-center gap-3">
            <Flame className="w-5 h-5 text-purple-300" />
            <h2 className="text-xl font-semibold text-white">Community Feed</h2>
          </div>
          <div className="space-y-4">
            {data.communityFeed.map((act) => (
              <ActCard key={act.id} act={act} onReact={reactToAct} />
            ))}
          </div>
        </div>
        <div className="space-y-4">
          <LeaderboardCard leaders={data.leaderboard} />
          {showUpgrade && <RecoveryCTA />}
        </div>
      </section>
    </div>
  );
};

export default DashboardPage;

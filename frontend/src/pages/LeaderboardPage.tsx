import React, { useEffect, useState } from 'react';
import { api } from '../api/client';
import { Tabs } from '../components/Tabs';

interface Leader {
  username: string;
  full_name?: string;
  avatar_url?: string;
  current_streak?: number;
  service_leader_tier?: string;
  credits: number;
}

const ranges = [
  { id: 'week', label: 'This Week' },
  { id: 'month', label: 'This Month' },
  { id: 'all', label: 'All Time' },
];

const tierStyles: Record<string, string> = {
  gold: 'text-yellow-300',
  silver: 'text-slate-200',
  bronze: 'text-amber-400',
};

const LeaderboardPage: React.FC = () => {
  const [leaders, setLeaders] = useState<Leader[]>([]);
  const [range, setRange] = useState('week');

  useEffect(() => {
    const load = async () => {
      const response = await api.get('/leaderboard', { params: { range } });
      setLeaders(response.data);
    };
    load();
  }, [range]);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-white">Service Leaderboard</h1>
        <p className="text-gray-300">Top humans training AI for benevolence. Keep pushing.</p>
      </div>
      <Tabs tabs={ranges} activeTab={range} onChange={setRange} />
      <div className="bg-slate-800 border border-slate-700 rounded-2xl">
        <div className="grid grid-cols-5 px-6 py-4 text-xs uppercase tracking-wide text-gray-400">
          <span>#</span>
          <span className="col-span-2">Service Leader</span>
          <span>Credits</span>
          <span>Streak</span>
        </div>
        <ul className="divide-y divide-slate-700">
          {leaders.map((leader, index) => (
            <li key={leader.username} className="grid grid-cols-5 px-6 py-4 items-center text-sm">
              <span className="text-purple-300 font-bold text-lg">{index + 1}</span>
              <div className="col-span-2">
                <p className="font-semibold text-white">{leader.full_name || leader.username}</p>
                <p className="text-xs text-gray-400">@{leader.username}</p>
                {leader.service_leader_tier && (
                  <span className={`text-xs ${tierStyles[leader.service_leader_tier] || 'text-purple-200'}`}>
                    {leader.service_leader_tier.toUpperCase()} Tier
                  </span>
                )}
              </div>
              <span className="text-green-300 font-semibold">{leader.credits}</span>
              <span className="text-gray-300">{leader.current_streak ?? 0} days</span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default LeaderboardPage;

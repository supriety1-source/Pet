import React from 'react';

type Leader = {
  username: string;
  full_name?: string;
  avatar_url?: string;
  current_streak?: number;
  service_leader_tier?: string;
  credits: number;
};

type Props = {
  leaders: Leader[];
};

const tierColor: Record<string, string> = {
  bronze: 'text-amber-400',
  silver: 'text-slate-200',
  gold: 'text-yellow-300',
};

export const LeaderboardCard: React.FC<Props> = ({ leaders }) => {
  return (
    <div className="bg-slate-800 rounded-xl border border-slate-700">
      <div className="px-5 py-4 border-b border-slate-700">
        <h3 className="font-semibold text-purple-200 uppercase tracking-wide">Service Leaders</h3>
      </div>
      <ul className="divide-y divide-slate-700">
        {leaders.map((leader, index) => (
          <li key={leader.username} className="px-5 py-4 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <span className="text-2xl font-bold text-purple-300">#{index + 1}</span>
              <div>
                <p className="font-semibold text-white">{leader.full_name || leader.username}</p>
                <p className="text-sm text-gray-400">@{leader.username}</p>
              </div>
            </div>
            <div className="text-right">
              <p className="text-green-300 font-semibold">{leader.credits} credits</p>
              {leader.service_leader_tier && (
                <p className={`text-xs uppercase ${tierColor[leader.service_leader_tier] || 'text-purple-200'}`}>
                  {leader.service_leader_tier} tier
                </p>
              )}
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
};

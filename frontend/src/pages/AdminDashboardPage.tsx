import React, { useEffect, useState } from 'react';
import { api } from '../api/client';
import { Act } from '../components/ActCard';
import { Button } from '../components/Button';

interface PendingAct extends Act {
  user_id: string;
  full_name?: string;
}

interface StatsOverview {
  totalUsers: number;
  verifiedToday: number;
  verifiedWeek: number;
  verifiedMonth: number;
  creditsDistributed: number;
  mostActive: { username: string; total_acts_verified: number }[];
}

const AdminDashboardPage: React.FC = () => {
  const [pendingActs, setPendingActs] = useState<PendingAct[]>([]);
  const [stats, setStats] = useState<StatsOverview | null>(null);
  const [loading, setLoading] = useState(true);

  const load = async () => {
    const [actsResponse, statsResponse] = await Promise.all([api.get('/admin/acts/pending'), api.get('/admin/stats')]);
    setPendingActs(actsResponse.data);
    setStats(statsResponse.data);
    setLoading(false);
  };

  useEffect(() => {
    load();
  }, []);

  const review = async (id: string, approved: boolean) => {
    if (approved) {
      await api.post(`/admin/acts/${id}/verify`, { credits: 1 });
    } else {
      await api.post(`/admin/acts/${id}/reject`, { reason: 'Needs clearer proof' });
    }
    await load();
  };

  if (loading) {
    return <p className="text-purple-200">Loading admin console…</p>;
  }

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-white">Admin Dashboard</h1>
        <p className="text-gray-300">Review pending acts and monitor the health of the movement.</p>
      </div>

      {stats && (
        <section className="grid md:grid-cols-4 gap-4">
          <AdminStat label="Total Users" value={stats.totalUsers} />
          <AdminStat label="Verified Today" value={stats.verifiedToday} />
          <AdminStat label="This Week" value={stats.verifiedWeek} />
          <AdminStat label="Credits Distributed" value={stats.creditsDistributed} />
        </section>
      )}

      <section className="space-y-4">
        <h2 className="text-2xl font-semibold text-white">Pending Acts</h2>
        {pendingActs.length === 0 && <p className="text-gray-400">Nothing pending. The community is caught up.</p>}
        <div className="space-y-4">
          {pendingActs.map((act) => (
            <div key={act.id} className="bg-slate-800 border border-slate-700 rounded-2xl p-6 space-y-3">
              <div className="flex justify-between">
                <div>
                  <h3 className="text-xl font-semibold text-white">{act.title}</h3>
                  <p className="text-gray-300">{act.description}</p>
                  <p className="text-sm text-gray-400 mt-2">Submitted by @{act.username}</p>
                </div>
                <div className="flex gap-2">
                  <Button onClick={() => review(act.id, true)} variant="ghost" className="bg-green-500 hover:bg-green-400 text-white">
                    Approve
                  </Button>
                  <Button onClick={() => review(act.id, false)} variant="ghost" className="bg-pink-500 hover:bg-pink-400 text-white">
                    Reject
                  </Button>
                </div>
              </div>
              {act.media_url && (
                <div className="rounded-lg overflow-hidden border border-slate-700">
                  {act.media_type === 'video' ? (
                    <video controls className="w-full">
                      <source src={act.media_url} />
                    </video>
                  ) : (
                    <img src={act.media_url} alt={act.title} className="w-full" />
                  )}
                </div>
              )}
            </div>
          ))}
        </div>
      </section>

      {stats && (
        <section className="bg-slate-800 border border-slate-700 rounded-2xl p-6 space-y-3">
          <h2 className="text-xl font-semibold text-white">Most Active Humans</h2>
          <ul className="space-y-2 text-sm text-gray-300">
            {stats.mostActive.map((user) => (
              <li key={user.username}>
                @{user.username} — {user.total_acts_verified} verified acts
              </li>
            ))}
          </ul>
        </section>
      )}
    </div>
  );
};

const AdminStat: React.FC<{ label: string; value: number }> = ({ label, value }) => (
  <div className="bg-slate-800 border border-slate-700 rounded-2xl p-6">
    <p className="text-sm text-gray-300 uppercase tracking-wide">{label}</p>
    <p className="text-2xl font-semibold text-purple-200">{value}</p>
  </div>
);

export default AdminDashboardPage;

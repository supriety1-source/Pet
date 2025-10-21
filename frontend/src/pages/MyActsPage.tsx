import React, { useEffect, useState } from 'react';
import { api } from '../api/client';
import { ActCard, Act } from '../components/ActCard';
import { Tabs } from '../components/Tabs';

const tabs = [
  { id: 'all', label: 'All' },
  { id: 'verified', label: 'Verified' },
  { id: 'pending', label: 'Pending' },
];

const MyActsPage: React.FC = () => {
  const [acts, setActs] = useState<Act[]>([]);
  const [activeTab, setActiveTab] = useState('all');

  const load = React.useCallback(async () => {
    const response = await api.get('/acts', {
      params: {
        mine: true,
        status: activeTab === 'all' ? undefined : activeTab,
      },
    });
    setActs(response.data);
  }, [activeTab]);

  useEffect(() => {
    load();
  }, [load]);

  const editAct = async (act: Act) => {
    const nextTitle = window.prompt('Update your title', act.title);
    if (!nextTitle) return;
    const nextDescription = window.prompt('Update your description', act.description);
    if (!nextDescription) return;
    await api.patch(`/acts/${act.id}`, { title: nextTitle, description: nextDescription });
    load();
  };

  const deleteAct = async (actId: string) => {
    if (!window.confirm('Delete this pending act?')) return;
    await api.delete(`/acts/${actId}`);
    load();
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-white">Your Kindness Acts</h1>
        <p className="text-gray-300">Manage your pending and verified acts. Edit pending ones before review.</p>
      </div>
      <Tabs tabs={tabs} activeTab={activeTab} onChange={setActiveTab} />
      <div className="space-y-4">
        {acts.map((act) => (
          <ActCard
            key={act.id}
            act={act}
            actions={
              act.verification_status === 'pending' && (
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => editAct(act)}
                    className="px-3 py-1 rounded bg-slate-700 text-sm text-purple-200 hover:bg-purple-500 hover:text-white"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => deleteAct(act.id)}
                    className="px-3 py-1 rounded bg-pink-500 text-sm text-white hover:bg-pink-400"
                  >
                    Delete
                  </button>
                </div>
              )
            }
          />
        ))}
        {acts.length === 0 && <p className="text-gray-400">No acts yet. Log your kindness to train AI.</p>}
      </div>
    </div>
  );
};

export default MyActsPage;

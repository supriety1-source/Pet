import React, { useEffect, useState } from 'react';
import { api } from '../api/client';
import { ActCard, Act } from '../components/ActCard';
import { Tabs } from '../components/Tabs';

const filters = [
  { id: 'today', label: 'Today' },
  { id: 'week', label: 'This Week' },
  { id: 'all', label: 'All Time' },
];

const sorts = [
  { id: 'recent', label: 'Recent' },
  { id: 'likes', label: 'Most Liked' },
  { id: 'comments', label: 'Most Commented' },
];

const CommunityPage: React.FC = () => {
  const [acts, setActs] = useState<Act[]>([]);
  const [activeFilter, setActiveFilter] = useState('week');
  const [activeSort, setActiveSort] = useState('recent');

  const load = React.useCallback(async () => {
    const response = await api.get('/community', {
      params: {
        filter: activeFilter === 'all' ? undefined : activeFilter,
        sort: activeSort,
      },
    });
    setActs(response.data);
  }, [activeFilter, activeSort]);

  useEffect(() => {
    load();
  }, [load]);

  const reactToAct = async (actId: string) => {
    await api.post(`/acts/${actId}/react`, { reactionType: 'heart' });
    load();
  };

  const commentOnAct = async (actId: string) => {
    const comment = window.prompt('Drop a comment of encouragement:');
    if (!comment) return;
    await api.post(`/acts/${actId}/comments`, { comment });
    load();
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-white">Community Feed</h1>
        <p className="text-gray-300">Verified acts from the entire community. Drop hearts and comments to hype kindness.</p>
      </div>
      <div className="flex flex-col lg:flex-row gap-4 justify-between">
        <Tabs tabs={filters} activeTab={activeFilter} onChange={setActiveFilter} />
        <Tabs tabs={sorts} activeTab={activeSort} onChange={setActiveSort} />
      </div>
      <div className="space-y-4">
        {acts.map((act) => (
          <ActCard key={act.id} act={act} onReact={reactToAct} onComment={commentOnAct} />
        ))}
      </div>
    </div>
  );
};

export default CommunityPage;

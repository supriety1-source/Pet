import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { actsAPI, userAPI } from '../services/api';
import { KindnessAct } from '../types';
import { Button } from '../components/ui/Button';
import { Card } from '../components/ui/Card';
import { getDailyQuote } from '../utils/quotes';
import { Flame, Sparkles, Plus, TrendingUp } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';

export const DashboardPage: React.FC = () => {
  const { user, stats, refreshUser } = useAuth();
  const [feed, setFeed] = useState<KindnessAct[]>([]);
  const [leaderboard, setLeaderboard] = useState<any[]>([]);
  const [hasLoggedToday, setHasLoggedToday] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadDashboardData();
  }, []);

  const loadDashboardData = async () => {
    try {
      // Load community feed
      const feedResponse = await actsAPI.getCommunityFeed({ limit: 10 });
      setFeed(feedResponse.data.acts);

      // Load leaderboard preview
      const leaderboardResponse = await userAPI.getLeaderboard({ limit: 5 });
      setLeaderboard(leaderboardResponse.data.leaderboard);

      // Check if user has logged today
      const myActsResponse = await actsAPI.getMyActs();
      const todayActs = myActsResponse.data.acts.filter((act: KindnessAct) => {
        const actDate = new Date(act.act_date);
        const today = new Date();
        return actDate.toDateString() === today.toDateString();
      });
      setHasLoggedToday(todayActs.length > 0);

      await refreshUser();
    } catch (error) {
      console.error('Failed to load dashboard:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const getServiceLeaderBadge = (tier?: string) => {
    if (!tier) return null;
    const colors = {
      bronze: 'bg-orange-100 text-orange-800 border-orange-300',
      silver: 'bg-gray-100 text-gray-800 border-gray-300',
      gold: 'bg-yellow-100 text-yellow-800 border-yellow-300',
    };
    return (
      <span className={`px-2 py-1 rounded-full text-xs font-semibold border ${colors[tier as keyof typeof colors]}`}>
        {tier.toUpperCase()} LEADER
      </span>
    );
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-gray-medium">{getDailyQuote()}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-light pb-12">
      {/* Header */}
      <div className="bg-gradient-to-r from-primary to-primary-light text-white py-8 px-4">
        <div className="max-w-6xl mx-auto">
          <h1 className="text-3xl font-bold mb-2">
            Welcome back, {user?.full_name || user?.username}!
          </h1>
          <p className="text-primary-lighter italic">"{getDailyQuote()}"</p>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 -mt-6">
        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          <Card className="flex items-center space-x-4">
            <div className="bg-primary/10 p-3 rounded-lg">
              <Flame className="w-8 h-8 text-primary" />
            </div>
            <div>
              <p className="text-sm text-gray-medium">Current Streak</p>
              <p className="text-2xl font-bold text-gray-dark">{stats?.current_streak || 0} days</p>
            </div>
          </Card>

          <Card className="flex items-center space-x-4">
            <div className="bg-accent-green/10 p-3 rounded-lg">
              <Sparkles className="w-8 h-8 text-accent-green" />
            </div>
            <div>
              <p className="text-sm text-gray-medium">Total Credits</p>
              <p className="text-2xl font-bold text-gray-dark">{stats?.total_credits || 0}</p>
            </div>
          </Card>

          <Card className="flex items-center space-x-4">
            <div className="bg-accent-pink/10 p-3 rounded-lg">
              <TrendingUp className="w-8 h-8 text-accent-pink" />
            </div>
            <div>
              <p className="text-sm text-gray-medium">Acts Verified</p>
              <p className="text-2xl font-bold text-gray-dark">{stats?.total_acts_verified || 0}</p>
            </div>
          </Card>
        </div>

        {/* Service Leader Status */}
        {stats?.service_leader_status && (
          <Card className="mb-8 bg-gradient-to-r from-primary/5 to-primary-light/5 border-2 border-primary">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-xl font-bold text-gray-dark mb-1">
                  You're a Service Leader!
                </h3>
                <p className="text-gray-medium">
                  You're not just being kind - you're teaching machines what humanity should be.
                </p>
              </div>
              {getServiceLeaderBadge(stats.service_leader_tier)}
            </div>
          </Card>
        )}

        {/* Daily Log CTA */}
        <Card className="mb-8">
          {hasLoggedToday ? (
            <div className="text-center py-4">
              <div className="text-4xl mb-2">✅</div>
              <h3 className="text-xl font-bold text-gray-dark mb-2">Today's act verified!</h3>
              <p className="text-gray-medium">Come back tomorrow to continue your streak.</p>
            </div>
          ) : (
            <div className="text-center py-4">
              <h3 className="text-xl font-bold text-gray-dark mb-4">
                Ready to make a difference today?
              </h3>
              <Link to="/log-act">
                <Button size="lg">
                  <Plus className="w-5 h-5 mr-2" />
                  Log Today's Act of Kindness
                </Button>
              </Link>
            </div>
          )}
        </Card>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Community Feed */}
          <div className="lg:col-span-2">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-2xl font-bold text-gray-dark">Community Feed</h2>
              <Link to="/community" className="text-primary hover:underline">
                View all
              </Link>
            </div>

            <div className="space-y-4">
              {feed.map((act) => (
                <Card key={act.id}>
                  <div className="flex items-start space-x-3">
                    <div className="flex-shrink-0">
                      <div className="w-12 h-12 bg-primary text-white rounded-full flex items-center justify-center font-bold">
                        {act.username?.[0]?.toUpperCase() || 'U'}
                      </div>
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center space-x-2">
                        <p className="font-semibold text-gray-dark">{act.username}</p>
                        {act.service_leader_tier && getServiceLeaderBadge(act.service_leader_tier)}
                      </div>
                      <p className="text-sm text-gray-medium mb-2">
                        {formatDistanceToNow(new Date(act.created_at), { addSuffix: true })}
                      </p>
                      <h4 className="font-semibold text-gray-dark mb-1">{act.title}</h4>
                      <p className="text-gray-dark text-sm">{act.description}</p>
                      {act.media_url && (
                        <img
                          src={act.media_url}
                          alt={act.title}
                          className="mt-3 rounded-lg max-h-64 object-cover w-full"
                        />
                      )}
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          </div>

          {/* Leaderboard Preview */}
          <div>
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-2xl font-bold text-gray-dark">Top Leaders</h2>
              <Link to="/leaderboard" className="text-primary hover:underline">
                View all
              </Link>
            </div>

            <Card>
              <div className="space-y-3">
                {leaderboard.map((leader, index) => (
                  <div key={leader.id} className="flex items-center space-x-3">
                    <div className="flex-shrink-0 w-8 text-center font-bold text-gray-medium">
                      #{index + 1}
                    </div>
                    <div className="w-10 h-10 bg-primary text-white rounded-full flex items-center justify-center font-bold">
                      {leader.username?.[0]?.toUpperCase()}
                    </div>
                    <div className="flex-1">
                      <p className="font-semibold text-gray-dark">{leader.username}</p>
                      <p className="text-sm text-gray-medium">{leader.total_credits} credits</p>
                    </div>
                    {leader.service_leader_tier && getServiceLeaderBadge(leader.service_leader_tier)}
                  </div>
                ))}
              </div>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { actsAPI } from '../services/api';
import { KindnessAct } from '../types';
import { Card } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { CheckCircle, Clock, XCircle, Calendar, MapPin, Image as ImageIcon, Video } from 'lucide-react';
import { format, formatDistanceToNow } from 'date-fns';

export const MyActsPage: React.FC = () => {
  const [acts, setActs] = useState<KindnessAct[]>([]);
  const [activeTab, setActiveTab] = useState<'all' | 'verified' | 'pending'>('all');
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadActs();
  }, [activeTab]);

  const loadActs = async () => {
    setIsLoading(true);
    try {
      const status = activeTab === 'all' ? undefined : activeTab;
      const response = await actsAPI.getMyActs(status);
      setActs(response.data.acts);
    } catch (error) {
      console.error('Error loading acts:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const getStatusBadge = (status: string) => {
    if (status === 'verified') {
      return (
        <div className="flex items-center space-x-1 px-3 py-1 bg-accent-green/10 text-accent-green rounded-full">
          <CheckCircle className="w-4 h-4" />
          <span className="text-sm font-semibold">Verified</span>
        </div>
      );
    } else if (status === 'pending') {
      return (
        <div className="flex items-center space-x-1 px-3 py-1 bg-yellow-100 text-yellow-700 rounded-full">
          <Clock className="w-4 h-4" />
          <span className="text-sm font-semibold">Pending Review</span>
        </div>
      );
    } else {
      return (
        <div className="flex items-center space-x-1 px-3 py-1 bg-red-100 text-red-600 rounded-full">
          <XCircle className="w-4 h-4" />
          <span className="text-sm font-semibold">Rejected</span>
        </div>
      );
    }
  };

  const getCategoryBadge = (category: string) => {
    const badges = {
      online: { color: 'bg-blue-100 text-blue-700', label: 'Online Kindness' },
      offline: { color: 'bg-purple-100 text-purple-700', label: 'Offline Kindness' },
      community: { color: 'bg-green-100 text-green-700', label: 'Community Support' },
    };
    const badge = badges[category as keyof typeof badges] || badges.offline;
    return (
      <span className={`px-2 py-1 rounded text-xs font-medium ${badge.color}`}>
        {badge.label}
      </span>
    );
  };

  const getTabCount = (tab: 'all' | 'verified' | 'pending') => {
    if (tab === 'all') return acts.length;
    return acts.filter(act => act.verification_status === tab).length;
  };

  return (
    <div className="min-h-screen bg-light py-8 px-4">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-dark mb-2">My Acts of Kindness</h1>
            <p className="text-gray-medium">
              Track your submissions and see your impact on AI training
            </p>
          </div>
          <Link to="/log-act" className="mt-4 md:mt-0">
            <Button>+ Log New Act</Button>
          </Link>
        </div>

        {/* Tabs */}
        <div className="flex space-x-2 md:space-x-4 mb-6 border-b border-gray-200 overflow-x-auto">
          <button
            onClick={() => setActiveTab('all')}
            className={`pb-3 px-4 font-semibold whitespace-nowrap transition-colors ${
              activeTab === 'all'
                ? 'border-b-2 border-primary text-primary'
                : 'text-gray-medium hover:text-gray-dark'
            }`}
          >
            All Acts
            {acts.length > 0 && (
              <span className="ml-2 text-xs px-2 py-1 bg-gray-200 rounded-full">
                {acts.length}
              </span>
            )}
          </button>
          <button
            onClick={() => setActiveTab('verified')}
            className={`pb-3 px-4 font-semibold whitespace-nowrap transition-colors ${
              activeTab === 'verified'
                ? 'border-b-2 border-primary text-primary'
                : 'text-gray-medium hover:text-gray-dark'
            }`}
          >
            Verified
            {acts.filter(a => a.verification_status === 'verified').length > 0 && (
              <span className="ml-2 text-xs px-2 py-1 bg-accent-green/20 text-accent-green rounded-full">
                {acts.filter(a => a.verification_status === 'verified').length}
              </span>
            )}
          </button>
          <button
            onClick={() => setActiveTab('pending')}
            className={`pb-3 px-4 font-semibold whitespace-nowrap transition-colors ${
              activeTab === 'pending'
                ? 'border-b-2 border-primary text-primary'
                : 'text-gray-medium hover:text-gray-dark'
            }`}
          >
            Pending
            {acts.filter(a => a.verification_status === 'pending').length > 0 && (
              <span className="ml-2 text-xs px-2 py-1 bg-yellow-100 text-yellow-700 rounded-full">
                {acts.filter(a => a.verification_status === 'pending').length}
              </span>
            )}
          </button>
        </div>

        {/* Loading State */}
        {isLoading ? (
          <div className="text-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
            <p className="text-gray-medium">Loading your acts...</p>
          </div>
        ) : acts.length === 0 ? (
          // Empty State
          <Card className="text-center py-12">
            <div className="max-w-md mx-auto">
              <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <CheckCircle className="w-8 h-8 text-primary" />
              </div>
              <h3 className="text-xl font-semibold text-gray-dark mb-2">
                {activeTab === 'all' && "No acts logged yet"}
                {activeTab === 'verified' && "No verified acts yet"}
                {activeTab === 'pending' && "No pending acts"}
              </h3>
              <p className="text-gray-medium mb-6">
                {activeTab === 'all'
                  ? "Start logging your acts of kindness to train AI toward benevolence!"
                  : activeTab === 'verified'
                  ? "Your verified acts will appear here once they're reviewed"
                  : "You have no acts awaiting review"}
              </p>
              {activeTab === 'all' && (
                <Link to="/log-act">
                  <Button>Log Your First Act</Button>
                </Link>
              )}
            </div>
          </Card>
        ) : (
          // Acts List
          <div className="space-y-4">
            {acts.map((act) => (
              <Card key={act.id} className="hover:shadow-lg transition-shadow">
                {/* Header Row */}
                <div className="flex flex-col md:flex-row md:items-start md:justify-between mb-4 space-y-3 md:space-y-0">
                  <div className="flex-1">
                    <div className="flex items-start justify-between mb-2">
                      <h3 className="text-xl font-bold text-gray-dark pr-4">{act.title}</h3>
                      {getStatusBadge(act.verification_status)}
                    </div>
                    <div className="flex flex-wrap items-center gap-2 text-sm text-gray-medium">
                      <div className="flex items-center space-x-1">
                        <Calendar className="w-4 h-4" />
                        <span>{format(new Date(act.act_date), 'MMM d, yyyy')}</span>
                      </div>
                      <span>•</span>
                      <span>{formatDistanceToNow(new Date(act.created_at), { addSuffix: true })}</span>
                      {act.location && (
                        <>
                          <span>•</span>
                          <div className="flex items-center space-x-1">
                            <MapPin className="w-4 h-4" />
                            <span>{act.location}</span>
                          </div>
                        </>
                      )}
                    </div>
                  </div>
                </div>

                {/* Description */}
                <p className="text-gray-dark mb-4 leading-relaxed">{act.description}</p>

                {/* Media */}
                {act.media_url && (
                  <div className="mb-4 rounded-lg overflow-hidden">
                    {act.media_type === 'image' ? (
                      <img
                        src={act.media_url}
                        alt={act.title}
                        className="w-full max-h-96 object-cover"
                      />
                    ) : act.media_type === 'video' ? (
                      <video
                        src={act.media_url}
                        controls
                        className="w-full max-h-96"
                      />
                    ) : null}
                  </div>
                )}

                {/* Footer Row */}
                <div className="flex flex-col md:flex-row md:items-center md:justify-between pt-4 border-t border-gray-200 space-y-3 md:space-y-0">
                  <div className="flex items-center space-x-3">
                    {getCategoryBadge(act.category)}
                    {act.media_url && (
                      <div className="flex items-center space-x-1 text-gray-medium text-sm">
                        {act.media_type === 'image' ? (
                          <ImageIcon className="w-4 h-4" />
                        ) : (
                          <Video className="w-4 h-4" />
                        )}
                        <span>Media attached</span>
                      </div>
                    )}
                  </div>

                  {/* Credits Earned (Verified only) */}
                  {act.verification_status === 'verified' && (
                    <div className="flex items-center space-x-2 bg-accent-green/10 px-4 py-2 rounded-lg">
                      <span className="text-2xl">✨</span>
                      <div>
                        <p className="text-xs text-gray-medium">Credits Earned</p>
                        <p className="text-lg font-bold text-accent-green">
                          +{act.credits_awarded}
                        </p>
                      </div>
                    </div>
                  )}
                </div>

                {/* Rejection Reason (Rejected only) */}
                {act.rejection_reason && (
                  <div className="mt-4 p-4 bg-red-50 border border-red-200 rounded-lg">
                    <div className="flex items-start space-x-2">
                      <XCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
                      <div>
                        <p className="font-semibold text-red-700 mb-1">Rejection Reason:</p>
                        <p className="text-sm text-red-600">{act.rejection_reason}</p>
                      </div>
                    </div>
                  </div>
                )}

                {/* Pending Message */}
                {act.verification_status === 'pending' && (
                  <div className="mt-4 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
                    <div className="flex items-start space-x-2">
                      <Clock className="w-5 h-5 text-yellow-600 flex-shrink-0 mt-0.5" />
                      <div>
                        <p className="text-sm text-yellow-700">
                          <strong>Under Review:</strong> Your act is being verified. This usually takes less than 24 hours.
                          You'll be notified once it's reviewed!
                        </p>
                      </div>
                    </div>
                  </div>
                )}
              </Card>
            ))}
          </div>
        )}

        {/* Bottom Info */}
        {acts.length > 0 && (
          <div className="mt-8 text-center">
            <p className="text-gray-medium text-sm">
              Every verified act trains AI to be more benevolent. Keep going! 🟣
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

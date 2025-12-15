import React, { useState, useEffect } from 'react';
import { adminAPI } from '../services/api';
import { KindnessAct } from '../types';
import { Card } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { Modal } from '../components/ui/Modal';
import { Textarea } from '../components/ui/Textarea';
import {
  Shield,
  Users,
  CheckCircle,
  XCircle,
  TrendingUp,
  Clock,
  AlertCircle,
  Calendar,
  MapPin,
  User,
  Mail,
} from 'lucide-react';
import { format, formatDistanceToNow } from 'date-fns';

interface AdminStats {
  total_users: number;
  pending_acts: number;
  verified_today: number;
  total_credits_distributed: number;
  most_active_users: Array<{
    username: string;
    total_acts_verified: number;
  }>;
}

export const AdminDashboardPage: React.FC = () => {
  const [stats, setStats] = useState<AdminStats | null>(null);
  const [pendingActs, setPendingActs] = useState<KindnessAct[]>([]);
  const [isLoadingStats, setIsLoadingStats] = useState(true);
  const [isLoadingActs, setIsLoadingActs] = useState(true);

  // Rejection modal state
  const [rejectModalOpen, setRejectModalOpen] = useState(false);
  const [selectedActId, setSelectedActId] = useState<string | null>(null);
  const [rejectionReason, setRejectionReason] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    loadDashboardData();
  }, []);

  const loadDashboardData = async () => {
    await Promise.all([loadStats(), loadPendingActs()]);
  };

  const loadStats = async () => {
    setIsLoadingStats(true);
    try {
      const response = await adminAPI.getStats();
      setStats(response.data);
    } catch (error) {
      console.error('Error loading stats:', error);
    } finally {
      setIsLoadingStats(false);
    }
  };

  const loadPendingActs = async () => {
    setIsLoadingActs(true);
    try {
      const response = await adminAPI.getPendingActs();
      setPendingActs(response.data.acts);
    } catch (error) {
      console.error('Error loading pending acts:', error);
    } finally {
      setIsLoadingActs(false);
    }
  };

  const handleVerify = async (actId: string) => {
    if (!confirm('Are you sure you want to verify this act? This will award credits to the user.')) {
      return;
    }

    try {
      await adminAPI.verifyAct(actId);
      // Remove from pending list
      setPendingActs(pendingActs.filter((act) => act.id !== actId));
      // Reload stats to update counts
      loadStats();
    } catch (error: any) {
      console.error('Error verifying act:', error);
      alert(error.response?.data?.error || 'Failed to verify act');
    }
  };

  const openRejectModal = (actId: string) => {
    setSelectedActId(actId);
    setRejectionReason('');
    setRejectModalOpen(true);
  };

  const handleReject = async () => {
    if (!selectedActId) return;

    if (!rejectionReason.trim()) {
      alert('Please provide a rejection reason');
      return;
    }

    setIsSubmitting(true);
    try {
      await adminAPI.rejectAct(selectedActId, rejectionReason.trim());
      // Remove from pending list
      setPendingActs(pendingActs.filter((act) => act.id !== selectedActId));
      // Reload stats
      loadStats();
      // Close modal
      setRejectModalOpen(false);
      setSelectedActId(null);
      setRejectionReason('');
    } catch (error: any) {
      console.error('Error rejecting act:', error);
      alert(error.response?.data?.error || 'Failed to reject act');
    } finally {
      setIsSubmitting(false);
    }
  };

  const getCategoryBadge = (category: string) => {
    const badges = {
      online: { color: 'bg-blue-100 text-blue-700', label: 'Online' },
      offline: { color: 'bg-purple-100 text-purple-700', label: 'Offline' },
      community: { color: 'bg-green-100 text-green-700', label: 'Community' },
    };
    const badge = badges[category as keyof typeof badges] || badges.offline;
    return (
      <span className={`px-2 py-1 rounded text-xs font-medium ${badge.color}`}>
        {badge.label}
      </span>
    );
  };

  return (
    <div className="min-h-screen bg-light py-8 px-4">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex items-center space-x-3 mb-8">
          <div className="bg-primary p-3 rounded-lg">
            <Shield className="w-8 h-8 text-white" />
          </div>
          <div>
            <h1 className="text-3xl font-bold text-gray-dark">Admin Dashboard</h1>
            <p className="text-gray-medium">Manage act verification and platform stats</p>
          </div>
        </div>

        {/* Stats Cards */}
        {isLoadingStats ? (
          <div className="text-center py-8">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
          </div>
        ) : stats ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
            {/* Total Users */}
            <Card className="flex items-center space-x-4">
              <div className="bg-blue-100 p-3 rounded-lg">
                <Users className="w-8 h-8 text-blue-600" />
              </div>
              <div>
                <p className="text-sm text-gray-medium">Total Users</p>
                <p className="text-2xl font-bold text-gray-dark">{stats.total_users}</p>
              </div>
            </Card>

            {/* Pending Acts */}
            <Card className="flex items-center space-x-4">
              <div className="bg-yellow-100 p-3 rounded-lg">
                <Clock className="w-8 h-8 text-yellow-600" />
              </div>
              <div>
                <p className="text-sm text-gray-medium">Pending Review</p>
                <p className="text-2xl font-bold text-gray-dark">{stats.pending_acts}</p>
              </div>
            </Card>

            {/* Verified Today */}
            <Card className="flex items-center space-x-4">
              <div className="bg-accent-green/20 p-3 rounded-lg">
                <CheckCircle className="w-8 h-8 text-accent-green" />
              </div>
              <div>
                <p className="text-sm text-gray-medium">Verified Today</p>
                <p className="text-2xl font-bold text-gray-dark">{stats.verified_today}</p>
              </div>
            </Card>

            {/* Total Credits */}
            <Card className="flex items-center space-x-4">
              <div className="bg-primary/10 p-3 rounded-lg">
                <TrendingUp className="w-8 h-8 text-primary" />
              </div>
              <div>
                <p className="text-sm text-gray-medium">Total Credits</p>
                <p className="text-2xl font-bold text-gray-dark">
                  {stats.total_credits_distributed}
                </p>
              </div>
            </Card>
          </div>
        ) : null}

        {/* Most Active Users */}
        {stats && stats.most_active_users.length > 0 && (
          <Card className="mb-8">
            <h3 className="text-lg font-semibold text-gray-dark mb-4">Most Active Users</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
              {stats.most_active_users.map((user, index) => (
                <div
                  key={user.username}
                  className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg"
                >
                  <div className="font-bold text-gray-medium">#{index + 1}</div>
                  <div>
                    <p className="font-semibold text-gray-dark">{user.username}</p>
                    <p className="text-sm text-gray-medium">
                      {user.total_acts_verified} acts
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </Card>
        )}

        {/* Pending Acts Section */}
        <div className="mb-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-2xl font-bold text-gray-dark">Pending Acts Review</h2>
            <div className="flex items-center space-x-2 text-gray-medium">
              <AlertCircle className="w-5 h-5" />
              <span className="text-sm">{pendingActs.length} awaiting review</span>
            </div>
          </div>

          {isLoadingActs ? (
            <div className="text-center py-12">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
              <p className="text-gray-medium">Loading pending acts...</p>
            </div>
          ) : pendingActs.length === 0 ? (
            <Card className="text-center py-12">
              <CheckCircle className="w-16 h-16 text-accent-green mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-gray-dark mb-2">
                All caught up!
              </h3>
              <p className="text-gray-medium">
                No pending acts to review. Great work! 🎉
              </p>
            </Card>
          ) : (
            <div className="space-y-6">
              {pendingActs.map((act) => (
                <Card key={act.id} className="border-l-4 border-yellow-500">
                  {/* User Info Header */}
                  <div className="flex items-center space-x-3 mb-4 pb-4 border-b border-gray-200">
                    <div className="w-12 h-12 bg-primary text-white rounded-full flex items-center justify-center font-bold text-lg">
                      {act.username?.[0]?.toUpperCase() || 'U'}
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center space-x-2">
                        <User className="w-4 h-4 text-gray-400" />
                        <span className="font-semibold text-gray-dark">{act.username}</span>
                      </div>
                      <div className="flex items-center space-x-2 text-sm text-gray-medium">
                        <Mail className="w-4 h-4" />
                        <span>{act.email}</span>
                      </div>
                    </div>
                    <div className="text-right text-sm text-gray-medium">
                      <div className="flex items-center space-x-1 mb-1">
                        <Clock className="w-4 h-4" />
                        <span>
                          Submitted {formatDistanceToNow(new Date(act.created_at), { addSuffix: true })}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Act Content */}
                  <div className="mb-4">
                    <div className="flex items-start justify-between mb-3">
                      <h3 className="text-xl font-bold text-gray-dark pr-4">{act.title}</h3>
                      {getCategoryBadge(act.category)}
                    </div>

                    <p className="text-gray-dark mb-4 leading-relaxed">{act.description}</p>

                    {/* Metadata */}
                    <div className="flex flex-wrap items-center gap-4 text-sm text-gray-medium mb-4">
                      <div className="flex items-center space-x-1">
                        <Calendar className="w-4 h-4" />
                        <span>Act Date: {format(new Date(act.act_date), 'MMM d, yyyy')}</span>
                      </div>
                      {act.location && (
                        <div className="flex items-center space-x-1">
                          <MapPin className="w-4 h-4" />
                          <span>{act.location}</span>
                        </div>
                      )}
                    </div>

                    {/* Media */}
                    {act.media_url && (
                      <div className="mb-4 rounded-lg overflow-hidden border border-gray-200">
                        {act.media_type === 'image' ? (
                          <img
                            src={act.media_url}
                            alt={act.title}
                            className="w-full max-h-96 object-cover"
                          />
                        ) : act.media_type === 'video' ? (
                          <video src={act.media_url} controls className="w-full max-h-96" />
                        ) : null}
                      </div>
                    )}
                  </div>

                  {/* Action Buttons */}
                  <div className="flex flex-col sm:flex-row gap-3 pt-4 border-t border-gray-200">
                    <Button
                      onClick={() => handleVerify(act.id)}
                      className="flex-1 bg-accent-green hover:bg-green-600"
                    >
                      <CheckCircle className="w-5 h-5 mr-2" />
                      Verify & Award Credit
                    </Button>
                    <Button
                      onClick={() => openRejectModal(act.id)}
                      variant="secondary"
                      className="flex-1 bg-red-100 hover:bg-red-200 text-red-700"
                    >
                      <XCircle className="w-5 h-5 mr-2" />
                      Reject
                    </Button>
                  </div>
                </Card>
              ))}
            </div>
          )}
        </div>

        {/* Info Box */}
        <Card className="bg-primary/5 border-primary/20">
          <h3 className="font-semibold text-gray-dark mb-2">📋 Review Guidelines</h3>
          <ul className="space-y-1 text-sm text-gray-medium">
            <li>• Verify acts are genuine and match the description</li>
            <li>• Check that media (if provided) supports the claim</li>
            <li>• Acts should demonstrate clear kindness or positive impact</li>
            <li>• Provide specific reasons when rejecting</li>
            <li>• Each verified act awards 1 Kindness Credit to the user</li>
          </ul>
        </Card>
      </div>

      {/* Rejection Modal */}
      <Modal
        isOpen={rejectModalOpen}
        onClose={() => {
          setRejectModalOpen(false);
          setSelectedActId(null);
          setRejectionReason('');
        }}
        title="Reject Act"
      >
        <div className="space-y-4">
          <div className="flex items-start space-x-3 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
            <AlertCircle className="w-5 h-5 text-yellow-600 flex-shrink-0 mt-0.5" />
            <div className="text-sm text-yellow-800">
              <p className="font-semibold mb-1">Please provide a clear reason</p>
              <p>
                This helps users understand why their act wasn't verified and how they can
                improve future submissions.
              </p>
            </div>
          </div>

          <Textarea
            label="Rejection Reason"
            placeholder="E.g., The description doesn't provide enough detail about the act of kindness, or the media doesn't clearly show the act described."
            value={rejectionReason}
            onChange={(e) => setRejectionReason(e.target.value)}
            rows={4}
            required
          />

          <div className="flex gap-3">
            <Button
              variant="secondary"
              onClick={() => {
                setRejectModalOpen(false);
                setSelectedActId(null);
                setRejectionReason('');
              }}
              className="flex-1"
            >
              Cancel
            </Button>
            <Button
              onClick={handleReject}
              isLoading={isSubmitting}
              className="flex-1 bg-red-600 hover:bg-red-700"
            >
              Reject Act
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
};

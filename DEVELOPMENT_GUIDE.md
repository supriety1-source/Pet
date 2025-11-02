# Development Guide - Building Remaining Pages

This guide shows you **exactly how to build** the remaining pages using the **Log Act Page** as the template.

---

## 📋 Pattern to Follow

Every page follows this structure:

```typescript
// 1. Imports
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { actsAPI, userAPI, adminAPI } from '../services/api';
import { Button } from '../components/ui/Button';
import { Card } from '../components/ui/Card';

// 2. Component definition
export const YourPage: React.FC = () => {
  // 3. State management
  const [data, setData] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  // 4. Data fetching
  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const response = await actsAPI.someMethod();
      setData(response.data);
    } catch (error) {
      console.error('Error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  // 5. Render
  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      {/* Your content */}
    </div>
  );
};
```

---

## 🎯 Page 1: My Acts Page

**File:** `frontend/src/pages/MyActsPage.tsx`

### What it does:
- Shows user's own acts in tabs (Verified, Pending, All)
- Displays each act as a card with status badge

### Code Template:

```typescript
import React, { useState, useEffect } from 'react';
import { actsAPI } from '../services/api';
import { KindnessAct } from '../types';
import { Card } from '../components/ui/Card';
import { CheckCircle, Clock, XCircle } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';

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
        <span className="flex items-center space-x-1 text-accent-green">
          <CheckCircle className="w-4 h-4" />
          <span>Verified</span>
        </span>
      );
    } else if (status === 'pending') {
      return (
        <span className="flex items-center space-x-1 text-yellow-600">
          <Clock className="w-4 h-4" />
          <span>Pending</span>
        </span>
      );
    } else {
      return (
        <span className="flex items-center space-x-1 text-red-600">
          <XCircle className="w-4 h-4" />
          <span>Rejected</span>
        </span>
      );
    }
  };

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold text-gray-dark mb-6">My Acts</h1>

      {/* Tabs */}
      <div className="flex space-x-4 mb-6 border-b border-gray-200">
        <button
          onClick={() => setActiveTab('all')}
          className={`pb-3 px-4 font-semibold ${
            activeTab === 'all'
              ? 'border-b-2 border-primary text-primary'
              : 'text-gray-medium hover:text-gray-dark'
          }`}
        >
          All
        </button>
        <button
          onClick={() => setActiveTab('verified')}
          className={`pb-3 px-4 font-semibold ${
            activeTab === 'verified'
              ? 'border-b-2 border-primary text-primary'
              : 'text-gray-medium hover:text-gray-dark'
          }`}
        >
          Verified
        </button>
        <button
          onClick={() => setActiveTab('pending')}
          className={`pb-3 px-4 font-semibold ${
            activeTab === 'pending'
              ? 'border-b-2 border-primary text-primary'
              : 'text-gray-medium hover:text-gray-dark'
          }`}
        >
          Pending
        </button>
      </div>

      {/* Acts List */}
      {isLoading ? (
        <div className="text-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
        </div>
      ) : acts.length === 0 ? (
        <Card className="text-center py-12">
          <p className="text-gray-medium">No acts found in this category.</p>
        </Card>
      ) : (
        <div className="space-y-4">
          {acts.map((act) => (
            <Card key={act.id}>
              <div className="flex justify-between items-start mb-3">
                <h3 className="text-xl font-semibold text-gray-dark">{act.title}</h3>
                {getStatusBadge(act.verification_status)}
              </div>

              <p className="text-gray-dark mb-3">{act.description}</p>

              {act.media_url && (
                <img
                  src={act.media_url}
                  alt={act.title}
                  className="rounded-lg max-h-64 object-cover w-full mb-3"
                />
              )}

              <div className="flex justify-between items-center text-sm text-gray-medium">
                <span>{new Date(act.act_date).toLocaleDateString()}</span>
                <span className="capitalize">{act.category} kindness</span>
                {act.verification_status === 'verified' && (
                  <span className="text-accent-green font-semibold">
                    +{act.credits_awarded} credit{act.credits_awarded !== 1 ? 's' : ''}
                  </span>
                )}
              </div>

              {act.rejection_reason && (
                <div className="mt-3 p-3 bg-red-50 border border-red-200 rounded-lg">
                  <p className="text-sm text-red-700">
                    <strong>Rejection reason:</strong> {act.rejection_reason}
                  </p>
                </div>
              )}
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};
```

### Steps to add it:
1. Create `frontend/src/pages/MyActsPage.tsx` with the code above
2. In `App.tsx`, add the import: `import { MyActsPage } from './pages/MyActsPage';`
3. Replace the `/my-acts` placeholder route with:
```typescript
<Route path="/my-acts" element={
  <ProtectedRoute>
    <AppLayout>
      <MyActsPage />
    </AppLayout>
  </ProtectedRoute>
} />
```

---

## 🎯 Page 2: Admin Dashboard

**File:** `frontend/src/pages/AdminDashboardPage.tsx`

### What it does:
- Shows pending acts awaiting verification
- Admin can approve or reject with reason

### Key Code Snippet:

```typescript
const handleVerify = async (actId: string) => {
  try {
    await adminAPI.verifyAct(actId);
    // Reload acts
    loadPendingActs();
  } catch (error) {
    console.error('Error verifying act:', error);
  }
};

const handleReject = async (actId: string, reason: string) => {
  try {
    await adminAPI.rejectAct(actId, reason);
    loadPendingActs();
  } catch (error) {
    console.error('Error rejecting act:', error);
  }
};
```

### Full structure:
- Stats cards at top (use `adminAPI.getStats()`)
- List of pending acts (use `adminAPI.getPendingActs()`)
- Each act has "Approve" and "Reject" buttons
- Reject opens a modal/input for rejection reason

---

## 🎯 Page 3: Community Feed

**File:** `frontend/src/pages/CommunityFeedPage.tsx`

### What it does:
- Full community feed with filters and sorting
- Like and comment functionality

### Key Code:

```typescript
const [filter, setFilter] = useState('all');
const [sort, setSort] = useState('recent');

useEffect(() => {
  loadFeed();
}, [filter, sort]);

const loadFeed = async () => {
  const response = await actsAPI.getCommunityFeed({ filter, sort, limit: 20 });
  setActs(response.data.acts);
};

const handleLike = async (actId: string) => {
  try {
    await actsAPI.react(actId, 'heart');
    loadFeed(); // Refresh to show updated count
  } catch (error) {
    console.error('Error liking act:', error);
  }
};
```

---

## 🎯 Page 4: Leaderboard

**File:** `frontend/src/pages/LeaderboardPage.tsx`

### What it does:
- Shows top users by credits
- Podium for top 3
- List for everyone else

### Key Code:

```typescript
const [period, setPeriod] = useState('all');
const [leaderboard, setLeaderboard] = useState([]);

useEffect(() => {
  loadLeaderboard();
}, [period]);

const loadLeaderboard = async () => {
  const response = await userAPI.getLeaderboard({ period, limit: 100 });
  setLeaderboard(response.data.leaderboard);
};

// Render top 3 with special podium styling
const topThree = leaderboard.slice(0, 3);
const others = leaderboard.slice(3);
```

---

## 🎯 Quick Reference: All API Methods

```typescript
// Acts
actsAPI.create(formData)                    // Upload new act
actsAPI.getMyActs(status?)                  // Get user's acts
actsAPI.getCommunityFeed({ filter, sort }) // Get community feed
actsAPI.getById(id)                         // Get single act
actsAPI.react(actId, type)                  // Like/react to act
actsAPI.unreact(actId)                      // Remove reaction
actsAPI.comment(actId, text)                // Comment on act

// Users
userAPI.getProfile(username)                // Get user profile
userAPI.getLeaderboard({ period, limit })   // Get leaderboard
userAPI.updateProfile(formData)             // Update own profile

// Admin
adminAPI.getStats()                         // Get admin stats
adminAPI.getPendingActs()                   // Get pending acts
adminAPI.verifyAct(actId)                   // Approve act
adminAPI.rejectAct(actId, reason)           // Reject act
adminAPI.getAllUsers({ limit, offset })     // Get all users
```

---

## 🎨 Common UI Patterns

### Loading State:
```typescript
{isLoading ? (
  <div className="text-center py-12">
    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
  </div>
) : (
  // Your content
)}
```

### Empty State:
```typescript
{items.length === 0 && (
  <Card className="text-center py-12">
    <p className="text-gray-medium">No items found.</p>
  </Card>
)}
```

### Service Leader Badge:
```typescript
const getServiceLeaderBadge = (tier?: string) => {
  if (!tier) return null;
  const colors = {
    bronze: 'bg-orange-100 text-orange-800 border-orange-300',
    silver: 'bg-gray-100 text-gray-800 border-gray-300',
    gold: 'bg-yellow-100 text-yellow-800 border-yellow-300',
  };
  return (
    <span className={`px-2 py-1 rounded-full text-xs font-semibold border ${colors[tier]}`}>
      {tier.toUpperCase()} LEADER
    </span>
  );
};
```

---

## ✅ Checklist for Each Page

- [ ] Create the page file in `frontend/src/pages/`
- [ ] Import necessary API methods from `services/api.ts`
- [ ] Add state management (useState, useEffect)
- [ ] Implement data fetching function
- [ ] Add loading and error states
- [ ] Style with Tailwind CSS classes
- [ ] Import the page in `App.tsx`
- [ ] Replace the placeholder route in `App.tsx`
- [ ] Test the page works end-to-end

---

## 🚀 Testing Your Pages

1. Start backend: `cd backend && npm run dev`
2. Start frontend: `cd frontend && npm run dev`
3. Login with test account: `admin@supriety.com` / `password123`
4. Navigate to your new page
5. Test all interactions (buttons, forms, etc.)
6. Check browser console for errors

---

## 💡 Pro Tips

1. **Copy-paste is your friend** - Use Log Act Page as a template
2. **Check the types** - All TypeScript types are in `frontend/src/types/index.ts`
3. **Reuse components** - Button, Input, Card, Textarea, Select
4. **Mobile-first** - Use Tailwind's responsive classes (`md:`, `lg:`)
5. **Date formatting** - Use `date-fns` library: `formatDistanceToNow(new Date(date))`

---

**You've got this!** The Log Act page shows you the entire pattern. Now just replicate it for each remaining page. 🚀

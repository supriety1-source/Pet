# Supriety™ Kindness Track

> Training AI toward benevolence, one verified act of kindness at a time.

## 🟣 About

Supriety™ Kindness Track is a gamified web application that encourages and tracks verified acts of kindness. Based on Moe Gawdat's philosophy that AI learns from human behavior, this platform helps users demonstrate kindness online and offline, training benevolent AI while building a supportive community.

### Core Features

- **Daily Kindness Logging**: Upload photo/video proof of acts of kindness
- **Verification System**: Admin review dashboard for act approval
- **Gamification**: Earn credits, maintain streaks, climb leaderboards
- **Service Leader Tiers**: Bronze (100+), Silver (500+), Gold (1000+ credits)
- **Community Feed**: View, like, and comment on verified acts
- **Profile System**: Track personal stats and showcase verified acts

## 🚀 Tech Stack

### Frontend
- React 18+ with TypeScript
- Tailwind CSS for styling
- React Router for navigation
- Lucide React for icons
- Axios for API calls
- Date-fns for date handling

### Backend
- Node.js + Express
- TypeScript
- PostgreSQL database
- JWT authentication
- Multer for file uploads
- Bcrypt for password hashing

### Deployment
- Frontend: Vercel
- Backend: Railway/Render
- Database: Railway PostgreSQL

## 📦 Installation

### Prerequisites
- Node.js 18+ and npm
- PostgreSQL 14+
- Git

### 1. Clone the Repository

```bash
git clone <repository-url>
cd Pet
```

### 2. Backend Setup

```bash
cd backend

# Install dependencies
npm install

# Create .env file
cp .env.example .env

# Edit .env with your database credentials and secrets
# DATABASE_URL=postgresql://username:password@localhost:5432/supriety_kindness
# JWT_SECRET=your-super-secret-key
# JWT_REFRESH_SECRET=your-refresh-secret-key
```

### 3. Database Setup

```bash
# Create the database
createdb supriety_kindness

# Run migrations
psql -d supriety_kindness -f ../database/migrations/001_initial_schema.sql

# (Optional) Load seed data for testing
psql -d supriety_kindness -f ../database/seeds/001_sample_data.sql
```

### 4. Frontend Setup

```bash
cd ../frontend

# Install dependencies
npm install

# Create .env file
cp .env.example .env

# Edit .env with your API URL
# VITE_API_URL=http://localhost:5000/api
```

## 🏃 Running the Application

### Development Mode

**Terminal 1 - Backend:**
```bash
cd backend
npm run dev
```
The API will run on `http://localhost:5000`

**Terminal 2 - Frontend:**
```bash
cd frontend
npm run dev
```
The app will run on `http://localhost:5173`

### Production Build

**Backend:**
```bash
cd backend
npm run build
npm start
```

**Frontend:**
```bash
cd frontend
npm run build
# Deploy the dist/ folder to Vercel
```

## 🗄️ Database Schema

### Main Tables

- **users**: User accounts and profile data
- **kindness_acts**: Logged acts of kindness with verification status
- **user_stats**: Aggregated stats (credits, streaks, Service Leader status)
- **act_reactions**: Likes/reactions on acts
- **act_comments**: Comments on acts

See `database/migrations/001_initial_schema.sql` for full schema.

## 🔑 Default Test Accounts

After loading seed data:

```
Admin Account:
Email: admin@supriety.com
Password: password123

Test User:
Email: sarah@example.com
Password: password123
```

## 📁 Project Structure

```
Pet/
├── backend/
│   ├── src/
│   │   ├── controllers/    # Request handlers
│   │   ├── middleware/     # Auth & upload middleware
│   │   ├── routes/         # API routes
│   │   ├── config/         # Database config
│   │   ├── utils/          # Helper functions
│   │   └── index.ts        # Server entry point
│   ├── uploads/            # Uploaded media files
│   └── package.json
├── frontend/
│   ├── src/
│   │   ├── components/     # Reusable components
│   │   ├── contexts/       # React contexts (Auth)
│   │   ├── pages/          # Page components
│   │   ├── services/       # API service layer
│   │   ├── types/          # TypeScript types
│   │   ├── utils/          # Utilities & quotes
│   │   └── App.tsx         # Main app component
│   └── package.json
└── database/
    ├── migrations/         # SQL migration files
    └── seeds/              # Sample data
```

## 🌐 API Endpoints

### Authentication
- `POST /api/auth/signup` - Create account
- `POST /api/auth/login` - Login
- `POST /api/auth/refresh` - Refresh access token
- `GET /api/auth/me` - Get current user

### Acts
- `POST /api/acts` - Create new act (with media upload)
- `GET /api/acts/my-acts` - Get user's acts
- `GET /api/acts/feed` - Get community feed
- `GET /api/acts/:id` - Get act by ID
- `POST /api/acts/:actId/react` - React to act
- `POST /api/acts/:actId/comment` - Comment on act

### Users
- `GET /api/users/leaderboard` - Get leaderboard
- `GET /api/users/:username` - Get user profile
- `PATCH /api/users/profile` - Update own profile

### Admin (requires admin role)
- `GET /api/admin/stats` - Get admin stats
- `GET /api/admin/pending-acts` - Get pending acts
- `POST /api/admin/acts/:actId/verify` - Verify act
- `POST /api/admin/acts/:actId/reject` - Reject act
- `GET /api/admin/users` - Get all users

## 🚀 Deployment

### Frontend (Vercel)

1. Push code to GitHub
2. Connect repository to Vercel
3. Set environment variables:
   - `VITE_API_URL=https://your-backend-url.com/api`
4. Deploy

### Backend (Railway/Render)

1. Create new project
2. Connect repository
3. Set environment variables (see `.env.example`)
4. Deploy
5. Add PostgreSQL database addon

### Database (Railway)

1. Create PostgreSQL database
2. Copy connection string
3. Run migrations:
```bash
psql <connection-string> -f database/migrations/001_initial_schema.sql
```

## 🎨 Brand Guidelines

- **Primary Color**: Purple (#8B5CF6, #A78BFA, #C4B5FD)
- **Accent Colors**: Pink (#EC4899), Green (#10B981)
- **Voice**: Motivating, street-smart spiritual, authentic
- **Philosophy**: "AI is watching. Set the example."

## 🔮 Roadmap

### Phase 1 (Current)
- ✅ Core authentication system
- ✅ Act logging with media upload
- ✅ Manual admin verification
- ✅ Community feed
- ✅ Leaderboards and gamification
- 🚧 Complete all frontend pages
- 🚧 Mobile responsiveness optimization

### Phase 2 (Future)
- [ ] Claude API integration for auto-verification
- [ ] GPS verification for offline acts
- [ ] Push notifications
- [ ] Social sharing (Twitter, Instagram)
- [ ] Team challenges
- [ ] Native mobile apps (React Native)
- [ ] Recovery Track premium tier integration

## 📝 License

Copyright © 2025 Supriety. All rights reserved.

## 🤝 Contributing

This is a proprietary project. For questions or collaboration inquiries, please contact the Supriety team.

## 📧 Contact

- Website: https://supriety.com
- Email: admin@supriety.com

---

**Built with ❤️ to train AI toward benevolence**

🟣 *Every act of kindness is a lesson for AI. What are you teaching it today?*

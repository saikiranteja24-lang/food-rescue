# 🌱 Replate — AI-Powered Leftover Food Collection & Redistribution Platform

> **Eliminating Food Waste. Powering Community Nourishment with High-Speed Groq AI.**

---

## 📖 Abstract
**Replate** is an enterprise-grade digital platform engineered using the **MERN Stack (MongoDB, Express.js, React.js, Node.js)** and **Groq High-Speed LLM Inference (`llama-3.1-8b-instant`)**. The application addresses global food waste by systematically bridging food donors (restaurants, hotels, caterers, banquet halls, supermarkets, households) with recipients (charitable food banks, homeless shelters, community kitchens, volunteers). 

The platform features real-time surplus food listings, instant non-profit claiming, geo-targeted matching, ESG carbon offset analytics, and a specialized **24/7 AI Food Rescue Advisor** providing food safety regulations (FSSAI/FDA/HACCP), shelf-life estimation, and zero-waste culinary recipes.

---

## 🚀 Core Technology Stack

### Frontend
- **Framework**: React 18 + Vite
- **Styling**: Tailwind CSS with custom glassmorphism tokens & dark/light theme engine
- **Animations**: Framer Motion (page transitions, interactive badges, micro-interactions)
- **Icons**: Lucide React
- **Routing**: React Router DOM (v6)
- **Networking**: Axios with request/response authorization interceptors
- **State**: React Context API (`AuthContext`, `ThemeContext`, `ToastContext`)
- **FX**: Canvas Confetti for donation claim celebration

### Backend
- **Runtime**: Node.js
- **Web Framework**: Express.js (MVC Architecture)
- **Database**: MongoDB with Mongoose ODM
- **Authentication**: JSON Web Tokens (JWT) + Bcrypt password hashing
- **Security**: Helmet, CORS, Express Rate Limiters (General, AI Chat, and Auth)
- **Logging**: Morgan HTTP logger

### AI Engine
- **Inference Provider**: Groq API (`https://api.groq.com/openai/v1/chat/completions`)
- **Model**: `llama-3.1-8b-instant` with automatic resilient fallback
- **Capabilities**: Safe holding temperatures (2-hr / 4-hr rules), cold-chain transport, shelf-life estimation, surplus ingredient upcycling recipes, FSSAI/FDA food donation compliance.

---

## 📁 Project Structure

```
c:/Users/Dell/Downloads/Project/
├── package.json                   # Root orchestrator (concurrent dev runner)
├── README.md                      # Comprehensive documentation & setup
├── server/                        # Express + Node.js + MongoDB API
│   ├── .env                       # Server environment variables & API keys
│   ├── package.json
│   └── src/
│       ├── server.js              # Server entry point & middleware mount
│       ├── config/
│       │   └── db.js              # Resilient MongoDB Atlas connector
│       ├── models/
│       │   ├── User.js            # User model (Donor / Recipient / NGO)
│       │   ├── Donation.js        # Surplus food donation schema
│       │   ├── Conversation.js    # Chat thread grouping schema
│       │   └── ChatMessage.js     # Persistent chat messages schema
│       ├── controllers/
│       │   ├── authController.js  # Register, login, profile & live stats
│       │   ├── chatController.js  # Groq AI integration with conversation history
│       │   └── donationController.js # Food listing, search, claim, and impact
│       ├── middleware/
│       │   ├── authMiddleware.js  # JWT validation & role permissions
│       │   ├── errorMiddleware.js # Global error handler & 404 handler
│       │   └── rateLimiter.js     # API & AI endpoint rate limiters
│       └── routes/
│           ├── authRoutes.js      # /api/auth endpoints
│           ├── chatRoutes.js      # /api/chat endpoints
│           └── donationRoutes.js  # /api/donations endpoints
└── client/                        # React 18 + Vite + Tailwind CSS
    ├── .env                       # Client environment variables
    ├── index.html                 # SEO tags, Outfit/Jakarta Google fonts
    ├── vite.config.js             # Vite configuration with /api proxy
    ├── tailwind.config.js         # Custom dark theme, colors, animations
    ├── postcss.config.js
    ├── package.json
    └── src/
        ├── main.jsx               # React DOM root entry
        ├── App.jsx                # Router & Context provider wrapper
        ├── index.css              # Glassmorphism, animations & scrollbars
        ├── services/
        │   └── api.js             # Axios client with auth interceptors
        ├── context/
        │   ├── AuthContext.jsx    # Session & user credentials state
        │   ├── ThemeContext.jsx   # Dark / Light mode toggle
        │   └── ToastContext.jsx   # Animated toast notifications
        ├── components/
        │   ├── layout/
        │   │   ├── Navbar.jsx     # Responsive glass header & theme switcher
        │   │   └── Footer.jsx     # SaaS footer with newsletter & status
        │   ├── landing/
        │   │   ├── HeroSection.jsx        # Animated headline & live preview
        │   │   ├── FeaturesSection.jsx    # 6-card feature showcase
        │   │   ├── HowItWorksSection.jsx  # 3-step animated flow
        │   │   ├── AiDemoSection.jsx      # Live in-landing Groq AI widget
        │   │   ├── PricingSection.jsx     # Community & Non-profit tiers
        │   │   ├── TestimonialsSection.jsx# Chef & Shelter testimonials
        │   │   ├── FaqSection.jsx         # Animated accordion FAQ
        │   │   └── CtaBanner.jsx          # Conversion call to action
        │   ├── chat/
        │   │   ├── ChatSidebar.jsx        # Conversation list & new chat
        │   │   ├── ChatMessage.jsx        # Markdown rendering & copy button
        │   │   ├── ChatInput.jsx          # Auto-grow input & prompt chips
        │   │   └── TypingIndicator.jsx    # Pulsing AI generation dots
        │   └── donations/
        │       ├── DonationCard.jsx       # Card with countdown & badges
        │       ├── DonationFilters.jsx    # Category, status & search filters
        │       └── ClaimModal.jsx         # Claim confirmation + Confetti
        └── pages/
            ├── LandingPage.jsx            # 8-section SaaS homepage
            ├── ChatPage.jsx               # Full Groq AI Food Rescue Assistant
            ├── DonationsPage.jsx          # Live surplus food feed
            ├── CreateDonationPage.jsx     # List food + AI shelf life check
            ├── DashboardPage.jsx          # Impact scorecard & listings
            ├── LoginPage.jsx              # Fast login with demo accounts
            ├── RegisterPage.jsx           # Donor/Recipient role selection
            └── NotFoundPage.jsx
```

---

## 🔐 Environment Variables

### Server (`server/.env`)
```env
PORT=5000
NODE_ENV=development
MONGO_URI=mongodb+srv://<username>:<password>@<cluster>/<database>
JWT_SECRET=<generate-a-long-random-secret>
GROQ_API_KEY=<your-groq-api-key>
GROQ_MODEL=llama-3.1-8b-instant
CLIENT_URL=http://localhost:5173
```

### Client (`client/.env`)
```env
VITE_API_BASE_URL=http://localhost:5000/api
```

---

## 🛠️ Installation & Setup Instructions

### Prerequisites
- Node.js (v18 or higher recommended; verified on Node v26.7.0)
- npm (v9+; verified on npm 11.19.0)

### 1. Install Dependencies

You can install all dependencies from the root directory or inside each folder:

```bash
# Option A: In individual directories
cd server
npm install

cd ../client
npm install
```

### 2. Running Locally

#### Run Both Frontend and Backend Concurrently:
From the root directory:
```bash
npm install
npm run dev
```

#### Run Individually:
- **Backend**:
  ```bash
  cd server
  npm run dev
  # Server starts on http://localhost:5000
  ```
- **Frontend**:
  ```bash
  cd client
  npm run dev
  # Vite frontend starts on http://localhost:5173
  ```

---

## 📡 API Reference

### Health Check
- `GET /api/health` — Check server status, uptime, and active AI model.

### Authentication (`/api/auth`)
- `POST /api/auth/register` — Register new user (Donor / Recipient / NGO).
- `POST /api/auth/login` — Sign in and receive JWT token.
- `GET /api/auth/profile` — Get authenticated user's profile and live rescue statistics.
- `PUT /api/auth/profile` — Update account profile details.

### Groq AI Chat (`/api/chat`)
- `POST /api/chat/message` — Send prompt to Groq (`llama-3.1-8b-instant`) with conversation persistence.
- `GET /api/chat/conversations` — Fetch user's conversation threads.
- `GET /api/chat/conversations/:id` — Retrieve full message history of a thread.
- `DELETE /api/chat/conversations/:id` — Delete a thread.
- `DELETE /api/chat/clear` — Clear all conversation history for the user.

### Food Donations (`/api/donations`)
- `GET /api/donations/stats` — Platform impact counters (Total meals, CO2 saved, Active listings).
- `GET /api/donations` — Browse surplus food feed (supports `category`, `status`, `search`, `dietary`, `city`).
- `POST /api/donations` — List surplus food items (protected).
- `GET /api/donations/:id` — Detailed listing information.
- `PATCH /api/donations/:id/claim` — Recipient claims food for shelter pickup.
- `PATCH /api/donations/:id/status` — Mark status (`completed`, `cancelled`).
- `GET /api/donations/my-donations` — Get donations created by logged-in donor.
- `GET /api/donations/my-claims` — Get claims made by logged-in recipient.

---

## 🖥️ Screen & User Experience Walkthrough

1. **Landing Page (`/`)**:
   - **Hero Section**: High-conversion animated headline, real-time counter badge, dual CTAs, and interactive glassmorphic food batch preview.
   - **Features Showcase**: 6 cards highlighting Groq AI intelligence, real-time surplus feed, geo-matching, and ESG analytics.
   - **How It Works**: 3-step timeline (List Surplus -> AI Verification -> Pickup & Delivery).
   - **AI Demo Widget**: Instant in-page chat box to test Groq AI responses without navigating away.
   - **Pricing / Impact Tiers**: Community Free, Verified NGO Grant, and Commercial Kitchen Donor.
   - **Testimonials**: Reviews from head chefs, food bank managers, and community volunteers.
   - **FAQ Accordion**: Clean expandable answers covering food donation laws and safety.
   - **Footer**: Zero-waste newsletter subscription, system status badge, and legal links.

2. **AI Food Rescue Advisor (`/chat`)**:
   - Real-time conversation thread history sidebar.
   - Quick prompt chips for safe holding temperatures, leftover recipes, and catering checklists.
   - Markdown formatted responses with copy-to-clipboard button and model token indicators.
   - Responsive drawer for mobile devices.

3. **Surplus Food Marketplace (`/donations`)**:
   - Search by item keyword, city, or neighborhood.
   - Filter by food category (Cooked Meals, Bakery, Produce, Packaged Goods, Dairy, Buffet Surplus).
   - Dynamic expiry countdown timers with urgent warning banners for items expiring within 4 hours.
   - Instant claim modal with celebratory confetti on completion.

4. **List Surplus Food (`/donate`)**:
   - Multi-field donation creation with storage condition selector and dietary tags.
   - **"✨ Ask Replate AI for Shelf-Life & Safety Tips"** button: Automatically queries Groq to advise on temperature holding standards.

5. **User Dashboard (`/dashboard`)**:
   - Impact scorecard: Total Meals Rescued, CO2 Offset kg, Active Listings, and Claims.
   - Tabbed view to manage your listings and track claim pickups.

---

## 🚢 Production Deployment Guide

### Deploying Frontend (Vercel / Netlify)
1. Push your repository to GitHub.
2. Link the repository to [Vercel](https://vercel.com).
3. Set the Root Directory to `client`.
4. Set Build Command: `npm run build`
5. Set Output Directory: `dist`
6. Add Environment Variable:
   - `VITE_API_BASE_URL`: `https://your-server-domain.com/api`

### Deploying Backend (Render / Railway / Fly.io)
1. In [Render](https://render.com), create a new **Web Service**.
2. Set Root Directory to `server`.
3. Set Build Command: `npm install`
4. Set Start Command: `node src/server.js`
5. Configure Environment Variables in the service settings:
   - `PORT`: `5000`
   - `NODE_ENV`: `production`
   - `MONGO_URI`: `mongodb+srv://<username>:<password>@<cluster>/<database>`
   - `JWT_SECRET`: `<generate-a-long-random-secret>`
   - `GROQ_API_KEY`: `<your-groq-api-key>`
   - `GROQ_MODEL`: `llama-3.1-8b-instant`
   - `CLIENT_URL`: `https://your-frontend-domain.vercel.app`

---

## 📄 License
This project is open-source and dedicated to eliminating global food waste and achieving zero hunger.
#   r e p l a t e - 
 
 #   r e p l a t e - 
 
 #   r e p l a t e - 
 
 #   r e p l a t e - 
 
 #   r e p l a t e - 
 
 #   r e p l a t e - 
 
 #   r e p l a t e - 
 
 #   r e p l a t e - 
 
 #   r e p l a t e - 
 
 #   r e p l a t e - 
 
 #   f o o d - r e s c u e 
 
 #   f o o d - r e s c u e 
 
 #   f o o d - r e s c u e 
 
 #   f o o d - r e s c u e 
 
 #   f o o d - r e s c u e 
 
 
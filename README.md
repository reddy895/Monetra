# 💎 Monetra — Smart Personal Finance & Real-Time SIP Platform

> **Deterministic, Rule-Based Budgeting & Live AMFI Mutual Fund Visualizer for Indian Salaried Professionals (₹20,000 – ₹50,000 / month).**

---

## 📌 Overview

**Monetra** is a full-stack, enterprise-grade personal finance application engineered specifically for middle-income salaried professionals in India. It bridges the gap between daily expense tracking, disciplined **50/30/20 budgeting**, and long-term **SIP wealth creation**.

Unlike generic expense apps or unreliable generative AI chatbots, Monetra operates on **100% deterministic, rule-based Indian financial logic** coupled with **real-time live AMFI (Association of Mutual Funds in India) Net Asset Value (NAV) data feeds**.

---

## ✨ Key Features & Modules

### 1. 📊 Expense Tracker
- **Smart Expense Logging**: Record daily expenses with amounts, categories, dates, payment modes (*UPI, Card, Bank Transfer, Cash*), and merchant tags.
- **Categorization Engine**: 10 default Indian expense categories (*Rent, Groceries, Food & Dining, Bills & Utilities, Shopping, Entertainment, Healthcare, Education, Transport, Other*).
- **Recurring Expenses**: Automated tracking for subscriptions, rent, Wi-Fi, and utility bills.
- **Filters & Search**: Instant real-time search, date range filtering, payment mode filter, and category breakdowns.

### 2. 🧭 Smart Finance Advisor (Rule-Based Engine)
- **Dynamic 50/30/20 Allocation Blueprint**:
  - Automatically recalculates exact target rupee figures whenever salary brackets are toggled:
    - **50% Needs**: Essential living expenses (Rent max 30%, Groceries 10%, Utilities 10%).
    - **30% Wants**: Discretionary lifestyle spending (Dining 10%, Shopping 10%, Entertainment 8%).
    - **20% Savings & SIP**: Compounding investments (Mutual Funds 15%, Emergency Fund 5%).
- **Emergency Fund Tracker**: Sinking fund cushion calculator tailored to 3 to 6 months of mandatory living costs.
- **Budget Health Score**: Real-time 0–100 financial health rating evaluating budget discipline and discretionary containment.
- **Salary-Specific Tips**: Practical, non-jargon financial guidance for ₹20k, ₹25k, ₹30k, ₹35k, ₹40k, ₹45k, and ₹50k income tiers.

### 3. 📈 Real-Time SIP Mutual Fund Visualizer
- **Live AMFI Integration**: Fetches real daily historical NAV graphs directly from SEBI-registered mutual funds via the official AMFI public API.
- **No Mock or Synthetic Projections**: Real historical charts covering 1 Month, 6 Months, 1 Year, 3 Years, 5 Years, and Max tenure.
- **Verified Indian Scheme Directory**: Instant access to top-rated funds across Flexi Cap, Nifty 50 Index, Mid Cap, Small Cap, and ELSS Tax-Saver categories.
- **Live AMFI Search**: Search live across **40,000+** Indian mutual fund schemes by AMC name or scheme keyword (e.g., *Tata, HDFC, Parag Parikh, SBI, Mirae*).
- **Historical SIP Backtesting**: Real performance data verifying exact returns for a recurring ₹2,000/month SIP on the 5th of each month.
- **Future Wealth Compounding Simulator**: Interactive sliders for monthly investment amount (₹500 – ₹15,000/mo) and tenure (1 – 25 years) calculated using verified fund CAGRs.

### 4. 📑 Executive Monthly Financial Reports
- **Review Summary**: Printable and downloadable PDF-ready monthly summaries.
- **Category Audit**: Itemized table showing rupee spent, percentage of salary, and limit adherence (*Balanced vs. Above Limit*).

---

## 🛠️ Technology Stack

| Layer | Technologies |
|---|---|
| **Frontend** | React 18, TypeScript, Vite, Tailwind CSS, Redux Toolkit (RTK Query), Chart.js, Lucide Icons |
| **Backend** | Node.js, Express.js, MongoDB, Mongoose ODM |
| **Authentication** | JSON Web Tokens (JWT) with Access & Refresh Token rotation, BCrypt password hashing |
| **Live Financial Data** | AMFI (Association of Mutual Funds in India) Public API + in-memory cache |
| **Design System** | Clean Modern Slate & Emerald/Teal Theme, 100% Vector SVG Icons, Zero Emojis |

---

## 📂 Project Structure

```text
Personal Finance partner/
├── backend/
│   ├── src/
│   │   ├── config/             # DB connection, constants, category limits
│   │   ├── controllers/        # Express route handlers
│   │   ├── middleware/         # JWT auth, error handler, rate limiters
│   │   ├── models/             # Mongoose schemas (User, Expense, Category, Budget, etc.)
│   │   ├── routes/             # API REST endpoints
│   │   ├── seeders/            # Database initialization scripts
│   │   ├── services/           # Core financial business logic & AMFI client
│   │   ├── utils/              # Financial calculators, date helpers, formatters
│   │   └── app.js              # Server entry point
│   ├── .env                    # Environment configuration
│   └── package.json
│
├── frontend/
│   ├── src/
│   │   ├── components/         # Reusable UI (Logo, AppIcon, Card, Modal, Input, Charts)
│   │   ├── pages/              # Dashboard, Expenses, Advisor, SIPs, Auth, Reports
│   │   ├── store/              # Redux Toolkit store, authSlice, apiSlice (RTK Query)
│   │   ├── types/              # TypeScript interface & schema definitions
│   │   ├── utils/              # Currency (₹ INR), date, and SIP math helpers
│   │   ├── App.tsx             # Root router & layout wrapper
│   │   └── main.tsx            # React application mounting
│   ├── index.html
│   ├── vite.config.ts
│   └── package.json
│
└── README.md
```

---

## 🚀 Getting Started

### 1. Prerequisites
- **Node.js**: `v18.0.0` or higher
- **npm**: `v9.0.0` or higher
- **MongoDB**: Local MongoDB instance running on `mongodb://127.0.0.1:27017` or MongoDB Atlas URI

---

### 2. Backend Setup

1. Navigate to the `/backend` directory:
   ```bash
   cd backend
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Verify your `.env` file configuration (a sample is provided below):
   ```env
   PORT=5000
   NODE_ENV=development
   MONGODB_URI=mongodb://127.0.0.1:27017/finance_partner
   JWT_SECRET=super_secret_jwt_key_personal_finance_partner_2026
   JWT_REFRESH_SECRET=super_refresh_jwt_key_personal_finance_partner_2026
   JWT_EXPIRES_IN=15m
   JWT_REFRESH_EXPIRES_IN=7d
   FRONTEND_URL=http://localhost:3000
   ```
4. Initialize the database with default categories, advisor tips, and fund recommendations:
   ```bash
   node src/seeders/seed.js
   ```
5. Start the backend development server:
   ```bash
   npm run dev
   # or
   node src/app.js
   ```
   *Backend will run on `http://localhost:5000`.*

---

### 3. Frontend Setup

1. Open a new terminal and navigate to the `/frontend` directory:
   ```bash
   cd frontend
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Start the Vite development server:
   ```bash
   npm run dev
   ```
   *Frontend will run on `http://localhost:3000`.*

---

## 📡 REST API Reference

### Authentication (`/api/auth`)
| Method | Endpoint | Description |
|---|---|---|
| `POST` | `/api/auth/register` | Register a new user with salary & risk profile |
| `POST` | `/api/auth/login` | Authenticate user & issue JWT tokens |
| `POST` | `/api/auth/refresh-token` | Refresh expired access token |
| `POST` | `/api/auth/logout` | Revoke refresh token and log out |
| `GET` | `/api/auth/profile` | Get current authenticated user profile |
| `PUT` | `/api/auth/profile` | Update salary or investment risk profile |

### Expenses (`/api/expenses`)
| Method | Endpoint | Description |
|---|---|---|
| `GET` | `/api/expenses` | List user expenses with pagination & filters |
| `POST` | `/api/expenses` | Record a new expense |
| `GET` | `/api/expenses/:id` | Get single expense details |
| `PUT` | `/api/expenses/:id` | Update an existing expense |
| `DELETE` | `/api/expenses/:id` | Delete an expense entry |
| `GET` | `/api/expenses/summary` | Get monthly spending & category breakdown |
| `GET` | `/api/expenses/trend` | Get daily & weekly spending trend data |

### Smart Advisor & Budgeting (`/api/advisor`)
| Method | Endpoint | Description |
|---|---|---|
| `GET` | `/api/advisor/dashboard` | Get 50/30/20 blueprint, health score & tips |
| `GET` | `/api/advisor/blueprint` | Get rule-based breakdown for active salary |
| `GET` | `/api/advisor/categories` | Get category spending vs limit comparison |
| `GET` | `/api/advisor/emergency-fund` | Get 3-6 month emergency fund tracker status |
| `GET` | `/api/advisor/what-if` | Calculate what-if lifestyle cut compounding |
| `GET` | `/api/advisor/monthly-report` | Generate comprehensive monthly financial report |

### SIP & Live AMFI Mutual Funds (`/api/sips`)
| Method | Endpoint | Description |
|---|---|---|
| `GET` | `/api/sips/live-nav/:schemeCode` | Fetch live AMFI daily NAV history & CAGR |
| `GET` | `/api/sips/search-live` | Search 40,000+ Indian mutual funds by keyword |
| `GET` | `/api/sips/recommendations` | Get curated funds matched to salary bracket |
| `POST` | `/api/sips/calculate` | Calculate future compounding returns |

---

## 🔒 Security & Quality Standards

- **Zero Passwords in Plaintext**: All passwords hashed using `BCrypt` with 10 salt rounds.
- **JWT Protection**: Protected routes require valid `Bearer <token>` headers; expired tokens are smoothly refreshed.
- **Strict Input Sanitization**: Automatic email lowercasing and trimming on all authentication routes.
- **Password Visibility Control**: Built-in interactive show/hide eye toggle for confident credential input.
- **Professional Design Standard**: Free of emojis, using vector SVG icons from `lucide-react`.

---

## 📄 License

This project is licensed under the **MIT License** — see the [LICENSE](LICENSE) file for details.

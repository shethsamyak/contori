# Countori — Bookkeeping & Accounting SaaS

A full-stack professional bookkeeping web application built with **Next.js 16**, **TypeScript**, and **PostgreSQL**. Countori helps small businesses manage their finances with a clean, modern dashboard.

## ✨ Features

- **Dashboard** — Revenue vs. expenses chart, profit trend, expense breakdown pie chart, recent transactions feed
- **Invoices** — Create, track, and filter invoices by status (paid / pending / overdue)
- **Clients** — Client directory with contact details and invoice history
- **Vendors** — Vendor management with payables tracking
- **Transactions** — Full transaction ledger with category tagging and search
- **Accounts** — Chart of accounts with balance tracking
- **Reports** — Financial summaries and period-based reporting
- **Auth** — JWT-based signup / login / logout with `bcryptjs` password hashing
- **Middleware** — Request logging and timing headers on every route

## 🛠 Tech Stack

| Layer | Technology |
|---|---|
| Framework | Next.js 16 (App Router) |
| Language | TypeScript |
| Styling | Tailwind CSS v4 |
| Charts | Recharts |
| Database | PostgreSQL (`pg`) |
| Auth | JWT (`jsonwebtoken`) + `bcryptjs` |
| Email | Nodemailer |
| Fonts | Poppins + Playfair Display |

## 🚀 Getting Started

### Prerequisites

- Node.js 18+
- PostgreSQL 14+

### Installation

```bash
# Clone the repository
git clone https://github.com/your-username/contori.git
cd contori

# Install dependencies
npm install

# Set up environment variables
cp .env.example .env.local
# Edit .env.local with your database and JWT credentials

# Run the development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## ⚙️ Environment Variables

Copy `.env.example` to `.env.local` and fill in the values:

```
DATABASE_URL=postgresql://user:password@localhost:5432/countori
JWT_SECRET=your-super-secret-jwt-key
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your-email@gmail.com
SMTP_PASS=your-app-password
```

> **Note:** The app runs with built-in demo data out of the box — no database setup required to explore the UI.

## 📁 Project Structure

```
src/
├── app/
│   ├── api/              # API route handlers
│   │   ├── auth/         # Login, signup, logout, /me
│   │   ├── invoices/     # Invoice CRUD
│   │   ├── clients/      # Client CRUD
│   │   ├── vendors/      # Vendor CRUD
│   │   ├── transactions/ # Transaction ledger
│   │   ├── accounts/     # Chart of accounts
│   │   ├── categories/   # Category management
│   │   ├── dashboard/    # Aggregated dashboard stats
│   │   └── reports/      # Financial reports
│   ├── dashboard/        # Dashboard UI pages
│   ├── login/            # Auth pages
│   ├── signup/
│   └── globals.css       # Design system & component styles
├── context/              # React context (AuthContext)
├── lib/                  # Utilities, types, demo data
└── middleware.ts          # Request logging middleware
```

## 📄 License

MIT

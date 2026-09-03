# Chit Fund Manager

<p align="center">
  <img src="https://img.shields.io/badge/Status-In%20Development-7c3aed?style=for-the-badge" alt="Status: In Development">
  <img src="https://img.shields.io/badge/PWA-Offline%20First-2563eb?style=for-the-badge" alt="Progressive Web App">
  <img src="https://img.shields.io/badge/Architecture-Local%20First-059669?style=for-the-badge" alt="Local First">
</p>

<p align="center">
  <img src="https://img.shields.io/badge/React-19-61DAFB?style=flat-square&logo=react&logoColor=white" alt="React 19">
  <img src="https://img.shields.io/badge/TypeScript-5-3178C6?style=flat-square&logo=typescript&logoColor=white" alt="TypeScript">
  <img src="https://img.shields.io/badge/Vite-6-646CFF?style=flat-square&logo=vite&logoColor=white" alt="Vite">
  <img src="https://img.shields.io/badge/Tailwind%20CSS-3-06B6D4?style=flat-square&logo=tailwindcss&logoColor=white" alt="Tailwind CSS">
  <img src="https://img.shields.io/badge/Dexie.js-IndexedDB-7C3AED?style=flat-square" alt="Dexie.js">
</p>

<p align="center">
  <img src="https://img.shields.io/badge/GitHub%20Pages-Deployment-181717?style=flat-square&logo=github" alt="GitHub Pages">
  <img src="https://img.shields.io/badge/GitHub%20Actions-CI%2FCD-2088FF?style=flat-square&logo=githubactions&logoColor=white" alt="GitHub Actions">
  <img src="https://img.shields.io/badge/Excel-Export-217346?style=flat-square&logo=microsoftexcel&logoColor=white" alt="Excel Export">
</p>

<p align="center">
  <strong>A professional, offline-first Progressive Web App for modern chit fund management.</strong>
</p>

<p align="center">
  Manage chit groups, members, collections, auctions, ledgers, reports, receipts, and financial records — directly from your browser.
</p>

---

## ✨ Overview

Chit Fund Manager is a modern local-first application designed for chit fund hosts who want to replace notebooks, spreadsheets, calculators, and repetitive manual work with one reliable digital workspace.

The application is designed around a simple principle:

> The host should spend less time maintaining records and more time running the business.

Chit Fund Manager is intentionally designed without a traditional backend for its initial release.

* No server.
* No login.
* No subscription.
* No database hosting.

The application runs directly in the browser, stores operational data locally, works offline, and provides tools for exporting and backing up that data.

---

## 🎯 Product Goals

Chit Fund Manager is designed to make everyday host workflows:
* Faster
* Simpler
* More accurate
* Easier to audit
* Easier to report
* Easier to back up
* Easier to understand

The application should eliminate unnecessary repetitive work such as:
* Manually calculating monthly collections
* Searching through notebooks for member balances
* Maintaining multiple spreadsheets
* Recalculating outstanding amounts
* Manually preparing statements
* Re-entering member information
* Manually calculating auction settlements
* Preparing receipts from scratch

---

## 🚀 Core Features

### 📊 Dashboard
A centralized operational dashboard providing a quick overview of the entire chit operation.

Planned information includes:
* Active chit groups
* Total members
* Expected monthly collections
* Actual collections
* Outstanding balances
* Collection percentage
* Pending payments
* Upcoming auctions
* Recent activity
* Backup status

The dashboard is designed to answer four questions immediately:
1. How much should I collect?
2. How much have I collected?
3. Who still owes money?
4. What needs my attention next?

### 💼 Chit Management
Create and manage individual chit groups.

A chit can contain:
* Chit name
* Chit amount
* Monthly contribution
* Number of members
* Duration
* Start date
* End date
* Commission configuration
* Auction configuration
* Payment rules
* Late-payment rules
* Notes
* Status

**Supported lifecycle:**
Active → Completed → Archived

### 👥 Member Management
Maintain a structured member registry for every chit.

Member information can include:
* Member number
* Name
* Phone number
* Address
* Joining date
* Status
* Notes

Members can be searched quickly by Name, Member number, or Phone number.

### 💰 Monthly Collections
Track every member's monthly contribution.

The collection system is designed to support:
* Full payments
* Partial payments
* Outstanding balances
* Payment dates
* Payment methods
* Late-payment penalties
* Payment notes
* Historical payment records

The application automatically calculates:
* Expected Collection
* Collected Amount
* Outstanding Amount
* Collection Percentage
* Paid Members
* Pending Members

**Example:**
* Member: Ravi Kumar
* Due: ₹10,000
* Paid: ₹10,000
* Balance: ₹0
* [ Mark Paid ]

### 🔨 Auction Management
Record and manage monthly chit auctions.

Auction records can contain:
* Auction date
* Participating members
* Bid amounts
* Winning member
* Discount/bid amount
* Prize amount
* Host/foreman commission
* Dividend
* Settlement information
* Notes
* Configurable financial rules

Different chit funds can use different calculation methods. Therefore, financial calculations will not be unnecessarily hard-coded into the interface. Instead, the application will use a dedicated calculation layer:

Auction
   ↓
Calculation Engine
   ├── Discount
   ├── Prize Amount
   ├── Commission
   ├── Dividend
   └── Settlement

This makes financial rules easier to test, maintain, and adapt.

### 📒 Member Ledger
Every member receives a complete financial history.

**Example:**
* Ravi Kumar

| Month | Due | Paid | Balance |
| :--- | :--- | :--- | :--- |
| January | ₹10,000 | ₹10,000 | ₹0 |
| February | ₹10,000 | ₹10,000 | ₹0 |
| March | ₹10,000 | ₹8,000 | ₹2,000 |
| April | ₹10,000 | ₹10,000 | ₹0 |
| **Total** | **₹40,000** | **₹38,000** | **₹2,000** |

The ledger can include monthly dues, payments, partial payments, outstanding balances, penalties, adjustments, auction participation, auction winnings, prize amounts, dividends, and running balances.

### 🧾 Receipts
Generate professional printable payment receipts.

Receipt information can include:
* Receipt number
* Member
* Chit
* Payment month
* Payment date
* Amount
* Payment method
* Outstanding balance

Receipts can be printed or saved as PDF through the browser's print functionality.

### 📈 Reports
The reporting system is designed for real-world host operations.

Planned reports include:
* Monthly collection report
* Outstanding report
* Member statement
* Chit statement
* Auction report
* Payment history
* Financial summary

Reports will be designed for both on-screen viewing and printing/export.

### 📊 Excel Export
Excel export is a first-class feature. The application will generate `.xlsx` workbooks directly in the browser. No server-side processing is required.

**Example:** `CHIT-001-September-2026.xlsx`

A workbook can contain multiple worksheets: Summary, Members, Collections, Auctions, Ledger, and Outstanding. The goal is to create useful, structured Excel reports rather than simply dumping database records.

### 💾 Backup & Restore
Because Chit Fund Manager is local-first, backup is one of the most important features. Users can export their complete application data into a portable backup file.

**Example:** `ChitFund-Backup-2026-09-03.chit`

A backup may contain chits, members, monthly cycles, payments, auctions, expenses, adjustments, settings, and application metadata. The host can store backups anywhere they choose (USB drive, External hard drive, Google Drive, OneDrive, Another computer, Secure cloud storage). The application does not need direct access to these services.

### 📱 Progressive Web App
Chit Fund Manager is built as a Progressive Web App (PWA).

The application uses:
* Web App Manifest
* Service Worker
* Application caching
* IndexedDB
* Offline-first architecture

After the initial application has been loaded and cached, core functionality can continue without an internet connection. Installation is optional; the application remains usable directly from the browser.

---

## 📴 Offline First

The application is designed around this architecture:

┌─────────────────────────────┐
│          Browser            │
│                             │
│     React + TypeScript      │
│             │               │
│             ▼               │
│     Application Layer       │
│             │               │
│             ▼               │
│         Dexie.js            │
│             │               │
│             ▼               │
│         IndexedDB           │
│                             │
└─────────────────────────────┘

There is no dependency on a remote database for normal local operations.

---

## 🔐 Privacy

Chit Fund Manager follows a local-first privacy model. Operational chit data is stored in the browser's local database.

The initial application does not require:
* User registration
* Member accounts
* Passwords
* Remote databases
* Analytics
* Advertising
* Third-party tracking
* Payment servers

The GitHub repository contains application source code, not the host's private chit records.

---

## 🛡️ Data Safety

Local storage is convenient but should never be treated as a replacement for backups. The application will make backup status visible.

* Last Backup: Today, 10:42 AM [ Backup Now ]
* Warning (if no backup exists): ⚠ No backup has been created [ Create Backup ]

Destructive operations should use appropriate confirmations and safeguards.

---

## 🏗️ Architecture

The project follows a modular feature-oriented architecture.

src/
│
├── app/
│   ├── routing/
│   ├── providers/
│   └── configuration/
│
├── components/
│   ├── ui/
│   ├── layout/
│   ├── forms/
│   └── common/
│
├── features/
│   ├── dashboard/
│   ├── chits/
│   ├── members/
│   ├── collections/
│   ├── auctions/
│   ├── reports/
│   ├── backup/
│   └── settings/
│
├── db/
│   ├── database/
│   ├── migrations/
│   └── repositories/
│
├── calculations/
├── exports/
├── hooks/
├── types/
├── utils/
└── main.tsx

The architecture intentionally separates presentation, application logic, database access, financial calculations, export functionality, and data validation.

---

## 🧮 Financial Calculation Engine

Financial calculations are treated as business logic and should not be embedded directly inside UI components.

                 User Interface
                       │
                       ▼
             Application Service
                       │
                       ▼
             Calculation Engine
                       │
         ┌─────────────┼─────────────┐
         ▼             ▼             ▼
   Contributions    Auctions     Penalties
         │             │             │
         └─────────────┼─────────────┘
                       ▼
                   Settlement

Important financial calculations will be independently testable. This is especially important because different chit arrangements may use different rules.

---

## 🗄️ Data Model

**Core entities:**
* Chit
  * Members
  * Cycles (Payments, Auction)
  * Expenses
  * Adjustments

**Conceptual model:**
* Chit: `id`, `name`, `monthlyAmount`, `memberCount`, `duration`, `startDate`, `rules`
* Member: `id`, `chitId`, `memberNumber`, `name`, `phone`, `status`
* Cycle: `id`, `chitId`, `monthNumber`, `dueDate`
* Payment: `id`, `cycleId`, `memberId`, `amountDue`, `amountPaid`, `paymentDate`, `paymentMethod`
* Auction: `id`, `cycleId`, `winnerMemberId`, `bidAmount`, `prizeAmount`, `commission`, `dividend`

All database schema changes should use versioned migrations.

---

## 🎨 Design System

The interface is designed to feel like a modern professional SaaS product while remaining practical for daily financial operations.

**Design principles:**
* Clear visual hierarchy & strong typography
* Generous spacing, subtle borders, restrained shadows
* Minimal visual clutter & consistent components
* Responsive layouts & accessible controls
* Fast interactions & clear success/error states

Financial information receives strong visual priority. Color should reinforce meaning without being the only indicator.

---

## ♿ Accessibility & ⚡ Performance

* Accessibility (WCAG 2.1 AA): Keyboard navigation, visible focus states, semantic HTML, accessible form labels, sufficient contrast, screen-reader-friendly controls, clear validation messages, and destructive-action confirmations.
* Performance: Local database queries, minimal unnecessary rendering, lazy loading where appropriate, efficient list rendering, memoization, small production bundles, and browser-native capabilities.

---

## 🧪 Quality & Testing

* Testing Priorities: Unit tests (financial calculations, penalty/outstanding/date calculations, data transformations, export preparation), integration tests (chit creation, member management, payment recording, auction settlement, backup/restore), and build validation.
* Deployment Verification: Dependencies, type checking, linting, unit tests, production build, and PWA build.

---

## 🌐 Deployment & CI/CD

GitHub Repository → GitHub Actions (Install, Type Check, Lint, Test, Build) → GitHub Pages → Production PWA

No application server is required for the initial product.

---

## 🧰 Technology Stack

| Technology | Purpose |
| :--- | :--- |
| React | User interface |
| TypeScript | Type safety |
| Vite | Build tooling |
| Tailwind CSS | Design system |
| Dexie.js | IndexedDB abstraction |
| IndexedDB | Local data storage |
| PWA | Offline/installable application |
| XLSX | Excel generation |
| Vitest | Testing |
| ESLint | Code quality |
| GitHub Actions | CI/CD |
| GitHub Pages | Hosting |

---

## 🌍 Browser Support

Targeting modern browsers supporting IndexedDB, Service Workers, Web App Manifest, and ES2020+ JavaScript APIs. 
* Recommended: Google Chrome, Microsoft Edge, Mozilla Firefox, Safari. (Chromium-based browsers are recommended for the most consistent PWA experience).

---

## 🔐 Data Ownership & Database Migrations

The host owns their data. The application makes it easy to export, back up, restore, move data between devices, export financial records, and continue operating offline. 

The local database uses versioned migrations (`Database v1 → v2 → v3 → v4`), preserving existing user data wherever possible. Destructive schema changes must be carefully handled and accompanied by backup safeguards.

---

## 📁 Project Structure

chit-fund-manager/
│
├── .github/
│   └── workflows/
│       ├── ci.yml
│       └── deploy.yml
│
├── public/
│   ├── icons/
│   ├── favicon.svg
│   └── robots.txt
│
├── src/
│   ├── app/
│   ├── components/
│   ├── features/
│   ├── db/
│   ├── calculations/
│   ├── exports/
│   ├── hooks/
│   ├── types/
│   ├── utils/
│   ├── styles/
│   ├── App.tsx
│   └── main.tsx
│
├── tests/
│
├── .gitignore
├── eslint.config.js
├── index.html
├── package.json
├── postcss.config.js
├── tailwind.config.js
├── tsconfig.json
├── tsconfig.app.json
├── tsconfig.node.json
├── vite.config.ts
└── README.md

---

## 🛠️ Development

**Prerequisites:** Node.js, npm, Git *(Development requirements only. End users access the finished application through a browser).*

**Commands:**
```bash
# Clone repository
git clone [https://github.com/YOUR_USERNAME/chit-fund-manager.git](https://github.com/YOUR_USERNAME/chit-fund-manager.git)
cd chit-fund-manager

# Install dependencies
npm install

# Start development server
npm run dev

# Production build
npm run build
npm run preview

# Quality checks
npm run typecheck
npm run lint
npm run test
```

---

🗺️ Roadmap
Phase 1 — Foundation: Project architecture, application shell, responsive navigation, PWA config, IndexedDB database, migrations, theme system.
Phase 2 — Chit Management: Create/edit/archive chit, chit configuration, monthly cycles.
Phase 3 — Members: Add/edit/archive member, search, profile, member ledger.
Phase 4 — Collections: Monthly dues, recording payments (full/partial), outstanding balances, payment history/methods, late-payment penalties.
Phase 5 — Auctions: Auction workflow, bid recording, winner selection, configurable calculations, settlement, history.
Phase 6 — Reports: Monthly statement, member statement, outstanding report, auction report, financial summary, receipt generation, print/PDF.
Phase 7 — Exports: Excel/CSV export, complete data export, backup, restore, validation.
Phase 8 — Production Polish: Offline validation, responsive optimization, accessibility audit, performance optimization, error recovery, migration testing, PWA validation, CI/CD, production release.

---

🔮 Future Possibilities
Cloud sync, multi-device support, host accounts, member portal, online payment integration, WhatsApp reminders, automated notifications, multi-branch management, advanced accounting, role-based permissions, cloud backup, native mobile applications, and audit trails. (Deliberately outside the initial local-first release).

---

📌 Project Status
Chit Fund Manager is being developed as a professional local-first Progressive Web App prioritizing financial correctness, data integrity, offline reliability, backup/recovery, ease of daily use, performance, accessibility, maintainable architecture, and professional UX.

---

📄 License & Contributing
License: To be determined before public release. Until explicitly added, all rights are reserved.
Contributing: Follows a quality-first approach. Define user workflows, business rules, and data model changes; implement business logic independently; add tests; validate migrations; verify backup/restore; test offline behavior and responsive layouts; and update documentation.

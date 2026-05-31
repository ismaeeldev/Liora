# Aldora | Premium Behavioral Health Marketplace

Aldora is a premium, SaaS-grade behavioral health and addiction treatment directory. It connects patients, families, and healthcare providers to verified and trustworthy treatment clinics, residential rehab centers, and outpatient programs nationwide.

---

## 🌟 Key Features

### 🔍 Advanced Filter and Search Portal
* **Zillow-Style Search Experience**: Interactive split-screen layout with card listings and nationwide dynamic Leaflet map integration.
* **Smart Filter Pills**: Responsive filters for treatment types (detox, inpatient, PHP/IOP, therapy), accepted insurance carriers, age groups, and gender programs.
* **Advanced Filters Modal**: Quickly search for premium amenities like private rooms, chef-prepared meals, pool access, and pet-friendly properties.

### 🏥 Premium Facility Details
* **High-Contrast Accommodations Card**: Clear bedroom capacities, stay durations, and image zooms.
* **Structured Clinician Details**: Dual-diagnosis care, licensed clinical services, and credential tracking.
* **Patient Reviews Summary**: Interactive rating distribution summary bars and feedback lists.

### 🛡️ HIPAA & Secure Inquiries
* **Confidential Intake Forms**: Encrypted transmission channels for patient intake queries.
* **Validation Control**: High-contrast, robust client-side validation built on React Hook Form and Zod schemas.

### 🔑 Admin Workspace
* **Facility Management Dashboard**: Secure admin interface to add new facilities, upload license statuses, modify operational details, configure coordinates, and manage images.

---

## 💻 Technology Stack

* **Frontend Framework**: Next.js 16 (App Router, Turbopack enabled)
* **Programming Language**: TypeScript
* **State Management & Fetching**: Zustand & React Query
* **Database & ORM**: Prisma ORM with Neon (PostgreSQL)
* **Styling & Theme**: Tailwind CSS & CSS Variables (Dark & Light support)
* **Forms & Validation**: React Hook Form, Hookform Resolver, and Zod
* **Icons & Animation**: Lucide React & Framer Motion

---

## 📁 Directory Architecture

```bash
Aldora/
├── app/                       # Next.js App Router (dynamic pages, search, legal, and resources)
├── components/                # Reusable UI, Layout, Home, Listing, and Admin components
│   ├── admin/                 # Facility creation and dashboard forms
│   ├── layout/                # Global Navbar, Footer, and Page Containers
│   ├── listing-detail/        # Rooms, Reviews, Services, and Pricing components
│   ├── listings/              # Listing Cards and split-screen list view
│   └── ui/                    # Base components (Button, Card, Popover, Dialog, etc.)
├── hooks/                     # Custom application react hooks
├── lib/                       # Database client, server actions, validations, and providers
│   ├── actions/               # Prisma server actions for facilities and uploads
│   ├── validations/           # Unified Zod schemas (facility, inquiry, etc.)
│   └── store/                 # Zustand state stores (e.g. maps)
├── prisma/                    # Schema, migrations, and database seed assets
└── public/                    # Static image files and upload dropzone
```

---

## ⚙️ Development Instructions

### 1. Prerequisites
Ensure you have Node.js (v18+) and your database credentials set up.

### 2. Environment Setup
Create a `.env` file in the root directory:
```env
DATABASE_URL="your-postgresql-neon-database-url"
NEXT_PUBLIC_APP_URL="http://localhost:3000"
```

### 3. Setup and Run
Install dependencies:
```bash
npm install
```

Generate Prisma client:
```bash
npx prisma generate
```

Run the development server:
```bash
npm run dev
```

Your app will be live at `http://localhost:3000`.

---

## 🔒 Accessibility & Polish
* **Keyboard Navigation**: Native `focus-visible` state outline compliance.
* **Premium Theme Harmony**: Harmonic sky, teal, and slate colors paired with subtle micro-scale lift animations.

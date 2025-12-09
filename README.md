# Document Locker

A secure document management system built with Next.js and Supabase that allows users to upload, store, and manage their files with authentication.

## Features

- **Secure Authentication** - Open Auth authentication (Google) powered by Supabase
- **File Upload** - Upload and store documents securely
- **Dashboard** - View and manage all your uploaded files
- **Modern UI** - Built with shadcn/ui components
- **Protected Routes** - Middleware-based route protection

## Tech Stack

- **Framework**: [Next.js 15](https://nextjs.org) with App Router
- **Authentication**: [Supabase Auth](https://supabase.com/auth)
- **Storage**: [Supabase Storage](https://supabase.com/storage)
- **UI Components**: [shadcn/ui](https://ui.shadcn.com)
- **Styling**: [Tailwind CSS](https://tailwindcss.com)
- **Language**: TypeScript

## Getting Started

### Prerequisites

- Node.js 18+ installed
- A Supabase account and project set up

### Environment Variables

Create a `.env.local` file in the root directory with your Supabase credentials:

```env
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
```

### Installation

1. Clone the repository
2. Install dependencies:

```bash
npm install
```

3. Run the development server:

```bash
npm run dev
```

4. Open [http://localhost:3000](http://localhost:3000) in your browser

## Usage

1. **Sign Up/Login**: log in with google on the home page
2. **Upload Files**: Navigate to the dashboard and upload your documents
3. **Manage Files**: View all your uploaded files in the dashboard



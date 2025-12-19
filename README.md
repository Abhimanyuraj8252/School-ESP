# School ESP - School Management System

A comprehensive school management system built with Next.js, Supabase, and Razorpay.

## Features

- 🎓 Student Management
- 👨‍🏫 Teacher Dashboard
- 💰 Fee Management with Razorpay Integration
- 📝 Homework & Assignments
- 📊 Exam Results & Report Cards
- 🔔 Notices & Announcements
- 👤 Multiple User Roles (Admin, Teacher, Student, Office)
- 📱 Responsive Design

## Tech Stack

- **Frontend:** Next.js 16, React 19, TailwindCSS
- **Backend:** Supabase (PostgreSQL)
- **Payment:** Razorpay
- **UI Components:** Radix UI, Shadcn/ui
- **PDF Generation:** jsPDF, pdf-lib

## Getting Started

### Prerequisites

- Node.js 20 or higher
- npm or yarn
- Supabase account
- Razorpay account (for payment features)

### Installation

1. Clone the repository:
```bash
git clone https://github.com/Abhimanyuraj8252/School-ESP.git
cd School-ESP
```

2. Install dependencies:
```bash
npm install
```

3. Set up environment variables:

Create a `.env.local` file in the root directory and add:

```env
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key
DATABASE_URL=your_database_url
NEXT_PUBLIC_RAZORPAY_KEY_ID=your_razorpay_key_id
RAZORPAY_KEY_SECRET=your_razorpay_secret
```

4. Run the development server:
```bash
npm run dev
```

Open https://schoolesp.netlify.app/ to view it in the browser.

### Building for Production

```bash
npm run build
npm start
```

## Deployment

### Deploy to Vercel (Recommended for Next.js)

1. Push your code to GitHub
2. Import your repository on [Vercel](https://vercel.com)
3. Add environment variables in Vercel dashboard
4. Deploy!

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/Abhimanyuraj8252/School-ESP)

### Deploy to Netlify

1. Push your code to GitHub
2. Connect your repository on [Netlify](https://netlify.com)
3. Add environment variables in Netlify dashboard
4. Build command: `npm run build`
5. Publish directory: `.next`
6. Install the Next.js plugin: `@netlify/plugin-nextjs`

## Environment Variables

Make sure to set these environment variables in your deployment platform:

- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- `SUPABASE_SERVICE_ROLE_KEY`
- `DATABASE_URL`
- `NEXT_PUBLIC_RAZORPAY_KEY_ID`
- `RAZORPAY_KEY_SECRET`

## Project Structure

```
├── app/                    # Next.js app directory
│   ├── actions/           # Server actions
│   ├── admin/             # Admin dashboard
│   ├── teacher/           # Teacher dashboard
│   ├── student/           # Student dashboard
│   ├── office/            # Office staff dashboard
│   └── api/               # API routes
├── components/            # React components
│   ├── ui/               # UI components (Shadcn)
│   ├── admin/            # Admin-specific components
│   └── teacher/          # Teacher-specific components
├── lib/                   # Utility libraries
├── utils/                 # Helper functions
└── public/               # Static assets
```

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.

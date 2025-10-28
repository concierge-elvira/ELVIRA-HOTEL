# Modern Supabase Web App

A modern, full-stack web application built with React, TypeScript, Vite, and Supabase. This project provides a solid foundation for building scalable web applications with authentication, real-time capabilities, and a beautiful UI.

## 🚀 Tech Stack

- **Frontend**: React 18 with TypeScript
- **Build Tool**: Vite (for fast development and optimized builds)
- **Database**: Supabase (PostgreSQL with real-time subscriptions)
- **Authentication**: Supabase Auth (email/password, OAuth providers)
- **Styling**: Tailwind CSS (utility-first CSS framework)
- **Code Quality**: ESLint + TypeScript for linting and type checking

## ✨ Features

- 🔐 **Authentication System**: Complete sign-up/sign-in flow with Supabase Auth
- 🎨 **Modern UI**: Responsive design with Tailwind CSS
- 📱 **Mobile-First**: Responsive design that works on all devices
- 🔥 **Fast Development**: Hot Module Replacement (HMR) with Vite
- 🛡️ **Type Safety**: Full TypeScript support throughout the application
- 🏗️ **Scalable Architecture**: Well-organized folder structure and reusable components

## 🏗️ Project Structure

```
src/
├── components/          # Reusable React components
│   └── Auth.tsx        # Authentication component
├── hooks/              # Custom React hooks
│   └── useAuth.ts      # Authentication hook
├── lib/                # Utility libraries and configurations
│   └── supabase.ts     # Supabase client configuration
├── types/              # TypeScript type definitions
│   └── database.ts     # Database schema types
└── assets/             # Static assets (images, icons, etc.)
```

## 🚀 Getting Started

### Prerequisites

- Node.js (v18 or higher)
- npm or yarn
- A Supabase account ([create one here](https://supabase.com))

### 1. Clone and Install

```bash
# Install dependencies
npm install
```

### 2. Set up Supabase

1. Create a new project at [Supabase](https://supabase.com)
2. Go to Settings > API to find your project URL and anon key
3. Copy `.env.example` to `.env.local`:

```bash
cp .env.example .env.local
```

4. Add your Supabase credentials to `.env.local`:

```env
VITE_SUPABASE_URL=your_supabase_project_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
```

### 3. Update Database Types (Optional)

Generate TypeScript types from your Supabase schema:

```bash
npx supabase gen types typescript --project-id YOUR_PROJECT_ID > src/types/database.ts
```

### 4. Start Development Server

```bash
npm run dev
```

The app will be available at `http://localhost:5173`

## 🛠️ Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build locally
- `npm run lint` - Run ESLint

## 🔧 Configuration

### Environment Variables

Create a `.env.local` file with the following variables:

```env
VITE_SUPABASE_URL=your_supabase_project_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
```

### Supabase Setup

1. **Enable Authentication**: In your Supabase dashboard, go to Authentication > Settings
2. **Configure Providers**: Set up email/password and any OAuth providers you want
3. **Set up RLS**: Create Row Level Security policies for your tables
4. **Database Schema**: Create your tables and update `src/types/database.ts`

## 📁 Key Files

- `src/lib/supabase.ts` - Supabase client configuration
- `src/hooks/useAuth.ts` - Authentication state management
- `src/components/Auth.tsx` - Authentication UI component
- `src/types/database.ts` - TypeScript types for your database schema

## 🎨 Styling

This project uses Tailwind CSS for styling. The configuration is in `tailwind.config.js`. You can customize:

- Colors and themes
- Fonts and typography
- Spacing and sizing
- Responsive breakpoints

## 🚀 Deployment

### Build for Production

```bash
npm run build
```

The built files will be in the `dist` directory.

### Deploy to Vercel

1. Push your code to GitHub
2. Connect your repository to [Vercel](https://vercel.com)
3. Add your environment variables in Vercel dashboard
4. Deploy!

### Deploy to Netlify

1. Build the project: `npm run build`
2. Upload the `dist` folder to [Netlify](https://netlify.com)
3. Add your environment variables in Netlify dashboard

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/amazing-feature`
3. Commit your changes: `git commit -m 'Add amazing feature'`
4. Push to the branch: `git push origin feature/amazing-feature`
5. Open a Pull Request

## 📚 Learn More

- [React Documentation](https://react.dev)
- [TypeScript Documentation](https://www.typescriptlang.org)
- [Vite Documentation](https://vitejs.dev)
- [Supabase Documentation](https://supabase.com/docs)
- [Tailwind CSS Documentation](https://tailwindcss.com)

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

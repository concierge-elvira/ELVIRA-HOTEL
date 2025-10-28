# Project Copilot Instructions

This is a modern web application built with React, TypeScript, Vite, and Supabase.

## Tech Stack

- **Frontend**: React 18 with TypeScript
- **Build Tool**: Vite
- **Database**: Supabase (PostgreSQL)
- **Authentication**: Supabase Auth
- **Styling**: Tailwind CSS
- **Code Quality**: ESLint, Prettier

## Project Structure

```
src/
├── components/     # Reusable UI components
├── screens/        # Main application views/pages
│   ├── guest/      # Guest-related screens
│   ├── hotel/      # Hotel management screens
│   └── elvira/     # Elvira-specific screens
├── hooks/          # Custom React hooks
├── services/       # API or Supabase calls
├── utils/          # Helper functions
├── contexts/       # React contexts or providers
├── types/          # TypeScript interfaces and types
├── lib/            # Utility libraries and configurations
└── assets/         # Static assets
```

## Code Organization Guidelines

**Always keep the codebase clean, modular, and scalable.**
Organize the project using folders and subfolders according to feature, functionality, or component type.

### Guidelines:

- **No long scripts**: Split logic into smaller, well-named files and reusable modules.

- **Refactor proactively**: If the code grows too long or repetitive, refactor into helper functions, hooks, components, or utilities.

- **Use clear structure**:

  - `/components` for UI elements
  - `/hooks` for custom React hooks
  - `/services` for API or Supabase calls
  - `/utils` for helper functions
  - `/contexts` for React contexts or providers
  - `/screens` or `/pages` for main views
  - `/types` for TypeScript interfaces and types

- **Follow consistent naming conventions** (camelCase for functions, PascalCase for components, snake_case for files if applicable).

- **Write concise, readable code** with comments where necessary, but prefer self-explanatory names.

- **Ensure imports are clean and relative** (no unused imports, no circular dependencies).

- **When adding new logic, plan folder placement first, then write the code.**

### Before finalizing any script:

- Check if it can be modularized.
- Check if similar code already exists (avoid duplication).
- Keep files short — under ~150 lines when possible.

**Goal**: Maintain a well-structured, professional, and scalable project layout that is easy to navigate and extend.

## Development Guidelines

- Use TypeScript for all components and utilities
- Follow React functional components with hooks
- Use Supabase client for database operations and authentication
- Apply Tailwind CSS for styling (emerald green as primary color)
- Maintain proper error handling and loading states
- Follow the existing folder structure and naming conventions

## Environment Setup

1. Copy `.env.example` to `.env.local`
2. Add your Supabase project URL and anon key
3. Update database types in `src/types/database.ts` based on your schema

## Key Features Implemented

- Authentication system with login and password reset
- Supabase client configuration
- Custom useAuth hook for authentication state
- Responsive UI with Tailwind CSS (emerald green theme)
- TypeScript support throughout
- Clean, simple login interface

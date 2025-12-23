# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is a quiz generation and revision application built with Next.js 15, featuring AI-powered quiz creation using Groq's Llama 3.3 model. Users can generate quizzes from text content, organize them by categories, track their progress, and use spaced repetition for learning.

## Development Commands

```bash
# Development
npm run dev        # Start development server on http://localhost:3000

# Build
npm run build      # Generate Prisma client and build for production

# Production
npm start          # Start production server

# Linting
npm run lint       # Run ESLint

# Database
npx prisma generate        # Generate Prisma client
npx prisma studio          # Open Prisma Studio GUI
npx prisma db push         # Push schema changes to database
npx prisma migrate dev     # Create and apply migrations
```

## Architecture

### Database Schema (Prisma)

The application uses **SQLite for local development** and can be configured for **PostgreSQL in production** (see `prisma/schema.prisma:14-18`).

Key models and relationships:
- **User**: Central model with authentication data, usage limits (`usageMax` field for AI generation credits), and relationships to Quiz, QuizResult, Category, and Review
- **Quiz**: Generated quizzes with title, description, sourceText, and relationships to Questions and QuizResults
- **Question**: Quiz questions with text, options (stored as JSON string), correctAnswer, and explication
- **QuizResult**: Stores completion results with score, percentage, duration, and mode (normal/timed/revision)
- **UserAnswer**: Individual answers tracking correctness and time spent per question
- **Category**: User-defined categories with name, color, and icon for organizing quizzes
- **Review**: Spaced repetition review entries linked to users
- NextAuth models: Account, Session, VerificationToken

Important: Question options are stored as JSON strings and must be parsed/stringified when reading/writing.

### Authentication

Authentication is handled by NextAuth v4 with a flexible provider system (`lib/authConfig.ts:12-83`):
- **Credentials provider**: Always enabled, uses bcrypt for password hashing
- **GitHub OAuth**: Conditionally enabled if `GITHUB_ID` and `GITHUB_SECRET` are set
- **Google OAuth**: Conditionally enabled if `GOOGLE_ID` and `GOOGLE_SECRET` are set
- **Session strategy**: JWT (required for credentials provider)
- **Custom pages**: `/auth/signin`, `/auth/error`

The session includes user ID injected via JWT callbacks for database queries.

### AI Integration

Quiz generation uses **Groq API with Llama 3.3 70B** (`app/api/quizz/route.ts`):
- Model: `llama-3.3-70b-versatile` (free and fast)
- Uses structured JSON output format
- System prompt enforces strict JSON format with 4 options per question
- Each generation decrements user's `usageMax` credit
- Validates minimum content length (50 chars) and credit availability
- Max duration: 30 seconds per request

Environment variable: `GROQ_API_KEY` (required)

### API Routes Structure

```
app/api/
├── auth/
│   ├── [...nextauth]/route.ts    # NextAuth handler
│   └── register/route.ts         # User registration
├── quizz/route.ts                # AI quiz generation (POST)
├── quiz/
│   ├── save/route.ts             # Save generated quiz (POST)
│   ├── result/route.ts           # Save quiz results (POST)
│   └── history/route.ts          # Get user quiz history (GET)
├── categories/route.ts           # CRUD for categories
└── stats/route.ts                # User statistics
```

### Environment Variables

Required variables (see `src/env.ts`):
- `DATABASE_URL`: SQLite file path or PostgreSQL connection string
- `NEXTAUTH_SECRET`: Secret for NextAuth session encryption
- `GROQ_API_KEY`: Groq API key for quiz generation

Optional OAuth variables:
- `GITHUB_ID`, `GITHUB_SECRET`: GitHub OAuth
- `GOOGLE_ID`, `GOOGLE_SECRET`: Google OAuth
- `OPENAI_KEY`: Backup OpenAI integration (not currently used)

Environment validation uses `@t3-oss/env-nextjs` for type safety.

### Frontend Structure

- **App Router**: Next.js 15 app directory structure
- **Pages**:
  - `/` - Landing page
  - `/dashboard` - User dashboard with stats and quick actions
  - `/quizz` - Quiz creation interface
  - `/quizz/game` - Quiz gameplay
  - `/quizz/timed` - Timed quiz mode
  - `/revision` - Spaced repetition revision
  - `/history` - Quiz history
  - `/stats` - User statistics
  - `/auth/signin`, `/auth/signup` - Authentication pages

- **Components** (`components/`):
  - `quizz/GenerateAiQuestion.tsx` - AI quiz generation form
  - `quizz/StartQuizz.tsx` - Quiz gameplay component
  - `quizz/TimedQuiz.tsx` - Timed quiz variant
  - `quizz/QuizzOptionsForm.tsx` - Quiz configuration
  - `history/` - Quiz history components
  - `stats/` - Statistics visualization
  - `ui/` - Reusable UI components (shadcn/ui based)
  - `dashboard/` - Dashboard-specific components

### State Management

- **Zustand**: Client-side state management (see `src/zustand/`)
- **React Query**: Server state and caching (`@tanstack/react-query`)
- **React Hook Form**: Form handling with Zod validation

### Styling

- **Tailwind CSS**: Utility-first styling
- **shadcn/ui**: Component library built on Radix UI
- **next-themes**: Dark mode support
- **DaisyUI**: Additional UI components
- Path alias: `@/*` maps to project root

## Key Implementation Notes

1. **Quiz Generation Flow**:
   - User submits text content via `GenerateAiQuestion.tsx`
   - POST to `/api/quizz` with content and questionCount
   - Groq API generates JSON array of questions
   - Frontend parses and displays questions
   - User can save quiz via `/api/quiz/save`

2. **Question Storage**:
   - Options are stored as JSON strings in the database
   - Always use `JSON.stringify(options)` before saving
   - Always use `JSON.parse(options)` when reading

3. **Usage Credits**:
   - Users have `usageMax` field tracking remaining AI generation credits
   - Decremented on each successful quiz generation
   - Check availability before generation in `/api/quizz`

4. **Quiz Modes**:
   - Normal: Standard quiz taking
   - Timed: Time-limited quiz with countdown
   - Revision: Spaced repetition based on previous results

5. **Database Switching**:
   - Local: SQLite (`file:./dev.db`)
   - Production: Uncomment PostgreSQL config in `schema.prisma:14-18`
   - Always run `prisma generate` after schema changes
   - Run `prisma db push` for SQLite or `prisma migrate dev` for PostgreSQL

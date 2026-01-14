# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

OurVocab is a personalized vocabulary learning PWA (Progressive Web App) designed for spaced repetition learning using the Ebbinghaus forgetting curve algorithm. The app features a learning mode for new words and a review mode with three-tier feedback (remember/fuzzy/forget).

## Commands

```bash
npm install          # Install dependencies
npm run dev          # Start development server (http://localhost:3000)
npm run build        # Build for production
npm run start        # Start production server
npm run lint         # Run ESLint
```

## Environment Variables

Copy `.env.example` to `.env.local` and configure:
- `MONGODB_URI` - MongoDB Atlas connection string
- `ADMIN_PASSWORD` - Password for admin interface at `/admin-secret`

## Tech Stack

- **Frontend**: Next.js 14 (App Router) + Tailwind CSS + Framer Motion
- **Database**: MongoDB with Mongoose ODM
- **Deployment**: Vercel
- **PWA**: next-pwa plugin for offline support

## Architecture

### Project Structure

```
src/
├── app/                    # Next.js App Router pages
│   ├── api/               # API routes
│   │   ├── words/today/   # GET - fetch daily tasks
│   │   ├── words/review/  # POST - submit review feedback
│   │   ├── stats/heatmap/ # GET - learning statistics
│   │   └── admin/         # Admin CRUD (words, quotes)
│   ├── learn/             # Learning new words page
│   ├── review/            # Review with flip cards
│   ├── stats/             # Statistics with heatmap
│   ├── settings/          # User settings
│   └── admin-secret/      # Hidden admin interface
├── components/            # React components
│   ├── WordCard.tsx       # Learning card component
│   ├── FlipCard.tsx       # Review flip card with animation
│   ├── Heatmap.tsx        # GitHub-style contribution heatmap
│   ├── TaskCard.tsx       # Home page task cards
│   └── BottomNav.tsx      # Navigation bar
├── models/                # Mongoose schemas
│   ├── Word.ts            # Vocabulary entries
│   ├── UserProgress.ts    # Learning progress tracking
│   └── Config.ts          # App configuration
└── lib/
    ├── mongodb.ts         # DB connection (singleton pattern)
    └── ebbinghaus.ts      # Spaced repetition algorithm
```

### Data Models

- **Word**: word, phonetic, meanings[], collocations[], sentences[{en, cn}], is_custom
- **UserProgress**: word_id, stage (0-8), next_review_time, wrong_count, status
- **Config**: key-value store for app settings

### Ebbinghaus Algorithm (src/lib/ebbinghaus.ts)

Review intervals: 5min → 30min → 12h → 1d → 2d → 4d → 7d → 15d

Feedback handling:
- **Green (remember)**: stage++, schedule INTERVALS[stage]
- **Yellow (fuzzy)**: keep stage, schedule at half current interval
- **Red (forget)**: reset to stage 1, increment wrong_count

### API Endpoints

| Method | Path | Purpose |
|--------|------|---------|
| GET | /api/words/today | Get today's new words and due reviews |
| POST | /api/words/review | Submit feedback (wordId/progressId, feedback, isNewWord) |
| GET | /api/stats/heatmap | Get heatmap data and statistics |
| GET/POST/PUT/DELETE | /api/admin/words | Admin CRUD for vocabulary |
| GET/PUT | /api/admin/quote | Manage daily greeting messages |

Admin routes require `Authorization: Bearer <ADMIN_PASSWORD>` header.

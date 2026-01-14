# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

OurVocab is a personalized vocabulary learning PWA (Progressive Web App) designed for spaced repetition learning using the Ebbinghaus forgetting curve algorithm. The app features a learning mode for new words and a review mode with three-tier feedback (remember/fuzzy/forget).

## Tech Stack

- **Frontend**: Next.js + Tailwind CSS
- **Database**: MongoDB with Mongoose ODM
- **Deployment**: Vercel
- **PWA**: next-pwa plugin for offline support
- **Audio**: Web Speech API (window.speechSynthesis) for pronunciation

## Architecture

### Data Models

Three core collections in MongoDB:

1. **Word** - Vocabulary entries with phonetic, meanings, collocations, example sentences
2. **UserProgress** - Tracks learning stage (0-8), next_review_time, wrong_count per word per user
3. **Config** - Key-value store for app settings like daily quotes

### Ebbinghaus Algorithm

Review intervals: 5min → 30min → 12h → 1d → 2d → 4d → 7d → 15d

Feedback handling:
- **Green (remember)**: Advance stage, schedule next interval
- **Yellow (fuzzy)**: Keep stage, schedule at half current interval
- **Red (forget)**: Reset to stage 1, increment wrong_count

### API Endpoints

| Method | Path | Purpose |
|--------|------|---------|
| GET | /api/tasks | Get today's new words and due reviews |
| POST | /api/review | Submit feedback (wordId, feedback) |
| GET | /api/stats | Get heatmap and statistics data |
| POST | /api/admin/words | Admin CRUD for vocabulary |
| PUT | /api/admin/quote | Update daily greeting message |

### Key Features

- Daily new word picker (5-10 words from COCA 5000 corpus)
- Admin interface at hidden `/admin-secret` path
- GitHub-style contribution heatmap for learning streaks
- Flip card animation for review sessions (use framer-motion)

# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
npm run dev      # Start dev server with HMR
npm run build    # Build production bundle → dist/
npm run preview  # Preview production build locally
npm run lint     # Run ESLint
npm run deploy   # Build + deploy to GitHub Pages
```

No test framework is configured.

## Architecture

React 19 + Vite 7 single-page quiz app. No router — screens are determined by state in `App.jsx`:

```
App (state: playerName, answers, darkMode)
├─ !playerName        → <StartScreen />   (name entry)
├─ playerName, !answers → <Quiz />        (question navigation)
└─ playerName, answers  → <Results />     (score + review)
```

**Data flow:**
- Quiz questions live in `src/data/sampleQuestions.json`
- Quiz metadata (title, Google Sheet URL) in `src/data/quizConfig.json`
- Answers are stored as an object keyed by question ID in `App.jsx` state
- On completion, `Results.jsx` POSTs to `/api/history` (custom Vite middleware → `quiz-history.json`) and optionally to a Google Sheet

**Custom Vite plugin** in `vite.config.js` adds middleware that handles `GET/POST /api/history` for file-based result persistence during development.

**Theme system:** CSS variables toggled via `data-theme="light|dark"` on `<html>`. Preference persisted to `localStorage` key `theme`.

**Deployment:** GitHub Pages at base path `/quiz-app-for-practice/` (set in `vite.config.js`).

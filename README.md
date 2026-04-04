# FrameDrop

FrameDrop is a modern screenshot and video beautifier built with React + Vite.

It helps you wrap screenshots or short videos in polished backgrounds, apply frame styling, and export ready-to-share media for social posts.

## Features

- Upload image or video (PNG, JPG, WEBP, MP4, MOV, WEBM)
- Drag-and-drop upload support
- Background library:
  - Unsplash-style photo presets
  - Solid color presets
  - Gradient presets
- AI background generation (Pollinations-based)
- Frame controls:
  - Aspect ratio
  - Padding
  - Corner radius
  - Shadow intensity
  - Glass border + strength
- Light and dark mode with animated theme transition
- Export options:
  - Copy framed image to clipboard
  - Download framed image as PNG
  - Download framed video as WEBM
- Share flow for X with clipboard-first image workflow
- Responsive layout with mobile drawers

## Tech Stack

- React 19
- Vite 8
- Plain CSS (custom design system)
- Canvas API + MediaRecorder for rendering/export

## Getting Started

### 1. Install dependencies

```bash
npm install
```

### 2. Run development server

```bash
npm run dev
```

Open the local URL shown in terminal (usually http://localhost:5173).

### 3. Build for production

```bash
npm run build
```

### 4. Preview production build locally

```bash
npm run preview
```

## Project Structure

```text
FrameDrop/
  src/
    App.jsx        # Main app logic and UI
    index.css      # App styling and theme system
    main.jsx       # React entry point
  index.html
  vite.config.js
  package.json
```

## Deploy to Vercel

### Option A: GitHub + Vercel Dashboard

1. Push this repository to GitHub.
2. In Vercel, click "Add New Project" and import the repo.
3. Vercel should auto-detect Vite.
4. Confirm settings:
   - Build Command: `npm run build`
   - Output Directory: `dist`
   - Install Command: `npm install`
5. Deploy.

### Option B: Vercel CLI

```bash
npm i -g vercel
vercel
vercel --prod
```

## Notes

- AI generation availability may vary due to third-party free endpoint rate limits.
- X web composer cannot auto-attach files via URL; FrameDrop copies the image to clipboard so you can paste it directly.

## License

Use and modify freely for personal and commercial projects.

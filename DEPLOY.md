# Deploy to GitHub Pages

## Quick Start

1. Create a new GitHub repository (public)
2. Extract this zip and push all files to the `main` branch
3. Go to **Settings → Pages → Source → GitHub Actions**
4. Push any change to trigger a build — your app will be live in ~2 minutes

## Your app URL
`https://YOUR-USERNAME.github.io/REPO-NAME/`

## Local development
```bash
npm install
npm run dev
```

## Notes
- All data is stored in the browser (localStorage) — no backend needed
- Works as a PWA — users can install it to their home screen
- The logo is embedded as base64 so no external assets needed

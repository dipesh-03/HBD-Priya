# A Little Birthday Magic

A short, elegant, playful birthday website built with React, TypeScript, and Vite.

## Customize it

All personalization lives in `src/config.ts`:

1. Change `recipientName`.
2. Change `closingMessage` if desired.
3. Put four photos in `public/photos` and update their paths, alt text, and captions.
4. Optionally put an audio file you own in `public/music` and set `song.src` (for example, `/music/song.mp3`). The music control stays hidden when the path is empty.

Portrait photos work best. Export them as WebP or AVIF at about 1200–1600 px on the long edge, ideally under 350 KB each. Remove location metadata before adding them.

## Run locally

```powershell
npm.cmd install
npm.cmd run dev
```

## Verify and build

```powershell
npm.cmd test
npm.cmd run build
```

## Deploy to Vercel

Push the project to a private GitHub repository, import it into Vercel, and use the default Vite settings. `vercel.json`, `robots.txt`, and the page metadata request that search engines do not index the site. Anyone with the deployment URL can still access it, so do not include sensitive information.

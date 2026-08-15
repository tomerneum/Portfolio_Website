# Tomer Neumann — Portfolio

A replacement for the Adobe Portfolio site, built to do the one thing Portfolio
could not: play video instantly on the main page.

All content — 13 projects, their text, and 121 images — was pulled from
`tomerneum.myportfolio.com` and now lives in this repo.

---

## Running it

```bash
npm install
npm run dev
```

Then open <http://localhost:3000>.

To check the production build:

```bash
npm run build && npm start
```

---

## Adding your videos

This is the part that matters. The site is already wired for video — it just
needs the files.

1. Create a `videos-src/` folder in this directory.
2. Drop your master video files in, **named after the project slug**:

   ```
   videos-src/impossible-ceramics.mov
   videos-src/hydroponic-system.mp4
   videos-src/showreel.mp4          <- the fullscreen home page hero
   ```

   The slugs are the keys in `site.config.js` under `projectMeta`.
   Any format ffmpeg reads will work (`.mov`, `.mp4`, `.avi`, `.mkv`, …).

3. Encode them:

   ```bash
   npm run videos
   ```

4. Rebuild and redeploy. Tiles with a video become live automatically; tiles
   without one keep showing their still cover. Nothing else to change.

### What the encoder does, and why

`npm run videos` writes a `.mp4` and a matching `.poster.jpg` into
`public/videos/`. Three settings do the heavy lifting for perceived speed:

| Setting | Why |
| --- | --- |
| `-movflags +faststart` | Moves the file index to the front so playback can begin before the file finishes downloading. Without it the browser waits for the whole file. |
| `-an` | Strips audio. Browsers only permit silent autoplay, so the audio track is pure dead weight. |
| `-pix_fmt yuv420p` | The only chroma layout every browser decodes. Skipping it gives a video that plays on your machine and shows black elsewhere. |

Grid loops are capped at 12 seconds and 720p — the tile is small and the point
is motion, not detail. Adjust `MAX_SECONDS`, `HEIGHT` and `CRF` at the top of
`scripts/prepare-videos.cjs` if you want longer or sharper clips.

---

## How "instant" actually works

`components/VideoTile.js` is the whole trick, and it is three rules:

1. **Never show an empty box.** The poster image paints immediately, so a tile
   always has something in it.
2. **Only load what is nearly on screen.** An `IntersectionObserver` attaches
   the video source ~300px before the tile scrolls into view, and pauses videos
   that scroll away. A dozen clips on one page therefore never compete for
   bandwidth at once — the ones you are looking at get all of it.
3. **Only reveal video once it can play.** The clip cross-fades over the poster
   on `canplay`, so you never catch a black frame or a stutter.

Videos are served from this server with HTTP range support (`206 Partial
Content`), which is what lets playback start from a partial download.

The site also respects `prefers-reduced-motion` — those visitors keep the
poster image and nothing moves.

---

## Deploying to Railway

The repo ships a `Dockerfile` and `railway.json`; Railway needs no extra setup.

1. Push this folder to a GitHub repo.
2. In Railway: **New Project → Deploy from GitHub repo**, pick it.
3. Railway reads `railway.json`, builds the Dockerfile, and deploys. It injects
   `PORT` automatically — the server already binds to it on `0.0.0.0`.
4. **Settings → Networking → Generate Domain** for a public URL, or add your
   own domain there.

Deploys are around 35 MB. The 287 MB of full-resolution originals in
`public/images/` are deliberately excluded from both git and the Docker image
(see `.gitignore` and `.dockerignore`) — the site serves the derivatives in
`public/img/` instead. Keep `public/images/` locally as your masters.

---

## Editing the site

Almost everything you would want to change is in **`site.config.js`**:

| What | Where |
| --- | --- |
| Name, role, email, social links | `site` |
| The headline over the hero video | `site.statement` |
| Nav links | `site.nav` |
| Hero video path | `hero.video` |
| Per-project subtitle line | `projectMeta[slug].meta` |
| Per-project hover colour | `projectMeta[slug].accent` |
| Grid order | `featuredOrder` |

Project text and images live in `content.json`.

The `meta` lines are currently short descriptors ("Material research", "Product
design"). Kilo uses *Client / Year* — swap them over as you fill in real
clients and dates.

---

## Project layout

```
app/                 pages: home, work, work/[slug], about, archive, contact
components/
  VideoTile.js       the instant-video component
  ProjectGrid.js     the hover-accent grid
  Modules.js         renders each project's text/image/gallery/video blocks
  Nav.js Footer.js Hero.js
lib/
  content.js         reads content.json + image manifest
  videos.js          detects which video files exist
scripts/
  optimize-images.cjs  full-res -> responsive WebP  (npm run images)
  convert-gifs.cjs     animated GIF -> mp4
  prepare-videos.cjs   your masters -> web loops    (npm run videos)
content.json         all project text and image references
image-manifest.json  generated: variants, dimensions, mp4 replacements
```

---

## What was carried over, and what changed

**Carried over:** all 13 projects with their original titles and body text, all
121 images, the About text, the Archive gallery, and every project video.

**Changed on purpose:**

- **Animated GIFs → MP4.** The original site's motion previews were 120 MB of
  GIF across 13 clips. Re-encoded to H.264 they are 5.5 MB — about 22× smaller,
  and they start playing sooner. Run `npm run images` then
  `node scripts/convert-gifs.cjs` to regenerate.
- **Images → WebP.** 287 MB of JPEG/PNG became 24 MB of responsive WebP.
- **YouTube embeds remain as a fallback.** Nine project videos are still
  YouTube embeds on their detail pages, because those are the only copies
  currently available. Each one is replaced by a fast local file the moment you
  add the matching video to `videos-src/` — that is the last step to make the
  site fully instant.

# Khosta — video editor portfolio

A lightweight Astro portfolio for Sunil Paudel, a.k.a. Khosta. Production is published from **main** at [www.sunil17.com.np](https://www.sunil17.com.np/). The latest glass design is on **revamp** for review; pushing revamp alone does not update the custom domain.

The site has four slideshow screens: an introduction/showreel and “What do you want?” selector, a categorized video wall, an image-only gift wishlist, and Hire me with a frameless portrait and contact buttons. The navy/green/tan palette, Inter and Libre Caslon Condensed remain. Glass surfaces and static gradients add depth without a new runtime dependency.

## Development

Use Node.js 24 and pnpm 11.25.0:

```sh
pnpm install --frozen-lockfile
pnpm dev
pnpm build
pnpm test
pnpm preview
```

Build before tests. Default dev/preview port: 4321. `node preview.mjs` serves the last static build on port 4173.

## Editing

- `src/data/portfolio.json`: contacts, location, tools, services, videos, contributions, gifts and socials.
- `src/pages/index.astro`: screens, glass header, introduction, portrait labels and showreel buttons.
- `src/styles/glass.css`: revised glass/gradient layouts and category motion; `global.css` supplies base styles.
- `src/scripts/work-wall.js`: short/long and category filtering, alternating vertical columns, horizontal strips and pauses.
- `src/scripts/app.js`: navigation, playback, gestures and stores.
- [SITE-GUIDE.md](SITE-GUIDE.md): complete maintenance instructions.
- [VIDEO-LABELS.md](VIDEO-LABELS.md): numbered title/contribution worksheet for all current projects.

All short form includes every short video; Sports promos, Educational and Social & creative move sideways independently. The two long films remain still. Per-video titles/tags are synchronized from the editor’s numbered worksheet; unfinished entries retain their current labels. The service list describes offered services separately.

Hire me includes Instagram (khosta.np), Behance, LinkedIn and WhatsApp me, plus email/phone contact details. The WhatsApp destination matches the international call number. Five named tools appear below the Nepal location.

## Performance and accessibility

Static HTML, responsive WebP, no hydrated framework or animation package. CSS handles continuous motion; reduced-motion settings disable it. Hover/focus, keyboard browsing and drag/arrow controls provide alternatives. Players load only when clicked and are removed on close. Four supplied Instagram exports use native H.264/AAC MP4 playback (~14.5 MiB total), retaining their original credit links. The transparent portrait is derived from the supplied original; asset/edit details are in the guide.

## Release

Commit and push revamp for review. Merge verified changes into main and push main to trigger `.github/workflows/deploy.yml`. The workflow builds, tests and deploys to GitHub Pages. Its runner queue can delay publication after a successful build. The owner-private Sites preview is a separate snapshot and does not synchronize automatically.

User-supplied portrait, logo, showreel and product imagery are retained. Fonts include their local license files. Cosmos and the user-provided Ganesh Kharel portfolio are interaction/layout references; the implementation uses Khosta's own content and palette.

### Apply video-label worksheet changes

Edit VIDEO-LABELS.md, then run `pnpm labels` (or `node scripts/sync-video-labels.mjs`), build and test. The script matches each section by its original video URL, so deleting a worksheet section does not accidentally delete or relabel another project. Remove projects directly from portfolio.json. Blank tags render no contribution badges; completed tags appear on hover/focus. The worksheet is preserved as entered.

Label update: the supplied worksheet titles and contribution tags have been applied. Guras Nani and Imposter challenge were removed at the editor’s request. A project omitted from the worksheet remains in the portfolio unless explicitly removed.

### Experience stats and wheel browsing

The `stats` array in portfolio.json controls the three supplied figures: 1.5+ Years Experience, 500+ Shorts Delivered and 6+ Million Views Generated. Update value/label independently. They render above the services list.

The Work showreel shortcut, pause button and collection arrows are removed. The Home showreel and screen navigation remain. Moving tiles run at twice their previous speed. Scrolling over tiles advances their CSS timeline in its existing direction, including alternating vertical columns and sideways category strips. Both wheel directions advance the existing animation; trackpad/line/page deltas are normalized and large gestures bounded. Wheel input outside the tiles and Ctrl/Meta wheel zoom are not intercepted. Hover pauses automatic movement while wheel input still lets you browse. Reduced-motion/keyboard browsing uses ordinary still-column scrolling (horizontal strips translate wheel input to horizontal scroll). Long-form films remain stationary. The pure wheel/time helpers are in src/lib/work-motion.js; the listener runs only on wheel input, with no persistent JavaScript animation loop.

The landing choices are 01 See my work, 02 Let's talk and 03 Things I'd love. The header keeps the brand left, theme switch centered and navigation links right.

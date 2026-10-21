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
- [VIDEO-LABELS.md](VIDEO-LABELS.md): numbered title/contribution worksheet for all 18 projects.

All short form includes every short video; Sports promos, Educational and Social & creative move sideways independently. The two long films remain still. Per-video tags are empty pending the editor's input, so contributions are not invented. The service list describes offered services separately.

Hire me includes Instagram (khosta.np), Behance, LinkedIn and WhatsApp me, plus email/phone contact details. The WhatsApp destination matches the international call number. Five named tools appear below the Nepal location.

## Performance and accessibility

Static HTML, responsive WebP, no hydrated framework or animation package. CSS handles continuous motion; reduced-motion settings disable it. Hover/focus, explicit pause, keyboard browsing and drag/arrow controls provide alternatives. Players load only when clicked and are removed on close. Four supplied Instagram exports use native H.264/AAC MP4 playback (~14.5 MiB total), retaining their original credit links. The transparent portrait is derived from the supplied original; asset/edit details are in the guide.

## Release

Commit and push revamp for review. Merge verified changes into main and push main to trigger `.github/workflows/deploy.yml`. The workflow builds, tests and deploys to GitHub Pages. Its runner queue can delay publication after a successful build. The owner-private Sites preview is a separate snapshot and does not synchronize automatically.

User-supplied portrait, logo, showreel and product imagery are retained. Fonts include their local license files. Cosmos and the user-provided Ganesh Kharel portfolio are interaction/layout references; the implementation uses Khosta's own content and palette.

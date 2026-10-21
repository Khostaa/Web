# Khosta — video editor portfolio

A screen-by-screen video editor portfolio published from the **main** branch. Built with Astro 7.4.1, native CSS, and a small browser script.

**Live website:** [www.sunil17.com.np](https://www.sunil17.com.np/). Pushing revamp does not deploy to that domain. The existing GitHub Pages workflow runs only for main.

## Experience

- **Start:** “What do you want?” with three large choices, changing image compositions on hover or keyboard focus.
- **Work:** cards unfold from a shared point into a native-ratio, screen-sized gallery. A compact masonry wall moves short-form cards downward, pauses on hover/focus, and reveals details. The two long-form films remain stationary.
- **Gifts:** five image-only product wishes in a 3 × 2 grid, hover/focus details, and country-aware store links.
- **Reach out:** the editor's paper portrait with six scattered tool badges, animated copy, contact information, and paginated social links.

The navy, green, tan, Inter, and Libre Caslon Condensed styling remains. Cosmos is the user-selected interaction reference: its brand selector informs the menu, and its color-search demonstration informs the gallery entrance.

## Development

Node.js 24 and pnpm 11.25.0:

```sh
pnpm install --frozen-lockfile
pnpm dev
pnpm build
pnpm test
pnpm preview
```

Run the build before tests. Default dev/preview address: http://127.0.0.1:4321.

## Edit

| What | Where |
| --- | --- |
| Contacts, videos, showreel URL and thumbnail, gifts, socials | `src/data/portfolio.json` |
| Four screens, copy, selector previews, head metadata | `src/pages/index.astro` |
| Server-rendered work cards | `src/components/WorkGallery.astro` |
| Colors, typography, screen layout, paper and selector effects | `src/styles/global.css` |
| Navigation, video-only dialog, drag and social paging | `src/scripts/app.js` |
| Short/long filtering, masonry packing, downward CSS loops and pause controls | `src/scripts/work-wall.js` |
| Pre-paint theme | `src/scripts/theme.js` |
| Native-ratio parsing and supported platform URLs | `src/lib/media.js` |

See [SITE-GUIDE.md](SITE-GUIDE.md) for examples and maintenance details. The showreel is [Make it Exist](https://www.youtube.com/watch?v=kPqnJMdCEFI). The gallery includes 18 supplied projects across YouTube, Instagram and TikTok, plus the showreel. Five gifts are configured; update products, images and country links using SITE-GUIDE.md.

## Performance and accessibility

Static HTML; no hydrated framework, animation package, scroll listener, animation loop, or preloaded video player. Images are responsive WebP. Transitions use transform and opacity. Players load only on demand and are removed on close. Four supplied Instagram exports are local H.264/AAC MP4 files; Instagram post controls are not loaded. Inactive screens are hidden and inert. Screen changes move focus to their heading. Reduced-motion preferences disable entrance effects and continuous motion. Keyboard users can browse still columns. Arrow buttons, URL hashes, browser history, and keyboard controls support navigation. Without JavaScript, the screens become ordinary document sections.

## Branch workflow

```sh
git switch revamp
git add .
git commit -m "Refine revamp"
git push origin revamp
```

The revamp design is now the production design. To release future changes, review and test revamp, merge it into main, then push main. The GitHub Pages workflow builds, verifies and deploys main automatically. The private Sites preview is a separate snapshot and does not synchronize automatically.

## Assets and credits

User-supplied portrait and native SVG logo. Inter is loaded from Google Fonts; Libre Caslon Condensed is local, with its license and authors in `public/fonts/`. Decorative placeholder photography: Unsplash. The same Cloudflare DNS and GitHub Pages configuration documented in the guide continue to serve production.

Drag/swipe to browse the short-form wall, gifts, or social profiles, then move between screens. Keyboard and arrow navigation remain available. All photographs use uncropped contain sizing.

Video exports live in `public/media/` (~14.5 MiB total); individual files load only when played. Real video cover frames are cached in `src/assets/work/`. Tool badges are lightweight local marks, with names on hover/focus.

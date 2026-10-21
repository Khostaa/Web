# Khosta — revamp

An experimental, screen-by-screen video editor portfolio on the **revamp** branch. Built with Astro 7.4.1, native CSS, and a small browser script.

**Production remains on main:** [www.sunil17.com.np](https://www.sunil17.com.np/). Pushing revamp does not deploy to that domain. The existing GitHub Pages workflow runs only for main.

## Experience

- **Start:** “What do you want?” with three large choices, changing image compositions on hover or keyboard focus.
- **Work:** cards unfold from a shared point into a native-ratio, screen-sized gallery. Filters and pagination accommodate more videos.
- **Gifts:** five image-led product wishes, country-aware store links, and pagination.
- **Reach out:** the editor's paper portrait, animated copy, contact information, and paginated social links.

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
| Navigation, gallery rollout, pagination, video dialog | `src/scripts/app.js` |
| Pre-paint theme | `src/scripts/theme.js` |
| Native-ratio parsing and supported platform URLs | `src/lib/media.js` |

See [SITE-GUIDE.md](SITE-GUIDE.md) for examples and maintenance details. The showreel is [Make it Exist](https://www.youtube.com/watch?v=kPqnJMdCEFI). Real gallery work remains empty until added. Five gifts are configured; update products, images and country links using SITE-GUIDE.md.

## Performance and accessibility

Static HTML; no hydrated framework, animation package, scroll listener, animation loop, or preloaded video player. Images are responsive WebP. Transitions use transform and opacity. The video iframe is inserted only on demand and removed on close. Inactive screens are hidden and inert. Screen changes move focus to their heading. Reduced-motion preferences disable the entrance effects. Arrow buttons, URL hashes, browser history, and keyboard controls support navigation. Without JavaScript, the screens become ordinary document sections.

## Branch workflow

```sh
git switch revamp
git add .
git commit -m "Refine revamp"
git push origin revamp
```

Use main only when ready to replace production. Do not merge or push revamp into main merely to preview it. The original Sites preview is independent of both branches.

## Assets and credits

User-supplied portrait and native SVG logo. Inter is loaded from Google Fonts; Libre Caslon Condensed is local, with its license and authors in `public/fonts/`. Decorative placeholder photography: Unsplash. The same Cloudflare DNS and GitHub Pages configuration documented in the guide continue to serve production.

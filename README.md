# Khosta — Sunil Paudel

A minimal video editor portfolio built with Astro 7.4.1 and published as a static website through GitHub Pages.

- **Live website:** [www.sunil17.com.np](https://www.sunil17.com.np/)
- **Source:** [Khostaa/Web](https://github.com/Khostaa/Web)
- **Deployments:** [GitHub Actions](https://github.com/Khostaa/Web/actions)
- **Complete editing guide:** [SITE-GUIDE.md](SITE-GUIDE.md)

## Hosting

GitHub Pages hosts the website. GitHub Actions builds and tests every push to `main`, then publishes the generated `dist/` directory. Cloudflare manages the domain's DNS and proxy. The original ChatGPT Sites preview is a separate copy; it does not synchronize with this repository.

Keep GitHub Settings → Pages → Source set to **GitHub Actions**, and its custom domain set to **www.sunil17.com.np**. Both `public/CNAME` and `astro.config.mjs` use this domain. No `/Web` base path is needed with the custom domain. Deployment uses temporary GitHub workflow credentials; no permanent deployment token is stored in this project.

## Run locally

Use Node.js 24 and pnpm 11.25.0, matching the deployment workflow.

```sh
pnpm install --frozen-lockfile
pnpm dev
```

Development runs at http://127.0.0.1:4321. To check production output:

```sh
pnpm build
pnpm test
pnpm preview
```

Run the build before tests: verification reads the generated HTML. Preview also uses the most recent build.

## What to edit

| Change | File |
| --- | --- |
| Name, email, phone, showreel, work, gifts, social links | `src/data/portfolio.json` |
| Page copy, navigation, sections, metadata | `src/pages/index.astro` |
| Work gallery markup | `src/components/WorkGallery.astro` |
| Social link markup | `src/components/SocialLinks.astro` |
| Colors, typography, layout, logo animation | `src/styles/global.css` |
| Filters, players, theme control, copy email | `src/scripts/app.js` |
| Theme before page paint | `src/scripts/theme.js` |
| Video URL parsing and aspect ratios | `src/lib/media.js` |
| Logo SVG files and custom public images | `public/assets/` |
| Optimized source photos and local fonts | `src/assets/` |
| Build origin and settings | `astro.config.mjs` |
| Automatic publishing | `.github/workflows/deploy.yml` |

Edit source files, not generated `dist/` output. The full guide explains adding, removing, reordering, and hiding content and sections.

## Add work

Add objects to the `videos` array in `src/data/portfolio.json`:

```json
{
  "title": "Film title",
  "category": "Travel film",
  "platform": "youtube",
  "aspectRatio": "16:9",
  "url": "https://www.youtube.com/watch?v=VIDEO_ID",
  "thumbnail": "/assets/your-poster.jpg",
  "year": "2026"
}
```

Platforms: `youtube`, `instagram`, and `tiktok`. Supported ratios: `9:16`, `16:9`, `4:3`, `1:1`, and `3:4`. Use full public links; expand shortened TikTok links. Players load on click and provide an original-platform link if embedding is blocked. Put your poster in `public/assets/`, or import new source images through Astro for optimization.

Set `showreelUrl` to replace the hero's labeled sample reel. The real work list is currently empty, so coming-soon placeholders appear. Sample footage is not presented as Khosta's work.

## Wishlist and social links

Add wishlist objects to `gifts`:

```json
{ "title": "Gift name", "note": "A short note", "url": "https://example.com/item" }
```

Add social profile objects to `socials`:

```json
{ "label": "Instagram · Khosta", "url": "https://www.instagram.com/khosta.np/" }
```

Delete an object to remove it; move it within the array to change its order. The wishlist is intentionally empty. There are 11 social profile links, including labeled personal accounts. Setting `socials` to `[]` hides the social row. No payments are collected by the website.

## Design and performance

- Green `#2cac6d`, navy `#1d1d35`, and tan `#deb887`, with corresponding light-mode colors.
- Inter for regular headings and interface text; local Libre Caslon Condensed for tan italic text.
- Static HTML, responsive WebP images, minified assets, and no hydrated client framework.
- Theme selection persists in the browser; dark is the default.
- Only green logo centers rotate clockwise in a seamless 14-second CSS loop. Tan logos stay static. Off-screen and hidden-tab animations pause; reduced-motion settings disable rotation.

## Publish an update

```sh
pnpm build
pnpm test
git add .
git commit -m "Update portfolio"
git push origin main
```

Check the [Actions run](https://github.com/Khostaa/Web/actions) until both build and deployment succeed, then verify the live website. A failed workflow leaves the previous successful deployment in place. To roll back, revert the relevant commit and push the revert. Older website files remain in Git history.

The current verifier includes demo-specific assertions for the empty wishlist, contact email, placeholders, images, and Astro version. Update those assertions when intentionally changing that content; see the complete guide. Keep dependencies, generated output, and credentials out of Git.

## Cloudflare

The existing four `www` A records route to GitHub Pages (185.199.108.153 through 185.199.111.153); the apex CNAME points to `www.sunil17.com.np`. Domain routing, HTTPS, and any proxy settings are managed separately from repository content. Email records support mail delivery and are not deployment artifacts.

GitHub Pages does not need a Cloudflare Worker to build or publish this Astro site. Any Worker serving the domain must be reviewed for other functions before removal.

## Credits

[Inter](https://fonts.google.com/specimen/Inter) is loaded from Google Fonts. [Libre Caslon Condensed](https://github.com/ertekinno/libre-caslon-condensed) is hosted locally, with license and authors under `public/fonts/`. Atmosphere photos: Unsplash. Demo video: Google sample footage. Visual direction inspired by [Unchained Agency](https://unchainedagency.com/).

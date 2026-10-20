# Khosta — Sunil Paudel

An Astro 7 portfolio, generated as static HTML and deployed through GitHub Pages. The design, native SVG logo, theme switch, and on-demand video embeds are preserved.

For complete owner documentation, content examples, styling instructions, and publishing guidance, read [SITE-GUIDE.md](SITE-GUIDE.md).

## Content

Edit `src/data/portfolio.json`. Set `showreelUrl`, and add video objects to `videos`:

```json
{ "title": "Film title", "category": "Travel film", "platform": "youtube", "aspectRatio": "16:9", "url": "https://www.youtube.com/watch?v=VIDEO_ID", "thumbnail": "assets/story.jpg", "year": "2026" }
```

Supported platforms: `youtube`, `instagram`, and `tiktok`. Use full public links, expanding shortened TikTok links. Ratios: `9:16`, `16:9`, `4:3`, `1:1`, and `3:4`. Players keep the chosen ratio and load only on click. If a platform requires sign-in or blocks embedding, an original-platform link is provided.

The existing `assets/reel.jpg`, `assets/story.jpg`, `assets/social.jpg`, and `assets/motion.jpg` names resolve to optimized image variants. Put custom poster files in `public/assets/` and reference them as `/assets/your-poster.jpg`. For automatic optimization of new local images, import them through `astro:assets` as in `src/pages/index.astro`.

Until real video links are provided, the gallery has coming-soon placeholders and the hero plays clearly labeled sample footage. The sample is not Khosta’s work.

Add wishlist entries to `gifts` as `{ "title": "Gift name", "note": "A short note", "url": "https://..." }`. The list is intentionally empty. No payments are collected by the website.

### Social profiles

Edit the `socials` array in `src/data/portfolio.json`:

```json
"socials": [
  { "label": "Instagram · Khosta", "url": "https://www.instagram.com/khosta.np/" },
  { "label": "YouTube", "url": "https://www.youtube.com/@KhostaTuts" }
]
```

The current list contains 11 distinct links imported from https://www.sunil17.com.np/, including clearly labeled creator and personal accounts. Edit URLs/labels, delete objects, or move them to change the order. Set `socials` to `[]` to hide the row. `src/components/SocialLinks.astro` renders valid links below the contact details, with new-tab behavior. The list is a snapshot, not an automatic sync with the old site. See the full guide for all current destinations.

### Fonts

Regular headings and interface text use Inter from Google Fonts. Tan italic text uses locally hosted Libre Caslon Condensed. Its regular/italic WOFF2 files are in `src/assets/fonts/`; `@font-face` rules are in `src/styles/global.css`, and the italic preload is in `src/pages/index.astro`. License and author files are in `public/fonts/`. Update both the CSS and preload when replacing the serif font.

## Development

Use the package manager pinned in `package.json`:

```text
pnpm install
pnpm dev
pnpm build
pnpm test
pnpm preview
```

Edit sources in `src/` and `public/`; `dist/` is generated output. The workflow in `.github/workflows/deploy.yml` builds and verifies each push to `main`, then publishes `dist/` to GitHub Pages. In repository Settings → Pages, choose **GitHub Actions** as the source. The custom domain is set in `public/CNAME` and `astro.config.mjs`.

## Performance and behavior

- Static HTML includes the project gallery and social profile links before JavaScript runs. No client framework or hydrated islands are shipped.
- Astro generates responsive WebP hero and gallery images with explicit dimensions and lazy gallery loading.
- Styles and interaction code are bundled/minified with hashed URLs. The tiny appearance initializer is inlined before styles to avoid a theme flash.
- Theme choice is saved per browser and shared across tabs. Dark is the default. Light mode uses warm off-white, navy, green, and deeper tan for readable text.
- Native SVG center and ring assets share an aligned viewport. Only the green logo’s center rotates, using a seamless 14-second CSS transform. Tan logos remain static. Off-screen/hidden-tab animation pauses, and reduced-motion preferences disable it.

Fonts: Inter from Google Fonts and locally hosted Libre Caslon Condensed from https://github.com/ertekinno/libre-caslon-condensed. Font license and authors are included under public/fonts/. Illustrative atmosphere images: Unsplash. Demo video: Google sample footage. Visual direction was inspired by https://unchainedagency.com/ without copying its branding or work.



## Publish changes

Repository: https://github.com/Khostaa/Web

Production domain: https://www.sunil17.com.np/

Commit source changes and push to `main`, then check the Actions tab for build and deployment success. Keep generated `dist/` files out of Git. Existing GitHub Pages DNS records continue to route the domain. The earlier Sites preview is an independent copy and does not update with GitHub pushes. No permanent deployment token is stored here.

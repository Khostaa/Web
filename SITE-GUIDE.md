# Khosta — editing guide

Updated 21 October 2026. The glass design is being developed on `revamp`. Production is published from `main` at https://www.sunil17.com.np/. The private Sites preview is an independent snapshot, not an automatic GitHub branch sync.

## Run and release

Use Node.js 24 and pnpm 11.25.0. Run `pnpm install --frozen-lockfile`, `pnpm dev`, `pnpm build`, then `pnpm test`. Tests read the latest `dist/`, so build first. Dev/preview normally serves port 4321. `node preview.mjs` serves the latest static build at http://127.0.0.1:4173 and supports MP4 range requests; rebuild after edits.

Work on revamp, commit and push it for review. To publish to the custom domain, merge the tested revamp branch into main and push main. `.github/workflows/deploy.yml` builds, verifies, uploads and deploys through GitHub Pages. A revamp push alone does not update production. A queued deployment runner can delay publication even after the build succeeds; inspect the Actions job before retrying. Revert a release commit and push main to roll back.

## File map

| File | Controls |
| --- | --- |
| src/data/portfolio.json | Identity, contact, location, tools, services, videos, gifts and social buttons |
| src/pages/index.astro | Four screens, header, intro, showreel buttons, copy, metadata and portrait labels |
| src/components/WorkGallery.astro | Prerendered work cards, titles and contribution tags |
| src/components/GiftGallery.astro | Product gallery and market selector |
| src/components/SocialLinks.astro | Validated external profile buttons |
| src/styles/global.css | Base palette, typography, slideshow, logos, cards and dialogs |
| src/styles/glass.css | Glass header, gradients, new intro/contact layouts, work categories and edge blur |
| src/scripts/app.js | Screen routing, previews, drag gestures, gift stores, social buttons, video dialog |
| src/scripts/work-wall.js | Format/category filters, column packing, sideways loops, pauses and keyboard browsing |
| src/scripts/theme.js | Saved light/dark choice before first paint |
| src/lib/media.js | Safe URLs, supported platforms and aspect ratios |
| src/lib/gifts.js | Country suggestion and regional shopping destinations |
| src/assets/work/ | Cached cover frames; Astro creates responsive WebP variants |
| src/assets/sunil-cutout.png | Transparent portrait used by Hire me |
| src/assets/sunil-portrait.png | Preserved original portrait |
| public/media/ | Four optimized video-only Instagram exports |
| public/assets/ | Native SVG logo parts and other static assets |
| VIDEO-LABELS.md | Numbered worksheet for preferred titles and actual contribution tags |

## Identity, header and introduction

Edit name, alias, email, phone, phoneDisplay and location in portfolio.json. Keep phone in international form, such as +9779825833442. The WhatsApp URL must use digits only: https://wa.me/9779825833442. The current address matches the call number; update both when changing numbers.

The pill header in index.astro contains the logo, Work, Gifts, Hire me and theme switch. `#about` remains the internal hash for Hire me so old links continue working. Route titles live in app.js. Match new screen IDs in the ids array, normalization, navigation, dots and heading focus behavior.

The Home heading and description say: Hi! I’m Sunil Paudel, a freelance video editor and a visual storyteller based in Nepal. Change this copy directly in index.astro. The next block contains Watch showreel, then What do you want? and the three choices. The work preview uses a landscape YouTube card and portrait Instagram/TikTok cards. Change homePosters or `.preview-work` styling to choose/reposition them.

## Showreel

Change showreelUrl and showreelThumbnail in portfolio.json. Current showreel: https://www.youtube.com/watch?v=kPqnJMdCEFI. Current source thumbnail: src/assets/showreel.png, the supplied restart artwork. Replace that image or point to another imported asset. The Home button and Work shortcut share the same configured video and open the on-demand dialog. The Home button label is Watch showreel; its thumbnail is optimized to WebP.

## Work: add, remove, classify or label videos

Every video is an object in the videos array. Delete an object to remove work. Preserve valid JSON commas and quotation marks. Example:

```json
{
  "title": "Who’s the Imposter?",
  "platform": "tiktok",
  "format": "short",
  "collection": "social",
  "category": "PARADYGM TV · TikTok",
  "aspectRatio": "9:16",
  "url": "https://www.tiktok.com/@paradygmtv/video/7532489106115398920",
  "thumbnail": "assets/work/tiktok-7532489106115398920.png",
  "tags": ["Editing", "Sound Design", "Captions"]
}
```

This example illustrates the schema; contribution tags must describe your actual work. Preferred titles and contribution tags come from VIDEO-LABELS.md. Some entries are filled; unfinished entries retain their current public labels. Titles and any supplied tags appear on hover or keyboard focus. `category` is the small project-credit line; it is separate from the filter category.

- `platform`: youtube, instagram or tiktok.
- `format`: short or long. Duration/editorial format is independent of orientation; two current short videos are landscape.
- `collection`: sports (Sports promos), education (Educational), social (Social & creative), or long for long films.
- `aspectRatio`: 9:16, 16:9, 4:3, 1:1 or 3:4. Defaults use platform/URL type if omitted.
- `url`: canonical public project URL. Use a TikTok video URL, never pasted blockquote or embed.js code.
- `thumbnail`: local image key such as assets/work/example.jpg, or an existing public asset path.
- `tags`: an array of your contribution labels. Empty arrays render no tags.
- `mediaUrl`: optional owned video file for a native video-only player.

The current category assignment is based on visible project subjects: three sports promos, five educational edits, six social/creative edits and two long films. Change collection freely if a project belongs elsewhere. All short form shows every short video; specific categories include only their own videos. Long form shows the two stationary films. The showreel is separate from these counts.

To add an optimized poster, save JPG/PNG/WebP in src/assets/work and set thumbnail to assets/work/filename.ext. index.astro imports the directory automatically. Keep filenames unique. Astro creates responsive local WebP variants, so visitors do not request cover images from social platforms. Existing TikTok posters are real player frames; native Instagram posters were extracted from the supplied video exports. Images use contain sizing so their borders are preserved.

## Work motion and services

All short form uses compact vertical masonry columns, alternating down/up. Individual categories use a horizontal looping strip. Long films have no continuous motion. work-wall.js filters the original cards, packs them and repeats aria-hidden, non-tabbable copies for a seamless loop. Category counts refer to original videos, not copies.

Change the 10px gap, width thresholds, column count and speed in work-wall.js. Vertical speed is 14 + columnIndex × 2 pixels/second; horizontal speed is 24 pixels/second. `wall-fall` is in global.css; `wall-sideways` and upward-column direction are in glass.css. Keep identical gap/padding at both duplicated-group seams.

Hover/focus pauses motion. Pause motion explicitly stops it. Hidden documents, inactive screens and open players also pause it. Reduced-motion settings stop continuous motion, entrances and logo rotation. Keyboard browsing shows still tracks; arrows/drag browse collections without activating a video. Keep these alternatives when changing animation.

The work-viewport wrapper contains pointer-transparent top/bottom overlays using small masked backdrop blurs. Change `.grid-soft-edge` for their strength/height. Long form hides these overlays. Keep the overlays out of pointer hit-testing. They do not animate their blur radius.

Edit the services array in portfolio.json to change Video Editing, Color Grading, Sound Design, Motion Graphics, Pacing, Podcast Editing, Multi-Cam Editing, Teasers and Promos above the wall. These describe offered services, not assumed contributions to each project.

## Video-only playback

The original url retains public credit. `mediaUrl: "/media/example.mp4"` prefers a local owned export for native controls, while retaining the original-platform link. Use letters, digits, dots, underscores and hyphens in the filename, ending .mp4. Files live in public/media. Remove mediaUrl to return to the platform embed fallback.

Current exports: fusion-node-tree.mp4, let-the-journey-begin.mp4, stop-motion.mp4 and ufc-event-promo.mp4. They use H.264/yuv420p, AAC audio, a maximum 1280px long edge and fast-start metadata. Originals are untouched; total export size is about 14.5 MiB. Keep each file below 24 MiB for the Sites hosting path. Players load only on click, stop and release their source on close. Platform embed restrictions, sign-in and removed posts cannot be overridden by the site.

## Hire me, portrait and tools

The portrait is frameless and transparent, with a CSS fade at the bottom and a subtle radial glow behind it. Role labels are Video editor, Motion designer and Available for projects. Change their text in index.astro and position/style in glass.css using `.portrait-label`, `.label-video`, `.label-motion` and `.label-available`. Maintain space between the portrait labels and contact copy.

Edit tools in portfolio.json: DaVinci Resolve, Fusion Studio, Canva, Affinity by Canva and Illustrator. These appear as compact named glass chips below the Nepal location line. No external icon or animation library is loaded.

Social buttons are now only Instagram (khosta.np), Behance, LinkedIn and WhatsApp me. Edit socials to change labels/URLs. Email and phone remain direct contact details, plus Copy email. Links open in new tabs with noopener/noreferrer. Social pagination automatically hides with four or fewer links; adding more restores paging.

Portrait asset note: src/assets/sunil-cutout.png was made with the built-in image editor from the original photo. Prompt: remove only the white background for a transparent cutout; preserve face, identity, expression, hairstyle, blue shirt, proportions and lighting; no retouching, frame, text, shadow or added background. The original remains in src/assets/sunil-portrait.png. Astro emits 360px/640px WebP variants and preserves alpha. Replace with your own transparent PNG/WebP to update it.

## Gifts and country links

Edit the gifts array in portfolio.json. Each object supports title, variant, note, category, image, query, url and optional regionalUrls. The image key maps to a source file in src/assets/gifts; import new files in GiftGallery.astro when adding a new key. Delete objects to remove gifts; an empty array restores the friendly empty state.

The five current gifts fit a 3-column × 2-row grid. More than six paginate in groups of six. Only images show initially; title, variant and store details appear on hover/focus. Touch uses first tap to reveal, second tap to follow the link. Products open in a new tab.

Country suggestions use browser locale/time zone and can be overridden in the selector. The choice persists as khosta-gift-country. giftMarkets and giftDestination in src/lib/gifts.js control supported markets and search destinations. `regionalUrls` overrides a product for a country, for example the Nepal Oliz Store MacBook link. Otherwise the selected country's store search uses query (or title). Availability, prices and exact configurations must be checked at the store; do not put live prices in the site without maintaining them.

## Theme, glass and performance

Base colors remain #2cac6d green, #1d1d35 navy and #deb887 tan. Light mode uses warm off-white, navy text and deeper green/tan. Base tokens are at the top of global.css. glass.css adds translucent surfaces and static green/tan radial gradients; no animated background or shader is used. Adjust --glass, --glass-border, --glow-green and --glow-tan there. The glass header uses bounded backdrop blur with an opaque fallback.

Inter handles white/interface text; Libre Caslon Condensed handles tan italic accents. Change font links, local @font-face declarations, tokens and preload together if replacing fonts. Font licenses remain in public/fonts. Green logo centers rotate clockwise; outer rings stay fixed; tan logos stay static. Native SVG parts are in public/assets. IntersectionObserver and document visibility pause unused motion.

Astro emits static HTML, no hydrated framework. Video players load only on demand. Native CSS handles continuous movement; JavaScript runs only on input/layout/visibility changes. Keep images optimized, preserve contained sizes and avoid JavaScript frame loops or full-screen animated filters. Browser history, hash links, keyboard and drag controls remain available. Without JavaScript, screens become ordinary content sections.

## Domain and deployment maintenance

GitHub Pages uses GitHub Actions as its source. Custom domain settings are in public/CNAME and astro.config.mjs. No /Web base prefix is needed. Cloudflare manages DNS; the existing www A records target 185.199.108.153 through 185.199.111.153, and the apex CNAME points to www.sunil17.com.np.

The unused perf-metrics-f208 Worker and its route, obsolete _openai-site-verification.www TXT, _cf-custom-hostname.www TXT and old Brave TXT were removed on 20 October 2026. Preserve website records, Zoho MX/SPF/DKIM/verification and Google verification. GitHub Pages does not need a Cloudflare Worker or API token. Do not change DNS merely to update content.

## Verify changes

Build, run tests, then check both themes and desktop/phone sizes. Check intro, showreel opening/closing, category counts, alternating/horizontal motion, pause/focus, stationary long films, contribution labels, the four social destinations and gift country links. On a short screen, Home/Hire me allow internal scrolling to keep content accessible. Inactive screens remain hidden and inert.

If old content persists, check the exact main deployment commit/status, then refresh browser/CDN cache. If a category is empty, check format/collection and URL validity. If a poster is missing, check its asset key and rebuild. If a native video fails, verify H.264/AAC, MIME type/range support and mediaUrl. If glass contrast is weak, adjust surface opacity rather than increasing blur everywhere.

### Apply video-label worksheet changes

Edit VIDEO-LABELS.md, then run `pnpm labels` (or `node scripts/sync-video-labels.mjs`), build and test. The script matches each section by its original video URL, so deleting a worksheet section does not accidentally delete or relabel another project. Remove projects directly from portfolio.json. Blank tags render no contribution badges; completed tags appear on hover/focus. The worksheet is preserved as entered.

Label update: the supplied worksheet titles and contribution tags have been applied. Guras Nani and Imposter challenge were removed at the editor’s request. A project omitted from the worksheet remains in the portfolio unless explicitly removed.

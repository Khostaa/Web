# Khosta — editing guide

Updated 21 October 2026. This guide describes the slideshow portfolio released from **main**, with **revamp** retained for future design changes.

## Branch and hosting

Repository: https://github.com/Khostaa/Web. The custom domain https://www.sunil17.com.np/ is published from **main** by `.github/workflows/deploy.yml`. This workflow does not run on revamp pushes. Preview revamp locally with `pnpm dev`; source changes on revamp do not change production until merged into main.

The production design includes the portrait, showreel, masonry work wall, gifts and Reach out page. The original Sites preview is independent and will not synchronize automatically.

## Structure

```text
src/pages/index.astro            Document head, four screens, navigation, dialog
src/components/WorkGallery.astro  Work cards and showreel, rendered at build time
src/components/SocialLinks.astro  Social links, rendered at build time
src/data/portfolio.json          Contact, showreel, videos, gifts, socials
src/assets/work/                Cached public YouTube/Instagram covers
public/media/                   Optimized video-only Instagram exports
src/scripts/work-wall.js        Short/long layouts, downward masonry and pause controls
src/scripts/app.js               Screen routing, rollout, pagination, playback
src/scripts/theme.js             Saved theme before first paint
src/styles/global.css           Tokens, layout, transitions, responsive rules
src/lib/media.js                URL validation, platform and ratio helpers
src/assets/                     Source photos, editor portrait, fonts
public/assets/                  Logo SVG pieces and static paper grain
public/CNAME                    Production custom domain
verify.mjs                      Build and media behavior checks
```

Astro exports the site to dist. Edit sources, not dist, .astro, or node_modules.

## Run, check, and commit

Use Node 24 and pnpm 11.25.0.

```sh
pnpm install --frozen-lockfile
pnpm dev
pnpm build
pnpm test
pnpm preview
git add .
git commit -m "Refine revamp"
git push origin revamp
```

Dev/preview uses port 4321. The optional node preview.mjs serves the last dist build on port 4173. Preview does not rebuild on edits. Check both themes, a narrow/short screen, every intent choice, format tabs, masonry motion and pause controls, social pages, and opening/closing video. Tests read dist/index.html and include demo-specific assertions; update those when intentionally changing gifts, placeholders, assets, or the current email.

## Four screens

The stage contains home, work, wishlist, and about sections. The outer page does not scroll when JavaScript is enabled. Each screen occupies the space between the persistent header and footer. Content collections paginate instead of enlarging the document. Without JavaScript, sections remain readable as an ordinary document.

| URL hash | Screen |
| --- | --- |
| #home | Start / intent selector |
| #work | Work gallery and showreel |
| #wishlist | Gifts |
| #about | Reach out |
| #contact | Alias for Reach out |

Navigation uses normal anchors and a small client router. Browser Back/Forward works. Inactive screens are hidden, inert, and aria-hidden. The new heading receives focus. Escape returns to Start unless a video dialog is open; then it closes the dialog. Left/Right arrows change screens when focus is not on a link or button. Up/Down arrows move through the three home choices; Enter opens one. Footer arrows and dots always work with touch and keyboard.

To add a screen, add its HTML section, its ID to the ids array and normalization in app.js, navigation links/dots, title mapping, and an appropriate CSS layout. Update the footer screen total and tests. Keep content within the available screen area and provide pagination for growing collections.

## Opening selector and transitions

Home copy and links live in index.astro under .home-screen. Each choice has data-preview-choice and its matching .intent-preview. Pointer entry and keyboard focus change home.dataset.preview. CSS animates the thumbnail width, selected text, arrow, and preview composition. Clicking opens the corresponding screen.

The Cosmos “Shop from brands like” section is the interaction reference, with original Khosta content and assets. The home previews are decorative; no new media player is loaded. On small screens, the large preview collage is omitted and the inline choice thumbnail still transitions.

Text with .reveal rises into view when its screen becomes active. app.js assigns stagger delays, capped at 315ms. CSS content-rise controls the movement. Outgoing screens fade upward. Animations cancel safely when navigating rapidly. Change the --ease token or keyframe durations to tune the feel.

## Contact and identity

Edit name, alias, email, phone, and phoneDisplay in portfolio.json. Contact links read this JSON at build time; the copy-email button reads the same email. Static introductions, caption wording, page title, meta description, and home eyebrow are in index.astro and should be updated together when changing identity.

## Main showreel

The current showreel URL is https://www.youtube.com/watch?v=kPqnJMdCEFI. Set showreelUrl in portfolio.json to replace it. A valid showreel becomes the first Work card. Its current title “Make it Exist” and category “SHOWREEL” are set in WorkGallery.astro; change them there when replacing the video. An empty or unsupported URL omits this card.

The showreel poster is set by showreelThumbnail in portfolio.json. Its current value, assets/showreel.png, resolves to src/assets/showreel.png (the supplied restart artwork). Replace this source image to change it; Astro generates lightweight 480px and 960px WebP versions. Poster and playable video are independent. The reel's tan logo is static. Iframes load only after a click, use a privacy-enhanced YouTube embed, and disappear on close. A Watch on original platform link remains available if embedding fails.

## Add, remove, and reorder work

Edit the videos array in portfolio.json. Each entry is an object:

```json
{
  "title": "My film",
  "category": "Travel film",
  "platform": "youtube",
  "aspectRatio": "16:9",
  "url": "https://www.youtube.com/watch?v=VIDEO_ID",
  "thumbnail": "/assets/my-poster.jpg",
  "year": "2026"
}
```

Supported platform values are youtube, instagram, and tiktok. Use full URLs. Expand TikTok short links before adding them. Supported aspectRatio values are 9:16, 16:9, 4:3, 1:1, and 3:4. Without an explicit ratio, platform and URL type provide defaults. Direct MP4 URLs are supported by the parser. URL validation rejects unsupported schemes and lookalike hosts.

Delete an object to remove work; reorder objects to change order within a format. The wall interleaves platforms for visual variety. Use format: short or long; the showreel is separate.

The gallery uses a compact responsive masonry wall for Short form and a still grid for Long form. All original cards are present in the static HTML. See the masonry section below for controls and motion settings.

## Photos and paper portrait

Replace src/assets/sunil-portrait.png to change the editor photo. Update the alt text and figcaption in the About screen. Astro generates 360px and 640px WebP variants, and the image loads lazily when needed. The portrait belongs on Reach out, not the opening menu.

The paper sheet, flaps, and entrance are CSS. public/assets/paper-grain.svg is a small static texture. .is-active triggers the paper unfolding on each About entrance; no storage flag suppresses it. Portrait motion is disabled for reduced-motion visitors. Change paper-open-top, paper-open-bottom, portrait-arrive, and portrait-emerge to tune timing.

Decorative photos are imported from src/assets/reel.jpg, story.jpg, social.jpg, and motion.jpg. The images map in index.astro generates 480px/960px WebP versions. Existing assets/name.jpg aliases resolve through this map in WorkGallery.astro. New custom posters can go in public/assets and use /assets/file.jpg; those public files are served as-is. Import new photos through getImage for optimization.

## Gifts / wishlist

Five gifts are configured in portfolio.json: Sony Alpha 6700, DJI Osmo Action 6 Adventure Combo, DJI Mic 3, Samsung Galaxy Watch 7 44 mm, and MacBook Pro M5 Pro 48 GB / 1 TB.

Each gift has title, optional variant, note, category, image (filename stem in src/assets/gifts), query (the exact model/configuration to search for), and url (a brand fallback). Add/remove/reorder objects to manage the list. GiftGallery.astro imports local images and generates responsive 360px / 720px WebP assets. Original product photos are retained; CSS gives them paper-toned plates. Every image uses contain sizing with no crop, mask, zoom, or rounded clipping; the Sony promotional image is shown in full. No AI-generated replacement products are used.

The gallery uses three columns and two rows on desktop and phones, so all five current gifts fit on one screen. Future additions paginate in groups of six. Pagination is in app.js. An empty array restores the friendly empty state. Product cards are full links opening new tabs. Only images show initially; product details appear on hover or keyboard focus. On a touchscreen, the first tap reveals details and the next tap follows the store link. Without JavaScript, all gifts and brand links remain available.

Country handling lives in src/lib/gifts.js. The browser suggests a market from its language region (with a Nepal timezone correction); this is a suggestion, not IP geolocation. Visitors can change the selector, and their selection is saved locally as khosta-gift-country. No location service or external request runs on page load. Supported markets open product searches at the matching Amazon store or Daraz Nepal. Search links retain the requested configuration but cannot guarantee stock, seller, or exact variant. The MacBook has a direct Oliz Store Nepal override. Other country / region uses each gift's brand fallback; select the destination region on that website.

Add a market to giftMarkets as [country label, store label, HTTPS search URL, query parameter]. To use an exact regional listing, add regionalUrls to that gift, for example:

```json
{ "regionalUrls": { "NP": { "url": "https://example.com/product", "label": "View at local store ↗" } } }
```

Only HTTP/HTTPS links pass validation. Check store destinations and configurations periodically. The site takes no payments, adds no affiliate codes and makes no stock claims. Reference product pages: [Sony](https://electronics.sony.com/imaging/interchangeable-lens-cameras/aps-c/p/ilce6700-b), [Osmo Action 6](https://store.dji.com/product/osmo-action-6-adventure-combo), [DJI Mic 3](https://store.dji.com/product/dji-mic-3), [Samsung](https://www.samsung.com/us/watches/galaxy-watch7/buy/), [Apple](https://www.apple.com/shop/buy-mac/macbook-pro), [Oliz Nepal](https://www.olizstore.com/product/apple-macbook-pro-m5-pro-16%22).

Horizontal dividers between the header, content and footer, and within contact/wishlist content, are removed in global.css. Control outlines and paper-fold details remain part of their components.

## Social profiles

Edit socials in portfolio.json:

```json
{ "label": "Instagram · Khosta", "url": "https://www.instagram.com/khosta.np/" }
```

Delete/reorder objects to remove or reorder links. Eleven current profiles are retained, including personal accounts. SocialLinks.astro validates HTTP/HTTPS destinations and renders links with safe new-tab attributes. app.js displays four at a time so the full set fits the slide. Adjust renderSocials and its divisor together to change page size. Empty socials hide the link row; the pager hides automatically for four or fewer.

## Colors, typography, and motion

Dark colors remain green #2cac6d, navy #1d1d35, tan #deb887. The light theme uses warm off-white, navy text, deeper green, and deeper tan. Tokens are at the top of global.css. Inter supplies headings/interface text; local Libre Caslon Condensed supplies tan italic text. Change the Google Fonts link, @font-face declarations, font tokens, and italic preload together when replacing fonts. Font licenses remain in public/fonts.

Theme choice uses khosta-theme in localStorage and syncs across tabs via theme.js. Dark is the default. Native SVG logo pieces remain in public/assets. Green centers rotate clockwise with CSS; the ring stays fixed. Tan marks use logo-static. IntersectionObserver and page visibility pause unused logo motion. prefers-reduced-motion disables entrance, rollout, and logo animations.

## GitHub Pages and Cloudflare

Production uses the four existing www A records at 185.199.108.153 through 185.199.111.153, and the apex CNAME points to www.sunil17.com.np. GitHub Pages source is GitHub Actions. The custom domain is also stored in public/CNAME and astro.config.mjs. No /Web base prefix is needed with this domain. Do not change hosting merely to preview revamp.

On 20 October 2026, the unused perf-metrics-f208 Worker and its route were removed, alongside the obsolete _openai-site-verification.www TXT, _cf-custom-hostname.www TXT, and old Brave verification TXT. Thirteen required DNS records remain: five website records, three Zoho MX records, SPF, Zoho verification, two DKIM records, and Google verification. Proxy/HTTPS settings and existing API tokens were preserved. GitHub Pages does not need a Cloudflare Worker or token to deploy.

This design is deployed from main. For future releases, review and test changes, merge them into main, and let the existing workflow build/test/deploy. A failed workflow preserves the prior publication. Revert the relevant main commit and push the revert to roll back.

## Troubleshooting

| Symptom | Check |
| --- | --- |
| New content not visible | Rebuild after JSON changes; check which branch is running |
| Domain still shows the old design | Check the latest main workflow and refresh any cached copy |
| Blank slideshow | Check browser console, module loading, and screen IDs |
| Work cover ratio looks wrong | Use a supported aspectRatio; inspect work-wall.js and media dimensions |
| Missing gallery items | Check format, masonry columns, and URL validation |
| Social profile missing | Check pagination, label, and full HTTP/HTTPS URL |
| Video refuses to embed | Use the original-platform link; platform restrictions are external |
| Motion does not play | Check reduced-motion preference and active screen |
| Test fails after adding content | Update the relevant demo-specific assertion in verify.mjs |

## Future reference

Cosmos (https://www.cosmos.so/) is a user-selected visual and interaction reference. Preserve Khosta's own branding and supplied work. Do not copy third-party brand content into this portfolio.

## Dragging and screen previews

Drag or swipe horizontally over the stage (60px minimum). app.js advances available Work pages, Gift pages (six cards), or Contact social pages (four profiles) first, then the adjacent screen. Dragging a link suppresses the subsequent click; ordinary clicks still activate links. Buttons, form fields, and the opening menu keep their normal interactions. Pointer capture ends on release or cancellation, and no frame loop runs while idle. Arrows, keyboard controls, and browser history remain available.

Gift entrances use the same transform/opacity rollout style as Work and respect reduced motion. Change rollout in app.js to tune it. Home Work preview posters use the first configured thumbnail for each platform, with the showreel and gallery artwork as empty-platform fallbacks; platform icons live in PlatformIcon.astro. The Reach out preview uses a flex column so its logo and text do not overlap. The footer wording is in index.astro.

## Current work collection

18 supplied projects are configured in portfolio.json: nine YouTube videos (seven Shorts at 9:16 and two long videos at 16:9), five PARADYGM TV TikToks, and four Instagram reels (two portrait and two landscape). The showreel remains separate, for 19 playable players. Short/long tabs and the masonry wall handle the full collection. No coming-soon cards remain while every platform has real projects.

YouTube titles were read from public oEmbed metadata. Instagram titles are concise labels based on public captions; TikTok titles use the captions supplied with the links. Edit title and category freely in portfolio.json. Links are canonicalized without share/tracking parameters. Paste a TikTok video's URL into url; never paste its blockquote or embed.js script into the site.

Real YouTube/TikTok cover frames and frames extracted from the four supplied Instagram exports are cached in src/assets/work. Astro generates responsive WebP variants locally. Keep object-fit: contain to preserve full borders.

For a new optimized poster, add it to src/assets/work and set thumbnail to assets/work/filename.jpg (PNG/WebP also supported). index.astro imports that directory automatically; filenames must be unique. Public vector posters use /assets/work/filename.svg. Players and their platform requests load only when clicked; the original-platform link is available if an embed is restricted. This site cannot override a creator's embed restrictions, platform sign-in requirements, or removed videos.


## Revamp: masonry, formats and native videos

The Work sidebar now has **Short form** and **Long form** tabs. Set each video’s `format` to `short` or `long` in `src/data/portfolio.json`; this is independent of `aspectRatio` (a short film can be landscape). The current gallery has 16 short edits and two long films. The showreel has a separate sidebar button.

`src/scripts/work-wall.js` packs short edits into compact columns and repeats decorative, keyboard-hidden copies for a seamless downward CSS loop. Adjust the 10px gap, column-width thresholds, and the `14 + index * 2` pixels/second speed there. The `wall-fall` keyframes in `src/styles/global.css` move from negative column height to zero. Hover or focus pauses the wall; Pause motion stops it explicitly; hidden pages, open players and reduced-motion settings also pause it. Arrows/drag move through the wall. Long form uses a stationary two-card layout, stacked on narrow screens.

All covers use contain sizing. Home’s Work composition uses one landscape YouTube card and portrait TikTok/Instagram cards, with rounded badges and a gentle CSS side-to-side roll. Change those positions in the `.preview-work` rules.

### Video-only Instagram playback

Keep `url` as the original credited project link. Add `mediaUrl` pointing to an owned export in `public/media/`, for example `/media/fusion-node-tree.mp4`. Local file names may use letters, digits, underscores, hyphens and dots, ending in .mp4. The dialog prefers this file and retains the original-platform link. Native controls replace the Instagram post interface. Removing mediaUrl restores the platform embed fallback.

Current files: fusion-node-tree.mp4 (One of my recent works), let-the-journey-begin.mp4 (EP1), stop-motion.mp4 (Had fun doing this!), and ufc-event-promo.mp4 (Oliveira vs Holloway). They are H.264/yuv420p with AAC audio, maximum 1280px on the long edge, and fast-start metadata. Originals are untouched. Keep each file below 24 MiB for this hosting path. Videos are not fetched on initial load.

To replace a poster, export a JPEG frame from your video into `src/assets/work/` and set thumbnail to `assets/work/filename.jpg`. The four native videos currently use frames at two seconds; TikTok uses real frames captured from the public player, with its nonblank cover used where available. Signed CDN URLs are not stored in the site.

### Reach out tool badges

Six small local marks surround the paper portrait: DaVinci Resolve, Fusion, Canva, Affinity, Illustrator and Photoshop. They are decorative tool references, not links or a visible tools list. Edit the tool array inside the paper-portrait figure in `src/pages/index.astro`; edit their colors, positions and mobile sizes in `.tool-badge`, `.tool-orbit` and `.tool-*` rules in `src/styles/global.css`. Names appear on hover or keyboard focus. Leave the portrait’s reserved padding so badges stay clear of the contact copy. No external icon library or additional requests are used.

The exact footer is `Freelance Video Editor / Filmmaker`. Update it in index.astro.

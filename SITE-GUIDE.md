# Khosta portfolio — complete editing guide

This guide describes the site as it is currently implemented, including the details that are not controlled by the content file.

**Documentation updated:** 21 October 2026. Includes Libre Caslon Condensed, 11 social links, GitHub Pages deployment, the completed Cloudflare cleanup, the folded-paper portrait, and the selected YouTube showreel.

**Project folder:** `C:\Users\sunil\OneDrive\Documents\sites\khosta-web-github`  
**Production domain:** https://www.sunil17.com.np/
**Repository:** https://github.com/Khostaa/Web  
**Framework:** Astro 7.4.1, with static HTML output.  
**Content model:** files in this project; there is no online admin panel or database.

Source changes become public after a push to `main` and a successful GitHub Pages workflow. The original owner-private Sites preview is independent.

## References for future design changes

[Cosmos](https://www.cosmos.so/) is an additional user-selected visual reference, saved on 21 October 2026. Consult it alongside the earlier design direction when planning future changes. This reference does not request an immediate redesign. Preserve Khosta’s colors, typography, content, responsive video ratios, and lightweight motion unless a future request changes them.

## Contents

1. [Quick editing map](#1-quick-editing-map)
2. [Project structure](#2-project-structure)
3. [Run and preview locally](#3-run-and-preview-locally)
4. [Content file and JSON rules](#4-content-file-and-json-rules)
5. [Add, edit, remove, and reorder work](#5-add-edit-remove-and-reorder-work)
6. [Video platforms and aspect ratios](#6-video-platforms-and-aspect-ratios)
7. [Posters and image optimization](#7-posters-and-image-optimization)
8. [Main showreel](#8-main-showreel)
9. [Wishlist](#9-wishlist)
10. [Name, contact details, and social links](#10-name-contact-details-and-social-links)
11. [Headings, page copy, and navigation](#11-headings-page-copy-and-navigation)
12. [Colors and light/dark mode](#12-colors-and-lightdark-mode)
13. [Fonts, spacing, and responsive layout](#13-fonts-spacing-and-responsive-layout)
14. [Logo files and animation](#14-logo-files-and-animation)
15. [Hide, remove, or add a section](#15-hide-remove-or-add-a-section)
16. [Search metadata and site URL](#16-search-metadata-and-site-url)
17. [Build, check, and publish](#17-build-check-and-publish)
18. [Troubleshooting](#18-troubleshooting)
19. [Technical behavior and limits](#19-technical-behavior-and-limits)

## 1. Quick editing map

All paths in this guide are relative to the project folder above.

| What you want to change | File or folder |
| --- | --- |
| Add/remove work, video URLs, categories, years, ratios | `src/data/portfolio.json` → `videos` |
| Main showreel URL | `src/data/portfolio.json` → `showreelUrl` |
| Add/remove wishlist items | `src/data/portfolio.json` → `gifts` |
| Email, phone, and social profile links | `src/data/portfolio.json` |
| Initial contact HTML, name text, hero, about, footer, headings | `src/pages/index.astro` |
| Colors, fonts, dimensions, mobile layout, logo speed | `src/styles/global.css` |
| Default appearance and remembered theme | `src/scripts/theme.js` |
| Video dialog, filters, gift cards, clipboard, logo visibility | `src/scripts/app.js` |
| Platform support, URL validation, default posters/copy/ratios | `src/lib/media.js` |
| Initial work gallery HTML and card structure | `src/components/WorkGallery.astro` |
| Social link HTML, labels, accessibility, new-tab behavior | `src/components/SocialLinks.astro` |
| Optimized source photos | `src/assets/` |
| Local serif font files | `src/assets/fonts/` |
| Local font license and author attribution | `public/fonts/` |
| Custom public posters and downloadable files | `public/assets/` |
| Full logo, center, outer ring, current favicon artwork | `public/assets/logo*.svg` |
| Astro site origin and static build settings | `astro.config.mjs` |
| Commands and dependency versions | `package.json` |
| Checks that run after building | `verify.mjs` |

**Important:** `name` and `alias` in the JSON file currently do not replace every visible name automatically. Name/brand text is also written directly in the page template and some player labels. See section 10.

## 2. Project structure

```text
khosta-web-github/
├── src/
│   ├── assets/
│   │   ├── reel.jpg                 Main reel background
│   │   ├── story.jpg                YouTube placeholder photo
│   │   ├── social.jpg               Instagram placeholder photo
│   │   ├── motion.jpg               TikTok placeholder photo
│   │   └── fonts/
│   │       ├── LibreCaslonCondensed-Regular.woff2
│   │       └── LibreCaslonCondensed-Italic.woff2
│   ├── components/
│   │   ├── WorkGallery.astro        Pre-rendered gallery and cards
│   │   └── SocialLinks.astro        Pre-rendered social profile links
│   ├── data/
│   │   └── portfolio.json           Contact, showreel, work, wishlist, socials
│   ├── lib/
│   │   └── media.js                 Shared video/ratio helpers
│   ├── pages/
│   │   └── index.astro              Entire page and image generation
│   ├── scripts/
│   │   ├── app.js                   Browser interactions
│   │   └── theme.js                 Early theme initialization
│   └── styles/
│       └── global.css               Site styling and animations
├── public/
│   ├── assets/
│   │   ├── logo.svg                 Complete, static SVG logo
│   │   ├── logo-center.svg          Rotating center artwork
│   │   ├── logo-outer.svg           Fixed ring artwork
│   │   └── favicon.svg              Older unused icon; not the current favicon
│   └── fonts/
│       ├── LibreCaslonCondensed-OFL.txt
│       └── LibreCaslonCondensed-AUTHORS.txt
├── .github/workflows/deploy.yml     GitHub Pages build and deployment
├── public/CNAME                     Custom domain
├── astro.config.mjs                Astro configuration
├── package.json                    Scripts and Astro dependency
├── pnpm-lock.yaml                  Exact installed dependency versions
├── tsconfig.json                   Astro editor/type configuration
├── verify.mjs                      Build and behavior checks
├── preview.mjs                     Optional simple static preview server
├── README.md                       Short developer overview
├── SITE-GUIDE.md                    This guide
├── dist/                           Generated website; do not edit directly
├── node_modules/                   Installed dependencies; do not edit
└── .astro/                         Generated Astro files; do not edit
```

The page imports your content and photos at build time. Astro produces the finished HTML, optimized images, CSS, and JavaScript in `dist/`. GitHub Pages serves that output. `dist/`, `.astro/`, and `node_modules/` are intentionally excluded from source tracking.

## 3. Run and preview locally

If Node and pnpm are already available in your terminal:

```powershell
Set-Location -LiteralPath 'C:\Users\sunil\OneDrive\Documents\sites\khosta-web-github'
pnpm install
pnpm dev
```

Open the Local URL printed by Astro, normally `http://127.0.0.1:4321`. Source edits update the development preview. Stop it with **Ctrl+C**.

The project pins pnpm 11.25.0 and Astro 7.4.1. This Astro version requires Node 22.22.0 or newer. Do not upgrade dependencies just to change content.

### If `pnpm` is not recognized on this computer

Codex's bundled runtime was used to build this project. These are its current paths:

```powershell
$khostaNode = 'C:\Users\sunil\.cache\codex-runtimes\codex-primary-runtime\dependencies\node\bin\node.exe'
$khostaPnpm = 'C:\Users\sunil\.cache\codex-runtimes\codex-primary-runtime\dependencies\node\node_modules\pnpm\bin\pnpm.mjs'
Set-Location -LiteralPath 'C:\Users\sunil\OneDrive\Documents\sites\khosta-web-github'
& $khostaNode $khostaPnpm install
& $khostaNode $khostaPnpm dev
```

Use the same prefix for other commands: `& $khostaNode $khostaPnpm build`, `test`, or `preview`. These bundled paths can change after a Codex runtime update; ask Codex to locate its workspace dependencies if they stop existing. They are not portable to someone else's computer.

## 4. Content file and JSON rules

Open `src/data/portfolio.json`. The current structure is:

```json
{
  "name": "Sunil Paudel",
  "alias": "Khosta",
  "email": "mailkhosta@gmail.com",
  "phone": "+9779825833442",
  "phoneDisplay": "+977 982 583 3442",
  "showreelUrl": "https://www.youtube.com/watch?v=kPqnJMdCEFI",
  "videos": [],
  "gifts": [],
  "socials": [
    {
      "label": "YouTube",
      "url": "https://www.youtube.com/@KhostaTuts"
    },
    {
      "label": "Instagram · Khosta",
      "url": "https://www.instagram.com/khosta.np/"
    },
    {
      "label": "Behance",
      "url": "https://www.behance.net/khostaa"
    },
    {
      "label": "LinkedIn",
      "url": "https://www.linkedin.com/in/khostaa/"
    },
    {
      "label": "Facebook · Khosta",
      "url": "https://www.facebook.com/khostaaa/"
    },
    {
      "label": "GitHub",
      "url": "https://github.com/Khostaa"
    },
    {
      "label": "Medium",
      "url": "https://khostaa.medium.com"
    },
    {
      "label": "X",
      "url": "https://x.com/Sunil_Poudel17"
    },
    {
      "label": "Discord",
      "url": "https://discord.gg/AsnMswFT25"
    },
    {
      "label": "Instagram · Personal",
      "url": "https://www.instagram.com/sunil_poudel17/"
    },
    {
      "label": "Facebook · Personal",
      "url": "https://www.facebook.com/sunil.poudel17"
    }
  ]
}
```

- Use double quotes around keys and text.
- Put a comma between entries, but not after the last entry in an array/object.
- JSON does not support comments. Put notes in this guide rather than the JSON file.
- Keep `videos`, `gifts`, and `socials` as arrays, even when empty.
- Save a backup or use Git before a large edit.

The examples below contain placeholder URLs. Replace them with your own actual links before publishing; examples are not included in your live content automatically.

## 5. Add, edit, remove, and reorder work

### Add a video

Replace `"videos": []` with an array of objects:

```json
"videos": [
  {
    "title": "A journey through the mountains",
    "category": "Travel film",
    "platform": "youtube",
    "aspectRatio": "16:9",
    "url": "https://www.youtube.com/watch?v=YOUR_VIDEO_ID",
    "thumbnail": "/assets/mountain-film.jpg",
    "year": "2026"
  },
  {
    "title": "A small moment",
    "category": "Short form",
    "platform": "instagram",
    "aspectRatio": "9:16",
    "url": "https://www.instagram.com/reel/YOUR_REEL_ID/",
    "thumbnail": "/assets/instagram-reel.jpg",
    "year": "2026"
  },
  {
    "title": "Find the rhythm",
    "category": "Social edit",
    "platform": "tiktok",
    "aspectRatio": "9:16",
    "url": "https://www.tiktok.com/@YOUR_USERNAME/video/YOUR_NUMERIC_VIDEO_ID",
    "thumbnail": "/assets/tiktok-edit.jpg",
    "year": "2026"
  }
]
```

Copy the three example poster files into `public/assets/` using the matching filenames, or replace `thumbnail` with an existing image alias from section 7.

| Field | Purpose | Required/recommended |
| --- | --- | --- |
| `title` | Card heading and video dialog title | Include it |
| `url` | Actual playable video link | Required; unsupported links are filtered out |
| `platform` | Which platform column/filter contains the video | Use `youtube`, `instagram`, or `tiktok` |
| `aspectRatio` | Shape of the card and video player | Recommended; supported values below |
| `thumbnail` | Poster image path or optimized image alias | Optional; default platform photo is used when absent |
| `category` | Small text below the card | Optional |
| `year` | Small text below the card | Optional; use a string such as `"2026"` |

Do not add `"placeholder": true` to a real video: that flag is reserved for the component's generated empty-state cards.

### Edit or remove a video

Edit its object to change details. To remove it, delete the entire object and correct adjacent commas. To remove all work, set `"videos": []`.

### Reorder work

Reorder objects in the array. Their relative order is preserved **within each platform**. The overall layout remains grouped into YouTube, Instagram, and TikTok columns; it is not a single chronological feed.

### What happens to coming-soon placeholders?

Each platform with no valid videos shows its placeholders. Once you add a valid video for that platform, its placeholders disappear. Other empty platforms continue to show placeholders. Removing a platform's last video restores its placeholders.

Default placeholder ratios and copy are in `src/lib/media.js` under `placeholderRatios` and `defaults`. To remove placeholder cards entirely, change the empty-platform branches in both `WorkGallery.astro` and `app.js → renderProjects()`.

**Initial footnote:** the text under the gallery is also written in `index.astro` as “Original work coming soon.” Update that initial text when adding real work. The interaction script changes the footnote when a filter is selected; edit that version in `app.js → renderProjects()` too.

## 6. Video platforms and aspect ratios

| `aspectRatio` | Suitable for |
| --- | --- |
| `"9:16"` | Reels, TikTok, YouTube Shorts |
| `"16:9"` | Widescreen films and standard YouTube videos |
| `"4:3"` | Classic landscape footage |
| `"1:1"` | Square social posts |
| `"3:4"` | Portrait posts and edits |

Set the ratio explicitly when possible. It controls both the card and the on-demand player. The implementation also accepts the alias field `ratio`, but `aspectRatio` is the preferred name.

When omitted, the defaults are: TikTok → 9:16; links containing `/shorts/`, `/reel/`, or `/reels/` → 9:16; other Instagram links → 1:1; other videos → 16:9.

Supported links currently include:

- YouTube `watch?v=...`, `youtu.be/...`, `/shorts/...`, `/live/...`, and `/embed/...` URLs. The video ID must be 11 valid characters.
- Instagram `/reel/...`, `/reels/...`, `/p/...`, and `/tv/...` URLs.
- TikTok full URLs containing `/@username/video/NUMERIC_ID`. Expand shortened TikTok links first.
- Direct HTTP/HTTPS `.mp4` URLs, particularly for the main showreel. `.mov`, `.webm`, and other extensions are not handled by the current parser.

Platform privacy settings, deleted videos, login requirements, or disabled embedding can prevent playback. The dialog includes a link to the original platform. Instagram may display its own embed interface rather than immediately playing. Changing the URL parser cannot override a platform's restrictions.

## 7. Posters and image optimization

### Easiest: add a public poster

1. Copy an image to `public/assets/my-film.jpg`.
2. Set `"thumbnail": "/assets/my-film.jpg"` in the video object.
3. Preview, build, and publish.

Files inside `public/` are copied unchanged. Resize/compress custom public posters before adding them. Public files use a leading slash in their browser URL; do not write `public/assets/...` in the JSON.

### Existing automatically optimized image aliases

These strings are looked up in the image map generated by `index.astro`:

| JSON `thumbnail` value | Source file |
| --- | --- |
| `"assets/reel.jpg"` | `src/assets/reel.jpg` |
| `"assets/story.jpg"` | `src/assets/story.jpg` |
| `"assets/social.jpg"` | `src/assets/social.jpg` |
| `"assets/motion.jpg"` | `src/assets/motion.jpg` |

Keep these aliases exactly as shown, **without a leading slash**. They resolve to generated responsive WebP files. `/assets/story.jpg` is a different URL and will not resolve unless you also create that public file.

### Add another automatically optimized poster

1. Add `src/assets/mountain-film.jpg`.
2. In the frontmatter at the top of `src/pages/index.astro`, add:

```js
import mountainFilm from '../assets/mountain-film.jpg';
```

3. Add its key to the object in the existing image-generation loop:

```js
Object.entries({ reel, story, social, motion, 'mountain-film': mountainFilm })
```

4. Set `"thumbnail": "assets/mountain-film.jpg"` in the JSON video entry.

The current loop creates 400px and 800px WebP versions at quality 78. This key is a lookup alias, not an extra file you need to create in `public/`.

### Replace existing photography

Replace the corresponding file in `src/assets/` while keeping its name, or change its import in `index.astro`. Update the hero image's `alt` description if its subject changes. Do not edit generated hashed files in `dist/_astro/`.

The hero uses widths 640, 960, 1280, and 1800. These are declared twice in `index.astro`: once to generate variants and once to label `srcset`. Keep those lists in sync if you change them. Gallery source widths and `srcset` labels likewise need to stay in sync.

Actual video posters use `object-fit: contain` to retain the whole image; mismatched proportions can leave empty space. Coming-soon photos use `cover` for decorative crops. Change these rules in `global.css` if desired.

### Opening portrait and folded-paper reveal

The editor photo is `src/assets/sunil-portrait.png`. Replace this file to change it. `src/pages/index.astro` imports it as `portrait`, generates 360px and 640px WebP variants, and renders `.paper-portrait` at the beginning of the hero. Update its image alt text when changing the subject. The portrait has explicit dimensions so the entrance does not shift the page layout.

The paper effect is built in CSS: `.paper-sheet` is the cream frame; `.paper-grain` and the sheet overlay use the small `public/assets/paper-grain.svg` texture; `.paper-fold-top` and `.paper-fold-bottom` unfold away from the middle. The `portrait-arrive`, `portrait-emerge`, `paper-open-top`, and `paper-open-bottom` keyframes control the motion. Change their durations and delays together if adjusting timing. The paper flaps disappear after the reveal.

The reveal replays with each full load or refresh. It uses no timer, animation library, storage flag, or blocking overlay. With `prefers-reduced-motion: reduce`, the photo appears immediately and the flaps stay hidden. The desktop hero uses a two-column `.hero-stage`; on screens up to 700px wide, the photo sits above the text.

## 8. Main showreel

The current selection is `https://www.youtube.com/watch?v=kPqnJMdCEFI`. Set `showreelUrl` in `portfolio.json` to another supported video URL to replace it. An empty or unsupported value keeps the clearly labeled sample reel.

The real showreel label and caption are rendered in the initial HTML, and the YouTube iframe is created only when the play button is clicked. The work gallery is configured separately from the showreel.

The large background photo is separate from the playable video: change `src/assets/reel.jpg` to replace it. Replacing the photo does not change the video, and replacing the video does not change the photo.

| What to edit | Location |
| --- | --- |
| Playable video | JSON `showreelUrl` |
| Background photo and image generation | `src/assets/reel.jpg` and `index.astro` frontmatter |
| “Every frame. / A feeling.” | `index.astro` → `.reel-title` |
| Top/bottom labels before script execution | `index.astro` → `.reel-top`, `.reel-bottom` |
| Real-reel labels and dialog name | `app.js` → `hasReel` block and reel click handler |
| Sample video URL and sample disclaimer | `app.js` → reel click handler and `playVideo()` |

There is no separate showreel aspect-ratio setting in the content file currently. Its ratio is inferred by `videoRatio()` from the URL/platform. To force a specific ratio, pass it as the fourth argument to `playVideo()` in the reel click handler, for example `false, '4:3'` for a real 4:3 reel.

## 9. Wishlist

In `portfolio.json`, replace `"gifts": []` with entries such as:

```json
"gifts": [
  {
    "title": "A book on cinema",
    "note": "Something to inspire the next story.",
    "url": "https://example.com/your-book-link"
  },
  {
    "title": "Studio headphones",
    "note": "For the details between the beats.",
    "url": "https://example.com/your-headphones-link"
  }
]
```

Replace the example URLs with real product or wishlist links. Only HTTP/HTTPS URLs are accepted. Invalid URLs are filtered out.

- **Add:** insert another object with `title`, `note`, and `url`.
- **Edit:** change its fields.
- **Remove:** delete its object and fix commas.
- **Reorder:** move objects; cards follow array order.
- **Empty list:** set `"gifts": []`; the empty message returns automatically.

Gift cards currently contain text and an external “View gift” link. There are no image, price, currency, purchased/reserved, delivery-address, checkout, or payment fields. Adding such fields to JSON alone does not create those features; add their rendering/behavior in `app.js` and styling in `global.css`.

The section heading and introduction live in `index.astro`. The empty-state wording, gift-card construction, and “View gift” label live in `app.js`, starting at `const gifts = ...`. Wishlist content is created by the browser script; it is not pre-rendered like the work gallery.

## 10. Name, contact details, and social links

### Email and phone

Update the JSON fields `email`, `phone`, and `phoneDisplay`:

- `phone` is the dialable international number, such as `+9779825833442`.
- `phoneDisplay` is the spaced number visitors see.
- `email` updates the email link and clipboard button after the script runs.

Also update the initial email/phone text and link URLs in `index.astro`, under `#email-link` and `#phone-link`, so the initial HTML and no-JavaScript view match the new details.

### Name and brand

Update `name`/`alias` in JSON for consistency, but also edit:

- `<title>` and meta description in `index.astro`.
- Hero eyebrow, header/footer wordmark text, about heading, and footer name in `index.astro`.
- Relevant home-link accessibility labels in `index.astro`.
- The real-reel caption, dialog title, and Khosta-specific sample wording in `app.js`.
- Optional project display name in `package.json` and README.

### Add, edit, remove, and reorder social profile links

Social profile links are configured in the `socials` array of `src/data/portfolio.json` and rendered below your contact details by `src/components/SocialLinks.astro`. For example:

```json
"socials": [
  { "label": "Instagram", "url": "https://www.instagram.com/YOUR_USERNAME/" },
  { "label": "YouTube", "url": "https://www.youtube.com/@YOUR_HANDLE" }
]
```

Replace the example handles with your actual profiles. Entries appear in array order; edit, remove, or reorder objects as needed. Use an empty `socials` array to hide the row. Only nonempty labels and HTTP/HTTPS URLs are rendered. Profile links open in new tabs. Keep profile links separate from individual work video URLs. Style the row with `.social-links` in `global.css`.

| Field | What it controls |
| --- | --- |
| `label` | Visible button text and the accessible link name, such as `Instagram · Khosta` |
| `url` | Full destination URL, starting with `https://` or `http://` |

- **Add a profile:** insert a new object into `socials`; it can be any service with a valid web URL. Social profile links are not limited to the three video-embed platforms.
- **Change an account:** replace its `url`; update `label` if needed.
- **Remove a profile:** delete its object and fix adjacent commas.
- **Reorder profiles:** move objects in the array; links follow this order.
- **Hide all profiles:** use `"socials": []`. There is no empty-state message or row when the array has no valid entries.

Two accounts on the same platform are supported. Use clear labels to distinguish them. The component does not automatically deduplicate URLs; keep one entry per destination unless duplication is intentional.

### Current imported profiles

These were copied from https://www.sunil17.com.np/. The duplicate GitHub entry on that page was included only once. This is a saved list, not an automatic synchronization: changing the old website does not update this site.

| Display label | Current destination |
| --- | --- |
| YouTube | https://www.youtube.com/@KhostaTuts |
| Instagram · Khosta | https://www.instagram.com/khosta.np/ |
| Behance | https://www.behance.net/khostaa |
| LinkedIn | https://www.linkedin.com/in/khostaa/ |
| Facebook · Khosta | https://www.facebook.com/khostaaa/ |
| GitHub | https://github.com/Khostaa |
| Medium | https://khostaa.medium.com |
| X | https://x.com/Sunil_Poudel17 |
| Discord | https://discord.gg/AsnMswFT25 |
| Instagram · Personal | https://www.instagram.com/sunil_poudel17/ |
| Facebook · Personal | https://www.facebook.com/sunil.poudel17 |

### Placement and styling

The current placement in `index.astro`, immediately below the phone/copy-email row, is:

```astro
<SocialLinks links={portfolio.socials || []} />
```

Move that component line to change placement. Its existing import at the top of the page must remain. Avoid adding a second copy unless you want the links in two places.

`.social-links` uses a centered, wrapping layout with a maximum width of 800px. Change that rule to adjust the total width, gap, or margins. `.social-links a` controls the buttons; the light/dark color variables apply automatically. The arrow is decorative; the accessible link name also announces that it opens a new tab.

The links are rendered into the initial HTML during the Astro build and do not need client-side JavaScript. After editing JSON, rebuild and publish to update the live links. External account availability and Discord invite expiration must be maintained separately.

## 11. Headings, page copy, and navigation

Most editorial text is in `src/pages/index.astro`. Search for the text you see on the page, then edit it in place.

| Section | Locator in the page template |
| --- | --- |
| Header/navigation | `<header>` and `<nav aria-label="Main navigation">` |
| Hero | `.hero`, `#hero-title` |
| Featured reel | `.reel-section`, `#reel-button` |
| Work | `#work`, `#work-title` |
| About | `#about`, `.about-content` |
| Wishlist | `#wishlist`, `#wishlist-title` |
| Contact | `#contact`, `#contact-title` |
| Footer | `<footer>` |
| Video dialog | `#video-dialog` |

Use `<br>` to control a line break. Use `<em>...</em>` for the tan italic Libre Caslon Condensed treatment. Ordinary headings use Inter. Plain text such as `<span class="sans-lead">Less noise.</span>` is also Inter.

Navigation links such as `href="#work"` scroll to a section with `id="work"`. Keep links and IDs in agreement. IDs used by the interaction script should not be renamed without updating the script.

Placeholder headlines, descriptions, and images are in `media.js → defaults`; both the initial gallery and client-side filters use those values. Filter button text is in `index.astro`. Platform labels are in `media.js → platforms`.

Adding an entirely new video platform requires changes to URL parsing, embed generation, platform maps/defaults, filter markup, and both gallery rendering paths. It cannot be done by setting `platform` to an arbitrary new word.

## 12. Colors and light/dark mode

Edit `src/styles/global.css`. Dark defaults are in `:root`; light overrides start with `[data-theme="light"]`.

| Token | Dark default | Light override | Purpose |
| --- | --- | --- | --- |
| `--bg` | `#1d1d35` | `#f8f5ef` | Page background |
| `--surface` | `#25253f` | `#eee9e1` | Secondary surfaces |
| `--line` | `#3b3b53` | `#d9d2c8` | Separators/borders |
| `--white` | `#f0efec` | `#1d1d35` | Main text; the token name stays the same in light mode |
| `--muted` | `#ababbe` | `#626272` | Secondary text |
| `--green` | `#2cac6d` | `#17794b` | Links, green logo, small accents |
| `--sand` | `#deb887` | `#886039` | Italic heading color |

The green button remains `#2cac6d` in both modes. The deeper light-mode green and tan improve readability on the off-white background. Text and the tan logo over photographs retain their light colors.

Some component colors are set directly rather than through tokens. Search for the hex value or selector if changing a token does not affect an element. Later CSS rules and mobile rules can override earlier ones; the file currently includes a compact base block followed by feature/theme overrides.

When changing the page background, also update the browser theme-color values in `src/scripts/theme.js` and the initial `<meta name="theme-color">` in `index.astro`.

### Theme switch behavior

`theme.js` applies the saved appearance before styles paint. The browser stores it under `khosta-theme`. Dark is the default when no preference is saved. The initial default is not automatically based on operating-system theme. `app.js` attaches the switch interaction.

To change the default, change the initial fallback passed to `setPortfolioTheme()` when no valid saved value exists; keep the selected values as `light` and `dark`.

To test a fresh preference, use a private browsing window, or remove only this site's `khosta-theme` local-storage entry in browser developer tools. Avoid clearing unrelated browser data.

## 13. Fonts, spacing, and responsive layout

Font variables at the top of `global.css`:

```css
--font-body: Inter, Arial, sans-serif;
--font-display: "Libre Caslon Condensed", Georgia, serif;
```

Inter is loaded through the Google Fonts stylesheet link in the `<head>` of `index.astro`. Libre Caslon Condensed is hosted locally: its normal and italic WOFF2 files are in `src/assets/fonts/`, with `@font-face` declarations at the top of `global.css`. The italic face is preloaded in `index.astro`. To replace either font, update its variable and matching loading declarations. Keep the font license and author files in `public/fonts/`. Changing only a variable does not download a new font.

### Current font setup

| Usage | Font and loading method |
| --- | --- |
| Regular headings, body, navigation, labels, buttons | Inter, loaded from Google Fonts |
| Tan italic text inside `<em>` | Libre Caslon Condensed Italic, locally hosted |
| Optional future normal display text | Libre Caslon Condensed Regular, locally hosted and loaded only when used |

The supplied Caslon files are static weight 400, not variable fonts. Both `@font-face` rules declare weight 400 and `font-display: swap`. If you want other genuine Caslon weights, add the appropriate WOFF2 files and matching rules instead of relying on synthesized bold.

To replace the serif font completely:

1. Add the new normal/italic webfont files to `src/assets/fonts/`.
2. Update both `@font-face` declarations in `global.css`.
3. Update `--font-display` to the exact family name used by those declarations.
4. Update the `caslonItalicUrl` import and corresponding font preload in `index.astro` to the new italic file. Remove the preload if that face will no longer be used near the top of the page.
5. Include the new font's required license/attribution and update the README.
6. Build and inspect both themes and narrow-screen line wrapping.

Current upstream source: https://github.com/ertekinno/libre-caslon-condensed. The original font license and authors are stored in `public/fonts/LibreCaslonCondensed-OFL.txt` and `public/fonts/LibreCaslonCondensed-AUTHORS.txt`. Source filenames remain readable; Astro emits hashed font URLs in `dist/_astro/`. Do not edit those generated files.

| Layout detail | CSS selector |
| --- | --- |
| Main content width and side margins | `.wrap` |
| Header height and spacing | `.header`, `.header-actions` |
| Hero spacing and type size | `.hero`, `h1`, `h1 em`, `.sans-lead` |
| General section spacing | `.section` |
| Section headings | `h2`, `.section-heading` |
| Work columns and card spacing | `.project-grid`, `.project-lane` |
| Poster text and small labels | `.cover-type`, `.platform-tag`, `.ratio-tag` |
| Card titles and metadata | `.project-info h3`, `.project-info p` |
| About columns | `.about-section` |
| Wishlist columns | `.gift-list` |
| Video overlay | `.video-dialog`, `#video-player` |
| Footer | `.footer` |

The principal small-screen breakpoint is 700px; other adjustments exist at 1000px, 400px, and 1600px. When changing a selector, search for all its occurrences, including media queries. The gallery becomes one column below 700px.

## 14. Logo files and animation

The supplied native SVG artwork is stored in:

- `public/assets/logo.svg`: complete static mark; also the active favicon.
- `public/assets/logo-outer.svg`: fixed outer ring.
- `public/assets/logo-center.svg`: rotating center.

All three currently share `viewBox="750 750 3000 3000"`, so the pieces align. If replacing the artwork, export aligned pieces on the same coordinate system. Cropping each piece independently can move the center relative to the ring.

The page uses `.brand-logo` spans and CSS masks. `::before` renders the ring and `::after` renders the center. Mask colors come from `--green`, or an element's `--logo-color` override. Changing SVG fill colors alone does not change masked page logos; the favicon, which uses the SVG directly, is different.

### Speed and direction

Find the `.brand-logo::after` animation in `global.css`:

```css
animation: logo-center-spin 14s linear infinite;
```

Smaller duration means faster rotation; larger means slower. Keep `linear infinite` for the constant seamless loop. The keyframes rotate from `0deg` to `360deg`, clockwise.

### Keep a mark static

Add `logo-static` to its class list:

```html
<span class="brand-logo logo-static" aria-hidden="true"></span>
```

The tan reel mark already has this class. It renders the complete logo without a rotating layer and is excluded from the visibility observer. The favicon is static too.

The observer in `app.js` pauses animated marks when off-screen. Hidden tabs pause motion, and reduced-motion preferences disable it. Preserve these behaviors when editing the animation.

Desktop sizes are currently 38px in the header, 33px in the footer, 36px on the reel, and 145px in the about section, with smaller mobile overrides.

`public/assets/favicon.svg` is a leftover unused icon; the active favicon link points to `logo.svg`. Edit the actual linked file or change the `<link rel="icon">` URL in `index.astro`.

## 15. Hide, remove, or add a section

### Hide a section safely

Keep the section and its IDs in the DOM so current scripts can still find them. Add this rule once to `global.css`:

```css
[hidden] { display: none !important; }
```

Then add `hidden` to the section opening tag, for example:

```html
<section class="wishlist-section wrap section" id="wishlist" aria-labelledby="wishlist-title" hidden>
```

Remove or hide its navigation link too. Remove `hidden` to restore it. The explicit CSS rule matters because author `display` rules on some sections can override the browser's default treatment of `hidden`.

### Delete a section permanently

First remove its navigation links and related script code, or add appropriate null guards. The current interaction script assumes several elements exist:

| Removed feature | Dependencies to review in `app.js` |
| --- | --- |
| Main reel | `#reel-button`, reel labels, `hasReel`, reel click handler |
| Work | `#projects`, `#work-count`, `#work-footnote`, filters, `renderProjects()` and initial card listeners |
| Wishlist | `#gifts` and gift rendering block |
| Contact | `#email-link`, `#phone-link`, `#copy-email`, `#copy-status` |
| Theme switch | `#theme-toggle` click handler; also review `theme.js` |
| Video dialog | Dialog initialization, close listeners, `playVideo()` and all callers |

Deleting markup while leaving those direct element lookups can stop later JavaScript from running. Hiding is the easier choice when experimenting.

### Add a section

Add it inside `<main>` in `index.astro`, give it a unique ID and heading, and reuse existing classes:

```html
<section class="wrap section" id="services" aria-labelledby="services-title">
  <div class="eyebrow">SERVICES</div>
  <h2 id="services-title">A thoughtful cut.<br><em>A lasting feeling.</em></h2>
  <p>Your section text.</p>
</section>
```

Add `href="#services"` to navigation if needed. A text-only section does not require a new client framework or JavaScript component.

## 16. Search metadata and site URL

In the `<head>` of `index.astro`, edit the title and meta description. Keep the description accurate and concise. The current file does not include social-sharing Open Graph tags; add them there if needed.

`astro.config.mjs → site` is `https://www.sunil17.com.np`. Keep it aligned with `public/CNAME` and the custom domain in GitHub Settings → Pages. There is no `/Web` base path when using the custom domain. Changing the build origin alone does not change DNS.

Cloudflare currently routes `www` to GitHub Pages through four A records: `185.199.108.153`, `185.199.109.153`, `185.199.110.153`, and `185.199.111.153`. The apex CNAME points to `www.sunil17.com.np`. Keep mail records separate from website routing. The obsolete Sites verification TXT records were removed after choosing GitHub Pages.

The original Sites preview remains independent. This GitHub checkout does not use its hosting manifest or credentials.

### Cloudflare configuration after cleanup

On 20 October 2026, the unused Worker `perf-metrics-f208` and its `*sunil17.com.np/*` route were deleted. Cloudflare's Workers & Pages list and this domain's Worker route list are now empty. The website is built and hosted by GitHub Pages; a Cloudflare Worker is not required for deployment.

Three obsolete TXT records were removed:

- `_openai-site-verification.www.sunil17.com.np`: the abandoned Sites ownership check.
- `_cf-custom-hostname.www.sunil17.com.np`: the abandoned Sites custom-hostname check.
- The apex TXT value pointing to `Kiddo-Sunil/Web/blob/main/brave-rewards-verification.txt`: an old Brave verification link to a file not present in the current repository.

The remaining 13 DNS records were preserved:

| Purpose | Records retained |
| --- | --- |
| GitHub Pages website | Four A records for `www` and the apex CNAME to `www.sunil17.com.np` |
| Zoho incoming email | Three MX records to `mx.zoho.com`, `mx2.zoho.com`, and `mx3.zoho.com` |
| Email authentication and ownership | SPF TXT, Zoho verification TXT, and DKIM TXT records at `zmail._domainkey` and `cf2024-1._domainkey` |
| Google ownership verification | The existing `google-site-verification` TXT record |

Cloudflare's website proxy and HTTPS settings were preserved. Mail and verification records have purposes separate from publishing the portfolio, so they should not be removed just because the website does not read them. Existing Cloudflare API tokens were not changed; the GitHub Pages workflow does not need a Cloudflare token.

### Moving the website to a different domain

Update `astro.config.mjs → site`, `public/CNAME`, and GitHub Settings → Pages → Custom domain together. Configure DNS at the new domain's provider, push the source changes, wait for the Pages deployment and certificate setup, and check the new HTTPS URL. Changing a README link alone does not move the website. When changing hosts, use that host's exact DNS instructions rather than reusing unrelated verification records.


## 17. Build, check, and publish

### Normal editing cycle

1. Edit source files in `src/` or `public/`.
2. Run `pnpm dev` and check the changed areas.
3. Stop the development server when finished.
4. Run `pnpm build` to regenerate `dist/`.
5. Run `pnpm test` after the build.
6. Run `pnpm preview` to inspect the production output locally.
7. Commit source changes and push to `main`; GitHub Actions builds, checks, and publishes them.

`pnpm preview` serves the last build; it does not rebuild on every edit. `pnpm build` alone does not update the live URL. The optional `node preview.mjs` serves `dist/` on port 4173, but Astro's normal development/preview commands use port 4321.

### Current content-specific checks

`verify.mjs` includes assertions for the initial demo content: an empty wishlist, the current email address, all five placeholder ratios in the initial HTML, a particular Astro version, and the present image/logo setup.

If you add gifts, change the email, replace the complete set of placeholders with real work, change assets, or upgrade Astro, update those relevant assertions to match the intentional change. A failure in a demo-specific assertion does not by itself mean the new content is broken. Keep the useful URL-parsing, ratio, static-build, and on-demand-player checks.

### Publishing this particular site

`.github/workflows/deploy.yml` runs on pushes to `main` and supports manual runs from the Actions tab. It uses Node 24 and pnpm 11.25.0, builds the Astro site, runs `pnpm test`, uploads the Pages artifact, and deploys it using temporary GitHub workflow credentials.

One-time setup: GitHub Settings → Pages → Build and deployment → Source → **GitHub Actions**. Keep the custom domain `www.sunil17.com.np` and existing Cloudflare routing.

```text
pnpm build
pnpm test
git add .
git commit -m "Update portfolio content"
git push origin main
```

Check https://github.com/Khostaa/Web/actions for build and deployment success. A failed build preserves the last successful publication. To restore an earlier version, revert the relevant commit and push the revert. The previous website remains in repository history. Dependencies, generated `dist/`, and credentials stay out of Git.

The earlier Sites URL does not synchronize with this workflow. Make future edits in this GitHub repository.

Before publishing, check both themes, a narrow screen, each platform filter, video open/close, original-platform links, contact links, wishlist links, and the static tan logo.

## 18. Troubleshooting

| Symptom | What to check |
| --- | --- |
| Build reports a JSON error | Double quotes, missing/extra commas, comments, or unmatched brackets in `portfolio.json` |
| A new video does not appear | Actual supported URL, valid ID, exact lowercase platform, successful rebuild, and correct active filter |
| A platform still shows placeholders | It has no videos accepted by `parseVideo()`; inspect its URLs |
| Video exists but cannot play | Privacy/embedding restrictions; try the original-platform link |
| New poster is missing | File exists in `public/assets/` with matching case/path, or its optimized alias was added to the frontmatter map |
| A social profile is missing | It has a nonempty `label`, a full HTTP/HTTPS `url`, and the updated JSON was rebuilt and published |
| Social links do not match the old website anymore | The imported list is a snapshot; edit `socials` in this project's JSON |
| A social account or Discord invite no longer opens | Check the destination on the original service and replace its URL |
| The serif font falls back to Georgia | Check the WOFF2 files, `@font-face` paths, family name, and built font assets |
| Existing optimized image alias fails | Use `assets/story.jpg`, not `/assets/story.jpg`, unless you created a public file at the latter URL |
| Page still says work is coming soon | Update the initial footnote in `index.astro` and its filter-time version in `app.js` |
| Email briefly shows an old value | Update initial contact HTML as well as JSON |
| JSON name changes do not change headings | Edit hardcoded name/brand text in the page template and player labels |
| A color change has no effect | Look for a later component override, light-mode rule, mobile media query, or literal hex color |
| Logo center is misaligned | Ensure all SVG parts use the same viewBox and coordinate system |
| Green logo is not moving | Reduced-motion setting, hidden tab, off-screen visibility, or accidental `logo-static` class |
| Tan logo moves | Ensure its element has `logo-static` and the static override still exists |
| Changes vanish after a build | You edited `dist/`; make the same change in the source file instead |
| Local preview changes, live site does not | Push to main and check the GitHub Pages workflow |
| Production preview shows old content | Rebuild before `pnpm preview`, then refresh |
| A test fails after adding gifts/changing email | Adjust the initial demo-specific assertions in `verify.mjs` |
| Site is inaccessible to another person | Check GitHub Pages deployment status, custom domain, HTTPS, and DNS |
| Terminal says a port is in use | Stop the other preview with Ctrl+C or use the new Local URL Astro prints |

## 19. Technical behavior and limits

- The work gallery is pre-rendered from JSON at build time. Its client-side filtering creates equivalent cards using the shared media helpers.
- Social profile links are also pre-rendered from `portfolio.json`, through `SocialLinks.astro`. They work without the interaction script; the `socials` list is not fetched from the old website at runtime.
- If changing card structure, update both `WorkGallery.astro` and `app.js → createProject()`, or the layout will differ after clicking a filter.
- CSS and scripts are bundled by Astro. The early theme script is deliberately inlined before styles to apply the saved appearance promptly.
- Project images have responsive WebP variants. Public files are copied unchanged.
- Libre Caslon Condensed is locally hosted; its italic face is preloaded. Inter still uses Google Fonts.
- Video players are inserted only on click and removed on close. Closing also stops the local sample video.
- Real video bytes are supplied by YouTube/Instagram/TikTok or the direct-video host, not preloaded into every card.
- Theme preference is browser-local. It is not a global edit to the site's default appearance.
- The clipboard button needs browser clipboard permission/support; if copying fails, the email is displayed as a fallback.
- The site has no contact-form backend, CMS, account system, payment processor, analytics integration, or persistent visitor submissions.
- Adding a random field to `portfolio.json` does not create a feature. A new field needs corresponding template or script code to render/use it.
- Keep videos hosted externally and preserve deferred players, responsive images, and CSS-based motion when extending the site.

For a quick future edit, use the map in section 1, make the smallest source change, preview it, and follow the build/publish cycle in section 17.

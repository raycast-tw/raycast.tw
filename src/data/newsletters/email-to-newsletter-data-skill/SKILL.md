---
name: email-to-newsletter-data
description: Use this skill when converting Raycast monthly updates or Raycast Weekly emails (.eml) into this repo's newsletter data. It covers extracting the real email content, preserving original links, translating copy into Traditional Chinese, carrying over images from the email, updating src/data/newsletters.ts, and syncing monthly HTML files in src/data/newsletters.
---

# Email To Newsletter Data

Use this skill for this repo when a user wants to turn a Raycast email newsletter into site data.

## Files To Update

- Metadata source: `src/data/newsletters/meta.ts` (the `newsletterMeta` array)
- Monthly HTML content: `src/data/newsletters/monthly-YYYY-MM.html`
- Weekly HTML content: `src/data/newsletters/weekly-YYYY-rw###.html`

Every issue, regardless of type, requires both an HTML content file and an entry in `meta.ts`. `src/data/newsletters/index.ts` is just glue — do not edit it for new issues.

## Source Extraction Rules

Start from the `.eml` file, not from memory.

For Raycast monthly updates:

- Read the `text/plain` part first to understand structure and all links.
- Read the `text/html` part to extract image URLs and confirm linked text.
- Prefer the actual content images from the email body.
- Ignore tracking pixels, footer badges, tiny social icons, unsubscribe graphics, and decorative email chrome unless the user explicitly wants them.

For Raycast Weekly:

- Read the `text/plain` part first because it usually exposes the content list and URLs more clearly.
- If the HTML part contains a meaningful hero image or post image, include it.
- Do not import author avatars, app-store badges, tracking pixels, or social media icons as article images.

## Output Shape In `src/data/newsletters/meta.ts`

Each entry must match the `NewsletterMeta` type defined at the top of the file. `content` is NOT part of the metadata — it is loaded automatically from the matching `.html` file at build time via the `html()` helper in `index.ts`.

```ts
{
  id: "monthly-2026-03",
  title: "Raycast 三月月報：...",
  date: "2026-04-13",
  type: "monthly",
  theme: "crimson",
  kicker: "Raycast March Update",
  summary: "...",
  author: "Raycast Team",
}
```

For weekly entries, also include:

```ts
episode: "RW005";
```

The metadata is also consumed by the SEO build (`scripts/build-seo.ts`) to generate per-issue prerendered HTML, OG images, sitemap entries, and Atom feed entries. Inaccurate `date`, `summary`, or `author` will leak into all of those.

## Field Rules

### `id`

- Monthly: `monthly-YYYY-MM`
- Weekly: use a stable issue id like `weekly-2026-rw005`

### `date`

Use the email send date, normalized to `YYYY-MM-DD`.

### `title`

- Translate to Traditional Chinese.
- Keep product names, campaign names, and branded issue names in their original form when that reads better.
- Prefer a title that matches the email subject, not an invented editorial headline.

### `kicker`

Use the original publication identity in concise form.

Examples:

- `Raycast January Update`
- `Raycast February Update`
- `Raycast Weekly`

### `summary`

- Write in Traditional Chinese.
- Keep it to 1 sentence.
- Mention the main product and community themes.
- Do not make up features not present in the email.

### `author`

Use the publication sender, usually:

- `Raycast Team`
- `Alexi | Raycast Weekly`

### `theme`

Pick from:

- `crimson`
- `indigo`
- `emerald`
- `violet`
- `amber`

Keep the palette visually varied across cards. Do not reuse the same theme for adjacent new issues if an obvious alternative exists.

## Content Rules

`content` is HTML, rendered directly by the detail page. Write valid, compact HTML only.

Allowed structure:

- `<h2>`
- `<h3>`
- `<p>`
- `<ul>` / `<li>`
- `<img>`
- `<a>`
- `<strong>`
- `<code>`
- `<em>`

Avoid:

- inline styles
- script tags
- iframe/embed tags
- email-specific table markup
- copied tracking params unless there is no cleaner URL available

## SEO Content Rules

The detail page is prerendered into `dist/newsletter/<id>/index.html` for crawlers, so the HTML inside `content` is what Google and AI overviews actually see. Treat it as primary article markup, not as decorative copy.

### Heading hierarchy

- The page already renders an `<h1>` with the issue title. Inside `content`, start at `<h2>` for top-level sections and `<h3>` for sub-sections.
- Never use `<h1>` inside `content` (would create duplicate H1s on the page).
- Do not skip levels (`<h2>` → `<h4>`).
- Use headings for real sections only. Do not turn highlighted phrases into headings.

### Anchor text

- Link text must describe the destination. Avoid `點此`, `這裡`, `了解更多`, `click here`.
  - Bad: `<a href="...">點此</a> 看新版 Raycast`
  - Good: `<a href="...">新版 Raycast 公告</a>`
- Use the actual product / feature / extension name as the anchor when possible. Crawlers and screen readers both rely on this.
- Do not link the same URL multiple times in one paragraph; pick the most descriptive instance.

### Images

- Every `<img>` MUST have a meaningful `alt` in Traditional Chinese describing what the image shows or demonstrates.
- Decorative-only images are rare in newsletters — if one truly is decorative, use `alt=""` (empty, not missing).
- Bad: `alt="image"`, `alt="圖"`, missing `alt`.
- Good: `alt="Raycast Glaze 介面截圖：左側為主題列表，右側為預覽畫面"`.
- Prefer descriptive alt over redundant captions. Do not duplicate the surrounding paragraph text in alt.

### Lists vs paragraphs

- Use `<ul>` for unordered lists of features / extensions / bullet points. Do not fake lists with `<p>• …</p>`.
- Use `<ol>` only when order matters (steps, ranking).

### Other

- No empty paragraphs (`<p></p>`) or `<br>` for vertical spacing — let CSS handle spacing.
- Wrap inline command names in `<code>` (also a SEO signal that the term is a code identifier).
- Do not put long URLs as visible link text. Wrap them with descriptive text and put the URL in `href`.

## Translation Rules

Translate the explanatory copy into Traditional Chinese, but keep these in original language where appropriate:

- product names: `Raycast`, `Glaze`, `Raycast Weekly`
- command names: `Start Typing Practice`, `Fix Spelling and Grammar`
- service and site names: `ray.so`, `Monkeytype`, `YouTube`, `Luma`
- issue codes: `RW005`

Do not over-localize command labels. Wrap command names in `<code>` when they appear as commands.

## Link Rules

This is important:

- If text is linked in the original email, keep it linked in the article.
- If the source email links a phrase like `Prompt Library`, `Demo`, `community calendar`, or a specific event name, the same phrase should stay clickable in `content`.
- Do not collapse multiple distinct source links into one generic link unless the email itself did that.
- Keep direct links on extension names in Raycast Weekly.
- Keep demo links when the email includes them.

If the email contains obviously broken copy/link mismatches:

- Preserve the user-facing intent, not the typo.
- Example: if the text says `raycast.com/windows` but the href incorrectly points to iOS, use the Windows URL.
- Note the correction in your response if you make one.

## Image Rules

This is also important:

- Carry over the actual content images from the email.
- Insert images near the section they belong to.
- Use clean alt text in Traditional Chinese.
- Keep image URLs as direct `src` values when they are stable email asset URLs and the user has not asked to localize assets.

For monthly updates:

- Include the small Raycast icon image at the top only if the user wants the page to mirror the email more closely.
- Always include the real section images when they exist.

For weekly updates:

- Include only meaningful article/hero images.
- Do not include avatars, badges, social icons, or app buttons.

If external image URLs seem brittle or the user asks for durability, download them into the repo and rewrite `src` paths to local assets.

## HTML Content File Rule

Every issue requires a standalone HTML file under `src/data/newsletters/`:

- Monthly: `monthly-YYYY-MM.html`
- Weekly: `weekly-YYYY-rw###.html` (e.g. `weekly-2026-rw006.html`)

The file contains only the body HTML (no `<html>`/`<body>` wrapper). It is loaded at build time via `import.meta.glob` — the `html(id)` helper in `index.ts` maps the issue `id` to the correct file. The filename must match the `id` field exactly.

## Recommended Workflow

1. Read the `.eml` subject, date, plain-text body, and relevant HTML slices.
2. Extract:
   - title/issue identity
   - send date
   - major sections
   - all meaningful links
   - all meaningful content images
3. Draft Traditional Chinese summary and HTML content.
4. Write the HTML content into `src/data/newsletters/<id>.html`.
5. Add a metadata entry to `src/data/newsletters/meta.ts` (do not edit `index.ts`).
6. Check the detail-page rendering expectations:
   - links present, with descriptive anchor text
   - images present, every `<img>` has descriptive `alt`
   - heading hierarchy starts at `<h2>` (no `<h1>` inside content)
   - no email table markup
   - no missing closing tags
7. Run formatting if needed and then run `npm run build` (this also runs `tsx scripts/build-seo.ts` to produce per-issue HTML, OG image, sitemap, and feed entries).

## Common Mistakes To Avoid

- Forgetting to include images from the original email
- Leaving linked text unlinked after translation
- Copying plain text URLs into prose without `<a>` tags
- Importing tracking pixels or footer badges as article images
- Translating command names too aggressively
- Using the wrong send date
- Adding an entry to `meta.ts` but forgetting to create the corresponding `.html` file (causes `html()` to return an empty string silently)
- Editing `index.ts` instead of `meta.ts` for new entries
- Using `<h1>` inside `content` (the page already provides one — would create duplicate H1s)
- Anchor text like `這裡` / `點此` / `click here` instead of describing the link target
- Missing or generic `alt` on `<img>` tags
- Summarizing too hard and dropping notable sections like `Team Picks`, `In Other News`, or extension demos
- Copying raw email HTML tables into `content`

## Repo-Specific Conventions

- Newsletter HTML content lives in individual `.html` files under `src/data/newsletters/`. Metadata lives in `src/data/newsletters/meta.ts`. `index.ts` is glue that joins them via `import.meta.glob` — never inline HTML strings directly into `meta.ts` or `index.ts`.
- The detail page styles links as red already, so plain semantic `<a>` tags are enough.
- The detail page renders `<img>` tags directly, so content images belong inside `content`.
- Existing monthly snapshots in `src/data/newsletters/` are the best local examples to mirror.

## Example Prompt Triggers

- "幫我把這封 Raycast monthly update 轉成 newsletter data"
- "把這封 .eml 加到 new letter，翻成繁中，圖片也要一起帶"
- "更新 Raycast Weekly，extension link 和 demo link 都要保留"
- "從 email 轉成 `src/data/newsletters.ts` 格式"

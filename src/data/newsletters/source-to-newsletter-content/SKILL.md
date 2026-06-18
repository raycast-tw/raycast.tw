---
name: source-to-newsletter-content
description: Convert Raycast monthly or weekly emails, external Raycast articles, public URLs, and saved HTML pages into this repo's Traditional Chinese content collection. Use when adding or updating 月報, 週報, or 精選文章; extracting source links and images; translating content; updating newsletter metadata and HTML; or validating SEO, OG, sitemap, and Atom feed output.
---

# Source To Newsletter Content

Convert a source email or article into this repo's content model. Preserve the
source meaning, links, images, authorship, and publication identity while
presenting the result naturally in Traditional Chinese.

## Content Types

Choose one type:

| Source                 | `type`    | ID format             | Visible label |
| ---------------------- | --------- | --------------------- | ------------- |
| Raycast monthly update | `monthly` | `monthly-YYYY-MM`     | 月報          |
| Raycast Weekly         | `weekly`  | `weekly-YYYY-rw###`   | 週報          |
| External article       | `article` | `article-YYYY-<slug>` | 精選文章      |

The containing site section is named「精選內容」. Do not call an external article
「專文」because that can imply original editorial authorship.

## Files

- Metadata: `src/data/newsletters/meta.ts`
- Content: `src/data/newsletters/<id>.html`
- Loader glue: `src/data/newsletters/index.ts`
- Local article images: `public/newsletters/<slug>/`
- SEO generation: `scripts/build-seo.ts`

Every item needs both a metadata entry and a matching HTML file. Do not edit
`index.ts` when adding ordinary content; it loads matching HTML files
automatically through `import.meta.glob`.

## Read The Source

Always work from the supplied source artifact or URL, not from memory.

### Email (`.eml`)

1. Read the `text/plain` part to identify structure and links.
2. Read the `text/html` part to confirm linked text and extract images.
3. Ignore tracking pixels, footer badges, social icons, unsubscribe graphics,
   app-store badges, avatars, and email chrome.

For monthly updates, retain meaningful section images. For Raycast Weekly,
include only meaningful hero or article images.

### External article

Accept:

- A public article URL
- A saved complete HTML page
- A saved HTML page plus its sibling asset directory

Prefer a user-provided saved HTML page when available. It provides a stable
source for the full body and original assets.

Extract:

- Original title
- Publication date
- Author
- Publication or site identity
- Heading hierarchy
- Body copy
- Meaningful links
- Meaningful content images and their relationship to sections

Ignore navigation, analytics, scripts, styles, page chrome, related-content
widgets, and tracking parameters.

## Metadata

Each entry must match `NewsletterMeta` in `meta.ts`:

```ts
{
  id: "article-2026-raycast-3-percent",
  title: "你可能只用了 Raycast 的 3%：把功能串成自己的工作流",
  date: "2026-05-29",
  type: "article",
  theme: "crimson",
  kicker: "Pedro Duarte · Writing",
  summary: "...",
  author: "Pedro Duarte",
}
```

Weekly entries additionally include:

```ts
episode: "RW005";
```

Do not add `episode` to monthly updates or articles.

### Field rules

#### `id`

- Monthly: `monthly-YYYY-MM`
- Weekly: `weekly-YYYY-rw###`
- Article: `article-YYYY-<short-stable-slug>`

The filename must exactly match the ID.

#### `date`

- Email: use the send date.
- Article: use the original publication date.
- Normalize to `YYYY-MM-DD`.

The detail page already displays this date. Do not repeat phrases such as
「原文發布於 YYYY 年 M 月 D 日」inside the article body.

#### `title`

- Translate into natural Traditional Chinese.
- Preserve product names and branded issue names when appropriate.
- Monthly and weekly titles should follow the source subject.
- Article titles may add a short explanatory subtitle after a colon when it
  accurately reflects the article.

#### `kicker`

Preserve the original publication identity:

- `Raycast January Update`
- `Raycast Weekly`
- `Pedro Duarte · Writing`

#### `summary`

- Write one Traditional Chinese sentence.
- Mention the main themes.
- Do not add claims absent from the source.
- For articles, identify the author when useful.

#### `author`

Use the actual source author or sender:

- `Raycast Team`
- `Alexi | Raycast Weekly`
- `Pedro Duarte`

#### `theme`

Choose one of:

- `crimson`
- `indigo`
- `emerald`
- `violet`
- `amber`

Keep adjacent cards visually varied.

## Translation And Editing

Translate explanatory prose into natural Taiwan Traditional Chinese.

Keep these in their original language when that reads better:

- Product names: `Raycast`, `Glaze`, `Raycast Weekly`
- Feature and command names: `Quicklinks`, `Snippets`, `Clipboard History`,
  `Search Menu Items`, `Fork Extension`
- Services and sites: `Linear`, `GitHub`, `Spotify`, `YouTube`, `Luma`
- Issue codes: `RW005`
- Keyboard symbols and placeholders

Wrap literal commands, aliases, shortcuts, paths, placeholders, and code-like
input in `<code>`.

Prefer clear editorial translation over word-for-word English syntax. Preserve
technical meaning and actionable examples. Avoid adding unnecessary narrator
commentary. Personal asides from the author may be omitted when they do not
change the feature explanation, for example「Pedro 使用的就是永久保留設定」.

Recurring labels:

- `Team Picks` → `團隊精選`
- External article type → `精選文章`
- Site section → `精選內容`

Do not use「團隊私藏」、「團隊近況」、「專文」or「內容精選」for these
concepts.

## Attribution

For an external article, add one concise attribution paragraph near the
beginning:

```html
<p>
  本文翻譯自 Pedro Duarte 的
  <a href="https://example.com/article">〈Original article title〉</a>。
</p>
```

Link to the canonical source. Do not repeat the source publication date in this
paragraph because metadata already displays it.

Do not add repeated attribution at the end unless the user asks for it.

## HTML

Write body-only HTML in `src/data/newsletters/<id>.html`. Do not include
`<html>`, `<head>`, or `<body>`.

Allowed elements:

- `<h2>`, `<h3>`
- `<p>`
- `<ul>`, `<ol>`, `<li>`
- `<img>`
- `<a>`
- `<strong>`, `<em>`, `<code>`

Avoid:

- `<h1>` because the page already renders one
- Skipping heading levels
- Inline styles
- Scripts, iframes, embeds
- Source-site wrappers and email tables
- Empty paragraphs and spacing `<br>`
- Raw long URLs as visible text

## Links

- Preserve meaningful source links.
- Use descriptive anchor text.
- Keep direct extension, demo, event, product, and source-article links.
- Remove tracking parameters when a clean canonical URL is available.
- Do not use anchors such as「點此」、「這裡」or `click here`.
- Do not link the same URL repeatedly in one paragraph.

If source copy and link destinations clearly conflict, preserve the intended
destination and mention the correction in the handoff.

## Images

Every image must have meaningful Traditional Chinese `alt` text.

For email assets, stable direct source URLs are acceptable. Localize them when
the URLs appear brittle or the user requests durability.

For a saved external article:

1. Copy meaningful content images from the saved asset directory.
2. Store them under `public/newsletters/<slug>/`.
3. Use root-relative paths:

```html
<img
  src="/newsletters/raycast-3-percent/slack-hotkey.jpg"
  alt="Raycast command 設定畫面，Slack 的 hotkey 設為 Option 加 S"
/>
```

Preserve image order and place each image near its relevant section. Do not
import navigation icons, author avatars, tracking pixels, or decorative page
chrome.

## SEO And UI Conventions

`meta.ts` drives:

- Content cards
- Detail-page metadata
- Prerendered HTML
- OG images
- Sitemap entries
- Atom feed entries

The supported types are `monthly`, `weekly`, and `article`.
`contentTypeLabel()` must map `article` to「精選文章」.

The index and homepage filters should expose:

- 全部
- 月報
- 週報
- 精選文章

Do not edit UI files for every new item once this type support exists. Only
update the shared model or UI when introducing or changing a content type.

## Workflow

1. Identify the source type.
2. Read the source body, metadata, links, and meaningful images.
3. Choose an ID and image directory.
4. Draft the Traditional Chinese title, summary, and body.
5. Add concise source attribution for external articles.
6. Write `src/data/newsletters/<id>.html`.
7. Add the metadata entry to `meta.ts`.
8. Copy article assets into `public/newsletters/<slug>/` when applicable.
9. Format changed files.
10. Validate type checking, lint, build, SEO output, and rendering.

## Validation

Run:

```bash
pnpm exec prettier --check <changed-files>
pnpm run lint
pnpm run build
```

The build must generate:

- `dist/newsletter/<id>/index.html`
- `dist/og/newsletter/<id>.png`
- An item in `dist/sitemap.xml`
- An entry in `dist/feed.xml`

Also verify:

- The metadata ID has a matching HTML file.
- The content starts at `<h2>` when it begins with a section.
- There is no body `<h1>`.
- Every `<img>` has descriptive `alt`.
- Local image paths resolve and images have non-zero dimensions.
- The correct type label appears.
- The「精選文章」filter shows article items.
- The source attribution link points to the canonical article.

If the environment's default Node.js is too old, run pnpm with the workspace's
supported Node.js runtime. If `tsx` cannot create its IPC socket inside the
sandbox, request approval to run the existing SEO build step rather than
changing project code.

## Common Mistakes

- Starting from memory instead of the source artifact
- Treating a saved web page as an email
- Using the email send date for an article
- Calling an external article「專文」
- Repeating the publication date inside the body
- Keeping low-value personal asides that distract from the feature explanation
- Forgetting source attribution
- Translating command names too aggressively
- Dropping meaningful links or images
- Copying source wrappers, scripts, or tracking markup
- Missing or generic image `alt`
- Adding metadata without the matching HTML file
- Editing `index.ts` for an ordinary new item
- Forgetting OG, sitemap, or feed validation

## Example Requests

- 「幫我把這封 Raycast monthly update 轉成月報」
- 「把這封 `.eml` 加到精選內容，翻成繁中，圖片也要一起帶」
- 「更新 Raycast Weekly，保留 extension 和 demo links」
- 「把這篇外部 Raycast 文章加入精選文章」
- 「從這份完整 HTML 翻譯文章並把圖片存到本地」

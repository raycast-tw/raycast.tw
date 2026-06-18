import { newsletterMeta, type NewsletterMeta } from "./meta";

export type { NewsletterMeta };
export { contentTypeLabel, parseAuthor } from "./meta";

const htmlFiles = import.meta.glob<string>("./*.html", {
  query: "?raw",
  import: "default",
  eager: true,
});

function html(id: string): string {
  return htmlFiles[`./${id}.html`] ?? "";
}

export interface Newsletter extends NewsletterMeta {
  content: string;
}

export const newsletters: Newsletter[] = newsletterMeta.map((meta) => ({
  ...meta,
  content: html(meta.id),
}));

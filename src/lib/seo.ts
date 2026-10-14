import { portfolio } from "@/data/portfolio";

/**
 * Keeps the live document metadata in sync with `portfolio.ts`.
 * `index.html` ships the same values statically for crawlers that don't run JS;
 * this function guarantees the two can never drift apart at runtime.
 */
export function applySeo(): void {
  const { seo, profile } = portfolio;

  document.title = seo.title;

  const setMeta = (selector: string, attr: "content" | "href", value: string) => {
    const el = document.head.querySelector<HTMLMetaElement | HTMLLinkElement>(selector);
    if (el) el.setAttribute(attr, value);
  };

  setMeta('meta[name="description"]', "content", seo.description);
  setMeta('meta[name="author"]', "content", profile.name);
  setMeta('meta[name="theme-color"]', "content", seo.themeColor);
  setMeta('meta[property="og:type"]', "content", seo.ogType);
  setMeta('meta[property="og:title"]', "content", seo.ogTitle);
  setMeta('meta[property="og:description"]', "content", seo.ogDescription);
  setMeta('meta[name="twitter:title"]', "content", seo.ogTitle);
  setMeta('meta[name="twitter:description"]', "content", seo.ogDescription);
}

# SEO Audit — slatkoifino.com

**Date:** 2026-07-21
**Scope:** Homepage, `/recepti` listing (all 6 pagination pages), and **all 61 recipe pages** currently live on the site (enumerated by crawling the public listing pages — the full list is in the Appendix). This is a diagnostic report only; no code changes were made as part of this audit.

**Method:** Live HTTP fetches of the deployed site (not local dev), since recipe pages use ISR (`revalidate: 60`) and should be checked as actually served. Raw HTML was parsed for `<title>`, meta description, canonical link, Open Graph / Twitter tags, JSON-LD, `<h1>`, and image `alt` attributes across all 63 URLs (homepage + listing + 61 recipes).

---

## 1. Site-wide issues (affect every single page identically)

These come from how the page templates are built (`src/app/layout.tsx`, `src/app/(subpages)/(index)/page.tsx`, `src/app/(subpages)/recepti/page.tsx`, `src/app/(subpages)/recept/[slug]/page.tsx`), so they were confirmed once in code and then verified live across all 63 URLs — **0/63 pages** have any of the following:

| Signal | Status | Impact |
|---|---|---|
| `sitemap.xml` | **404 — does not exist** (no `app/sitemap.ts`) | Search engines have no authoritative URL list to discover/prioritize crawling; new recipes rely purely on internal links + being crawled from `/recepti`. |
| JSON-LD structured data | **None on any page** | Recipe pages are not eligible for Google Recipe rich results (star rating, cook time, calorie snippet in search results) — a major missed opportunity for a recipe site, where rich snippets meaningfully boost click-through rate. |
| `<link rel="canonical">` | **None on any page** | No protection against duplicate-content signals (e.g. `?page=2` vs `?page=2&x=y`, or the `/preview/[slug]` route). |
| Open Graph tags (`og:title`, `og:description`, `og:image`) | **None on any page** | Links shared on Facebook/WhatsApp/Viber (common in the Balkans) show no title, description, or image preview — this is likely actively hurting social referral traffic today. |
| Twitter Card tags | **None on any page** | Same issue for X/Twitter shares. |
| `<meta name="robots">` | **None set anywhere** — including `/preview/[slug]`, which has no `generateMetadata` at all | Not currently breaking anything (default is indexable), but the `/preview` route looks like it's meant to be a private preview and has nothing stopping it from being indexed if linked/crawled. |

**What is working correctly site-wide:**
- `<html lang="hr">` is set correctly.
- `<meta name="viewport">` is present and correct.
- Every single page (63/63) has exactly one `<h1>` — no missing or duplicate H1 issues.
- `robots.txt` exists and is fine — it's Cloudflare-managed (not in the repo), sets `Allow: /` for normal search bots (Googlebot etc. can crawl everything), and separately blocks known AI-training crawlers (GPTBot, Google-Extended, Bytespider, ClaudeBot, etc.) via Cloudflare's Content-Signal feature. This is a deliberate content-licensing choice, not a bug.

### `/recepti` pagination: duplicate metadata
All 6 pagination pages (`/recepti?page=1` through `?page=6`) serve **byte-identical** `<title>` and `<meta description>`:
```
<title>Slatko i fino - Recepti</title>
<meta name="description" content="Svi recepti za kolače i torte"/>
```
This is textbook duplicate-title/description territory — Google will likely treat these as near-duplicate pages and may not index all 6 distinctly.

---

## 2. The 9 example pages you listed — detailed findings

All 9 use the recipe template, so they inherit every site-wide issue above (no canonical, no OG/Twitter, no JSON-LD). Page-specific findings:

| Page | Title (len) | Meta description | H1 | Images / alt issues |
|---|---|---|---|---|
| `/recept/ledeno-carstvo` | "Slatko i fino - Ledeno carstvo" (30) | ⚠️ 1214 chars — raw recipe instructions used as meta description | "Ledeno carstvo" ✓ | 9 imgs, **4 with `alt="blob"`** |
| `/recept/cokoladna-torta` | "Slatko i fino - Čokoladna torta" (31) | ⚠️ 1653 chars — raw instructions | "Čokoladna torta" ✓ | 11 imgs, **6 with `alt="blob"`** |
| `/recept/boem-kocke` | "Slatko i fino - Boem kocke" (26) | ⚠️ 1048 chars — raw instructions | "Boem kocke" ✓ | 7 imgs, **2 with `alt="blob"`** |
| `/recept/langosi` | "Slatko i fino - Langoši" (23) | ⚠️ 911 chars — raw instructions | "Langoši" ✓ | 9 imgs, **4 with `alt="blob"`** |
| `/recept/osinja-gnijezda` | "Slatko i fino - OSINJA GNIJEZDA" (31) | ⚠️ 855 chars — raw instructions | "OSINJA GNIJEZDA" ✓ | 13 imgs, **8 with `alt="blob"`** |
| `/recept/djedov-brk` | "Slatko i fino - DJEDOV BRK" (26) | ⚠️ 1066 chars — raw instructions | "DJEDOV BRK" ✓ | 16 imgs, **11 with `alt="blob"`** |
| `/recept/kroasani-croissants` | "Slatko i fino - Kroasani - croissants" (37) | ⚠️ 1121 chars — raw instructions | "Kroasani - croissants" ✓ | 20 imgs, **15 with `alt="blob"`** |
| `/recept/cheesecake-u-casicama` | "Slatko i fino - Cheesecake u čašicama" (37) | ⚠️ 881 chars — raw instructions | "Cheesecake u čašicama" ✓ | 8 imgs, **3 with `alt="blob"`** |
| `/recept/breskvice-odlicne` | "Slatko i fino - BRESKVICE - Odlične" (35) | ⚠️ 1268 chars — raw instructions | "BRESKVICE - Odlične" ✓ | 7 imgs, **2 with `alt="blob"`** |

**Notable pattern: every single one of the 9 pages you listed has both the oversized-description problem *and* `alt="blob"` images.** That's not a coincidence worth ignoring — these look like they may be more recently-added or more recently-photographed recipes, and both issues trace back to the same root cause in the CMS workflow:
- The meta description falls back to the recipe's `description` (cooking instructions) field whenever `seo_description` is left empty in Strapi — see `generateMetadata` in `src/app/(subpages)/recept/[slug]/page.tsx`. None of these 9 recipes have a `seo_description` filled in.
- `alt="blob"` happens when an image is uploaded to Strapi from a pasted/dragged blob URL and no one manually sets the media library's "alternative text" field afterward — it's a **content/CMS data gap**, not a template bug (the code does render whatever alt text Strapi provides).

---

## 3. All 61 recipes — aggregate findings

| Check | Result |
|---|---|
| Canonical / OG / Twitter / JSON-LD / robots meta | **0/61** have any of these (site-wide template gap, see §1) |
| H1 present, exactly one | **61/61** ✓ |
| Title length | 60/61 within a safe length; **1 over 60 chars** (Google may truncate): `/recept/jedostavan-i-brz-kolac-sa-komadicima-cokolade` (61 chars) |
| Meta description **>160 chars** (raw instructions used as description) | **24/61 (39%)** |
| Meta description **<50 chars total** (i.e. under ~30 chars of actual content — too short to be a useful search snippet) | **3/61**: `banana-kocke`, `brownie`, `jedostavan-i-brz-kolac-sa-komadicima-cokolade` |
| Meta description in the healthy 50–160 char range | 34/61 (56%) |
| Duplicate titles or duplicate descriptions across different recipes | **None found** — every recipe's title/description is unique |
| Images with literal `alt="blob"` | **78 images across 15/61 recipes (25%)** — full list in Appendix |
| Images with generic placeholder alt (e.g. `"Step N image"`) | 66 images across 14/61 recipes — from the hardcoded `alt={`Step ${index+1} image`}` in the instruction-step gallery (`recept/[slug]/page.tsx`) |
| Images with a missing `alt` attribute entirely | 0 — every `<img>` has *some* alt value, even if low quality |

**Takeaway:** the 39% of recipes with instructions-as-meta-description is the single highest-impact, easiest-to-fix content gap — it affects nearly 4 in 10 recipe pages and directly hurts how the site looks in Google search results (long, run-on snippets instead of an inviting one-liner).

---

## 4. Homepage & summary of priorities

Homepage (`https://slatkoifino.com/`) has correct `lang`, viewport, a single H1 ("Slatko I Fino"), title "Slatko i fino - Početna", description "Najbolji recepti za kolače i torte" — no structural problems, but it shares the site-wide gaps (no OG/Twitter preview image, no JSON-LD `WebSite`/`Organization` markup, no canonical).

**Ranked by likely impact (highest first) — for reference, not actioned in this pass:**
1. No `sitemap.xml` + no JSON-LD Recipe schema — biggest gap for organic search visibility and rich results.
2. No Open Graph/Twitter tags — actively hurts how every shared link looks on social platforms, and the data to fill it (`seo_title`, `seo_description`, cover image) is already fetched in `generateMetadata`.
3. 24 recipes (39%) using raw cooking instructions as the meta description — a content/CMS fix (fill in `seo_description`), not a code fix.
4. 78 images with `alt="blob"` across 15 recipes (including all 9 pages you listed) — a CMS content fix (set alt text on those media library assets).
5. Duplicate title/description across all `/recepti` pagination pages.
6. Minor: one title over 60 chars, 3 descriptions under 50 chars, homepage hero has hardcoded English alt text, instruction-step images use generic non-descriptive alt text.

---

## Appendix: all 61 recipe URLs audited

```
/recept/aurorine-mak-rolice, babka, banana-bread, banana-kocke, biskvitni-kolac-sa-sirom,
boem-kocke, boem-kocke-lijevane, breskvice, breskvice-odlicne, brownie, brza-pita,
brzi-kokos-kolac, buhtle, cheesecake-u-casicama, cokoladna-rum-rolada, cokoladna-torta,
crveno-crno-brdo, cupavci, dizani-kakao-kolac, djedov-brk, gumeni-kolac, integralni-kruh,
jakobove-kapice-skoljkice, jedostavan-i-brz-kolac-sa-komadicima-cokolade, jogurt-ustipci,
julka-snite, kokos-rolada-sa-kondenziranim-mlijekom, kokosascici-savrseni-moybpn6k,
kolac-sa-rogacem, koliko-toliko-pogacice-sa-sirom, krafini, kremsnite, kroasani-croissants,
kruh-od-bundeve, kuglof, langosi, ledeni-vjetar-moycestt, ledeno-carstvo,
lisnato-prhke-raffaello-kocke, lotus-biscoff-cheesecake-bez-pecenja, madarica-savrsena-moybht6k,
martinine-kikiriki-kocke, medene-prhke-kokos-kiflice, mramorni-kolac, muffini,
orah-ili-ljesnjak-limun-snite, orascici-moybufo7, osinja-gnijezda, pamuk-krafne,
posne-dizane-struce, potratna-potica, prhka-cokoladna-srca, raffaello-od-samo-2-sastojka,
slanci, socne-coko-kocke, subare, tiramisu, torta-monte, trostruki-uzitak,
vocna-torta-osvjezavajuceg-i-bogatog-okusa, waffle-vafli
```

Recipes with `alt="blob"` images: `boem-kocke` (2), `breskvice-odlicne` (2), `cheesecake-u-casicama` (3), `cokoladna-torta` (6), `djedov-brk` (11), `kokosascici-savrseni-moybpn6k` (1), `kremsnite` (4), `kroasani-croissants` (15), `langosi` (4), `ledeni-vjetar-moycestt` (1), `ledeno-carstvo` (4), `madarica-savrsena-moybht6k` (10), `orascici-moybufo7` (1), `osinja-gnijezda` (8), `vocna-torta-osvjezavajuceg-i-bogatog-okusa` (6).

# The Library — publishing guide and weekly routine

The Library (`buildyourdigitalcity.com/library`) is the site's collection of
plain-English breakdowns of how online businesses actually work. Each week's
newsletter issue goes out by email first, then gets republished here a few
days later as a permanent, searchable article.

## How it works

- Articles are Markdown files in `content/library/`. One file = one article.
  The file name is the URL: `content/library/how-lead-gen-works.md` →
  `/library/how-lead-gen-works`.
- The server turns them into real HTML pages, so Google can read the full
  text. They are not part of the React app.
- An article is live when `status: published` **and** its `date` has arrived.
  Set a future date to queue articles in advance.
- `/sitemap.xml` lists every live article automatically. `/robots.txt` points
  search engines to it.
- Every article ends with a newsletter signup (tagged in the database with the
  article's slug as its source) and, optionally, one recommended product.

## Publishing a new article

1. Copy `content/library/_template.md` to `content/library/<slug>.md`.
2. Fill in the fields at the top and write the article.
3. Commit and push. Hostinger pulls the change; restart the Node app if it
   doesn't pick it up within about 5 minutes (articles are cached for 5 minutes).
4. In Google Search Console, use **URL Inspection → Request indexing** on the
   new URL. It's optional, but it speeds up the first indexing.

## Weekly routine (about 2–3 hours)

| When | Task | Time |
|---|---|---|
| Monday | Write and send this week's newsletter issue in Kit | 60–90 min |
| Monday | Cut 3–5 short posts from the issue (TikTok, LinkedIn, X), each pointing to the signup or the Library | 30 min |
| Thursday | Republish last Monday's issue in the Library, with a search-friendly title and the product link | 15 min |
| Friday | Weekly scorecard (below) | 15 min |

### Weekly scorecard

Record these each Friday. A spreadsheet row per week is enough.

| Metric | Where to find it |
|---|---|
| New subscribers this week / total | Kit → Subscribers |
| Newsletter open rate and click rate | Kit → Broadcasts |
| Gumroad sales and revenue | Gumroad → Analytics |
| Library page views | Site analytics |
| Search impressions and clicks | Google Search Console → Performance |

What to watch in the first 8 weeks: subscriber growth and clicks on product
links. Search traffic usually takes 2–3 months to show up for a new section.

## First four weeks

Each topic is written to answer a question people actually search for, and
each points to one product.

| Week of | Topic (newsletter + Library article) | District | Product link |
|---|---|---|---|
| Nov 30 | How affiliate websites actually make money | Attention & Media | Owner vs Renter Assessment |
| Dec 7 | How lead generation businesses get paid (pay-per-lead vs retainer) | Attention & Media | Owner vs Renter Assessment |
| Dec 14 | Selling digital products: what really happens between "buy" and "download" | E-Commerce & Retail | Portfolio Blueprint, once live on Gumroad |
| Dec 21 | Year-end: the owner-or-renter audit of your own income streams | City Planning | Owner vs Renter Assessment |

The first article, "Owner or Renter? The One Question to Ask About Any Online
Income Stream", is already published and sets up the framework the later
articles refer back to.

## Revenue ladder

Free newsletter → $9 Owner vs Renter Assessment → $17 Portfolio Blueprint →
$39 The Digital City ebook. Only the $9 assessment is on Gumroad today.
Getting the $17 and $39 products live is the biggest single lever for revenue.

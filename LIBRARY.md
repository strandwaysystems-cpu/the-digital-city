# The Digital City — content plan and weekly routine

## How the pieces fit

| Piece | Job | Where |
|---|---|---|
| **TikTok, Instagram, X** | Get found. Short posts that tease each article. | @thedigitalcity · @buildyourdigitalcity · @bydigitalcity |
| **The Library** | The home base. Permanent articles that get found on Google. | buildyourdigitalcity.com/library |
| **The newspaper** (weekly email) | Bring people back. A short roundup in fixed sections. | Kit |
| **Gumroad products** | Earn now. One product linked at the end of each article. | buildyourdigitalcity.gumroad.com |
| **Affiliate links** | Earn later. Added to tool articles once you're approved. | Inside Library articles |

Each social post points to a Library article. Each article links to your
social accounts, the newspaper signup and one product. Each newspaper issue
leads with the newest article.

## What goes in the Library

| Type | Examples | Notes |
|---|---|---|
| **Yearly guides** | "Affiliate Marketing in 2027", "Selling Digital Products in 2027" | Update every December with the new year in the title and URL |
| **Idea lists** | "7 Semi-Passive Online Business Ideas to Try" | Best for social: each idea can be its own short video |
| **Tools & platforms** | "Best Platforms to Sell Digital Products", "Kit vs Beehiiv vs MailerLite" | Where affiliate links go later. Only review tools you've actually used. |

## First five weeks

| Week of | Article | Type | Product at the end |
|---|---|---|---|
| Nov 30 | Affiliate Marketing in 2027: What's Changed and What Still Works | Yearly guide | District Selector Worksheet (CA$9) |
| Dec 7 | 7 Semi-Passive Online Business Ideas to Try in 2027 | Idea list | Owner vs. Renter Self-Assessment (CA$17) |
| Dec 14 | The Best Platforms to Sell Digital Products in 2027 | Tools | The 90-Day Digital Property Builder (CA$79) |
| Dec 21 | Kit vs Beehiiv vs MailerLite: Which Newsletter Platform to Use | Tools | The Digital City Prompt Kit (CA$27) |
| Dec 28 | Your Year-End Owner-or-Renter Audit | Yearly guide | Owner vs. Renter Self-Assessment (CA$17) |

You've used all three newsletter platforms across your brands, so the Dec 21
comparison can draw on real experience. That firsthand detail is what makes
tool reviews trustworthy, and it's what Google rewards.

## Weekly routine (about 5 hours)

| Day | Task | Time |
|---|---|---|
| Monday | Write the week's Library article and publish it | 2 h |
| Tuesday | Fill in the newspaper template (`newsletter/issue-template.md`) and schedule it in Kit for Thursday | 1 h |
| Wednesday | Make 3 short posts from the article and schedule them on TikTok, Instagram and X | 1.5 h |
| Friday | Weekly scorecard (below) | 30 min |

### Weekly scorecard

| Metric | Where to find it |
|---|---|
| New newspaper subscribers / total | Kit → Subscribers |
| Open rate and click rate | Kit → Broadcasts |
| Gumroad product views and sales | Gumroad → Analytics (Claude can pull this) |
| Library page views | Site analytics |
| Search impressions and clicks | Google Search Console → Performance |
| Followers on TikTok, Instagram, X | Each app |

Search traffic usually takes 2–3 months to show up for a new section. In the
first 8 weeks, watch subscriber growth and clicks on product links.

## Publishing a Library article

1. Copy `content/library/_template.md` to `content/library/<slug>.md`.
   The file name becomes the URL: `affiliate-marketing-2027.md` →
   `/library/affiliate-marketing-2027`.
2. Fill in the fields at the top and write the article.
3. An article is live when `status: published` **and** its `date` has
   arrived. Set a future date to queue articles ahead of time.
4. Commit and push. Hostinger pulls the change. Articles are cached for
   5 minutes; restart the Node app if a change doesn't appear.
5. Optional: in Google Search Console, use **URL Inspection → Request
   indexing** on the new URL to speed up the first indexing.

The server turns articles into full HTML pages (not part of the React app)
so Google can read them. `/sitemap.xml` lists every live article
automatically, and `/robots.txt` points search engines to it.

## Affiliate links (later)

- Many tools you already use have affiliate or referral programs (for
  example Kit and Hostinger). Apply once a tool article is live and getting
  some traffic, since some programs review your site first.
- Any article with affiliate links needs a short disclosure near the top,
  e.g. *"Some links in this article are affiliate links. If you sign up
  through them I may earn a commission, at no extra cost to you."*

## Product ladder (Gumroad, as of 2026-11-27)

All nine products are published. Prices are in CAD.

| Step | Product | Price |
|---|---|---|
| Entry | The Invisible Economy | Pay what you want (suggested $1) |
| Low-cost tools | The Digital City Quick Reference | $7 |
| | District Selector Worksheet | $9 |
| | Owner vs. Renter Self-Assessment | $17 |
| | The Digital City Prompt Kit | $27 |
| Core | The 90-Day Digital Property Builder | $79 |
| | Digital Asset Valuation Toolkit | $97 |
| | The Digital City E-book | $99 |
| Top | Portfolio OS Worksheet | $127 |

Aug 1 to Nov 27, 2026: 52 product page views in total, all "direct", and
0 sales. The catalog is not the bottleneck; traffic is.

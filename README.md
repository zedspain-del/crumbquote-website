# CrumbQuote

An order page for custom cake and cookie bakers. Customers choose the size, flavor, design and extras, see the price instantly (worked out from the baker's own costs), and book a date with a card deposit. Dates close automatically when the baker is fully booked.

**Current stage:** a waitlist landing page to test demand before the app itself is built.

## Folder layout

| Path | What it is |
|---|---|
| `site/` | The website. This is the only folder you upload. |
| `site/index.html` | Home page: interactive order-page demo, features, dashboard preview, free price check, pricing, FAQ |
| `site/features.html` | Detailed features, plus the roadmap |
| `site/pricing.html` | Plans (founding and standard), monthly/yearly toggle, flat-price comparison, pricing FAQ |
| `site/about.html` | Mission, current stage and principles |
| `site/early-access.html` | The full sign-up form (the one Netlify detects) |
| `site/privacy.html` | Privacy policy for the waitlist |
| `site/404.html` | "Page not found" page (Netlify uses it automatically) |
| `site/styles.css`, `site/script.js`, `site/icons.svg` | Shared design system, behavior and icon set |
| `serve.ps1` | Local preview server (PowerShell; no Node or Python needed) |
| `README.md` | This file, including the market research |

Every email box on the site feeds the same Netlify form, `waitlist`. The `source` field records which page it came from (hero, cta, features, pricing or early-access).

## Preview on this computer

```
powershell -NoProfile -ExecutionPolicy Bypass -File serve.ps1
```

Then open http://localhost:8080. On localhost, sign-ups are simulated and nothing is saved.

## Put it online (free, about 15 minutes)

1. Create a free account at netlify.com.
2. Go to **Sites → Add new site → Deploy manually** and drag the `site` folder onto the page.
3. In the site's settings, open **Forms** and turn on **form detection** if it's off, then deploy the folder again.
4. Under **Forms → Form notifications**, add an email notification so you hear about each sign-up.
5. Optional: buy a domain (for example crumbquote.com, if it's available) and connect it under **Domain management**.

Sign-ups appear under **Forms → waitlist**, where you can export them as CSV.

## Before you share it publicly

- [ ] Replace `you@example.com` with your real contact email. It appears on every page, so use find-and-replace across the `site` folder.
- [ ] Check that the name and domain are free. I found no product called CrumbQuote, but check domains and trademarks yourself.
- [ ] Decide whether you're happy with the offer: $9/month, $90/year, 14-day trial, and **$6/month for founding bakers for as long as they stay subscribed**. That founding price is a promise, so only keep it if you'll honor it.
- [ ] Re-check competitors' current features (see below). The pitch rests on instant pricing and capacity limits, so confirm nobody already does exactly that.

## How to test demand (the next 2–3 weeks)

- **Goal:** at least 30 waitlist sign-ups from real bakers. If you get fewer than 10 after real effort, rethink the idea before building anything.
- **Where to share it:** home baker and cottage food Facebook groups, cake decorating communities, and baking business forums. Follow each group's self-promotion rules. Asking "how do you handle pricing questions?" first and then sharing the page works better than posting a link straight away.
- **Use the answers:** the form asks what they bake, how they take orders now, how many orders they get, and what annoys them most. Read every answer, because that's your product spec.
- **Talk to five bakers:** a 15-minute call with five waitlist sign-ups will teach you more than any survey.

## Market research (November 2026)

### What I found

1. **Plain pricing calculators are crowded and cheap.** At least ten recipe costing apps for home bakers exist, many launched in 2026 and with few reviews: BakeCost, Bake Margin, Portion Margin, Pastri, KitchenCost, CostMyDish, Whiskly AI, BakeValue, Baketly and others. Many are free, a one-time purchase, or about $3/month, and free web calculators (BatterSuite, Craftybase) are everywhere. **A standalone calculator would be hard to sell as a subscription.**
2. **Bakers do pay monthly for ordering tools.** Subscriptions of roughly $9–18/month already exist and get paid for:

   | Tool | Price | Focus |
   |---|---|---|
   | Cakery | from $8.99/mo | Bakery page, orders, Stripe deposits, local discovery |
   | MyCustomBakes | $10/mo or $110/yr | Custom and quote-based orders |
   | Homegrown | $10–12.50/mo | Market vendors and local preorders |
   | Bakesy | $9.99–17.99/mo | Phone-first storefront |
   | Hotplate | No subscription; 5% + $0.55 per order (usually paid by the customer) | Preorder "drops" |
   | CakeBoss | about $149 one-time plus a small yearly renewal | Desktop costing, orders and invoices |

3. **Most bakers still use DMs, texts, Google Forms, Jotform and Venmo.** The market is far from won.
4. **Bakers' main complaints:**
   - hours spent writing quotes for people who never order
   - anxiety about whether their prices are right
   - long back-and-forth over custom work
   - availability nobody can see, which leads to overbooking
   - chasing payments
   - unprofessional "DM me to order" checkouts
5. **Demand is growing.** Home food businesses are growing where states have loosened their rules. Minnesota registrations have risen every year since its 2015 law, Connecticut's home-food credentials nearly tripled after 2020, and more states are loosening restrictions in 2026. There is no reliable national count.

### Why CrumbQuote

It combines the two things bakers currently get from separate tools: **pricing from their own costs** and **a customer-facing order page**. The customer sees a real price while building the order, which tackles the biggest complaint, the "How much?" messages. Weekly capacity limits and deposits handle the other two big complaints. Pricing it at $9/month puts it alongside existing tools, which shows bakers will pay that much. Competitors mostly use quote-based forms where the baker still has to price each order by hand. This is the angle to verify before launch, as listed in the checklist above.

### Main risks

- **Getting customers is the hard part.** You have to reach bakers yourself, mainly through community groups.
- **Competitors could copy the instant pricing feature.** The defense is staying focused on custom bakers and listening closely to them.
- **The research is US-focused.** Fees, payment providers and cottage food rules differ in other countries.

### Sources

- [Cottage food software guide (The Food Corridor)](https://thefoodcorridor.com/blog/the-honest-guide-to-cottage-food-software-what-actually-works-and-how-to-pick-the-right-one/)
- [Cakery pricing](https://cakerybakeries.com/pricing)
- [Hotplate pricing](https://www.hotplate.com/pricing) and [help center](https://help.hotplate.com/en/articles/13707328-understanding-hotplate-s-pricing)
- [CakeBoss on Capterra](https://www.capterra.com/p/127935/CakeBoss/) and [SourceForge comparison](https://www.sourceforge.net/software/compare/BakeSmart-vs-CakeBoss)
- [BatterSuite on Product Hunt](https://www.producthunt.com/products/battersuite/reviews)
- [KitchenCost on AlternativeTo](https://alternativeto.net/software/kitchencost/about/)
- [Bakery software roundup (Guideflow)](https://www.guideflow.com/blog/bakery-software)
- [Micro Bakery Directory](https://microbakerydirectory.com/)
- Baker discussions: [Cake Central](https://www.cakecentral.com/forum/t/848501/people-are-asking-for-prices-and-i-am-stuck-please-help), [Baking Forums](https://www.baking-forums.com/threads/i-was-massively-undercharging-for-my-cakes-heres-what-i-learned.8303/)
- Market growth: [Minnesota cottage food data](https://mda.state.mn.us/food-feed/cottage-food-data), [Hartford Business Journal](https://hartfordbusiness.com/article/ct-sees-boom-in-cottage-food-businesses-health-clubs-dcp-data-shows/), [Axios, Oct 2026](https://www.axios.com/2026/10/23/home-micro-bakery-porch-stand)

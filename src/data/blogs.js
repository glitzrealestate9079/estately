// Blog articles published on the public-facing website.
//
// `body` is plain text with a light markdown-style convention the site's
// blog-body parser (src/lib/site/template/parse-blog-body.js) understands:
//   ## Heading            -> section heading (also becomes a table-of-contents entry)
//   > Quoted line          -> pull-quote
//   blank-line-separated   -> paragraphs
// This keeps the admin editing experience a single plain textarea instead
// of a structured block editor, while still giving the public site
// headings/quotes to render.
export const BLOGS = [
  {
    id: "BLG-2001",
    title: "10 Tips for First-Time Home Buyers in India",
    excerpt:
      "Buying your first home can feel overwhelming. Here's a practical checklist to help you navigate financing, paperwork and negotiation with confidence.",
    coverImage: "https://images.unsplash.com/photo-1580587771525-78b9dba3b914?q=80&w=1200&auto=format&fit=crop",
    author: "Priya Malhotra",
    publishedDate: "2026-08-12",
    status: "Published",
    body: `Buying your first home is one of the biggest financial decisions most people make, and in India's fast-moving property market it's easy to feel overwhelmed by paperwork, financing options and negotiation tactics. A little preparation goes a long way toward making the process feel manageable rather than stressful.

## Get your finances in order first

Before you start visiting properties, get a clear picture of your budget. Lenders typically finance up to 80% of a property's value, so you'll need the remaining 20% plus registration, stamp duty and moving costs as upfront savings. Check your credit score early — anything above 750 usually gets you the best interest rates — and get a home loan pre-approval so you know exactly what you can afford before you fall in love with a property you can't finance.

## Verify before you commit

Never skip due diligence. Confirm the project's RERA registration number and cross-check it on your state's RERA portal. Ask for the title deed, encumbrance certificate and occupancy certificate for resale properties, and have a lawyer review everything before you sign. A property that looks perfect in photos can carry legal complications that surface only after possession.

> A few hours of document verification upfront can save years of legal trouble later.

## Negotiate with information, not emotion

Research recent transaction prices in the locality — not just listing prices — so you know what similar homes have actually sold for. Sellers price in room to negotiate, and having comparable data gives you leverage. Don't let the excitement of "finding the one" push you into skipping inspections or accepting unfavourable payment terms.

Finally, budget for the full cost of ownership, not just the purchase price. Maintenance charges, property tax, and eventual resale considerations should all factor into your decision. A slightly smaller home in a well-managed society is often a better long-term investment than a larger one with poor upkeep.`,
  },
  {
    id: "BLG-2002",
    title: "Understanding RERA: What Every Buyer Should Know",
    excerpt:
      "RERA has transformed how real estate transactions work in India. Learn what protections it offers and how to verify a project's RERA registration.",
    coverImage: "https://images.unsplash.com/photo-1554224155-6726b3ff858f?q=80&w=1200&auto=format&fit=crop",
    author: "Arjun Nair",
    publishedDate: "2026-07-28",
    status: "Published",
    body: `The Real Estate (Regulation and Development) Act, better known as RERA, was introduced to bring transparency and accountability to a sector that had long been criticised for delays and opaque dealings. For buyers, understanding what RERA actually guarantees — and what it doesn't — is essential before signing on a new project.

## What RERA requires of developers

Every project above a certain size must be registered with the state's RERA authority before it can be marketed or sold. Registration requires developers to disclose the project layout, timeline, and land title, and to deposit 70% of buyer payments in a dedicated escrow account used only for that project's construction. This escrow requirement is what curbs developers from diverting funds to other projects, which was a major cause of stalled developments in the past.

## How to verify a RERA number

Every state maintains its own RERA portal where you can search a project by its registration number or the developer's name. The listing will show the promised possession date, the sanctioned layout plans, and any complaints filed against the project. Always cross-check the RERA number printed in a project's marketing material against the official portal — a mismatch, or a number that doesn't resolve to the project at all, is a serious red flag.

> RERA registration is not a quality guarantee — it's a transparency and accountability mechanism. Read the disclosed documents yourself.

## What RERA does not cover

RERA does not certify construction quality, nor does it validate a developer's claims about amenities beyond what's in the sanctioned plan. It also generally applies to under-construction projects rather than resale properties, so a resale flat won't have its own RERA number — only the original project does. Buyers should still independently verify documents, visit the site, and read the buyer-builder agreement carefully rather than relying on RERA registration alone.`,
  },
  {
    id: "BLG-2003",
    title: "Top 5 Localities to Invest in Jaipur in 2026",
    excerpt:
      "From Vaishali Nagar to Mansarovar Extension, we break down the Jaipur micro-markets offering the best appreciation potential this year.",
    coverImage: "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?q=80&w=1200&auto=format&fit=crop",
    author: "Kavita Singh",
    publishedDate: "2026-08-30",
    status: "Published",
    body: `Jaipur's real estate market has grown steadily as the city expands beyond its traditional core, with infrastructure projects and IT investment opening up new pockets for both end-users and investors. Here's a look at the micro-markets showing the strongest fundamentals this year.

## Vaishali Nagar

A long-time favourite for families, Vaishali Nagar continues to see steady demand thanks to established schools, hospitals and retail. Prices have plateaued compared to the rapid growth of a few years ago, which makes it a relatively stable rather than high-growth bet — a good fit for end-users prioritising liveability over appreciation.

## Mansarovar Extension

As Mansarovar itself has matured and prices have risen, Mansarovar Extension has absorbed much of the overflow demand, particularly from young families looking for larger homes at a lower entry price. Ongoing road-widening projects are improving connectivity to the main city, which should support price appreciation over the next few years.

## Jagatpura

Proximity to educational institutions and the ring road has made Jagatpura one of the fastest-growing residential corridors in the city. New apartment projects continue to launch here, and rental demand from students and young professionals keeps occupancy healthy.

> Localities near planned infrastructure — metro extensions, ring roads, IT parks — tend to outperform on price appreciation, even if the amenities aren't fully built out yet.

## Sitapura and Ajmer Road

Industrial and IT investment along Sitapura and the Ajmer Road corridor is driving commercial and residential growth in tandem. These areas suit investors with a longer time horizon, since infrastructure and social amenities are still catching up to the pace of new construction.

## What this means for buyers

None of these localities are risk-free bets, and Jaipur's market moves more slowly than metro cities. But buyers who match their choice to their actual goal — stability versus growth, end-use versus rental yield — tend to be more satisfied with their purchase a few years down the line than those chasing whichever locality is trending.`,
  },
  {
    id: "BLG-2004",
    title: "Home Loan vs Rent: Which Makes More Financial Sense?",
    excerpt:
      "We compare EMIs against average rentals across major metros to help you decide whether to buy now or continue renting.",
    coverImage: "https://images.unsplash.com/photo-1450101499163-c8848c66ca85?q=80&w=1200&auto=format&fit=crop",
    author: "Rohit Verma",
    publishedDate: "2026-06-15",
    status: "Published",
    body: `The rent-versus-buy question doesn't have a universal answer — it depends heavily on your city, timeline, and how you value flexibility against equity building. Here's a framework for thinking it through rather than a one-size-fits-all verdict.

## Compare the actual monthly cash outflow

An EMI on a home loan and a monthly rent aren't directly comparable numbers, because the EMI also builds equity while rent doesn't. Still, calculating the gap matters: in most major Indian metros, EMIs for a comparable home run 40-60% higher than rent for a similar unit, once you factor in the down payment's opportunity cost. If that gap is small in your city, buying tends to make more sense sooner.

## Factor in the price-to-rent ratio

A useful shortcut is the price-to-rent ratio — a property's price divided by its annual rent. A ratio under 15 generally favours buying, while a ratio above 20 tends to favour renting and investing the difference elsewhere. Ratios vary significantly by city and even by locality within a city, so this is worth calculating for your specific target property rather than assuming a national average applies.

> Buying rarely makes sense if you expect to relocate within three to four years — transaction costs alone can erase any equity gained.

## Don't ignore the hidden costs of ownership

Maintenance, property tax, society charges and the eventual cost of resale (including brokerage) all add up, and are easy to underestimate when comparing EMI to rent. A realistic comparison should build in at least 1-1.5% of the property value per year for upkeep and taxes.

## The honest answer

If you're confident you'll stay in a city for 5+ years, have stable income, and the price-to-rent ratio in your target locality is reasonable, buying usually wins over that horizon. If your job or life situation is still in flux, renting and investing the difference gives you flexibility that's hard to put a number on but is genuinely valuable.`,
  },
  {
    id: "BLG-2005",
    title: "A Complete Guide to Property Verification Documents",
    excerpt:
      "Title deeds, encumbrance certificates, occupancy certificates and more — here's every document you should check before you sign.",
    coverImage: "https://images.unsplash.com/photo-1554995207-c18c203602cb?q=80&w=1200&auto=format&fit=crop",
    author: "Sneha Pillai",
    publishedDate: "2026-09-02",
    status: "Published",
    body: `Document verification is the least glamorous part of buying property, and also the part most likely to save you from a costly mistake. Here's what to check and why each document matters.

## Title deed and chain of title

The title deed proves the seller's ownership. For resale properties, ask for the full chain of title going back at least 12-15 years to confirm the property has changed hands legitimately each time. Any gap or inconsistency in the chain is worth having a lawyer investigate before you proceed.

## Encumbrance certificate

This certificate, available from the local sub-registrar's office, confirms the property is free of unpaid loans, mortgages or legal disputes. Always request one covering the past 12-15 years, and cross-check that no encumbrance was registered against the property that the seller hasn't disclosed.

## Occupancy and completion certificates

For a completed building, the occupancy certificate (OC) confirms the local authority has verified the construction matches sanctioned plans and is safe to inhabit. Buying a flat without an OC — even in a mostly-occupied building — carries real risk, since it can complicate utility connections, resale, and even legal occupancy status.

> No document substitutes for a lawyer's review. Templates and checklists help you ask the right questions, but a qualified property lawyer should verify the actual documents.

## RERA registration and sanctioned plan

For under-construction projects, verify the RERA registration number against the state portal and compare the sanctioned floor plan to what's being marketed — layouts sometimes shift between launch and completion. Any deviation should be disclosed and, ideally, reflected in an updated agreement.

## Property tax receipts and NOCs

Recent property tax receipts confirm dues are cleared, and society or building NOCs (no-objection certificates) confirm there's no pending dispute with the resident association. For apartments, also ask whether the building itself has any pending litigation, since that can affect individual units even if your specific seller's documents look clean.`,
  },
  {
    id: "BLG-2006",
    title: "How Vastu Shastra Influences Modern Home Design",
    excerpt:
      "Vastu principles are finding their way back into contemporary architecture. Here's how builders are blending tradition with modern layouts.",
    coverImage: "https://images.unsplash.com/photo-1583847268964-b28dc8f51f92?q=80&w=1200&auto=format&fit=crop",
    author: "Aditya Kapoor",
    publishedDate: "2026-05-20",
    status: "Draft",
    body: `Vastu Shastra, the traditional Indian system of architecture, continues to shape buyer preferences even in thoroughly modern apartment complexes. Rather than disappearing under contemporary design trends, Vastu principles have been quietly absorbed into how many Indian builders plan their layouts.

## Orientation still drives demand

Many buyers still specifically ask for east or north-facing units, believing they bring better light and positive energy — and builders have responded by pricing and marketing units accordingly. Even buyers who don't personally follow Vastu strictly often factor it into resale considerations, since it affects a meaningful share of the buyer pool.

## Kitchen and entrance placement

Vastu traditionally favours the kitchen in the south-east corner and the main entrance aligned with specific directions relative to the plot. Modern architects increasingly try to accommodate these preferences within efficient floor plans, sometimes offering mirrored unit layouts within the same tower so buyers can choose the orientation that suits them.

> The goal for most contemporary architects isn't strict Vastu compliance, but designing enough flexibility that Vastu-conscious buyers aren't excluded.

## Where modern design and tradition diverge

Not every Vastu principle translates neatly into space-efficient apartment design, particularly in compact urban plots. Many builders adopt what's sometimes called "Vastu-friendly" rather than "Vastu-compliant" design — incorporating the most commonly requested elements (entrance direction, kitchen placement) while making practical trade-offs elsewhere for natural light, ventilation and layout efficiency.

Whether or not a buyer personally follows Vastu, understanding which elements a project has prioritised can help set expectations — and, in a market where a meaningful share of buyers do care, it's a genuinely relevant factor in resale value.`,
  },
  {
    id: "BLG-2007",
    title: "Real Estate Market Trends to Watch in 2026",
    excerpt:
      "From tier-2 city growth to rising demand for gated communities, here are the trends shaping India's property market this year.",
    coverImage: "https://images.unsplash.com/photo-1449824913935-59a10b8d2000?q=80&w=1200&auto=format&fit=crop",
    author: "Neha Joshi",
    publishedDate: "2026-09-10",
    status: "Published",
    body: `India's property market continues to evolve as remote work, changing family structures and infrastructure investment reshape where and how people want to live. Here are the trends worth watching this year.

## Tier-2 cities are catching up

Cities like Jaipur, Indore, Lucknow and Coimbatore are seeing faster price appreciation than several metros, driven by improved connectivity, IT and manufacturing investment, and buyers priced out of metro markets relocating for better value. This shift is also drawing developer attention, with several national builders launching their first projects in these cities.

## Gated communities and integrated townships

Demand for gated communities with in-built amenities — schools, healthcare, retail — continues to rise, particularly among families prioritising security and convenience over proximity to a city centre. Integrated townships on city peripheries are increasingly positioned as self-contained neighbourhoods rather than purely residential developments.

## Smaller households, more compact homes

Nuclear family structures and rising urban land costs are pushing developers toward more efficient, compact unit designs — well-planned 2 and 3 BHK units are outselling larger configurations in most markets, with buyers favouring smart layouts over sheer square footage.

> The buyers driving 2026's market aren't just looking for space — they're looking for spaces that fit how they actually live and work.

## Sustainability features are becoming a differentiator

Rainwater harvesting, solar provisions, and energy-efficient design are shifting from marketing add-ons to genuine buyer considerations, particularly among younger buyers who factor long-term utility costs into their purchase decision.

## What this means for buyers and investors

Markets are becoming more segmented — what works in a metro core doesn't necessarily apply to a tier-2 city or a peripheral township. Buyers who research their specific micro-market rather than relying on national headlines tend to make better-informed decisions in this more fragmented landscape.`,
  },
  {
    id: "BLG-2008",
    title: "Renting vs Buying in Metro Cities: A Cost Comparison",
    excerpt:
      "A city-by-city breakdown of rental yields, price-to-rent ratios and long-term costs to help you plan your next move.",
    coverImage: "https://images.unsplash.com/photo-1521791136064-7986c2920216?q=80&w=1200&auto=format&fit=crop",
    author: "Vikram Desai",
    publishedDate: "2026-04-18",
    status: "Draft",
    body: `Rental yields and price-to-rent ratios vary meaningfully across India's major metros, and that variation should shape how you think about renting versus buying in each city.

## Why the same decision plays out differently by city

Mumbai and Bengaluru tend to have among the highest property prices relative to rents, which pushes the price-to-rent ratio up and makes renting comparatively more attractive purely on cost grounds, even though both cities also have strong long-term appreciation stories in specific micro-markets. Cities like Ahmedabad and Pune tend to show more balanced ratios, where buying breaks even with renting over a shorter horizon.

## Rental yields tell only part of the story

A high rental yield suggests renting is expensive relative to buying, which sounds like a case for buying — but yields also reflect a city's supply-demand dynamics, including job market strength and inbound migration. A city with strong rental demand may also see strong price appreciation, meaning the yield alone won't tell you whether buying now is well-timed.

> Compare cities on price-to-rent ratio, not on price alone — an "expensive" city can still be a reasonable place to buy if rents are proportionally even higher.

## Factoring in career mobility

Metro cities also see more inter-city job mobility than smaller markets, which raises the bar for buying to make sense — the multi-year holding period needed to offset transaction costs is harder to guarantee when career moves are more frequent. This is one reason renting remains the default for many professionals in their first several years in a metro, even when they can technically afford a down payment.

## The bottom line

There's no single "right" metro for buying versus renting — the math depends on your specific city, locality, and how confident you are in your multi-year plans. Running the price-to-rent calculation for your actual target property, rather than relying on city-wide averages, will give you a far more useful answer than any general rule of thumb.`,
  },
];

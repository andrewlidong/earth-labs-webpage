# earth-labs

**Subsurface data, unlocked.** An AI agent that turns the PDFs sitting in exploration archives into structured, queryable data — with zero changes to how teams collect or store it.

---

## The problem

Exploration companies sit on decades of subsurface knowledge locked in PDFs: well headers, core descriptions, completion reports, survey documentation. Today the options are bad — hire $250K+ ML engineers to build one-off parsers, pay for a multi-month digitization service engagement, or let the data stay dead. Meanwhile every drilling decision that ignores the archive is a more expensive decision.

## The product

A monthly-licensed AI agent you point at a file server. It classifies each document, extracts structured data with domain-aware validation (physics-plausibility checks on depths, coordinates, and units — not just OCR), and loads it into a queryable store. Ask it questions in plain English: *"every well in this basin with sonic and density logs below 2,000 m."*

**v1 scope, stated plainly:** text-and-table documents — well headers, core and cuttings descriptions, survey reports, completion reports — output as clean JSON in OSDU-compatible schemas. Your legacy archive becomes OSDU-ready without a migration project. Raster log-curve digitization is on the roadmap, not in v1; we'd rather under-promise there than fail a pilot.

## Why now, and why not the incumbents

Katalyst and traditional digitization vendors sell multi-month service engagements; generic document-AI (Azure, Reducto) parses text but doesn't know that a porosity of 85% in a granite is an extraction error. We sit in the gap: agentic end-to-end (file server in, answers out), domain-aware validation, SaaS pricing at a fraction of a single hire, live in days. The OSDU standard is our distribution wedge, not our competitor — we're the fastest path from a legacy archive to OSDU-shaped data.

## Your data stays yours

**By default, customer data trains nothing.** The product deploys into your VPC or on-prem; extracted data and source documents never leave your environment and are never used for model training. Customers who want to can opt into discounted licensing in exchange for data-contribution rights — but that is a separate, explicit agreement, never a default.

## The long game

Our foundation-model research arm (JENNIFER-H2, led by our Chief Scientist under Norwegian Research Council-funded open-science work) is building the first multi-modal foundation model of the Earth's crust — trained on the **public** petabyte-scale archives: DISKOS, IODP, NAMSS, EPOS. The commercial agent and the open model compound: every document type we learn to parse for customers makes the public-data ingestion pipeline better, and every improvement in the model's geological priors makes extraction validation smarter. The moat isn't customer data — it's being the only team with both the harmonized public corpus and a paid reason to build best-in-class extraction on top of it. Over time, customers get x-ray vision into the subsurface, queryable as easily as ChatGPT.

## Business model

SaaS licenses, priced at a fraction of what a single ML hire costs. No integration project, no workflow changes. Land with the archive agent; expand into prospectivity screening and drill-target prioritization as the foundation model matures — the products natural-hydrogen, geothermal, and critical-minerals explorers are already asking for.

## Traction

Validated directly with ExploreTech, a Silicon Valley drilling-tech startup, whose head of data said he'd buy this today — converting now to a paid design partnership. Seeking two additional design partners across E&P and mining.

## Team

**John M. Aiken** — Chief Scientist. PhD, ML; PI on Norwegian Research Council-funded subsurface AI projects (SerpRateAI); track record building large-scale multi-modal geoscience databases.
**Andrew Dong** — Engineering. Full-stack engineer (Recurse Center, University of Chicago).
Academic advisors at UT Austin (Institute for Geophysics), UT Physics, and Utrecht Geosciences.

---

*earth-labs.ai · hello@earth-labs.ai*

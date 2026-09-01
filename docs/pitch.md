# earth-labs

**Subsurface data, unlocked.** An AI agent that turns the PDFs sitting in exploration archives into structured, queryable data — with zero changes to how teams collect or store it.

---

## The problem

Exploration companies sit on decades of subsurface knowledge locked in PDFs: well headers, core descriptions, completion reports, survey documentation. Today the options are bad — hire $250K+ ML engineers to build one-off parsers, pay for a multi-month digitization service engagement, or let the data stay dead. Meanwhile every drilling decision that ignores the archive is a more expensive decision.

## The product

A monthly-licensed AI agent you point at a file server. It classifies each document, extracts structured data with domain-aware validation (physics-plausibility checks on depths, coordinates, and units — not just OCR), and loads it into a queryable store. Ask it questions in plain English: *"every well in this basin with sonic and density logs below 2,000 m."*

**v1 scope, stated plainly:** text-and-table documents — well headers, core and cuttings descriptions, survey reports, completion reports — output as clean JSON in OSDU-compatible schemas. Your legacy archive becomes OSDU-ready without a migration project. Raster log-curve digitization is on the roadmap, not in v1; we'd rather under-promise there than fail a pilot.

## Why now, and why not the incumbents

Katalyst and traditional digitization vendors sell multi-month service engagements; generic document-AI (Azure, Reducto) parses text but doesn't know that a porosity of 85% in a granite is an extraction error. earth-labs sits in the gap: agentic end-to-end (file server in, answers out), domain-aware validation, SaaS pricing at a fraction of a single hire, live in days. The OSDU standard is our distribution wedge, not our competitor — we're the fastest path from a legacy archive to OSDU-shaped data. And frontier models crossed the threshold this year: native PDF understanding plus schema-constrained output means the extraction layer that used to take an ML team is now an engineering product — the advantage goes to whoever encodes the domain validation and ships first.

## Your data stays yours

**By default, customer data trains nothing.** The product deploys into your VPC or on-prem; extracted data and source documents never leave your environment and are never used for model training. Customers who want to can opt into discounted licensing in exchange for data-contribution rights — but that is a separate, explicit agreement, never a default.

## The long game

The archive agent is also a data strategy. The public subsurface archives — DISKOS, IODP, NAMSS, EPOS, BOEM — hold tens of petabytes of open data in exactly the formats our customers' archives do. Every document type the agent learns to parse for a paying customer also works on the public record, and we run it there: the result is the largest harmonized, structured corpus of open subsurface data anywhere. Customer data never enters that corpus. On top of it we build the products explorers are already asking for — regional prospectivity screening and drill-target prioritization for natural hydrogen, geothermal, and critical minerals. The moat compounds from both sides: paying customers make the extraction best-in-class, and the open corpus makes earth-labs the default place to ask questions about the subsurface.

## Business model

SaaS licenses, priced at a fraction of what a single ML hire costs. No integration project, no workflow changes. Land with the archive agent; expand into screening and targeting products as the structured corpus grows.

## Traction

Early validation from ExploreTech, a Silicon Valley drilling-tech startup, whose head of data said he'd buy this today. Seeking two additional design partners across E&P and mining.

## Team

**Andrew Dong** — Founder. Full-stack engineer; formerly Rubrik; Recurse Center; University of Chicago. Building the agent hands-on and recruiting domain advisors in subsurface geoscience.

---

*earth-labs.ai · hello@earth-labs.ai*

import type { Metadata } from "next";
import Link from "next/link";
import Footer from "../components/Footer";

export const metadata: Metadata = {
  title: "research · jennifer-h2 · earth-labs.ai",
  description:
    "JENNIFER-H2: a joint-embedding foundation model for the Earth's crust. Architecture, data, benchmarks, team.",
};

export default function ResearchPage() {
  return (
    <main className="min-h-screen bg-[var(--bg)] text-fg">
      {/* top instrument strip */}
      <div className="border-b hairline bg-[var(--bg-elev)] px-6 md:px-10 py-2 flex items-center gap-3 text-mono text-[10px] uppercase tracking-widest text-fg-mute">
        <Link
          href="/"
          className="text-fg-dim hover:text-accent transition-colors"
        >
          ← earth-labs
        </Link>
        <span
          className="flex-1 border-t border-dashed opacity-50"
          style={{ borderColor: "var(--border-strong)" }}
          aria-hidden
        />
        <span>research / proposal · v0.10 · march 2026</span>
      </div>

      {/* hero */}
      <section className="border-b hairline px-6 md:px-10 py-20 md:py-28 max-w-6xl mx-auto">
        <div className="label mb-6">§ 00 abstract</div>
        <h1 className="font-mono text-3xl md:text-5xl tracking-[-0.03em] leading-[1.05] text-fg mb-8">
          jennifer-h2{" "}
          <span className="text-fg-dim">
            — a joint-embedding foundation model for the Earth&apos;s crust.
          </span>
        </h1>
        <div className="text-mono text-[11px] uppercase tracking-widest text-fg-mute mb-8">
          joint embedding neural network interpolation for earth resources · h2
        </div>
        <div className="space-y-5 text-fg-dim text-base md:text-lg leading-relaxed max-w-3xl">
          <p>
            Beneath observable geophysical measurements lies a lower-dimensional
            manifold of latent geological processes. JENNIFER-H2 is a
            self-supervised, multi-modal foundation model that learns this
            manifold from petabyte-scale, real-world subsurface data — seismic
            volumes, borehole logs, gridded gravity and magnetics, heat flow,
            and free-text geological descriptions — and exposes it as a
            continuous embedding space.
          </p>
          <p>
            Inspired by{" "}
            <span className="text-fg">
              Joint Embedding Predictive Architectures (JEPA)
            </span>
            , the model is trained to predict the latent representation of
            masked subsurface regions rather than their raw pixel values. This
            yields stable, physically meaningful descriptors that survive
            acquisition noise and survey artifacts, and it enables{" "}
            <span className="text-fg">probabilistic zero-shot inversion</span>{" "}
            of subsurface properties — a task that is otherwise intractable.
          </p>
          <p>
            The first benchmark application is natural (&quot;white&quot;)
            hydrogen — a zero-carbon primary energy source generated
            continuously by serpentinization and radiolysis. Hydrogen
            exploration is chosen as the first benchmark precisely because it
            presents the greatest density of unsolved subsurface problems:
            sparse observations, ephemeral signals, and no established
            exploration workflow. Any model that performs well under these
            conditions will naturally generalize to better-constrained
            subsurface tasks — geothermal, critical minerals, carbon storage,
            conventional imaging.
          </p>
        </div>
        <div className="mt-10 flex flex-wrap items-center gap-x-6 gap-y-3 text-mono text-[11px] uppercase tracking-widest">
          <a
            href="/jennifer-h2.pdf"
            className="text-accent hover:text-accent-hot transition-colors inline-flex items-center gap-2"
          >
            ↓ download proposal · pdf · 1.2&nbsp;mb
          </a>
          <span className="text-fg-mute">11 pages · 47 references</span>
        </div>
      </section>

      {/* objectives */}
      <Block num="01" label="objectives">
        <h2 className="font-mono text-2xl md:text-4xl tracking-[-0.03em] leading-[1.1] text-fg">
          two scientific objectives.{" "}
          <span className="text-fg-dim">
            framed around natural hydrogen and its subsurface expression.
          </span>
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-px bg-[var(--border)] border hairline mt-2">
          <ObjCard
            tag="so1"
            title="zero-shot prediction with quantified uncertainty"
            body="Predict hydrogen system components — sources, reservoirs, seals, migration pathways — across diverse geological settings. Confidently abstain when extrapolating beyond the training manifold. Drilling decisions involve multi-million-euro investments; calibrated uncertainty is non-negotiable."
          />
          <ObjCard
            tag="so2"
            title="universal geophysical embeddings"
            body="A latent space general enough that simple downstream models — logistic regressors, shallow nets, random forests — recover state-of-the-art performance on hydrogen prospectivity, geothermal assessment, and critical mineral prediction with minimal task-specific fine-tuning."
          />
        </div>
      </Block>

      {/* architecture */}
      <Block num="02" label="architecture">
        <h2 className="font-mono text-2xl md:text-4xl tracking-[-0.03em] leading-[1.1] text-fg">
          asymmetric encoder–predictor.{" "}
          <span className="text-fg-dim">
            jepa-style training in latent space, not pixel space.
          </span>
        </h2>
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 mt-2">
          <div className="lg:col-span-7 space-y-5 text-fg-dim leading-relaxed">
            <p>
              The encoder <Mono>f_θ</Mono> processes only the{" "}
              <span className="text-fg">visible</span> patches of a multi-modal
              input — colocated borehole logs, seismic traces, gridded gravity
              and magnetic anomalies, text descriptions. A lightweight predictor{" "}
              <Mono>g_φ</Mono> then predicts the latent representation of the{" "}
              <span className="text-fg">masked</span> regions, conditioned on
              the visible context and a small latent <Mono>z</Mono> capturing
              residual uncertainty.
            </p>
            <p>
              The encoder is intentionally substantially larger than the
              predictor: at inference time, the encoder is what transfers to
              downstream tasks, while the predictor is discarded. This shape
              encourages the encoder to learn rich, transferable descriptors
              rather than survey-specific shortcuts.
            </p>
            <p>
              Predicting in latent space — rather than reconstructing raw
              measurements — is the critical design choice. It avoids
              overfitting to acquisition noise, polarity conventions, and
              vintage-specific artifacts that are abundant in real subsurface
              data and would dominate any pixel-level reconstruction loss.
            </p>
          </div>

          <div className="lg:col-span-5">
            <div className="bg-[var(--bg-elev)] border hairline p-5">
              <JEPADiagram />
            </div>
            <div className="text-mono text-[10px] uppercase tracking-widest text-fg-mute mt-3">
              fig. 1 · jepa pipeline · adapted from assran et al. 2023
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-px bg-[var(--border)] border hairline mt-10">
          <SpecCard
            label="masking strategy"
            body="modality-specific. natural images tolerate 75%, video 90%, sea-surface temperature 80%; the LILY borehole dataset becomes unstable above 20%. JENNIFER will run systematic ablations on hydrogen-fertile ultramafic provinces and adopt a curriculum that increases masking as the encoder stabilizes."
          />
          <SpecCard
            label="multi-modal fusion"
            body="modality-specific patch/token embeddings — separate encoders for seismic, borehole logs, gridded geophysical fields, and text-based lithology — followed by fusion blocks that operate in the shared latent space. early curriculum: predict masked logs from logs + local seismic. later: predict logs from global gravity and magnetics + sparse seismic."
          />
          <SpecCard
            label="release plan"
            body="model weights on huggingface. globally-evaluated embeddings released as a continuous subsurface feature dataset, mirroring the AlphaEarth release pattern, so other groups can build hydrogen and subsurface applications on top of JENNIFER without retraining the foundation model."
          />
        </div>
      </Block>

      {/* data */}
      <Block num="03" label="data">
        <h2 className="font-mono text-2xl md:text-4xl tracking-[-0.03em] leading-[1.1] text-fg">
          tens of petabytes,{" "}
          <span className="text-fg-dim">
            spanning four open subsurface databases plus globally continuous
            geophysical context fields.
          </span>
        </h2>

        <div className="text-fg-dim leading-relaxed max-w-3xl mb-10">
          A core challenge of WP1 is reducing the raw archive — tens of
          petabytes across SEG-Y, LAS, DLIS, miniSEED, and CSV variants — to a
          quality-controlled, harmonized training set comparable in size to
          modern multi-modal vision corpora (hundreds of terabytes). An AI
          ingestion agent will parse format variants, run physics-based
          plausibility checks, and flag anomalies for human review; it doubles
          as a natural-language interface to the constructed database.
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-px bg-[var(--border)] border hairline">
          <DataSource
            tag="diskos"
            title="norwegian offshore directorate"
            scale="12,601 wellbores · 5,817 seismic surveys"
            note="public repository · north sea coverage · seg-y + las"
          />
          <DataSource
            tag="iodp · lily"
            title="international ocean discovery program"
            scale="petabyte-scale ocean borehole record"
            note="ocean drilling cores · log data · iodp lims"
          />
          <DataSource
            tag="namss"
            title="national archive of marine seismic surveys"
            scale="continental-scale us coverage"
            note="usgs · seg-y volumes · all major basins"
          />
          <DataSource
            tag="epos"
            title="european plate observing system"
            scale="european coverage · multidisciplinary"
            note="seismicity · geomagnetism · geodesy · in-situ"
          />
        </div>

        <div className="mt-10">
          <div className="label mb-4">globally continuous context fields</div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-px bg-[var(--border)] border hairline">
            <FieldCard label="gravity" body="grace / goce satellite anomalies" />
            <FieldCard label="magnetics" body="emag2v3 global anomaly grid" />
            <FieldCard label="topo · bathy" body="macferrin et al. 2025" />
            <FieldCard label="crustal model" body="pasyanos et al. 2014" />
          </div>
        </div>
      </Block>

      {/* benchmarks */}
      <Block num="04" label="benchmarks">
        <h2 className="font-mono text-2xl md:text-4xl tracking-[-0.03em] leading-[1.1] text-fg">
          two focused tasks.{" "}
          <span className="text-fg-dim">
            spatial cross-validation across geologically-distinct provinces.
          </span>
        </h2>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-px bg-[var(--border)] border hairline mt-2">
          <Benchmark
            tag="bt1"
            title="continental hydrogen prospectivity"
            body="given JENNIFER embeddings on a grid across europe and the united states, can a simple downstream model predict the composite chance-of-sufficiency (cos) score for hydrogen prospectivity? compared against (i) a raw-indicator baseline, (ii) zero-shot embeddings, (iii) embeddings + 1/5/10 labeled high-prospectivity locations per country."
            metric="auc · binary classification · spatial cv across countries"
          />
          <Benchmark
            tag="bt2"
            title="hydrogen seep location prediction"
            body="given embeddings on a 50 km grid around documented seeps, can a shallow classifier predict the seep cell from the spatial pattern of embeddings alone? trained on, e.g., balkan ophiolites; held out on scandinavian cratonic seeps."
            metric="precision–recall auc · highly imbalanced positives"
          />
        </div>
      </Block>

      {/* compute */}
      <Block num="05" label="compute">
        <h2 className="font-mono text-2xl md:text-4xl tracking-[-0.03em] leading-[1.1] text-fg">
          tacc horizon.{" "}
          <span className="text-fg-dim">
            4,000 nvidia h100 gpus, ib interconnect.
          </span>
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-px bg-[var(--border)] border hairline mt-2">
          <SpecCard
            label="primary allocation"
            body="dedicated allocation on TACC's Horizon supercomputer, sited adjacent to UTIG. 4,000 H100s + IB fabric. JENNIFER's training requirements would saturate any norwegian compute resource; co-locating training with the U.S. partnership unblocks scale."
          />
          <SpecCard
            label="academic grant"
            body="NVIDIA Academic Grant — call for proposals: simulation and modeling — providing up to 30,000 H100 GPU-hours. complementary to the TACC allocation; covers ablations, fusion-strategy sweeps, and curriculum-learning experiments."
          />
          <SpecCard
            label="storage · ingestion"
            body="multi-petabyte staged ingest from IODP LIMS, DISKOS, NAMSS, EPOS into the TACC corral filesystem. ZFS-checksummed cold storage; warm tier of curated, harmonized training shards for the encoder."
          />
        </div>
      </Block>

      {/* team */}
      <Block num="06" label="project team">
        <h2 className="font-mono text-2xl md:text-4xl tracking-[-0.03em] leading-[1.1] text-fg">
          oslo · austin · utrecht.{" "}
          <span className="text-fg-dim">
            geophysics, hydrogen, critical minerals, ai/ml.
          </span>
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-px bg-[var(--border)] border hairline mt-2">
          <TeamCard
            name="John M. Aiken, PhD"
            role="principal investigator"
            inst="njord centre · university of oslo"
            note="ai + subsurface geophysics · prior pi of serprateai"
            href="https://johnspace.xyz/"
          />
          <TeamCard
            name="Thorsten Becker, PhD"
            role="co-investigator"
            inst="institute for geophysics · ut austin"
            note="geodynamics · plate tectonics · global modeling"
          />
          <TeamCard
            name="Dunyu Liu, PhD"
            role="co-investigator"
            inst="institute for geophysics · ut austin"
            note="computational seismology · earthquake physics"
          />
          <TeamCard
            name="William Gilpin, PhD"
            role="co-investigator"
            inst="department of physics · ut austin"
            note="machine learning · nonlinear dynamics"
          />
          <TeamCard
            name="Charlie Beard, PhD"
            role="co-investigator"
            inst="department of geosciences · utrecht university"
            note="natural hydrogen · serpentinization petrology"
          />
        </div>
        <div className="text-fg-mute text-mono text-[10px] uppercase tracking-widest mt-4">
          + postdoc · strong computing background · to be hired
        </div>
      </Block>

      {/* deliverables */}
      <Block num="07" label="deliverables">
        <h2 className="font-mono text-2xl md:text-4xl tracking-[-0.03em] leading-[1.1] text-fg">
          open by default.{" "}
          <span className="text-fg-dim">
            data, weights, embeddings, benchmark.
          </span>
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-px bg-[var(--border)] border hairline mt-2">
          <Deliverable
            wp="wp1"
            title="multi-modal training database"
            body="constructed corpus from IODP, DISKOS, NAMSS, EPOS, plus globally continuous context fields. python ingestion libraries. an LLM-backed agent for natural-language queries against the database. accessible through NIRD."
          />
          <Deliverable
            wp="wp2"
            title="trained jennifer-h2 model"
            body="at least one full-scale multi-modal model. weights hosted on huggingface. ablation suite quantifying masking ratio, fusion strategy, and JEPA vs. MAE training. globally-evaluated embeddings released as an AlphaEarth-style feature dataset."
          />
          <Deliverable
            wp="wp3"
            title="hydrogen benchmark suite"
            body="peer-reviewed benchmark paper (target: jgr solid earth, neurips main track). open-source evaluation code. trained baseline models. withheld test sets enabling future subsurface foundation models to report performance on the same benchmarks."
          />
          <Deliverable
            wp="wp1–3"
            title="application case study"
            body="real-world hydrogen exploration case study in a high-priority under-explored region (hungary, denmark, or poland) demonstrating improved targeting via JENNIFER embeddings."
          />
        </div>
      </Block>

      {/* footer-cta */}
      <section className="border-b hairline px-6 md:px-10 py-16 max-w-6xl mx-auto">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6">
          <div className="text-fg-dim max-w-2xl leading-relaxed">
            The complete proposal — including references, work-package
            timeline, and ethical-issues statement — is available as a single
            PDF.
          </div>
          <a
            href="/jennifer-h2.pdf"
            className="self-start md:self-auto border hairline px-5 py-3 text-mono text-[11px] uppercase tracking-widest text-accent hover:bg-[var(--bg-elev)] transition-colors inline-flex items-center gap-2"
          >
            ↓ download · jennifer-h2.pdf
          </a>
        </div>
      </section>

      <Footer />
    </main>
  );
}

/* — building blocks — */

function Block({
  num,
  label,
  children,
}: {
  num: string;
  label: string;
  children: React.ReactNode;
}) {
  return (
    <section className="border-b hairline">
      <div className="border-t hairline bg-[var(--bg-elev)] px-6 md:px-10 py-2 flex items-center gap-3 text-mono text-[10px] uppercase tracking-widest text-fg-mute">
        <span className="text-accent">§ {num}</span>
        <span className="text-fg-dim">{label}</span>
        <span
          className="flex-1 border-t border-dashed opacity-50"
          style={{ borderColor: "var(--border-strong)" }}
          aria-hidden
        />
      </div>
      <div className="relative max-w-6xl mx-auto px-6 md:px-10 py-16 md:py-24">
        <div
          aria-hidden
          className="pointer-events-none select-none absolute right-6 md:right-10 -top-2 md:-top-6 font-mono leading-none tracking-[-0.06em] text-fg"
          style={{ fontSize: "clamp(6rem, 14vw, 12rem)", opacity: 0.04 }}
        >
          {num}
        </div>
        <div className="relative space-y-8">{children}</div>
      </div>
    </section>
  );
}

function Mono({ children }: { children: React.ReactNode }) {
  return <span className="text-mono text-fg">{children}</span>;
}

function JEPADiagram() {
  // colors via CSS vars on the page theme
  const stroke = "var(--border-strong)";
  const fill = "var(--bg-card)";
  const fg = "var(--fg)";
  const dim = "var(--fg-dim)";
  const mute = "var(--fg-mute)";
  const accent = "var(--accent)";
  const mono = "ui-monospace, JetBrains Mono, Menlo, monospace";

  return (
    <svg
      viewBox="0 0 720 220"
      role="img"
      aria-label="JEPA architecture: context and target encoders feeding a predictor and loss"
      className="w-full h-auto"
    >
      <defs>
        <marker
          id="ja-arrow"
          viewBox="0 0 10 10"
          refX="9"
          refY="5"
          markerWidth="5"
          markerHeight="5"
          orient="auto"
        >
          <path d="M 0 0 L 10 5 L 0 10 Z" fill={fg} />
        </marker>
        <marker
          id="ja-arrow-dim"
          viewBox="0 0 10 10"
          refX="9"
          refY="5"
          markerWidth="5"
          markerHeight="5"
          orient="auto"
        >
          <path d="M 0 0 L 10 5 L 0 10 Z" fill={dim} />
        </marker>
      </defs>

      {/* Lane labels */}
      <g
        fontFamily={mono}
        fontSize="10"
        fill={mute}
        style={{ letterSpacing: "0.08em", textTransform: "uppercase" }}
      >
        <text x="20" y="32">context · visible</text>
        <text x="20" y="200">target · masked</text>
      </g>

      {/* Boxes — context lane */}
      <g fill={fill} stroke={stroke} strokeWidth="1">
        <rect x="20" y="42" width="90" height="36" rx="1" />
        <rect x="160" y="42" width="110" height="36" rx="1" />
        <rect x="320" y="42" width="110" height="36" rx="1" />
      </g>

      {/* Boxes — target lane (ema dashed) */}
      <g fill={fill} stroke={stroke} strokeWidth="1">
        <rect x="20" y="142" width="90" height="36" rx="1" />
      </g>
      <g fill={fill} stroke={stroke} strokeWidth="1" strokeDasharray="3 3">
        <rect x="160" y="142" width="110" height="36" rx="1" />
      </g>

      {/* Arrows — context lane (solid) */}
      <g stroke={fg} strokeWidth="1" fill="none">
        <line x1="110" y1="60" x2="158" y2="60" markerEnd="url(#ja-arrow)" />
        <line x1="270" y1="60" x2="318" y2="60" markerEnd="url(#ja-arrow)" />
        <line x1="430" y1="60" x2="555" y2="60" markerEnd="url(#ja-arrow)" />
        <path
          d="M 580 70 Q 595 90 600 95"
          markerEnd="url(#ja-arrow)"
        />
      </g>

      {/* Arrows — target lane (dashed for stop-gradient) */}
      <g stroke={dim} strokeWidth="1" fill="none">
        <line x1="110" y1="160" x2="158" y2="160" markerEnd="url(#ja-arrow-dim)" />
        <line
          x1="270"
          y1="160"
          x2="555"
          y2="160"
          strokeDasharray="3 3"
          markerEnd="url(#ja-arrow-dim)"
        />
        <path
          d="M 580 150 Q 595 130 600 125"
          strokeDasharray="3 3"
          markerEnd="url(#ja-arrow-dim)"
        />
      </g>

      {/* Loss node */}
      <circle
        cx="630"
        cy="110"
        r="28"
        fill="var(--bg)"
        stroke={accent}
        strokeWidth="1.4"
      />

      {/* Box labels */}
      <g fontFamily={mono} fontSize="11" fill={fg} textAnchor="middle">
        {/* context */}
        <text x="65" y="65">context</text>
        {/* encoder f_θ */}
        <text x="215" y="58">encoder</text>
        <text x="215" y="72" fill={dim}>
          f<tspan fontSize="9" dy="2">θ</tspan>
        </text>
        {/* predictor g_φ */}
        <text x="375" y="58">predictor</text>
        <text x="375" y="72" fill={dim}>
          g<tspan fontSize="9" dy="2">φ</tspan>
        </text>
        {/* target */}
        <text x="65" y="165">target</text>
        {/* ema enc f_ξ */}
        <text x="215" y="158">ema enc.</text>
        <text x="215" y="172" fill={dim}>
          f<tspan fontSize="9" dy="2">ξ</tspan>
        </text>
        {/* loss */}
        <text x="630" y="108" fill={accent}>
          L
        </text>
        <text x="630" y="120" fill={dim} fontSize="9">
          loss
        </text>
      </g>

      {/* Inline arrow labels */}
      <g
        fontFamily={mono}
        fontSize="10"
        fill={mute}
        textAnchor="middle"
        style={{ letterSpacing: "0.04em" }}
      >
        <text x="294" y="52">z_ctx</text>
        <text x="492" y="52">ẑ_target</text>
        <text x="412" y="152">z_target</text>
        <text x="412" y="174" fill={mute}>
          stop-grad
        </text>
      </g>
    </svg>
  );
}

function ObjCard({
  tag,
  title,
  body,
}: {
  tag: string;
  title: string;
  body: string;
}) {
  return (
    <div className="bg-[var(--bg)] p-6 md:p-8">
      <div className="text-mono text-[10px] uppercase tracking-widest text-accent mb-3">
        · {tag}
      </div>
      <div className="text-fg text-mono text-base mb-3">{title}</div>
      <div className="text-fg-dim text-sm leading-relaxed">{body}</div>
    </div>
  );
}

function SpecCard({ label, body }: { label: string; body: string }) {
  return (
    <div className="bg-[var(--bg)] p-5 md:p-6">
      <div className="label mb-3">{label}</div>
      <div className="text-fg-dim text-sm leading-relaxed">{body}</div>
    </div>
  );
}

function DataSource({
  tag,
  title,
  scale,
  note,
}: {
  tag: string;
  title: string;
  scale: string;
  note: string;
}) {
  return (
    <div className="bg-[var(--bg)] p-6">
      <div className="text-mono text-[10px] uppercase tracking-widest text-accent mb-2">
        · {tag}
      </div>
      <div className="text-fg text-mono text-base mb-2">{title}</div>
      <div className="text-fg text-sm mb-2">{scale}</div>
      <div className="text-fg-mute text-mono text-[11px] uppercase tracking-widest">
        {note}
      </div>
    </div>
  );
}

function FieldCard({ label, body }: { label: string; body: string }) {
  return (
    <div className="bg-[var(--bg)] p-4 md:p-5">
      <div className="text-fg text-mono text-sm mb-1">{label}</div>
      <div className="text-fg-mute text-mono text-[11px] uppercase tracking-widest leading-relaxed">
        {body}
      </div>
    </div>
  );
}

function Benchmark({
  tag,
  title,
  body,
  metric,
}: {
  tag: string;
  title: string;
  body: string;
  metric: string;
}) {
  return (
    <div className="bg-[var(--bg)] p-6 md:p-8">
      <div className="text-mono text-[10px] uppercase tracking-widest text-accent mb-3">
        · {tag}
      </div>
      <div className="text-fg text-mono text-base mb-3">{title}</div>
      <div className="text-fg-dim text-sm leading-relaxed mb-4">{body}</div>
      <div className="text-fg-mute text-mono text-[11px] uppercase tracking-widest pt-3 border-t hairline">
        {metric}
      </div>
    </div>
  );
}

function TeamCard({
  name,
  role,
  inst,
  note,
  href,
}: {
  name: string;
  role: string;
  inst: string;
  note: string;
  href?: string;
}) {
  return (
    <div className="bg-[var(--bg)] p-5 md:p-6">
      <div className="flex items-baseline justify-between gap-3">
        <div className="text-fg text-mono text-base">{name}</div>
        {href && (
          <a
            href={href}
            target="_blank"
            rel="noreferrer noopener"
            className="text-mono text-[10px] uppercase tracking-widest text-fg-mute hover:text-accent transition-colors"
          >
            ↗
          </a>
        )}
      </div>
      <div className="label mt-1.5">{role}</div>
      <div className="text-fg-dim text-sm mt-2">{inst}</div>
      <div className="text-fg-mute text-mono text-[11px] uppercase tracking-widest mt-3 leading-relaxed">
        {note}
      </div>
    </div>
  );
}

function Deliverable({
  wp,
  title,
  body,
}: {
  wp: string;
  title: string;
  body: string;
}) {
  return (
    <div className="bg-[var(--bg)] p-6">
      <div className="text-mono text-[10px] uppercase tracking-widest text-accent mb-2">
        · {wp}
      </div>
      <div className="text-fg text-mono text-base mb-3">{title}</div>
      <div className="text-fg-dim text-sm leading-relaxed">{body}</div>
    </div>
  );
}

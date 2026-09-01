import { Section } from "./Section";

export default function Model() {
  return (
    <Section
      id="model"
      num="02"
      label="the product"
      title={
        <>
          the archive agent{" "}
          <span className="text-fg-dim">
            — point it at your file server. get answers.
          </span>
        </>
      }
    >
      <div className="text-mono text-[11px] uppercase tracking-widest text-fg-mute mb-8">
        ingest · classify · extract · validate · query
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card label="in">
          any exploration pdf — well headers · core &amp; cuttings descriptions ·
          survey reports · completion reports. no integration project, no
          workflow changes.
        </Card>
        <Card label="agent" accent>
          classifies every document, extracts each fact into
          OSDU-compatible schemas, and runs physics-plausibility checks on
          every value — a porosity of 85% in granite gets{" "}
          flagged for review, not silently stored.
        </Card>
        <Card label="out">
          a queryable store you talk to in plain english:{" "}
          <span className="text-fg">
            &ldquo;every well in this basin with sonic and density logs below
            2,000&nbsp;m&rdquo;
          </span>{" "}
          — answered in seconds.
        </Card>
      </div>

      <div className="mt-8 flex flex-wrap items-center gap-x-6 gap-y-3 text-mono text-[11px] uppercase tracking-widest">
        <a
          href="mailto:hello@earth-labs.ai"
          className="text-accent hover:text-accent-hot transition-colors"
        >
          → request a pilot
        </a>
        <span className="text-fg-mute">
          deploys in your vpc · your data trains nothing
        </span>
      </div>
    </Section>
  );
}

function Card({
  label,
  children,
  accent = false,
}: {
  label: string;
  children: React.ReactNode;
  accent?: boolean;
}) {
  return (
    <div
      className={`border p-6 bg-[var(--bg-card)] card-hover ${
        accent ? "border-accent" : "hairline"
      }`}
    >
      <div
        className={`label mb-4 ${accent ? "text-accent" : ""}`}
      >
        {label}
      </div>
      <div className="text-fg-dim text-sm md:text-base leading-relaxed">
        {children}
      </div>
    </div>
  );
}

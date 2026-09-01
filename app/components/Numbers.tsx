import { Section } from "./Section";
import { Counter } from "./Counter";
import WorldMap from "./WorldMap";

const stats = [
  {
    headlineNode: (
      <>
        <Counter value={12601} duration={1600} />
      </>
    ),
    label: "public wellbores · diskos alone",
    sub: "one archive of many — iodp, namss, epos, boem, and every private file server",
  },
  {
    headlineNode: <Counter value={10} suffix="s of PB" duration={1400} />,
    label: "subsurface data worldwide",
    sub: "seg-y · las · dlis · scanned reports — most of it unqueryable today",
  },
  {
    headlineNode: <span>$250k+</span>,
    label: "the hire you don't make",
    sub: "structured extraction at a fraction of one ml engineer's salary",
  },
  {
    headlineNode: <Counter value={0} duration={800} />,
    label: "workflow changes",
    sub: "point at the file server · runs in your vpc · answers in days, not quarters",
  },
];

export default function Numbers() {
  return (
    <Section
      id="evidence"
      num="03"
      label="why now"
      title={
        <>
          <span className="text-fg-dim">the archive problem,</span> by the
          numbers.
        </>
      }
    >
      <div className="mb-10">
        <WorldMap />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-px bg-[var(--border)]">
        {stats.map((s) => (
          <div
            key={s.label}
            className="bg-[var(--bg)] p-6 card-hover border border-transparent"
          >
            <div className="font-mono text-4xl md:text-5xl tracking-[-0.04em] text-fg">
              {s.headlineNode}
            </div>
            <div className="label mt-4">{s.label}</div>
            <div className="text-fg-dim text-[12px] mt-2 leading-relaxed">
              {s.sub}
            </div>
          </div>
        ))}
      </div>
    </Section>
  );
}

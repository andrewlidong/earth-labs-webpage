import { Section } from "./Section";
import { Counter } from "./Counter";
import WorldMap from "./WorldMap";

const stats = [
  {
    headlineNode: (
      <>
        <Counter value={25} suffix="+ PB" duration={1500} />
      </>
    ),
    label: "subsurface corpus",
    sub: "200,000+ boreholes · all major basins · unified",
  },
  {
    headlineNode: <Counter value={0.86} decimals={2} duration={1600} />,
    label: "R² · data reconstruction",
    sub: "vs. lasso baseline 0.24 — 3× better",
  },
  {
    headlineNode: <Counter value={0.9} decimals={2} duration={1600} />,
    label: "AUC · lithology classification",
    sub: "12 classes · cross-basin",
  },
  {
    headlineNode: <span>ζ</span>,
    label: "zero-shot generalization",
    sub: "generalizes to unseen cores without retraining",
  },
];

export default function Numbers() {
  return (
    <Section
      id="evidence"
      num="03"
      label="evidence"
      title={
        <>
          <span className="text-fg-dim">validation —</span> 2 PB ocean borehole
          corpus, neurips 2026.
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

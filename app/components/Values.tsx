import { Section } from "./Section";

type Value = { num: string; theme: string; body: string };

const values: Value[] = [
  {
    num: "01",
    theme: "focus",
    body: "Enter only fields where we can do something no one else will. Pass on easy money in spaces where we would be average.",
  },
  {
    num: "02",
    theme: "trust",
    body: "Hire deliberately. Then get out of the way. Define the destination precisely; leave the route to the person closest to it.",
  },
  {
    num: "03",
    theme: "craft over theater",
    body: "Build things people actually use. Real problems, real users, real measurements. No demos that don't survive contact with the world.",
  },
  {
    num: "04",
    theme: "contribution",
    body: "Leave the field better than we found it. Open data, open weights, public benchmarks. Earn profit because we contributed, not because we hoarded.",
  },
];

export default function Values() {
  return (
    <Section
      id="values"
      num="05"
      label="values"
      title={<>the way we work.</>}
    >
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-px bg-[var(--border)] border hairline">
        {values.map((v) => (
          <div
            key={v.num}
            className="bg-[var(--bg)] p-5 md:p-6 flex flex-col card-hover border border-transparent"
          >
            <div className="flex items-baseline gap-3 mb-3">
              <span className="text-mono text-[10px] uppercase tracking-widest text-accent">
                · {v.num}
              </span>
              <span className="text-fg text-mono text-sm">{v.theme}</span>
            </div>
            <div className="text-fg-dim text-sm leading-relaxed">{v.body}</div>
          </div>
        ))}
      </div>
    </Section>
  );
}

import { Section } from "./Section";

type Value = { num: string; theme: string; body: string };

const values: Value[] = [
  {
    num: "01",
    theme: "profit",
    body: "To achieve sufficient profit to finance our company growth and to provide the resources we need to achieve our other corporate objectives.",
  },
  {
    num: "02",
    theme: "customers",
    body: "To provide products and services of the greatest possible value to our customers, thereby gaining and holding their respect and loyalty.",
  },
  {
    num: "03",
    theme: "fields of interest",
    body: "To enter new fields only when the ideas we have, together with our technical, manufacturing and marketing skills, assure that we can make a needed and profitable contribution to the field.",
  },
  {
    num: "04",
    theme: "growth",
    body: "To let our growth be limited only by our profits and our ability to develop and produce technical products that satisfy real customer needs.",
  },
  {
    num: "05",
    theme: "our people",
    body: "To help our own people share in the company's success, which they made possible: to provide job security based on their performance, to recognize their individual achievements, and to help them gain a sense of satisfaction and accomplishment from their work.",
  },
  {
    num: "06",
    theme: "management",
    body: "To foster initiative and creativity by allowing the individual great freedom of action in attaining well-defined objectives.",
  },
  {
    num: "07",
    theme: "citizenship",
    body: "To honor our obligations to society by being an economic, intellectual and social asset to each nation and each community in which we operate.",
  },
];

export default function Values() {
  return (
    <Section
      id="values"
      num="05"
      label="values"
      title={
        <>
          the hp way.{" "}
          <span className="text-fg-dim">
            seven corporate objectives, articulated by david packard and bill
            hewlett, 1977. how we run earth-labs.
          </span>
        </>
      }
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

      <div className="mt-6 text-mono text-[10px] uppercase tracking-widest text-fg-mute">
        ↗{" "}
        <a
          href="https://en.wikipedia.org/wiki/The_HP_Way"
          target="_blank"
          rel="noreferrer noopener"
          className="hover:text-accent transition-colors"
        >
          the hp way · wikipedia
        </a>
      </div>
    </Section>
  );
}

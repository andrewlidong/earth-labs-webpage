import { Section } from "./Section";

const founders = [
  {
    name: "John M. Aiken, PhD",
    role: "co-founder · chief scientist",
    cred: "geophysics & ml · formerly njord centre, university of oslo",
    href: "https://johnspace.xyz/",
  },
  {
    name: "Andrew Dong",
    role: "co-founder · engineering",
    cred: "platform engineer · formerly rubrik, recurse center",
    href: "http://andrewlidong.xyz/",
  },
];

export default function Team() {
  return (
    <Section
      id="team"
      num="04"
      label="team"
      title={
        <>
          <span className="text-fg-dim">two founders.</span> backed by ut austin.
        </>
      }
    >
      <div className="grid grid-cols-1 md:grid-cols-2 gap-px bg-[var(--border)] border hairline">
        {founders.map((f) => (
          <div
            key={f.name}
            className="bg-[var(--bg)] p-6 md:p-8 flex flex-col card-hover border border-transparent"
          >
            <div className="flex items-baseline justify-between gap-3">
              <div className="text-fg text-mono text-lg">{f.name}</div>
              {f.href && (
                <a
                  href={f.href}
                  target="_blank"
                  rel="noreferrer noopener"
                  className="text-mono text-[10px] uppercase tracking-widest text-fg-mute hover:text-accent transition-colors"
                >
                  ↗ site
                </a>
              )}
            </div>
            <div className="label mt-2">{f.role}</div>
            <div className="text-fg-dim text-sm mt-4 leading-relaxed">
              {f.cred}
            </div>
          </div>
        ))}
      </div>
    </Section>
  );
}

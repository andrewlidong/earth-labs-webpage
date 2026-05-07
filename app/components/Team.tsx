import { Section } from "./Section";

type Member = {
  name: string;
  role: string;
  cred: string;
  href?: string;
  group: "founders" | "collaborators";
};

const team: Member[] = [
  {
    name: "John M. Aiken, PhD",
    role: "co-founder · chief scientist · pi",
    cred: "geophysics & ml · njord centre, university of oslo",
    href: "https://johnspace.xyz/",
    group: "founders",
  },
  {
    name: "Andrew Dong",
    role: "co-founder · engineering",
    cred: "platform engineer · formerly rubrik, recurse center",
    href: "http://andrewlidong.xyz/",
    group: "founders",
  },
  {
    name: "Thorsten Becker, PhD",
    role: "research collaborator",
    cred: "institute for geophysics · ut austin",
    group: "collaborators",
  },
  {
    name: "Dunyu Liu, PhD",
    role: "research collaborator",
    cred: "institute for geophysics · ut austin",
    group: "collaborators",
  },
  {
    name: "William Gilpin, PhD",
    role: "research collaborator",
    cred: "department of physics · ut austin",
    group: "collaborators",
  },
  {
    name: "Charlie Beard, PhD",
    role: "research collaborator",
    cred: "department of geosciences · utrecht university",
    group: "collaborators",
  },
];

export default function Team() {
  const founders = team.filter((m) => m.group === "founders");
  const collaborators = team.filter((m) => m.group === "collaborators");

  return (
    <Section
      id="team"
      num="04"
      label="team"
      title={
        <>
          <span className="text-fg-dim">two founders.</span> a project team
          spanning oslo, austin, and utrecht.
        </>
      }
    >
      <div className="grid grid-cols-1 md:grid-cols-2 gap-px bg-[var(--border)] border hairline">
        {founders.map((f) => (
          <Card key={f.name} member={f} prominent />
        ))}
      </div>

      <div className="mt-10">
        <div className="label mb-4">research collaborators</div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-px bg-[var(--border)] border hairline">
          {collaborators.map((m) => (
            <Card key={m.name} member={m} />
          ))}
        </div>
      </div>
    </Section>
  );
}

function Card({
  member,
  prominent = false,
}: {
  member: Member;
  prominent?: boolean;
}) {
  return (
    <div
      className={`bg-[var(--bg)] flex flex-col card-hover border border-transparent ${
        prominent ? "p-6 md:p-8" : "p-5 md:p-6"
      }`}
    >
      <div className="flex items-baseline justify-between gap-3">
        <div className={`text-fg text-mono ${prominent ? "text-lg" : "text-base"}`}>
          {member.name}
        </div>
        {member.href && (
          <a
            href={member.href}
            target="_blank"
            rel="noreferrer noopener"
            className="text-mono text-[10px] uppercase tracking-widest text-fg-mute hover:text-accent transition-colors"
          >
            ↗ site
          </a>
        )}
      </div>
      <div className="label mt-2">{member.role}</div>
      <div className="text-fg-dim text-sm mt-3 leading-relaxed">{member.cred}</div>
    </div>
  );
}

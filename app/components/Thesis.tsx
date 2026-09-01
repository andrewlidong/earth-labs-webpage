import { Section } from "./Section";

export default function Thesis() {
  return (
    <Section
      id="thesis"
      num="01"
      label="the problem"
      title={
        <>
          decades of subsurface knowledge,{" "}
          <span className="text-fg-dim">
            locked in pdfs no one can query.
          </span>{" "}
          <span className="text-accent">we built the agent that reads them.</span>
        </>
      }
    >
      <div className="grid grid-cols-1 md:grid-cols-2 gap-12 mt-4">
        <p className="text-fg-dim text-base md:text-lg leading-relaxed">
          exploration companies sit on archives of well reports, core
          descriptions, and survey documentation — data that cost{" "}
          <span className="text-fg">billions to acquire</span>, stored in
          formats built for printing, not analysis. most of it is never
          queried again.
        </p>
        <p className="text-fg-dim text-base md:text-lg leading-relaxed">
          today&apos;s options: hire{" "}
          <span className="text-fg">$250k+ ml engineers</span> to build one-off
          parsers, commission a months-long digitization project, or let it
          stay dead. every drilling decision made without the archive is a
          more expensive decision.
        </p>
      </div>
    </Section>
  );
}

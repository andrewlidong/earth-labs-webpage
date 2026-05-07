import { Section } from "./Section";

export default function Thesis() {
  return (
    <Section
      id="thesis"
      num="01"
      label="thesis"
      title={
        <>
          beneath the noise of every measurement{" "}
          <span className="text-fg-dim">lies a lower-dimensional manifold of latent geological processes.</span>{" "}
          <span className="text-accent">we are training the model that finds it.</span>
        </>
      }
    >
      <div className="grid grid-cols-1 md:grid-cols-2 gap-12 mt-4">
        <p className="text-fg-dim text-base md:text-lg leading-relaxed">
          natural hydrogen — a zero-carbon fuel produced continuously by the
          serpentinization of ultramafic rocks — may be a multi-trillion-ton
          resource. it replenishes. it costs roughly{" "}
          <span className="text-fg">$1/kg</span>.
        </p>
        <p className="text-fg-dim text-base md:text-lg leading-relaxed">
          finding it requires reading the crust. petabytes of borehole and
          seismic data already exist, scattered across incompatible silos,{" "}
          <span className="text-fg">5–10% complete</span>. classical methods
          cannot interpolate. foundation models can.
        </p>
      </div>
    </Section>
  );
}

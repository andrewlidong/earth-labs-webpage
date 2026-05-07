import { Section } from "./Section";

export default function Model() {
  return (
    <Section
      id="model"
      num="02"
      label="the model"
      title={
        <>
          jennifer-h2{" "}
          <span className="text-fg-dim">
            — a multi-modal foundation model for the subsurface.
          </span>
        </>
      }
    >
      <div className="text-mono text-[11px] uppercase tracking-widest text-fg-mute mb-8">
        joint embedding neural network interpolation for earth resources · h2
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card label="inputs">
          gravity · magnetics · crustal thickness · bathymetry · 2D/3D seismic ·
          borehole logs
        </Card>
        <Card label="core" accent>
          masked joint-embedding predictive transformer. self-supervised,
          cross-modal, trained on a unified corpus of real-world heterogeneous data.
        </Card>
        <Card label="output">
          full posterior over subsurface properties. probabilistic zero-shot
          inversion in <span className="text-fg">minutes, not weeks</span>.
        </Card>
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

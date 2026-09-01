export default function Footer() {
  return (
    <footer className="border-t hairline">
      <div className="mx-auto max-w-7xl px-6 md:px-10 py-12">
        <div className="flex flex-col md:flex-row items-start md:items-end justify-between gap-10">
          <div>
            <div className="font-mono text-3xl md:text-4xl tracking-[-0.04em] text-fg">
              earth-labs<span className="text-accent">.</span>ai
            </div>
            <div className="label mt-3">foundation models for earth&apos;s crust</div>
          </div>

          <a
            href="mailto:hello@earth-labs.ai"
            className="text-mono text-[12px] tracking-widest uppercase px-5 py-3 border hairline text-fg-dim hover:text-fg hover:border-accent transition-colors"
          >
            hello@earth-labs.ai →
          </a>
        </div>

        <div className="mt-10 pt-6 border-t hairline flex flex-col md:flex-row items-start md:items-center justify-between gap-3 text-mono text-[10px] uppercase tracking-widest text-fg-mute">
          <div className="flex items-center gap-5">
            <span>© 2026 earth-labs</span>
            <a href="/research" className="hover:text-accent transition-colors">
              research
            </a>
          </div>
          <div className="flex items-center gap-2">
            <span className="w-1.5 h-1.5 bg-green pulse" />
            <span>training · jennifer-h2</span>
          </div>
        </div>
      </div>
    </footer>
  );
}

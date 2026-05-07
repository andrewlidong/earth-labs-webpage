import { ReactNode } from "react";
import { Reveal } from "./Reveal";

export function Section({
  id,
  num,
  label,
  title,
  children,
  className = "",
}: {
  id?: string;
  num: string;
  label: string;
  title?: ReactNode;
  children: ReactNode;
  className?: string;
}) {
  return (
    <section
      id={id}
      className={`relative border-b hairline scroll-mt-0 ${className}`}
    >
      <div className="mx-auto max-w-7xl px-6 md:px-10 py-20 md:py-32">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8 md:gap-12">
          <Reveal className="md:col-span-3 flex flex-col gap-2">
            <div className="section-num">§ {num}</div>
            <div className="label">{label}</div>
          </Reveal>
          <div className="md:col-span-9">
            {title && (
              <Reveal delay={80}>
                <h2 className="font-mono text-3xl md:text-5xl tracking-[-0.03em] leading-[1.05] text-fg mb-10 md:mb-14">
                  {title}
                </h2>
              </Reveal>
            )}
            <Reveal delay={160}>{children}</Reveal>
          </div>
        </div>
      </div>
    </section>
  );
}

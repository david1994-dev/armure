import Link from "next/link";
import { Container } from "@/components/ui/Container";

const specRows = [
  { label: "Fabric", value: "Combed ring-spun cotton" },
  { label: "Weight", value: "220 GSM" },
  { label: "Fit", value: "Regular, true to size" },
  { label: "Stitch", value: "Double-needle collar & hem" },
  { label: "Care", value: "Cold wash, tumble low" },
  { label: "Guarantee", value: "1-year against pilling" },
];

export function BrandStorySection() {
  return (
    <section id="making" className="border-y border-line bg-surface py-12 lg:py-[5.5rem]">
      <Container className="grid grid-cols-1 items-center gap-9 lg:grid-cols-[1.1fr_0.9fr] lg:gap-[5.5rem]">
        <div>
          <p className="mb-4 flex items-center gap-2.5 font-mono text-[0.72rem] font-semibold uppercase tracking-[0.14em] text-accent before:h-px before:w-[1.3rem] before:bg-accent before:content-['']">
            The Making
          </p>
          <h2 className="max-w-[16ch] text-balance font-display text-[clamp(1.8rem,3.4vw,2.6rem)] font-extrabold uppercase leading-[1.05]">
            Armure means armor. We build tees to match.
          </h2>
          <p className="mt-[1.3rem] max-w-[46ch] text-ink-soft">
            Every ARMURE tee starts at 220GSM combed cotton — heavier than most, so the shape
            holds after the fiftieth wash, not just the first. Collars are double-stitched to
            resist stretching out.
          </p>
          <p className="mt-[0.9rem] max-w-[46ch] text-ink-soft">
            We test every batch for pilling and shrinkage before it ships. If a tee fails within a
            year of normal wear, we replace it — no receipt needed.
          </p>
          <Link
            href="/shop"
            className="mt-[1.6rem] inline-flex items-center gap-1.5 border-b border-ink pb-0.5 text-xs font-bold uppercase tracking-[0.08em] hover:border-accent hover:text-accent"
          >
            Read the full fabric story &rarr;
          </Link>
        </div>

        <div className="border border-line-strong bg-bg">
          <div className="border-b border-dashed border-line-strong px-[1.3rem] py-4 font-mono text-[0.68rem] uppercase tracking-[0.1em] text-ink-faint">
            Garment Spec &mdash; Style 001
          </div>
          {specRows.map((row, index) => (
            <div
              key={row.label}
              className={`flex justify-between gap-4 px-[1.3rem] py-[0.85rem] text-[0.88rem] ${
                index < specRows.length - 1 ? "border-b border-line" : ""
              }`}
            >
              <span className="font-mono text-[0.68rem] uppercase tracking-[0.08em] text-ink-faint">
                {row.label}
              </span>
              <span className="text-right font-semibold">{row.value}</span>
            </div>
          ))}
        </div>
      </Container>
    </section>
  );
}

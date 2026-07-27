import Image from "next/image";
import { MarqueeStrip } from "@/components/marketing/MarqueeStrip";
import { Button } from "@/components/ui/Button";
import { Container } from "@/components/ui/Container";
import { getProductBySlug } from "@/lib/data/products";

export function Hero() {
  const heroProduct = getProductBySlug("ridge-tee-clay");
  const accentProduct = getProductBySlug("bastion-tee-ink");

  return (
    <section
      className="relative"
      style={{
        backgroundImage:
          "repeating-linear-gradient(-45deg, color-mix(in srgb, var(--line-strong) 55%, transparent) 0 1px, transparent 1px 14px)",
      }}
    >
      <Container className="grid grid-cols-1 items-center gap-9 [padding-block:clamp(2.25rem,8vw,4rem)] lg:grid-cols-[1.05fr_0.95fr] lg:gap-[5.5rem] lg:[padding-block:clamp(2.25rem,8vw,8rem)]">
        <div>
          <p className="mb-[1.1rem] flex items-center gap-2.5 font-mono text-[0.72rem] font-semibold uppercase tracking-[0.14em] text-accent before:h-px before:w-[1.3rem] before:bg-accent before:content-['']">
            Graphic Tees &middot; Custom Coming Soon
          </p>
          <h1 className="max-w-[14ch] text-balance font-display text-[clamp(2.6rem,5.6vw,4.6rem)] font-extrabold uppercase leading-[0.98] tracking-[-0.01em]">
            One world. Every tee.
          </h1>
          <p className="mt-6 max-w-[38ch] text-[1.05rem] text-ink-soft">
            Your one-stop shop for graphic tees — every fit, every print, all in one place. Custom,
            upload-your-own designs are coming soon.
          </p>
          <div className="mt-9 flex flex-wrap items-center gap-6">
            <Button href="/shop" variant="primary">
              Shop the Tees
            </Button>
            <Button href="#making" variant="ghost">
              Our Standards
            </Button>
          </div>
          <p className="mt-8 text-[0.8rem] text-ink-faint">
            <strong className="text-ink">4.8/5</strong> from 12,400+ wearers &nbsp;&middot;&nbsp;
            Free returns, 30 days
          </p>
        </div>

        <div className="relative flex flex-col items-center gap-5 pb-2 lg:block lg:min-h-[380px]">
          <div className="relative w-[min(280px,70%)] lg:mx-auto lg:w-[min(340px,80%)]">
            <div className="relative aspect-[1/1.05] overflow-hidden border border-line bg-surface">
              {heroProduct ? (
                <Image
                  src={heroProduct.images[0].src}
                  alt={heroProduct.images[0].alt}
                  fill
                  sizes="(min-width: 1024px) 340px, 280px"
                  className="object-cover"
                  priority
                />
              ) : null}
            </div>

            {accentProduct ? (
              <div className="absolute -right-6 -top-8 hidden w-[42%] rotate-[6deg] overflow-hidden border-4 border-surface bg-surface shadow-[0_16px_32px_-10px_rgba(0,0,0,0.4)] sm:block">
                <div className="relative aspect-[4/5]">
                  <Image
                    src={accentProduct.images[1].src}
                    alt={accentProduct.images[1].alt}
                    fill
                    sizes="150px"
                    className="object-cover"
                  />
                </div>
              </div>
            ) : null}
          </div>

          <div className="self-center bg-ink px-[1.1rem] py-[0.85rem] font-mono text-[0.68rem] leading-[1.7] tracking-[0.06em] text-bg shadow-[0_12px_30px_-12px_rgba(0,0,0,0.35)] lg:absolute lg:bottom-[-1.4rem] lg:left-[-1.4rem] lg:self-auto">
            <b className="mb-[0.15rem] block text-[0.72rem] tracking-[0.08em] text-accent">
              Ridge Tee
            </b>
            220GSM &middot; 100% Cotton
            <br />
            Reinforced collar
            <br />
            $42.00
          </div>
        </div>
      </Container>

      <MarqueeStrip />
    </section>
  );
}

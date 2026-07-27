import Image from "next/image";
import Link from "next/link";
import { Container } from "@/components/ui/Container";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { communityGallery } from "@/lib/data/gallery";

function InstagramIcon({ className = "" }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" className={className}>
      <rect x="3.5" y="3.5" width="17" height="17" rx="5" />
      <circle cx="12" cy="12" r="4" />
      <circle cx="17.2" cy="6.8" r="1" fill="currentColor" stroke="none" />
    </svg>
  );
}

export function LifestyleGallerySection() {
  return (
    <section className="py-12 lg:py-[5.5rem]">
      <Container>
        <SectionHeader
          title="Worn Your Way"
          description="Real tees, real wear — @teeworld in the wild."
          action={{ label: "Shop the tees", href: "/shop" }}
        />
        <div className="grid auto-rows-[130px] grid-cols-2 gap-3 sm:auto-rows-[160px] lg:auto-rows-[190px] lg:grid-cols-4 lg:gap-4">
          {communityGallery.map((photo) => (
            <Link
              key={photo.id}
              href="/shop"
              className={`group relative overflow-hidden rounded-[18px] bg-surface-2 ${
                photo.size === "large" ? "col-span-2 row-span-2" : "col-span-1 row-span-1"
              }`}
            >
              <Image
                src={photo.src}
                alt={photo.alt}
                fill
                sizes={photo.size === "large" ? "(min-width: 1024px) 45vw, 90vw" : "(min-width: 1024px) 22vw, 45vw"}
                className="object-cover transition-transform duration-500 ease-out group-hover:scale-[1.06]"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-ink/35 via-transparent to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
              <InstagramIcon className="absolute right-3 top-3 h-5 w-5 text-bg opacity-0 drop-shadow-[0_1px_3px_rgba(0,0,0,0.5)] transition-opacity duration-300 group-hover:opacity-100" />
            </Link>
          ))}
        </div>
      </Container>
    </section>
  );
}

const MARQUEE_ITEMS = [
  "4.8/5 FROM 12,400+ WEARERS",
  "BOLD GRAPHIC PRINTS",
  "220GSM HEAVYWEIGHT COTTON",
  "CUSTOM DESIGNS — COMING SOON",
  "NEW DROP — THE RIDGE TEE",
];

export function MarqueeStrip() {
  const loop = [...MARQUEE_ITEMS, ...MARQUEE_ITEMS];

  return (
    <div aria-hidden="true" className="overflow-hidden border-t border-line-strong bg-ink py-2.5">
      <div className="flex w-max animate-marquee gap-10">
        {loop.map((item, i) => (
          <span
            key={i}
            className="flex items-center gap-10 whitespace-nowrap font-mono text-[0.68rem] uppercase tracking-[0.12em] text-surface"
          >
            {item}
            <span className="text-accent">✦</span>
          </span>
        ))}
      </div>
    </div>
  );
}

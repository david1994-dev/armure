export function UtilityBar() {
  return (
    <div className="bg-ink px-4 py-[0.55rem] text-center font-mono text-[0.7rem] uppercase tracking-[0.09em] text-surface">
      Free shipping on US orders $75+
      <span className="hidden min-[480px]:inline">
        {" "}
        &nbsp;&middot;&nbsp; New drop: The Ridge Tee
      </span>
    </div>
  );
}

import Link from "next/link";
import type { AnchorHTMLAttributes, ButtonHTMLAttributes, ReactNode } from "react";

type Variant = "primary" | "ghost";

const base =
  "inline-flex items-center gap-2 rounded-[2px] border px-6 py-3.5 text-xs font-bold tracking-[0.1em] uppercase transition-colors";

const variantClasses: Record<Variant, string> = {
  primary:
    "border-ink bg-ink text-bg hover:border-accent hover:bg-accent hover:text-accent-ink",
  ghost: "border-ink bg-transparent text-ink hover:bg-ink hover:text-bg",
};

interface CommonProps {
  variant?: Variant;
  className?: string;
  children: ReactNode;
}

type LinkButtonProps = CommonProps &
  Omit<AnchorHTMLAttributes<HTMLAnchorElement>, "className" | "children"> & {
    href: string;
  };

type NativeButtonProps = CommonProps &
  Omit<ButtonHTMLAttributes<HTMLButtonElement>, "className" | "children"> & {
    href?: undefined;
  };

export type ButtonProps = LinkButtonProps | NativeButtonProps;

export function Button({ variant = "primary", className = "", children, ...rest }: ButtonProps) {
  const classes = `${base} ${variantClasses[variant]} ${className}`.trim();

  if (rest.href) {
    const { href, ...anchorRest } = rest as LinkButtonProps;
    return (
      <Link href={href} className={classes} {...anchorRest}>
        {children}
      </Link>
    );
  }

  const { href: _unusedHref, ...buttonRest } = rest as NativeButtonProps;
  void _unusedHref;
  return (
    <button className={classes} {...buttonRest}>
      {children}
    </button>
  );
}

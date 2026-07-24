import type { ReactNode } from "react";

interface ContainerProps {
  children: ReactNode;
  className?: string;
}

export function Container({ children, className = "" }: ContainerProps) {
  return (
    <div className={`mx-auto max-w-[1280px] px-[clamp(1.25rem,4vw,3rem)] ${className}`}>
      {children}
    </div>
  );
}

import type { ButtonHTMLAttributes, ReactNode } from "react";

import { cn } from "@/lib/utils";

type Variant = "primary" | "ghost" | "quiet";
type Size = "sm" | "md" | "lg";

interface BaseProps {
  variant?: Variant;
  size?: Size;
  className?: string;
  children: ReactNode;
}

const base =
  "relative inline-flex items-center justify-center gap-2 rounded-full font-display font-semibold uppercase tracking-[0.12em] transition-[transform,background-color,border-color,color,box-shadow] duration-300 will-change-transform active:translate-y-px disabled:pointer-events-none disabled:opacity-50 hover:-translate-y-0.5";

const variants: Record<Variant, string> = {
  // Signal yellow on near-black gives ~12:1 contrast; the label uses the
  // darkest token so text stays AA/AAA in both states.
  primary:
    "bg-signal text-gotham-950 shadow-[0_0_0_1px_var(--color-signal)] hover:shadow-[0_0_28px_-4px_var(--color-signal)]",
  ghost:
    "border border-gotham-500 text-ink hover:border-signal hover:text-signal",
  quiet: "text-ash hover:text-signal",
};

const sizes: Record<Size, string> = {
  sm: "px-4 py-2 text-xs",
  md: "px-6 py-3 text-sm",
  lg: "px-8 py-4 text-base",
};

function classes({ variant = "primary", size = "md", className }: BaseProps) {
  return cn(base, variants[variant], sizes[size], className);
}

type ButtonProps = BaseProps & ButtonHTMLAttributes<HTMLButtonElement>;

export function Button({ variant, size, className, children, ...rest }: ButtonProps) {
  return (
    <button className={classes({ variant, size, className, children })} {...rest}>
      {children}
    </button>
  );
}

type LinkProps = BaseProps & React.AnchorHTMLAttributes<HTMLAnchorElement>;

/** Anchor twin of `Button` — same look, real navigation semantics. */
export function ButtonLink({
  variant,
  size,
  className,
  children,
  ...rest
}: LinkProps) {
  return (
    <a className={classes({ variant, size, className, children })} {...rest}>
      {children}
    </a>
  );
}

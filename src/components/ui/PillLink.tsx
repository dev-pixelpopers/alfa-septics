import Link from "next/link";
import type { ReactNode } from "react";
import { ArrowIcon } from "./ArrowIcon";

type PillLinkProps = {
  href: string;
  children: ReactNode;
  variant?: "outline" | "gradient";
  className?: string;
};

// Figma "CTA": 69px pill, white 1px border, 6.5px backdrop blur, 26px Nohemi.
export function PillLink({ href, children, variant = "outline", className }: PillLinkProps) {
  const fill =
    variant === "gradient"
      ? "bg-gradient-to-b from-[rgba(32,100,172,0.9)] to-[rgba(49,162,202,0.9)] hover:brightness-110"
      : "hover:bg-white/10";

  return (
    <Link
      href={href}
      className={`group inline-flex h-[6.9rem] items-center justify-center gap-[2.4rem] whitespace-nowrap rounded-full border border-white p-[1rem] font-body text-[2.6rem] leading-[2.8rem] text-white backdrop-blur-[0.65rem] transition-[background-color,filter] ${fill} ${className ?? ""}`}
    >
      {children}
      <ArrowIcon className="w-[2.6rem] transition-transform duration-300 group-hover:-translate-y-[0.3rem] group-hover:translate-x-[0.3rem]" />
    </Link>
  );
}

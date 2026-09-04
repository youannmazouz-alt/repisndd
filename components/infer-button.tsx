import type React from "react"
import { cn } from "@/lib/utils"

type InferButtonProps = React.ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: "primary" | "secondary"
}

/**
 * A deliberately "classic HTML button" style control: squared corners,
 * 1px solid border, no gradients, no glow. Primary uses black-on-off-white,
 * secondary uses the muted section background.
 */
export function InferButton({ variant = "secondary", className, ...props }: InferButtonProps) {
  return (
    <button
      className={cn(
        "inline-flex items-center justify-center gap-2 whitespace-nowrap border px-4 py-2 font-mono text-[13px] uppercase tracking-wide transition-colors",
        "rounded-[3px] border-foreground",
        "focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-foreground",
        "disabled:cursor-not-allowed disabled:opacity-45",
        "active:translate-y-px",
        variant === "primary"
          ? "bg-foreground text-background hover:bg-foreground/90"
          : "bg-secondary text-foreground hover:bg-secondary/70",
        className,
      )}
      {...props}
    />
  )
}

"use client"

import { useInferBalance } from "@/hooks/use-infer-balance"
import { formatInfer } from "@/lib/format"
import { cn } from "@/lib/utils"

export function InferBalance({ className }: { className?: string }) {
  const { balance, loading, connected } = useInferBalance()

  if (!connected) {
    return <span className={cn("font-mono text-sm text-muted-foreground", className)}>-</span>
  }

  return (
    <span className={cn("font-mono text-sm", className)}>
      {loading ? "checking balance..." : balance !== null ? formatInfer(balance) : "-"}
    </span>
  )
}

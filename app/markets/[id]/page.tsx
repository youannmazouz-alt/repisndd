import type { Metadata } from "next"
import { notFound } from "next/navigation"
import { MarketDetail } from "@/components/market-detail"
import { getMarket } from "@/lib/markets"

export async function generateMetadata({
  params,
}: {
  params: Promise<{ id: string }>
}): Promise<Metadata> {
  const { id } = await params
  const market = getMarket(id)
  if (!market) return { title: "Question not found - INFER" }
  return {
    title: `${market.shortQuestion} - INFER`,
    description: market.description,
  }
}

export default async function MarketPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const market = getMarket(id)

  if (!market) {
    notFound()
  }

  return <MarketDetail market={market} />
}

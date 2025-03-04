import { cache } from "react"

interface Cryptocurrency {
  id: string
  symbol: string
  name: string
  priceUsd: string
  changePercent24Hr: string
  marketCapUsd: string
  rank: string
}

export const revalidate = 60

export const getCryptoData = cache(async () => {
  const response = await fetch("https://api.coincap.io/v2/assets?limit=100", { next: { revalidate: 60 } })

  if (!response.ok) {
    throw new Error("Couldn't get crypto data")
  }

  const data = await response.json()

  const filteredData = data.data.filter((crypto: Cryptocurrency) =>
    ["bitcoin", "ethereum", "cardano", "dogecoin", "solana"].includes(crypto.id.toLowerCase()),
  )

  return filteredData as Cryptocurrency[]
})


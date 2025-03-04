"use client"

import { useState } from "react"
import { ArrowDown, ArrowUp, RefreshCw, Search } from "lucide-react"
import { toast } from "sonner"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"

interface Cryptocurrency {
  id: string
  symbol: string
  name: string
  priceUsd: string
  changePercent24Hr: string
  marketCapUsd: string
  rank: string
}

const CRYPTO_IDS = ["bitcoin", "ethereum", "cardano", "dogecoin", "solana"]

export default function CryptoDashboard({ initialData }: { initialData: Cryptocurrency[] }) {
  const [searchQuery, setSearchQuery] = useState("")
  const [cryptoData, setCryptoData] = useState(initialData)
  const [isRefreshing, setIsRefreshing] = useState(false)

  const filteredCryptos = cryptoData
    .filter((crypto) => CRYPTO_IDS.includes(crypto.id.toLowerCase()))
    .filter(
      (crypto) =>
        crypto.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        crypto.symbol.toLowerCase().includes(searchQuery.toLowerCase()),
    )
    .sort((a, b) => Number.parseInt(a.rank) - Number.parseInt(b.rank))

  const refreshData = async () => {
    setIsRefreshing(true)
    try {
      const response = await fetch("/api/crypto")
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }
      const contentType = response.headers.get("content-type")
      if (!contentType || !contentType.includes("application/json")) {
        throw new Error("Oops! Received non-JSON response from server")
      }
      const newData = await response.json()
      setCryptoData(newData)
      toast.success("Data refreshed", {
        description: "Cryptocurrency data has been updated.",
      })
    } catch (error) {
      console.error("Error refreshing data:", error)
      toast.error("Refresh failed", {
        description: error instanceof Error ? error.message : "An unexpected error occurred",
      })
    } finally {
      setIsRefreshing(false)
    }
  }

  return (
    <div className="container mx-auto py-8 px-4">
      <div className="flex flex-col gap-6">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Crypto Dashboard</h1>
            <p className="text-muted-foreground">Bitcoin, Ethereum, Cardano, Doge, and Solana prices</p>
          </div>
          <Button onClick={refreshData} disabled={isRefreshing} className="w-full sm:w-auto">
            <RefreshCw className={`mr-2 h-4 w-4 ${isRefreshing ? "animate-spin" : ""}`} />
            {isRefreshing ? "Refreshing..." : "Refresh Prices"}
          </Button>
        </div>

        <div className="relative w-full max-w-sm mx-auto sm:mx-0">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            type="text"
            placeholder="Search cryptocurrency..."
            className="pl-8"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>

        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5">
          {filteredCryptos.length > 0 ? (
            filteredCryptos.map((crypto) => (
              <Card key={crypto.id} className="overflow-hidden">
                <CardHeader className="pb-2">
                  <div className="flex items-center gap-2">
                    <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center">
                      <span className="text-lg font-bold">{crypto.symbol.charAt(0)}</span>
                    </div>
                    <div>
                      <CardTitle className="text-lg">{crypto.name}</CardTitle>
                      <CardDescription className="uppercase">{crypto.symbol}</CardDescription>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="flex flex-col gap-1">
                    <p className="text-2xl font-bold">
                      $
                      {Number.parseFloat(crypto.priceUsd).toLocaleString(undefined, {
                        minimumFractionDigits: 2,
                        maximumFractionDigits: Number.parseFloat(crypto.priceUsd) < 1 ? 6 : 2,
                      })}
                    </p>
                    <div className="flex items-center">
                      <span
                        className={`flex items-center ${
                          Number.parseFloat(crypto.changePercent24Hr) >= 0 ? "text-green-500" : "text-red-500"
                        }`}
                      >
                        {Number.parseFloat(crypto.changePercent24Hr) >= 0 ? (
                          <ArrowUp className="mr-1 h-4 w-4" />
                        ) : (
                          <ArrowDown className="mr-1 h-4 w-4" />
                        )}
                        {Math.abs(Number.parseFloat(crypto.changePercent24Hr)).toFixed(2)}%
                      </span>
                      <span className="text-muted-foreground text-sm ml-1">24h</span>
                    </div>
                    <p className="text-sm text-muted-foreground mt-1">
                      Market Cap: $
                      {Number.parseFloat(crypto.marketCapUsd).toLocaleString(undefined, { maximumFractionDigits: 0 })}
                    </p>
                  </div>
                </CardContent>
              </Card>
            ))
          ) : (
            <div className="col-span-full text-center py-10">
              {searchQuery ? (
                <>
                  <p className="text-muted-foreground">No cryptocurrencies found matching {searchQuery}</p>
                  <Button variant="link" onClick={() => setSearchQuery("")} className="mt-2">
                    Clear search
                  </Button>
                </>
              ) : (
                <>
                  <p className="text-muted-foreground">No cryptocurrency data available</p>
                  <Button variant="outline" onClick={refreshData} className="mt-4">
                    Try refreshing
                  </Button>
                </>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}


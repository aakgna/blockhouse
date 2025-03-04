"use client"

import { useState } from "react"
import { QueryClient, QueryClientProvider, useQuery } from "@tanstack/react-query"
import { ArrowDown, ArrowUp, RefreshCw, Search } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Skeleton } from "@/components/ui/skeleton"

interface Cryptocurrency {
  id: string
  symbol: string
  name: string
  priceUsd: string
  changePercent24Hr: string
  marketCapUsd: string
  rank: string
}

// Create a client
const queryClient = new QueryClient()

function CryptoDashboardContent() {
  const [searchQuery, setSearchQuery] = useState("")

  const { data, isLoading, isError, error, refetch, isFetching } = useQuery<{ data: Cryptocurrency[] }>({
    queryKey: ["cryptoPrices"],
    queryFn: async () => {
      const response = await fetch("https://api.coincap.io/v2/assets?limit=100")
      if (!response.ok) {
        throw new Error("Network response was not ok")
      }
      return response.json()
    },
    staleTime: 60000, // 1 minute
  })

  const filteredData = data?.data?.filter(
    (crypto) =>
      crypto.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      crypto.symbol.toLowerCase().includes(searchQuery.toLowerCase()),
  )

  const displayedCryptos = filteredData?.slice(0, searchQuery ? filteredData.length : 5)

  return (
    <div className="container mx-auto py-8 px-4">
      <div className="flex flex-col gap-6">
        <div className="flex flex-col gap-2">
          <h1 className="text-3xl font-bold tracking-tight">Cryptocurrency Dashboard</h1>
          <p className="text-muted-foreground">Track the latest prices of top cryptocurrencies</p>
        </div>

        <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
          <div className="relative w-full sm:w-72">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              type="text"
              placeholder="Search cryptocurrencies..."
              className="pl-8"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          <Button onClick={() => refetch()} disabled={isFetching} className="w-full sm:w-auto">
            <RefreshCw className={`mr-2 h-4 w-4 ${isFetching ? "animate-spin" : ""}`} />
            {isFetching ? "Refreshing..." : "Refresh Prices"}
          </Button>
        </div>

        {isError && (
          <Card className="border-destructive">
            <CardHeader>
              <CardTitle className="text-destructive">Error</CardTitle>
            </CardHeader>
            <CardContent>
              <p>Failed to fetch cryptocurrency data. Please try again later.</p>
              <p className="text-sm text-muted-foreground mt-2">{(error as Error).message}</p>
            </CardContent>
          </Card>
        )}

        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {isLoading
            ? Array(5)
                .fill(0)
                .map((_, index) => (
                  <Card key={index} className="overflow-hidden">
                    <CardHeader className="pb-2">
                      <div className="flex items-center gap-2">
                        <Skeleton className="h-10 w-10 rounded-full" />
                        <div className="space-y-2">
                          <Skeleton className="h-4 w-24" />
                          <Skeleton className="h-3 w-12" />
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-2">
                        <Skeleton className="h-6 w-28" />
                        <Skeleton className="h-4 w-20" />
                      </div>
                    </CardContent>
                  </Card>
                ))
            : displayedCryptos?.map((crypto) => (
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
                      <p className="text-xs text-muted-foreground">Rank: #{crypto.rank}</p>
                    </div>
                  </CardContent>
                </Card>
              ))}
        </div>

        {!isLoading && displayedCryptos?.length === 0 && (
          <div className="text-center py-10">
            <p className="text-muted-foreground">No cryptocurrencies found matching {searchQuery}</p>
            <Button variant="link" onClick={() => setSearchQuery("")} className="mt-2">
              Clear search
            </Button>
          </div>
        )}
      </div>
    </div>
  )
}

export default function CryptoDashboard() {
  return (
    <QueryClientProvider client={queryClient}>
      <CryptoDashboardContent />
    </QueryClientProvider>
  )
}


import { getCryptoData } from "./api/crypto"
import CryptoDashboard from "@/components/CryptoDashboard"

export default async function Home() {
  const cryptoData = await getCryptoData()

  return (
    <CryptoDashboard initialData={cryptoData} />
  )
}
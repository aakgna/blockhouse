import { NextResponse } from "next/server"
import { getCryptoData } from "../crypto"

export async function GET() {
  try {
    const data = await getCryptoData()
    return NextResponse.json(data)
  } catch (error) {
    console.error("Error in /api/crypto:", error)
    return NextResponse.json({ error: "Couldn't get crypto data" }, { status: 500 })
  }
}

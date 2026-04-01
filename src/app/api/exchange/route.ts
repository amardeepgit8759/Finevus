import { NextResponse } from "next/server";

const FALLBACK_RATES = {
  USD: 0.012,
  EUR: 0.011,
  GBP: 0.0094,
  JPY: 1.81,
  SGD: 0.016,
  AUD: 0.018,
  CAD: 0.016,
};

export async function GET() {
  try {
    const res = await fetch("https://open.er-api.com/v6/latest/INR", { next: { revalidate: 3600 } });
    if (!res.ok) throw new Error("Failed to fetch rates");
    
    const data = await res.json();
    if (data.result === "success") {
      return NextResponse.json({ rates: data.rates, base: "INR", source: "live" });
    }
    throw new Error("Invalid format from exchange API");
  } catch (err) {
    console.error("Exchange API failed, using fallback", err);
    return NextResponse.json({ rates: FALLBACK_RATES, base: "INR", source: "fallback" });
  }
}

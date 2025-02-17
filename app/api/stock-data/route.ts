import { NextRequest, NextResponse } from "next/server";
import { dates } from "@/lib/utils";

// Define types for better type safety
interface StockRequest {
  tickers: string[];
}

interface PolygonResponse {
  ticker: string;
  queryCount: number;
  resultsCount: number;
  adjusted: boolean;
  results: {
    c: number; // close price
    h: number; // high
    l: number; // low
    n: number; // number of transactions
    o: number; // open price
    t: number; // timestamp
    v: number; // trading volume
    vw: number; // volume weighted average price
  }[];
  status: string;
  request_id: string;
  count: number;
}

export async function POST(request: NextRequest) {
  try {
    // Input validation
    const body = await request.json();
    const { tickers } = body as StockRequest;

    if (!tickers || !Array.isArray(tickers) || tickers.length === 0) {
      return NextResponse.json(
        { error: "Invalid tickers provided" },
        { status: 400 }
      );
    }

    if (tickers.length > 3) {
      return NextResponse.json(
        { error: "Maximum 3 tickers allowed per request" },
        { status: 400 }
      );
    }

    const stockData = await Promise.all(
      tickers.map(async (ticker: string) => {
        const url = `https://api.polygon.io/v2/aggs/ticker/${ticker}/range/1/day/${dates.startDate}/${dates.endDate}?apiKey=${process.env.POLYGON_API_KEY}`;

        const response = await fetch(url, {
          headers: {
            Accept: "application/json",
          },
          next: {
            revalidate: 300, // Cache for 5 minutes
          },
        });

        if (!response.ok) {
          throw new Error(
            `Failed to fetch data for ${ticker}: ${response.statusText}`
          );
        }

        const data = (await response.json()) as PolygonResponse;

        return { ticker, data };
      })
    );

    return NextResponse.json(stockData, {
      status: 200,
      headers: {
        "Cache-Control": "public, s-maxage=300, stale-while-revalidate=59",
      },
    });
  } catch (error) {
    console.error("Error fetching stock data:", error);

    return NextResponse.json(
      {
        error: "Failed to fetch stock data",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}

import { dates } from "./utils";

export interface StockData {
  ticker: string;
  data: string;
}

export async function fetchStockData(tickers: string[]): Promise<StockData[]> {
  try {
    const stockData = await Promise.all(
      tickers.map(async (ticker) => {
        const url = `https://api.polygon.io/v2/aggs/ticker/${ticker}/range/1/day/${dates.startDate}/${dates.endDate}?apiKey=${process.env.NEXT_PUBLIC_POLYGON_API_KEY}`;
        const response = await fetch(url);
        const data = await response.text();
        if (response.status === 200) {
          return { ticker, data };
        }
        throw new Error(`Failed to fetch data for ${ticker}`);
      })
    );
    return stockData;
  } catch (err) {
    console.error("Error fetching stock data:", err);
    throw err;
  }
}

export async function generateReport(stockData: StockData[]): Promise<string> {
  try {
    // TODO: Implement AI report generation
    return `Sample report for tickers: ${stockData
      .map((d) => d.ticker)
      .join(", ")}`;
  } catch (err) {
    console.error("Error generating report:", err);
    throw err;
  }
}

"use client";

import React, { useState, useEffect } from "react";
import { Loader2, Plus } from "lucide-react";

export default function Home() {
  const [tickers, setTickers] = useState<string[]>([]);
  const [stockData, setStockData] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [apiMessage, setApiMessage] = useState<string>("");
  const [report, setReport] = useState<string>("");

  useEffect(() => {
    console.log("Current tickers:", tickers);
  }, [tickers]);

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = e.currentTarget;
    const input = form.querySelector("#ticker-input") as HTMLInputElement;
    const tickerValue = input.value.trim().toUpperCase();

    if (tickerValue.length > 2) {
      if (tickers.length >= 3) {
        alert("Maximum 3 tickers allowed!");
        return;
      }

      // Check if ticker already exists
      if (tickers.includes(tickerValue)) {
        alert("This ticker is already added!");
        return;
      }

      setTickers((prev) => [...prev, tickerValue]);
      input.value = "";
      console.log("Adding ticker:", tickerValue);
    } else {
      const label = form.querySelector("label");
      if (label) {
        label.style.color = "red";
        label.textContent =
          "You must add at least one ticker. A ticker is a 3 letter or more code for a stock. E.g TSLA for Tesla.";
      }
    }
  };

  const fetchStockData = async (tickers: string[]) => {
    setIsLoading(true);
    setApiMessage("Querying Stocks API...");

    try {
      const response = await fetch("/api/stock-data", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ tickers }),
      });

      if (response.status !== 200) {
        throw new Error("Failed to fetch stock data");
      }

      const data = await response.json();
      return data;
    } catch (error) {
      console.error("Error fetching stock data:", error);
      setApiMessage("Failed to fetch stock data");
      throw error;
    }
  };

  const handleGenerateReport = async () => {
    setIsLoading(true);
    setApiMessage("Querying Stocks API...");

    try {
      const stockData = await fetchStockData(tickers);
      setStockData(stockData);

      setApiMessage("Creating report...");

      const response = await fetch("/api/generate-report", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ stockData }),
      });

      if (!response.ok) {
        throw new Error("Failed to generate report");
      }

      const { report } = await response.json();
      setReport(report);
    } catch (error) {
      setApiMessage("Error generating report. Please try again.");
      console.error(error);
    } finally {
      setIsLoading(false);
      setTickers([]);
    }
  };

  if (isLoading) {
    return (
      <section className="h-[400px] flex flex-col justify-center items-center text-center space-y-4">
        <Loader2 className="w-16 h-16 animate-spin" />
        <div id="api-message">{apiMessage}</div>
      </section>
    );
  }

  return (
    <div>
      <section className="h-[350px] flex flex-col justify-around items-center my-6 mx-8">
        <form
          id="ticker-input-form"
          className="w-[360px] flex flex-col items-center"
          onSubmit={handleSubmit}
        >
          <label
            htmlFor="ticker-input"
            className="text-center p-[0.43em] text-[15px] mb-4 w-4/5"
          >
            Add up to 3 stock tickers below to get a stock prediction report
            generated using AI👇
          </label>

          <div className="flex w-[70%]">
            <input
              type="text"
              id="ticker-input"
              placeholder="MSFT"
              className="p-4 border-2 border-black border-r-0"
            />
            <button
              type="submit"
              className="flex items-center bg-white text-[3em] px-[0.35em] cursor-pointer border-2 border-black"
            >
              <Plus className="w-4 h-4" />
            </button>
          </div>
        </form>

        <div className="flex items-center min-h-[3em] gap-2 flex-wrap w-full justify-center">
          {tickers.length === 0 ? (
            <span className="text-gray-500">
              Your tickers will appear here...
            </span>
          ) : (
            <div className="flex flex-wrap gap-2 items-center justify-center">
              {tickers.map((ticker, index) => (
                <div key={`${ticker}-${index}`} className="flex items-center">
                  <div className="inline-flex items-center bg-[#f3f4f6] px-4 py-2 rounded-md">
                    <span>{ticker}</span>
                    <button
                      onClick={() => {
                        console.log("Removing ticker:", ticker);
                        setTickers((prev) => prev.filter((t) => t !== ticker));
                      }}
                      type="button"
                      aria-label={`Remove ${ticker}`}
                      className="ml-2 border-none bg-transparent text-[#ef4444] hover:text-[#b91c1c] cursor-pointer text-xl leading-none"
                    >
                      ×
                    </button>
                  </div>
                  {index < tickers.length - 1 && (
                    <span className="mx-1 text-gray-500">,</span>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>

        <button
          className="w-[70%] py-4 px-6 cursor-pointer font-['Poppins'] border-2 border-black bg-[#46ff90] uppercase font-medium tracking-wider text-[105%] disabled:opacity-50 disabled:cursor-not-allowed"
          type="button"
          disabled={tickers.length === 0 || isLoading}
          onClick={handleGenerateReport}
        >
          Generate Report
        </button>
        <p className="text-sm text-gray-600">Always correct 15% of the time!</p>
      </section>

      {report && !isLoading && (
        <section className="flex-col container mx-auto max-w-7xl justify-start items-center border-2 border-solid p-4 px-8 h-auto">
          <div className="space-y-4">
            <h2 className="text-center font-normal bg-gray-200 p-2 text-lg">
              Your Report 😜
            </h2>
            <p>{report}</p>
          </div>
        </section>
      )}
    </div>
  );
}

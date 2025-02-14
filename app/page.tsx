import { Plus } from "lucide-react";

export default function Home() {
  return (
    <div>
      {" "}
      <section className="h-[400px] container flex flex-col justify-around items-center my-4 mx-8">
        <form id="ticker-input-form">
          <label htmlFor="ticker-input">
            {" "}
            Add up to 3 stock tickers below to get a stock prediction report
            generated using AI👇{" "}
          </label>

          <div className="form-input-control">
            <input type="text" id="ticker-input" placeholder="MSFT" />
            <button className="add-ticker-btn">
              <Plus className="w-4 h-4" />
            </button>
          </div>
        </form>
        <p className="ticker-choice-display">
          Your tickers will appear here...
        </p>
        <button className="generate-report-btn" type="button" disabled>
          Generate Report
        </button>
        <p className="text-sm text-gray-600">Always correct 15% of the time!</p>
      </section>
      <section className="loading-panel">
        <img src="images/loader.svg" alt="loading" />
        <div id="api-message">Querying Stocks API...</div>
      </section>
      <section className="output-panel">
        <h2>Your Report 😜</h2>
      </section>
    </div>
  );
}

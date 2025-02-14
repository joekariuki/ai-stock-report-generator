export default function Home() {
  return (
    <div>
      {" "}
      <section className="action-panel">
        <form id="ticker-input-form">
          <label htmlFor="ticker-input">
            {" "}
            Add up to 3 stock tickers below to get a super accurate stock
            predictions report👇{" "}
          </label>
          <div className="form-input-control">
            <input type="text" id="ticker-input" placeholder="MSFT" />
            <button className="add-ticker-btn">
              <img src="images/add.svg" className="add-ticker-svg" alt="add" />
            </button>
          </div>
        </form>
        <p className="ticker-choice-display">
          Your tickers will appear here...
        </p>
        <button className="generate-report-btn" type="button" disabled>
          Generate Report
        </button>
        <p className="tag-line">Always correct 15% of the time!</p>
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

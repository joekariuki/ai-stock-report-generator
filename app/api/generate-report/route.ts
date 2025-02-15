import OpenAI from "openai";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export async function POST(request: Request) {
  const { stockData } = await request.json();

  if (!stockData || !Array.isArray(stockData)) {
    return new Response("Invalid stock data format", { status: 400 });
  }

  console.log("Received stock data:", JSON.stringify(stockData, null, 2));

  try {
    const response = await openai.chat.completions.create({
      model: "gpt-4",
      messages: [
        {
          role: "system",
          content:
            "You are a trading guru. Given data on share prices over the past 30 days, write a report of no more than 150 words describing the stocks performance and recommending whether to buy, hold or sell.",
        },
        {
          role: "user",
          content: `Here is the stock performance data:\n${stockData}`,
        },
      ],
    });

    const report = response.choices[0].message.content;
    console.log("Generated report:", report);

    return new Response(JSON.stringify({ report }), {
      status: 200,
      headers: {
        "Content-Type": "application/json",
      },
    });
  } catch (error) {
    console.error("Error generating report:", error);
    return new Response("Error generating report", { status: 500 });
  }
}

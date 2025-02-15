import OpenAI from "openai";

const openai = new OpenAI({
  apiKey: process.env.PENAI_API_KEY,
});

export async function POST(request: Request) {
  const { stockData } = await request.json();

  try {
    // TODO: Implement AI report generation
  } catch (error) {
    console.error("Error generating report:", error);
    return new Response("Error generating report", { status: 500 });
  }
}

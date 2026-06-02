import axios from "axios";

/**
 * Generate an AI-improved headline suggestion using OpenRouter.
 * @param {string} market - Target market name
 * @param {string} currentHeadline - Current headline text
 * @returns {{ suggestedHeadline: string, expectedLift: number, confidence: number }}
 */
export async function generateSuggestion(market, currentHeadline) {
  const apiKey = process.env.OPENROUTER_API_KEY;
  if (!apiKey) throw new Error("OPENROUTER_API_KEY is not set in .env");

  const prompt = `
You are an expert ecommerce marketing copywriter specializing in localized headline optimization.

Given:
- Market: ${market}
- Current Headline: "${currentHeadline}"

Return ONLY a valid JSON object (no markdown, no explanation) in this exact format:
{
  "suggestedHeadline": "your improved headline here",
  "expectedLift": 12,
  "confidence": 87
}

Rules:
- suggestedHeadline: A better, localized, high-converting version of the current headline for the ${market} market
- expectedLift: Integer between 5 and 25 (percentage conversion improvement expected)
- confidence: Integer between 60 and 98 (your confidence score)
- Return ONLY the JSON, nothing else
`;

  const response = await axios.post(
    "https://openrouter.ai/api/v1/chat/completions",
    {
      model: "openai/gpt-4o-mini",
      messages: [
        {
          role: "system",
          content: "You are a marketing optimization AI. Always respond with valid JSON only. No markdown. No explanation.",
        },
        {
          role: "user",
          content: prompt,
        },
      ],
    },
    {
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
        "HTTP-Referer": "https://localemate.app",
        "X-Title": "LocaleMate",
      },
      timeout: 30000,
    }
  );

  const content = response.data?.choices?.[0]?.message?.content;
  if (!content) throw new Error("No content returned from OpenRouter");

  // Parse JSON response from AI
  const parsed = JSON.parse(content.trim());

  return {
    suggestedHeadline: parsed.suggestedHeadline,
    expectedLift: parseInt(parsed.expectedLift, 10),
    confidence: parseInt(parsed.confidence, 10),
  };
}

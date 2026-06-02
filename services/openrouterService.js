import axios from "axios";

/**
 * Generates marketing campaign content using OpenRouter API.
 * @param {Object} campaignParams
 * @param {string} campaignParams.title
 * @param {string} campaignParams.market
 * @param {string} campaignParams.productType
 * @param {string} campaignParams.goal
 * @param {string} campaignParams.tone
 * @param {string} campaignParams.platform
 * @returns {Promise<string>} Generated campaign text
 */
export async function generateCampaignContent({
  title,
  market,
  productType,
  goal,
  tone,
  platform,
}) {
  const apiKey = process.env.OPENROUTER_API_KEY;
  if (!apiKey) {
    throw new Error("OPENROUTER_API_KEY is not defined in the environment.");
  }

  const prompt = `
Generate a high-converting marketing campaign with the following parameters:
- Campaign Title/Topic: ${title}
- Target Market: ${market}
- Product Type: ${productType || "General E-commerce"}
- Campaign Goal: ${goal || "Conversions"}
- Tone: ${tone || "Engaging"}
- Platform: ${platform || "All Social Media"}

Please structure your response clearly using the following sections in Markdown format:

### 📢 Headline
[Create a catchy, attention-grabbing headline]

### 📝 Ad Copy
[Write engaging body copy tailored for the selected platform and tone]

### ⚡ Call To Action (CTA)
[Create a strong, relevant CTA]

### 🎯 Target Audience Suggestions
[Suggest 2-3 specific audience demographics or interest profiles to target]

### 🏷️ Hashtags
[Provide 5-8 relevant hashtags]

### 💡 Marketing Strategy & Tips
[Briefly outline 2-3 quick tips for running this campaign successfully in this market]
`;

  try {
    const response = await axios.post(
      "https://openrouter.ai/api/v1/chat/completions",
      {
        model: "openai/gpt-4o-mini",
        messages: [
          {
            role: "system",
            content: "You are an expert global e-commerce marketer specializing in localized cultural nuances, high-converting copy, and multi-channel strategies.",
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
          "HTTP-Referer": "https://localemate.app", // Optional site referer for OpenRouter
          "X-Title": "LocaleMate", // Optional app title for OpenRouter
        },
      }
    );

    if (
      response.data &&
      response.data.choices &&
      response.data.choices[0] &&
      response.data.choices[0].message
    ) {
      return response.data.choices[0].message.content;
    } else {
      throw new Error("Invalid response format received from OpenRouter API.");
    }
  } catch (error) {
    console.error("OpenRouter Service Error:", error.response?.data || error.message);
    throw new Error(error.response?.data?.error?.message || error.message || "Failed to communicate with OpenRouter");
  }
}

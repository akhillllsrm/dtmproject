// From javascript_openai blueprint
// the newest OpenAI model is "gpt-5" which was released August 7, 2025. do not change this unless explicitly requested by the user
import OpenAI from "openai";

if (!process.env.OPENAI_API_KEY) {
  throw new Error("OPENAI_API_KEY must be set");
}

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

export async function streamChatCompletion(
  messages: Array<{ role: "user" | "assistant" | "system"; content: string }>,
  onChunk: (chunk: string) => void,
  onComplete: () => void
) {
  try {
    const stream = await openai.chat.completions.create({
      model: "gpt-5",
      messages,
      stream: true,
      max_completion_tokens: 8192,
    });

    for await (const chunk of stream) {
      const content = chunk.choices[0]?.delta?.content;
      if (content) {
        onChunk(content);
      }
    }
    
    onComplete();
  } catch (error) {
    console.error("OpenAI streaming error:", error);
    throw error;
  }
}

export async function getChatCompletion(
  messages: Array<{ role: "user" | "assistant" | "system"; content: string }>
): Promise<string> {
  try {
    const response = await openai.chat.completions.create({
      model: "gpt-5",
      messages,
      max_completion_tokens: 8192,
    });

    return response.choices[0].message.content || "";
  } catch (error) {
    console.error("OpenAI chat error:", error);
    throw error;
  }
}

export async function summarizeDiscussion(
  title: string,
  content: string,
  comments: Array<{ author: string; content: string }>
): Promise<string> {
  const commentsText = comments
    .map((c, i) => `Comment ${i + 1} by ${c.author}: ${c.content}`)
    .join("\n\n");

  const prompt = `Summarize this discussion concisely:\n\nTitle: ${title}\n\nOriginal Post:\n${content}\n\nComments:\n${commentsText}\n\nProvide a clear, concise summary highlighting the key question, main answers, and important points discussed.`;

  return getChatCompletion([
    {
      role: "system",
      content: "You are a helpful assistant that summarizes academic discussions. Provide clear, concise summaries that highlight the most important information.",
    },
    {
      role: "user",
      content: prompt,
    },
  ]);
}

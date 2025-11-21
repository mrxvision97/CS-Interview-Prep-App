import OpenAI from 'openai';
import { Message } from '../types';

export async function sendChatMessage(
  apiKey: string,
  model: string,
  temperature: number,
  messages: Message[],
  onChunk: (chunk: string) => void
): Promise<void> {
  const openai = new OpenAI({
    apiKey,
    dangerouslyAllowBrowser: true, // This is fine for a client-side app where users provide their own keys
  });

  try {
    const stream = await openai.chat.completions.create({
      model,
      messages: messages.map((m) => ({
        role: m.role as 'system' | 'user' | 'assistant',
        content: m.content,
      })),
      temperature,
      stream: true,
    });

    for await (const chunk of stream) {
      const content = chunk.choices[0]?.delta?.content;
      if (content) {
        onChunk(content);
      }
    }
  } catch (error) {
    if (error instanceof Error) {
      throw new Error(`OpenAI API Error: ${error.message}`);
    }
    throw error;
  }
}


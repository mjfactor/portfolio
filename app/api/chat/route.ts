import { google } from '@ai-sdk/google';
import { streamText } from 'ai';

// Allow streaming responses up to 30 seconds
export const maxDuration = 30;

interface ChatRequestBody {
    messages: any[];
}

export async function POST(req: Request) {
    const { messages } = await req.json() as ChatRequestBody;

    const result = streamText({
        model: google('gemini-2.5-flash'),
        system: "Don't Answer question yet about emjay, say that the developer emjay is currently working on RAG for this portfolio, so you can't answer questions yet about emjay.",
        messages,
    });

    return result.toDataStreamResponse();
}
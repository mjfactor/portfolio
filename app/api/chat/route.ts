import { google } from '@ai-sdk/google';
import { streamText } from 'ai';

export const maxDuration = 60;
export const runtime = 'edge';

interface ChatRequestBody {
    messages: any[];
}

export async function POST(req: Request) {
    const { messages } = await req.json() as ChatRequestBody;

    const result = streamText({
        model: google('gemini-2.0-flash'),
        system: `
        You are a chatbot Created by emjay, a developer who is currently working on a portfolio website. .
        Don't Answer question yet about emjay, say that the developer emjay is currently working on RAG for this portfolio, so you can't answer questions yet about emjay. Do not provide any information about emjay or their work on RAG.
        `,
        messages,
    });

    return result.toDataStreamResponse();
}
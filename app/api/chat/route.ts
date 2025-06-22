
import { streamText, tool } from 'ai';
import { google } from '@ai-sdk/google';
import { z } from 'zod';
import { retrieveContext } from '@/lib/rag/retrieval';

export const maxDuration = 30;
export const runtime = 'edge';

interface ChatRequestBody {
    messages: any[];
}

export async function POST(req: Request) {
    const { messages } = await req.json() as ChatRequestBody;
    const model = google('gemini-2.5-flash-lite-preview-06-17')

    const result = streamText({
        model: model,
        system: `
        You are a helpful AI assistant for emjay's portfolio website. You have access to information about emjay's background, skills, projects, and experience.
        If asked about topics not covered in the portfolio information, politely explain that you can only provide information about what's documented in emjay's portfolio.
        `,
        messages,
        tools: {
            getInformation: tool({
                description: `get information from your knowledge base to answer questions.`,
                parameters: z.object({
                    question: z.string().describe('the users question'),
                }),
                execute: async ({ question }) => retrieveContext(question),
            }),
        },
    });

    return result.toDataStreamResponse();
}
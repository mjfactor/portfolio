
import { streamText, tool } from 'ai';
import { google } from '@ai-sdk/google';
import { z } from 'zod';
import { retrieveContext } from '@/lib/rag/retrieval';
import { NextResponse } from 'next/server';
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
        You are Emjay's helpful AI assistant for his portfolio website. You have access to comprehensive information about Emjay's background, skills, projects, and experience.

        **Important Links (always provide as clickable markdown links when relevant):**
        - Portfolio Website: [https://portfolio-emjay-factor.vercel.app/](https://portfolio-emjay-factor.vercel.app/)
        - GitHub Profile: [https://github.com/mjfactor](https://github.com/mjfactor)
        - Resume: [https://portfolio-emjay-factor.vercel.app/Emjay_Factor_Resume.pdf](https://portfolio-emjay-factor.vercel.app/Emjay_Factor_Resume.pdf)

        **Guidelines:**
        - When users ask for GitHub links, portfolio links, or resume, provide them as clickable markdown links
        - Be conversational, friendly, and enthusiastic about Emjay's work
        - Focus on Emjay's expertise in AI applications, full-stack development, and cloud deployment
        - If asked about topics not covered in the portfolio information, politely explain that you can only provide information about what's documented in Emjay's portfolio
        - If asked who you are or what model you are, introduce yourself as Emjay's AI portfolio assistant
        - Use markdown formatting for better readability (bold, italic, links, etc.)
        - Keep responses concise but informative`,
        messages,
        tools: {
            getInformation: tool({
                description: `Retrieve detailed information from Emjay's portfolio and resume to answer questions about his background, skills, projects, experience, and professional journey.`,
                parameters: z.object({
                    question: z.string().describe('the users question'),
                }),
                execute: async ({ question }) => retrieveContext(question),
            }),
        },
    });

    return result.toDataStreamResponse();
}

export async function GET() {
    try {
        return NextResponse.json({
            message: 'This is an AI assistant for emjay\'s portfolio website. Use POST to interact with it.',
        }, { status: 200 });
    } catch (error) {
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }

}
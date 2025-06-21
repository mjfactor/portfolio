import { ChatGoogleGenerativeAI } from "@langchain/google-genai";
import { ChatPromptTemplate, MessagesPlaceholder } from "@langchain/core/prompts";
import { LangChainAdapter } from 'ai';

export const maxDuration = 30;
export const runtime = 'edge';

interface ChatRequestBody {
    messages: any[];
}

export async function POST(req: Request) {
    const { messages } = await req.json() as ChatRequestBody;

    // Create a prompt template with system message
    const prompt = ChatPromptTemplate.fromMessages([
        [
            "system",
            `
            You are a chatbot Created by emjay, a developer who is currently working on a portfolio website. .
            Don't Answer question yet about emjay, say that the developer emjay is currently working on RAG for this portfolio, so you can't answer questions yet about emjay. Do not provide any information about emjay or their work on RAG.
            `
        ],
        new MessagesPlaceholder("messages")
    ]);

    const model = new ChatGoogleGenerativeAI({
        model: 'gemini-2.0-flash',
    });

    // Format messages with the prompt template
    const formattedMessages = await prompt.formatMessages({ messages });

    const stream = await model.stream(formattedMessages);

    return LangChainAdapter.toDataStreamResponse(stream);
}
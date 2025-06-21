import { GoogleGenerativeAIEmbeddings } from "@langchain/google-genai";
import { TaskType } from "@google/generative-ai";
import {
    AzureAISearchVectorStore,
    AzureAISearchQueryType,
} from "@langchain/community/vectorstores/azure_aisearch";

// Shared embedding configuration to ensure consistency
function createEmbeddings(taskType: TaskType) {
    if (!process.env.GOOGLE_API_KEY) {
        throw new Error("❌ GOOGLE_API_KEY not found in environment variables");
    }

    return new GoogleGenerativeAIEmbeddings({
        model: "text-embedding-004",
        taskType,
        apiKey: process.env.GOOGLE_API_KEY,
    });
}

// Create a retriever instance that connects to your existing Azure AI Search index
export async function createRetriever() {
    try {
        // Validate Azure AI Search environment variables
        if (!process.env.AZURE_AISEARCH_ENDPOINT) {
            throw new Error("❌ AZURE_AISEARCH_ENDPOINT not found in environment variables");
        }
        if (!process.env.AZURE_AISEARCH_KEY) {
            throw new Error("❌ AZURE_AISEARCH_KEY not found in environment variables");
        }

        const embeddings = createEmbeddings(TaskType.RETRIEVAL_QUERY);

        const vectorStore = new AzureAISearchVectorStore(
            embeddings, {
            search: {
                type: AzureAISearchQueryType.SimilarityHybrid,
            },
        });

        return vectorStore.asRetriever({
            k: 3, 
            searchType: "similarity",
        });
    } catch (error) {
        console.error("Failed to create retriever:", error);
        throw error;
    }
}

export async function retrieveContext(query: string): Promise<string> {
    try {
        const retriever = await createRetriever();
        const docs = await retriever.invoke(query);

        if (!docs || docs.length === 0) {
            return "No relevant information found in the portfolio.";
        }
        return docs.map(doc => doc.pageContent).join("\n\n");
    } catch (error) {
        console.error("Error retrieving context:", error);
        return "Unable to retrieve portfolio information at this time.";
    }
}

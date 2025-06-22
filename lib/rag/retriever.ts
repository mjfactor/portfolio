import { GoogleGenerativeAIEmbeddings } from "@langchain/google-genai";
import { TaskType } from "@google/generative-ai";
import {
    AzureAISearchVectorStore,
    AzureAISearchQueryType,
} from "@langchain/community/vectorstores/azure_aisearch";

export async function createRetriever() {
    try {
        // Validate Azure AI Search environment variables
        if (!process.env.AZURE_AISEARCH_ENDPOINT) {
            throw new Error("❌ AZURE_AISEARCH_ENDPOINT not found in environment variables");
        }
        if (!process.env.AZURE_AISEARCH_KEY) {
            throw new Error("❌ AZURE_AISEARCH_KEY not found in environment variables");
        } const vectorStore = new AzureAISearchVectorStore(
            new GoogleGenerativeAIEmbeddings({
                model: "text-embedding-004",
                taskType: TaskType.RETRIEVAL_QUERY,
            }), {
            search: {
                type: AzureAISearchQueryType.SimilarityHybrid,
            },
            indexName: "emjay-portfolio",
        }); return vectorStore.asRetriever({
            k: 4,
            searchType: "similarity"
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
            return "No relevant information found in the resume.";
        }
        return docs.map(doc => doc.pageContent).join("\n\n");
    } catch (error) {
        console.error("Error retrieving context:", error);
        return "Unable to retrieve portfolio information at this time.";
    }
}

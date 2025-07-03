import { GoogleGenerativeAIEmbeddings } from "@langchain/google-genai";
import { TaskType } from "@google/generative-ai";
import {
    AzureAISearchVectorStore,
    AzureAISearchQueryType,
} from "@langchain/community/vectorstores/azure_aisearch";

export async function createPortfolioRetriever() {
    try {
        const vectorStore = new AzureAISearchVectorStore(
            new GoogleGenerativeAIEmbeddings({
                model: "text-embedding-004",
                taskType: TaskType.RETRIEVAL_QUERY,
            }),
            {
                search: {
                    type: AzureAISearchQueryType.SimilarityHybrid,
                },
                indexName: "emjay-portfolio",
            }
        );

        return vectorStore.asRetriever({
            k: 4,
            searchType: "similarity"
        });
    } catch (error) {
        console.error("Failed to create portfolio retriever:", error);
        throw error;
    }
}

export async function createResumeRetriever() {
    try {
        const vectorStore = new AzureAISearchVectorStore(
            new GoogleGenerativeAIEmbeddings({
                model: "text-embedding-004",
                taskType: TaskType.RETRIEVAL_QUERY,
            }),
            {
                search: {
                    type: AzureAISearchQueryType.SimilarityHybrid,
                },
                indexName: "emjay-resume",
            }
        );

        return vectorStore.asRetriever({
            k: 4,
            searchType: "similarity"
        });
    } catch (error) {
        console.error("Failed to create resume retriever:", error);
        throw error;
    }
}

// Backward compatibility - defaults to portfolio
export async function createRetriever() {
    return createPortfolioRetriever();
}

export async function retrievePortfolioContext(query: string): Promise<string> {
    try {
        const retriever = await createPortfolioRetriever();
        const docs = await retriever.invoke(query);

        if (!docs || docs.length === 0) {
            return "No relevant portfolio information found.";
        }
        return docs.map(doc => doc.pageContent).join("\n\n");
    } catch (error) {
        console.error("Error retrieving portfolio context:", error);
        return "Unable to retrieve portfolio information at this time.";
    }
}

export async function retrieveResumeContext(query: string): Promise<string> {
    try {
        const retriever = await createResumeRetriever();
        const docs = await retriever.invoke(query);

        if (!docs || docs.length === 0) {
            return "No relevant resume information found.";
        }
        return docs.map(doc => doc.pageContent).join("\n\n");
    } catch (error) {
        console.error("Error retrieving resume context:", error);
        return "Unable to retrieve resume information at this time.";
    }
}

export async function retrieveContext(query: string, source: 'portfolio' | 'resume' | 'both' = 'both'): Promise<string> {
    try {
        if (source === 'portfolio') {
            return await retrievePortfolioContext(query);
        } else if (source === 'resume') {
            return await retrieveResumeContext(query);
        } else {
            // Search both indexes and combine results
            const [portfolioContext, resumeContext] = await Promise.all([
                retrievePortfolioContext(query),
                retrieveResumeContext(query)
            ]);

            const contexts = [];
            if (portfolioContext && !portfolioContext.includes("No relevant portfolio information found")) {
                contexts.push(`Portfolio Information:\n${portfolioContext}`);
            }
            if (resumeContext && !resumeContext.includes("No relevant resume information found")) {
                contexts.push(`Resume Information:\n${resumeContext}`);
            }

            if (contexts.length === 0) {
                return "No relevant information found in portfolio or resume.";
            }

            return contexts.join("\n\n---\n\n");
        }
    } catch (error) {
        console.error("Error retrieving context:", error);
        return "Unable to retrieve information at this time.";
    }
}

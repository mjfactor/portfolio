import dotenv from 'dotenv';
import { PDFLoader } from "@langchain/community/document_loaders/fs/pdf";
import { JSONLoader } from "langchain/document_loaders/fs/json";
import { RecursiveCharacterTextSplitter } from "@langchain/textsplitters";
import { GoogleGenerativeAIEmbeddings } from "@langchain/google-genai";
import { TaskType } from "@google/generative-ai";
import {
    AzureAISearchVectorStore,
    AzureAISearchQueryType,
} from "@langchain/community/vectorstores/azure_aisearch";

// Load environment variables
dotenv.config();

// Shared embedding configuration (same as retriever)
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

async function setupRAG() {
    console.log("🚀 Starting RAG setup...");

    // Validate environment variables
    if (!process.env.AZURE_AISEARCH_ENDPOINT) {
        throw new Error("❌ AZURE_AISEARCH_ENDPOINT not found in environment variables");
    }
    if (!process.env.AZURE_AISEARCH_KEY) {
        throw new Error("❌ AZURE_AISEARCH_KEY not found in environment variables");
    }

    console.log("✅ Environment variables loaded successfully");
    console.log(`🔗 Azure endpoint: ${process.env.AZURE_AISEARCH_ENDPOINT}`);    // 1. Load PDF and JSON documents
    console.log("📄 Loading documents...");

    // Load PDF
    const pdfLoader = new PDFLoader("./data/portfolio.pdf");
    const pdfDocs = await pdfLoader.load();
    console.log(`✅ Loaded ${pdfDocs.length} pages from PDF`);

    // Load JSON
    const jsonLoader = new JSONLoader("./data/projects.json");
    const jsonDocs = await jsonLoader.load();
    console.log(`✅ Loaded ${jsonDocs.length} documents from JSON`);

    // Combine all documents
    const allDocs = [...pdfDocs, ...jsonDocs];
    console.log(`📊 Total documents: ${allDocs.length}`);

    // 2. Split into chunks    console.log("✂️ Splitting documents into chunks...");
    const splitter = new RecursiveCharacterTextSplitter({
        chunkSize: 1000,
        chunkOverlap: 200,
    });
    const allSplits = await splitter.splitDocuments(allDocs);
    console.log(`✅ Created ${allSplits.length} chunks`);

    // 3. Create embeddings and store in Azure AI Search
    console.log("🔗 Creating embeddings and indexing in Azure AI Search...");
    await AzureAISearchVectorStore.fromDocuments(
        allSplits,
        createEmbeddings(TaskType.RETRIEVAL_DOCUMENT), // Use shared configuration
        {
            search: {
                type: AzureAISearchQueryType.SimilarityHybrid,
            },
        }
    );

    console.log("✅ RAG setup complete! Your PDF and JSON documents are indexed.");
}

setupRAG().catch(console.error);

import dotenv from 'dotenv';
import { PlaywrightWebBaseLoader } from "@langchain/community/document_loaders/web/playwright";
import { RecursiveCharacterTextSplitter } from "@langchain/textsplitters";
import { GoogleGenerativeAIEmbeddings } from "@langchain/google-genai";
import { TaskType } from "@google/generative-ai";
import {
    AzureAISearchVectorStore,
    AzureAISearchQueryType,
} from "@langchain/community/vectorstores/azure_aisearch";
import type { Document } from "@langchain/core/documents";

// Load environment variables
dotenv.config();

// Configuration for websites to scrape
const WEBSITES_TO_SCRAPE = [
    "https://portfolio-emjay-factor.vercel.app/",
    // Add more URLs here if needed
];

async function loadWebsiteContent(): Promise<Document[]> {
    console.log("🌐 Loading website content...");
    const allWebDocs: Document[] = [];

    for (const url of WEBSITES_TO_SCRAPE) {
        try {
            console.log(`📥 Scraping: ${url}`);

            const webLoader = new PlaywrightWebBaseLoader(url, {
                launchOptions: {
                    headless: true,
                },
                gotoOptions: {
                    waitUntil: "domcontentloaded",
                },
                // Custom evaluate function to extract clean text content
                async evaluate(page) {
                    // Remove scripts, styles, and other non-content elements
                    await page.evaluate(() => {
                        const elementsToRemove = document.querySelectorAll('script, style, nav, footer, header, aside, .nav, .footer, .header');
                        elementsToRemove.forEach(el => el.remove());
                    });
                    // Extract main content, focusing on text-heavy elements
                    const result = await page.evaluate(() => {
                        const contentSelectors = [
                            'main',
                            '[role="main"]',
                            '.content',
                            '.main-content',
                            'article',
                            '.post',
                            '.page-content',
                            'body'
                        ];

                        for (const selector of contentSelectors) {
                            const element = document.querySelector(selector) as HTMLElement;
                            if (element) {
                                return element.innerText || element.textContent || '';
                            }
                        }

                        // Fallback to body content
                        return document.body.innerText || document.body.textContent || '';
                    });

                    return result;
                },
            });

            const webDocs = await webLoader.load();
            console.log(`✅ Loaded content from ${url} (${webDocs[0]?.pageContent.length || 0} characters)`);

            // Add URL metadata to documents
            webDocs.forEach(doc => {
                doc.metadata = {
                    ...doc.metadata,
                    source: url,
                    type: 'website',
                };
            });

            allWebDocs.push(...webDocs);
        } catch (error) {
            console.error(`❌ Failed to scrape ${url}:`, error);
            // Continue with other URLs even if one fails
        }
    }

    console.log(`✅ Total website documents loaded: ${allWebDocs.length}`);
    return allWebDocs;
}

async function setupRAG() {
    console.log("🚀 Starting RAG setup...");

    // Validate environment variables
    if (!process.env.AZURE_AISEARCH_ENDPOINT) {
        throw new Error("❌ AZURE_AISEARCH_ENDPOINT not found in environment variables");
    }
    if (!process.env.AZURE_AISEARCH_KEY) {
        throw new Error("❌ AZURE_AISEARCH_KEY not found in environment variables");
    } console.log("✅ Environment variables loaded successfully");
    console.log(`🔗 Azure endpoint: ${process.env.AZURE_AISEARCH_ENDPOINT}`);
    console.log("📄 Loading documents...");

    // Load website content
    const webDocs = await loadWebsiteContent();

    // Split documents into chunks
    console.log("✂️ Splitting documents into chunks...");
    const splitter = new RecursiveCharacterTextSplitter({
        chunkSize: 1000,
        chunkOverlap: 200,
    });
    const allSplits = await splitter.splitDocuments(webDocs);
    console.log(`✅ Created ${allSplits.length} chunks`);

    // Create embeddings and store in Azure AI Search
    console.log("🔗 Creating embeddings and indexing in Azure AI Search...");
    await AzureAISearchVectorStore.fromDocuments(
        allSplits,
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
    ); console.log("✅ RAG setup complete! Your website documents are indexed.");
}

setupRAG().catch(console.error);

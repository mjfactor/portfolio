import dotenv from 'dotenv';
import { PlaywrightWebBaseLoader } from "@langchain/community/document_loaders/web/playwright";
import { WebPDFLoader } from "@langchain/community/document_loaders/web/pdf";
import { RecursiveCharacterTextSplitter } from "@langchain/textsplitters";
import { GoogleGenerativeAIEmbeddings } from "@langchain/google-genai";
import { TaskType } from "@google/generative-ai";
import {
    AzureAISearchVectorStore,
    AzureAISearchQueryType,
} from "@langchain/community/vectorstores/azure_aisearch";
import { SearchIndexClient, AzureKeyCredential } from "@azure/search-documents";
import type { Document } from "@langchain/core/documents";

// Load environment variables
dotenv.config();

// Configuration for websites and documents to scrape
const WEBSITES_TO_SCRAPE = [
    "https://portfolio-emjay-factor.vercel.app/",
];

const PDF_URLS_TO_SCRAPE = [
    "https://portfolio-emjay-factor.vercel.app/Emjay_Factor_Resume.pdf"
];

async function loadPDFContent(): Promise<Document[]> {
    console.log("📄 Loading PDF content...");
    const allPDFDocs: Document[] = [];

    for (const url of PDF_URLS_TO_SCRAPE) {
        try {
            console.log(`📥 Loading PDF: ${url}`);

            // Fetch the PDF as a blob
            const response = await fetch(url);
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            const blob = await response.blob();
            const pdfLoader = new WebPDFLoader(blob, {
                splitPages: false, // Keep PDF content as single document
            });

            const pdfDocs = await pdfLoader.load();
            console.log(`✅ Loaded PDF content from ${url} (${pdfDocs[0]?.pageContent.length || 0} characters)`);

            // Add URL metadata to documents
            pdfDocs.forEach(doc => {
                doc.metadata = {
                    ...doc.metadata,
                    source: url,
                    type: 'pdf',
                };
            });

            allPDFDocs.push(...pdfDocs);
        } catch (error) {
            console.error(`❌ Failed to load PDF ${url}:`, error);
            // Continue with other PDFs even if one fails
        }
    }

    console.log(`✅ Total PDF documents loaded: ${allPDFDocs.length}`);
    return allPDFDocs;
}

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

async function prepareDocuments(): Promise<Document[]> {
    console.log("📄 Loading documents...");

    // Load website content and PDF content separately
    const webDocs = await loadWebsiteContent();
    const pdfDocs = await loadPDFContent();

    // Combine all documents
    const allDocs = [...webDocs, ...pdfDocs];

    // Split documents into chunks
    console.log("✂️ Splitting documents into chunks...");
    const splitter = new RecursiveCharacterTextSplitter({
        chunkSize: 1000,
        chunkOverlap: 200,
    });
    const allSplits = await splitter.splitDocuments(allDocs);
    console.log(`✅ Created ${allSplits.length} chunks`);

    return allSplits;
}

async function createIndexFromDocuments(documents: Document[], indexName: string = "emjay-portfolio"): Promise<void> {
    console.log("🔗 Creating embeddings and indexing in Azure AI Search...");
    await AzureAISearchVectorStore.fromDocuments(
        documents,
        new GoogleGenerativeAIEmbeddings({
            model: "text-embedding-004",
            taskType: TaskType.RETRIEVAL_QUERY,
        }),
        {
            search: {
                type: AzureAISearchQueryType.SimilarityHybrid,
            },
            indexName,
        }
    );
}

export async function createIndex() {
    console.log("🚀 Starting RAG setup...");

    const documents = await prepareDocuments();
    await createIndexFromDocuments(documents);

    console.log("✅ RAG setup complete! Your website documents are indexed.");
}

export async function recreateIndex(indexName: string = "emjay-portfolio"): Promise<void> {
    try {
        // Validate credentials first
        if (!process.env.AZURE_AISEARCH_ENDPOINT || !process.env.AZURE_AISEARCH_KEY) {
            throw new Error("Azure AI Search credentials not found");
        }

        console.log("🧪 Testing website scraping before modifying index...");

        // First, try to scrape and prepare documents
        // If this fails, we exit early without touching the existing index
        let documents: Document[];
        try {
            documents = await prepareDocuments();

            if (documents.length === 0) {
                throw new Error("No documents were successfully scraped from the website");
            }

            console.log(`✅ Successfully prepared ${documents.length} document chunks for indexing`);
        } catch (scrapeError) {
            console.error("❌ Website scraping failed. Preserving existing index.");
            console.error("Scraping error:", scrapeError);
            throw new Error(`Scraping failed: ${scrapeError instanceof Error ? scrapeError.message : 'Unknown error'}`);
        }

        // Only proceed to delete and recreate the index if scraping was successful
        console.log("🗑️ Scraping successful. Now safely replacing the existing index...");

        const indexClient = new SearchIndexClient(
            process.env.AZURE_AISEARCH_ENDPOINT,
            new AzureKeyCredential(process.env.AZURE_AISEARCH_KEY)
        );

        // Delete existing index
        try {
            await indexClient.deleteIndex(indexName);
            console.log(`✅ Successfully deleted existing index: ${indexName}`);
        } catch (error: any) {
            if (error.statusCode !== 404) {
                console.error("Failed to delete existing index:", error);
                throw error;
            }
            console.log(`ℹ️ Index ${indexName} did not exist, creating fresh index`);
        }

        // Create new index with the successfully scraped documents
        console.log("🔄 Creating new index with fresh data...");
        await createIndexFromDocuments(documents, indexName);

        console.log("✅ Index recreation completed successfully!");

    } catch (error) {
        console.error("❌ Failed to recreate index:", error);
        throw error;
    }
}

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

interface PreparedDocuments {
    portfolioDocuments: Document[];
    resumeDocuments: Document[];
}

async function prepareDocuments(): Promise<PreparedDocuments> {
    console.log("📄 Loading documents...");

    // Load website content and PDF content separately
    const webDocs = await loadWebsiteContent();
    const pdfDocs = await loadPDFContent();

    // Add document type metadata
    webDocs.forEach(doc => {
        doc.metadata = {
            ...doc.metadata,
            documentType: 'portfolio',
            indexType: 'portfolio'
        };
    });

    pdfDocs.forEach(doc => {
        doc.metadata = {
            ...doc.metadata,
            documentType: 'resume',
            indexType: 'resume'
        };
    });

    // Split documents into chunks
    console.log("✂️ Splitting portfolio documents into chunks...");
    const portfolioSplitter = new RecursiveCharacterTextSplitter({
        chunkSize: 1000,
        chunkOverlap: 200,
    });
    const portfolioSplits = await portfolioSplitter.splitDocuments(webDocs);
    console.log(`✅ Created ${portfolioSplits.length} portfolio chunks`);

    console.log("✂️ Splitting resume documents into chunks...");
    const resumeSplitter = new RecursiveCharacterTextSplitter({
        chunkSize: 1000,
        chunkOverlap: 200,
    });
    const resumeSplits = await resumeSplitter.splitDocuments(pdfDocs);
    console.log(`✅ Created ${resumeSplits.length} resume chunks`);

    return {
        portfolioDocuments: portfolioSplits,
        resumeDocuments: resumeSplits
    };
}

async function createPortfolioIndex(documents: Document[], indexName: string = "emjay-portfolio"): Promise<void> {
    console.log("🔗 Creating embeddings and indexing portfolio documents in Azure AI Search...");
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
    console.log(`✅ Portfolio index '${indexName}' created successfully`);
}

async function createResumeIndex(documents: Document[], indexName: string = "emjay-resume"): Promise<void> {
    console.log("🔗 Creating embeddings and indexing resume documents in Azure AI Search...");
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
    console.log(`✅ Resume index '${indexName}' created successfully`);
}

export async function createIndex() {
    console.log("🚀 Starting RAG setup...");

    const documents = await prepareDocuments();

    // Create portfolio index
    await createPortfolioIndex(documents.portfolioDocuments);

    // Create resume index  
    await createResumeIndex(documents.resumeDocuments);

    console.log("✅ RAG setup complete! Both portfolio and resume documents are indexed.");
}

export async function recreateIndex(portfolioIndexName: string = "emjay-portfolio", resumeIndexName: string = "emjay-resume"): Promise<void> {
    try {
        // Validate credentials first
        if (!process.env.AZURE_AISEARCH_ENDPOINT || !process.env.AZURE_AISEARCH_KEY) {
            throw new Error("Azure AI Search credentials not found");
        }

        console.log("🧪 Testing website scraping before modifying indexes...");

        // First, try to scrape and prepare documents
        // If this fails, we exit early without touching the existing indexes
        let documents: PreparedDocuments;
        try {
            documents = await prepareDocuments();

            if (documents.portfolioDocuments.length === 0 && documents.resumeDocuments.length === 0) {
                throw new Error("No documents were successfully scraped from the website or PDF");
            }

            console.log(`✅ Successfully prepared ${documents.portfolioDocuments.length} portfolio chunks and ${documents.resumeDocuments.length} resume chunks for indexing`);
        } catch (scrapeError) {
            console.error("❌ Website scraping failed. Preserving existing indexes.");
            console.error("Scraping error:", scrapeError);
            throw new Error(`Scraping failed: ${scrapeError instanceof Error ? scrapeError.message : 'Unknown error'}`);
        }

        // Only proceed to delete and recreate the indexes if scraping was successful
        console.log("🗑️ Scraping successful. Now safely replacing the existing indexes...");

        const indexClient = new SearchIndexClient(
            process.env.AZURE_AISEARCH_ENDPOINT,
            new AzureKeyCredential(process.env.AZURE_AISEARCH_KEY)
        );

        // Delete existing portfolio index
        try {
            await indexClient.deleteIndex(portfolioIndexName);
            console.log(`✅ Successfully deleted existing portfolio index: ${portfolioIndexName}`);
        } catch (error: any) {
            if (error.statusCode !== 404) {
                console.error("Failed to delete existing portfolio index:", error);
                throw error;
            }
            console.log(`ℹ️ Portfolio index ${portfolioIndexName} did not exist, creating fresh index`);
        }

        // Delete existing resume index
        try {
            await indexClient.deleteIndex(resumeIndexName);
            console.log(`✅ Successfully deleted existing resume index: ${resumeIndexName}`);
        } catch (error: any) {
            if (error.statusCode !== 404) {
                console.error("Failed to delete existing resume index:", error);
                throw error;
            }
            console.log(`ℹ️ Resume index ${resumeIndexName} did not exist, creating fresh index`);
        }

        // Create new indexes with the successfully scraped documents
        console.log("🔄 Creating new indexes with fresh data...");

        // Create portfolio index
        await createPortfolioIndex(documents.portfolioDocuments, portfolioIndexName);

        // Create resume index
        await createResumeIndex(documents.resumeDocuments, resumeIndexName);

        console.log("✅ Index recreation completed successfully! Both portfolio and resume indexes have been updated.");

    } catch (error) {
        console.error("❌ Failed to recreate indexes:", error);
        throw error;
    }
}

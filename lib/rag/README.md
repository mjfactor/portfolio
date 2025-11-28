# RAG (Retrieval-Augmented Generation) — `lib/rag`

This README explains how the RAG pipeline in `lib/rag` works and shows step-by-step instructions to add a new knowledge base (index) to the system. It covers file responsibilities, required environment variables, example commands, common configuration changes, and troubleshooting tips.

**Overview**
- **Purpose**: The `lib/rag` folder implements ingestion (scraping + chunking + embedding) and retrieval for the portfolio site's RAG system.
- **Primary files**:
  - `retrieval.ts`: Search / retrieval logic used by the chat API to query vector indexes and return context for the model.
  - `scraper.ts`: Scraper and document loader logic — collects documents (site pages, PDFs), chunking parameters, and prepares data for embedding.
  - `runRecreateIndex.ts`: Orchestrates recreating Azure AI Search indexes (delete+create+upload embeddings) and calls the scraper & embedding pipeline.

**Prerequisites / Environment**
- Make sure the following environment variables are set (typical names used in this project):
  - `GOOGLE_AI_API_KEY` — API key for Google AI embeddings/chat (or your configured embedding provider).
  - `AZURE_AISEARCH_ENDPOINT` — Azure AI Search endpoint for vector index storage.
  - `AZURE_AISEARCH_KEY` — Admin key for Azure AI Search.
- Ensure dependencies are installed: `pnpm install` (this repo uses `pnpm`).

**How the pipeline works (high-level)**
1. `scraper.ts` collects source documents (website pages, local PDFs).
2. Documents are chunked (default in this repo: 1000 characters with 200 overlap — changeable in `scraper.ts`).
3. Chunks are passed to an embedding provider (Google AI in this project) to generate vector embeddings.
4. Vectors + metadata are uploaded to Azure AI Search indexes via `runRecreateIndex.ts`.
5. `retrieval.ts` performs vector search against the index(s) at query time and returns relevant document text to the chat pipeline.

**Add a new knowledge base (step-by-step)**
Follow these steps to add a new source (knowledge base) — e.g., a new site, docs set, or PDF collection.

- **1) Choose the source type**: website URL(s), PDF(s), or a directory of markdown files.

- **2) Add the source to `scraper.ts`**
  - Open `lib/rag/scraper.ts` and find the `sources` / `loaders` / `document list` configuration.
  - Add a new entry describing the source. Example pseudo-change:

```ts
// lib/rag/scraper.ts (example snippet)
const sources = [
  // existing sources
  { type: 'website', url: 'https://portfolio-emjay-factor.vercel.app/' },
  { type: 'pdf', path: 'public/Emjay_Factor_Resume.pdf' },
  // NEW: add your new KB
  { type: 'website', url: 'https://docs.example.com/' },
  // or local markdown dir
  { type: 'dir', path: 'content/docs-new-kb' },
];
```

  - If adding PDFs, place them under `public/` or a path accessible to the scraper, then reference that path.
  - If adding a private/internal source, ensure credentials/robots rules are respected.

- **3) Configure chunking & metadata**
  - In `scraper.ts` find chunk settings (e.g., `chunkSize`, `chunkOverlap`). Adjust if your documents are either very long (increase chunk size) or require finer granularity (decrease chunk size).
  - Make sure metadata includes keys you want returned (e.g., `source`, `url`, `title`, `pageNumber`). This metadata is useful during retrieval and for traceability.

- **4) Update index name(s) (optional)**
  - `runRecreateIndex.ts` may define index names like `emjay-portfolio` and `emjay-resume`. For a separate KB, pick a unique index name (e.g., `docs-example-com`) so you can keep indices separate.
  - Example variable you'd edit in `runRecreateIndex.ts`:

```ts
const INDEX_NAME = 'docs-example-com';
```

- **5) Recreate / update the index**
  - Run the script that orchestrates scraping, embedding, and index upload. The repository includes RAG scripts — use the existing npm/pnpm script if available. Common commands for this project:

```pwsh
# From project root (PowerShell)
pnpm run rag:scrape
# or, if a script exists to recreate the index
pnpm run rag:recreate-index
```

  - If those scripts are not defined, run the TypeScript runner directly (example using `ts-node` if available):

```pwsh
pnpm dlx ts-node-esm lib/rag/runRecreateIndex.ts
```

  - The script will: scrape configured sources, create chunks, request embeddings, and upload vectors to Azure AI Search.

- **6) Verify index and documents**
  - After the job completes, open Azure AI Search portal (or use the REST API) to verify:
    - The index `docs-example-com` exists.
    - Documents/chunks were uploaded and have embeddings and metadata.
  - You can also run a quick test using `retrieval.ts` or the app's chat route locally to verify retrieval.

**Using `retrieval.ts` at query time**
- `retrieval.ts` is used by the chat API (see `app/api/chat/route.ts`) to perform vector search.
- Common behavior:
  - Accepts a query string.
  - Calls Azure AI Search vector search across one or more index names.
  - Returns ranked document chunks with metadata.
- If you've created a new index, ensure `retrieval.ts` queries it (either by default or via configuration params).

**Recommended chunk and embedding parameters**
- Chunk size: 800–1200 characters works well for long-form docs.
- Overlap: 100–300 characters to preserve context across chunk boundaries.
- Embedding model: use the same embedding provider across KBs for consistent vector space (project uses Google AI embeddings).

**Common troubleshooting**
- Index shows zero documents:
  - Check the scraper logs — ensure the loader found documents and produced chunks.
  - Confirm embedding calls succeeded (no API key errors).
  - Check that `runRecreateIndex.ts` did not early-exit due to an error.
- Embeddings failing / 401 or permission errors:
  - Verify `GOOGLE_AI_API_KEY` (or whichever provider) is set and valid.
  - For Azure: ensure `AZURE_AISEARCH_KEY` has admin privileges for index creation.
- Retrieval returns irrelevant results:
  - Confirm chunking settings (too large chunks reduce relevance granularity).
  - Ensure the retrieval pipeline is searching the intended index name.
- Large scraping jobs time out or are slow:
  - Run indexing in a machine with good network & CPU.
  - Consider batching uploads and adding retry/backoff logic in `runRecreateIndex.ts`.

**Validation and testing**
- Quick local test using Node/REPL:
  - Start development server:

```pwsh
pnpm dev
```

  - POST a test query to the chat API or run a small script that imports `retrieval.ts` and calls the query function directly (example snippet):

```ts
import { retrieve } from './lib/rag/retrieval';
(async () => {
  const results = await retrieve('How do I contact Emjay?');
  console.log(results);
})();
```

- Use Azure Search REST API or portal to run vector queries directly for validation.

**Security & privacy**
- Do not index private sensitive data without appropriate access controls and data handling policies.
- Keep API keys out of source control; store them in environment variables or secure secrets stores.

**Files & code pointers**
- `lib/rag/scraper.ts` — add sources, adjust chunking, and configure loaders.
- `lib/rag/runRecreateIndex.ts` — index names and orchestration for embedding + upload.
- `lib/rag/retrieval.ts` — retrieval logic; ensure it references the new index or accepts index names as parameters.
- `app/api/chat/route.ts` — the chat route consumes `retrieval.ts`; check how query-time indexes are passed.

**Next steps / checklist**
- [ ] Add source(s) to `lib/rag/scraper.ts`.
- [ ] Pick or create an index name in `runRecreateIndex.ts`.
- [ ] Ensure env vars are present and valid.
- [ ] Run `pnpm run rag:scrape` (or the appropriate script) and verify in Azure.
- [ ] Run a test query through the chat API.

**Need help?**
- I can open the files and add a commented example change to `scraper.ts` and `runRecreateIndex.ts` for the KB you want to add.
- Want me to run the indexing locally (I can prepare the exact `pnpm` command and the small script to test retrieval)?

---

If you'd like, tell me the new knowledge source (URL or path) and I will prepare the exact code snippet to insert into `lib/rag/scraper.ts` and update `runRecreateIndex.ts` with a named index and run instructions.

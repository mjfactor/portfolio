import { recreateIndex } from './scraper';

async function run() {
    try {
        await recreateIndex();
        console.log('✅ Index recreation process completed successfully.');
    } catch (error) {
        console.error('❌ An error occurred during the index recreation process:', error);
        process.exit(1);
    }
}

run();

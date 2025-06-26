import { NextRequest, NextResponse } from 'next/server';
import { recreateIndex } from '@/lib/rag/scraper';

export async function POST(request: NextRequest) {
    try {
        // Verify the request is from Vercel (optional security)
        const authHeader = request.headers.get('authorization');
        const expectedToken = process.env.RECREATE_INDEX_SECRET;

        if (expectedToken && authHeader !== `Bearer ${expectedToken}`) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        console.log('🚀 Starting index recreation from Vercel deployment...');

        await recreateIndex();

        console.log('✅ Index recreation completed successfully from Vercel');

        return NextResponse.json({
            success: true,
            message: 'Index recreation completed successfully',
            timestamp: new Date().toISOString()
        });

    } catch (error) {
        console.error('❌ Index recreation failed:', error);

        return NextResponse.json({
            success: false,
            error: error instanceof Error ? error.message : 'Unknown error',
            timestamp: new Date().toISOString()
        }, { status: 500 });
    }
}

// Allow GET for testing
export async function GET() {
    return NextResponse.json({
        message: 'Index recreation endpoint is ready',
        timestamp: new Date().toISOString()
    });
}

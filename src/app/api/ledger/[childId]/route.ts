import { NextRequest, NextResponse } from 'next/server';
import { getChildLedger, getChildStarTotal } from '@/lib/services/ledgerService';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ childId: string }> }
) {
  try {
    const { childId } = await params;
    
    if (!childId) {
      return NextResponse.json(
        { error: 'Child ID required' },
        { status: 400 }
      );
    }

    const ledger = await getChildLedger(childId);
    return NextResponse.json(ledger);
  } catch (error) {
    console.error('Error fetching ledger:', error);
    return NextResponse.json(
      { error: 'Failed to fetch ledger' },
      { status: 500 }
    );
  }
}

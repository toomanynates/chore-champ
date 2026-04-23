import { NextRequest, NextResponse } from 'next/server';
import { createLedgerEntry } from '@/lib/services/ledgerService';

export async function POST(request: NextRequest) {
  try {
    const { childId, delta, reason } = await request.json();
    
    if (!childId || delta === undefined || !reason) {
      return NextResponse.json(
        { error: 'Missing required fields: childId, delta, reason' },
        { status: 400 }
      );
    }

    if (typeof delta !== 'number') {
      return NextResponse.json(
        { error: 'Delta must be a number' },
        { status: 400 }
      );
    }

    const entry = await createLedgerEntry(childId, delta, reason);
    
    return NextResponse.json(entry, { status: 201 });
  } catch (error) {
    console.error('Error creating manual ledger entry:', error);
    return NextResponse.json(
      { error: 'Failed to create ledger entry' },
      { status: 500 }
    );
  }
}

import { NextRequest, NextResponse } from 'next/server';
import { getChildStarTotal } from '@/lib/services/ledgerService';

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

    const total = await getChildStarTotal(childId);
    return NextResponse.json({ starTotal: total, childId });
  } catch (error) {
    console.error('Error calculating star total:', error);
    return NextResponse.json(
      { error: 'Failed to calculate star total' },
      { status: 500 }
    );
  }
}

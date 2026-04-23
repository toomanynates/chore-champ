import { NextRequest, NextResponse } from 'next/server';
import { approveTaskCompletion } from '@/lib/services/taskCompletionService';
import { createLedgerEntry } from '@/lib/services/ledgerService';

export async function POST(request: NextRequest) {
  try {
    const { completionId, childId, taskId, starValue } = await request.json();
    
    if (!completionId || !childId || !taskId || starValue === undefined) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    await approveTaskCompletion(completionId, childId, taskId, starValue);
    
    // Create ledger entry with star reward
    await createLedgerEntry(childId, starValue, `Task completed: ${taskId}`, completionId);

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error approving task completion:', error);
    return NextResponse.json(
      { error: 'Failed to approve task' },
      { status: 500 }
    );
  }
}

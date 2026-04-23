import { NextRequest, NextResponse } from 'next/server';
import { createTaskCompletion } from '@/lib/services/taskCompletionService';
import { createLedgerEntry } from '@/lib/services/ledgerService';

export async function POST(request: NextRequest) {
  try {
    const { taskId, childId, starValue } = await request.json();
    
    if (!taskId || !childId) {
      return NextResponse.json(
        { error: 'Task ID and Child ID required' },
        { status: 400 }
      );
    }

    const completion = await createTaskCompletion(taskId, childId);
    
    // TODO: Create notification for parent
    // TODO: For now, auto-approve (v1 simple flow)
    // In v1, we'll manually approve. In v2, could have auto-approval.

    return NextResponse.json(completion, { status: 201 });
  } catch (error) {
    console.error('Error creating task completion:', error);
    return NextResponse.json(
      { error: 'Failed to mark task complete' },
      { status: 500 }
    );
  }
}

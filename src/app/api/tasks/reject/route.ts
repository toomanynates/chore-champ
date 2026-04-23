import { NextRequest, NextResponse } from 'next/server';
import { rejectTaskCompletion } from '@/lib/services/taskCompletionService';

export async function POST(request: NextRequest) {
  try {
    const { completionId } = await request.json();
    
    if (!completionId) {
      return NextResponse.json(
        { error: 'Completion ID required' },
        { status: 400 }
      );
    }

    await rejectTaskCompletion(completionId);

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error rejecting task completion:', error);
    return NextResponse.json(
      { error: 'Failed to reject task' },
      { status: 500 }
    );
  }
}

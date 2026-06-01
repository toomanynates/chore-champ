import { NextRequest, NextResponse } from 'next/server';
import { getTasksForChild } from '@/lib/services/taskService';

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

    const tasks = await getTasksForChild(childId);
    return NextResponse.json(tasks);
  } catch (error) {
    console.error('Error fetching child tasks:', error instanceof Error ? error.message : error);
    console.error(error);
    const message = error instanceof Error ? error.message : String(error);
    return NextResponse.json(
      { error: 'Failed to fetch tasks', details: message },
      { status: 500 }
    );
  }
}

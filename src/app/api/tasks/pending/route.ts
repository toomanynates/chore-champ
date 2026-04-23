import { NextRequest, NextResponse } from 'next/server';
import { getPendingCompletions } from '@/lib/services/taskCompletionService';

export async function GET(request: NextRequest) {
  try {
    const parentId = request.headers.get('x-parent-id');
    
    if (!parentId) {
      return NextResponse.json(
        { error: 'Parent ID required' },
        { status: 400 }
      );
    }

    // TODO: Filter by parent's children only
    const completions = await getPendingCompletions(parentId);
    return NextResponse.json(completions);
  } catch (error) {
    console.error('Error fetching pending completions:', error);
    return NextResponse.json(
      { error: 'Failed to fetch pending completions' },
      { status: 500 }
    );
  }
}

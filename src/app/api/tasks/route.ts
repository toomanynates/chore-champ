import { NextRequest, NextResponse } from 'next/server';
import { getTasksByParent, createTask, updateTask, deleteTask } from '@/lib/services/taskService';

// GET all tasks for parent or POST to create task
export async function GET(request: NextRequest) {
  try {
    const parentId = request.headers.get('x-parent-id');
    console.log('[API GET /tasks] parentId:', parentId);
    
    if (!parentId) {
      return NextResponse.json(
        { error: 'Parent ID required' },
        { status: 400 }
      );
    }

    console.log('[API GET /tasks] Calling getTasksByParent...');
    const tasks = await getTasksByParent(parentId);
    console.log('[API GET /tasks] Success, returning tasks');
    return NextResponse.json(tasks);
  } catch (error) {
    console.error('Error fetching tasks:', error);
    const errorMessage = error instanceof Error ? error.message : String(error);
    console.error('Error details:', errorMessage);
    return NextResponse.json(
      { error: 'Failed to fetch tasks', details: errorMessage },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const parentId = request.headers.get('x-parent-id');
    
    if (!parentId) {
      return NextResponse.json(
        { error: 'Parent ID required' },
        { status: 400 }
      );
    }

    const body = await request.json();
    const task = await createTask(parentId, body);
    
    return NextResponse.json(task, { status: 201 });
  } catch (error) {
    console.error('Error creating task:', error);
    return NextResponse.json(
      { error: 'Failed to create task' },
      { status: 500 }
    );
  }
}

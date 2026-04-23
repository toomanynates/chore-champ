import { NextRequest, NextResponse } from 'next/server';
import { getTasksByParent, createTask, updateTask, deleteTask } from '@/lib/services/taskService';

// GET all tasks for parent or POST to create task
export async function GET(request: NextRequest) {
  try {
    const parentId = request.headers.get('x-parent-id');
    
    if (!parentId) {
      return NextResponse.json(
        { error: 'Parent ID required' },
        { status: 400 }
      );
    }

    const tasks = await getTasksByParent(parentId);
    return NextResponse.json(tasks);
  } catch (error) {
    console.error('Error fetching tasks:', error);
    return NextResponse.json(
      { error: 'Failed to fetch tasks' },
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

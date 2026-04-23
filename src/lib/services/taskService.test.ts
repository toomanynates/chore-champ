import { describe, it, expect, vi, beforeEach } from 'vitest';
import { addDoc, getDoc, getDocs, query, where } from 'firebase/firestore';
import { createTask, getTaskById, getTasksByParent, getTasksForChild, isTaskDueToday } from './taskService';
import { Task } from '@/lib/types';

vi.mock('@/lib/firebase/config', () => ({
  db: {},
}));

vi.mock('firebase/firestore', () => ({
  collection: vi.fn((db: unknown, name: string) => ({ db, name })),
  addDoc: vi.fn(),
  updateDoc: vi.fn(),
  deleteDoc: vi.fn(),
  doc: vi.fn((db: unknown, collection: string, id: string) => ({ db, collection, id })),
  getDoc: vi.fn(),
  getDocs: vi.fn(),
  query: vi.fn((...args: unknown[]) => args),
  where: vi.fn((...args: unknown[]) => args),
  Timestamp: {
    now: vi.fn(() => ({ seconds: 0, nanoseconds: 0 })),
  },
}));

const mockAddDoc = vi.mocked(addDoc);
const mockGetDoc = vi.mocked(getDoc);
const mockGetDocs = vi.mocked(getDocs);

const sampleTaskData: Omit<Task, 'id' | 'createdAt' | 'updatedAt'> = {
  name: 'Test task',
  description: 'A sample test task',
  icon: 'star',
  starValue: 5,
  repeatRule: {
    number: 1,
    unit: 'day',
    endCondition: 'none',
  },
  assignedChildrenIds: ['child-1'],
  active: true,
};

describe('taskService', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('returns true for active tasks and false for inactive tasks', () => {
    const activeTask: Task = {
      id: '1',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      ...sampleTaskData,
    };

    expect(isTaskDueToday(activeTask)).toBe(true);
    expect(isTaskDueToday({ ...activeTask, active: false })).toBe(false);
  });

  it('creates a task and returns the created task payload', async () => {
    mockAddDoc.mockResolvedValueOnce({ id: 'task-id' });

    const result = await createTask('parent-1', sampleTaskData);

    expect(result).toEqual({ id: 'task-id', ...sampleTaskData });
    expect(mockAddDoc).toHaveBeenCalledTimes(1);
  });

  it('returns null when task does not exist', async () => {
    mockGetDoc.mockResolvedValueOnce({ exists: () => false, data: () => null });

    const result = await getTaskById('missing-id');

    expect(result).toBeNull();
    expect(mockGetDoc).toHaveBeenCalledTimes(1);
  });

  it('fetches tasks for a parent', async () => {
    mockGetDocs.mockResolvedValueOnce({
      forEach: (callback) => {
        callback({ id: 'task-1', data: () => ({ ...sampleTaskData, createdAt: '', updatedAt: '' }) });
      },
    });

    const tasks = await getTasksByParent('parent-1');

    expect(tasks).toHaveLength(1);
    expect(tasks[0].id).toBe('task-1');
    expect(query).toHaveBeenCalled();
    expect(where).toHaveBeenCalled();
  });

  it('fetches tasks for a child and only active tasks', async () => {
    mockGetDocs.mockResolvedValueOnce({
      forEach: (callback) => {
        callback({ id: 'task-2', data: () => ({ ...sampleTaskData, createdAt: '', updatedAt: '' }) });
      },
    });

    const tasks = await getTasksForChild('child-1');

    expect(tasks).toHaveLength(1);
    expect(tasks[0].id).toBe('task-2');
    expect(query).toHaveBeenCalled();
    expect(where).toHaveBeenCalledTimes(2);
  });
});

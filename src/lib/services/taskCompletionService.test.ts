import { describe, it, expect, vi, beforeEach } from 'vitest';
import { addDoc, updateDoc, getDocs, query, where, Timestamp } from 'firebase/firestore';
import { createTaskCompletion, approveTaskCompletion, rejectTaskCompletion, getPendingCompletions } from './taskCompletionService';

vi.mock('@/lib/firebase/config', () => ({
  db: {},
}));

vi.mock('firebase/firestore', () => ({
  collection: vi.fn((db: unknown, name: string) => ({ db, name })),
  addDoc: vi.fn(),
  updateDoc: vi.fn(),
  doc: vi.fn((db: unknown, collection: string, id: string) => ({ db, collection, id })),
  getDocs: vi.fn(),
  query: vi.fn((...args: unknown[]) => args),
  where: vi.fn((...args: unknown[]) => args),
  Timestamp: {
    now: vi.fn(() => ({ seconds: 0, nanoseconds: 0 })),
  },
}));

const mockAddDoc = vi.mocked(addDoc);
const mockUpdateDoc = vi.mocked(updateDoc);
const mockGetDocs = vi.mocked(getDocs);

describe('taskCompletionService', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('creates a pending task completion record', async () => {
    mockAddDoc.mockResolvedValueOnce({ id: 'completion-id' } as any);

    const result = await createTaskCompletion('task-1', 'child-1');

    expect(result).toEqual({
      id: 'completion-id',
      taskId: 'task-1',
      childId: 'child-1',
      status: 'pending',
      completedAt: expect.any(String),
    });
    expect(mockAddDoc).toHaveBeenCalledTimes(1);
  });

  it('approves a completion and updates the document', async () => {
    await approveTaskCompletion('completion-id', 'child-1', 'task-1', 10);

    expect(mockUpdateDoc).toHaveBeenCalledTimes(1);
  });

  it('rejects a completion and updates the document status', async () => {
    await rejectTaskCompletion('completion-id');

    expect(mockUpdateDoc).toHaveBeenCalledTimes(1);
  });

  it('fetches pending completions', async () => {
    mockGetDocs.mockResolvedValueOnce({
      forEach: (callback: (doc: any) => void) => {
        callback({ id: 'completion-1', data: () => ({ taskId: 'task-1', childId: 'child-1', status: 'pending' }) });
      },
    } as any);

    const list = await getPendingCompletions('parent-1');

    expect(list).toHaveLength(1);
    expect(list[0].status).toBe('pending');
    expect(query).toHaveBeenCalled();
    expect(where).toHaveBeenCalled();
  });
});

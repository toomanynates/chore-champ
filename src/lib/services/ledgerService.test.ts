import { describe, it, expect, vi, beforeEach } from 'vitest';
import { addDoc, getDocs, query, where } from 'firebase/firestore';
import { createLedgerEntry, getChildStarTotal, getChildLedger } from './ledgerService';

vi.mock('@/lib/firebase/config', () => ({
  db: {},
}));

vi.mock('firebase/firestore', () => ({
  collection: vi.fn((db: unknown, name: string) => ({ db, name })),
  addDoc: vi.fn(),
  getDocs: vi.fn(),
  query: vi.fn((...args: unknown[]) => args),
  where: vi.fn((...args: unknown[]) => args),
  Timestamp: {
    now: vi.fn(() => ({ seconds: 0, nanoseconds: 0 })),
  },
}));

const mockAddDoc = vi.mocked(addDoc);
const mockGetDocs = vi.mocked(getDocs);

describe('ledgerService', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('creates a ledger entry and returns the created payload', async () => {
    mockAddDoc.mockResolvedValueOnce({ id: 'ledger-id' });

    const result = await createLedgerEntry('child-1', 5, 'Good job', 'completion-1');

    expect(result).toEqual({
      id: 'ledger-id',
      childId: 'child-1',
      delta: 5,
      reason: 'Good job',
      taskCompletionId: 'completion-1',
      createdAt: expect.any(String),
    });
    expect(mockAddDoc).toHaveBeenCalledTimes(1);
  });

  it('calculates total star balance without going below zero', async () => {
    mockGetDocs.mockResolvedValueOnce({
      forEach: (callback) => {
        callback({ data: () => ({ delta: -5 }) });
        callback({ data: () => ({ delta: 2 }) });
      },
    });

    const total = await getChildStarTotal('child-1');

    expect(total).toBe(0);
    expect(query).toHaveBeenCalled();
    expect(where).toHaveBeenCalled();
  });

  it('fetches ledger entries and sorts by newest first', async () => {
    mockGetDocs.mockResolvedValueOnce({
      forEach: (callback) => {
        callback({ id: 'entry-1', data: () => ({ delta: 2, childId: 'child-1', reason: 'Bonus', createdAt: '2025-01-01T00:00:00.000Z' }) });
        callback({ id: 'entry-2', data: () => ({ delta: 1, childId: 'child-1', reason: 'Task', createdAt: '2025-01-02T00:00:00.000Z' }) });
      },
    });

    const entries = await getChildLedger('child-1');

    expect(entries[0].id).toBe('entry-2');
    expect(entries[1].id).toBe('entry-1');
    expect(query).toHaveBeenCalled();
    expect(where).toHaveBeenCalled();
  });
});

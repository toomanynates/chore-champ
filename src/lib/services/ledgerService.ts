import { db } from '@/lib/firebase/config';
import {
  collection,
  addDoc,
  getDocs,
  query,
  where,
  Timestamp,
} from 'firebase/firestore';
import { LedgerEntry } from '@/lib/types';

const LEDGER_COLLECTION = 'ledger';

export async function createLedgerEntry(
  childId: string,
  delta: number,
  reason: string,
  taskCompletionId?: string
): Promise<LedgerEntry> {
  try {
    const docRef = await addDoc(collection(db, LEDGER_COLLECTION), {
      childId,
      delta,
      reason,
      taskCompletionId,
      createdAt: Timestamp.now(),
    });
    return {
      id: docRef.id,
      childId,
      delta,
      reason,
      taskCompletionId,
      createdAt: new Date().toISOString(),
    };
  } catch (error) {
    console.error('Error creating ledger entry:', error);
    throw error;
  }
}

export async function getChildStarTotal(childId: string): Promise<number> {
  try {
    const q = query(
      collection(db, LEDGER_COLLECTION),
      where('childId', '==', childId)
    );
    const querySnapshot = await getDocs(q);
    let total = 0;
    querySnapshot.forEach((doc) => {
      total += (doc.data() as LedgerEntry).delta;
    });
    return Math.max(0, total); // Don't go below 0
  } catch (error) {
    console.error('Error calculating star total:', error);
    throw error;
  }
}

export async function getChildLedger(childId: string): Promise<LedgerEntry[]> {
  try {
    const q = query(
      collection(db, LEDGER_COLLECTION),
      where('childId', '==', childId)
    );
    const querySnapshot = await getDocs(q);
    const entries: LedgerEntry[] = [];
    querySnapshot.forEach((doc) => {
      entries.push({ id: doc.id, ...doc.data() } as LedgerEntry);
    });
    return entries.sort((a, b) => 
      new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    );
  } catch (error) {
    console.error('Error fetching ledger:', error);
    throw error;
  }
}

import { db } from '@/lib/firebase/config';
import {
  collection,
  addDoc,
  updateDoc,
  doc,
  getDocs,
  query,
  where,
  Timestamp,
} from 'firebase/firestore';
import { TaskCompletion } from '@/lib/types';

const TASK_COMPLETIONS_COLLECTION = 'taskCompletions';

export async function createTaskCompletion(
  taskId: string,
  childId: string
): Promise<TaskCompletion> {
  try {
    const docRef = await addDoc(collection(db, TASK_COMPLETIONS_COLLECTION), {
      taskId,
      childId,
      status: 'pending',
      completedAt: Timestamp.now(),
    });
    return {
      id: docRef.id,
      taskId,
      childId,
      status: 'pending',
      completedAt: new Date().toISOString(),
    };
  } catch (error) {
    console.error('Error creating task completion:', error);
    throw error;
  }
}

export async function approveTaskCompletion(
  completionId: string,
  _childId: string,
  _taskId: string,
  _starValue: number
) {
  try {
    const completionRef = doc(db, TASK_COMPLETIONS_COLLECTION, completionId);
    await updateDoc(completionRef, {
      status: 'approved',
      approvedAt: Timestamp.now(),
    });

    // Create corresponding LedgerEntry with starValue
    // This is done in the API route to keep separation of concerns
  } catch (error) {
    console.error('Error approving task completion:', error);
    throw error;
  }
}

export async function rejectTaskCompletion(completionId: string) {
  try {
    const completionRef = doc(db, TASK_COMPLETIONS_COLLECTION, completionId);
    await updateDoc(completionRef, {
      status: 'rejected',
      rejectedAt: Timestamp.now(),
    });
  } catch (error) {
    console.error('Error rejecting task completion:', error);
    throw error;
  }
}

export async function getPendingCompletions(_parentId: string) {
  // TODO: Filter by parent's children
  try {
    const q = query(
      collection(db, TASK_COMPLETIONS_COLLECTION),
      where('status', '==', 'pending')
    );
    const querySnapshot = await getDocs(q);
    const completions: TaskCompletion[] = [];
    querySnapshot.forEach((doc) => {
      completions.push({ id: doc.id, ...doc.data() } as TaskCompletion);
    });
    return completions;
  } catch (error) {
    console.error('Error fetching pending completions:', error);
    throw error;
  }
}

import { db } from '@/lib/firebase/config';
import {
  collection,
  addDoc,
  updateDoc,
  deleteDoc,
  doc,
  getDocs,
  getDoc,
  query,
  where,
  Timestamp,
} from 'firebase/firestore';
import { Task } from '@/lib/types';

const TASKS_COLLECTION = 'tasks';

export async function createTask(
  parentId: string,
  taskData: Omit<Task, 'id' | 'createdAt' | 'updatedAt'>
) {
  try {
    const docRef = await addDoc(collection(db, TASKS_COLLECTION), {
      ...taskData,
      parentId,
      createdAt: Timestamp.now(),
      updatedAt: Timestamp.now(),
    });
    return { id: docRef.id, ...taskData };
  } catch (error) {
    console.error('Error creating task:', error);
    throw error;
  }
}

export async function updateTask(taskId: string, updates: Partial<Task>) {
  try {
    const taskRef = doc(db, TASKS_COLLECTION, taskId);
    await updateDoc(taskRef, {
      ...updates,
      updatedAt: Timestamp.now(),
    });
  } catch (error) {
    console.error('Error updating task:', error);
    throw error;
  }
}

export async function deleteTask(taskId: string) {
  try {
    await deleteDoc(doc(db, TASKS_COLLECTION, taskId));
  } catch (error) {
    console.error('Error deleting task:', error);
    throw error;
  }
}

export async function getTaskById(taskId: string): Promise<Task | null> {
  try {
    const taskRef = doc(db, TASKS_COLLECTION, taskId);
    const taskSnap = await getDoc(taskRef);
    if (!taskSnap.exists()) {
      return null;
    }
    return { id: taskSnap.id, ...taskSnap.data() } as Task;
  } catch (error) {
    console.error('Error fetching task:', error);
    throw error;
  }
}

export async function getTasksByParent(parentId: string) {
  try {
    console.log('[getTasksByParent] Starting query for parentId:', parentId);
    console.log('[getTasksByParent] TASKS_COLLECTION:', TASKS_COLLECTION);
    console.log('[getTasksByParent] db instance:', db ? 'initialized' : 'NOT initialized');
    
    const q = query(
      collection(db, TASKS_COLLECTION),
      where('parentId', '==', parentId)
    );
    console.log('[getTasksByParent] Query object created successfully');
    
    const querySnapshot = await getDocs(q);
    console.log('[getTasksByParent] Got snapshot, docs count:', querySnapshot.size);
    
    const tasks: Task[] = [];
    querySnapshot.forEach((doc) => {
      tasks.push({ id: doc.id, ...doc.data() } as Task);
    });
    
    console.log('[getTasksByParent] Returning', tasks.length, 'tasks');
    return tasks;
  } catch (error) {
    console.error('Error fetching tasks:', error);
    console.error('Error type:', error instanceof Error ? error.constructor.name : typeof error);
    if (error instanceof Error) {
      console.error('Error message:', error.message);
      console.error('Error stack:', error.stack);
    }
    throw error;
  }
}

export async function getTasksForChild(childId: string) {
  try {
    // Some Firestore deployments require a composite index for combining
    // `array-contains` with another filter. To avoid requiring a composite
    // index during development we fetch active tasks and filter client-side.
    const q = query(
      collection(db, TASKS_COLLECTION),
      where('active', '==', true)
    );
    const querySnapshot = await getDocs(q);
    const tasks: Task[] = [];
    querySnapshot.forEach((docSnap) => {
      const data = docSnap.data();
      const assigned: string[] = Array.isArray(data.assignedChildrenIds) ? data.assignedChildrenIds : [];
      if (assigned.includes(childId)) {
        tasks.push({ id: docSnap.id, ...data } as Task);
      }
    });
    return tasks;
  } catch (error) {
    console.error('Error fetching child tasks:', error);
    throw error;
  }
}

export function isTaskDueToday(task: Task): boolean {
  // TODO (v2): Implement complex repeat rule logic
  // For now, assume all active tasks are due today
  return task.active;
}

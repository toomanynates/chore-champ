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
    const q = query(
      collection(db, TASKS_COLLECTION),
      where('parentId', '==', parentId)
    );
    const querySnapshot = await getDocs(q);
    const tasks: Task[] = [];
    querySnapshot.forEach((doc) => {
      tasks.push({ id: doc.id, ...doc.data() } as Task);
    });
    return tasks;
  } catch (error) {
    console.error('Error fetching tasks:', error);
    throw error;
  }
}

export async function getTasksForChild(childId: string) {
  try {
    const q = query(
      collection(db, TASKS_COLLECTION),
      where('assignedChildrenIds', 'array-contains', childId),
      where('active', '==', true)
    );
    const querySnapshot = await getDocs(q);
    const tasks: Task[] = [];
    querySnapshot.forEach((doc) => {
      tasks.push({ id: doc.id, ...doc.data() } as Task);
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

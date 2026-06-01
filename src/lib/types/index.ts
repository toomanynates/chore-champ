// Task-related TypeScript types and interfaces

export interface ParentProfile {
  id: string; // Firebase uid
  email: string;
  displayName: string;
  role: 'parent';
  children: string[]; // array of child UIDs
  createdAt: string; // ISO timestamp
}

export interface ChildProfile {
  id: string;
  parentId: string;
  email: string | null;
  authEmail: string | null;
  displayName: string;
  age?: number;
  role: 'child';
  createdAt: string; // ISO timestamp
}

export interface RepeatRule {
  number: number;
  unit: 'day' | 'week' | 'month' | 'year';
  endCondition: 'none' | 'date' | 'occurrences';
  endDate?: string;
  occurrences?: number;
  daysOfWeek?: number[]; // 0-6 for Sunday-Saturday
}

export interface Task {
  id: string;
  name: string;
  description: string;
  icon: string;
  starValue: number;
  repeatRule: RepeatRule;
  assignedChildrenIds: string[];
  active: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface TaskCompletion {
  id: string;
  taskId: string;
  childId: string;
  status: 'pending' | 'approved' | 'rejected';
  completedAt: string;
  approvedAt?: string;
  rejectedAt?: string;
}

export interface LedgerEntry {
  id: string;
  childId: string;
  delta: number; // positive or negative
  reason: string;
  taskCompletionId?: string;
  createdAt: string;
}

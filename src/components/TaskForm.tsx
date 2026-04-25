'use client';

import { useState } from 'react';
import { Task } from '@/lib/types';

//type TaskInput = Omit<Task, 'id' | 'createdAt' | 'updatedAt'>;
export type TaskInput = Omit<Task, 'id' | 'createdAt' | 'updatedAt'>;

interface TaskFormProps {
  onSubmit: (task: TaskInput) => Promise<void>;
  onCancel: () => void;
  initialTask?: Partial<TaskInput>;
  children?: string[];
  isLoading?: boolean;
}

const ICON_OPTIONS = [
  '✅',
  '🧹',
  '🍽️',
  '🛏️',
  '📚',
  '🚗',
  '🧺',
  '🎮',
  '💪',
  '🧯',
];

const REPEAT_UNITS = ['day', 'week', 'month', 'year'];

export function TaskForm({
  onSubmit,
  onCancel,
  initialTask,
  children = [],
  isLoading = false,
}: TaskFormProps) {
  const [formData, setFormData] = useState({
    name: initialTask?.name || '',
    description: initialTask?.description || '',
    icon: initialTask?.icon || '✅',
    starValue: initialTask?.starValue || 1,
    active: initialTask?.active ?? true,
    assignedChildrenIds: initialTask?.assignedChildrenIds || [],
    repeatRule: initialTask?.repeatRule || {
      number: 1,
      unit: 'day',
      endCondition: 'none',
      daysOfWeek: [],
    },
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await onSubmit(formData);
  };

  const handleChildToggle = (childId: string) => {
    setFormData((prev) => ({
      ...prev,
      assignedChildrenIds: prev.assignedChildrenIds.includes(childId)
        ? prev.assignedChildrenIds.filter((id) => id !== childId)
        : [...prev.assignedChildrenIds, childId],
    }));
  };

  const handleDayOfWeekToggle = (day: number) => {
    const daysOfWeek = formData.repeatRule.daysOfWeek || [];
    setFormData((prev) => ({
      ...prev,
      repeatRule: {
        ...prev.repeatRule,
        daysOfWeek: daysOfWeek.includes(day)
          ? daysOfWeek.filter((d) => d !== day)
          : [...daysOfWeek, day],
      },
    }));
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Basic Info */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
          Task Details
        </h3>

        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Task Name *
          </label>
          <input
            type="text"
            required
            value={formData.name}
            onChange={(e) => setFormData((prev) => ({ ...prev, name: e.target.value }))}
            className="w-full px-4 py-2 border border-gray-300 dark:border-slate-600 rounded-lg dark:bg-slate-700 dark:text-white"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Description
          </label>
          <textarea
            value={formData.description}
            onChange={(e) =>
              setFormData((prev) => ({ ...prev, description: e.target.value }))
            }
            rows={2}
            className="w-full px-4 py-2 border border-gray-300 dark:border-slate-600 rounded-lg dark:bg-slate-700 dark:text-white"
            placeholder="What is this task about?"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Icon
          </label>
          <div className="grid grid-cols-5 gap-2">
            {ICON_OPTIONS.map((icon) => (
              <button
                key={icon}
                type="button"
                onClick={() => setFormData((prev) => ({ ...prev, icon }))}
                className={`p-3 text-2xl border rounded-lg transition ${
                  formData.icon === icon
                    ? 'border-blue-500 bg-blue-50 dark:bg-blue-900'
                    : 'border-gray-300 dark:border-slate-600'
                }`}
              >
                {icon}
              </button>
            ))}
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Star Value *
          </label>
          <input
            type="number"
            required
            min="1"
            max="100"
            value={formData.starValue}
            onChange={(e) =>
              setFormData((prev) => ({ ...prev, starValue: parseInt(e.target.value) }))
            }
            className="w-full px-4 py-2 border border-gray-300 dark:border-slate-600 rounded-lg dark:bg-slate-700 dark:text-white"
          />
        </div>
      </div>

      {/* Repeat Rule */}
      <div className="space-y-4 border-t border-gray-200 dark:border-slate-700 pt-4">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
          Repeat Rule
        </h3>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Every
            </label>
            <input
              type="number"
              min="1"
              value={formData.repeatRule.number}
              onChange={(e) =>
                setFormData((prev) => ({
                  ...prev,
                  repeatRule: {
                    ...prev.repeatRule,
                    number: parseInt(e.target.value),
                  },
                }))
              }
              className="w-full px-4 py-2 border border-gray-300 dark:border-slate-600 rounded-lg dark:bg-slate-700 dark:text-white"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Unit
            </label>
            <select
              value={formData.repeatRule.unit}
              onChange={(e) =>
                setFormData((prev) => ({
                  ...prev,
                  repeatRule: {
                    ...prev.repeatRule,
                    unit: e.target.value as 'day' | 'week' | 'month' | 'year',
                  },
                }))
              }
              className="w-full px-4 py-2 border border-gray-300 dark:border-slate-600 rounded-lg dark:bg-slate-700 dark:text-white"
            >
              {REPEAT_UNITS.map((unit) => (
                <option key={unit} value={unit}>
                  {unit}
                </option>
              ))}
            </select>
          </div>
        </div>

        {formData.repeatRule.unit === 'week' && (
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Days of Week
            </label>
            <div className="grid grid-cols-7 gap-2">
              {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((day, idx) => (
                <button
                  key={day}
                  type="button"
                  onClick={() => handleDayOfWeekToggle(idx)}
                  className={`p-2 text-sm font-medium rounded-lg border transition ${
                    (formData.repeatRule.daysOfWeek || []).includes(idx)
                      ? 'bg-blue-500 text-white border-blue-500'
                      : 'border-gray-300 dark:border-slate-600 text-gray-700 dark:text-gray-300'
                  }`}
                >
                  {day}
                </button>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Assign to Children */}
      <div className="space-y-4 border-t border-gray-200 dark:border-slate-700 pt-4">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
          Assign to Children
        </h3>
        <div className="space-y-2">
          {children.map((childId) => (
            <label key={childId} className="flex items-center gap-2">
              <input
                type="checkbox"
                checked={formData.assignedChildrenIds.includes(childId)}
                onChange={() => handleChildToggle(childId)}
                className="w-4 h-4 rounded border-gray-300 dark:border-slate-600"
              />
              <span className="text-gray-700 dark:text-gray-300">{childId}</span>
            </label>
          ))}
        </div>
        {children.length === 0 && (
          <p className="text-sm text-gray-500 dark:text-gray-400">
            TODO: Load children from database
          </p>
        )}
      </div>

      {/* Active Toggle */}
      <div className="border-t border-gray-200 dark:border-slate-700 pt-4">
        <label className="flex items-center gap-2">
          <input
            type="checkbox"
            checked={formData.active}
            onChange={(e) => setFormData((prev) => ({ ...prev, active: e.target.checked }))}
            className="w-4 h-4 rounded border-gray-300 dark:border-slate-600"
          />
          <span className="text-gray-700 dark:text-gray-300 font-medium">Active</span>
        </label>
      </div>

      {/* Submit Buttons */}
      <div className="flex gap-4 pt-4">
        <button
          type="submit"
          disabled={isLoading || !formData.name}
          className="flex-1 bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white font-medium py-2 rounded-lg transition"
        >
          {isLoading ? 'Saving...' : 'Save Task'}
        </button>
        <button
          type="button"
          onClick={onCancel}
          className="flex-1 bg-gray-300 dark:bg-slate-600 hover:bg-gray-400 dark:hover:bg-slate-700 text-gray-900 dark:text-white font-medium py-2 rounded-lg transition"
        >
          Cancel
        </button>
      </div>
    </form>
  );
}

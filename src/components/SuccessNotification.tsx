'use client';

import { useEffect } from 'react';

interface SuccessNotificationProps {
  show: boolean;
  message?: string;
  starValue?: number;
  taskName?: string;
  onDismiss?: () => void;
  autoDismissMs?: number;
}

export function SuccessNotification({
  show,
  message = 'Task submitted!',
  starValue,
  taskName,
  onDismiss,
  autoDismissMs = 3000,
}: SuccessNotificationProps) {
  useEffect(() => {
    if (!show || autoDismissMs <= 0) {
      return;
    }

    const timer = setTimeout(() => {
      onDismiss?.();
    }, autoDismissMs);

    return () => clearTimeout(timer);
  }, [show, autoDismissMs, onDismiss]);

  if (!show) return null;

  return (
    <div className="fixed bottom-4 right-4 z-50 animate-slide-in-bottom">
      <div className="bg-gradient-to-r from-green-500 to-emerald-600 rounded-lg shadow-lg p-6 text-white max-w-sm">
        <div className="flex items-start gap-4">
          <div className="text-3xl animate-star-twinkle">⭐</div>
          <div className="flex-1">
            <h3 className="font-bold text-lg mb-1">
              {taskName ? `${taskName} Complete!` : 'Great Job!'}
            </h3>
            <p className="text-sm text-green-50 mb-2">{message}</p>
            {starValue && (
              <p className="text-sm font-semibold text-yellow-200">
                +{starValue} stars earned!
              </p>
            )}
          </div>
          <button
            onClick={() => {
              onDismiss?.();
            }}
            className="text-green-50 hover:text-white transition"
          >
            ✕
          </button>
        </div>
      </div>
    </div>
  );
}

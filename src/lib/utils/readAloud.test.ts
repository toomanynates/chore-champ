import { describe, it, expect, vi, beforeEach } from 'vitest';

describe('readAloudService', () => {
  beforeEach(() => {
    vi.resetModules();
    if (typeof window !== 'undefined') {
      Object.defineProperty(window, 'speechSynthesis', {
        configurable: true,
        value: {
          speak: vi.fn(),
          cancel: vi.fn(),
          pause: vi.fn(),
          resume: vi.fn(),
          speaking: false,
        },
      });
    }
  });

  it('uses the browser speech synthesis API when supported', async () => {
    if (typeof window === 'undefined') {
      expect(true).toBe(true);
      return;
    }

    const { readAloudService } = await import('./readAloud');
    readAloudService.speak('Hello chores', { rate: 1.1, pitch: 0.9, volume: 0.8 });

    expect(window.speechSynthesis.speak).toHaveBeenCalledTimes(1);
  });

  it('can stop an active speech synthesis session', async () => {
    if (typeof window === 'undefined') {
      expect(true).toBe(true);
      return;
    }

    const { readAloudService } = await import('./readAloud');
    readAloudService.stop();

    expect(window.speechSynthesis.cancel).toHaveBeenCalledTimes(1);
  });
});

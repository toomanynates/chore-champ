// Web Speech API Utility for read-aloud functionality

interface ReadAloudOptions {
  rate?: number;
  pitch?: number;
  volume?: number;
}

class ReadAloudService {
  private synthesis = typeof window !== 'undefined' ? window.speechSynthesis : null;
  private currentUtterance: SpeechSynthesisUtterance | null = null;
  private isSupported = this.synthesis !== null;

  speak(text: string, options: ReadAloudOptions = {}) {
    if (!this.isSupported) {
      console.warn('Speech Synthesis API is not supported in this browser');
      return;
    }

    // Cancel any ongoing speech
    this.stop();

    const utterance = new SpeechSynthesisUtterance(text);
    utterance.rate = options.rate || 1;
    utterance.pitch = options.pitch || 1;
    utterance.volume = options.volume || 1;

    this.currentUtterance = utterance;
    this.synthesis?.speak(utterance);
  }

  stop() {
    if (this.isSupported && this.synthesis) {
      this.synthesis.cancel();
      this.currentUtterance = null;
    }
  }

  pause() {
    if (this.isSupported && this.synthesis) {
      this.synthesis.pause();
    }
  }

  resume() {
    if (this.isSupported && this.synthesis) {
      this.synthesis.resume();
    }
  }

  isSpeaking() {
    return this.isSupported && this.synthesis?.speaking;
  }

  getIsSupported() {
    return this.isSupported;
  }
}

export const readAloudService = new ReadAloudService();

export function useReadAloud() {
  const speak = (text: string, options?: ReadAloudOptions) => {
    readAloudService.speak(text, options);
  };

  const stop = () => {
    readAloudService.stop();
  };

  const isSupported = readAloudService.getIsSupported();
  const isSpeaking = readAloudService.isSpeaking();

  return {
    speak,
    stop,
    isSupported,
    isSpeaking,
  };
}

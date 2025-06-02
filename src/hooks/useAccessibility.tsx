
import { useState, useEffect, useCallback } from 'react';

export interface AccessibilitySettings {
  fontSize: number;
  darkMode: boolean;
  reducedMotion: boolean;
  screenReader: boolean;
  keyboardNavigation: boolean;
  largerCursor: boolean;
  focusIndicator: boolean;
  textToSpeech: boolean;
}

const defaultSettings: AccessibilitySettings = {
  fontSize: 16,
  darkMode: false,
  reducedMotion: false,
  screenReader: false,
  keyboardNavigation: true,
  largerCursor: false,
  focusIndicator: true,
  textToSpeech: false,
};

export const useAccessibility = () => {
  const [settings, setSettings] = useState<AccessibilitySettings>(() => {
    const saved = localStorage.getItem('accessibility-settings');
    return saved ? { ...defaultSettings, ...JSON.parse(saved) } : defaultSettings;
  });

  const [isToolbarOpen, setIsToolbarOpen] = useState(false);

  // Aplica as configurações no documento
  useEffect(() => {
    const root = document.documentElement;
    
    // Tamanho da fonte
    root.style.fontSize = `${settings.fontSize}px`;
    
    // Modo escuro
    if (settings.darkMode) {
      root.classList.add('dark-mode');
    } else {
      root.classList.remove('dark-mode');
    }
    
    // Movimento reduzido
    if (settings.reducedMotion) {
      root.classList.add('reduced-motion');
    } else {
      root.classList.remove('reduced-motion');
    }
    
    // Cursor maior
    if (settings.largerCursor) {
      root.classList.add('large-cursor');
    } else {
      root.classList.remove('large-cursor');
    }
    
    // Indicador de foco
    if (settings.focusIndicator) {
      root.classList.add('focus-indicator');
    } else {
      root.classList.remove('focus-indicator');
    }
    
    // Salva no localStorage
    localStorage.setItem('accessibility-settings', JSON.stringify(settings));
  }, [settings]);

  // Text-to-Speech no hover
  useEffect(() => {
    if (!settings.textToSpeech) return;

    const handleMouseEnter = (e: Event) => {
      const target = e.target as HTMLElement;
      if (target && target.textContent && target.textContent.trim()) {
        // Cancela qualquer fala anterior
        speechSynthesis.cancel();
        
        // Cria nova utterance
        const utterance = new SpeechSynthesisUtterance(target.textContent.trim());
        utterance.rate = 0.8;
        utterance.pitch = 1;
        utterance.volume = 0.7;
        
        // Adiciona classe visual durante a fala
        target.classList.add('being-spoken');
        
        utterance.onend = () => {
          target.classList.remove('being-spoken');
        };
        
        speechSynthesis.speak(utterance);
      }
    };

    const handleMouseLeave = () => {
      speechSynthesis.cancel();
      document.querySelectorAll('.being-spoken').forEach(el => {
        el.classList.remove('being-spoken');
      });
    };

    // Adiciona eventos a elementos com texto
    const elementsWithText = document.querySelectorAll('p, h1, h2, h3, h4, h5, h6, span, button, a, label, td, th, li');
    
    elementsWithText.forEach(element => {
      element.addEventListener('mouseenter', handleMouseEnter);
      element.addEventListener('mouseleave', handleMouseLeave);
    });

    return () => {
      speechSynthesis.cancel();
      elementsWithText.forEach(element => {
        element.removeEventListener('mouseenter', handleMouseEnter);
        element.removeEventListener('mouseleave', handleMouseLeave);
      });
    };
  }, [settings.textToSpeech]);

  // Navegação por teclado
  useEffect(() => {
    if (!settings.keyboardNavigation) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      // Alt + A: Abrir toolbar de acessibilidade
      if (e.altKey && e.key === 'a') {
        e.preventDefault();
        setIsToolbarOpen(prev => !prev);
      }
      
      // Alt + H: Voltar ao topo
      if (e.altKey && e.key === 'h') {
        e.preventDefault();
        window.scrollTo({ top: 0, behavior: 'smooth' });
      }
      
      // Alt + M: Ir para o conteúdo principal
      if (e.altKey && e.key === 'm') {
        e.preventDefault();
        const main = document.querySelector('main');
        if (main) {
          main.focus();
          main.scrollIntoView({ behavior: 'smooth' });
        }
      }
      
      // Alt + S: Parar fala
      if (e.altKey && e.key === 's') {
        e.preventDefault();
        speechSynthesis.cancel();
        announceToScreenReader('Fala interrompida');
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [settings.keyboardNavigation]);

  const updateSetting = useCallback(<K extends keyof AccessibilitySettings>(
    key: K,
    value: AccessibilitySettings[K]
  ) => {
    setSettings(prev => ({ ...prev, [key]: value }));
  }, []);

  const resetSettings = useCallback(() => {
    setSettings(defaultSettings);
  }, []);

  const announceToScreenReader = useCallback((message: string) => {
    if (!settings.screenReader) return;
    
    const announcement = document.createElement('div');
    announcement.setAttribute('aria-live', 'polite');
    announcement.setAttribute('aria-atomic', 'true');
    announcement.style.position = 'absolute';
    announcement.style.left = '-10000px';
    announcement.style.width = '1px';
    announcement.style.height = '1px';
    announcement.style.overflow = 'hidden';
    announcement.textContent = message;
    
    document.body.appendChild(announcement);
    
    setTimeout(() => {
      document.body.removeChild(announcement);
    }, 1000);
  }, [settings.screenReader]);

  return {
    settings,
    updateSetting,
    resetSettings,
    isToolbarOpen,
    setIsToolbarOpen,
    announceToScreenReader,
  };
};

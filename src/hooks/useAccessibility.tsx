
import { useState, useEffect, useCallback } from 'react';

export interface AccessibilitySettings {
  fontSize: number;
  highContrast: boolean;
  darkMode: boolean;
  reducedMotion: boolean;
  screenReader: boolean;
  keyboardNavigation: boolean;
  largerCursor: boolean;
  focusIndicator: boolean;
}

const defaultSettings: AccessibilitySettings = {
  fontSize: 16,
  highContrast: false,
  darkMode: false,
  reducedMotion: false,
  screenReader: false,
  keyboardNavigation: true,
  largerCursor: false,
  focusIndicator: true,
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
    
    // Alto contraste
    if (settings.highContrast) {
      root.classList.add('high-contrast');
    } else {
      root.classList.remove('high-contrast');
    }
    
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

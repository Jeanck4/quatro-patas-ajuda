
import React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { 
  X, 
  Plus, 
  Minus, 
  Moon, 
  Sun, 
  MousePointer, 
  Keyboard, 
  Volume2,
  RotateCcw,
  Accessibility,
  VolumeX
} from 'lucide-react';
import { useAccessibility } from '@/hooks/useAccessibility';

const AccessibilityToolbar = () => {
  const { 
    settings, 
    updateSetting, 
    resetSettings, 
    isToolbarOpen, 
    setIsToolbarOpen,
    announceToScreenReader 
  } = useAccessibility();

  if (!isToolbarOpen) {
    return (
      <Button
        onClick={() => {
          setIsToolbarOpen(true);
          announceToScreenReader('Toolbar de acessibilidade aberta');
        }}
        className="fixed bottom-4 right-4 z-50 rounded-full h-12 w-12 bg-primary hover:bg-primary/90"
        aria-label="Abrir ferramentas de acessibilidade (Alt + A)"
        title="Abrir ferramentas de acessibilidade (Alt + A)"
      >
        <Accessibility className="h-6 w-6" />
      </Button>
    );
  }

  return (
    <Card className="fixed bottom-4 right-4 z-50 w-80 max-h-[80vh] overflow-y-auto shadow-lg">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg flex items-center gap-2">
            <Accessibility className="h-5 w-5" />
            Acessibilidade
          </CardTitle>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => {
              setIsToolbarOpen(false);
              announceToScreenReader('Toolbar de acessibilidade fechada');
            }}
            aria-label="Fechar toolbar"
          >
            <X className="h-4 w-4" />
          </Button>
        </div>
      </CardHeader>
      
      <CardContent className="space-y-4">
        {/* Tamanho da Fonte */}
        <div>
          <h3 className="font-medium mb-2">Tamanho da Fonte</h3>
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => {
                const newSize = Math.max(12, settings.fontSize - 2);
                updateSetting('fontSize', newSize);
                announceToScreenReader(`Fonte diminuída para ${newSize} pixels`);
              }}
              aria-label="Diminuir fonte"
            >
              <Minus className="h-4 w-4" />
            </Button>
            <span className="text-sm min-w-[60px] text-center">
              {settings.fontSize}px
            </span>
            <Button
              variant="outline"
              size="sm"
              onClick={() => {
                const newSize = Math.min(24, settings.fontSize + 2);
                updateSetting('fontSize', newSize);
                announceToScreenReader(`Fonte aumentada para ${newSize} pixels`);
              }}
              aria-label="Aumentar fonte"
            >
              <Plus className="h-4 w-4" />
            </Button>
          </div>
        </div>

        <Separator />

        {/* Modo Escuro */}
        <div className="space-y-3">
          <h3 className="font-medium">Tema</h3>
          
          <Button
            variant={settings.darkMode ? "default" : "outline"}
            size="sm"
            className="w-full justify-start"
            onClick={() => {
              updateSetting('darkMode', !settings.darkMode);
              announceToScreenReader(
                settings.darkMode ? 'Modo escuro desativado' : 'Modo escuro ativado'
              );
            }}
          >
            {settings.darkMode ? (
              <Sun className="h-4 w-4 mr-2" />
            ) : (
              <Moon className="h-4 w-4 mr-2" />
            )}
            Modo Escuro
          </Button>
        </div>

        <Separator />

        {/* Texto para Fala */}
        <div>
          <h3 className="font-medium mb-2">Áudio</h3>
          <Button
            variant={settings.textToSpeech ? "default" : "outline"}
            size="sm"
            className="w-full justify-start"
            onClick={() => {
              updateSetting('textToSpeech', !settings.textToSpeech);
              if (settings.textToSpeech) {
                speechSynthesis.cancel();
              }
              announceToScreenReader(
                settings.textToSpeech ? 'Texto para fala desativado' : 'Texto para fala ativado - passe o mouse sobre textos para ouvir'
              );
            }}
          >
            {settings.textToSpeech ? (
              <VolumeX className="h-4 w-4 mr-2" />
            ) : (
              <Volume2 className="h-4 w-4 mr-2" />
            )}
            Falar Texto no Hover
          </Button>
        </div>

        <Separator />

        {/* Navegação e Movimento */}
        <div className="space-y-3">
          <h3 className="font-medium">Navegação</h3>
          
          <Button
            variant={settings.reducedMotion ? "default" : "outline"}
            size="sm"
            className="w-full justify-start"
            onClick={() => {
              updateSetting('reducedMotion', !settings.reducedMotion);
              announceToScreenReader(
                settings.reducedMotion ? 'Movimento reduzido desativado' : 'Movimento reduzido ativado'
              );
            }}
          >
            <RotateCcw className="h-4 w-4 mr-2" />
            Reduzir Movimento
          </Button>

          <Button
            variant={settings.largerCursor ? "default" : "outline"}
            size="sm"
            className="w-full justify-start"
            onClick={() => {
              updateSetting('largerCursor', !settings.largerCursor);
              announceToScreenReader(
                settings.largerCursor ? 'Cursor normal' : 'Cursor ampliado'
              );
            }}
          >
            <MousePointer className="h-4 w-4 mr-2" />
            Cursor Ampliado
          </Button>

          <Button
            variant={settings.keyboardNavigation ? "default" : "outline"}
            size="sm"
            className="w-full justify-start"
            onClick={() => {
              updateSetting('keyboardNavigation', !settings.keyboardNavigation);
              announceToScreenReader(
                settings.keyboardNavigation ? 'Navegação por teclado desativada' : 'Navegação por teclado ativada'
              );
            }}
          >
            <Keyboard className="h-4 w-4 mr-2" />
            Navegação por Teclado
          </Button>
        </div>

        <Separator />

        {/* Leitor de Tela */}
        <div>
          <Button
            variant={settings.screenReader ? "default" : "outline"}
            size="sm"
            className="w-full justify-start"
            onClick={() => {
              updateSetting('screenReader', !settings.screenReader);
              announceToScreenReader(
                settings.screenReader ? 'Anúncios de leitor de tela desativados' : 'Anúncios de leitor de tela ativados'
              );
            }}
          >
            <Volume2 className="h-4 w-4 mr-2" />
            Anúncios para Leitor de Tela
          </Button>
        </div>

        <Separator />

        {/* Reset */}
        <Button
          variant="outline"
          size="sm"
          className="w-full"
          onClick={() => {
            speechSynthesis.cancel();
            resetSettings();
            announceToScreenReader('Configurações de acessibilidade restauradas');
          }}
        >
          <RotateCcw className="h-4 w-4 mr-2" />
          Restaurar Padrões
        </Button>

        {/* Atalhos */}
        <div className="text-xs text-muted-foreground space-y-1">
          <p><strong>Atalhos do teclado:</strong></p>
          <p>Alt + A: Abrir/fechar toolbar</p>
          <p>Alt + H: Ir ao topo</p>
          <p>Alt + M: Ir ao conteúdo principal</p>
          <p>Alt + S: Parar fala</p>
        </div>
      </CardContent>
    </Card>
  );
};

export default AccessibilityToolbar;

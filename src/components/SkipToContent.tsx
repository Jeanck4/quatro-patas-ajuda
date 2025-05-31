
import React from 'react';
import { Button } from '@/components/ui/button';

const SkipToContent = () => {
  const skipToMain = () => {
    const main = document.querySelector('main');
    if (main) {
      main.focus();
      main.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <Button
      onClick={skipToMain}
      className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 z-50 bg-primary text-primary-foreground"
      onFocus={(e) => {
        e.target.classList.remove('sr-only');
      }}
      onBlur={(e) => {
        e.target.classList.add('sr-only');
      }}
    >
      Pular para o conteúdo principal
    </Button>
  );
};

export default SkipToContent;

import { useEffect, useState } from 'react';

export function useDevToolsBlocker() {
  const [warningMessage, setWarningMessage] = useState<string | null>(null);

  useEffect(() => {
    let timeoutId: any;

    const triggerWarning = (msg: string) => {
      setWarningMessage(msg);
      clearTimeout(timeoutId);
      timeoutId = setTimeout(() => {
        setWarningMessage(null);
      }, 4000);
    };

    const handleKeyDown = (e: KeyboardEvent) => {
      // Block F12
      if (e.key === 'F12' || e.code === 'F12' || e.keyCode === 123 || e.which === 123) {
        e.preventDefault();
        e.stopPropagation();
        triggerWarning('Acesso ao F12 bloqueado pelo SurfPlay para proteção do código-fonte 🛡️');
        return false;
      }

      // Block Ctrl+Shift+I / Cmd+Option+I (DevTools Inspect)
      if ((e.ctrlKey || e.metaKey) && e.shiftKey && (e.key === 'I' || e.key === 'i' || e.key === 'C' || e.key === 'c' || e.key === 'J' || e.key === 'j')) {
        e.preventDefault();
        e.stopPropagation();
        triggerWarning('Ferramentas de desenvolvedor bloqueadas pelo SurfPlay 🛡️');
        return false;
      }

      // Block Ctrl+U / Cmd+U (View Source)
      if ((e.ctrlKey || e.metaKey) && (e.key === 'U' || e.key === 'u')) {
        e.preventDefault();
        e.stopPropagation();
        triggerWarning('Visualização do código-fonte bloqueada pelo SurfPlay 🛡️');
        return false;
      }

      // Block Ctrl+S / Cmd+S (Save Page)
      if ((e.ctrlKey || e.metaKey) && (e.key === 'S' || e.key === 's')) {
        e.preventDefault();
        e.stopPropagation();
        return false;
      }
    };

    const handleContextMenu = (e: MouseEvent) => {
      e.preventDefault();
      e.stopPropagation();
      triggerWarning('Menu de inspeção com botão direito desativado pelo SurfPlay 🛡️');
      return false;
    };

    window.addEventListener('keydown', handleKeyDown, true);
    document.addEventListener('keydown', handleKeyDown, true);
    window.addEventListener('contextmenu', handleContextMenu, true);
    document.addEventListener('contextmenu', handleContextMenu, true);

    return () => {
      window.removeEventListener('keydown', handleKeyDown, true);
      document.removeEventListener('keydown', handleKeyDown, true);
      window.removeEventListener('contextmenu', handleContextMenu, true);
      document.removeEventListener('contextmenu', handleContextMenu, true);
      clearTimeout(timeoutId);
    };
  }, []);

  return { warningMessage, clearWarning: () => setWarningMessage(null) };
}

import { useEffect } from 'react';

interface UseKeyboardProps {
  onKeyPress: (key: string) => void;
  disabled?: boolean;
}

export const useKeyboard = ({ onKeyPress, disabled = false }: UseKeyboardProps) => {
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (disabled) return;

      const key = event.key.toUpperCase();
      
      // Handle special keys
      if (key === 'ENTER' || key === 'BACKSPACE') {
        event.preventDefault();
        onKeyPress(key);
        return;
      }

      // Handle letter keys
      if (/^[A-Z]$/.test(key)) {
        event.preventDefault();
        onKeyPress(key);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onKeyPress, disabled]);

  const handleVirtualKeyPress = (key: string) => {
    if (!disabled) {
      onKeyPress(key);
    }
  };

  return { handleVirtualKeyPress };
};
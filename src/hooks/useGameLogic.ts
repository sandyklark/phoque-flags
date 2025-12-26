import { useGameStore } from '../store/gameStore';
import { isValidWord } from '../utils/gameHelpers';

export const useGameLogic = () => {
  const {
    gameState,
    currentGuess,
    config,
    addLetter,
    removeLetter,
    submitGuess,
  } = useGameStore();

  const handleKeyInput = (key: string): { success: boolean; message?: string } => {
    if (gameState !== 'playing') {
      return { success: false, message: 'Game is not active' };
    }

    if (key === 'ENTER') {
      return handleSubmit();
    } else if (key === 'BACKSPACE') {
      removeLetter();
      return { success: true };
    } else if (/^[A-Z]$/.test(key)) {
      if (currentGuess.length >= config.wordLength) {
        return { success: false, message: 'Word is complete' };
      }
      addLetter(key);
      return { success: true };
    }

    return { success: false, message: 'Invalid key' };
  };

  const handleSubmit = (): { success: boolean; message?: string } => {
    if (currentGuess.length !== config.wordLength) {
      return { 
        success: false, 
        message: `Word must be ${config.wordLength} letters` 
      };
    }

    if (!isValidWord(currentGuess)) {
      return { 
        success: false, 
        message: 'Not a valid word' 
      };
    }

    submitGuess();
    return { success: true };
  };

  const canSubmit = () => {
    return (
      gameState === 'playing' && 
      currentGuess.length === config.wordLength &&
      isValidWord(currentGuess)
    );
  };

  return {
    handleKeyInput,
    handleSubmit,
    canSubmit,
  };
};
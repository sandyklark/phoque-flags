// Legacy utilities - keeping minimal functions that might still be used
import type { GameActionResult } from './gameErrors';
import { SUCCESS_MESSAGE, NEW_GAME_TEXT, NEW_GAME_ARIA_LABELS, NEW_GAME_TITLES } from '../constants/game.constants';

export const formatTime = (seconds: number): string => {
  const minutes = Math.floor(seconds / 60);
  const remainingSeconds = seconds % 60;
  return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
};

export const saveGameToLocalStorage = (key: string, data: any): void => {
  try {
    localStorage.setItem(key, JSON.stringify(data));
  } catch (error) {
    console.warn('Could not save to localStorage:', error);
  }
};

export const loadGameFromLocalStorage = <T>(key: string, defaultValue: T): T => {
  try {
    const item = localStorage.getItem(key);
    return item ? JSON.parse(item) : defaultValue;
  } catch (error) {
    console.warn('Could not load from localStorage:', error);
    return defaultValue;
  }
};

/**
 * Handles the result of a game action, showing appropriate notification or snark message
 */
export const handleGameResult = (
  result: GameActionResult,
  showNotification: (message: string) => void,
  showSnarkMessage: (message: string) => void
): void => {
  if (!result.success && result.error) {
    showNotification(result.error);
  } else if (result.success && result.message) {
    // Check if it's a success message (correct) or snark message (wrong)
    if (result.message === SUCCESS_MESSAGE) {
      showNotification(result.message);
    } else {
      // It's a snark message for wrong guess
      showSnarkMessage(result.message);
    }
  }
};

/**
 * Returns appropriate button text for new game based on mode
 */
export const getNewGameButtonText = (isDailyMode: boolean): string => {
  return isDailyMode ? NEW_GAME_TEXT.daily : NEW_GAME_TEXT.practice;
};

/**
 * Returns appropriate aria label for new game button based on mode
 */
export const getNewGameAriaLabel = (isDailyMode: boolean): string => {
  return isDailyMode ? NEW_GAME_ARIA_LABELS.daily : NEW_GAME_ARIA_LABELS.practice;
};

/**
 * Returns appropriate title for new game button based on mode
 */
export const getNewGameTitle = (isDailyMode: boolean): string => {
  return isDailyMode ? NEW_GAME_TITLES.daily : NEW_GAME_TITLES.practice;
};

/**
 * Returns the game mode label based on daily mode status
 */
export const getGameModeLabel = (isDailyMode: boolean): string => {
  return isDailyMode ? 'Daily Flag Puzzle' : 'Practice Mode';
};
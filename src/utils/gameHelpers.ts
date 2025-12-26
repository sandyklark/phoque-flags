import type { Letter } from '../types/game';
import solutions from '../data/solutions.json';
import valid from '../data/valid.json';

export const getRandomSolution = (): string => {
  return solutions[Math.floor(Math.random() * solutions.length)].toUpperCase();
};

export const isValidWord = (word: string): boolean => {
  const normalizedWord = word.toLowerCase();
  return (
    solutions.includes(normalizedWord) ||
    valid.includes(normalizedWord)
  );
};

export const checkLetterStates = (guess: string, solution: string): Letter[] => {
  const result: Letter[] = [];
  const solutionArray = solution.split('');
  const guessArray = guess.split('');

  // Track which solution letters have been used
  const usedSolutionIndices = new Set<number>();

  // First pass: mark correct letters
  for (let i = 0; i < guessArray.length; i++) {
    if (guessArray[i] === solutionArray[i]) {
      result[i] = { value: guessArray[i], state: 'correct' };
      usedSolutionIndices.add(i);
    }
  }

  // Second pass: mark present and absent letters
  for (let i = 0; i < guessArray.length; i++) {
    if (result[i]) continue; // Already marked as correct

    const letter = guessArray[i];
    let isPresent = false;

    // Look for unused instances of this letter in the solution
    for (let j = 0; j < solutionArray.length; j++) {
      if (!usedSolutionIndices.has(j) && solutionArray[j] === letter) {
        isPresent = true;
        usedSolutionIndices.add(j);
        break;
      }
    }

    result[i] = {
      value: letter,
      state: isPresent ? 'present' : 'absent'
    };
  }

  return result;
};

export const getLetterFrequency = (word: string): Record<string, number> => {
  const frequency: Record<string, number> = {};
  for (const letter of word) {
    frequency[letter] = (frequency[letter] || 0) + 1;
  }
  return frequency;
};

export const formatTime = (seconds: number): string => {
  const minutes = Math.floor(seconds / 60);
  const remainingSeconds = seconds % 60;
  return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
};

export const getShareText = (guesses: Letter[][], gameWon: boolean): string => {
  const title = 'Flagdle';
  const status = gameWon ? `${guesses.filter(row => row.some(letter => letter.state !== 'empty')).length}/6` : 'X/6';

  let grid = '';
  for (const guess of guesses) {
    if (guess.some(letter => letter.state !== 'empty')) {
      for (const letter of guess) {
        switch (letter.state) {
          case 'correct':
            grid += '🟩';
            break;
          case 'present':
            grid += '🟨';
            break;
          case 'absent':
            grid += '⬛';
            break;
          default:
            grid += '⬜';
        }
      }
      grid += '\n';
    }
  }

  return `${title} ${status}\n\n${grid}`;
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

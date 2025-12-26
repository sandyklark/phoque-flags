import type { Letter, LetterState } from '../types/game';

export const checkGuessAgainstSolution = (guess: string, solution: string): Letter[] => {
  const result: Letter[] = [];
  const solutionLetters = solution.split('');
  const guessLetters = guess.split('');
  
  // Create a copy of solution for tracking used letters
  const availableLetters = [...solutionLetters];
  
  // First pass: identify correct positions
  for (let i = 0; i < guessLetters.length; i++) {
    if (guessLetters[i] === solutionLetters[i]) {
      result[i] = { value: guessLetters[i], state: 'correct' };
      // Remove this letter from available pool
      availableLetters[i] = '';
    }
  }
  
  // Second pass: identify present letters (wrong position)
  for (let i = 0; i < guessLetters.length; i++) {
    if (result[i]) continue; // Skip already processed correct letters
    
    const letter = guessLetters[i];
    const availableIndex = availableLetters.indexOf(letter);
    
    if (availableIndex !== -1) {
      result[i] = { value: letter, state: 'present' };
      // Remove this letter from available pool
      availableLetters[availableIndex] = '';
    } else {
      result[i] = { value: letter, state: 'absent' };
    }
  }
  
  return result;
};

export const mergeKeyboardStates = (
  current: Record<string, LetterState>,
  newLetters: Letter[]
): Record<string, LetterState> => {
  const updated = { ...current };
  
  for (const letter of newLetters) {
    const currentState = updated[letter.value];
    
    // Priority: correct > present > absent
    if (!currentState || 
        (currentState !== 'correct' && letter.state === 'correct') ||
        (currentState === 'absent' && letter.state === 'present')) {
      updated[letter.value] = letter.state;
    }
  }
  
  return updated;
};

export const getLetterCount = (word: string, letter: string): number => {
  return word.split('').filter(l => l === letter).length;
};

export const hasRepeatingLetters = (word: string): boolean => {
  const letters = word.split('');
  const uniqueLetters = new Set(letters);
  return letters.length !== uniqueLetters.size;
};
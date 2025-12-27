import type { Flag, FlagAttribute, FlagGuess } from '../types/game';
import flagsData from '../data/flags.json';

export const getRandomFlag = (): Flag => {
  const flags = flagsData as Flag[];
  return flags[Math.floor(Math.random() * flags.length)];
};

export const getAllFlags = (): Flag[] => {
  return flagsData as Flag[];
};

export const getFlagById = (id: string): Flag | undefined => {
  const flags = flagsData as Flag[];
  return flags.find(flag => flag.id === id);
};

export const createEmptyFlagGuess = (): FlagGuess => {
  return {
    primaryColor: null,
    secondaryColor: null,
    tertiaryColor: null,
    pattern: null,
    attributes: [
      { type: 'primaryColor', value: null, state: 'empty' },
      { type: 'secondaryColor', value: null, state: 'empty' },
      { type: 'tertiaryColor', value: null, state: 'empty' },
      { type: 'pattern', value: null, state: 'empty' }
    ],
    isSubmitted: false
  };
};

export const isGuessComplete = (guess: Partial<Pick<Flag, 'primaryColor' | 'secondaryColor' | 'tertiaryColor' | 'pattern'>>): boolean => {
  return !!(guess.primaryColor && guess.secondaryColor && guess.pattern);
};

export const checkFlagAttributes = (
  guess: Pick<Flag, 'primaryColor' | 'secondaryColor' | 'tertiaryColor' | 'pattern'>,
  solution: Flag
): FlagAttribute[] => {
  const attributes: FlagAttribute[] = [];

  // Check primary color
  attributes.push({
    type: 'primaryColor',
    value: guess.primaryColor,
    state: guess.primaryColor === solution.primaryColor ? 'correct' :
           (guess.primaryColor === solution.secondaryColor || guess.primaryColor === solution.tertiaryColor) ? 'present' : 'absent'
  });

  // Check secondary color
  attributes.push({
    type: 'secondaryColor',
    value: guess.secondaryColor,
    state: guess.secondaryColor === solution.secondaryColor ? 'correct' :
           (guess.secondaryColor === solution.primaryColor || guess.secondaryColor === solution.tertiaryColor) ? 'present' : 'absent'
  });

  // Check tertiary color
  attributes.push({
    type: 'tertiaryColor',
    value: guess.tertiaryColor,
    state: guess.tertiaryColor === solution.tertiaryColor ? 'correct' :
           (guess.tertiaryColor === solution.primaryColor || guess.tertiaryColor === solution.secondaryColor) ? 'present' : 'absent'
  });

  // Check pattern
  attributes.push({
    type: 'pattern',
    value: guess.pattern,
    state: guess.pattern === solution.pattern ? 'correct' : 'absent'
  });

  return attributes;
};

export const isCorrectGuess = (
  guess: Pick<Flag, 'primaryColor' | 'secondaryColor' | 'tertiaryColor' | 'pattern'>,
  solution: Flag
): boolean => {
  return (
    guess.primaryColor === solution.primaryColor &&
    guess.secondaryColor === solution.secondaryColor &&
    guess.tertiaryColor === solution.tertiaryColor &&
    guess.pattern === solution.pattern
  );
};

export const formatGuessForSubmission = (
  currentGuess: Partial<Pick<Flag, 'primaryColor' | 'secondaryColor' | 'tertiaryColor' | 'pattern'>>
): Pick<Flag, 'primaryColor' | 'secondaryColor' | 'tertiaryColor' | 'pattern'> => {
  return {
    primaryColor: currentGuess.primaryColor!,
    secondaryColor: currentGuess.secondaryColor!,
    tertiaryColor: currentGuess.tertiaryColor || null,
    pattern: currentGuess.pattern!
  };
};
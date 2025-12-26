import solutions from '../data/solutions.json';
import valid from '../data/valid.json';

export const isWordInSolutions = (word: string): boolean => {
  return solutions.includes(word.toLowerCase());
};

export const isWordValid = (word: string): boolean => {
  const normalizedWord = word.toLowerCase();
  return (
    solutions.includes(normalizedWord) || 
    valid.includes(normalizedWord)
  );
};

export const getRandomSolutionWord = (): string => {
  const randomIndex = Math.floor(Math.random() * solutions.length);
  return solutions[randomIndex].toUpperCase();
};

export const validateWordLength = (word: string, expectedLength: number): boolean => {
  return word.length === expectedLength;
};

export const containsOnlyLetters = (word: string): boolean => {
  return /^[A-Za-z]+$/.test(word);
};
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

// List of all country codes in our database for verification
export const SUPPORTED_COUNTRY_CODES = [
  'AE', 'AR', 'AT', 'AU', 'BD', 'BE', 'BF', 'BJ', 'BN', 'BO', 'BR', 'CA', 
  'CH', 'CI', 'CL', 'CM', 'CN', 'CO', 'CR', 'CU', 'CV', 'CZ', 'DE', 'DK', 
  'DZ', 'EC', 'EG', 'ES', 'ET', 'FI', 'FJ', 'FR', 'GB', 'GH', 'GM', 'GN', 
  'GR', 'GW', 'ID', 'IE', 'IL', 'IN', 'IQ', 'IR', 'IT', 'JM', 'JO', 'JP', 
  'KE', 'KH', 'KR', 'LA', 'LB', 'LR', 'LY', 'MA', 'ML', 'MM', 'MR', 'MX', 
  'MY', 'NE', 'NG', 'NL', 'NO', 'NZ', 'PE', 'PH', 'PK', 'PL', 'PT', 'PY', 
  'RU', 'RW', 'SA', 'SD', 'SE', 'SG', 'SL', 'SN', 'SY', 'TG', 'TH', 'TN', 
  'TR', 'TZ', 'UA', 'UG', 'US', 'UY', 'VE', 'VN', 'YE', 'ZA', 'ZW'
];

// Function to validate if a country code should work with flagcdn.com
export const validateCountryCode = (countryCode: string): boolean => {
  return SUPPORTED_COUNTRY_CODES.includes(countryCode.toUpperCase());
};

// Function to get flag URL with fallback
export const getFlagUrl = (countryCode: string, format: 'svg' | 'png' = 'svg'): string => {
  const code = countryCode.toLowerCase();
  return `https://flagcdn.com/${code}.${format}`;
};

// Get today's flag based on date (same for all players each day)
export const getTodaysFlag = (): Flag => {
  const flags = getAllFlags();
  const today = new Date();
  const startDate = new Date('2025-01-01'); // Game launch date
  const daysSinceStart = Math.floor((today.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24));
  const flagIndex = Math.abs(daysSinceStart) % flags.length;
  return flags[flagIndex];
};

// Get current puzzle number (days since launch)
export const getPuzzleNumber = (): number => {
  const today = new Date();
  const startDate = new Date('2025-01-01');
  return Math.floor((today.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24)) + 1;
};

// Get today's date string for storage
export const getTodaysDateString = (): string => {
  return new Date().toISOString().split('T')[0]; // 'YYYY-MM-DD'
};
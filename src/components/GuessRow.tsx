import { LetterTile } from './LetterTile';
import type { Guess } from '../types/game';

interface GuessRowProps {
  guess: Guess;
  isCurrentRow: boolean;
  currentGuess?: string;
  wordLength: number;
}

export const GuessRow = ({ guess, isCurrentRow, currentGuess = '', wordLength }: GuessRowProps) => {
  const getDisplayLetters = () => {
    if (isCurrentRow && !guess.isSubmitted) {
      return Array.from({ length: wordLength }, (_, i) => ({
        value: currentGuess[i] || '',
        state: currentGuess[i] ? 'filled' as const : 'empty' as const,
      }));
    }
    return guess.letters;
  };

  const letters = getDisplayLetters();

  return (
    <div className="flex gap-1 justify-center">
      {letters.map((letter, index) => (
        <LetterTile
          key={index}
          letter={letter}
          animationDelay={guess.isSubmitted ? index * 100 : 0}
          isCurrentGuess={isCurrentRow && !guess.isSubmitted}
        />
      ))}
    </div>
  );
};
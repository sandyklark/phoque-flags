import { GuessRow } from './GuessRow';
import type { GameBoardProps } from '../types/game';

export const GameBoard = ({ guesses, currentGuess, maxAttempts }: GameBoardProps) => {
  const currentRowIndex = guesses.findIndex(g => !g.isSubmitted);
  
  return (
    <div className="grid gap-3 p-4 max-w-md mx-auto">
      {guesses.slice(0, maxAttempts).map((guess, index) => (
        <GuessRow
          key={index}
          guess={guess}
          isCurrentRow={index === currentRowIndex}
          currentGuess={index === currentRowIndex ? currentGuess : undefined}
        />
      ))}
    </div>
  );
};
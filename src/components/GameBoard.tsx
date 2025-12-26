import { GuessRow } from './GuessRow';
import type { GameBoardProps } from '../types/game';

export const GameBoard = ({ guesses, currentGuess, maxAttempts, wordLength }: GameBoardProps) => {
  return (
    <div className="grid gap-1 p-4 justify-center">
      {guesses.slice(0, maxAttempts).map((guess, index) => (
        <GuessRow
          key={index}
          guess={guess}
          isCurrentRow={index === guesses.findIndex(g => !g.isSubmitted)}
          currentGuess={currentGuess}
          wordLength={wordLength}
        />
      ))}
    </div>
  );
};
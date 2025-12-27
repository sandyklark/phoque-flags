import { GuessRow } from './GuessRow';
import type { GameBoardProps } from '../types/game';

export const GameBoard = ({ 
  guesses, 
  currentGuess, 
  maxAttempts, 
  onColorSelect, 
  onPatternSelect, 
  onClearAttribute,
  onSubmitGuess, 
  canSubmit, 
  disabled 
}: GameBoardProps) => {
  const currentRowIndex = guesses.findIndex(g => !g.isSubmitted);
  
  return (
    <div className="grid gap-2 p-4 max-w-2xl mx-auto">
      {guesses.slice(0, maxAttempts).map((guess, index) => (
        <GuessRow
          key={index}
          guess={guess}
          isCurrentRow={index === currentRowIndex}
          currentGuess={index === currentRowIndex ? currentGuess : undefined}
          onColorSelect={onColorSelect}
          onPatternSelect={onPatternSelect}
          onClearAttribute={onClearAttribute}
          isFutureRow={index > currentRowIndex && currentRowIndex >= 0}
        />
      ))}
      
      {/* Submit Button - only show for current row */}
      {currentRowIndex >= 0 && !disabled && (
        <div className="text-center mt-4">
          <button
            onClick={onSubmitGuess}
            disabled={!canSubmit}
            className={`px-8 py-3 rounded-lg font-semibold text-lg transition-all ${
              canSubmit
                ? 'bg-blue-500 hover:bg-blue-600 text-white shadow-md hover:shadow-lg transform hover:scale-105'
                : 'bg-gray-300 dark:bg-gray-600 text-gray-500 dark:text-gray-400 cursor-not-allowed'
            }`}
          >
            Submit Guess
          </button>
          {!canSubmit && (
            <p className="text-sm text-gray-500 dark:text-gray-400 mt-2">
              Please select primary color, secondary color, and pattern
            </p>
          )}
        </div>
      )}
    </div>
  );
};
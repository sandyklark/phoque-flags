import { ColorPicker } from './ColorPicker';
import { PatternSelector } from './PatternSelector';
import type { ColorPickerProps, PatternPickerProps } from '../types/game';

interface FlagInputsProps extends ColorPickerProps, Omit<PatternPickerProps, 'currentPattern'> {
  onSubmit: () => void;
  canSubmit: boolean;
}

export const FlagInputs = ({ 
  onColorSelect, 
  currentGuess, 
  disabled,
  onPatternSelect,
  onSubmit,
  canSubmit
}: FlagInputsProps) => {
  return (
    <div className="space-y-6">
      {/* Color Selection */}
      <div className="bg-gray-50 dark:bg-gray-900 rounded-lg p-4">
        <ColorPicker 
          onColorSelect={onColorSelect}
          currentGuess={currentGuess}
          disabled={disabled}
        />
      </div>

      {/* Pattern Selection */}
      <div className="bg-gray-50 dark:bg-gray-900 rounded-lg p-4">
        <PatternSelector
          onPatternSelect={onPatternSelect}
          currentPattern={currentGuess.pattern || null}
          disabled={disabled}
        />
      </div>

      {/* Submit Button */}
      <div className="text-center">
        <button
          onClick={onSubmit}
          disabled={!canSubmit || disabled}
          className={`px-8 py-3 rounded-lg font-semibold text-lg transition-all ${
            canSubmit && !disabled
              ? 'bg-blue-500 hover:bg-blue-600 text-white shadow-md hover:shadow-lg transform hover:scale-105'
              : 'bg-gray-300 dark:bg-gray-600 text-gray-500 dark:text-gray-400 cursor-not-allowed'
          }`}
        >
          Submit Guess
        </button>
        {!canSubmit && !disabled && (
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-2">
            Please select primary color, secondary color, and pattern
          </p>
        )}
      </div>
    </div>
  );
};
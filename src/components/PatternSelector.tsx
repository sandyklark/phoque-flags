import type { FlagPattern, PatternPickerProps } from '../types/game';
import gameOptions from '../data/gameOptions.json';

const patternInfo: Record<FlagPattern, { emoji: string; description: string }> = {
  'stripes': { emoji: '▦', description: 'General stripes' },
  'horizontal-stripes': { emoji: '≡', description: 'Horizontal stripes' },
  'vertical-stripes': { emoji: '⫸', description: 'Vertical stripes' },
  'cross': { emoji: '✝', description: 'Cross pattern' },
  'circle': { emoji: '●', description: 'Circle/dot' },
  'stars': { emoji: '✦', description: 'Star(s)' },
  'symbol': { emoji: '⚡', description: 'Symbol/emblem' },
  'diamond': { emoji: '◆', description: 'Diamond shape' },
  'triangle': { emoji: '▲', description: 'Triangle shape' },
  'complex': { emoji: '◈', description: 'Complex pattern' },
  'solid': { emoji: '■', description: 'Solid color' }
};

export const PatternSelector = ({ onPatternSelect, currentPattern, disabled }: PatternPickerProps) => {
  const patterns = gameOptions.patterns as FlagPattern[];

  return (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold text-center mb-4">
        Select Pattern {currentPattern && `(${currentPattern})`}
      </h3>
      
      <div className="grid grid-cols-2 gap-3">
        {patterns.map((pattern) => {
          const { emoji, description } = patternInfo[pattern];
          return (
            <button
              key={pattern}
              className={`p-3 rounded-lg border-2 transition-all text-left ${
                currentPattern === pattern
                  ? 'border-blue-500 bg-blue-50 dark:bg-blue-900'
                  : 'border-gray-300 dark:border-gray-600 hover:border-blue-300'
              } ${disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-800'}`}
              onClick={() => !disabled && onPatternSelect(pattern)}
              disabled={disabled}
              title={description}
            >
              <div className="flex items-center space-x-3">
                <span className="text-2xl">{emoji}</span>
                <div>
                  <div className="font-medium text-sm capitalize">{pattern.replace('-', ' ')}</div>
                  <div className="text-xs text-gray-500 dark:text-gray-400">{description}</div>
                </div>
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
};
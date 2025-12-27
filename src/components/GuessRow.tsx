import { AttributeTile } from './AttributeTile';
import { AttributeTileDropdown } from './AttributeTileDropdown';
import type { GuessRowProps, FlagAttribute, FlagColor, FlagPattern } from '../types/game';

export const GuessRow = ({ guess, isCurrentRow, currentGuess, onColorSelect, onPatternSelect, onClearAttribute, isFutureRow = false }: GuessRowProps) => {
  const getDisplayAttributes = (): FlagAttribute[] => {
    if (isCurrentRow && !guess.isSubmitted && currentGuess) {
      return [
        { 
          type: 'primaryColor', 
          value: currentGuess.primaryColor || null, 
          state: currentGuess.primaryColor ? 'filled' : 'empty' 
        },
        { 
          type: 'secondaryColor', 
          value: currentGuess.secondaryColor || null, 
          state: currentGuess.secondaryColor ? 'filled' : 'empty' 
        },
        { 
          type: 'tertiaryColor', 
          value: currentGuess.tertiaryColor || null, 
          state: currentGuess.tertiaryColor ? 'filled' : 'empty' 
        },
        { 
          type: 'pattern', 
          value: currentGuess.pattern || null, 
          state: currentGuess.pattern ? 'filled' : 'empty' 
        }
      ];
    }
    return guess.attributes;
  };

  // If this is the current row (active input row), render clickable tile dropdowns
  if (isCurrentRow && !guess.isSubmitted && currentGuess && onColorSelect && onPatternSelect && onClearAttribute) {
    return (
      <div className="flex gap-1 justify-center">
        <AttributeTileDropdown
          type="primaryColor"
          value={currentGuess.primaryColor || null}
          onChange={(color) => onColorSelect('primary', color as FlagColor)}
          onClear={() => onClearAttribute('primaryColor')}
        />
        <AttributeTileDropdown
          type="secondaryColor"
          value={currentGuess.secondaryColor || null}
          onChange={(color) => onColorSelect('secondary', color as FlagColor)}
          onClear={() => onClearAttribute('secondaryColor')}
        />
        <AttributeTileDropdown
          type="tertiaryColor"
          value={currentGuess.tertiaryColor || null}
          onChange={(color) => onColorSelect('tertiary', color as FlagColor)}
          onClear={() => onClearAttribute('tertiaryColor')}
          isOptional={true}
        />
        <AttributeTileDropdown
          type="pattern"
          value={currentGuess.pattern || null}
          onChange={(pattern) => onPatternSelect(pattern as FlagPattern)}
          onClear={() => onClearAttribute('pattern')}
        />
      </div>
    );
  }

  // For submitted rows, render AttributeTiles as before
  const attributes = getDisplayAttributes();

  return (
    <div className="flex gap-1 justify-center">
      {attributes.map((attribute, index) => (
        <AttributeTile
          key={`${attribute.type}-${index}`}
          attribute={attribute}
          animationDelay={guess.isSubmitted ? index * 100 : 0}
          isCurrentGuess={false}
          isFutureRow={isFutureRow}
        />
      ))}
    </div>
  );
};
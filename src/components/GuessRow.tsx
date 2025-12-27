import { AttributeTile } from './AttributeTile';
import type { GuessRowProps, FlagAttribute } from '../types/game';

export const GuessRow = ({ guess, isCurrentRow, currentGuess }: GuessRowProps) => {
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

  const attributes = getDisplayAttributes();

  return (
    <div className="flex gap-2 justify-center">
      {attributes.map((attribute, index) => (
        <AttributeTile
          key={`${attribute.type}-${index}`}
          attribute={attribute}
          animationDelay={guess.isSubmitted ? index * 100 : 0}
          isCurrentGuess={isCurrentRow && !guess.isSubmitted}
        />
      ))}
    </div>
  );
};
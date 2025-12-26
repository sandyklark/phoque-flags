import { KeyButton } from './KeyButton';
import type { KeyboardProps } from '../types/game';

const KEYBOARD_ROWS = [
  ['Q', 'W', 'E', 'R', 'T', 'Y', 'U', 'I', 'O', 'P'],
  ['A', 'S', 'D', 'F', 'G', 'H', 'J', 'K', 'L'],
  ['ENTER', 'Z', 'X', 'C', 'V', 'B', 'N', 'M', 'BACKSPACE'],
];

export const Keyboard = ({ onKeyPress, keyboardState, disabled }: KeyboardProps) => {
  const handleKeyClick = (key: string) => {
    if (disabled) return;
    onKeyPress(key);
  };

  const formatKeyLabel = (key: string) => {
    switch (key) {
      case 'BACKSPACE':
        return '⌫';
      case 'ENTER':
        return 'ENTER';
      default:
        return key;
    }
  };

  return (
    <div className="flex flex-col gap-2 p-4 max-w-lg mx-auto">
      {KEYBOARD_ROWS.map((row, rowIndex) => (
        <div key={rowIndex} className="flex gap-1 justify-center">
          {row.map((key) => (
            <KeyButton
              key={key}
              letter={formatKeyLabel(key)}
              state={keyboardState[key]}
              onClick={() => handleKeyClick(key)}
              isWide={key === 'ENTER' || key === 'BACKSPACE'}
              disabled={disabled}
            />
          ))}
        </div>
      ))}
    </div>
  );
};
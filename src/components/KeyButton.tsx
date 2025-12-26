import type { LetterState } from '../types/game';

interface KeyButtonProps {
  letter: string;
  state?: LetterState;
  onClick: () => void;
  isWide?: boolean;
  disabled?: boolean;
}

export const KeyButton = ({ letter, state, onClick, isWide = false, disabled = false }: KeyButtonProps) => {
  const getStateClass = () => {
    switch (state) {
      case 'correct':
        return 'correct';
      case 'present':
        return 'present';
      case 'absent':
        return 'absent';
      default:
        return '';
    }
  };

  return (
    <button
      className={`key-button ${getStateClass()} ${isWide ? 'wide' : ''} ${disabled ? 'opacity-50 cursor-not-allowed' : ''}`}
      onClick={onClick}
      disabled={disabled}
    >
      {letter}
    </button>
  );
};
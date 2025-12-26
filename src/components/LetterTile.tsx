import type { LetterTileProps } from '../types/game';

export const LetterTile = ({ letter, animationDelay = 0, isCurrentGuess = false }: LetterTileProps) => {
  const getStateClasses = () => {
    switch (letter.state) {
      case 'correct':
        return 'correct';
      case 'present':
        return 'present';
      case 'absent':
        return 'absent';
      case 'filled':
        return 'filled';
      default:
        return 'empty';
    }
  };

  return (
    <div 
      className={`letter-tile ${getStateClasses()} ${isCurrentGuess ? 'animate-pop' : ''}`}
      style={{ 
        animationDelay: `${animationDelay}ms`,
        transform: letter.state !== 'empty' && letter.state !== 'filled' ? 'rotateY(0deg)' : undefined
      }}
    >
      {letter.value}
    </div>
  );
};
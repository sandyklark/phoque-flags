import type { AttributeTileProps, FlagColor, FlagPattern } from '../types/game';

const colorStyles: Record<FlagColor, string> = {
  red: 'bg-red-500',
  blue: 'bg-blue-500',
  white: 'bg-white border border-gray-400',
  green: 'bg-green-500',
  yellow: 'bg-yellow-400',
  black: 'bg-black',
  orange: 'bg-orange-500',
  purple: 'bg-purple-500',
  pink: 'bg-pink-500',
  brown: 'bg-amber-800',
  gray: 'bg-gray-500'
};

const patternEmojis: Record<FlagPattern, string> = {
  'stripes': '▦',
  'horizontal-stripes': '≡',
  'vertical-stripes': '⫸',
  'cross': '✝',
  'circle': '●',
  'stars': '✦',
  'symbol': '⚡',
  'diamond': '◆',
  'triangle': '▲',
  'complex': '◈',
  'solid': '■'
};

export const AttributeTile = ({ attribute, animationDelay = 0, isCurrentGuess = false }: AttributeTileProps) => {
  const getStateClasses = () => {
    switch (attribute.state) {
      case 'correct':
        return 'bg-green-500 text-white border-green-600';
      case 'present':
        return 'bg-yellow-500 text-white border-yellow-600';
      case 'absent':
        return 'bg-gray-400 text-white border-gray-500';
      case 'filled':
        return 'bg-blue-100 border-blue-300 text-gray-800';
      default:
        return 'bg-gray-100 border-gray-300 text-gray-500';
    }
  };

  const getContent = () => {
    if (!attribute.value) {
      return (
        <div className="text-xs opacity-60">
          {attribute.type === 'pattern' ? 'Pattern' : 
           attribute.type === 'primaryColor' ? '1st' :
           attribute.type === 'secondaryColor' ? '2nd' : '3rd'}
        </div>
      );
    }

    if (attribute.type === 'pattern') {
      return (
        <div className="flex flex-col items-center">
          <span className="text-lg">{patternEmojis[attribute.value as FlagPattern]}</span>
          <span className="text-xs opacity-80 capitalize">{(attribute.value as string).replace('-', ' ')}</span>
        </div>
      );
    } else {
      // Color attribute
      return (
        <div className="flex flex-col items-center space-y-1">
          <div 
            className={`w-6 h-6 rounded-full ${colorStyles[attribute.value as FlagColor]} ${
              attribute.value === 'white' ? 'border border-gray-400' : ''
            }`}
          />
          <span className="text-xs opacity-80 capitalize">{attribute.value}</span>
        </div>
      );
    }
  };

  return (
    <div 
      className={`
        attribute-tile w-20 h-20 flex flex-col items-center justify-center rounded-lg border-2 transition-all duration-300
        ${getStateClasses()} 
        ${isCurrentGuess ? 'animate-pulse' : ''}
      `}
      style={{ 
        animationDelay: `${animationDelay}ms`,
        transform: attribute.state !== 'empty' && attribute.state !== 'filled' ? 'rotateY(0deg)' : undefined
      }}
    >
      {getContent()}
    </div>
  );
};
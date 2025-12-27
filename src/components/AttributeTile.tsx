import type { AttributeTileProps, FlagColor, FlagPattern } from '../types/game';
import { 
  GripHorizontal, 
  GripVertical, 
  Plus, 
  Circle, 
  Star, 
  Shapes, 
  Diamond, 
  Triangle, 
  Layers, 
  Square,
  TrendingUp,
  Grip
} from 'lucide-react';

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

const patternIcons: Record<FlagPattern, React.ComponentType<any>> = {
  'stripes': Grip,
  'horizontal-stripes': GripHorizontal,
  'vertical-stripes': GripVertical,
  'cross': Plus,
  'circle': Circle,
  'stars': Star,
  'symbol': Shapes,
  'diamond': Diamond,
  'triangle': Triangle,
  'complex': Layers,
  'solid': Square,
  'diagonal': TrendingUp
};

export const AttributeTile = ({ attribute, animationDelay = 0, isCurrentGuess = false, isFutureRow = false }: AttributeTileProps) => {
  const getStateClasses = () => {
    // If it's a future row, make it grayed out regardless of state
    if (isFutureRow) {
      return 'bg-gray-200 dark:bg-gray-700 border-gray-300 dark:border-gray-600 text-gray-400 dark:text-gray-500';
    }

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
      const PatternIcon = patternIcons[attribute.value as FlagPattern];
      return (
        <div className="flex items-center justify-center w-full h-full">
          <PatternIcon size={20} />
        </div>
      );
    } else {
      // Color attribute
      return (
        <div className="flex items-center justify-center w-full h-full">
          <div 
            className={`w-8 h-8 rounded-full ${colorStyles[attribute.value as FlagColor]} ${
              attribute.value === 'white' ? 'border border-gray-400' : ''
            }`}
          />
        </div>
      );
    }
  };

  return (
    <div 
      className={`
        attribute-tile w-16 h-16 flex flex-col items-center justify-center rounded-lg border-2 transition-all duration-300
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
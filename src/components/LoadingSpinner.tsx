interface LoadingSpinnerProps {
  size?: 'small' | 'medium' | 'large';
  className?: string;
}

export const LoadingSpinner = ({ size = 'medium', className = '' }: LoadingSpinnerProps) => {
  const sizeClasses = {
    small: 'w-4 h-4',
    medium: 'w-8 h-8', 
    large: 'w-12 h-12'
  };

  return (
    <div className={`${sizeClasses[size]} ${className}`}>
      <div className="relative">
        {/* Spinning seal emoji */}
        <div className="absolute inset-0 animate-spin">
          <div className="w-full h-full flex items-center justify-center text-lg">
            🦭
          </div>
        </div>
        {/* Subtle background circle */}
        <div className="w-full h-full border-2 border-gray-200 dark:border-gray-700 border-t-blue-500 rounded-full animate-spin opacity-50"></div>
      </div>
    </div>
  );
};
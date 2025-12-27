import { useState } from 'react';
import { getFlagUrl, validateCountryCode } from '../utils/flagHelpers';
import { LoadingSpinner } from './LoadingSpinner';

interface FlagIconProps {
  countryCode: string;
  size?: number;
  className?: string;
}

export const FlagIcon = ({ countryCode, size = 48, className = '' }: FlagIconProps) => {
  const [isLoading, setIsLoading] = useState(true);
  const [hasError, setHasError] = useState(false);
  
  // Validate country code and get flag URL
  const isValidCode = validateCountryCode(countryCode);
  const flagUrl = getFlagUrl(countryCode);
  
  // Warn about potentially unsupported country codes
  if (!isValidCode) {
    console.warn(`Country code "${countryCode}" not in supported list - flag may not display`);
  }
  
  return (
    <div 
      className={`relative inline-block ${className}`}
      style={{ width: size, height: size * 0.67 }}
    >
      {isLoading && !hasError && (
        <div className="absolute inset-0 flex items-center justify-center bg-gray-100 dark:bg-gray-700 rounded">
          <LoadingSpinner size="small" />
        </div>
      )}
      
      {!hasError && (
        <img 
          src={flagUrl}
          alt={`Flag of ${countryCode}`}
          className={`rounded shadow-sm ${isLoading ? 'opacity-0' : 'opacity-100'} transition-opacity duration-200`}
          style={{ width: size, height: size * 0.67 }}
          loading="lazy"
          decoding="async"
          onLoad={() => setIsLoading(false)}
          onError={() => {
            setIsLoading(false);
            setHasError(true);
            if (process.env.NODE_ENV === 'development') {
              console.warn(`Flag image failed to load for country code: ${countryCode}`);
            }
          }}
        />
      )}
      
      {hasError && (
        <div 
          className="flex items-center justify-center bg-gray-200 dark:bg-gray-600 rounded"
          style={{ width: size, height: size * 0.67 }}
        >
          <span className="text-xs text-gray-500">{countryCode.toUpperCase()}</span>
        </div>
      )}
    </div>
  );
};
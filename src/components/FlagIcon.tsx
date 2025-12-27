import { getFlagUrl, validateCountryCode } from '../utils/flagHelpers';

interface FlagIconProps {
  countryCode: string;
  size?: number;
  className?: string;
}

export const FlagIcon = ({ countryCode, size = 48, className = '' }: FlagIconProps) => {
  // Validate country code and get flag URL
  const isValidCode = validateCountryCode(countryCode);
  const flagUrl = getFlagUrl(countryCode);
  
  // Warn about potentially unsupported country codes
  if (!isValidCode) {
    console.warn(`Country code "${countryCode}" not in supported list - flag may not display`);
  }
  
  return (
    <>
      <img 
        src={flagUrl}
        alt={`Flag of ${countryCode}`}
        className={`rounded shadow-sm ${className}`}
        style={{ width: size, height: size * 0.67 }}
        onError={(e) => {
          // Fallback if image fails to load
          console.warn(`Flag image failed to load for country code: ${countryCode}`);
          const target = e.target as HTMLImageElement;
          target.style.display = 'none';
          const fallback = target.nextElementSibling as HTMLDivElement;
          if (fallback) {
            fallback.style.display = 'flex';
          }
        }}
      />
      <div 
        className={`hidden items-center justify-center bg-gray-200 dark:bg-gray-600 rounded ${className}`}
        style={{ width: size, height: size * 0.67 }}
      >
        <span className="text-xs text-gray-500">{countryCode.toUpperCase()}</span>
      </div>
    </>
  );
};
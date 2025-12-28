import flagsData from '../data/flags.json';
import '../styles/SealParade.css';

export const SealParade = () => {
  // Extract all flag emojis from the data
  const flagEmojis = flagsData.map(flag => flag.flagEmoji);
  
  return (
    <div className="seal-parade-container">
      {/* Seal leader */}
      <div 
        className="seal-leader"
        style={{ animationDelay: '0s' }}
      >
        <span 
          className="pulse-emoji" 
          style={{ animationDelay: '0s' }}
        >
          🦭
        </span>
      </div>
      
      {/* Flag followers */}
      {flagEmojis.map((flagEmoji, index) => (
        <div
          key={`flag-${index}`}
          className="flag-follower"
          style={{ 
            animationDelay: `${(index + 1) * 0.2}s` 
          }}
        >
          <span 
            className="pulse-emoji"
            style={{ 
              animationDelay: `${(index + 1) * 0.1}s` 
            }}
          >
            {flagEmoji}
          </span>
        </div>
      ))}
    </div>
  );
};
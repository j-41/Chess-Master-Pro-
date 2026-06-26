import React from 'react';

interface EvalBarProps {
  score: number; // in centipawns from white's perspective. Mate in N is handled usually by large numbers.
  mate: boolean;
  flipped: boolean;
  animate?: boolean;
}

const EvalBar: React.FC<EvalBarProps> = ({ score, mate, flipped, animate = true }) => {
  // Clamp score between -1000 and 1000 for visual representation (roughly +/- 10 pawns)
  // Non-linear scaling: small advantages show more movement than large ones
  
  // Calculate percentage of white (0 to 100)
  let whitePercentage = 50;
  
  if (mate) {
    whitePercentage = score > 0 ? 100 : 0;
  } else {
    // Math to make evaluation visually similar to chess.com
    // 0 = 50%, 100 cp = ~60%, 300 cp = ~75%, 500 cp = ~85%, >1000 = ~95%
    const normalized = Math.max(-1000, Math.min(1000, score));
    const sign = Math.sign(normalized);
    const abs = Math.abs(normalized);
    
    // Formula: 50 + sign * 50 * (1 - e^(-abs/400))
    whitePercentage = 50 + sign * 50 * (1 - Math.exp(-abs / 400));
  }
  
  // If board is flipped (black at bottom), reverse the display
  const displayPercentage = flipped ? 100 - whitePercentage : whitePercentage;
  
  // Format score for text display
  let scoreText = '';
  if (mate) {
    const movesToMate = Math.abs(score) / 10000; // Assuming we passed mate in N encoded like this
    scoreText = `M${Math.round(movesToMate) || 1}`;
  } else {
    // Show centipawns as pawns (e.g. 1.25)
    scoreText = Math.abs(score / 100).toFixed(1);
  }
  
  const isWhiteAdvantage = score >= 0;
  
  return (
    <div style={{
      width: '24px',
      height: '100%',
      backgroundColor: 'var(--eval-black)',
      borderRadius: 'var(--radius-sm)',
      overflow: 'hidden',
      position: 'relative',
      boxShadow: 'var(--shadow-sm)',
      border: '1px solid var(--border-light)',
    }}>
      {/* White Bar */}
      <div style={{
        position: 'absolute',
        bottom: 0,
        left: 0,
        width: '100%',
        height: `${displayPercentage}%`,
        backgroundColor: 'var(--eval-white)',
        transition: animate ? 'height 0.5s cubic-bezier(0.4, 0, 0.2, 1)' : 'none',
      }} />
      
      {/* Score Text */}
      <div style={{
        position: 'absolute',
        width: '100%',
        textAlign: 'center',
        fontSize: '11px',
        fontWeight: 'bold',
        color: (isWhiteAdvantage && !flipped) || (!isWhiteAdvantage && flipped) ? 'var(--eval-black)' : 'var(--eval-white)',
        paddingTop: '4px',
        paddingBottom: '4px',
        ...(isWhiteAdvantage && !flipped || !isWhiteAdvantage && flipped 
          ? { bottom: 0 } 
          : { top: 0 }
        )
      }}>
        {scoreText}
      </div>
    </div>
  );
};

export default EvalBar;

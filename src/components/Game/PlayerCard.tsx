import React from 'react';
import { Chess, type Color } from 'chess.js';
import GameClock from './GameClock';
import CapturedPieces from './CapturedPieces';
import { UserProfile } from '../../context/AuthContext';

interface PlayerCardProps {
  player: UserProfile | { username: string; rating?: number; isAI?: boolean };
  color: Color;
  game: Chess;
  timeMs: number;
  incrementMs: number;
  isActive: boolean;
  gameStarted: boolean;
  onTimeUp: (color: Color) => void;
  isBottom?: boolean;
}

const PlayerCard: React.FC<PlayerCardProps> = ({
  player,
  color,
  game,
  timeMs,
  incrementMs,
  isActive,
  gameStarted,
  onTimeUp,
  isBottom = false,
}) => {
  // Simple avatar generation based on username
  const getAvatarColor = (name: string) => {
    let hash = 0;
    for (let i = 0; i < name.length; i++) {
      hash = name.charCodeAt(i) + ((hash << 5) - hash);
    }
    const hue = hash % 360;
    return `hsl(${hue}, 70%, 40%)`;
  };

  const isAI = 'isAI' in player && player.isAI;

  return (
    <div style={{
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      padding: 'var(--space-2) 0',
      opacity: isActive ? 1 : 0.8,
      transition: 'opacity var(--transition-fast)',
    }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-3)' }}>
        {/* Avatar */}
        <div style={{
          width: '40px',
          height: '40px',
          borderRadius: 'var(--radius-sm)',
          backgroundColor: isAI ? '#2c2c2c' : getAvatarColor(player.username),
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          color: 'white',
          fontWeight: 'bold',
          fontSize: 'var(--fs-lg)',
          boxShadow: 'var(--shadow-sm)',
          backgroundImage: isAI ? 'url("/bot-avatar.png")' : 'none',
          backgroundSize: 'cover',
        }}>
          {!isAI && player.username.charAt(0).toUpperCase()}
          {isAI && '🤖'}
        </div>

        {/* Info */}
        <div style={{ display: 'flex', flexDirection: 'column' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-2)' }}>
            <span style={{ 
              fontWeight: 'var(--fw-semibold)', 
              color: 'var(--text-primary)',
              fontSize: 'var(--fs-md)',
            }}>
              {player.username}
            </span>
            {player.rating && (
              <span style={{ 
                color: 'var(--text-secondary)',
                fontSize: 'var(--fs-sm)',
              }}>
                ({player.rating})
              </span>
            )}
          </div>
          <div style={{ height: '20px' }}>
            <CapturedPieces game={game} color={color} />
          </div>
        </div>
      </div>

      {/* Clock */}
      <GameClock
        timeMs={timeMs}
        incrementMs={incrementMs}
        isActive={isActive}
        color={color}
        gameStarted={gameStarted}
        onTimeUp={onTimeUp}
      />
    </div>
  );
};

export default PlayerCard;

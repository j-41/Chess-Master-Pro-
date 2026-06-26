import React from 'react';
import { UserProfile } from '../../context/AuthContext';
import { EloResult } from '../../engine/EloSystem';

interface GameOverModalProps {
  result: 'win' | 'loss' | 'draw';
  reason: string;
  playerColor: 'w' | 'b';
  winnerColor: 'w' | 'b' | null;
  player: UserProfile | { username: string };
  opponent: UserProfile | { username: string };
  eloResult?: EloResult;
  onRematch: () => void;
  onNewGame: () => void;
  onAnalyze: () => void;
  onClose: () => void;
}

const GameOverModal: React.FC<GameOverModalProps> = ({
  result,
  reason,
  playerColor,
  winnerColor,
  player,
  opponent,
  eloResult,
  onRematch,
  onNewGame,
  onAnalyze,
  onClose,
}) => {
  
  const getTitle = () => {
    if (result === 'win') return 'You Won!';
    if (result === 'loss') return 'You Lost';
    return 'Draw';
  };

  const getTitleColor = () => {
    if (result === 'win') return 'var(--color-success)';
    if (result === 'loss') return 'var(--color-error)';
    return 'var(--text-secondary)';
  };

  return (
    <div style={{
      position: 'fixed',
      inset: 0,
      backgroundColor: 'var(--surface-overlay)',
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      zIndex: 'var(--z-modal)',
      animation: 'fadeIn var(--transition-base)',
    }}>
      <div className="card" style={{
        width: '90%',
        maxWidth: '400px',
        padding: 'var(--space-6)',
        display: 'flex',
        flexDirection: 'column',
        gap: 'var(--space-4)',
        animation: 'scaleIn var(--transition-spring)',
        position: 'relative',
      }}>
        <button 
          onClick={onClose}
          style={{
            position: 'absolute',
            top: 'var(--space-3)',
            right: 'var(--space-3)',
            fontSize: 'var(--fs-lg)',
            color: 'var(--text-tertiary)',
          }}
        >
          ✕
        </button>

        <div style={{ textAlign: 'center' }}>
          <h2 style={{ 
            fontSize: 'var(--fs-3xl)', 
            color: getTitleColor(),
            margin: '0 0 var(--space-2) 0'
          }}>
            {getTitle()}
          </h2>
          <p style={{ color: 'var(--text-secondary)', margin: 0 }}>
            {reason}
          </p>
        </div>

        {/* Player vs Opponent */}
        <div style={{ 
          display: 'flex', 
          justifyContent: 'space-between', 
          alignItems: 'center',
          backgroundColor: 'var(--bg-secondary)',
          padding: 'var(--space-4)',
          borderRadius: 'var(--radius-md)',
        }}>
          <div style={{ textAlign: 'center', flex: 1 }}>
            <div style={{ fontWeight: 'bold' }}>{player.username}</div>
            {eloResult && (
              <div style={{ 
                color: eloResult.playerChange >= 0 ? 'var(--color-success)' : 'var(--color-error)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '4px'
              }}>
                {eloResult.newPlayerRating}
                <span style={{ fontSize: 'var(--fs-sm)' }}>
                  ({eloResult.playerChange >= 0 ? '+' : ''}{eloResult.playerChange})
                </span>
              </div>
            )}
          </div>
          <div style={{ color: 'var(--text-tertiary)', fontWeight: 'bold' }}>VS</div>
          <div style={{ textAlign: 'center', flex: 1 }}>
            <div style={{ fontWeight: 'bold' }}>{opponent.username}</div>
            {eloResult && (
              <div style={{ 
                color: eloResult.opponentChange >= 0 ? 'var(--color-success)' : 'var(--color-error)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '4px'
              }}>
                {eloResult.newOpponentRating}
                <span style={{ fontSize: 'var(--fs-sm)' }}>
                  ({eloResult.opponentChange >= 0 ? '+' : ''}{eloResult.opponentChange})
                </span>
              </div>
            )}
          </div>
        </div>

        {/* Actions */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-2)', marginTop: 'var(--space-2)' }}>
          <button className="btn btn-primary btn-lg" onClick={onRematch}>
            Rematch
          </button>
          <div style={{ display: 'flex', gap: 'var(--space-2)' }}>
            <button className="btn btn-secondary" style={{ flex: 1 }} onClick={onNewGame}>
              New Game
            </button>
            <button className="btn btn-secondary" style={{ flex: 1 }} onClick={onAnalyze}>
              Game Review
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default GameOverModal;

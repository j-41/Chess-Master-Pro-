import React from 'react';

interface GameControlsProps {
  onResign: () => void;
  onDrawOffer: () => void;
  onFlipBoard: () => void;
  canResign: boolean;
  canOfferDraw: boolean;
}

const GameControls: React.FC<GameControlsProps> = ({
  onResign,
  onDrawOffer,
  onFlipBoard,
  canResign,
  canOfferDraw,
}) => {
  return (
    <div style={{
      display: 'flex',
      gap: 'var(--space-2)',
      padding: 'var(--space-3)',
      borderTop: '1px solid var(--border-light)',
      backgroundColor: 'var(--bg-secondary)',
    }}>
      <button 
        className="btn btn-secondary" 
        onClick={onDrawOffer}
        disabled={!canOfferDraw}
        style={{ flex: 1 }}
        title="Offer Draw"
      >
        ½
      </button>
      <button 
        className="btn btn-secondary" 
        onClick={onResign}
        disabled={!canResign}
        style={{ flex: 1, color: 'var(--color-error)' }}
        title="Resign"
      >
        ⚐
      </button>
      <button 
        className="btn btn-secondary" 
        onClick={onFlipBoard}
        style={{ flex: 1 }}
        title="Flip Board"
      >
        ⇅
      </button>
    </div>
  );
};

export default GameControls;

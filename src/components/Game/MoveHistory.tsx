import React, { useEffect, useRef } from 'react';
import { Chess } from 'chess.js';
import './MoveHistory.css';

interface MoveHistoryProps {
  game: Chess;
  currentMoveIndex: number;
  onMoveClick: (index: number) => void;
}

const MoveHistory: React.FC<MoveHistoryProps> = ({ game, currentMoveIndex, onMoveClick }) => {
  const history = game.history({ verbose: true });
  const scrollRef = useRef<HTMLDivElement>(null);

  // Group moves into pairs (White, Black)
  const movePairs: Array<{ white: any; black: any | null; index: number }> = [];
  for (let i = 0; i < history.length; i += 2) {
    movePairs.push({
      white: history[i],
      black: i + 1 < history.length ? history[i + 1] : null,
      index: Math.floor(i / 2) + 1,
    });
  }

  // Auto-scroll to the bottom when new moves are added
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [history.length, currentMoveIndex]);

  return (
    <div className="move-history-container glass">
      <div className="move-history-header">
        <h3>Move History</h3>
      </div>
      
      <div className="move-history-list" ref={scrollRef}>
        {movePairs.length === 0 ? (
          <div className="empty-history">Game has not started</div>
        ) : (
          movePairs.map((pair, i) => {
            const whiteIndex = i * 2;
            const blackIndex = i * 2 + 1;
            
            return (
              <div key={pair.index} className="move-row">
                <div className="move-number">{pair.index}.</div>
                
                <div 
                  className={`move-cell ${currentMoveIndex === whiteIndex ? 'active' : ''}`}
                  onClick={() => onMoveClick(whiteIndex)}
                >
                  {/* Icon for pieces other than pawn */}
                  {pair.white.piece !== 'p' && (
                    <span className="piece-icon" data-piece={pair.white.piece.toUpperCase()} />
                  )}
                  {pair.white.san}
                </div>
                
                {pair.black ? (
                  <div 
                    className={`move-cell ${currentMoveIndex === blackIndex ? 'active' : ''}`}
                    onClick={() => onMoveClick(blackIndex)}
                  >
                    {pair.black.piece !== 'p' && (
                      <span className="piece-icon black" data-piece={pair.black.piece.toUpperCase()} />
                    )}
                    {pair.black.san}
                  </div>
                ) : (
                  <div className="move-cell empty"></div>
                )}
              </div>
            );
          })
        )}
      </div>
      
      {/* Navigation Controls */}
      <div className="move-history-controls">
        <button 
          className="btn-icon btn-ghost" 
          onClick={() => onMoveClick(-1)}
          disabled={currentMoveIndex === -1}
          title="Go to start"
        >
          ⏮
        </button>
        <button 
          className="btn-icon btn-ghost" 
          onClick={() => onMoveClick(Math.max(-1, currentMoveIndex - 1))}
          disabled={currentMoveIndex === -1}
          title="Previous move"
        >
          ◀
        </button>
        <button 
          className="btn-icon btn-ghost" 
          onClick={() => onMoveClick(Math.min(history.length - 1, currentMoveIndex + 1))}
          disabled={currentMoveIndex === history.length - 1}
          title="Next move"
        >
          ▶
        </button>
        <button 
          className="btn-icon btn-ghost" 
          onClick={() => onMoveClick(history.length - 1)}
          disabled={currentMoveIndex === history.length - 1}
          title="Go to end"
        >
          ⏭
        </button>
      </div>
    </div>
  );
};

export default MoveHistory;

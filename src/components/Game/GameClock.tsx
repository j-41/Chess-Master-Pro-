import React, { useEffect, useState, useRef } from 'react';
import { soundManager } from '../../audio/SoundManager';

interface GameClockProps {
  timeMs: number; // initial time in milliseconds
  incrementMs: number; // increment in milliseconds
  isActive: boolean;
  color: 'w' | 'b';
  onTimeUp: (color: 'w' | 'b') => void;
  gameStarted: boolean;
}

const GameClock: React.FC<GameClockProps> = ({ 
  timeMs, 
  incrementMs, 
  isActive, 
  color,
  onTimeUp,
  gameStarted 
}) => {
  const [timeLeft, setTimeLeft] = useState(timeMs);
  const [isLowTime, setIsLowTime] = useState(false);
  const lastUpdateRef = useRef<number>(Date.now());
  const animationFrameRef = useRef<number>(0);

  // Reset clock when initial time changes
  useEffect(() => {
    setTimeLeft(timeMs);
    setIsLowTime(timeMs <= 20000);
  }, [timeMs]);

  // Tick the clock
  useEffect(() => {
    if (isActive && gameStarted) {
      lastUpdateRef.current = Date.now();
      
      const tick = () => {
        const now = Date.now();
        const delta = now - lastUpdateRef.current;
        lastUpdateRef.current = now;
        
        setTimeLeft(prev => {
          const newTime = Math.max(0, prev - delta);
          
          if (newTime <= 20000 && prev > 20000) {
            setIsLowTime(true);
            soundManager.lowTime();
          }
          
          if (newTime === 0 && prev > 0) {
            onTimeUp(color);
          }
          
          return newTime;
        });
        
        animationFrameRef.current = requestAnimationFrame(tick);
      };
      
      animationFrameRef.current = requestAnimationFrame(tick);
    }
    
    return () => {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, [isActive, gameStarted, color, onTimeUp]);

  // Add increment when turn ends
  useEffect(() => {
    if (!isActive && gameStarted && timeLeft > 0 && timeLeft < timeMs) {
      setTimeLeft(prev => prev + incrementMs);
    }
  }, [isActive, gameStarted, incrementMs, timeMs]);

  const formatTime = (ms: number) => {
    const totalSeconds = Math.ceil(ms / 1000);
    const minutes = Math.floor(totalSeconds / 60);
    const seconds = totalSeconds % 60;
    
    if (minutes > 0) {
      return `${minutes}:${seconds.toString().padStart(2, '0')}`;
    } else {
      // Under a minute, show tenths of a second if under 20s
      if (ms <= 20000) {
        const secs = Math.floor(ms / 1000);
        const tenths = Math.floor((ms % 1000) / 100);
        return `${secs}.${tenths}`;
      }
      return `${seconds.toString().padStart(2, '0')}`;
    }
  };

  return (
    <div 
      className={`game-clock ${isActive ? 'active' : ''} ${isLowTime ? 'low-time animate-pulse' : ''}`}
      style={{
        padding: '8px 16px',
        backgroundColor: isActive ? 'var(--bg-elevated)' : 'var(--bg-secondary)',
        color: isLowTime ? 'var(--color-error)' : (isActive ? 'var(--text-primary)' : 'var(--text-tertiary)'),
        borderRadius: 'var(--radius-md)',
        fontFamily: 'var(--font-mono)',
        fontSize: 'var(--fs-xl)',
        fontWeight: 'var(--fw-bold)',
        textAlign: 'center',
        minWidth: '90px',
        boxShadow: isActive ? '0 0 0 2px var(--accent-primary) inset' : 'none',
        transition: 'all var(--transition-fast)',
      }}
    >
      {formatTime(timeLeft)}
    </div>
  );
};

export default GameClock;
